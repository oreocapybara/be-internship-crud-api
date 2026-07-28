//STAGE 0: SQLite Database

const Database = require("better-sqlite3");
const db = new Database("./src/repositories/tasks.db");

//Create a database table if it does not exist
db.exec(`CREATE TABLE IF NOT EXISTS tasks(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		done INTEGER DEFAULT 0
		)`);

//SEED database with tasks when empty;
const row = db.prepare(`SELECT COUNT(*) AS count FROM tasks`).get();

if (row.count === 0) {
	const insert = db.prepare(`INSERT INTO tasks(title, done) VALUES(?, ?)`);

	const SEED_TASKS = [
		["Do Laundry", 0],
		["Fix Laptop", 1],
		["Have a Video Chat", 0],
	];

	const insertSeedTasks = db.transaction((tasks) => {
		for (const task of tasks) insert.run(task);
	});

	insertSeedTasks(SEED_TASKS);
}

//STAGE 1: READ Endpoints
function findAll() {
	return db.prepare(`SELECT * FROM tasks`).all();
}

const findTask = (id) => {
	return db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
	
	// return tasks.find((task) => (task.id === id ? { ...task } : null));
};

const create = ({ title, done }) => {
	const id =
		tasks.length === 0 ? 1 : Math.max(...tasks.map((task) => task.id)) + 1;

	const newTask = { id, title, done };

	tasks.push(newTask);

	return { ...newTask };
};

const update = (id, changes) => {
	const task = tasks.find((task) => task.id === id);

	if (!task) {
		return null;
	}

	if (changes.title) {
		task.title = changes.title;
	}

	if (changes.done) {
		task.done = changes.done;
	}

	return { ...task };
};

const remove = (id) => {
	const index = tasks.findIndex((task) => task.id === id);

	if (index === -1) {
		return false;
	}

	tasks.splice(index, 1);
	return true;
};

// Extra: Reset task
const reset = () => {
	tasks.length = 0;
	tasks.push(...SEED_TASKS.map((task) => ({ ...task })));
};

module.exports = { findAll, findTask, create, update, remove, reset };
