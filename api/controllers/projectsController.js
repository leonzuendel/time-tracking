const validator = require("express-validator");
const Project = require("../models/Project");

// Get all
module.exports.list = function (req, res, next) {
  Project.find({}, function (err, projects) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(projects);
  });
};

module.exports.listByUser = function (req, res, next) {
  const id = req.params.user_id;
  Project.find({ user: id }, function (err, projects) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(projects);
  });
};

// Get one
module.exports.show = function (req, res) {
  const id = req.params.id;
  Project.findOne({ _id: id }, function (err, project) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    if (!project) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    return res.json(project);
  });
};

// Create
module.exports.create = [
  function (req, res) {
    // initialize record
    const project = new Project(req.body);

    // save record
    project.save(function (err, project) {
      if (err) {
        return res.status(400).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: project._id
      });
    });
  }
];

// Update
module.exports.update = [
  function (req, res) {
    const id = req.params.id;
    Project.findOne({ _id: id }, function (err, project) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!project) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      project.title = req.body.title ? req.body.title : project.title;
      project.content = req.body.content ? req.body.content : project.content;
      project.settings = req.body.settings
        ? req.body.settings
        : project.settings;
      project.user = req.body.user ? req.body.user : project.user;

      // save record
      project.save(function (err, project) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!project) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(project);
      });
    });
  }
];

// Delete
module.exports.delete = function (req, res) {
  const id = req.params.id;
  Project.findByIdAndRemove(id, function (err, project) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json(project);
  });
};
