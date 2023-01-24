const express = require("express");
const pool = require("../connection");

const router = express.Router();

// get all cards
router.get("/", async (req, res) => {
  try {
    console.log("HIT CARDS/GET (gets all cards) ");
    const cards = await pool.query(`
        SELECT cards.id, cards.question, cards.answer, cards.deck_id, decks.name
        FROM cards 
        JOIN decks ON decks.id = cards.deck_id;
        `);
    res.status(200).json(cards.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// get all cards from a deck
router.get("/:deck", async (req, res) => {
  try {
    console.log("HIT GET/CARDS/:DECK, this is the deck id", req.params.deck);
    const deckID = req.params.deck;
    const cards = await pool.query(
      `
        SELECT cards.id, cards.question, cards.answer, cards.deck_id, decks.name
        FROM cards 
        JOIN decks ON decks.id = cards.deck_id
        WHERE cards.deck_id = ($1);
        `,
      [deckID]
    );

    res.json(cards.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
});

// add a card
router.post("/", async (req, res) => {
  try {
    // //console.log("this is the req", req)
    console.log("HIT CARDS/POST, HERE ARE THE VALUES:");
    console.log("BODY", req.body);
    const { question, answer, deckID } = req.body;

    // console.log("these are the tags", tags)
    // console.log("this is the message", message)

    const newPost = await pool.query(
      `
            INSERT INTO cards (question, answer, deck_id)
            VALUES ($1, $2, $3)
            RETURNING * 
        `,
      [question, answer, deckID]
    );

    res.json(newPost.rows);
  } catch (error) {
    console.log("this is the error", error);
    res.status(400).json(error);
  }
});

// delete card by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("HIT CARDS/DELETE/ID, HERE IS THE ID", id);
    const deletedCard = await pool.query(
      `
            DELETE FROM cards WHERE id = ($1) RETURNING *
        `,
      [id]
    );
    res.json(deletedCard.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    console.log("HIT CARDS/PATCH/ID, HERE ARE THE VALUES:");
    const { question, answer, deckID, image } = req.body;
    console.log("BODY", req.body);
    console.log("PARAMS", req.params);
    const id = req.params.id;
    const update = await pool.query(
      `
            UPDATE cards 
            SET question = ($1), answer = ($2), deck_id = ($3), image = ($4)
            WHERE id = ($5)
            RETURNING *
        `,
      [question, answer, deckID, image, id]
    );
    res.json(update.rows);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

module.exports = router;
