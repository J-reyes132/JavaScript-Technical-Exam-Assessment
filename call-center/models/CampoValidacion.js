const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('CampoValidacion', {
  id_campo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_campo: DataTypes.STRING,
  etiqueta: DataTypes.STRING,
  tipo_dato: DataTypes.STRING,
  validacion_regex: DataTypes.STRING,
  es_sensible: DataTypes.BOOLEAN,
  descripcion: DataTypes.STRING
}, { tableName: 'campo_validacion', timestamps: false });