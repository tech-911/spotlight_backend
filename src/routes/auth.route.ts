import express from "express";
const router = express.Router();
const { index, googlesignup } = require("../controller/auth.controller");

//---------------Index route---------------------

router.get("/", index);

//---------------Social Authentication---------------------

router.post("/googlesignup", googlesignup); //google authentication

module.exports = router;
