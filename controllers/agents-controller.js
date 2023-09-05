const knex = require("knex")(require("../knexfile"));

const index = (req, res) => {
  if (req.role === "dispatcher") {
    knex("agents")
      .where({ user_id: req.user_id })
      .select("organization_id")
      .first()
      .then((userData) => {
        return knex("agents")
          .where({ organization_id: userData.organization_id })
          .select("agents.id", "users.first_name", "users.last_name")
          .join("users", "agents.user_id", "users.id")
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) =>
            res.status(400).send(`Error retrieving Agents: ${err}`)
          );
      })
      .catch((err) => res.status(400).send(`Error retrieving user data: ${err}`));
  } 
  else {
    res.status(401).json({
      message: `Unauthorized to view agents`,
    });
  }
};

module.exports = {
  index,
};
