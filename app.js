const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bp = require("body-parser");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bp.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated.");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided." });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  console.log(req.file);
  return res.status(201).json({
    message: "File stored.",
    filePath: req.file.path.replace("\\", "/"),
  });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn: (err) => {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occured.";
      const code = err.originalError.code || 500;
      const path = err.path;
      return { message: message, status: code, data: data, path: path };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://berat:berat@cluster0.2nxyobm.mongodb.net/messages?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
