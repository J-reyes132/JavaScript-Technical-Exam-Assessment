const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('callcenter', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'mysql'
});

const Banco = require('./Banco')(sequelize);
const TipoValidacion = require('./TipoValidacion')(sequelize);
const CampoValidacion = require('./CampoValidacion')(sequelize);
const ConfiguracionValidacion = require('./ConfiguracionValidacion')(sequelize);
const ConfiguracionCampo = require('./ConfiguracionCampo')(sequelize);
const Cliente = require('./Cliente')(sequelize);
const Llamada = require('./Llamada')(sequelize);
const ValidacionLlamada = require('./ValidacionLlamada')(sequelize);
const Agente = require('./Agente')(sequelize);
const TipoCuenta = require('./TipoCuenta')(sequelize);
const ConfiguracionTipoCuenta = require('./ConfiguracionTipoCuenta')(sequelize);
const Auditoria = require('./Auditoria')(sequelize);

module.exports = {
  sequelize,
  Banco,
  TipoValidacion,
  CampoValidacion,
  ConfiguracionValidacion,
  ConfiguracionCampo,
  Cliente,
  Llamada,
  ValidacionLlamada,
  Agente,
  TipoCuenta,
  ConfiguracionTipoCuenta,
  Auditoria
};