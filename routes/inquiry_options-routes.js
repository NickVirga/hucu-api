const router = require("express").Router();
const inquiryOptionsController = require("../controllers/inquiry_options-controller");

router
  .route("/:id")
  .get(inquiryOptionsController.findOne)

module.exports = router;