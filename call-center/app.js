const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { swaggerUi, setupSwagger, callCenterSpec } = require('../swagger-config');

const app = express();
const PORT = process.env.CALL_CENTER_PORT || process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const setup = setupSwagger(callCenterSpec);
  setup(req, res, next);
});

// Importar rutas
app.use('/', require('./routes/gestor'));

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    project: 'Call Center API',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Divisores API ejecutándose en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});

// Exportar para testing
module.exports = app;