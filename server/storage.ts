import { type Room, type Short, type Rating, type InsertRoom, type InsertShort, type InsertRating, type ShortWithRating, type RoomWithStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Rooms
  getRooms(): Promise<RoomWithStats[]>;
  getRoom(id: number): Promise<Room | undefined>;
  
  // Shorts
  getShortsByRoom(roomId: number): Promise<ShortWithRating[]>;
  getShort(id: number): Promise<Short | undefined>;
  
  // Ratings
  getRating(shortId: number): Promise<Rating | undefined>;
  createRating(rating: InsertRating): Promise<Rating>;
  updateRating(shortId: number, rating: number): Promise<Rating>;
  getAllRatings(): Promise<(Rating & { shortTitle: string; director: string })[]>;
  
  // Statistics
  getOverallStats(): Promise<{
    totalShorts: number;
    ratedShorts: number;
    pendingShorts: number;
    averageRating: number;
  }>;
}

export class MemStorage implements IStorage {
  private rooms: Map<number, Room>;
  private shorts: Map<number, Short>;
  private ratings: Map<number, Rating>;
  private nextRoomId = 1;
  private nextShortId = 1;
  private nextRatingId = 1;

  constructor() {
    this.rooms = new Map();
    this.shorts = new Map();
    this.ratings = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize rooms
    const roomsData = [
      { name: "Sala Aurora", description: "Cortos de drama y ficción narrativa", category: "drama", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Sala Lumière", description: "Documentales y no ficción", category: "documentary", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Sala Vanguardia", description: "Animación y experimental", category: "animation", imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "Sala Méliès", description: "Género fantástico y terror", category: "fantasy", imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" }
    ];

    roomsData.forEach(room => {
      const roomRecord: Room = {
        id: this.nextRoomId++,
        ...room,
        createdAt: new Date()
      };
      this.rooms.set(roomRecord.id, roomRecord);
    });

    // Initialize shorts
    const shortsData = [
      // Room 1 - Drama
      { title: "El Último Suspiro", director: "María González", description: "Un drama intimista sobre la relación entre una abuela y su nieto en sus últimos días juntos.", duration: "12 min", roomId: 1, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { title: "Sombras en Blanco", director: "Carlos Mendoza", description: "Una exploración visual en blanco y negro sobre la memoria y el tiempo perdido.", duration: "8 min", roomId: 1, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { title: "Caminos Perdidos", director: "Luis Herrera", description: "La historia de un hombre que busca redención en un pueblo abandonado.", duration: "15 min", roomId: 1, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      
      // Room 2 - Documentary
      { title: "Voces del Río", director: "Ana Martínez", description: "Un documental sobre las comunidades ribereñas y su lucha por preservar su cultura.", duration: "20 min", roomId: 2, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { title: "El Arte de Resistir", director: "Pedro Suárez", description: "Retrato de artistas que mantienen vivas las tradiciones locales.", duration: "18 min", roomId: 2, imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      
      // Room 3 - Animation
      { title: "Universo Pequeño", director: "Ana Ruiz", description: "Una aventura animada que explora la amistad desde la perspectiva de insectos.", duration: "15 min", roomId: 3, imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { title: "Colores del Tiempo", director: "Miguel Torres", description: "Animación experimental sobre el paso del tiempo en la naturaleza.", duration: "10 min", roomId: 3, imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      { title: "El Jardín Digital", director: "Sofia López", description: "Una reflexión animada sobre la tecnología y la naturaleza.", duration: "12 min", roomId: 3, imageUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250" },
      
      // Room 4 - Fantasy
      { title: "La Puerta del Viento", director: "Diego Ramírez", description: "Una historia fantástica sobre un niño que descubre un mundo mágico.", duration: "16 min", roomId: 4, imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { title: "Susurros Nocturnos", director: "Elena Castro", description: "Terror psicológico en un antiguo teatro abandonado.", duration: "14 min", roomId: 4, imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" }
    ];

    shortsData.forEach(short => {
      const shortRecord: Short = {
        id: this.nextShortId++,
        ...short,
        createdAt: new Date()
      };
      this.shorts.set(shortRecord.id, shortRecord);
    });

    // Initialize some sample ratings
    const ratingsData = [
      { shortId: 1, rating: "8.5" },
      { shortId: 4, rating: "7.0" },
      { shortId: 7, rating: "9.0" }
    ];

    ratingsData.forEach(rating => {
      const ratingRecord: Rating = {
        id: this.nextRatingId++,
        ...rating,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.ratings.set(ratingRecord.shortId, ratingRecord);
    });
  }

  async getRooms(): Promise<RoomWithStats[]> {
    const roomsWithStats: RoomWithStats[] = [];
    
    for (const room of this.rooms.values()) {
      const roomShorts = Array.from(this.shorts.values()).filter(short => short.roomId === room.id);
      const ratedShorts = roomShorts.filter(short => this.ratings.has(short.id));
      
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
    return this.rooms.get(id);
  }

  async getShortsByRoom(roomId: number): Promise<ShortWithRating[]> {
    const roomShorts = Array.from(this.shorts.values()).filter(short => short.roomId === roomId);
    
    return roomShorts.map(short => {
      const rating = this.ratings.get(short.id);
      return {
        ...short,
        rating: rating ? parseFloat(rating.rating) : undefined,
        isRated: !!rating
      };
    });
  }

  async getShort(id: number): Promise<Short | undefined> {
    return this.shorts.get(id);
  }

  async getRating(shortId: number): Promise<Rating | undefined> {
    return this.ratings.get(shortId);
  }

  async createRating(insertRating: InsertRating): Promise<Rating> {
    const rating: Rating = {
      id: this.nextRatingId++,
      ...insertRating,
      rating: insertRating.rating.toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.ratings.set(insertRating.shortId, rating);
    return rating;
  }

  async updateRating(shortId: number, ratingValue: number): Promise<Rating> {
    const existingRating = this.ratings.get(shortId);
    
    if (existingRating) {
      existingRating.rating = ratingValue.toString();
      existingRating.updatedAt = new Date();
      return existingRating;
    }
    
    return this.createRating({ shortId, rating: ratingValue });
  }

  async getAllRatings(): Promise<(Rating & { shortTitle: string; director: string })[]> {
    const ratingsWithDetails: (Rating & { shortTitle: string; director: string })[] = [];
    
    for (const rating of this.ratings.values()) {
      const short = this.shorts.get(rating.shortId);
      if (short) {
        ratingsWithDetails.push({
          ...rating,
          shortTitle: short.title,
          director: short.director
        });
      }
    }
    
    return ratingsWithDetails;
  }

  async getOverallStats(): Promise<{
    totalShorts: number;
    ratedShorts: number;
    pendingShorts: number;
    averageRating: number;
  }> {
    const totalShorts = this.shorts.size;
    const ratedShorts = this.ratings.size;
    const pendingShorts = totalShorts - ratedShorts;
    
    const ratings = Array.from(this.ratings.values());
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + parseFloat(rating.rating), 0) / ratings.length 
      : 0;
    
    return {
      totalShorts,
      ratedShorts,
      pendingShorts,
      averageRating: Math.round(averageRating * 10) / 10
    };
  }
}

export const storage = new MemStorage();
