const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Configuración base común
const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APIs Documentation',
      version: '1.0.0',
      description: 'Documentación para múltiples proyectos',
      contact: {
        name: 'Soporte API',
        email: 'soporte@example.com'
      }
    },
    // estos componentes lo puse aqui porque no me funcionaba ponerlos en los archivos individuales
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'El número debe ser un entero positivo'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de acceso no válido o faltante'
        }
      }
    }
  }
};

// Configuración específica para cada proyecto OJO: recuerda que las rutas deben ser absolutas porque luego no encuentra ningun spec la documentacion
const divisoresOptions = {
  ...baseOptions,
  apis: [
    path.join(__dirname, 'divisores-api', 'routes', '*.js'),
    path.join(__dirname, 'divisores-api', '*.js')
  ],
  servers: [{ url: 'http://localhost:3001', description: 'API Divisores Primos' }]
};

const otroProyectoOptions = {
  ...baseOptions,
  apis: [path.join(__dirname, 'otro-proyecto', 'routes', '*.js')],
  servers: [{ url: 'http://localhost:3002', description: 'Otro Proyecto' }]
};

// Generar especificaciones
const divisoresSpec = swaggerJSDoc(divisoresOptions);
const otroProyectoSpec = swaggerJSDoc(otroProyectoOptions);

// Middleware para Swagger UI
const setupSwagger = (spec) => {
  return swaggerUi.setup(spec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Documentación API"
  });
};

// Función para debuguear: esta muestra las rutas que está buscando Swagger
function debugSwaggerConfig() {
  console.log('Buscando archivos en las siguientes rutas:');
  console.log('Divisores API:');
  divisoresOptions.apis.forEach(ruta => console.log('  -', ruta));
  console.log('Otro Proyecto:');
  otroProyectoOptions.apis.forEach(ruta => console.log('  -', ruta));
}

module.exports = {
  divisoresSpec,
  otroProyectoSpec,
  swaggerUi,
  setupSwagger,
  debugSwaggerConfig
};