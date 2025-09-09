const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Banco', {
  id_banco: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  codigo_banco: DataTypes.STRING,
  activo: DataTypes.BOOLEAN,
  fecha_creacion: DataTypes.DATE
}, { tableName: 'banco', timestamps: false });