exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(function () {
      return knex("users").insert([
        { username: "miko", phone: "12345678" },
        { username: "domin", phone: "87654321" },
        { username: "monia", phone: "36257364" },
      ]);
    });
};
