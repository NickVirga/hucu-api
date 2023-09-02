const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));
const authorize = require("../middleware/authorize");
// const usersController = require("../controllers/users-controller.js");

// router.route("/").get(usersController.index).post(usersController.add);
// router.route("/:id").get(usersController.findOne);

router.get("/", authorize, (req, res) => {
  knex("users")
    .select(
      "id",
      "username",
      "role",
      "first_name",
      "last_name",
      "phone_number",
      "email"
    )
    .where({ id: req.user_id })
    .then((userdata) => {
      res.json(userdata);
    });
});

module.exports = router;
