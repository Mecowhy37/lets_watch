exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        { username: "miko", phone: "87654321", password: "1234" },
        { username: "domin", phone: "87654321", password: "1234" },
        { username: "monia", phone: "87654321", password: "1234" },
      ]);
    });
};