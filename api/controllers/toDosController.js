const validator = require("express-validator");
const ToDo = require("../models/ToDo");

// Get all
module.exports.list = function (req, res, next) {
  ToDo.find({}, function (err, toDos) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(toDos);
  });
};

module.exports.listByUser = function (req, res, next) {
  const id = req.params.user_id;
  ToDo.find({ user: id }, function (err, toDos) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(toDos);
  });
};

// Get one
module.exports.show = function (req, res) {
  const id = req.params.id;
  ToDo.findOne({ _id: id }, function (err, toDo) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    if (!toDo) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    return res.json(toDo);
  });
};

// Create
module.exports.create = [
  function (req, res) {
    // initialize record
    const toDo = new ToDo(req.body);

    // save record
    toDo.save(function (err, toDo) {
      if (err) {
        return res.status(400).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: toDo._id
      });
    });
  }
];

// Update
module.exports.update = [
  function (req, res) {
    const id = req.params.id;
    ToDo.findOne({ _id: id }, function (err, toDo) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!toDo) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      toDo.title = req.body.title ? req.body.title : toDo.title;
      toDo.content = req.body.content ? req.body.content : toDo.content;
      toDo.category = req.body.category ? req.body.category : toDo.category;
      toDo.status = req.body.status ? req.body.status : toDo.status;
      toDo.done = req.body.done ? req.body.done : toDo.done;
      toDo.imported = req.body.imported ? req.body.imported : toDo.imported;
      toDo.importedFrom = req.body.importedFrom
        ? req.body.importedFrom
        : toDo.importedFrom;
      toDo.project = req.body.project ? req.body.project : toDo.project;
      toDo.user = req.body.user ? req.body.user : toDo.user;

      // save record
      toDo.save(function (err, toDo) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!toDo) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(toDo);
      });
    });
  }
];

// Delete
module.exports.delete = function (req, res) {
  const id = req.params.id;
  ToDo.findByIdAndRemove(id, function (err, toDo) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json(toDo);
  });
};
