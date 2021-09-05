const db = require("./db");
let jwt = require("jsonwebtoken");
let otpGenerator = require("otp-generator");
let key = process.env.APP_SECRET;
let axios = require("axios").default;

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

const getMovie = async () => {
  var options = {
    method: "GET",
    url: "https://movie-database-imdb-alternative.p.rapidapi.com/",
    params: { s: "jak", page: "1", r: "json" },
    headers: {
      "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
      "x-rapidapi-key": "6bbc363174msh505d428f4f14dc3p171043jsnf83c5441aef2",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};

// test();
// getUsers();
getMovie();
