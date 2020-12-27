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
  validator.body("invite").custom((value) => {
    return Workspace.findOne({ invite: value }).then((workspace) => {
      if (workspace !== null) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject("Invite already in use");
      }
    });
  }),
  function (req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
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
      workspace.projects = req.body.projects
        ? req.body.projects
        : workspace.projects;
      workspace.users = req.body.users ? req.body.users : workspace.users;

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

// Join by Invite
module.exports.joinByInvite = [
  function (req, res) {
    const invite = req.body.invite;
    const user = req.body.user;
    Workspace.findOne({ invite }, function (err, workspace) {
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
      let found = false;
      for (let i = 0; i < workspace.users.length; i++) {
        if (workspace.users[i].id === user) {
          found = true;
          break;
        }
      }
      if (!found) {
        workspace.users.push({ id: user, role: "admin" });
      } else {
        return res.status(400).json({
          message: "User already in this workspace."
        });
      }

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
