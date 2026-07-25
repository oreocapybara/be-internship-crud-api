const express = require("express");
const app = express();
const port = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../openapi.json");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

const SEED_TASKS = [
	{ id: 1, title: "Do Laundry", done: false },
	{ id: 2, title: "Fix Laptop", done: true },
	{ id: 3, title: "Have a Video Chat", done: false },
];

const tasks = SEED_TASKS.map((task) => ({ ...task }));

const resetTasks = () => {
	tasks.length = 0;
	tasks.push(...SEED_TASKS.map((task) => ({ ...task })));
};

//STAGE 1
//Add the endpoint GET / returning JSON that describes your API:
app.get("/", (req, res) => {
	// #swagger.summary = 'API description'
	res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

//Add GET /health returning { "status": "ok" }
app.get("/health", (req, res) => {
	// #swagger.summary = 'Health check'
	res.json({ status: "ok" });
});

//STAGE 2
app.get("/tasks", (req, res) => {
	// #swagger.summary = 'List tasks'
	/* #swagger.responses[200] = {
		description: 'JSON array of all tasks',
		content: {
			"application/json": {
				schema: { type: "array", items: { $ref: "#/components/schemas/Task" } }
			}
		}
	} */
	let result = tasks;

	// Extra: filter done
	if (req.query.done !== undefined) {
		if (req.query.done !== "true" && req.query.done !== "false") {
			return res
				.status(400)
				.json({ error: "done must be true or false" });
		}

		result = result.filter(
			(task) => task.done === (req.query.done === "true"),
		);
	}

	// Extra: search
	if (req.query.search !== undefined) {
		const word = String(req.query.search).trim();
		if (word === "") {
			return res.status(400).json({ error: "Search must not be empty" });
		}

		result = result.filter((task) =>
			task.title.toLowerCase().includes(word.toLowerCase()),
		);
	}

	res.json(result);
});

app.get("/tasks/:id", (req, res) => {
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
	const task = tasks.find((task) => task.id === Number(req.params.id));

	if (!task) {
		return res
			.status(404)
			.json({ error: `Task ${req.params.id} not found` });
	}
	res.json(task);
});

//STAGE 3
app.post("/tasks", (req, res) => {
	// #swagger.summary = 'Create a task'
	/* #swagger.requestBody = {
		required: true,
		content: {
			"application/json": {
				schema: { type: "object", properties: { title: { type: "string" } }, required: ["title"] }
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
	const { title } = req.body;

	if (title === undefined || title === null || title.trim() === "") {
		res.status(400).send({
			error: "Title is required and cannot be empty",
		});
		return;
	}

	const id =
		tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;

	const task = { id, title: String(title).trim(), done: false };

	tasks.push(task);
	res.status(201).send(task);
});

//STAGE 4
app.put("/tasks/:id", (req, res) => {
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
	if (!req.body || Object.keys(req.body).length === 0) {
		return res
			.status(400)
			.json({ error: "Request body must have TITLE and/or DONE" });
	}

	const task = tasks.find((task) => task.id === Number(req.params.id));

	if (!task) {
		return res
			.status(404)
			.json({ error: `Task ${req.params.id} not found` });
	}

	if (req.body.title) {
		task.title = String(req.body.title).trim();
	}

	if (req.body.done) {
		task.done = req.body.done;
	}

	res.status(201).json(task);
});

app.delete("/tasks/:id", (req, res) => {
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
	const index = tasks.findIndex((task) => task.id === Number(req.params.id));

	if (index === -1) {
		return res
			.status(404)
			.json({ error: `Task ${req.params.id} not found` });
	}

	tasks.splice(index, 1);
	res.status(204).json();
});

//EXTRA: Reset
app.post("/reset", (req, res) => {
	// #swagger.summary = 'Reset tasks to seed data'
	resetTasks();
	res.json(tasks);
});

//EXTRA: Stats
app.get("/stats", (req, res) => {
	// #swagger.summary = 'Task counts'
	let done = tasks.filter((task) => task.done === true).length;

	res.json({
		total: tasks.length,
		done: done,
		open: tasks.length - done,
	});
});
