import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  searchType: text("search_type").notNull(), // 'simple' or 'advanced'
  searchParams: json("search_params").notNull(), // stores search parameters
  resultFound: text("result_found").notNull(), // 'true' or 'false' 
  resultData: json("result_data"), // stores found affiliate data if any
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).pick({
  searchType: true,
  searchParams: true,
  resultFound: true,
  resultData: true,
});

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;
