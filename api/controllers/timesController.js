const validator = require("express-validator");
const Time = require("../models/Time");

// Get all
module.exports.list = function (req, res, next) {
  Time.find({}, function (err, times) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(times);
  });
};

module.exports.listByUser = function (req, res, next) {
  const id = req.params.user_id;
  Time.find({ user: id }, function (err, times) {
    if (err) {
      return res.status(500).json({
        message: "Error getting records."
      });
    }
    return res.json(times);
  });
};

// Get one
module.exports.show = function (req, res) {
  const id = req.params.id;
  Time.findOne({ _id: id }, function (err, time) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    if (!time) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    return res.json(time);
  });
};

// Create
module.exports.create = [
  function (req, res) {
    // initialize record
    const time = new Time(req.body);

    // save record
    time.save(function (err, time) {
      if (err) {
        return res.status(400).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: time._id
      });
    });
  }
];

// Update
module.exports.update = [
  function (req, res) {
    const id = req.params.id;
    Time.findOne({ _id: id }, function (err, time) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      if (!time) {
        return res.status(404).json({
          message: "No such record"
        });
      }

      // initialize record
      time.title = req.body.title ? req.body.title : time.title;
      time.content = req.body.content ? req.body.content : time.content;
      time.settings = req.body.settings ? req.body.settings : time.settings;
      time.user = req.body.user ? req.body.user : time.user;

      // save record
      time.save(function (err, time) {
        if (err) {
          return res.status(500).json({
            message: "Error getting record."
          });
        }
        if (!time) {
          return res.status(404).json({
            message: "No such record"
          });
        }
        return res.json(time);
      });
    });
  }
];

// Delete
module.exports.delete = function (req, res) {
  const id = req.params.id;
  Time.findByIdAndRemove(id, function (err, time) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    return res.json(time);
  });
};
