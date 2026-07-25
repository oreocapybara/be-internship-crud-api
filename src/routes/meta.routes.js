// The meta.routes.js file contains the API Metadata
// Since Metadata of the API can be answered directly. There is no need to call for a service
const express = require("express");
const router = express.Router();

//STAGE 1
//Add the endpoint GET / returning JSON that describes your API:
router.get("/", (req, res) => {
	// #swagger.summary = 'API description'
	res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

//Add GET /health returning { "status": "ok" }
router.get("/health", (req, res) => {
	// #swagger.summary = 'Health check'
	res.json({ status: "ok" });
});

module.exports = router;