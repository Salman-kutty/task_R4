const router = require('express').Router();
const userCtrl = require('./controller/userCtrl');
router.post('/signUp', userCtrl.signUp)
router.put('/updatePassword', userCtrl.updatePassword)

module.exports = router;