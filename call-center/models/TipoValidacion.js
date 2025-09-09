const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('TipoValidacion', {
  id_tipo_validacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: DataTypes.STRING,
  descripcion: DataTypes.STRING,
  activo: DataTypes.BOOLEAN
}, { tableName: 'tipo_validacion', timestamps: false });