const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
	info: {
		title: "Task API",
		version: "1.0",
		description: "Implementing a CRUD API for Tasks",
	},
	host: "localhost:3000",
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT",
			},
		},
		"@schemas": {
			Task: {
				type: "object",
				required: ["id", "title", "done"],
				properties: {
					id: { type: "integer", example: 1 },
					title: { type: "string", example: "Buy Milk" },
					done: { type: "boolean", example: true },
				},
			},
			Error: {
				type: "object",
				properties: {
					error: { type: "string", example: "Task NOT Found" },
				},
			},
			AuthResponse: {
				type: "object",
				properties: {
					user: {
						type: "object",
						properties: {
							id: { type: "string", example: "b312f" },
							email: {
								type: "string",
								example: "user@example.com",
							},
							created_at: {
								type: "string",
								example: "2026-08-07T12:00:00Z",
							},
						},
					},
					session: {
						type: "object",
						properties: {
							access_token: {
								type: "string",
								example: "eyJhbGciOi...",
							},
							refresh_token: {
								type: "string",
								example: "abcd1234",
							},
							expires_in: { type: "integer", example: 3600 },
							token_type: { type: "string", example: "bearer" },
						},
					},
				},
			},
		},
	},
};

const routes = ["./app.js"];
const outputFile = "../openapi.json";

swaggerAutogen(outputFile, routes, doc);
