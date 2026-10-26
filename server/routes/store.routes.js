const express = require('express');
const { getStatus, updateStatus } = require('../controllers/store.controller');

const router = express.Router();

router.get('/status', getStatus);
// TODO: proteger con autenticación de administrador (por ahora abierto, es un prototipo)
router.patch('/status', updateStatus);

module.exports = router;