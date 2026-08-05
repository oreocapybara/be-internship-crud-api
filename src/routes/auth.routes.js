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
		res.json(await service.verifyUser(req.headers.authorization));
	} catch (err) {
		next(err);
	}
})

module.exports = router;
