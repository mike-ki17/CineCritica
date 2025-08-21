import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { type Room, type ShortWithRating } from "@shared/schema";
import { ShortCard } from "@/components/short-card";
import { RatingModal } from "@/components/rating-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Room() {
  const { roomId } = useParams();
  const [selectedShort, setSelectedShort] = useState<ShortWithRating | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "rated" | "pending">("all");

  const { data: shorts = [], isLoading } = useQuery<ShortWithRating[]>({
    queryKey: ["/api/rooms", roomId, "shorts"],
    enabled: !!roomId,
  });

  const { data: room } = useQuery<Room>({
    queryKey: ["/api/rooms", roomId],
    enabled: !!roomId,
  });

  const filteredShorts = shorts.filter(short => {
    if (filter === "rated") return short.isRated;
    if (filter === "pending") return !short.isRated;
    return true;
  });

  const handleRateShort = (shortId: number) => {
    const short = shorts.find(s => s.id === shortId);
    if (short) {
      setSelectedShort(short);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShort(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-gray-700" />
          <Skeleton className="h-8 w-64 bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-96 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant="outline"
                className="text-cinema-gold border-cinema-gold hover:bg-cinema-gold hover:text-cinema-dark"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Salas
              </Button>
            </Link>
            <h2 className="text-3xl font-playfair font-bold text-cinema-light">
              {room?.name || `Sala ${roomId}`}
            </h2>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" 
                ? "bg-cinema-gold text-cinema-dark" 
                : "bg-transparent border border-cinema-gold text-cinema-gold hover:bg-cinema-gold hover:text-cinema-dark"
              }
            >
              Todos
            </Button>
            <Button
              size="sm"
              onClick={() => setFilter("rated")}
              className={filter === "rated" 
                ? "bg-status-rated text-white" 
                : "bg-transparent border border-status-rated text-status-rated hover:bg-status-rated hover:text-white"
              }
            >
              Evaluados
            </Button>
            <Button
              size="sm"
              onClick={() => setFilter("pending")}
              className={filter === "pending" 
                ? "bg-status-pending text-white" 
                : "bg-transparent border border-status-pending text-status-pending hover:bg-status-pending hover:text-white"
              }
            >
              Pendientes
            </Button>
          </div>
        </div>

        {filteredShorts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-cinema-muted text-lg">
              No hay cortos {filter === "all" ? "" : filter === "rated" ? "evaluados" : "pendientes"} en esta sala.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShorts.map((short) => (
              <ShortCard
                key={short.id}
                short={short}
                onRate={handleRateShort}
              />
            ))}
          </div>
        )}
      </div>

      <RatingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        short={selectedShort}
      />
    </>
  );
}
