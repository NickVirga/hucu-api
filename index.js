const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);

app.use(express.json());

const agentsRoutes = require("./routes/agents-routes");
const ticketsRoutes = require("./routes/tickets-routes");
const usersRoutes = require("./routes/users-routes");

app.use("/api/agents", agentsRoutes);
app.use("/api/tickets", ticketsRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});
