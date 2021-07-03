require("dotenv").config();

const { CLIENT, DATABASE, PG_USER, PASSWORD, HOST, PG_PORT } = process.env;

module.exports = {
  development: {
    client: CLIENT,
    connection: {
      database: DATABASE,
      user: PG_USER,
      password: PASSWORD,
      host: HOST,
      port: PG_PORT,
    },
    migrations: {
      directory: __dirname + "/db/migrations",
    },
    seeds: {
      directory: __dirname + "/db/seeds",
    },
    pool: {
      min: 2,
      max: 10,
      // afterCreate: (connection, callback) => {
      //   // console.log(connection);
      // },
    },
  },
};
