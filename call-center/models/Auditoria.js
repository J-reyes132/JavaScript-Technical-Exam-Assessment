const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Auditoria', {
  id_auditoria: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tabla_afectada: DataTypes.STRING,
  operacion: DataTypes.STRING,
  id_usuario: DataTypes.INTEGER,
  fecha_hora: DataTypes.DATE,
  datos_anteriores: DataTypes.STRING,
  datos_nuevos: DataTypes.STRING,
  ip_origen: DataTypes.STRING
}, { tableName: 'auditoria', timestamps: false });