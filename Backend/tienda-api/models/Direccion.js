const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Direccion = sequelize.define('Direccion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Nombre descriptivo para la dirección (ej: Casa, Oficina, etc.)'
  },
  direccionCompleta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false
  },
  codigoPostal: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pais: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'México'
  },
  esPrincipal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Teléfono de contacto para esta dirección'
  },
  referencias: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Referencias adicionales para encontrar la dirección'
  }
}, {
  tableName: 'direcciones',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Establecer relaciones
Usuario.hasMany(Direccion, { 
  foreignKey: 'usuarioId', 
  as: 'direcciones',
  onDelete: 'CASCADE'
});

Direccion.belongsTo(Usuario, { 
  foreignKey: 'usuarioId', 
  as: 'usuario' 
});

module.exports = Direccion;