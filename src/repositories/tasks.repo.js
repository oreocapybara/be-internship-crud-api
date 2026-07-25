const SEED_TASKS = [
	{ id: 1, title: "Do Laundry", done: false },
	{ id: 2, title: "Fix Laptop", done: true },
	{ id: 3, title: "Have a Video Chat", done: false },
];

const tasks = SEED_TASKS.map((task) => ({ ...task }));

const findAll = () => {
	return tasks.map((task) => ({ ...tasks }));
};

const findTask = (id) => {
	return tasks.find((task) => (task.id === id ? { ...task } : null));
};

console.log(findTask(4))
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
