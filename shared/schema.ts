import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, decimal, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rooms = mysqlTable("rooms", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shorts = mysqlTable("shorts", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }).notNull(),
  director: varchar("director", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 50 }).notNull(),
  roomId: int("room_id").references(() => rooms.id).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ratings = mysqlTable("ratings", {
  id: int("id").primaryKey().autoincrement(),
  shortId: int("short_id").references(() => shorts.id).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
});

export const insertShortSchema = createInsertSchema(shorts).omit({
  id: true,
  createdAt: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  rating: z.number().min(1).max(10),
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertShort = z.infer<typeof insertShortSchema>;
export type InsertRating = z.infer<typeof insertRatingSchema>;

export type Room = typeof rooms.$inferSelect;
export type Short = typeof shorts.$inferSelect;
export type Rating = typeof ratings.$inferSelect;

// Combined types for API responses
export type ShortWithRating = Short & {
  rating?: number;
  isRated: boolean;
};

export type RoomWithStats = Room & {
  shortsCount: number;
  ratedCount: number;
  completionRate: number;
};
