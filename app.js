const express = require("express");

const feedRoutes = require("./routes/feed");

const bp = require("body-parser");

const app = express();

app.use(bp.json());

app.use("/feed", feedRoutes);

app.listen(8080);
