const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Cliente', {
  id_cliente: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_banco: { type: DataTypes.INTEGER },
  tipo_cliente: DataTypes.STRING,
  numero_identificacion: DataTypes.STRING,
  nombre_completo: DataTypes.STRING,
  razon_social: DataTypes.STRING,
  fecha_registro: DataTypes.DATE
}, { tableName: 'cliente', timestamps: false });