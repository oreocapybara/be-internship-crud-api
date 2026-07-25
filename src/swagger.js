const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
	info: {
		title: "Task API",
		version: "1.0",
		description: "Implementing a CRUD API for Tasks",
	},
	host: "localhost:3000",
	components: {
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
		},
	},
};

const routes = ["./app.js"];
const outputFile = "../openapi.json";

swaggerAutogen(outputFile, routes, doc);
