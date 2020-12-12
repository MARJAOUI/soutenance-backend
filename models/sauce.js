const mongoose = require('mongoose');

const sauceValidator = require('../middleware/sauceValidator'); // importion du middleware pour validation des sauces

const sauceSchema = mongoose.Schema({
  userId: {type: String, required: true},
  name: {type: String, required: true, validate: sauceValidator.stringValidation}, ///middleware/sauceValidator.js
  manufacturer: {type: String, required: true, validate: sauceValidator.stringValidation}, ///middleware/sauceValidator.js
  description: {type: String, required: true, validate: sauceValidator.descriptionValidation}, ///middleware/sauceValidator.js
  mainPepper: {type: String, required: true, validate: sauceValidator.stringValidation}, ///middleware/sauceValidator.js
  imageUrl: {type: String, required: true},
  heat: {type: Number, required: true},
  likes: {type: Number, required: true},
  dislikes: {type: Number, required: true},
  usersLiked: {type: [String], required: true},
  usersDisliked: {type: [String], required: true},
});
module.exports = mongoose.model('Sauce', sauceSchema);