const express = require("express");
const router = express.Router();
const service = require("../services/auth.service");
const { requireAuth } = require("../middleware/auth");

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

router.get("/protected/profile", requireAuth, (req, res) => {
	res.json(req.user);
});

router.post("/auth/logout", requireAuth, async (req, res, next) => {
	try {
		await service.signOutUser();
		res.status(204).send();
	} catch (err) {
		next(err);
	}
});

router.get("/protected/dashboard", requireAuth, (req, res) => {
	res.json({message: "User authenticated to dashboard"})
})

module.exports = router;
