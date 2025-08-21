import { useQuery } from "@tanstack/react-query";
import { type RoomWithStats } from "@shared/schema";
import { RoomCard } from "@/components/room-card";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: rooms = [], isLoading } = useQuery<RoomWithStats[]>({
    queryKey: ["/api/rooms"],
  });

  const { data: stats } = useQuery<{
    totalShorts: number;
    ratedShorts: number;
    pendingShorts: number;
    averageRating: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const handleRoomSelect = (roomId: number) => {
    setLocation(`/room/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto bg-gray-700" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-playfair font-bold text-cinema-light">
          Selecciona una Sala de Evaluación
        </h2>
        <p className="text-lg text-cinema-muted max-w-2xl mx-auto">
          Elige entre nuestras 4 salas especializadas para evaluar los cortos cinematográficos.
          Cada sala contiene una selección curada de producciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onSelect={handleRoomSelect}
          />
        ))}
      </div>

      {/* Statistics Section */}
      {stats && (
        <div className="bg-cinema-charcoal rounded-xl p-8 border border-gray-800">
          <h3 className="text-2xl font-playfair font-semibold text-cinema-light mb-6">
            Progreso General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cinema-gold mb-2">
                {stats.totalShorts}
              </div>
              <div className="text-cinema-muted">Total de Cortos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-status-rated mb-2">
                {stats.ratedShorts}
              </div>
              <div className="text-cinema-muted">Evaluados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-status-pending mb-2">
                {stats.pendingShorts}
              </div>
              <div className="text-cinema-muted">Pendientes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cinema-copper mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-cinema-muted">Promedio</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
