const PostModel = require("../models/Posts.model");
const CreatorModel = require("../models/Creators.model");
const { hash, compare } = require("bcrypt");
const {
  UserInputError,
  AuthenticationError,
} = require("apollo-server-express");
const { writeFileSync } = require("fs");

const resolvers = {
  Query: {
    allCreators: async () => {
      return await CreatorModel.find();
    },
    getCreator: async (_, args) => {
      const { id } = args;
      const exists = await CreatorModel.findById(id);
      if (!exists) {
        throw new UserInputError(`Creator with ID: ${id} not found !`);
      }
      return exists;
    },
    allPosts: async () => {
      return await PostModel.find();
    },
    getPost: async (_, args) => {
      const { id } = args;
      const exists = await PostModel.findById(id);
      if (!exists) {
        throw new UserInputError(`Post with ID: ${id} not found !`);
      }
      return exists;
    },
    getPostsByCreator: async (_, args) => {
      const { id } = args;
      const creator = await CreatorModel.findById(id);
      /* console.log(creators); */
      if (!creator) {
        throw new UserInputError(`Creator with ID: ${id} not found !`);
      }
      const postsbyCreator = await PostModel.find({
        creator: { $in: creator._id },
      });
      return postsbyCreator;
    },
  },
  Mutation: {
    registerCreator: async (parent, args, context) => {
      /* console.log(context); */
      const { fullname, username, email, password } = args.creator;
      const exists = await CreatorModel.findOne({ email: email });

      if (exists) {
        throw new UserInputError(`Email ${email} already exists`);
      }

      const hashed = await hash(password, 16);

      const user = new CreatorModel({
        fullname,
        username,
        email,
        password: hashed,
        ip_address: context.ip,
        user_agent: context.get("User-Agent"),
      });
      return await user.save();
    },
    loginCreator: async (_, args) => {
      const { email, password } = args.credentials;
      if (email === "" || password === "") {
        throw new UserInputError("Email & Password is required");
      }
      const Creator = await CreatorModel.findOne({ email: email });
      if (!Creator) {
        throw new AuthenticationError(`Creator with Email ${email} not found`);
      }
      const isValidPass = await compare(password, Creator.password);
      if (!isValidPass) {
        throw new AuthenticationError("Incorrect Email or Password");
      }
      return Creator;
    },
    updateCreator: async (parent, args) => {
      const { id } = args;
      const { fullname, username, email, password } = args.updates;
      let persistedUpdates = {};
      fullname !== undefined
        ? (persistedUpdates.fullname = fullname)
        : fullname;
      username !== undefined
        ? (persistedUpdates.username = username)
        : username;
      email !== undefined ? (persistedUpdates.email = email) : email;
      password !== undefined
        ? (persistedUpdates.password = password)
        : password;

      return await CreatorModel.findByIdAndUpdate(id, persistedUpdates, {
        new: true,
      });
    },
    deleteCreator: async (parent, args) => {
      const { id } = args;
      const exists = CreatorModel.findOne(id);
      if (!exists) {
        throw new UserInputError(`Creator with this ID ${id} not found`);
      }
      await CreatorModel.findByIdAndRemove(id);
      return `Creator with ID : ${id} Deleted`;
    },
    createPost: async (parent, args) => {
      const { title, image, content, creator } = args.post;
      const post = new PostModel({
        title,
        image,
        content,
        creator,
      });
      return await post.save();
    },
    editPost: async (parent, args) => {
      const { id } = args;
      const { title, image, content } = args.updates;
      let persistedUpdates = {};
      title !== undefined ? (persistedUpdates.title = title) : fullname;
      image !== undefined ? (persistedUpdates.image = image) : image;
      content !== undefined ? (persistedUpdates.content = content) : content;

      return await PostModel.findByIdAndUpdate(id, persistedUpdates, {
        new: true,
      });
    },
    deletePost: async (parent, args) => {
      const { id } = args;
      const exists = PostModel.findOne(id);
      if (!exists) {
        throw new UserInputError(`Post with this ID ${id} not found`);
      }
      await PostModel.findByIdAndRemove(id);
      return `Creator with ID : ${id} Deleted ✅`;
    },
  },
};

module.exports = resolvers;
