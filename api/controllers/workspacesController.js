const validator = require("express-validator");
const Workspace = require("../models/Workspace");

// Get all
module.exports.list = function (req, res, next) {
  Workspace.find({}, function (err, workspaces) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(workspaces);
  });
};

module.exports.listByUser = function (req, res, next) {
  const id = req.params.user_id;
  Workspace.find({ users: { $elemMatch: { id } } }, function (err, workspaces) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(workspaces);
  });
};

// Get one
module.exports.show = function (req, res) {
  const id = req.params.id;
  Workspace.findOne({ _id: id }, function (err, workspace) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    if (!workspace) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    return res.json(workspace);
  });
};

// Create
module.exports.create = [
  function (req, res) {
    // initialize record
    const workspace = new Workspace(req.body);

    // save record
    workspace.save(function (err, workspace) {
      if (err) {
        return res.status(400).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: workspace._id
      });
    });
  }
];

// Update
module.exports.update = [
  function (req, res) {
    const id = req.params.id;
    Workspace.findOne({ _id: id }, function (err, workspace) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!workspace) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      workspace.title = req.body.title ? req.body.title : workspace.title;
      workspace.content = req.body.content
        ? req.body.content
        : workspace.content;
      workspace.settings = req.body.settings
        ? req.body.settings
        : workspace.settings;
      workspace.users = req.body.users ? req.body.users : workspace.users;
      workspace.sort = req.body.sort ? req.body.sort : workspace.sort;
      workspace.color = req.body.color ? req.body.color : workspace.color;

      // save record
      workspace.save(function (err, workspace) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!workspace) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(workspace);
      });
    });
  }
];

// Delete
module.exports.delete = function (req, res) {
  const id = req.params.id;
  Workspace.findByIdAndRemove(id, function (err, workspace) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json(workspace);
  });
};
