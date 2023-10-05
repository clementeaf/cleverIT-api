const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const swaggerUi = require('swagger-ui-express'); // Importa swagger-ui-express
const swaggerSpec = require('./swaggerConfig'); // Importa el archivo de configuración de Swagger
const cors = require('cors');

const app = express();

// Configurar middleware para parsear el cuerpo de las solicitudes como JSON
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    
    // Iniciar el servidor después de la conexión exitosa
    app.listen(config.port, () => {
      console.log(`Servidor escuchando en el puerto ${config.port}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });

  app.use(cors()); 
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Configura la ruta y el middleware de Swagger

  // Ruta para obtener todas las colecciones presentes en la base de datos
  app.get('/api/collections', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      if (!collections || collections.length === 0) {
        return res.status(404).json({ message: 'No se encontraron colecciones' });
      }
      
      const collectionNames = collections.map((collection) => collection.name);
      res.json(collectionNames);
    } catch (err) {
      console.error('Error al obtener las colecciones:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  
/**
 * @swagger
 * /api/json:
 *   get:
 *     summary: Obtiene datos JSON
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 */
// Ruta para obtener el JSON
app.get('/api/json', async (req, res) => {
    try {
      // Buscar todos los documentos en la colección "cleverIT"
      const jsonData = await mongoose.connection.db.collection('cleverIT').find({}).toArray();
  
      if (!jsonData || jsonData.length === 0) {
        return res.status(404).json({ message: 'No se encontraron documentos JSON' });
      }
  
      res.json(jsonData);
    } catch (err) {
      console.error('Error al obtener los documentos JSON:', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  
// Manejar errores 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejar errores internos del servidor
app.use((err, req, res, next) => {
  console.error('Error interno del servidor:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});