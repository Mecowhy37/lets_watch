exports.seed = function (knex) {
  return knex("movies")
    .del()
    .then(function () {
      return knex("movies").insert([
        { title: "Inception", director: "Christopher Nolan", release_year: "2010" },
        { title: "Space Oddysey", director: "Stanley Kubick", release_year: "1968" },
        { title: "Split", director: "M. Night Shyamalan", release_year: "2017" },
        { title: "Good Will Haunting", director: "Matt Damon", release_year: "1997" },
      ]);
    });
};
