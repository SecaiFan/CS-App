const Router = require('express');
const router = Router.Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const cookieMiddleware = require('../middleware/cookieMiddleware');

router.get('/registration', authMiddleware, userController.sendCandidatesData);
router.post('/registration',
    body('login')
        .escape(),
    body('password')
        .trim()
        .isLength({min: 6})
        .withMessage("Пароль должен содержать не менее 6 символов")
        .escape()
        .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, "i")
        .withMessage("Пароль должен содержать хотя бы один символ, не являющийся цифрой"),
    userController.registration);
router.get('/login', authMiddleware, userController.sendUserData);
router.post('/login',
    body('login')
        .escape(),
    body('password')
        .escape(),
    userController.login);
router.get('/greet',cookieMiddleware, userController.greetingUser);
router.get('/logout',cookieMiddleware, userController.logout);

module.exports = router;