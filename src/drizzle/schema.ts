import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const UserRole = pgEnum("userRole", ["ADMIN", "BASIC"]);

export const User = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  age: integer("age").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: UserRole("userRole").default("BASIC").notNull(),
});

export const Book = pgTable("book", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  genre: varchar("genre").notNull(),
  publisher: varchar("publisher").notNull(),
  bookPhoto: varchar("book_photo"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
