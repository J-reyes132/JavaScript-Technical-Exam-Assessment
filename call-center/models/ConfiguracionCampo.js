const { DataTypes } = require('sequelize');
module.exports = (sequelize) => sequelize.define('ConfiguracionCampo', {
  id_config_campo: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_configuracion: { type: DataTypes.INTEGER },
  id_campo: { type: DataTypes.INTEGER },
  orden_presentacion: DataTypes.INTEGER,
  es_obligatorio: DataTypes.BOOLEAN,
  valor_por_defecto: DataTypes.STRING
}, { tableName: 'configuracion_campo', timestamps: false });