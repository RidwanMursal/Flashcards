const express = require("express")
const pool = require("../connection")

const router = express.Router()

// get all classes from a user
router.get("/class/:id", async (req, res) => {
    try {
        const id = req.params.id
        console.log("in get classes using id, this is the id", req.params.id)
        
        const class_ = await pool.query(`
        SELECT class, id, class_picture
        FROM classes
        WHERE id = ($1)
        ORDER BY date DESC;
        `, [id])       
        res.json(class_.rows) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})

// get all classes 
router.get("/", async (req, res) => {
    // if not admin, you don't have access
    // if (req.user.authority != "admin") return res.sendStatus(401)

    try {
        const classes = await pool.query(`
        SELECT class, username
        FROM classes
        `)       
        res.json(classes.rows) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})


// get all classes from a user
router.get("/:user", async (req, res) => {
    try {
        console.log("in get classes, this is the user", req.params.user)
        const username = req.params.user
        const classes = await pool.query(`
        SELECT class, id, class_picture
        FROM classes
        WHERE username = ($1);
        `, [username])  
        // if (classes.rows[0].class_picture !== null)  { 
            
        // }  
        res.json(classes.rows) 
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }
})




// add a class
router.post("/:user", async (req, res) => {
    try {
        // //console.log("this is the req", req)
        const { className} = req.body
        const username = req.params.user

        // console.log("these are the tags", tags)
        // console.log("this is the message", message)
        
        const newClass = await pool.query(`
            INSERT INTO classes (class, username)
            VALUES ($1, $2)
            RETURNING * 
        `, [className, username])

        res.json(newClass.rows)
    } catch (error) {
        console.log("this is the error", error)
        res.status(400).json(error) 
    }
})



// delete class 
router.delete("/:id", async(req, res) => {
    try {
        // if id, only delete one, if username, delete all associated to that un
        const identifier = req.params.id
        var userFlag = false
        if (isNaN(identifier)) userFlag = true
        console.log(userFlag)
        console.log("IN DELETE CLASS, this is the identifier", identifier)
        console.log("checking if identifier is a number", isNaN(identifier))
        const deletedClass = await pool.query(`
            DELETE FROM classes WHERE ${userFlag? "username":"id"} = ($1) RETURNING *
        `, [identifier])
        res.status(200).json(deletedClass.rows)
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})


router.patch("/:id", async (req, res) => {
    try {
        console.log("HIT PATCH/CLASSES/ID")
        const id = req.params.id
        const { className, username} = req.body
        console.log("in /classes/patch, classname and username and id", className, username, id)
        const update = await pool.query(`
            UPDATE classes 
            SET class = ($1), username = ($2)
            WHERE id = ($3)
            RETURNING *
        `, [className, username, id])
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