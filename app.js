const express = require("express");

const feedRoutes = require("./routes/feed");

const bp = require("body-parser");

const cors = require("cors");

const app = express();

app.use(bp.json());

app.use(cors());

app.use("/feed", feedRoutes);

app.listen(8080);
