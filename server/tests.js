const db = require("./db");
let jwt = require("jsonwebtoken");
let otpGenerator = require("otp-generator");
let key = process.env.APP_SECRET;

async function getUsers() {
  try {
    const users = await db.select("*").from("users");
    console.log(users);
  } catch (error) {
    console.log(error);
  }
}
async function getMovies() {
  try {
    const movies = await db.select("*").from("movies");
    console.log(movies);
  } catch (error) {
    console.log(error);
  }
  return;
}

async function test() {
  // let user = await db.select("*").from("users").where({ username: "adsfasd" });
  // console.log(user);
  try {
    let newUser = await db("users").insert({ username: "mik", phone: "12345678" }).returning("*");
    console.log(newUser);
  } catch (err) {
    throw new Error(err.constraint);
  }
}

// test();
// getUsers();
// getMovies();
