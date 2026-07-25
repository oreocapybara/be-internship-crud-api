// This is the service layer which contains the business logic
// The functions inside here are called and are separated from the routing layer

const { ValidationError, NotFoundError } = require("../errors");
const repo = require("../repositories/tasks.repo");

function getAllTasks({ done, search } = {}) {
	let result = repo.findAll();

	// Extra: filter done
	if (done !== undefined) {
		if (done !== "true" && done !== "false") {
			throw new ValidationError("done must be true or false");
		}

		result = result.filter((task) => task.done === (done === "true"));
	}

	// Extra: search
	if (search !== undefined) {
		const word = String(search).trim();
		if (word === "") {
			throw new ValidationError("Search must not be empty");
		}

		result = result.filter((task) =>
			task.title.toLowerCase().includes(word.toLowerCase()),
		);
	}

	return result;
}

function getTask(id) {
	const task = repo.findTask(id);

	if (!task) {
		throw new NotFoundError(`Task ${id} not found`);
	}
	return task;
}

function createTask(body = {}) {
	const { title } = body;
	if (title === undefined || title === null || title.trim() === "") {
		throw new ValidationError("Title is required and cannot be empty");
	}

	return repo.create({ title: String(title).trim(), done: false });
}

function updateTask(id, body = {}) {
	const hasTitle = body.title;
	const hasDone = body.done;

	if (!body || Object.keys(body).length === 0) {
		throw new ValidationError("Request body must have TITLE and/or DONE");
	}

	const changes = {};

	if (hasTitle) {
		if (body.title === null || body.title.trim() === "") {
			throw new ValidationError("Title must not be empty");
		}
		changes.title = body.title;
	}

	if (hasDone) {
		if (typeof body.done !== "boolean") {
			throw new ValidationError(
				"Property done must be true or false (boolean)",
			);
		}
		changes.done = body.done;
	}

	const updated = repo.update(id, changes);

	if (!updated) throw new NotFoundError(`Task ${id} not found`);

	return updated;
}

function deleteTask(id) {
	const removedTask = repo.remove(id);
	if (!removedTask) {
		throw new NotFoundError(`Task ${id} not found`);
	}
}

function getStats() {
	let done = repo.findAll().filter((task) => task.done === true).length;
	let total = repo.findAll().length;

	return {
		total: total,
		done: done,
		open: total - done,
	};
}

function resetTasks() {
	return repo.reset();
}

module.exports = {
	getAllTasks,
	getTask,
	createTask,
	updateTask,
	deleteTask,
	getStats,
	resetTasks,
};
