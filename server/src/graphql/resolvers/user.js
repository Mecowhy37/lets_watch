import db from "../../../db";
import bcrypt from "bcryptjs";
import { registerValidate } from "../validators";
import { issueTokens } from "../../functions/auth";

export default {
  Query: {
    users: () => {},
    profile: () => {},
    login: () => {},
    refreshToken: () => {},
  },
  Mutation: {
    register: async (root, args, { req }, info) => {
      //TODO: - better error handling and good responses
      //      - check if username exist first
      const valid = registerValidate.validate(args);
      if (valid.error) {
        console.log(valid.error.details);
        throw new Error(valid.error);
      }
      try {
        args.password = await bcrypt.hash(args.password, 10);
        let [newUser] = await db("users").insert(args).returning("*");
        let tokens = await issueTokens(newUser);
        console.log("New user registered!", newUser);
        return { user: newUser, ...tokens };
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
