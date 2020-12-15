const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const toDosController = require("../controllers/toDosController");

// Get All
router.get("/todos", toDosController.list);

// Get One by User
router.get("/todos/user/:user_id", toDosController.listByUser);

// Get One
router.get("/todos/:id", toDosController.show);

// Create
router.post("/todos", config.isAuthenticated, toDosController.create);

// Update
router.put("/todos/:id", config.isAuthenticated, toDosController.update);

// Delete
router.delete("/todos/:id", config.isAuthenticated, toDosController.delete);

module.exports = router;
