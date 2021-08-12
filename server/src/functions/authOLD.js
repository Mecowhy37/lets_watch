// import jwt from "jsonwebtoken";
// import db from "../../db";
// import { AuthenticationError } from "apollo-server";
// import user from "../graphql/typeDefs/user";

// let otpGenerator = require("otp-generator");
// let key = process.env.APP_SECRET;
// let refKey = process.env.APP_REFRESH_SECRET;

// const issueTokens = async ({ username, phone, id }) => {
//   let token = await jwt.sign({ username, phone, id }, process.env.APP_SECRET, { expiresIn: "1h" });
//   let refreshToken = await jwt.sign({ username, phone, id }, refKey, { expiresIn: "1d" });
//   return {
//     token,
//     refreshToken,
//   };
// };

// const createNewOtp = async (username, phone) => {
//   let number = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
//   let token = await jwt.sign({ number, username, phone }, key, { expiresIn: "5m" });
//   return { number, token };
// };

// const getAuthUser = async (req, requiresAuth = false) => {
//   const header = req.headers.authorization;
//   if (header) {
//     const token = jwt.verify(header, key);
//     // console.log("TOKEN_DECODED", token);
//     let [authUser] = await db.select("*").from("users").where({ id: token.id });
//     if (!authUser) {
//       throw new AuthenticationError("Invalid token, User authentication failed");
//     }
//     if (requiresAuth) {
//       return authUser;
//     }
//     return null;
//   }
// };

// const getRefreshTokenUser = async (req) => {
//   const header = req.headers.refresh_token;
//   if (header) {
//     const token = jwt.verify(header, refKey);
//     console.log("TOKEN_REFRESHED", token);
//     let [authUser] = await db.select("*").from("users").where({ id: token.id });
//     if (!authUser) {
//       throw new AuthenticationError("Invalid refresh token, User authentication failed");
//     }
//     return authUser;
//   }
// };

// export { issueTokens, createNewOtp, getAuthUser, getRefreshTokenUser };
