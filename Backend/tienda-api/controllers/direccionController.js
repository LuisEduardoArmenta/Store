const Direccion = require('../models/Direccion');
const Usuario = require('../models/Usuario');
const { Op } = require('sequelize');

// @desc    Obtener todas las direcciones del usuario
// @route   GET /direcciones
// @access  Private
const obtenerDirecciones = async (req, res) => {
  try {    
    const direcciones = await Direccion.findAll({
      where: { usuarioId: req.usuario.id },
      order: [['esPrincipal', 'DESC'], ['createdAt', 'ASC']]
    });

    res.json(direcciones);
  } catch (error) {
    console.error('❌ Error al obtener direcciones:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ message: 'Error en el servidor al obtener direcciones.' });
  }
};

// @desc    Crear nueva dirección
// @route   POST /direcciones
// @access  Private
const crearDireccion = async (req, res) => {
  try {
    const {
      nombre,
      direccionCompleta,
      ciudad,
      estado,
      codigoPostal,
      pais = 'México',
      esPrincipal = false,
      telefono,
      referencias
    } = req.body;

    // Validaciones básicas
    if (!nombre || !direccionCompleta || !ciudad || !estado || !codigoPostal) {
      return res.status(400).json({ 
        message: 'Nombre, dirección completa, ciudad, estado y código postal son requeridos.' 
      });
    }

    // Si se marca como principal, desmarcar otras direcciones principales
    if (esPrincipal) {
      await Direccion.update(
        { esPrincipal: false },
        { where: { usuarioId: req.usuario.id } }
      );
    }

    // Si es la primera dirección del usuario, marcarla como principal automáticamente
    const direccionesExistentes = await Direccion.count({
      where: { usuarioId: req.usuario.id }
    });

    const nuevaDireccion = await Direccion.create({
      usuarioId: req.usuario.id,
      nombre,
      direccionCompleta,
      ciudad,
      estado,
      codigoPostal,
      pais,
      esPrincipal: esPrincipal || direccionesExistentes === 0,
      telefono,
      referencias
    });

    res.status(201).json({
      message: 'Dirección creada exitosamente.',
      direccion: nuevaDireccion
    });
  } catch (error) {
    console.error('Error al crear dirección:', error);
    res.status(500).json({ message: 'Error en el servidor al crear la dirección.' });
  }
};

// @desc    Actualizar dirección
// @route   PUT /direcciones/:id
// @access  Private
const actualizarDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      direccionCompleta,
      ciudad,
      estado,
      codigoPostal,
      pais,
      esPrincipal,
      telefono,
      referencias
    } = req.body;

    // Verificar que la dirección pertenezca al usuario
    const direccion = await Direccion.findOne({
      where: { id, usuarioId: req.usuario.id }
    });

    if (!direccion) {
      return res.status(404).json({ message: 'Dirección no encontrada.' });
    }

    // Si se marca como principal, desmarcar otras direcciones principales
    if (esPrincipal && !direccion.esPrincipal) {
      await Direccion.update(
        { esPrincipal: false },
        { where: { usuarioId: req.usuario.id, id: { [Op.ne]: id } } }
      );
    }

    // Actualizar la dirección
    await direccion.update({
      nombre: nombre || direccion.nombre,
      direccionCompleta: direccionCompleta || direccion.direccionCompleta,
      ciudad: ciudad || direccion.ciudad,
      estado: estado || direccion.estado,
      codigoPostal: codigoPostal || direccion.codigoPostal,
      pais: pais || direccion.pais,
      esPrincipal: esPrincipal !== undefined ? esPrincipal : direccion.esPrincipal,
      telefono: telefono !== undefined ? telefono : direccion.telefono,
      referencias: referencias !== undefined ? referencias : direccion.referencias
    });

    res.json({
      message: 'Dirección actualizada exitosamente.',
      direccion
    });
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    res.status(500).json({ message: 'Error en el servidor al actualizar la dirección.' });
  }
};

// @desc    Eliminar dirección
// @route   DELETE /direcciones/:id
// @access  Private
const eliminarDireccion = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la dirección pertenezca al usuario
    const direccion = await Direccion.findOne({
      where: { id, usuarioId: req.usuario.id }
    });

    if (!direccion) {
      return res.status(404).json({ message: 'Dirección no encontrada.' });
    }

    const eraPrincipal = direccion.esPrincipal;
    await direccion.destroy();

    // Si era la dirección principal, marcar otra como principal
    if (eraPrincipal) {
      const otraDireccion = await Direccion.findOne({
        where: { usuarioId: req.usuario.id },
        order: [['createdAt', 'ASC']]
      });

      if (otraDireccion) {
        await otraDireccion.update({ esPrincipal: true });
      }
    }

    res.json({ message: 'Dirección eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    res.status(500).json({ message: 'Error en el servidor al eliminar la dirección.' });
  }
};

// @desc    Establecer dirección como principal
// @route   PUT /direcciones/:id/principal
// @access  Private
const establecerPrincipal = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la dirección pertenezca al usuario
    const direccion = await Direccion.findOne({
      where: { id, usuarioId: req.usuario.id }
    });

    if (!direccion) {
      return res.status(404).json({ message: 'Dirección no encontrada.' });
    }

    // Desmarcar todas las direcciones como principales
    await Direccion.update(
      { esPrincipal: false },
      { where: { usuarioId: req.usuario.id } }
    );

    // Marcar esta dirección como principal
    await direccion.update({ esPrincipal: true });

    res.json({
      message: 'Dirección establecida como principal exitosamente.',
      direccion
    });
  } catch (error) {
    console.error('Error al establecer dirección principal:', error);
    res.status(500).json({ message: 'Error en el servidor al establecer la dirección principal.' });
  }
};

module.exports = {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  establecerPrincipal
};
