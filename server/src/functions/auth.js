import jwt from "jsonwebtoken";

let otpGenerator = require("otp-generator");
let key = process.env.APP_SECRET;

const issueTokens = async ({ username, phone, id }) => {
  let token = await jwt.sign({ username, phone, id }, process.env.APP_SECRET, { expiresIn: "1h" });
  let refreshToken = await jwt.sign({ username, phone, id }, process.env.APP_REFRESH_SECRET, { expiresIn: "1d" });
  return {
    token,
    refreshToken,
  };
};

const createNewOtp = async (username, phone) => {
  let number = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
  let token = await jwt.sign({ number, username, phone }, key, { expiresIn: "5m" });
  return { number, token };
};

export { issueTokens, createNewOtp };
