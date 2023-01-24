const router = require("express").Router();

const authController = require("../controllers/auth.controller");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/verify-login", authController.verifyLogin);

module.exports = router;
