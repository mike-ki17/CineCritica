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
      { name: "sala 1", description: "Cortos de drama y ficción narrativa", category: "drama", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "sala 2", description: "Documentales y no ficción", category: "documentary", imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "sala 3", description: "Animación y experimental", category: "animation", imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" },
      { name: "sala 4", description: "Género fantástico y terror", category: "fantasy", imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200" }
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
      { title: "En sus manos", director: "Monica Del Valle Fuenmayor Rojas", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Torre de Aburrá", director: "Andres Felipe Tabares Tabares", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Donde todo termina", director: "Diego Armando Ocampo Cárdenas", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Una esquina más", director: "Sebastian Estrada Vélez", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Segundo Tiempo", director: "Katherine Usquiano", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "El Visitante", director: "Brenda Avila", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Tenemos que hablar", director: "Vanessa Rojas Lopera", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "La tienda de la Nana", director: "Eleazar Maldonado", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Notas para mi hija", director: "Alejandra Álvarez Sánchez", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Sueños de Alto Vuelo", director: "Beatriz Ferrer", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Lo que se cuida", director: "Michel Agudelo Rodas", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "PROMESAS DE AMOR", director: "CARLOS ANDRES LONDOÑO VALLEJO", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "La energía más pura", director: "Pedro Antonio Valencia Ortiz", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "DE RUSIA CON AMOR", director: "JORGE HUMBERTO Villegas", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Polvo de estrellas", director: "Juan Diego Rodriguez Machado", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Uno es todo, todo es uno", director: "Gloria Marcela Hoyos Gómez", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "El mapa de los recuerdos", director: "Zoe Durango", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Invisibles", director: "Gabriel Jaime Muñoz", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "El Cruce de la vida", director: "Kevin Castaño García", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "COSAS POR HACER", director: "Javier Hernando Angel Londoño", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "MANOS QUE TRANSFORMAN una vida en el reciclaje", director: "williams adrian nuñez madero", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "El trofeo de la vida.", director: "Leonardo Beltran", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "RESPIRA", director: "Alex D. Gomez Ayala", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Debajo del valle", director: "Juan Felipe Marín Bedoya", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Donde Nacen las Fuertes", director: "Cristian Idarraga Quintero", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Reciclando Recuerdos", director: "Angel Stiven Guerrero Bustamante", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Vida Liquida", director: "Juliana Pinilla Avila", description: "", duration: "", roomId: 1, imageUrl: "" },
      { title: "Lo que cabe en una caja", director: "Sofia Lopera", description: "", duration: "", roomId: 1, imageUrl: "" },
      // Room 2 - Documentary
       { title: "INERCIA", director: "Sara Diaz Guzman", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Premicorto", director: "MariaFer ME", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Colores de esperanza", director: "Carolina Sanchez Muñoz", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "redención en el asfalto", director: "Brando García", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "MONSTRUOS", director: "Valentina Flórez", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Volviendo a Vivir", director: "Victor Manuel", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "La Magia De Las Luciérnagas", director: "arnold muñoz montoya", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "La decisión", director: "Julián García", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Siempre Está", director: "camilo andres sanchez murillo", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Pasos de vuelta", director: "Juan Esteban Roldán Acevedo", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Fallos Menores", director: "Laila Arboleda Garcia", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Corazón artificial", director: "Diegoleonvalenciavalencia", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Lo que no ves", director: "carolina ochoa", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "el peso de las flores", director: "Juan camilo Zuluaga", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "La tierra que nos une", director: "Byron Piedrahita", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Los Abrazos que nos debemos", director: "Luis Ernesto Ramirez Cardenas", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Mientras tanto, alguien", director: "David Andres Marin Cardona", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "UN DIA MAS", director: "Maria Derly Vélez Palacio", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "OXIGENO", director: "Julian David Giraldo Ruiz", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "¿Nos va a dejar camellar?", director: "Diego Mauricio Castaño Cardona", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "¿Y si fueras tú?", director: "Felipe Posada Hernández", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "45 CG", director: "Edgar Orlando Herrera Hernández", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Lo que florece en Medellín", director: "Luisa Morales", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "El Telón de los Recuerdos", director: "Carolina Rodriguez Gomez", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Agua y Tierra Herencia Común", director: "Britany Amaya Pelaez", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "Margarita sin Esperanza", director: "Johny Alejandro Álvarez López", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "LASAL", director: "Yirley Daniela Carrillo Gómez", description: "", duration: "", roomId: 2, imageUrl: "" },
      { title: "EL GUARDIAN DE LA BASURA", director: "Argenis Mauricio Piñango Reinoza", description: "", duration: "", roomId: 2, imageUrl: "" },
      // Room 3 - Animation
      { title: "El precio del barrio", director: "Johana Andrea Buitrago Duque", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "El vuelo de las Mariposas", director: "Henry Esneider Zapata Maya", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "LA MAGIA DEL CENTRO CORAZÓN DE MEDELLÍN", director: "Adriana Ramirez lopez", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "El Latido del Arte", director: "Anyi Tatiana Salazar Zapata", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Azul Celeste", director: "Laura Gutiérrez Valencia", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "la pispa", director: "Yorjander P's", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Ecos en el lienzo", director: "Johana Zapata", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Reutiliza tu sentir", director: "Luisa Fernanda Chalarca González", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "La Silla de Mamá", director: "Nicolle Estrada Díaz", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Guardianas", director: "Lina Marcela Rodríguez Ruiz", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Más allá del mal día cambia tu mirada", director: "Maicol daniel ocampo estrada", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "CRONÓMETRO", director: "Kevin Daniel Molina Muñoz", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Y MI MADRE LE DICE AMOR", director: "Carlos Naranjo", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "TU COLOR NO DEFINE", director: "Adolfo andres valdiris Mejía", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Tus acciones generan cambios", director: "Juan de Dios Osorio Perea", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "13:20 del abismo al propósito", director: "Mauricio Betancur", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "TRAZOS DE MEMORIAS", director: "Santiago Correa Bustamante", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "ARRANCARLO DE RAÍZ", director: "Raquel Batista Restrepo", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Hasta que sanes", director: "Sarai Restrepo Rodriguez", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "El recolector del olvido", director: "Juan Fernando Valencia Baena", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Unidos por el Balón", director: "Ana Milena Echeverri Velázquez", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "El Mingitorio del Barrio", director: "Ana Pinzón", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "***El fin es solo el comienzo", director: "ALEJANDRA PEREZ ACEVEDO", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "LA VOZ DE LA COSECHA", director: "Anderson Stiven Hernández Muñoz", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "EL CULPABLE SIEMPRE ES EL PRÓJIMO", director: "jaider stif narvaez calderon", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Del Santu André a tus ojos", director: "Daniel Vásquez", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Rutina Realmente Responsable", director: "Juan Esteban Gutiérrez", description: "", duration: "", roomId: 3, imageUrl: "" },
      { title: "Sin Un Solo Dolor", director: "Cesar Andrey Sánchez", description: "", duration: "", roomId: 3, imageUrl: "" },

      
      // Room 4 - Fantasy

      { title: "Se Consciente", director: "WILMAR ANDRES DAZA RIOS", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Después del silencio", director: "Ana Sofía García Oquendo", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Cuando Florece El Silencio", director: "Gabriel Jaime Garcia Isaza", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "NO PODEMOS SOLOS", director: "Juan Camilo Toro Ramírez", description: "", duration: "", roomId: 4, imageUrl: "" },

     { title: "¿Y vos qué?", director: "Susana Gallego Araque (Susi)", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "El Vendedor de Sueños", director: "Andres Felipe Garcia Pemberty", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Rodar también es resistir", director: "Karina Gaviria Zapata", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "La otra noticia", director: "Ximena Diaz henao", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Corazones reciclables", director: "Enrique Vargas Castañeda", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "UN CAFÉ QUE LATE EN LA CIUDAD", director: "fredy alberto callejas vargas", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Bucle", director: "Juan David Gil Rendón", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "LA PROMESA", director: "Andrea Marin Salazar", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Honor sin fronteras", director: "Jesus Garcia Cubillan", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "DOÑA MARTA TRANSFORMA", director: "Hanna Vasquez Agudelo", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "VIVE Medellín", director: "Alessandro Florian Sanchez", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "MOVERSE DISTINTO", director: "Nayi Luna Chica Hernandez", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "La Lavadora", director: "Ana Sofia Ruiz Gallego", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Actuar o Callar", director: "Doris Eugenia Agudelo Morales", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "pared delgada", director: "eduardo marbello", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Palabras sobran", director: "Manuela Vargas Mejía", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Grandes Consecuencias", director: "Julio Cesar Guerrero", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Simón dice", director: "Henry Mauricio Monsalve Builes", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "De lo que tiramos, a lo que soñamos", director: "Karen aguirre", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Cada acción cuenta, contágiate", director: "Didier Cossio", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "El Karma del Claxon", director: "Daniel Gonzalez", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "RESPIRA", director: "JOSE ANDRES MAHECHA GUTIERREZ", description: "", duration: "", roomId: 4, imageUrl: "" },
      { title: "Analepsis \"Retrocediendo hacia el futuro\"", director: "Isabella Zapata Moreno", description: "", duration: "", roomId: 4, imageUrl: "" }

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
    // const ratingsData = [
    //   // { shortId: 1, rating: "8.5" },
    //   // { shortId: 4, rating: "7.0" },
    //   // { shortId: 7, rating: "9.0" }
    // ];

    // ratingsData.forEach(rating => {
    //   const ratingRecord: Rating = {
    //     id: this.nextRatingId++,
    //     ...rating,
    //     createdAt: new Date(),
    //     updatedAt: new Date()
    //   };
    //   this.ratings.set(ratingRecord.shortId, ratingRecord);
    // });
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
