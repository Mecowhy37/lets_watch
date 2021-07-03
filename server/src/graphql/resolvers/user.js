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
      // valitdate user
      await registerValidate.validate(args);
      //check if this user name doesnt already exist
      let user = await db.select("*").from("users").where({ username: args.username });
      console.log(user);
      if (user.length > 0) {
        throw new Error("This username is already taken");
      }
      user = await db.select("*").from("users").where({ phone: args.phone });
      if (user.length > 0) {
        throw new Error("Phone already registered");
      }
      //That means the registration is valid
      args.password = await bcrypt.hash(args.password, 10);
      let newUser = await db("users").insert(args).returning("*");
      console.log(newUser);

      // issue the token and refresh token
      let tokens = await issueTokens(newUser);
      return {
        user: newUser,
        ...tokens,
      };
    },
  },
};
