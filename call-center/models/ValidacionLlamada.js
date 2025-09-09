const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('ValidacionLlamada', {
  id_validacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_llamada: { type: DataTypes.INTEGER },
  id_campo: { type: DataTypes.INTEGER },
  valor_proporcionado: DataTypes.STRING,
  valor_esperado: DataTypes.STRING,
  es_correcto: DataTypes.BOOLEAN,
  timestamp_validacion: DataTypes.DATE
}, { tableName: 'validacion_llamada', timestamps: false });