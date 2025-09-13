const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const protect = async (req, res, next) => {
  let token;

  // Buscamos el token en la cabecera 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extraer el token de 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificar el token con nuestro secreto
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Buscar al usuario en la BD y adjuntarlo a la petición (sin la contraseña)
      // Esto asegura que el usuario del token todavía existe.
      const usuario = await Usuario.findByPk(decoded.id, {
        attributes: ['id', 'nombre', 'email', 'rol']
      });
      
      if (!usuario) {
        return res.status(401).send('No autorizado, usuario no encontrado.');
      }

      req.usuario = usuario; // Adjuntamos el usuario al objeto req

      next(); // El token es válido, continuamos a la siguiente función (el controlador)
    } catch (error) {
      console.error(error);
      res.status(401).send('No autorizado, token inválido.');
    }
  }

  if (!token) {
    res.status(401).send('No autorizado, no se proporcionó un token.');
  }
};

module.exports = { protect };
