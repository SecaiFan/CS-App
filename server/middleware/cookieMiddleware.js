const jwt = require('jsonwebtoken');
const User = require("../models/models");

module.exports = function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.cookies.token;
        if(!token) return res.status(401).redirect('registration');
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.login = decoded.login;
        next();
    } catch(e) {
        return res.status(401).json({message:"Cookie error"});
    }
};