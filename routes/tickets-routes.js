const router = require("express").Router();
const ticketsController = require("../controllers/tickets-controller");
const authorize = require("../middleware/authorize");

router.route("/").get(ticketsController.index).post(ticketsController.add);

router.use(authorize)

router
  .route("/:id")
  .get(ticketsController.findOne, authorize)
  .put(ticketsController.update)
  .delete(ticketsController.remove);

module.exports = router;
