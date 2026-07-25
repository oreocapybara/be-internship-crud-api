const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi = require("../openapi.json");

const metaRoutes = require("./routes/meta.routes");
const tasksRoutes = require("./routes/tasks.routes");
const { errorHandler } = require("./middleware/error-handler");

const swaggerAutogen = require("swagger-autogen")();

const doc = {
	info: {
		title: "Task API",
		version: "1.0",
		description: "Implementing a CRUD API for Tasks",
	},
	host: "localhost:3000",
};

function createApp() {
	const app = express();
	app.use(express.json());

	//STAGE 5: Swagger UI and docs
	app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

	//Feature Routes
	app.use("/", metaRoutes);
	app.use("/", tasksRoutes);

	app.use(errorHandler);

	return app;
}

module.exports = { createApp };
