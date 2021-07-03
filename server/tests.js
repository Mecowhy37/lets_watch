const db = require("./db");

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
  let user = await db.select("*").from("users").where({ username: "adsfasd" });
  console.log(user);
}

test();
// getUsers();
// getMovies();
