const express = require("express")
const pool = require("../connection")

const router = express.Router()

// get all decks 
router.get("/", async (req, res) => {
    try {
        
        
        const deck = await pool.query(`
        SELECT decks.id, decks.name, decks.class_id, classes.class
        FROM decks
        JOIN classes ON classes.id = decks.class_id;
        `)       
        res.json(deck.rows) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})

// get all decks from a class
router.get("/:class", async (req, res) => {
    try {
        console.log("this is the class id", req.params.class)
        const classID = req.params.class
        const deck = await pool.query(`
        SELECT decks.id, decks.name, decks.class_id, classes.class
        FROM decks 
        JOIN classes ON classes.id = decks.class_id
        WHERE decks.class_id = ($1);
        `, [classID])       
        res.json(deck.rows) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})


// add a deck
router.post("/", async (req, res) => {
    try {
        // //console.log("this is the req", req)
        const {name, classID} = req.body

        // console.log("these are the tags", tags)
        // console.log("this is the message", message)
        
        const newDeck = await pool.query(`
            INSERT INTO decks (name, class_id)
            VALUES ($1, $2)
            RETURNING * 
        `, [name, classID])

        res.json(newDeck.rows)
    } catch (error) {
        console.log("this is the error", error)
        res.status(400).json(error) 
    }
})



// delete card by id 
router.delete("/:id", async(req, res) => {
    try {
        const id = req.params.id
        console.log("this is the id", id)
        const deletedDeck = await pool.query(`
            DELETE FROM decks WHERE id = ($1) RETURNING *
        `, [id])
        res.json(deletedDeck.rows)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

router.patch("/:id", async (req, res) => {
    try {
        // check if user has already liked the post
        const {name, classID} = req.body
        const id = req.params.id
        const update = await pool.query(`
            UPDATE decks 
            SET name = ($1), class_id = ($2)
            WHERE id = ($3)
            RETURNING *
        `, [name, classID, id])
        res.json(update.rows)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

//update post 
// router.patch("/:id", authenticateToken, async (req, res) => {
//     try {
//         // check if user has already liked the post
//         const {message, image, tags, title} = req.body
//         const id = req.params.id
//         const update = await pool.query(`
//             UPDATE posts 
//             SET message = ($1), image = ($2), tags = ($3), title = ($4)
//             WHERE post_id = ($5)
//             RETURNING *
//         `, [message, image, tags, title, id])
//         res.json(update)
//     } catch (error) {
//         console.log(error)
//     }
// })

 




module.exports = router