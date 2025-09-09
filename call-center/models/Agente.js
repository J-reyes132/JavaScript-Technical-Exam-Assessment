const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Agente', {
  id_agente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo_empleado: DataTypes.STRING,
  nombre_completo: DataTypes.STRING,
  email: DataTypes.STRING,
  activo: DataTypes.BOOLEAN
}, { tableName: 'agente', timestamps: false });