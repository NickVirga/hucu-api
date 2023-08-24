const knex = require("knex")(require("../knexfile"));

const index = (req, res) => {
  knex("users")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).send(`Error retrieving Users: ${err}`));
};

const findOne = (req, res) => {
  knex("users")
    .where({ id: req.params.id })
    .then((usersFound) => {
      if (usersFound.length === 0) {
        return res
          .status(404)
          .json({ message: `User with ID: ${req.params.id} not found` });
      }

      const userData = usersFound[0];

      res.status(200).json(userData);
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to retrieve user data for user with ID: ${req.params.id}`,
      });
    });
};

const add = (req, res) => {
  if (!req.body.name || !req.body.email) {
    return res
      .status(400)
      .send("Please provide name and email for the user in the request");
  }

  knex("users")
    .insert(req.body)
    .then((result) => {
      return knex("users").where({ id: result[0] });
    })
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create new user" });
    });
};

module.exports = {
  index,
  findOne,
  add,
};
