const express = require("express");
const app = express();
const port = 3000;

//STAGE 1
//Add the endpoint GET / returning JSON that describes your API:
app.get("/", (req, res) => {
	res.send({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

app.get("/health", (req, res) => {
	res.status(200).send({ "status": "ok" })
});

//Add GET /health returning { "status": "ok" }
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
