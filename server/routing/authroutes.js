const express = require('express');
const router = express.Router()
const {usersignup, userlogin} = require("../controllers/authController")

router.post('/signup', usersignup)
router.post("/signin",userlogin )

module.exports = router;