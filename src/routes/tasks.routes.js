// This file contains the routing for tasks
// It calls services for routing and is wrapped in a try catch function for validation

const express = require("express");
const router = express.Router();
const service = require("../services/tasks.service");

//STAGE 2
// List all task with optional filter for done and search
router.get("/tasks", async (req, res, next) => {
	// #swagger.summary = 'List tasks'
	/* #swagger.parameters['done'] = {
		in: 'query',
		description: 'Filter tasks by done status',
		type: 'boolean'
	} */
	/* #swagger.responses[200] = {
		description: 'JSON array of all tasks',
		content: {
			"application/json": {
				schema: { type: "array", items: { $ref: "#/components/schemas/Task" } }
			}
		}
	} */
	try {
		res.json(
			await service.getAllTasks({
				done: req.query.done,
				search: req.query.search,
			}),
		);
	} catch (err) {
		next(err);
	}
});

// Extra: stats
router.get("/stats", async (req, res, next) => {
	// #swagger.summary = 'Task counts'
	/* #swagger.responses[200] = {
		description: 'Task counts',
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						total: { type: "integer", example: 3 },
						done: { type: "integer", example: 1 },
						open: { type: "integer", example: 2 }
					}
				}
			}
		}
	} */
	try {
		res.json(await service.getStats());
	} catch (err) {
		next(err);
	}
});

//Extra: reset tasks
router.post("/reset", async (req, res, next) => {
	// #swagger.summary = 'Reset tasks to seed data'
	/* #swagger.responses[200] = {
		description: 'Tasks reset to seed data',
		content: {
			"application/json": {
				schema: { type: "array", items: { $ref: "#/components/schemas/Task" } }
			}
		}
	} */
	try {
		res.json(await service.resetTasks());
	} catch (err) {
		next(err);
	}
});

//Create a Task
router.post("/tasks", async (req, res, next) => {
	// #swagger.summary = 'Create a task'
	/* #swagger.requestBody = {
		required: true,
		content: {
			"application/json": {
				schema: { type: "object", properties: { title: { type: "string", example: "Buy Milk" }, done: {type: "boolean", example: false} }, required: ["title"] }
			}
		}
	} */
	/* #swagger.responses[201] = {
		description: 'Task created',
		content: {
			"application/json": { schema: { $ref: "#/components/schemas/Task" } }
		}
	} */
	/* #swagger.responses[400] = {
		description: 'Missing/empty title',
		content: {
			"application/json": { schema: { $ref: "#/components/schemas/Error" } }
		}
	} */
	try {
		res.status(201).json(await service.createTask(req.body ?? {}));
	} catch (err) {
		next(err);
	}
});

//STAGE 4
// Get a single task
router.get("/tasks/:id", async (req, res, next) => {
	// #swagger.summary = 'Get a task'
	/* #swagger.responses[200] = {
		description: 'Task found',
		content: {
			"application/json": { schema: { $ref: "#/components/schemas/Task" } }
		}
	} */
	/* #swagger.responses[404] = {
		description: 'Task not found',
		content: {
			"application/json": {
				schema: { $ref: "#/components/schemas/Error" },
				example: { error: "Task 99 not found" }
			}
		}
	} */
	try {
		res.json(await service.getTask(Number(req.params.id)));
	} catch (err) {
		next(err);
	}
});

//Update a Task
router.put("/tasks/:id", async (req, res, next) => {
	// #swagger.summary = 'Update a task'
	/* #swagger.requestBody = {
		required: true,
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						title: { type: "string", example: "Buy Milk" },
						done: { type: "boolean", example: false }
					}
				}
			}
		}
	} */
	/* #swagger.responses[201] = {
		description: 'Task updated',
		content: {
			"application/json": { schema: { $ref: "#/components/schemas/Task" } }
		}
	} */
	/* #swagger.responses[400] = {
		description: 'Empty body',
		content: {
			"application/json": {
				schema: { $ref: "#/components/schemas/Error" },
				example: { error: "Request body must have TITLE and/or DONE" }
			}
		}
	} */
	/* #swagger.responses[404] = {
		description: 'Task not found',
		content: {
			"application/json": {
				schema: { $ref: "#/components/schemas/Error" },
				example: { error: "Task 99 not found" }
			}
		}
	} */
	try {
		res.status(201).json(
			await service.updateTask(Number(req.params.id), req.body ?? {}),
		);
	} catch (err) {
		next(err);
	}
});

//Delete Task
router.delete("/tasks/:id", async (req, res, next) => {
	// #swagger.summary = 'Delete a task'
	/* #swagger.responses[204] = { description: 'Task deleted' } */
	/* #swagger.responses[404] = {
		description: 'Task not found',
		content: {
			"application/json": {
				schema: { $ref: "#/components/schemas/Error" },
				example: { error: "Task 99 not found" }
			}
		}
	} */
	try {
		await service.deleteTask(Number(req.params.id));
		res.status(204).send();
	} catch (err) {
		next(err);
	}
});

module.exports = router;
