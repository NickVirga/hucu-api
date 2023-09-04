const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const authorize = require("../middleware/authorize");
// const usersController = require("../controllers/users-controller.js");

// router.route("/").get(usersController.index).post(usersController.add);
// router.route("/:id").get(usersController.findOne);

router.get("/", authorize, (req, res) => {
  knex("users")
    .select(
      "username",
      "role",
      "first_name",
      "last_name",
      "phone_number",
      "email"
    )
    .first()
    .where({ id: req.user_id })
    .then((userData) => {
      if (userData.role === "agent" || userData.role === "dispatcher") {
        knex("agents")
          .select("organization_id")
          .first()
          .where({ user_id: req.user_id })
          .then((agentData) => {
            userData.organization_id = agentData.organization_id;
            res.json(userData);
          })
          .catch((error) => {
            res
              .status(500)
              .json({ error: "An error occurred while fetching agent data." });
          });
      } else {
        res.json(userData);
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ error: "An error occurred while fetching user data." });
    });
});

module.exports = router;
