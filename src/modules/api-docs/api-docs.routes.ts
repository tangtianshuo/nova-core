import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yamljs';

const router = Router();

// Load OpenAPI specification
const openApiPath = path.resolve(process.cwd(), 'openapi.yaml');
const openApiSpec = yaml.load(fs.readFileSync(openApiPath, 'utf8')) as object;

/**
 * Serve Swagger UI documentation
 */
router.use('/', swaggerUi.serve);

/**
 * Get OpenAPI spec as JSON
 */
router.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(openApiSpec);
});

/**
 * Get OpenAPI spec as YAML
 */
router.get('/swagger.yaml', (_req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.send(fs.readFileSync(openApiPath, 'utf8'));
});

// Setup Swagger UI
router.use('/', swaggerUi.setup(openApiSpec, {
  explorer: true,
  customSiteTitle: 'Nova API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    tryItOutEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
}));

export default router;
