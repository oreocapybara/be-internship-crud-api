const express = require("express");
const router = express.Router();
const service = require("../services/auth.service");
const { AuthError } = require("../errors");

router.post("/auth/signup", async (req, res, next) => {
	try {
		res.status(201).json(await service.signUpNewUser(req.body));
	} catch (err) {
		next(err);
	}
});

router.post("/auth/login", async (req, res, next) => {
	try {
		res.json(await service.signInUser(req.body));
	} catch (err) {
		next(err);
	}
});

router.get("/public/info", (req, res) => {
	res.json({ message: "Welcome stranger! This info is public." });
});

router.get("/protected/profile", async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		const [scheme, token] = (authHeader || "").split(" ");

		if (!authHeader || scheme !== "Bearer" || !token) {
			throw new AuthError("Access token required");
		}

		res.json({ message: "Token received", token });
	} catch (err) {
		next(err);
	}
})

module.exports = router;
