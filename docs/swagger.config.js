const express = require('express');

const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API Documentation',
      description: 'API documentation for the Blog app',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  basePath: '/v1',
  apis: [
            './src/**/*.route.js'
        ],
};

const specs = swaggerJsdoc(options);

const swaggerOptions = {
  customSiteTitle: 'My Blog',
  customCss: `
    body {
      font-family: Arial, sans-serif;
    }
    
    .swagger-ui .topbar {
      display: none;
    }
    
    .swagger-ui .opblock .opblock-summary-method {
      background-color: #4CAF50;
      color: #fff;
      padding: 6px 12px;
      border-radius: 4px;
    }
    
    .swagger-ui .opblock .opblock-summary-path a {
      color: #007BFF;
    }
    
    .swagger-ui .responses-table .responses-header th {
      background-color: #007BFF;
      color: #fff;
    }

    .swagger-ui .opblock .opblock-section-header {
      background-color: #f2f2f2;
      color: #333;
    }
  `,
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs, { ...swaggerOptions, swaggerUrl: null, explorer: true, swaggerOptions: { urls: swaggerOptions.urls } }));

module.exports = router;