const knex = require("knex")(require("../knexfile"));

const index = (req, res) => {
  if (req.role === "agent") {
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
  } else if (req.role === "dispatcher") {
    knex("agents")
      .where({ user_id: req.user_id })
      .select("organization_id")
      .first()
      .then((agentData) => {
        return knex("tickets")
          .where({
            organization_id: agentData.organization_id,
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
    .where({ "tickets.id": req.params.id })
    .select(
      "tickets.agent_id",
      "tickets.agent_notes",
      "tickets.client_email",
      "tickets.client_first_name",
      "tickets.client_last_name",
      "tickets.client_notes",
      "tickets.client_phone_number",
      "tickets.closed_at",
      "tickets.created_at",
      "tickets.id",
      "tickets.inquiry_option",
      "tickets.queue_number",
      "tickets.scheduled_at",
      "tickets.status",
      "tickets.user_id",
      "users.first_name",
      "users.last_name"
    )
    .leftJoin("agents", "tickets.agent_id", "agents.id")
    .leftJoin("users", "users.id", "agents.user_id")
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
        if (ticketData.agent_id) {
          return knex("tickets")
            .count()
            .where({ "tickets.agent_id": ticketData.agent_id })
            .whereIn("tickets.status", ["Open", "In Progress", "Reopened"])
            .where("tickets.queue_number", "<", ticketData.queue_number)
            .then((ticketCount) => {
              ticketData.ticket_count = ticketCount[0]["count(*)"];
              return res.status(200).json(ticketData);
            })
            .catch((err) => {
              res.status(500).json({
                message: `Unable to retrieve number of tickets in queue ahead of ticket with ID: ${req.params.id}`,
              });
            });
        } else {
          return res.status(200).json(ticketData);
        }
      }
      res.status(401).json({
        message: `Unauthorized to view ticket with ID: ${req.params.id}`,
      });
    })
    .catch((err) => {
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
    "organization_id",
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

  // req.body.id = uuidv4();
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
    .then((ticketData) => {
      return knex("tickets").where({ id: ticketData[0] }).first();
    })
    .then((createdTicket) => {
      res.status(201).json(createdTicket);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create new ticket" });
    });
};

const update = (req, res) => {
  if (req.role === "agent" || req.role === "dispatcher") {
    // findout if the ticket currently has no agent assigned
    knex("tickets")
      .where({ id: req.params.id })
      .select("agent_id")
      .first()
      .then((ticketData) => {
        // if ticket is getting agent assigned for first time, find that agents largest queue number
        if (ticketData.agent_id === null && req.body.agent_id !== null) {
          return knex("tickets")
            .where({ "tickets.agent_id": req.body.agent_id })
            .whereIn("tickets.status", ["Open", "In Progress", "Reopened"])
            .max("tickets.queue_number as max_queue_number")
            .then((result) => {
              const maxQueueNumber = result[0].max_queue_number;
              // assign the queue number of the new ticket to be one greater than largest queue number
              req.body.queue_number = maxQueueNumber + 1;
              // update ticket normally
              return knex("tickets")
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
                  console.log(err);
                  res.status(404).json({
                    message: `Ticket with ID: ${req.params.id} not found`,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res
                .status(500)
                .json({
                  message: `Largest queue number for agent could not be found.`,
                });
            });
        } else {
          // update ticket normally if it already has an agent assigned
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
              console.log(err);
              res
                .status(404)
                .json({
                  message: `Ticket with ID: ${req.params.id} not found`,
                });
            });
        }
      }).catch((err) => {
        console.log(err);
        res
          .status(404)
          .json({
            message: `Agent ID for ticket with ID: ${req.params.id} not found`,
          });
      });;
  } else {
    res.status(401).json({
      message: `Unauthorized to edit ticket with ID: ${req.params.id}`,
    });
  }
};

module.exports = {
  index,
  findOne,
  add,
  update,
};
