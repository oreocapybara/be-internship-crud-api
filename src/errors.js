// These are the Domain Errors
// In a separate file since they don't implement logic for http or services
// They only provide meaning

class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
	}
}

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.name = "ValidationError";
	}
}

module.exports = { NotFoundError, ValidationError };
