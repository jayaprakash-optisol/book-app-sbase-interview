import { db } from "../drizzle/db";
import { Book } from "../drizzle/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import xlsx from "xlsx";

export async function generateWeeklyReport() {
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const newlyInsertedRecords = await db
    .select()
    .from(Book)
    .where(and(gte(Book.createdAt, lastWeek), eq(Book.isDeleted, false)));

  const deletedRecords = await db
    .select()
    .from(Book)
    .where(and(gte(Book.deletedAt, lastWeek), eq(Book.isDeleted, true)));

  const reportWorkbook = xlsx.utils.book_new();
  const reportSheet = xlsx.utils.json_to_sheet([
    ...deletedRecords,
    ...newlyInsertedRecords,
  ]);

  xlsx.utils.book_append_sheet(reportWorkbook, reportSheet, "New Books Report");

  const currentDate = new Date();
  const formattedDate = currentDate
    .toLocaleDateString("en-GB")
    .split("/")
    .join("-");

  const reportPath = `uploads/report-${formattedDate}.xlsx`;

  xlsx.writeFile(reportWorkbook, reportPath);

  return { newlyInsertedRecords, deletedRecords };
}
