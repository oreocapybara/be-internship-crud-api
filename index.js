const { createApp } = require("./src/app");
const { supabase } = require("./src/lib/supabase");
const repo = require("./src/repositories/tasks.repo")

async function main() {
	await repo.initDB();
	const app = createApp();
	const port = process.env.PORT || 3000;
	
	app.listen(port, () => {
		console.log(`CRUD API listening on port ${port}`);

		if (supabase) {
			console.log(`Supabase connected`);
		}
	});

}

main();