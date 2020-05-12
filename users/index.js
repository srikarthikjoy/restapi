const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const users = require("./users.model");
const config = require("../config");
router.put("/", async function (req, res) {
  try {
    const params = req.params;
    let newUser = new users({
      firstname: params.firstname,
      lastname: params.lastname,
      profilepic: params.profilepic,
      email: params.email,
      mobile: params.mobile,
      country: params.country,
    });
    await newUser.save();
    res.status(200).send("Saved sucessfully");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/", async function (req, res) {
  try {
    const params = req.body;
    let query = {};
    query["email"] = params.email;
    console.log(query);
    var user = await users.findOne(query);
    if (user) {
      console.log(config);
      let authToken = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
        expiresIn: "12h",
      });
      res.status(200).json({
        user: user,
        token: authToken,
      });
    } else {
      res.status(401).send("Please check username or password ");
    }
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/", async function (req, res) {
  try {
    var alluser = await users.find({});
    res.status(200).json(alluser);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.delete("/", async function (req, res) {
  try {
    const id = req.params.id;
    const update = { isValid: false };
    var doc = await users.findOneAndUpdate({ _id: id }, update);
    res.status(200).send("deleted successfully");
  } catch (e) {
    res.status(500).send(e);
  }
});
module.exports = router;
