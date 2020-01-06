// Load Status Model
const User = require("../models/User");

module.exports.getStatus = function(cb) {
  User.find({}, { _id: 0, status: 1, name: 1, location: 1 }, cb);
};
