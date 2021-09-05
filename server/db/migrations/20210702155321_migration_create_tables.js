exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments().primary();
      table.string("username", 255).notNullable().unique();
      table.string("phone", 255).notNullable().unique();
      table.boolean("account_verified").notNullable().defaultTo(false);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("grailist", function (table) {
      table.increments().primary();
      table.integer("user_id_fk").notNullable().references("id").inTable("users");
      table.string("movie_imdb_id").notNullable();
      table.string("title", 255).notNullable();
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.boolean("watched").defaultTo(false);
      table.boolean("deleted").defaultTo(false);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("grailist").dropTable("users");
};
