import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { resolve } from "path";

const router = express.Router();

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Liqi Test API",
      version: "1.0.0",
      description: "API for Liqi Test",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: [
    resolve(__dirname, "../../**/*.{js,ts}"),
    resolve(__dirname, "../../domain/models/*.{js,ts}"),
  ],
});

router.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

export default router;
