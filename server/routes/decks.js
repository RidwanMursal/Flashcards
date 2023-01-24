const express = require("express");
const pool = require("../connection");

const router = express.Router();

// get all decks
router.get("/", async (req, res) => {
  try {
    const deck = await pool.query(`
        SELECT decks.id, decks.name, decks.class_id, classes.class
        FROM decks
        JOIN classes ON classes.id = decks.class_id;
        `);
    res.json(deck.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// Get deck based on id
router.get("/deck/:id", async (req, res) => {
  try {
    console.log("HIT GET/DECK/:ID id is", req.params.id);
    const id = req.params.id;
    const deck = await pool.query(
      `
        SELECT decks.id, decks.name, decks.class_id
        FROM decks
        WHERE id = ($1);
        `,
      [id]
    );
    res.json(deck.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// get deck count from a user
router.get("/count/:username", async (req, res) => {
  try {
    console.log(
      "HIT/DECKS/COUNT/USERNAME, this is the user username",
      req.params.username
    );
    const username = req.params.username;
    const deckCount = await pool.query(
      `
        SELECT COUNT(*)
        FROM decks 
        JOIN classes ON classes.id = decks.class_id
        WHERE classes.username = ($1);
        `,
      [username]
    );
    res.json(deckCount.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// get all decks from a class
router.get("/:class", async (req, res) => {
  try {
    console.log("this is the class id", req.params.class);
    const classID = req.params.class;
    const deck = await pool.query(
      `
        SELECT decks.id, decks.name, decks.class_id, classes.class
        FROM decks 
        JOIN classes ON classes.id = decks.class_id
        WHERE decks.class_id = ($1);
        `,
      [classID]
    );
    res.json(deck.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// add a deck
router.post("/", async (req, res) => {
  try {
    // //console.log("this is the req", req)
    const { name, classID } = req.body;

    // console.log("these are the tags", tags)
    // console.log("this is the message", message)

    const newDeck = await pool.query(
      `
            INSERT INTO decks (name, class_id)
            VALUES ($1, $2)
            RETURNING * 
        `,
      [name, classID]
    );

    res.json(newDeck.rows);
  } catch (error) {
    console.log("this is the error", error);
    res.status(400).json(error);
  }
});

// delete card by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("this is the id", id);
    const deletedDeck = await pool.query(
      `
            DELETE FROM decks WHERE id = ($1) RETURNING *
        `,
      [id]
    );
    res.json(deletedDeck.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    // check if user has already liked the post
    console.log(
      `HIT DECKS/PATCH/:ID id: ${req.params.id} name: ${req.body.name} class: ${req.body.classID}`
    );
    const { name, classID } = req.body;
    const id = req.params.id;
    const update = await pool.query(
      `
            UPDATE decks 
            SET name = ($1), class_id = ($2)
            WHERE id = ($3)
            RETURNING *
        `,
      [name, classID, id]
    );
    res.json(update.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = router;
