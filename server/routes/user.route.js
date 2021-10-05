const router = require("express").Router();

const ctrlUser = require("../controllers/user");
const ctrlProfile = require("../controllers/profile");
const authorization = require("../authorization/tokenVerification");

//Register User Route
router.post("/register", ctrlUser.registerModule);

//Login User Route
router.post("/login", ctrlUser.loginModule);

//Profile
router.get("/profile", authorization.authorization, ctrlProfile.profile);
//Posts
router.get("/posts", authorization.authorization, ctrlProfile.posts);

module.exports = router;
