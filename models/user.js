const mongoose = require('mongoose');// importation de mangoose
const uniqueValidator = require('mongoose-unique-validator');//importation de mongoose-unique-validator : un user unique

const userSchema = mongoose.Schema({
	email: {type: String, required: true, unique: true},//le user ne peut créer deux comptes avec la meme adresse E_mail
	password: {type: String, required: true},
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);

