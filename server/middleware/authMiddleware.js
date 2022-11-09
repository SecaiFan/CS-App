//const jwt = require('jsonwebtoken');
const User = require("../models/models");

module.exports = function (req, res, next) {
    if(req.method === 'OPTIONS') {
        next();
    }
    try {
        const token = req.cookies.token;
        if(!token) {
            next();
        } else {
            const candidate = User.findOne({where: {token: token}});
            if(candidate) {
                return res.status(303).cookie('token', token, {
                    maxAge: 12*3600,
                    secure: true,
                    httpOnly: true,
                }).redirect('greet');
            } else {
                next();
            }
        }
    } catch(e) {
        return res.status(401).json({message:"Authorization error"});
    }
};