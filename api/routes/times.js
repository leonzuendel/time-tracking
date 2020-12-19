const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const timesController = require("../controllers/timesController");

// Get All
router.get("/times", timesController.list);

// Get All by User
router.get("/times/user/:user_id", timesController.listByUser);

// Get All by Project
router.get("/times/project/:project_id", timesController.listByProject);

// Get One
router.get("/times/:id", timesController.show);

// Create
router.post("/times", config.isAuthenticated, timesController.create);

// Update
router.put("/times/:id", config.isAuthenticated, timesController.update);

// Delete
router.delete("/times/:id", config.isAuthenticated, timesController.delete);

module.exports = router;
