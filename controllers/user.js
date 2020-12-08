const bcrypt = require('bcrypt');  // 
const jwt = require('jsonwebtoken'); // importation de JWT pour la création et vérification des token

const passwordValidator = require('password-validator'); //importation de password-validator
//const maskData = require('maskdata');//mask data is used to hide part of the data

const User = require('../models/user');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)   // algorythme de cryptage du mot de passe: fonction asynchrone
    .then(hash => {
      const user = new User({        //  déclaration d'un nouvel utilisateur avec pour objet
        email: req.body.email,      //  adresse mail
        password: hash             // mot de passe créé et crypté
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // renvoi statut 2001 pour ne pas figer la fonction
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error: 'Le mot de passe ne respecte pas les prérequis préconisés'}));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // récupération du user avec l'adresse mail
    .then(user => {
      if (!user) { // si user non connu
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password) // si user existe: comparaison des MDP
        .then(valid => {
          if (!valid) { // si MDP diffrent
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({ // si MDP identique
            userId: user._id,
            token: jwt.sign(  // fonction sign de jwt avec 3 arguments
              { userId: user._id },  // 1 userID
              'RANDOM_TOKEN_SECRET', // 2 chaine de caractères du token
              { expiresIn: '24h' } //   3 delai d'expiration du token
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

