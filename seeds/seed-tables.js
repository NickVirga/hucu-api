const agentsData = require("../seed-data/agents");
const organizationsData = require("../seed-data/organizations");
const ticketsData = require("../seed-data/tickets");
const usersData = require("../seed-data/users");

exports.seed = function (knex) {
  return knex("agents")
    .del()
    .then(function () {
      return knex("organizations").del();
    })
    .then(function () {
      return knex("tickets").del();
    })
    .then(function () {
      return knex("users").del();
    })
    .then(function () {
      return knex("organizations").insert(organizationsData);
    })
    .then(() => {
      return knex("users").insert(usersData);
    })
    .then(function () {
      return knex("agents").insert(agentsData);
    })
    .then(function () {
      return knex("tickets").insert(ticketsData);
    });
};
