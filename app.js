const express = require("express");
const app = express();
const path = require("path");
const colors = require("colors");
const PORT = process.env.PORT || 5000;

const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://batchUser:batchUser01@cluster0.m7wk6.mongodb.net/batch_25?retryWrites=true&w=majority";

const multer = require("multer");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");

const { config, uploader } = require("cloudinary");
const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: "dogcmulpu",
    api_key: "829532235448456",
    api_secret: "iiO-jozikyXBHUihsub6PR1685s",
  });
  next();
};

const Datauri = require("datauri/parser");
const dUri = new Datauri();
const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

const Recipe = require("./models/Recipe");

MongoClient.connect(connectionString, {
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to Database".bgGreen.black.bold);
    const db = client.db("drinks_db");
    const drinksColleciotn = db.collection("drinks");

    // ========================
    // Configuration
    // ========================
    app.set("view engine", "ejs");
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, "public")));
    app.use(express.static(path.join(__dirname, "views")));
    app.use("*", cloudinaryConfig);

    // ========================
    // Routes
    // ========================
    app.get("/", (req, res) => {
      db.collection("drinks")
        .find()
        .toArray()
        .then((drinks) => {
          res.render("index", { drinks: drinks });
        });
    });

    app.get("/recipe/:drink", (req, res) => {
      const { drink } = req.params;
      db.collection("drinks")
        .find({ title: drink })
        .forEach((x) => {
          res.render("drinkpage", { drink: x });
        });
    });

    app.get("/recipe/:drink/delete", (req, res) => {
      const { drink } = req.params;
      db.collection("drinks").findOneAndDelete({ title: drink });
      res.redirect("/");
    });

    app.post("/addDrinks", multerUploads, (req, res) => {
      if (req.file) {
        const file = dataUri(req).content;
        return uploader
          .upload(file)
          .then((result) => {
            const page = new Recipe();

            page.title = req.body.title;
            page.recipe = req.body.recipe;
            page.quantity = req.body.quantity;
            page.image = req.file.image;
            page.path = result.secure_url;
            page.originalname = req.file.originalname;

            drinksColleciotn.insertOne(page);
          })
          .then(() => res.redirect("/"))
          .catch((error) => console.log("Something went wrong".bgRed.white));
      }
    });

    // ========================
    // Listen
    // ========================
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`.bgGreen.black.bold);
    });
  })
  .catch((error) => console.error(error));
