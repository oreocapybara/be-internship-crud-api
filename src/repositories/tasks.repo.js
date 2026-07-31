//STAGE 1: Connect via .env and create table
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDB() {
	//Create a database table if it does not exist
	await pool.query(
		`CREATE TABLE IF NOT EXISTS tasks(
				id SERIAL PRIMARY KEY ,
				title TEXT NOT NULL,
				done BOOLEAN NOT NULL DEFAULT FALSE,
				created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
		);`,
	);

	const res = await pool.query(`SELECT COUNT(*) AS count FROM tasks;`);
	const count = parseInt(res.rows[0].count, 10);
	// SEED initial tasks if tasks is empty
	if (count === 0) {
		await initializeTasks();
	}
}

// SEED_TASKS
async function initializeTasks() {
	const SEED_TASKS = [
		["Do Laundry", 0],
		["Fix Laptop", 1],
		["Have a Video Chat", 0],
	];

	for (const [title, done] of SEED_TASKS) {
		await pool.query(`INSERT INTO tasks(title, done) VALUES($1, $2);`, [
			title,
			done,
		]);
	}
}

//STAGE 1: READ Endpoints
const findAll = async () => {
	const res = await pool.query(`SELECT * FROM tasks`);

	return res.rows;
};

const findTask = async (id) => {
	const res = await pool.query(`SELECT * FROM tasks WHERE id = $1`, [id]);

	return res.rows[0] || null;
};

const create = async ({ title, done }) => {
	const res = await pool.query(
		`INSERT INTO tasks(title,done) VALUES($1, $2) RETURNING *;`,
		[title, done],
	);

	return res.rows[0] || null;
};

const update = async (id, changes) => {
	const res = await pool.query(
		`UPDATE tasks SET title = COALESCE($1, title), done = COALESCE($2, done) WHERE id = $3 RETURNING *`,
		[
			changes.title ?? null,
			changes.done === undefined ? null : changes.done,
			id,
		],
	);

	return res.rows[0];
};

const remove = async (id) => {
	const res = await pool.query(`DELETE FROM tasks where id = $1;`, [id]);
	return res.rowCount > 0;
};

// Extra: Reset task
const reset = async () => {
	await pool.query(`DELETE FROM tasks WHERE id > 0;`); // Delete ALL
	await initializeTasks();
};

// Extra: Search task
const search = async (query) => {
	const res = await pool.query(`SELECT * FROM tasks WHERE title LIKE $1;`, [
		`%${query}%`,
	]);

	return res.rows;
};

// EXTRA: Filter done
const filterDone = async (done) => {
	const res = await pool.query(`SELECT * FROM tasks WHERE done = $1;`, [
		done,
	]);
	return res.rows;
};




// EXRA: Stats
const stats = async () => {
	const total = await pool.query(`SELECT COUNT(*) AS count FROM tasks`);
	const done = await pool.query(
		`SELECT COUNT(*) AS count FROM tasks WHERE done = true`,
	);
	return {
		total: parseInt(total.rows[0].count),
		done: parseInt(done.rows[0].count),
		open: total.rows[0].count - done.rows[0].count,
	};
};

module.exports = {
	initDB,
	findAll,
	findTask,
	create,
	update,
	remove,
	reset,
	search,
	filterDone,
	stats,
};
