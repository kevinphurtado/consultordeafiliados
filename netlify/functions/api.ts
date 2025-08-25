import express, { Router } from "express";
import serverless from "serverless-http";
import { storage } from "../../server/storage";
import { insertSearchHistorySchema } from "../../shared/schema";

// Creamos una aplicación de Express específicamente para la función serverless
const app = express();
app.use(express.json());

const router = Router();

// Ruta para OBTENER el historial de búsqueda
router.get("/search-history", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const history = await storage.getSearchHistory(limit);
    res.json(history);
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para GUARDAR una nueva búsqueda en el historial
router.post("/search-history", async (req, res) => {
    try {
      const validatedData = insertSearchHistorySchema.parse(req.body);
      const history = await storage.addSearchHistory(validatedData);
      res.json(history);
    } catch (error) {
      console.error("Error saving search history:", error);
      res.status(400).json({ error: "Invalid search history data" });
    }
});

// Conectamos el router a la aplicación con el prefijo /api/
app.use("/.netlify/functions/api", router);

// Exportamos el manejador que Netlify utilizará
export const handler = serverless(app);