const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('TipoCuenta', {
  id_tipo_cuenta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  codigo: DataTypes.STRING,
  requiere_validacion_especial: DataTypes.BOOLEAN
}, { tableName: 'tipo_cuenta', timestamps: false });