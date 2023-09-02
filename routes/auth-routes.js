const router = require("express").Router();
const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));
 
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            error: "Login requires username and password"
        });
    }

    knex("users")
        .where({ username: username })
        .then((foundUsers) => {
            if (foundUsers.length === 0) {
                return res.status(401).json({
                    error: "Invalid login credentials"
                });
            }

            const matchingUser = foundUsers[0];

            if (matchingUser.password !== password) {
                return res.status(401).json({
                    error: "Invalid login credentials"
                });
            }
            
            const token = jwt.sign(
                { 
                    user_id: matchingUser.id 
                }, 
                process.env.JWT_SECRET_KEY, 
                { 
                    expiresIn: '24h' 
                }
            );
            
            res.json({
                token: token,
                message: "Successfully logged in, enjoy your stay"
            });
        });
});


module.exports = router;
