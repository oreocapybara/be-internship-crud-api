// This is the service layer which contains the business logic
// The functions inside here are called and are separated from the routing layer

const { ValidationError, NotFoundError } = require("../errors");
const repo = require("../repositories/tasks.repo");

async function getAllTasks({ done, search } = {}) {
	let result = await repo.findAll();

	// Extra: filter done
	if (done !== undefined) {
		if (done !== "true" && done !== "false") {
			throw new ValidationError("done must be true or false");
		}

		result = await repo.filterDone(done === "true" ? true : false)
	}

	// Extra: search
	if (search !== undefined) {
		const word = String(search).trim();
		if (word === "") {
			throw new ValidationError("Search must not be empty");
		}

		result = await repo.search(word);
	}

	return result;
}

async function getTask(id) {
	const task = await repo.findTask(id);

	if (!task) {
		throw new NotFoundError(`Task ${id} not found`);
	}
	return task;
}

async function createTask(body = {}) {
	const { title, done } = body;
	if (title === undefined || title === null || title.trim() === "") {
		throw new ValidationError("Title is required and cannot be empty");
	}

	return await repo.create({ title: String(title).trim(), done: done });
}

async function updateTask(id, body = {}) {
	const hasTitle = "title" in body;
	const hasDone = "done" in body;

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

	const updated = await repo.update(id, changes);

	if (!updated) throw new NotFoundError(`Task ${id} not found`);

	return updated;
}

async function deleteTask(id) {
	const removedTask = await repo.remove(id);
	if (!removedTask) {
		throw new NotFoundError(`Task ${id} not found`);
	}
}

async function getStats() {
	return await repo.stats()
}

async function resetTasks() {
	return await repo.reset();
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
