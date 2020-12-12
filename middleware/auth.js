const jwt = require('jsonwebtoken'); // importation de jsonwebtoken

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];  // extraction du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');// comparaison des tokens
    const userId = decodedToken.userId; // declaration de l'id extrait du token
    if (req.body.userId && req.body.userId !== userId) { // s il est diffrent
      throw 'Invalid user ID'; //  generation erreur
    } else {
      next(); // sinon on passe au midlleware suivant
    }
  } catch {
    res.status(401).json({
    error: new Error('Invalid request!')
    });
  }
};