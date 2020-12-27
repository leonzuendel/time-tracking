const { Router } = require("express");
const config = require("../config");

const router = Router();

// Initialize Controller
const workspacesController = require("../controllers/workspacesController");

// Get All
router.get("/workspaces", workspacesController.list);

// Get One by User
router.get("/workspaces/user/:user_id", workspacesController.listByUser);

// Get One
router.get("/workspaces/:id", workspacesController.show);

// Create
router.post("/workspaces", config.isAuthenticated, workspacesController.create);

// Update
router.put(
  "/workspaces/:id",
  config.isAuthenticated,
  workspacesController.update
);

// Join by Invite
router.post(
  "/workspaces/join/invite",
  config.isAuthenticated,
  workspacesController.joinByInvite
);

// Delete
router.delete(
  "/workspaces/:id",
  config.isAuthenticated,
  workspacesController.delete
);

module.exports = router;
