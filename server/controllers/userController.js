const ApiError = require('../error/apiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/models');

const generateJWT = function(id, login, role) {
    return jwt.sign(
        {id: id, login: login, role: role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
};

class UserController {
    async registration(req, res, next) {
        try {
            const {login, password, role} = req.body;
            if(!login || !password) {
                return next(ApiError.badRequest("Некорректный login или password!"));
            }
            const candidate = await User.findOne({where: {login: login}});
            if (candidate) {
                return next(ApiError.badRequest("Пользователь с таким login-ом уже существует"));
            }
            const hashPassword = await bcrypt.hash(password, 5);
            const user = await User.create({login, role, password: hashPassword});
            const token = generateJWT(user.id, user.login, user.role);
            return res.json({token});
        } catch(e) {
            console.log(e);
            res.status(400).json({message:"Registration error!"});
        }
    }
    async login(req, res, next) {
        try {
            const {login, password} = req.body;
            if(!login || !password) {
                return next(ApiError.badRequest("Некорректный login или password!"));
            }
            const user = await User.findOne({where: {login: login}});
            if (!user) {
                return next(ApiError.badRequest("Пользователь с таким login-ом не найден"));
            }
            let comparePassword = await bcrypt.compare(password, user.password);
            if(!comparePassword) {
                return next(ApiError.badRequest("Неверный пароль"));
            }
            const token = generateJWT(user.id, user.login, user.role);
            return res.json({token});
        } catch(e) {
            console.log(e);
            res.status(400).json({message:"Login error!"});
        }
    }
    async check(req, res) {
        const token = generateJWT(req.user.id, req.user.login, req.user.role);
        return res.json({token});
    }
    async sendCandidatesData(req, res) {
        res.render('index', {layout: false});
    }
}

module.exports = new UserController();