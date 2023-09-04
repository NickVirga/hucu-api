const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");

const index = (req, res) => {
  if (req.role === "agent" || req.role === "dispatcher") {
    knex("agents")
      .where({ user_id: req.user_id })
      .select("id", "organization_id")
      .first()
      .then((agentData) => {
        return knex("tickets")
          .where({
            organization_id: agentData.organization_id,
            agent_id: agentData.id,
          })
          .then((ticketsData) => {
            res.status(200).json(ticketsData);
          })
          .catch((err) =>
            res.status(400).send(`Error retrieving Tickets: ${err}`)
          );
      })
      .catch((err) =>
        res.status(400).send(`Error fetching agent's organization ID: ${err}`)
      );
  } else {
    res.status(401).json({
      message: `Unauthorized to view tickets`,
    });
  }
};

const findOne = (req, res) => {
  knex("tickets")
    .where({ id: req.params.id })
    .then((ticketsFound) => {
      if (ticketsFound.length === 0) {
        return res
          .status(404)
          .json({ message: `Ticket with ID: ${req.params.id} not found` });
      }

      const ticketData = ticketsFound[0];
      if (
        ticketData.user_id === req.user_id ||
        req.role === "agent" ||
        req.role === "dispatcher"
      ) {
        return res.status(200).json(ticketData);
      }
      res.status(401).json({
        message: `Unauthorized to view ticket with ID: ${req.params.id}`,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to retrieve ticket data for ticket with ID: ${req.params.id}`,
      });
    });
};

const add = (req, res) => {
  const requiredAddProperties = [
    "inquiry_option",
    "client_first_name",
    "client_last_name",
    "client_phone_number",
    "client_email",
    "scheduled_at",
    "status",
  ];

  const hasAllProperties = (obj, props) => {
    for (let i = 0; i < props.length; i++) {
      if (!obj.hasOwnProperty(props[i])) return false;
    }
    return true;
  };

  if (!hasAllProperties(req.body, requiredAddProperties)) {
    res.status(400).json({
      message: `One or more missing properties in request body`,
    });
    return;
  }

  req.body.id = uuidv4();
  req.body.user_id = req.user_id;

  const currentDate = new Date();
  timeSplit = req.body.scheduled_at.split(":");
  currentDate.setHours(timeSplit[0]);
  currentDate.setMinutes(timeSplit[1]);
  currentDateMySqlFormat = currentDate
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  req.body.scheduled_at = currentDateMySqlFormat;
  req.body.queue_number = 1;

  knex("tickets")
    .insert(req.body)
    .then(() => {
      return knex("tickets").where({ id: req.body.id });
    })
    .then((createdTicket) => {
      res.status(201).json(createdTicket);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create new ticket" });
    });
};

const update = (req, res) => {
  knex("tickets")
    .where({ id: req.params.id })
    .update(req.body)
    .then(() => {
      return knex("tickets").where({
        id: req.params.id,
      });
    })
    .then((updatedTicket) => {
      res.status(200).json(updatedTicket[0]);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ message: `Ticket with ID: ${req.params.id} not found` });
    });
};

const remove = (req, res) => {
  knex("tickets")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(400).json({
          message: `Ticket with ID: ${req.params.id} to be deleted not found.`,
        });
      }

      // no content response
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete ticket" });
    });
};

module.exports = {
  index,
  findOne,
  add,
  update,
  remove,
};
