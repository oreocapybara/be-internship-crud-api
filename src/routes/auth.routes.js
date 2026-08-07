const express = require("express");
const router = express.Router();
const service = require("../services/auth.service");
const { requireAuth } = require("../middleware/auth");

router.post("/auth/signup", async (req, res, next) => {
	// #swagger.summary = "Sign Up new User"
	/* #swagger.requestBody = {
		required:true,
		content: {
			"application/json": {
				schema: {type: "object", properties: {
					email: {type: "string", example: "testemail@test.com"},
					password: {type: "string", example: "123456"}
				}, required: ["email", "password"]}
			}
		}
	}
	*/
	/* #swagger.responses[201] = {
		description: 'Signed up',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */
	/* #swagger.responses[400] = {
		description: 'Email or Password must not be empty',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */
	/* #swagger.responses[401] = {
		description: 'Authentication Error',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */
	try {
		res.status(201).json(await service.signUpNewUser(req.body));
	} catch (err) {
		next(err);
	}
});

router.post("/auth/login", async (req, res, next) => {
	// #swagger.summary = "Log in User"
	/* #swagger.requestBody = {
		required:true,
		content: {
			"application/json": {
				schema: {type: "object", properties: {
					email: {type: "string", example: "testemail@test.com"},
					password: {type: "string", example: "123456"}
				}, required: ["email", "password"]},

			}
		}
	}
	*/
	/* #swagger.responses[200] = {
		description: 'Logged in',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */

	/* #swagger.responses[400] = {
		description: 'Email or Password must not be empty',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */
	/* #swagger.responses[401] = {
		description: 'Authentication Error',
		content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } }
	} */
	try {
		res.json(await service.signInUser(req.body));
	} catch (err) {
		next(err);
	}
});

router.get("/public/info", (req, res) => {
	// #swagger.summary = "Public accessible route"
	res.json({ message: "Welcome stranger! This info is public." });
});

router.get("/protected/profile", requireAuth, (req, res) => {
	// #swagger.summary = "Profile Information"
	// #swagger.security = [{"bearerAuth": []}]
	/* #swagger.responses[200] = {
		description: 'Authenticated user profile',
		content: {
			"application/json": {
				schema: {
					type: "object",
					properties: {
						id: { type: "string", example: "b312f" },
						email: { type: "string", example: "user@example.com" },
						created_at: { type: "string", example: "2026-08-07T12:00:00Z" }
					}
				}
			}
		}
	} */
	res.json(req.user);
});

router.post("/auth/logout", requireAuth, async (req, res, next) => {
	// #swagger.summary = "Log out"
	// #swagger.security = [{"bearerAuth": []}]
	/* #swagger.responses[204] = { description: 'Logged out' } */
	try {
		await service.signOutUser();
		res.status(204).send();
	} catch (err) {
		next(err);
	}
});

router.get("/protected/dashboard", requireAuth, (req, res) => {
	// #swagger.summary = "Dashboard"
	// #swagger.security = [{"bearerAuth": []}]
	res.json({ message: "User authenticated to dashboard" });
});

module.exports = router;
