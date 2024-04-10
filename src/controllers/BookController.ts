import { NextFunction, Request, Response } from "express";
import xlsx from "xlsx";
import { db } from "../drizzle/db";
import { Book } from "../drizzle/schema";
import { generateWeeklyReport } from "../library/GenerateReport";
import { and, eq, gte, ilike } from "drizzle-orm";
import { faker } from "@faker-js/faker";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = req.body;
    const insertedBook = await db.insert(Book).values(book).returning();
    console.log("insertedBook", insertedBook);
    res.status(200).json(insertedBook);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const fetchBookByName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { letters } = req.params;
    const searchedBooks = await db
      .select()
      .from(Book)
      .where(and(ilike(Book.title, `%${letters}%`), eq(Book.isDeleted, false)));

    res.status(200).json(searchedBooks);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const fetchBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { id } = req.params;
    const book = await db.select().from(Book).where(eq(Book.id, id));
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = await generateWeeklyReport();
  res.status(200).json({
    deletedRecords: data?.deletedRecords,
    newRecords: data?.newlyInsertedRecords,
  });
};

const fetchAllBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allBooks = await db
      .select()
      .from(Book)
      .where(eq(Book.isDeleted, false));
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const removedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedRecords = await db
      .select()
      .from(Book)
      .where(eq(Book.isDeleted, true));

    res.status(200).json(deletedRecords);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const removeBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const [rmvBook] = await db
      .update(Book)
      .set({
        isDeleted: true,
      })
      .where(eq(Book.id, bookId))
      .returning();
    res.status(200).json(rmvBook);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const addBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;
    const [rmvBook] = await db
      .update(Book)
      .set({
        isDeleted: false,
      })
      .where(eq(Book.id, bookId))
      .returning();
    res.status(200).json(rmvBook);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const uploadData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).send("File not uploaded");
    }
    const filename = `uploads/${req.file.originalname}`;

    const workbook = xlsx.readFile(filename);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any = xlsx.utils.sheet_to_json(worksheet);

    const serializedData = data.map((row: any) => {
      const obj: any = {};
      for (let key in row) {
        const lowercaseKey = key.toLowerCase();
        obj[lowercaseKey] = row[key];
      }
      const randomPic = faker.image.urlPicsumPhotos({
        height: 800,
        width: 600,
      });
      return { ...obj, bookPhoto: randomPic };
    });

    const insertedData = await db
      .insert(Book)
      .values(serializedData)
      .returning();

    if (insertedData?.length === serializedData?.length) {
      res.status(200).json({ message: "Data Uploaded successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

export default {
  createBook,
  generateReport,
  fetchAllBooks,
  fetchBookByName,
  removedBooks,
  addBook,
  fetchBook,
  removeBook,
  uploadData,
};
