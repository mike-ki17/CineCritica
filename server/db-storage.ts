import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { type Room, type Short, type Rating, type InsertRoom, type InsertShort, type InsertRating, type ShortWithRating, type RoomWithStats } from "@shared/schema";
import { rooms, shorts, ratings } from "@shared/schema";

export class DbStorage implements IStorage {
  async getRooms(): Promise<RoomWithStats[]> {
    const allRooms = await db.select().from(rooms);
    const roomsWithStats: RoomWithStats[] = [];
    
    for (const room of allRooms) {
      const roomShorts = await db
        .select()
        .from(shorts)
        .where(eq(shorts.roomId, room.id));
      
      const ratedShorts = await db
        .select()
        .from(shorts)
        .innerJoin(ratings, eq(shorts.id, ratings.shortId))
        .where(eq(shorts.roomId, room.id));
      
      const roomWithStats: RoomWithStats = {
        ...room,
        shortsCount: roomShorts.length,
        ratedCount: ratedShorts.length,
        completionRate: roomShorts.length > 0 ? Math.round((ratedShorts.length / roomShorts.length) * 100) : 0
      };
      
      roomsWithStats.push(roomWithStats);
    }
    
    return roomsWithStats;
  }

  async getRoom(id: number): Promise<Room | undefined> {
    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id));
    return room;
  }

  async getShortsByRoom(roomId: number): Promise<ShortWithRating[]> {
    const shortsList = await db
      .select()
      .from(shorts)
      .where(eq(shorts.roomId, roomId));
    
    const ratingsList = await db
      .select()
      .from(ratings);
    
    return shortsList.map(short => {
      const rating = ratingsList.find(r => r.shortId === short.id);
      return {
        ...short,
        rating: rating ? parseFloat(rating.rating.toString()) : undefined,
        isRated: !!rating
      };
    });
  }

  async getShort(id: number): Promise<Short | undefined> {
    const [short] = await db
      .select()
      .from(shorts)
      .where(eq(shorts.id, id));
    return short;
  }

  async getRating(shortId: number): Promise<Rating | undefined> {
    const [rating] = await db
      .select()
      .from(ratings)
      .where(eq(ratings.shortId, shortId));
    return rating;
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const [rating] = await db
      .insert(ratings)
      .values({
        ...insertRating,
        rating: insertRating.rating.toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return rating;
  }

  async updateRating(shortId: number, ratingValue: number): Promise<Rating> {
    const [rating] = await db
      .update(ratings)
      .set({
        rating: ratingValue.toString(),
        updatedAt: new Date()
      })
      .where(eq(ratings.shortId, shortId))
      .returning();
    
    if (!rating) {
      return this.createRating({ shortId, rating: ratingValue });
    }
    
    return rating;
  }

  async removeRating(shortId: number): Promise<void> {
    await db
      .delete(ratings)
      .where(eq(ratings.shortId, shortId));
  }

  async getAllRatings(): Promise<(Rating & { shortTitle: string; director: string })[]> {
    const result = await db
      .select({
        ...ratings,
        shortTitle: shorts.title,
        director: shorts.director
      })
      .from(ratings)
      .innerJoin(shorts, eq(ratings.shortId, shorts.id));
    
    return result;
  }

  async getOverallStats(): Promise<{
    totalShorts: number;
    ratedShorts: number;
    pendingShorts: number;
    averageRating: number;
  }> {
    const allShorts = await db.select().from(shorts);
    const allRatings = await db.select().from(ratings);
    
    const totalShorts = allShorts.length;
    const ratedShorts = allRatings.length;
    const pendingShorts = totalShorts - ratedShorts;
    
    const averageRating = ratedShorts > 0
      ? allRatings.reduce((sum, rating) => sum + parseFloat(rating.rating.toString()), 0) / ratedShorts
      : 0;
    
    return {
      totalShorts,
      ratedShorts,
      pendingShorts,
      averageRating: Math.round(averageRating * 10) / 10
    };
  }
}
