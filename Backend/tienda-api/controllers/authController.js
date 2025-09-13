const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// @desc    Registrar un nuevo usuario
// @route   POST /api/usuarios/registro
// @access  Public
const registrarUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, telefono, fechaNacimiento } = req.body;
    if (!nombre || !apellido || !email || !password || !telefono) {
      return res.status(400).send('Todos los campos obligatorios deben ser proporcionados.');
    }

    const existingUser = await Usuario.findOne({
      where: { email }
    });
    if (existingUser) {
      return res.status(409).send('El correo electrónico ya está registrado.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordCifrado = bcrypt.hashSync(password, salt);

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: passwordCifrado,
      telefono,
      fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null
    });

    // Generar token para login automático después del registro
    const payload = { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const usuarioParaRespuesta = { 
      id: nuevoUsuario.id, 
      nombre: nuevoUsuario.nombre, 
      apellido: nuevoUsuario.apellido, 
      email: nuevoUsuario.email, 
      telefono: nuevoUsuario.telefono, 
      rol: nuevoUsuario.rol, 
      fechaNacimiento: nuevoUsuario.fechaNacimiento 
    };

    res.status(201).json({ 
      message: `Usuario ${email} registrado con éxito.`, 
      token: token,
      usuario: usuarioParaRespuesta 
    });

  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).send('Error en el servidor al intentar registrar el usuario.');
  }
};

// @desc    Autenticar (login) un usuario
// @route   POST /api/usuarios/login
// @access  Public
const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email y password son requeridos.');
    }

    const usuario = await Usuario.findOne({
      where: { email }
    });
    if (!usuario) {
      return res.status(401).send('Credenciales inválidas.');
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).send('Credenciales inválidas.');
    }

    const payload = { id: usuario.id, email: usuario.email, rol: usuario.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Devolver los datos del usuario (sin la contraseña)
    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      fechaNacimiento: usuario.fechaNacimiento
    };

    res.json({ 
      message: 'Login exitoso', 
      token: token,
      usuario: usuarioResponse 
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send('Error en el servidor al intentar iniciar sesión.');
  }
};

// @desc    Obtener perfil del usuario
// @route   GET /api/usuarios/perfil
// @access  Private
const getMiPerfil = async (req, res) => {
  // El middleware 'protect' ya nos ha dado req.user, simplemente lo devolvemos.
  res.json(req.user);
};

module.exports = { registrarUsuario, loginUsuario, getMiPerfil };
