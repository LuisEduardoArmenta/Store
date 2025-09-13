const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  establecerPrincipal
} = require('../controllers/direccionController');

// Todas las rutas de direcciones requieren autenticación
router.use(protect);

// @route   GET /direcciones
// @desc    Obtener todas las direcciones del usuario
// @access  Private
router.get('/', obtenerDirecciones);

// @route   POST /direcciones
// @desc    Crear nueva dirección
// @access  Private
router.post('/', crearDireccion);

// @route   PUT /direcciones/:id
// @desc    Actualizar dirección
// @access  Private
router.put('/:id', actualizarDireccion);

// @route   DELETE /direcciones/:id
// @desc    Eliminar dirección
// @access  Private
router.delete('/:id', eliminarDireccion);

// @route   PUT /direcciones/:id/principal
// @desc    Establecer dirección como principal
// @access  Private
router.put('/:id/principal', establecerPrincipal);

module.exports = router;
