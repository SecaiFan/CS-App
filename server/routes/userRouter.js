const Router = require('express');
const router = Router.Router();
const {body} = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const cookieMiddleware = require('../middleware/cookieMiddleware');

router.get('/registration', authMiddleware, userController.sendCandidatesData);
router.post('/registration',
    body('login')
        .isEmail()
        .withMessage("Incorrect email")
        .escape(),
    body('password')
        .trim()
        .isLength({min: 6})
        .withMessage("Must be at least 6 chars long")
        .escape()
        .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, "i")
        .withMessage("Password is weak. Try again"),
    userController.registration);
router.get('/login', authMiddleware, userController.sendUserData);
router.post('/login', userController.login);
router.get('/greet',cookieMiddleware, userController.greetingUser);
router.get('/logout',cookieMiddleware, userController.logout);

module.exports = router;