// This file contains the code / service that turns domain error into HTTP
// Converts errors into their equivalent HTTP status codes

const { NotFoundError, ValidationError } = require("../errors");

function errorHandler(err, req, res, next) {
	if (err instanceof ValidationError) {
		return res.status(400).json({ error: err.message });
	}

	if (err instanceof NotFoundError) {
		return res.status(404).json({ error: err.msg });
	}

	// Server bug
	console.error(err);
	return res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { errorHandler };
