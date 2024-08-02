const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'NAHNU API - TRADUCTOR',
            version: '1.0.0',
            description: 'Documentación de la API NAHNU',
        },
    },
    apis: ['app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

module.exports = router;
