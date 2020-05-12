var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var usersSchema = new Schema({
  firstname: String,
  lastname: String,
  profilepic: String,
  email: String,
  mobile: String,
  country: String,
  isValid: Boolean,
});
module.exports = mongoose.model("users", usersSchema);
