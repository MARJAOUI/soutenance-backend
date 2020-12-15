const express = require('express');    // importations
const app = express();
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 
const path = require('path');

const Sauce = require('./models/sauce'); // désignation du model pour les sauces
const User = require('./models/user');     // désignation du model pour les users
const userRoutes = require('./routes/user'); // designation du router pour les users
const sauceRoutes = require('./routes/sauce'); // designation du router pour les sauces

// paramétrage des headers de sécurité

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // nom de domaine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

 // connexion à la base de données

mongoose.connect('mongodb+srv://ocrPekocko:OCR2020@pekocko.okefo.mongodb.net/test?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
  	console.log('Connexion à MongoDB avec ocrPekocko réussie !');
  })
  .catch(() => {
  	console.log('Connexion à MongoDB  avec ocrPekocko échouée !');
});

app.use('/images', express.static(path.join(__dirname, 'images'))); // express sert le dossier statique ' images'

// addresses des chemins de l' API
app.use('/api/sauces', sauceRoutes); 
app.use('/api/auth', userRoutes);

module.exports = app;