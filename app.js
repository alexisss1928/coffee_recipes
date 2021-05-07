const express = require("express");
const app = express();
const path = require("path");
const colors = require("colors");
const PORT = process.env.PORT || 5000;

// ========================
// Mongo Configuration
// ========================
const MongoClient = require("mongodb").MongoClient;
const connectionString =
  "mongodb+srv://batchUser:batchUser01@cluster0.m7wk6.mongodb.net/batch_25?retryWrites=true&w=majority";

// ========================
// Multer Configuration
// ========================
const multer = require("multer");
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("image");

// =========================
// Cloudinary configuration
// =========================
const { config, uploader } = require("cloudinary");
const cloudinaryConfig = (req, res, next) => {
  config({
    cloud_name: "dogcmulpu",
    api_key: "829532235448456",
    api_secret: "iiO-jozikyXBHUihsub6PR1685s",
  });
  next();
};

// ========================
// DataURI configuration
// ========================
const Datauri = require("datauri/parser");
const dUri = new Datauri();
const dataUri = (req) =>
  dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

// ========================
// Models moongose
// ========================
const Recipe = require("./models/Recipe");

// ========================
// Connect Mongo
// ========================
MongoClient.connect(connectionString, {
  useUnifiedTopology: true,
})
  .then((client) => {
    console.log("Connected to Database".bgGreen.black.bold);
    const db = client.db("drinks_db"); //Connect DB
    const drinksColleciotn = db.collection("drinks"); //Connect collection

    // ========================
    // Configuration
    // ========================
    app.set("view engine", "ejs");

    // ========================
    // Middlewares
    // ========================
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

    app.get("/recipe/:drink/delete", async (req, res) => {
      const { drink } = req.params;
      const deleteDB = await db
        .collection("drinks")
        .findOneAndDelete({ title: drink });
      await uploader.destroy(deleteDB.value.public_id);
      res.redirect("/");
    });

    app.post("/addDrinks", multerUploads, (req, res) => {
      console.log(req.file.originalname);
      if (req.file) {
        const file = dataUri(req).content;
        return uploader
          .upload(file, { resource_type: "image" })
          .then((result) => {
            const page = new Recipe();

            page.title = req.body.title;
            page.recipe = req.body.recipe;
            page.quantity = req.body.quantity;
            page.image = req.file.image;
            page.path = result.secure_url;
            page.originalname = req.file.originalname;
            page.public_id = result.public_id;

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
