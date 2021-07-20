import db from "../../../db";
import { registerValidate } from "../validators";
import { issueTokens, createNewOtp, getAuthUser } from "../../functions/auth";
let key = process.env.APP_SECRET;
import jwt from "jsonwebtoken";

export default {
  Query: {
    users: () => {},
    profile: async (root, args, { req }, info) => {
      if (!(await getAuthUser(req, true))) {
        throw new Error("User not authenticated");
      }
    },
    login: async (root, args, { req }, info) => {
      //TODO:now I'm treating phone num as password
      let [user] = await db.select("*").from("users").where({ username: args.username });
      if (!user) {
        throw new Error("User not found");
      }
      if (user.phone !== args.phone) {
        throw new Error("Wrong phone number");
      }
      let tokens = await issueTokens(user);
      console.log("User logged in", user);
      return { user: user, ...tokens };
    },
    refreshToken: () => {},
  },
  Mutation: {
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
        // TODO: crypt otp
        let otps = await createNewOtp(username, phone);
        console.log(otps.number);
        //send sms with otps.number
        return { otptoken: otps.token };
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
