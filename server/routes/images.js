const express = require("express")
const pool = require("../connection")
require("dotenv").config()
const fs = require('fs');
const multer = require('multer')
const path = require("path")


const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    }, 
    filename: (req, file, cb) => {
        const storedFileName = Date.now() + path.extname(file.originalname)
        cb(null, storedFileName)
        req.filePath = storedFileName
    }
})
const upload = multer({storage: storage})

// get 
router.get("/class/:id", async(req, res) => {
    try {
        
        console.log(`HIT IMAGES/CLASS GET REQUEST, id is ${req.params.id} `)
        const id = req.params.id 
        

        
        //make sure to delete the photo in images/  if there was a previous value in  class_picture
        
        const class_picture = await pool.query(`
        SELECT class_picture 
        FROM classes 
        WHERE id = ($1)
        `,[id])
        //console.log(class_picture.rows[0].class_picture)
        //res.sendFile(class_picture.rows[0].class_picture)
        res.send(class_picture.rows[0])
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})

// post 
router.post("/class/:id", upload.single("image"),async(req, res) => {
    try {
        
        console.log(`HIT IMAGES/CLASS POST REQUEST, id is ${req.params.id} and the path is ${req.filePath}`)
        const id = req.params.id 
        const path = req.filePath 

        
        //make sure to delete the photo in images/  if there was a previous value in  class_picture
        
        const class_ = await pool.query(`
        UPDATE classes 
        SET class_picture = ($1)
        WHERE id = ($2)
        `,[path, id])
        res.json(class_.rows)
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})

// post 
router.post("/user/:username", upload.single("image"),async(req, res) => {
    try {
        
        console.log(`HIT IMAGES/USER POST REQUEST, username is ${req.params.username} and the path is ${req.filePath}`)
        const username = req.params.username
        const path = req.filePath 

        
        //make sure to delete the photo in images/  if there was a previous value in  class_picture
        
        const user = await pool.query(`
        UPDATE users 
        SET profile_picture = ($1)
        WHERE username = ($2)
        `,[path, username])
        res.json(user.rows)
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})




module.exports = router