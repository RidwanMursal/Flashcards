const express = require("express");
const pool = require("../connection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const router = express.Router();

// validate username and password
const isValidPassword = (password) => {
  const message = { valid: false, error: "" };
  // test if a string contains at least one uppercase and one lowercase
  if (/[A-Z]/.test(password) === false) {
    message.error = "Password must contain at least one uppercase letter";
  } else if (/[a-z]/.test(password) === false) {
    message.error = "Password must contain at least one lowercase letter";
  } else if (/[0-9]/.test(password) === false) {
    message.error = "Password must contain at least one digit";
  } else if (password.length < 8 || password.length > 30) {
    message.error = "Password must be between 8 and 30 characters ";
  } else {
    message.valid = true;
  }
  return message;
};

// register a user
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`username: ${username} password: ${password}`);
    const message = isValidPassword(password);
    if (username.length < 3)
      throw new Error("username must be at least 3 characters");
    if (!message.valid) throw new Error(message.error);

    // hash password before storing it
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // store password in database
    const user = await pool.query(
      `
        INSERT INTO users (username, password) 
        VALUES ($1, $2)
        RETURNING * 
        `,
      [username, hashedPassword]
    );
    res.json(user.rows);
  } catch (error) {
    console.log("ERROR IN AUTH/REGISTER");
    console.log("Error Occured", error);
    res.status(409).json({ error: error.message });
  }
});

// refresh token
router.post("/refresh", async (req, res) => {
  try {
    console.log("HIT REFRESH");
    console.log("THE TOKEN IS");
    const token = req.cookies.refreshToken;
    console.log("this is the refresh token from cookies: ", token);

    const refreshToken = await pool.query(
      `
        SELECT exists( SELECT 1 FROM refresh_tokens WHERE token = ($1) )
        `,
      [token]
    );
    console.log(refreshToken.rows[0].exists);
    if (refreshToken.rows[0].exists) {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          // clear cookie if there's an error
          res.clearCookie(refreshToken);
          return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
          { username: user.username, athority: user.authority },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );
        res.cookie("acessToken", accessToken, {
          httpOnly: true,
          sameSite: "none",
        });
        res.json({ accessToken: accessToken });
      });
    }
    //If it doesn't exist clear the cookie
    else {
      res.clearCookie(refreshToken);
      res.sendStatus(400);
      return;
    }
  } catch (e) {
    //res.clearCookie(refreshToken)
    console.log("ERROR IN AUTH/REFRESH");
    res.send({ error: e.message });
  }
});

router.delete("/logout", async (req, res) => {
  try {
    const { token } = req.body;
    console.log("this is the refresh token: ", token);

    const refreshToken = pool.query(
      `
        DELETE FROM refresh_tokens WHERE token = ($1) 
        RETURNING * 
        `,
      [token]
    );

    res.json(refreshToken.rows);
  } catch (e) {
    console.log("ERROR IN AUTH/LOGOUT");
    res.json({ error: e.message });
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`username: ${username} password: ${password}`);

    // Check if password is correct
    const hashedPassword = await pool.query(
      `
        SELECT password FROM users WHERE username = ($1)
        `,
      [username]
    );
    // if user doesn't exist or password does not match, throw invalid cred error
    if (
      hashedPassword.rows.length < 1 ||
      (await bcrypt.compare(password, hashedPassword.rows[0].password)) ===
        false
    )
      throw new Error("Invalid Credentials");
    else {
      console.log("HEYY");
      const user = { name: username, authority: "user" };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "30s",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      insertTokenToDB(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "none",
      });
      res.cookie("acessToken", accessToken, {
        httpOnly: true,
        sameSite: "none",
      });
      res.json({ accessToken: accessToken });
    }
  } catch (error) {
    console.log("ERROR IN AUTH/LOGIN");
    res.status(400).send(error.message);
    console.log(error);
  }
});

// register users

// query to add refresh token into db
const insertTokenToDB = async (token) => {
  try {
    await pool.query(`INSERT INTO refresh_tokens (token) values ($1)`, [token]);
  } catch (e) {
    console.log(e.message);
  }

  return;
};

module.exports = router;
