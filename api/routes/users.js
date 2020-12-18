const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const usersController = require("../controllers/usersController");

// Register
router.post("/users/register", usersController.register);

// Login
router.post("/users/login", usersController.login);

// Get User
router.get("/users/user", usersController.user);

// Login with Google
router.post("/users/google", usersController.loginWithGoogle);

// Get User Settings
router.get(
  "/users/:id/settings",
  config.isAuthenticated,
  usersController.showSettings
);

// Update User
router.put("/users/:id", config.isAuthenticated, usersController.update);

module.exports = router;
