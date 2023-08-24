const router = require("express").Router();
const usersController = require("../controllers/users-controller.js");

router.route("/").get(usersController.index).post(usersController.add);
router.route("/:id").get(usersController.findOne);

module.exports = router;
