const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('ConfiguracionTipoCuenta', {
  id_config_cuenta: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_configuracion: { type: DataTypes.INTEGER },
  id_tipo_cuenta: { type: DataTypes.INTEGER },
  reglas_adicionales: DataTypes.STRING
}, { tableName: 'configuracion_tipo_cuenta', timestamps: false });