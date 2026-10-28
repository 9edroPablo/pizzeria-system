const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/Authcontroller');

router.post('/register', registrar); // POST /api/auth/register
router.post('/login', login);       // POST /api/auth/login

module.exports = router;
