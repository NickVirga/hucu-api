const knex = require("knex")(require("../knexfile"));

const index = (req, res) => {
  if (req.role === "dispatcher") {
    knex("users")
      .where({ id: req.user_id })
      .select("organization_id")
      .first()
      .then((userData) => {
        return knex("agents")
          .where({ organization_id: userData.organization_id })
          .then((data) => {
            res.status(200).json(data);
          })
          .catch((err) =>
            res.status(400).send(`Error retrieving Agents: ${err}`)
          );
      })
      .catch((err) => res.status(400).send(`Error retrieving user data: ${err}`));
  } else if (req.role === "agent") {
    res.status(200).json({
      message: `Unauthorized to view agents`,
    });
  } else {
    res.status(401).json({
      message: `Unauthorized to view agents`,
    });
  }
};

const findOne = (req, res) => {
  knex("agents")
    .where({ id: req.params.id })
    .then((agentsFound) => {
      if (agentsFound.length === 0) {
        return res
          .status(404)
          .json({ message: `Agent with ID: ${req.params.id} not found` });
      }

      const agentData = agentsFound[0];

      res.status(200).json(agentData);
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to retrieve agent data for agent with ID: ${req.params.id}`,
      });
    });
};

const update = (req, res) => {
  knex("agents")
    .where({ id: req.params.id })
    .update(req.body)
    .then(() => {
      return knex("agents").where({
        id: req.params.id,
      });
    })
    .then((updatedAgent) => {
      res.json(updatedAgent[0]);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: `Unable to update agent with ID: ${req.params.id}` });
    });
};

module.exports = {
  index,
  findOne,
  update,
};
