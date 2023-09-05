const router = require("express").Router();
const agentsController = require("../controllers/agents-controller.js");
const authorize = require("../middleware/authorize");

router.route("/").get(authorize, agentsController.index);

module.exports = router;
