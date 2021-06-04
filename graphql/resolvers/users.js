const User = require("../../models/User");

module.exports = {
  Query: {
    async getUsers() {
      try {
        const Users = await User.find().sort({ createdAt: -1 });
        return Users;
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  //to do- figure out register logics

  Mutation: {
    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      //TODO: Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //TODO: Make sure user doesnt already exists
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      //TODO: hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
