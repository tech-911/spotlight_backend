import { Request, Response } from "express";
import Post from "../model/Post";
const cloudinary = require("../utils/cloudinary");

// --------------------Resolve type conflict for files--------------------

type MulterFile = Express.Multer.File;

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
      files?: MulterFile[];
    }
  }
}

// --------------------Posts Controller--------------------

const posts = async (req: Request, res: Response) => {
  const { caption, userId, email } = req.body;
  if (!email || !userId)
    return res.status(400).send({ error: "Email or userId required." });
  try {
    if (!req.file)
      return res.status(400).send({ error: "No single image file provided." });

    const fileStr = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(fileStr, {
      folder: `${email}_${userId}`,
    });
    console.log("Image uploaded successfully:", result);
    // result?.secure_url;

    // Create a new post and insert into database
    const article = await Post.create({
      caption,
      picture: result?.secure_url,
      user_id: userId,
      email,
      createdAt: Date.now(),
    });

    console.log(article);
    res.status(201).json({
      message: "Post created successfully",
      post: article,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      console.error("An unknown error occurred:", err);
      res.status(500).json({ message: "An unknown error occurred", err });
    }
  }
};

export { posts };
