const { ValidationError, AuthError } = require("../errors");
const { supabase } = require("../lib/supabase");

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

async function verifyUser(header) {
	const [scheme, token] = (header || "").split(" ");

	if (!header || scheme !== "Bearer" || !token) {
		throw new AuthError("Access token required");
	}

	const {
		data: { user },
		error,
	} = await supabase.auth.getUser(token);

	if (error) {
		throw new AuthError("Invalid or expired token");
	}

	const { id, email, created_at } = user;

	return { id, email, created_at };
}

async function signOutUser() {
	const { error } = await supabase.auth.signOut({ scope: 'local' });

	if (error) {
		throw new AuthError(error.message);
	}
}

module.exports = { signUpNewUser, signInUser, verifyUser, signOutUser, };
