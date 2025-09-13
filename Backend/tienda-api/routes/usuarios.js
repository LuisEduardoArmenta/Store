const express = require('express');
const router = express.Router();
const { registrarUsuario, loginUsuario, getMiPerfil } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// --- Rutas Públicas ---
// Cualquiera puede acceder a estas rutas
router.post('/register', registrarUsuario); // Cambiar a /register para coincidir con el frontend
router.post('/login', loginUsuario);

// --- Rutas Privadas ---
// Solo usuarios con un token válido pueden acceder
router.get('/perfil', protect, getMiPerfil);
router.get('/verify', protect, (req, res) => {
  // Si llegamos aquí, el token es válido (gracias al middleware protect)
  res.json({ valid: true, user: req.usuario });
});


module.exports = router;
