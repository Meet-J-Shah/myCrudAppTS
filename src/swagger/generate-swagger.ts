import fs from "fs";
import path from "node:path";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import swaggerJsdoc, { Options } from "swagger-jsdoc";

const mypath = path.resolve("src", "routes", "admin.routes.ts");
console.log(mypath);
(async () => {
  const components = {
    schemas: {
      errorResponseSchema: {
        type: "object",
        properties: {
          code: {
            type: "string",
          },
          error: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
      },
      successResponseSchema: {
        type: "object",
        properties: {
          code: {
            type: "string",
          },
          message: {
            type: "string",
          },
          data: {
            type: "object",
            properties: {},
          },
        },
      },
      User: {
        type: "object",
        properties: {
          id: {
            type: "integer",
            format: "int64",
            readOnly: true,
          },
          email: {
            type: "string",
            format: "email",
          },
          password: {
            type: "string",
            format: "password", // Use 'password' format for security
          },
          role: {
            type: "string",
            enum: ["user", "admin"],
          },
        },
        required: ["email", "password"], // Removed 'id' from required fields
      },
    },
    responses: {
      AdminUnauthorizedError: {
        description: "Access token is missing or invalid",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/errorResponseSchema",
            },
            examples: {
              ACCESS_TOKEN_INVALID: {
                value: {
                  code: 401,
                  error: "UNAUTHORIZED",
                  message: "Invalid authorization token",
                },
              },
              ACCESS_TOKEN_MISSING: {
                value: {
                  code: 401,
                  error: "UNAUTHORIZED",
                  message: "Authorization token required",
                },
              },
            },
          },
        },
      },
      AdminValidationError: {
        description:
          "Request Validation error (Message will be changed as validation rules)",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/errorResponseSchema",
            },
            examples: {
              BAD_REQUEST: {
                value: {
                  code: 400,
                  error: "BAD_REQUEST",
                  message: '"field" is required',
                },
              },
            },
          },
        },
      },
      iseError: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/errorResponseSchema",
            },
            examples: {
              ISE: {
                value: {
                  code: 500,
                  error: "ISE",
                  message: "Something went wrong.",
                },
              },
            },
          },
        },
      },
    },
  };

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Crud  with Authentication",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3001/",
          description: "CRUD API with Authentication Header",
        },
      ],
      components: {
        ...components,
        securitySchemes: {
          AdminAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: [path.resolve(__dirname, "../routes/*.ts")],
  };

  const openapiSpecification = await swaggerJsdoc(options);
  console.log(options.apis);
  await fs.writeFileSync(
    "./src/swagger/api.json",
    JSON.stringify(openapiSpecification, null, 2)
  );
  console.log("Swagger documentation generated successfully!");
})();
