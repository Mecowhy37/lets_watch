exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments().primary();
      table.string("username", 255).notNullable();
      table.string("phone", 255).notNullable();
      table.string("password", 255).notNullable();
      table.boolean("account_verified").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("movies", function (table) {
      table.increments().primary();
      table.string("title", 255).notNullable();
      table.string("director", 255).notNullable();
      table.string("release_year", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("grailist", function (table) {
      table.increments().primary();
      table.integer("user_id_fk").notNullable().references("id").inTable("users");
      table.integer("movie_id_fk").notNullable().references("id").inTable("movies");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("movies").dropTable("grailist");
};
