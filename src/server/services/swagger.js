import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  info: {
    title: 'edulastic-poc api',
    version: '0.1.0',
    description: 'rest api for edulastic-poc'
  },
  host: 'localhost:3000/api',
  basePath: '/',
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      in: 'header',
      name: 'authorization'
    }
  },
  security: [
    {
      jwt: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./**/routes/*.js', './routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);
export default swaggerUi.setup(swaggerSpec);
