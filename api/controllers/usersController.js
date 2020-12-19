// Including our config file
const validator = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const config = require("../config");

// Register
module.exports.register = [
  // validations rules
  validator.body("first_name", "Please enter First Name").isLength({ min: 1 }),
  validator.body("last_name", "Please enter Last Name").isLength({ min: 1 }),
  validator.body("email", "Please enter Email").isLength({ min: 1 }),
  validator.body("email").custom((value) => {
    return User.findOne({ email: value }).then((user) => {
      if (user !== null) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject("Email already in use");
      }
    });
  }),
  validator.body("password", "Please enter Password").isLength({ min: 1 }),

  function (req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // initialize record
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      settings: {
        toDoistApiKey: "",
        toDoistEnabled: false,
        workspaceSelected: "private"
      },
      login_method: "email"
    });

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    // save record
    user.save(function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error saving record",
          error: err
        });
      }
      return res.json({
        message: "saved",
        _id: user._id
      });
    });
  }
];

// Login
module.exports.login = [
  // validation rules
  validator.body("email", "Please enter Email").isLength({ min: 1 }),
  validator.body("password", "Please enter Password").isLength({ min: 1 }),

  function (req, res) {
    // throw validation errors
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    // validate email and password are correct
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error logging in",
          error: err
        });
      }

      if (user === null) {
        return res.status(500).json({
          message: "Email address you entered is not found."
        });
      }

      // compare submitted password with password inside db
      return bcrypt.compare(
        req.body.password,
        user.password,
        // eslint-disable-next-line handle-callback-err
        function (err, isMatched) {
          if (isMatched === true) {
            return res.json({
              user: {
                _id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                settings: user.settings,
                login_method: user.login_method
              },
              token: jwt.sign(
                {
                  _id: user._id,
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  settings: user.settings,
                  login_method: user.login_method
                },
                config.authSecret
              ) // generate JWT token here
            });
          } else {
            return res.status(500).json({
              message: "Invalid Email or Password entered."
            });
          }
        }
      );
    });
  }
];

module.exports.loginWithGoogle = [
  function (req, res) {
    // validate email and password are correct
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error logging in",
          error: err
        });
      }

      if (user === null) {
        const firstName = req.body.name.split(" ").slice(0, -1).join(" ");
        const lastName = req.body.name.split(" ").slice(-1).join(" ");
        // initialize record
        const user = new User({
          first_name: firstName,
          last_name: lastName,
          email: req.body.email,
          settings: {
            toDoistApiKey: "",
            toDoistEnabled: false,
            workspaceSelected: "private"
          },
          login_method: "google"
        });

        // save record
        user.save(function (err, user) {
          if (err) {
            return res.status(500).json({
              message: "Error saving record",
              error: err
            });
          }
        });

        return res.json({
          message: "user created",
          _id: user._id
        });
      }

      // return user
      return res.json({
        user: {
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          settings: user.settings,
          login_method: user.login_method
        },
        token: jwt.sign(
          {
            _id: user._id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            settings: user.settings,
            login_method: user.login_method
          },
          config.authSecret
        ) // generate JWT token here
      });
    });
  }
];

// Update
module.exports.update = [
  function (req, res) {
    const id = req.params.id;
    User.findOne({ _id: id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          message: "Error saving user",
          error: err
        });
      }
      if (!user) {
        return res.status(404).json({
          message: "No such user"
        });
      }

      // initialize record
      user.first_name = req.body.first_name
        ? req.body.first_name
        : user.first_name;
      user.last_name = req.body.last_name ? req.body.last_name : user.last_name;
      user.email = req.body.email ? req.body.email : user.email;
      user.password = req.body.password ? req.body.password : user.password;

      if (user.settings) {
        user.settings = req.body.settings ? req.body.settings : user.settings;
      } else {
        user.settings = req.body.settings;
      }

      if (req.body.password) {
        // encrypt password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
      }
      // save record
      user.save(function (err, user) {
        if (err) {
          return res.status(500).json({
            message: "Error getting user."
          });
        }
        if (!user) {
          return res.status(404).json({
            message: "No such user"
          });
        }
        return res.json(user);
      });
    });
  }
];

// Get User
module.exports.user = function (req, res) {
  const token = req.headers.authorization;
  if (token) {
    // verifies secret and checks if the token is expired
    jwt.verify(
      token.replace(/^Bearer\s/, ""),
      config.authSecret,
      function (err, decoded) {
        if (err) {
          return res.status(401).json({ message: "unauthorized" });
        } else {
          return res.json({ user: decoded });
        }
      }
    );
  } else {
    return res.status(401).json({ message: "unauthorized" });
  }
};

// Get Settings

// Get one
module.exports.showSettings = function (req, res) {
  const id = req.params.id;
  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      return res.status(500).json({
        message: "Error getting record."
      });
    }
    if (!user) {
      return res.status(404).json({
        message: "No such record"
      });
    }
    return res.json(user.settings);
  });
};
