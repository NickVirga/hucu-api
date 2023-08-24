const router = require("express").Router();
const agentsController = require("../controllers/agents-controller.js");

router.route("/").get(agentsController.index);
router.route("/:id").get(agentsController.findOne).patch(agentsController.update);

module.exports = router;
