import { type RoomWithStats } from "@shared/schema";

interface RoomCardProps {
  room: RoomWithStats;
  onSelect: (roomId: number) => void;
}

export function RoomCard({ room, onSelect }: RoomCardProps) {
  const completionColor = room.completionRate >= 75 
    ? "status-rated" 
    : room.completionRate >= 50 
    ? "status-pending" 
    : "cinema-muted";

  return (
    <div
      className="bg-cinema-charcoal rounded-xl p-6 border border-gray-800 hover:border-cinema-gold hover:shadow-2xl hover:shadow-cinema-gold/20 transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(room.id)}
    >
      {room.imageUrl && (
        <img
          src={room.imageUrl}
          alt={`Sala ${room.name}`}
          className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
        />
      )}
      
      <h3 className="text-xl font-playfair font-semibold text-cinema-light mb-2">
        {room.name}
      </h3>
      
      <p className="text-cinema-muted text-sm mb-4">
        {room.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-cinema-gold font-medium">
          {room.shortsCount} cortos
        </span>
        
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full bg-${completionColor}`} />
          <span className="text-xs text-cinema-muted">
            {room.completionRate}% evaluados
          </span>
        </div>
      </div>
    </div>
  );
}
