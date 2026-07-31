const { createApp } = require("./src/app");
const repo = require("./src/repositories/tasks.repo")

async function main() {
	await repo.initDB();
	const app = createApp();
	const port = process.env.PORT || 3000;
	
	app.listen(port, () => {
		console.log(`CRUD API listening on port ${port}`);
	});

}

main();