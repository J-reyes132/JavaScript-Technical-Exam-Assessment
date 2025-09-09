const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'callcenter',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    ...(process.env.DB_SSL === 'true' && {
      dialectOptions: {
        ssl: {
          ca: process.env.DB_SSL_CA || undefined,
          key: process.env.DB_SSL_KEY || undefined,
          cert: process.env.DB_SSL_CERT || undefined,
          rejectUnauthorized: false
        }
      }
    })
  }
);

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

// Definir asociaciones
// Banco -> ConfiguracionValidacion
Banco.hasMany(ConfiguracionValidacion, { foreignKey: 'id_banco' });
ConfiguracionValidacion.belongsTo(Banco, { foreignKey: 'id_banco' });

// TipoValidacion -> ConfiguracionValidacion
TipoValidacion.hasMany(ConfiguracionValidacion, { foreignKey: 'id_tipo_validacion' });
ConfiguracionValidacion.belongsTo(TipoValidacion, { foreignKey: 'id_tipo_validacion' });

// ConfiguracionValidacion -> ConfiguracionCampo
ConfiguracionValidacion.hasMany(ConfiguracionCampo, { foreignKey: 'id_configuracion' });
ConfiguracionCampo.belongsTo(ConfiguracionValidacion, { foreignKey: 'id_configuracion' });

// CampoValidacion -> ConfiguracionCampo
CampoValidacion.hasMany(ConfiguracionCampo, { foreignKey: 'id_campo' });
ConfiguracionCampo.belongsTo(CampoValidacion, { foreignKey: 'id_campo' });

// Banco -> Cliente
Banco.hasMany(Cliente, { foreignKey: 'id_banco' });
Cliente.belongsTo(Banco, { foreignKey: 'id_banco' });

// Cliente -> Llamada
Cliente.hasMany(Llamada, { foreignKey: 'id_cliente' });
Llamada.belongsTo(Cliente, { foreignKey: 'id_cliente' });

// Agente -> Llamada
Agente.hasMany(Llamada, { foreignKey: 'id_agente' });
Llamada.belongsTo(Agente, { foreignKey: 'id_agente' });

// Llamada -> ValidacionLlamada
Llamada.hasMany(ValidacionLlamada, { foreignKey: 'id_llamada' });
ValidacionLlamada.belongsTo(Llamada, { foreignKey: 'id_llamada' });

// CampoValidacion -> ValidacionLlamada
CampoValidacion.hasMany(ValidacionLlamada, { foreignKey: 'id_campo' });
ValidacionLlamada.belongsTo(CampoValidacion, { foreignKey: 'id_campo' });

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    return false;
  }
};

// Probar conexión al inicializar
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = {
  sequelize,
  testConnection,
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
