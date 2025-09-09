const express = require('express');
const { divisoresSpec, swaggerUi, setupSwagger } = require('../swagger-config');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const setup = setupSwagger(divisoresSpec);
  setup(req, res, next);
});

// Importar rutas
app.use('/api', require('./routes/divisores'));

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    project: 'Divisores API',
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