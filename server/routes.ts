import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRatingSchema } from "@shared/schema";
import { z } from "zod";
import ExcelJS from "exceljs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all rooms with statistics
  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rooms" });
    }
  });

  // Get shorts for a specific room
  app.get("/api/rooms/:roomId/shorts", async (req, res) => {
    try {
      const roomId = parseInt(req.params.roomId);
      if (isNaN(roomId)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      const room = await storage.getRoom(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      const shorts = await storage.getShortsByRoom(roomId);
      res.json(shorts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching shorts" });
    }
  });

  // Create or update a rating
  app.post("/api/ratings", async (req, res) => {
    try {
      const validatedData = insertRatingSchema.parse(req.body);
      
      const short = await storage.getShort(validatedData.shortId);
      if (!short) {
        return res.status(404).json({ message: "Short not found" });
      }

      const existingRating = await storage.getRating(validatedData.shortId);
      
      let rating;
      if (existingRating) {
        rating = await storage.updateRating(validatedData.shortId, validatedData.rating);
      } else {
        rating = await storage.createRating(validatedData);
      }
      
      res.json(rating);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid rating data", errors: error.errors });
      }
      res.status(500).json({ message: "Error saving rating" });
    }
  });

  // Get overall statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getOverallStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  // Export ratings to Excel
  app.get("/api/export/excel", async (req, res) => {
    try {
      const ratings = await storage.getAllRatings();
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Calificaciones');
      
      // Add headers
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Título del Corto', key: 'shortTitle', width: 30 },
        { header: 'Director', key: 'director', width: 25 },
        { header: 'Calificación', key: 'rating', width: 15 },
        { header: 'Fecha de Evaluación', key: 'createdAt', width: 20 }
      ];

      // Style the header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD4AF37' } // Cinema gold color
      };

      // Add data
      ratings.forEach(rating => {
        worksheet.addRow({
          id: rating.id,
          shortTitle: rating.shortTitle,
          director: rating.director,
          rating: parseFloat(rating.rating),
          createdAt: rating.createdAt?.toLocaleDateString()
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach(column => {
        column.width = Math.max(column.width || 0, 15);
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="calificaciones_cortos.xlsx"');

      // Write to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Excel export error:', error);
      res.status(500).json({ message: "Error generating Excel file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
