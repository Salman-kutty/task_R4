const router = require('express').Router();
const userCtrl = require('./controller/userCtrl');

router.post('/signUp', userCtrl.signUp)
router.put('/updatePassword', userCtrl.updatePassword);
router.post('/forgetPassword', userCtrl.forgetPassword);
router.get('/forget', userCtrl.forget)


module.exports = router;