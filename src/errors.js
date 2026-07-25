// These are the Domain Errors
// In a separate file since they don't implement logic for http or services
// They only provide meaning

class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.message = "NotFoundError";
	}
}

class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.message = "ValidationError";
	}
}

module.exports = { NotFoundError, ValidationError };
