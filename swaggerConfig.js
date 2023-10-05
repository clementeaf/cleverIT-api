const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Define las opciones para la generación de la especificación Swagger
const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Mi Aplicación',
        version: '1.0.0',
        description: 'Documentación de la API de Mi Aplicación',
      },
      basePath: '/', // Cambia esto si tu API tiene una ruta base diferente
    },
    apis: [path.join(__dirname, './app.js')], // Especifica la ruta de tu archivo principal app.js
  };
  
  // Crea un objeto swaggerJsdoc con las opciones
  const swaggerSpec = swaggerJsdoc(options);
  
  module.exports = swaggerSpec;