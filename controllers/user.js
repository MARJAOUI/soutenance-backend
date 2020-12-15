const bcrypt = require('bcrypt');  // 
const jwt = require('jsonwebtoken'); // importation de JWT pour la création et vérification des token

const passwordValidator = require('password-validator'); //importation de password-validator
const User = require('../models/user');
const mongoMask = require('mongo-mask');
/*var blacklist = ['email'];
const maskjson = require('mask-json')(blacklist);*/
//const maskjson = require('mask-json');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)   // algorythme de cryptage du mot de passe: fonction asynchrone
    .then(hash => {                   // mot de pass sous forme d'algotythme
      const user = new User({        //  déclaration d'un nouvel utilisateur avec pour objet
      //email: (req.body.email),      //  adresse mail
       // email: maskData.maskEmail2(req.body.email),
        email: mongoMask(req.body.email),
        password: hash             // mot de passe créé et crypté
      });
      //console.log(email);
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // renvoi statut 2001 pour ne pas figer la fonction
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error: 'Le mot de passe ne respecte pas les prérequis préconisés'}));
};






/*exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)   // algorythme de cryptage du mot de passe: fonction asynchrone
    .then(hash => {                   // mot de pass sous forme d'algotythme
      const user = new User({        //  déclaration d'un nouvel utilisateur avec pour objet
      email: (req.body.email),
      password: hash             // mot de passe créé et crypté
      })
      user.save()
        .then(() =>res.status(201).json({ message: 'Utilisateur créé !' })
        .catch(error => res.status(400).json({ error }));
    })
       .catch(error => res.status(500).json({ error: 'Le mot de passe ne respecte pas les prérequis préconisés'}));
};*/

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
            token: jwt.sign(  // fonction sign de jwt avec 3 parametres
              { userId: user._id },  // 1 userID
              'RANDOM_TOKEN_SECRET', // 2 chaine de caractères du token qui peut ê tre crée par le développeur
              { expiresIn: '24h' } //   3 delai d'expiration du token
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

