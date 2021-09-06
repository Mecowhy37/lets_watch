const { authenticated, authorized } = require("../../functions/auth");
let axios = require("axios").default;

export default {
  Query: {
    watch_list: authenticated(async (_, __, { db, user }) => {
      // let watchList = await db.select("title", "movie_imdb_id", "grailist.updated_at", "watched").from("grailist").where({ user_id_fk: user.id, watched: false });
      let watchList = await db.select("title", "movie_imdb_id", "grailist.updated_at", "watched").from("grailist").where({ user_id_fk: user.id });
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
        console.log(`${user.username.toUpperCase()} ADDED: `, movie);
        return movie;
      } catch (e) {
        throw new Error(e);
      }
    }),
    markwatched: authenticated(async (_, { imdbID }, { db, user }) => {
      try {
        let [movie] = await db("grailist")
          .where({ user_id_fk: user.id, movie_imdb_id: imdbID })
          .update({ watched: db.raw("NOT ??", ["watched"]) })
          .returning("*");
        console.log(`${user.username.toUpperCase()} TOGGLED WATCHED: `, movie);
        return movie;
      } catch (e) {
        throw new Error(e);
      }
    }),
    delete: authenticated(async (_, { imdbID }, { db, user }) => {
      try {
        let [movieDel] = await db("grailist").where({ user_id_fk: user.id, movie_imdb_id: imdbID }).del().returning("*");
        console.log(`${user.username.toUpperCase()} DELETED: `, movieDel);
        return movieDel;
      } catch (e) {
        throw new Error(e);
      }
    }),
  },
};
