const User = require('../models/user');

exports.inscription = (req, res, next) => {
  //delete req.body._id;   // suppression de l'_id car il est généré par MDB
  const user = new User({ // nouvelle instance du model thing
    ...req.body //'spread...'selectionne toutes les informations de l'objet sans les détailler (corps de la requette)
  });
  user.save()    // Enregistre l'objet dans la base
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))// reponse à la FE sinon expiration de la req
    .catch(error => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  user.findOne({_id: req.params.id})
  .then((user) => {res.status(200).json(user);})
  .catch((error) => {res.status(404).json({error: error});});
};