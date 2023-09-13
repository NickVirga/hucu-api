const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));

router.get("/", (req, res) => {
  knex("organizations")
    .then((organizationsData) => {
      res.status(200).json(organizationsData);
    })
    .catch((err) => {
      res.status(500).send(`Error retrieving Tickets: ${err}`);
    });
});

module.exports = router;