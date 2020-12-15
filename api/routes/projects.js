const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const projectsController = require("../controllers/projectsController");

// Get All
router.get("/projects", projectsController.list);

// Get One by User
router.get("/projects/user/:user_id", projectsController.listByUser);

// Get One
router.get("/projects/:id", projectsController.show);

// Create
router.post("/projects", config.isAuthenticated, projectsController.create);

// Update
router.put("/projects/:id", config.isAuthenticated, projectsController.update);

// Delete
router.delete(
  "/projects/:id",
  config.isAuthenticated,
  projectsController.delete
);

module.exports = router;
