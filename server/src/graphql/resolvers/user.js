const { authenticated, authorized } = require("../../functions/auth");
let axios = require("axios").default;
// import { registerValidate } from "../validators";
// import { issueTokens, createNewOtp, getAuthUser, getRefreshTokenUser } from "../../functions/auth";
// let key = process.env.APP_SECRET;
// import jwt from "jsonwebtoken";

export default {
  Query: {
    profile: authenticated(async (_, __, { user }) => {
      return user;
    }),
    watch_list: authenticated(async (_, __, { db, user }) => {
      let watchList = await db.select("title", "grailist.updated_at").from("grailist").where({ user_id_fk: user.id });
      let updated_at =
        !watchList.length < 1
          ? watchList
              .reduce((max, date) => (max.updated_at > date.votes ? max : date))
              .updated_at.toISOString()
              .replace(/T/, " ")
              .replace(/\..+/, "")
          : "new list";
      let consoleList = watchList.map((el) => el.title);
      console.log(`THIS IS ${user.username.toUpperCase()}'S WATCHLIST`, consoleList, ` lastly updated at: ${updated_at}`);
      return { list: watchList, updated_at };
    }),
    searchtowatchlist: authenticated(async (_, { title }, { user }) => {
      var options = {
        method: "GET",
        url: "https://movie-database-imdb-alternative.p.rapidapi.com/",
        params: { s: title.trim(), page: "1", r: "json" },
        headers: {
          "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "6bbc363174msh505d428f4f14dc3p171043jsnf83c5441aef2",
        },
      };

      return axios
        .request(options)
        .then(function (response) {
          let arrayToReturn = response.data.Search;
          if (!arrayToReturn) {
            return [];
          }
          return arrayToReturn.filter((el) => (el.Type === "game" ? false : el));
        })
        .catch(function (error) {
          console.error(error);
        });
    }),
  },
  Mutation: {
    signin: async (_, { input }, { db, createToken }) => {
      const [user] = await db.select("*").from("users").where({ username: input.username });
      if (!user) {
        throw new Error("nope");
      }
      const token = createToken(user);
      return { user, token };
    },
    signup: async (_, { input }, { db, createToken }) => {
      const [existing] = await db.select("*").from("users").where({ phone: input.phone });
      if (existing) {
        throw new Error("nope");
      }
      const [user] = await db("users").insert({ username: input.username, phone: input.phone }).returning("*");
      const token = createToken(user);
      return { user, token };
    },
    addtowatchlist: authenticated(async (_, { imdbID }, { db, user }) => {
      let [alreadyAdded] = await db.select("*").from("grailist").where({ user_id_fk: user.id, movie_imdb_id: imdbID });
      if (alreadyAdded) {
        throw new Error("youve alredy added this movie");
      }
      let options = {
        method: "GET",
        url: "https://movie-database-imdb-alternative.p.rapidapi.com/",
        params: { i: imdbID, r: "json" },
        headers: {
          "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
          "x-rapidapi-key": "6bbc363174msh505d428f4f14dc3p171043jsnf83c5441aef2",
        },
      };

      let title = await axios
        .request(options)
        .then(function (response) {
          return response.data.Title;
        })
        .catch(function (error) {
          console.error(error);
        });

      try {
        let [movie] = await db("grailist").insert({ user_id_fk: user.id, movie_imdb_id: imdbID, title }).returning("*");
        console.log(movie);
        return movie;
      } catch (e) {
        throw new Error(e);
      }
    }),
  },
};
//this belongs to queries
// login: async (root, args, { req }, info) => {
//   //TODO:now I'm treating phone num as password
//   let [user] = await db.select("*").from("users").where({ username: args.username });
//   if (!user) {
//     throw new Error("User not found");
//   }
//   if (user.phone !== args.phone) {
//     throw new Error("Wrong phone number");
//   }
//   let tokens = await issueTokens(user);
//   console.log("User logged in", user);
//   return { user: user, ...tokens };
// },
// refreshToken: async (root, args, { req }, info) => {
//   let authUser = await getRefreshTokenUser(req);
//   let tokens = await issueTokens(authUser);
//   return {
//     user: authUser,
//     ...tokens,
//   };
// },
// Mutation: {
//   getOtp: async (root, { username, phone }, { req }, info) => {
//     let [Checkup] = await db
//       .select("username", "phone")
//       .from("users")
//       .where(function () {
//         this.where({ username });
//       })
//       .orWhere({ phone });
//     let result = {
//       username: "",
//       phone: "",
//       otp: "",
//     };
//     if (Checkup) {
//       if (username === Checkup.username) {
//         result.username = "This username is already taken";
//       } else {
//         result.username = "Your username is valid :))";
//       }
//       if (phone === Checkup.phone) {
//         result.phone = "This phone number is already registered";
//       } else {
//         result.phone = "Your phone is O K";
//       }
//       return result;
//     } else {
//       // TODO: crypt otp
//       let otps = await createNewOtp(username, phone);
//       console.log(otps.number);
//       //send sms with otps.number
//       return { otptoken: otps.token };
//     }
//   },
//   register: async (root, { otp, token }, { req }, info) => {
//     let decoded = jwt.verify(token, key);
//     let now = `${Date.now()}`.slice(0, 10);
//     console.log(decoded);
//     if (decoded.exp > now) {
//       if (decoded.number === otp) {
//         try {
//           let [newUser] = await db("users").insert({ username: decoded.username, phone: decoded.phone }).returning("*");
//           let tokens = await issueTokens(newUser);
//           console.log("New user registe`red!", newUser);
//           return { user: newUser, ...tokens };
//         } catch (err) {
//           console.log(err.constraint);
//           throw new Error(err.constraint);
//         }
//       } else {
//         throw new Error("Wrong code");
//       }
//     } else {
//       //TODO: send new otp
//       throw new Error("Insert new code");
//     }
//   },
// },

// SELECT users.username,
// 	   movies.title,
// 	   grailist.updated_at
// FROM grailist
// JOIN users ON grailist.user_id_fk = users.id
// JOIN movies on grailist.movie_id_fk = movies.id
// ORDER BY users.id;
