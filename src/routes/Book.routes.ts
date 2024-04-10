import express from "express";
import BookController from "../controllers/BookController";
import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/";

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/upload", upload.single("file"), BookController.uploadData);
router.get("/generate-report", BookController.generateReport);

router.post("/create", BookController.createBook);
router.get("/get/:letters", BookController.fetchBookByName);
router.get("/get", BookController.fetchAllBooks);
router.get("/removed-books", BookController.removedBooks);
router.get("/book/:id", BookController.fetchBook);

router.patch("/add/:bookId", BookController.addBook);
router.delete("/remove/:bookId", BookController.removeBook);

export = router;
