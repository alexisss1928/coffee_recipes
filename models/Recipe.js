const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
  title: { type: String },
  recipe: { type: String },
  quantity: { type: String },
  image: { type: String },
  path: { type: String },
  originalname: { type: String },
  public_id: { type: String },
});

module.exports = model("Recipe", recipeSchema);
