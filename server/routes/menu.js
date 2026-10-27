const express = require('express');
const router = express.Router();
const { obtenerMenu, crearProducto } = require('../controllers/menuController');

// Con el prefijo /api/menu (definido en index.js):
router.get('/', obtenerMenu);    // GET  /api/menu
router.post('/', crearProducto); // POST /api/menu

module.exports = router;