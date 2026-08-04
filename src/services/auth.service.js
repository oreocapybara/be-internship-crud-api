const { ValidationError, AuthError } = require("../errors");
const {supabase} = require("../lib/supabase");

async function signUpNewUser(body = {}) {
	if (Object.keys(body).length === 0 || !body) {
		throw new ValidationError("Email or Password must not be empty!");
	}

	const { email, password } = body;

	const { data, error } = await supabase.auth.signUp({
		email: email,
		password: password,
	});

	if (error) {
		throw new AuthError(error.message);
	}

	return data;
}

async function signInUser(body = {}) {
	if (!body || Object.keys(body).length === 0) {
		throw new ValidationError("Email or Password must not be empty!");
	}
	const { email, password } = body;

	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error) {
		throw new AuthError(error.message);
	}

	return data;
}

module.exports = { signUpNewUser, signInUser };
