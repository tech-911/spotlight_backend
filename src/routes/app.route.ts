import express from "express";
import { posts } from "../controller/app.controller";
const upload = require("../utils/upload");
const router = express.Router();

//---------------Posts route---------------------

router.post("/sendpost", upload.single("image"), (req, res, next) => {
  Promise.resolve(posts(req, res)).catch(next);
});

module.exports = router;
