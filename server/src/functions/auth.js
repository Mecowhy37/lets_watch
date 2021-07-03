import jwt from "jsonwebtoken";
export const issueTokens = async ({ username, phone, id }) => {
  let token = await jwt.sign({ username, phone, id }, process.env.APP_SECRET, { expiresIn: "1h" });
  let refreshToken = await jwt.sign({ username, phone, id }, process.env.APP_REFRESH_SECRET, { expiresIn: "1d" });
  return {
    token,
    refreshToken,
  };
};
