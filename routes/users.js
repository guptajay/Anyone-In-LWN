const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// User Model
const User = require("../models/User.js");

// Status Model
const Status = require("../models/Status.js");

// Login
router.get("/login", (req, res) => res.render("login"));

// Register
router.get("/register", (req, res) => res.render("register"));

// Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check if all fields are filled
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill all the fields" });
  }

  // Check password match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters long" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation Successfull
    User.findOne({ email: email }).then(user => {
      // The same user exists
      if (user) {
        errors.push({ msg: "The Email ID is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        const newStatus = new Status({
          name
        });

        // Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save status
            newStatus
              .save()
              .then()
              .catch(err => console.log(err));

            // Save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now successfully registered!"
                );
                res.redirect("/users/login");
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Update Status Handle
router.post("/dashboard", (req, res, next) => {
  const { userStatus, name, microlocation } = req.body;
  var myquery = { name: name };
  var newvalues = { $set: { status: userStatus, location: microlocation } };
  User.updateOne(myquery, newvalues, (err, res) => {
    if (err) throw err;
    else console.log("Updated");
  });
  req.flash("success_msg", "Status Updated Successfully");
  res.redirect("/dashboard");
});

// Logout Handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged Out Successfully");
  res.redirect("/users/login");
});

module.exports = router;
