const express = require("express");
const bodyParser = require("body-parser");
const cardsRouter = require("./routes/cards.js");
const decksRouter = require("./routes/decks.js");
const classesRouter = require("./routes/classes.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const imagesRouter = require("./routes/images");

//middlewares
const { authenticateToken } = require("./middlewares/authentication.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://flashcard-client.vercel.app",
      "https://flashcard-client-production.up.railway.app",
      "http://localhost:3000",
    ],
    methods: [
      "get",
      "GET",
      "post",
      "POST",
      "patch",
      "PATCH",
      "delete",
      "DELETE",
    ],
    credentials: true,
  })
);

// static photos
app.use("/static", express.static("./images"));
// routes
app.use("/auth", authRouter);
app.use(authenticateToken);
app.use("/cards", cardsRouter);
app.use("/decks", decksRouter);
app.use("/classes", classesRouter);
app.use("/users", usersRouter);
app.use("/images", imagesRouter);

app.get("/", (req, res) => res.send("hello"));

app.listen(process.env.PORT, () =>
  console.log("i am listening on port", process.env.PORT)
);
