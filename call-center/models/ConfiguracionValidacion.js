const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('ConfiguracionValidacion', {
  id_configuracion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_banco: { type: DataTypes.INTEGER },
  id_tipo_validacion: { type: DataTypes.INTEGER },
  campos_minimos_requeridos: DataTypes.INTEGER,
  activo: DataTypes.BOOLEAN,
  fecha_vigencia_inicio: DataTypes.DATE,
  fecha_vigencia_fin: DataTypes.DATE
}, { tableName: 'configuracion_validacion', timestamps: false });