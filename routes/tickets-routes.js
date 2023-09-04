const router = require("express").Router();
const ticketsController = require("../controllers/tickets-controller");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .get(authorize, ticketsController.index)
  .post(authorize, ticketsController.add);

router
  .route("/:id")
  .get(authorize, ticketsController.findOne)
  .put(authorize, ticketsController.update)
  .delete(ticketsController.remove);

module.exports = router;
