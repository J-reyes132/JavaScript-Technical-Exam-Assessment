const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('Llamada', {
  id_llamada: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_cliente: { type: DataTypes.INTEGER },
  id_agente: { type: DataTypes.INTEGER },
  fecha_hora_inicio: DataTypes.DATE,
  fecha_hora_fin: DataTypes.DATE,
  motivo_llamada: DataTypes.STRING,
  estado_validacion: DataTypes.STRING,
  campos_correctos: DataTypes.INTEGER,
  campos_requeridos: DataTypes.INTEGER
}, { tableName: 'llamada', timestamps: false });