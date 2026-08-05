const { verifyUser } = require("../services/auth.service");

async function requireAuth(req, res, next) {
	try {
		const result = await verifyUser(req.headers.authorization);
		req.user = result;
		next();
	} catch (err) {
		next(err);
	}
}

module.exports = {
	requireAuth,
};
