const ticketsData = require('../seed-data/tickets');

exports.seed = function (knex) {
      return knex('tickets').del()
    .then(function () {
      return knex('tickets').insert(ticketsData);
    });
};