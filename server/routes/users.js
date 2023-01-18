const express = require("express")
const pool = require("../connection")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()


const router = express.Router()

// get all users 
router.get("/", async(req, res) => {
    try {
        // query user 
        const users = await pool.query(`
        Select username, profile_picture, date_created
        FROM users
        `,)
        res.json(users.rows)
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})

// get user 
router.get("/:username", async(req, res) => {
    try {
        const username = req.params.username
        console.log("in get user, username is", username)

        // query user 
        const user = await pool.query(`
        Select username, profile_picture, date_created
        FROM users
        WHERE username = ($1)
        `, [username])
        res.json(user.rows)
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})
// post a user 
router.post("/", async (req, res)  => {
    try {
        const {username, password} = req.body 
        console.log(`username: ${username} password: ${password}`)

        // hash password before storing it 
        const salt = await bcrypt.genSalt() 
        const hashedPassword = await bcrypt.hash(password, salt)

        // store password in database 
        const user = await pool.query(`
        INSERT INTO users (username, password) 
        VALUES ($1, $2)
        RETURNING * 
        `, [username, hashedPassword])
        res.json(user.rows)
    } catch (error) {
        console.log("Error Occured", error)
        res.status(400).json({message: error})
    }
})

// login user 
router.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body 
        console.log(`username: ${username} password: ${password}`)
        

        // Check if password is correct
        const hashedPassword = await pool.query(`
        SELECT password FROM users WHERE username = ($1)
        `, [username])
        // if user doesn't exist or password does not match, throw invalid cred error
        if (hashedPassword.rows.length < 1 || 
            await bcrypt.compare(password, hashedPassword.rows[0].password) === false ) throw new Error("Invalid Credentials") 
        else {
            const user = {name: username}
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            
            console.log("hey")
            res.json({acessToken: accessToken, refreshToken: refreshToken})
        }

    } catch (error) {
        res.status(400).send(error.message)
    }
})

const insertTokenToDB = async (token) => {
    await  pool.query(`INSERT INTO refresh_tokens (token) values ($1)`, [token])
    return;
}


module.exports = router