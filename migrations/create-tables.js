/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.string("id").primary();
      table.string("username").notNullable();
      table.string("password").notNullable();
      table.string("role").notNullable();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("phone_number").notNullable();
      table.string("email").notNullable();
      table.boolean("is_anonymous").defaultTo(true);
    })
    .createTable("organizations", (table) => {
      table.string("id").primary();
      table.string("name").notNullable();
    })
    .createTable("agents", (table) => {
      table.string("id").primary();
      table

        .string("organization_id")
        .references("organizations.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .string("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    })
    .createTable("tickets", (table) => {
      table.string("id").primary();
      table.string("inquiry_option").notNullable();
      table.string("client_first_name").notNullable();
      table.string("client_last_name").notNullable();
      table.string("client_phone_number").notNullable();
      table.string("client_email").notNullable();
      table.string("client_notes")
      table
        .string("user_id")
        .references("users.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .string("agent_id")
        .references("agents.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .string("organization_id")
        .references("organizations.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("status").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("scheduled_at");
      table.timestamp("closed_at");
      table.string("agent_notes");
      table.integer("queue_number").unsigned().notNullable().defaultTo(1);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return (
    knex.schema
      .dropTable("users")
      .dropTable("organizations")
      .dropTable("agents")
      .dropTable("tickets")
  );
};
