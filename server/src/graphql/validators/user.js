import Joi from "joi";

const username = Joi.string().max(50).required().label("Username");
const phone = Joi.string().max(10).min(8).required().label("Phone");
const password = Joi.string()
  .label("Phone")
  .max(50)
  .min(8)
  .required()
  .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
  .label("Password")
  .messages({
    "string.pattern.base": "Must have atleast one lowecase letterm one uppercasae letter and one digit.",
  });

export const loginValidate = Joi.object({
  username,
  password,
});
export const registerValidate = Joi.object({
  username,
  phone,
  password,
});
