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
};
