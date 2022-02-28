const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (req, res, next) => {
    try {
        // On vérifie si le token et l'id correspond à l'utilisateur
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SCRT_TKN);
        const userId = decodedToken.userId;
        // Si l'utilisateur n'est pas le même alors on renvoie "User ID non valide"
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
            // Sinon on passe à la suite
        } else {
            next();
        };
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    };
};