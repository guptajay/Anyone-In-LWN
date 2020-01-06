const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const crud = require("../config/crud");

// Welcome Page
router.get("/", (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  crud.getStatus(function(err, subs) {
    res.render("dashboard", {
      name: req.user.name,
      email: req.user.email,
      status: subs
    });
  });
});

module.exports = router;
