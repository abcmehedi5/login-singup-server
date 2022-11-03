const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const { ServerApiVersion } = require("mongodb");
const SingUpRouter = require("./Controller/SingUpRouter");
const LoginRouter = require("./Controller/LoginRouter");
app = express();

// running message
app.get("/", (req, res) => {
  res.send("hello words");
});

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// EJS
app.set("view engine", "ejs");
// mongodb connect with mongoose
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  })

  .then(() => {
    console.log("database connection success");
  })
  .catch((err) => {
    console.log(err);
  });

// router controller
app.use("/auth", SingUpRouter);
app.use("/user", LoginRouter);
app.listen(process.env.PORT, () => {
  console.log(`app listening to port: ${process.env.PORT}`);
});
