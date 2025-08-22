import { type User, type InsertUser, type SearchHistory, type InsertSearchHistory, users, searchHistory } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  addSearchHistory(searchData: InsertSearchHistory): Promise<SearchHistory>;
  getSearchHistory(limit?: number): Promise<SearchHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async addSearchHistory(searchData: InsertSearchHistory): Promise<SearchHistory> {
    // For MemStorage, we'll just return a mock since we don't have persistent storage
    const mockHistory: SearchHistory = {
      id: randomUUID(),
      ...searchData,
      resultData: searchData.resultData || null,
      timestamp: new Date(),
    };
    return mockHistory;
  }

  async getSearchHistory(limit: number = 10): Promise<SearchHistory[]> {
    // For MemStorage, return empty array since we don't have persistent storage
    return [];
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async addSearchHistory(searchData: InsertSearchHistory): Promise<SearchHistory> {
    const [history] = await db
      .insert(searchHistory)
      .values(searchData)
      .returning();
    return history;
  }

  async getSearchHistory(limit: number = 10): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .orderBy(desc(searchHistory.timestamp))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
