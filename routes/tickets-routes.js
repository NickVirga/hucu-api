const router = require("express").Router();
const ticketsController = require("../controllers/tickets-controller");

router.route("/").get(ticketsController.index).post(ticketsController.add);

router
  .route("/:id")
  .get(ticketsController.findOne)
  .put(ticketsController.update)
  .delete(ticketsController.remove);

module.exports = router;
