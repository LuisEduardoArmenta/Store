const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario');
const Direccion = require('./models/Direccion'); // <-- 1. Importar el nuevo modelo

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const direccionesRoutes = require('./routes/direcciones');

const app = express();
const port = 3000;

// Configurar CORS para permitir peticiones desde el frontend
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para entender JSON
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.send('¡API de la tienda funcionando con estructura organizada!');
});

// Montar las rutas de la API
app.use('/auth', usuariosRoutes); // Cambiar a /auth para coincidir con el frontend
app.use('/direcciones', direccionesRoutes);
// Futuro: app.use('/api/productos', productosRoutes);
// Futuro: app.use('/api/pedidos', pedidosRoutes);

// Las asociaciones ya están definidas en el modelo Direccion.js

// Sincronizar la base de datos y levantar el servidor
sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
    app.listen(port, () => {
      console.log(`Servidor de la tienda escuchando en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });