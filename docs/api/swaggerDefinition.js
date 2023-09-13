module.exports = {
  openapi: '3.0.0',
  info: {
      title: 'Blog API Documentation',
      description: 'API documentation for the Blog app',
      version: '1.0.0',
    servers: {
        url: 'http://localhost:3000',
        description: 'Local server',
    },
  },
  basePath: '/',
  apis: ['./src/**/*.route.js'],
};
