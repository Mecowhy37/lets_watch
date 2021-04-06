// const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { MONGODB } = require("./config.js");
const faker = require("faker");

const generateUsers = async () => {
  const users = [];
  faker.random.array = function randomArray(min, max, obj) {
    const len = faker.datatype.number({ min, max });
    const array = [];

    for (let i = 0; i < len; ++i) {
      array[i] = typeof obj === "function" ? obj(i) : merge({}, obj);
    }

    return array;
  };

  for (let i = 1; i <= 3; i++) {
    const createdAt = faker.date.past();
    const username = faker.internet.userName();
    const fullname = faker.name.findName();
    const email = faker.internet.email();
    const reviews = faker.random.array(1, 4, () => faker.datatype.number({ min: 1, max: 100 }));
    const watchlist = faker.random.array(1, 4, () => faker.datatype.number({ min: 1, max: 100 }));

    users.push({
      createdAt,
      username,
      fullname,
      email,
      reviews,
      watchlist,
    });
  }
  async function main() {
    const uri = "mongodb+srv://meekez_dev:bJdBBjYfFDcbejhy@letswatch.l81wd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
      await client.connect().then(console.log("connected to DB"));
      const result = await client.db("letswatch").collection("users").insertMany(users);
      console.log(result);
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }

  main().catch(console.error);
};

generateUsers();
