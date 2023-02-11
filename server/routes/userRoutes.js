const express = require('express')
const router = express.Router()

const {register, login, changePassword, loggedUser, sendUserPasswordResetMail, userPasswordReset, assignIncharge, getAllUsers, getAllUserRole, getAllInchargeRole, getOneUser, getOneIncharge, userCount, inchargeCount} = require('../controllers/userController');
const { checkUserAuth, checkIfAdmin } = require('../middlewares/authMiddleware');

//route level middleware - protects route

// login protected
router.use('/changePassword', checkUserAuth)
router.use('/loggedUser', checkUserAuth)

// admin only login protected
router.use('/assignIncharge', checkIfAdmin)
router.use('/getAllUsers', checkIfAdmin)
router.use('/getAllUserRole', checkIfAdmin)
router.use('/getAllInchargeRole', checkIfAdmin)
router.use('/getOneUser', checkIfAdmin)
router.use("/getOneIncharge", checkIfAdmin);
router.use("/userCount", checkIfAdmin);
router.use("/inchargeCount", checkIfAdmin);

// incharge only login protected


//public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-reset-password-mail', sendUserPasswordResetMail)
router.post('/reset-password/:id/:token', userPasswordReset )


//protected routes
router.post('/changePassword', changePassword)
router.get('/loggedUser', loggedUser)

//protected admin
router.get('/assignIncharge', assignIncharge)
router.get('/getAllUsers', getAllUsers)
router.get('/getAllUserRole', getAllUserRole)
router.get('/getAllInchargeRole', getAllInchargeRole)
router.get('/getOneUser', getOneUser)
router.get("/getOneIncharge", getOneIncharge);
router.get("/userCount", userCount);
router.get("/inchargeCount", inchargeCount);


module.exports = router