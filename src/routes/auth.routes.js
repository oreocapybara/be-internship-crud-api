const express = require("express");
const router = express.Router();
const service = require("../services/auth.service");

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
})

module.exports = router;