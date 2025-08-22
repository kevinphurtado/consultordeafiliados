import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSearchHistorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search history routes
  app.post("/api/search-history", async (req, res) => {
    try {
      const validatedData = insertSearchHistorySchema.parse(req.body);
      const history = await storage.addSearchHistory(validatedData);
      res.json(history);
    } catch (error) {
      console.error("Error saving search history:", error);
      res.status(400).json({ error: "Invalid search history data" });
    }
  });

  app.get("/api/search-history", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const history = await storage.getSearchHistory(limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
