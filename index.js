const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

const authRoutes = require("./routes/auth-routes");
const agentsRoutes = require("./routes/agents-routes");
const ticketsRoutes = require("./routes/tickets-routes");
const usersRoutes = require("./routes/users-routes");
const organizationRoutes = require("./routes/organizations-routes");
const inquiryOptionsRoutes = require("./routes/inquiry_options-routes");

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/inquiry-options", inquiryOptionsRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
