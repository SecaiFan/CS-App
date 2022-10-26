const Router = require('express');
const router = Router.Router();
const userRouter = require('./userRouter');

router.get('/', (req, res)=> {
     res.redirect('/api/user/registration');
});
router.use('/user', userRouter);

module.exports = router;