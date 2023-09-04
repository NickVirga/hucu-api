const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));
const { v4: uuidv4 } = require("uuid");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Login requires username and password",
    });
  }

  knex("users")
    .where({ username: username })
    .then((foundUsers) => {
      if (foundUsers.length === 0) {
        return res.status(401).json({
          error: "Invalid login credentials",
        });
      }

      const matchingUser = foundUsers[0];

      if (matchingUser.password !== password) {
        return res.status(401).json({
          error: "Invalid login credentials",
        });
      }

      const token = jwt.sign(
        {
          user_id: matchingUser.id,
          role: matchingUser.role
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      res.json({
        token: token,
        message: "Successfully logged in, enjoy your stay",
      });
    });
});

router.post("/signup", (req, res) => {
  const requiredSignupProperties = [
    "username",
    "password",
    "first_name",
    "last_name",
    "phone_number",
    "email",
  ];

  const hasAllProperties = (obj, props) => {
    for (let i = 0; i < props.length; i++) {
      if (!obj.hasOwnProperty(props[i])) return false;
    }
    return true;
  };

  if (!hasAllProperties(req.body, requiredSignupProperties)) {
    res.status(400).json({
      message: `One or more missing properties in request body`,
    });
    return;
  }

  req.body.id = uuidv4();
  req.body.role = "client";

  knex("users")
    .insert(req.body)
    .then(() => {
      return knex("users").where({ id: req.body.id });
    })
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to create new user" });
    });
});

module.exports = router;
