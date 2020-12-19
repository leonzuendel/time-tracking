const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const projectsController = require("../controllers/projectsController");

// Get All
router.get("/projects", projectsController.list);

// Get All by User
router.get("/projects/user/:user_id", projectsController.listByUser);

// Get All private by User
router.get(
  "/projects/user/private/:user_id",
  projectsController.listPrivateByUser
);

// Get All by Workspace
router.get(
  "/projects/workspace/:workspace_id",
  projectsController.listByWorkspace
);

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
