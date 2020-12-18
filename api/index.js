const express = require("express");
const db = require("./db");

// Create express instnace
const app = express();

// Init body-parser options (inbuilt with express)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Require & Import API routes
const users = require("./routes/users");
const projects = require("./routes/projects");
const times = require("./routes/times");
const todos = require("./routes/todos");
const workspaces = require("./routes/workspaces");

// Use API Routes
app.use(users);
app.use(projects);
app.use(times);
app.use(todos);
app.use(workspaces);

// Export the server middleware
module.exports = {
  path: "/api",
  handler: app
};
