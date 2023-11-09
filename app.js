const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const feedRoutes = require("./routes/feed");

const bp = require("body-parser");

const cors = require("cors");

const app = express();

app.use(bp.json());
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  res.status(status).json({ message: message });
});

mongoose
  .connect(
    "mongodb+srv://berat:berat@cluster0.2nxyobm.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
