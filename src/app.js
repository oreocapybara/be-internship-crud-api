const express = require("express");
const app = express();
const port = 3000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});

const tasks = [
	{ id: 1, title: "Do Laundry", done: false },
	{ id: 2, title: "Fix Laptop", done: true },
	{ id: 3, title: "Have a Video Chat", done: false },
];

//STAGE 1
//Add the endpoint GET / returning JSON that describes your API:
app.get("/", (req, res) => {
	res.send({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

//Add GET /health returning { "status": "ok" }
app.get("/health", (req, res) => {
	res.send({ status: "ok" });
});

//STAGE 2
app.get("/tasks", (req, res) => {
	res.send(tasks);
});

app.get("/tasks/:id", (req, res) => {
	const task = tasks.find((task) => task.id === Number(req.params.id));

	if (!task) return res.status(404).send({ error: `Task ${req.params.id} not found` });
	
	res.send(task);
});
