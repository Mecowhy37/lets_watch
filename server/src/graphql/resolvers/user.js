import db from "../../../db";
import { registerValidate } from "../validators";
import { issueTokens, createNewOtp } from "../../functions/auth";
import { defaultTypeResolver } from "graphql";
let key = process.env.APP_SECRET;
import jwt from "jsonwebtoken";
export default {
  Query: {
    users: () => {},
    profile: () => {},
    login: () => {},
    refreshToken: () => {},
  },
  Mutation: {
    //   register: async (root, args, { req }, info) => {
    //     //TODO: - better error handling and good responses
    //     //      - check if username exist first
    //     const valid = registerValidate.validate(args);
    //     if (valid.error) {
    //       console.log(valid.error.details);
    //       throw new Error(valid.error);
    //     }
    //     try {
    //       // args.password = await bcrypt.hash(args.password, 10);
    //       let [newUser] = await db("users").insert(args).returning("*");
    //       let tokens = await issueTokens(newUser);
    //       console.log("New user registered!", newUser);
    //       return { user: newUser, ...tokens };
    //     } catch (error) {
    //       throw new Error(error);
    //     }
    //   },
    // },
    getOtp: async (root, { username, phone }, { req }, info) => {
      let [Checkup] = await db
        .select("username", "phone")
        .from("users")
        .where(function () {
          this.where({ username });
        })
        .orWhere({ phone });
      let result = {
        username: "",
        phone: "",
        otp: "",
      };
      if (Checkup) {
        if (username === Checkup.username) {
          result.username = "This username is already taken";
        } else {
          result.username = "Your username is valid :))";
        }
        if (phone === Checkup.phone) {
          result.phone = "This phone number is already registered";
        } else {
          result.phone = "Your phone is O K";
        }
        return result;
      } else {
        let otps = await createNewOtp(username, phone);
        console.log(otps.number);
        //send sms with otps.number
        return { otp: otps.token };
      }
    },
    register: async (root, { otp, token }, { req }, info) => {
      let decoded = jwt.verify(token, key);
      let now = `${Date.now()}`.slice(0, 10);
      console.log(decoded);
      if (decoded.exp > now) {
        if (decoded.number === otp) {
          try {
            let [newUser] = await db("users").insert({ username: decoded.username, phone: decoded.phone }).returning("*");
            let tokens = await issueTokens(newUser);
            console.log("New user registered!", newUser);
            return { user: newUser, ...tokens };
          } catch (err) {
            console.log(err.constraint);
            throw new Error(err.constraint);
          }
        } else {
          throw new Error("Wrong code");
        }
      } else {
        //TODO: send new otp
        throw new Error("Insert new code");
      }
    },
  },
  // try {
  //   let [newUser] = await db("users").insert({ username, phone }).returning("*");
  //   let tokens = await issueTokens(newUser);
  //   console.log("New user registered!", newUser);
  //   return { user: newUser, ...tokens };
  // } catch (err) {
  //   console.log(err.constraint);
  //   throw new Error(err.constraint);
  // }
  // Registering: {
  //   __resolveType: (obj) => {
  //     if (obj.token) {
  //       return "Auth";
  //     }
  //     if (!obj.token) {
  //       return "Checkup";
  //     }
  //     return null;
  //   },
  // },
};
