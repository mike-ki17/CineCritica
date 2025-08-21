import { useQuery } from "@tanstack/react-query";
import { type RoomWithStats } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, Star, BarChart3, Target } from "lucide-react";

export default function ProgressPage() {
  const { data: rooms = [], isLoading: roomsLoading } = useQuery<RoomWithStats[]>({
    queryKey: ["/api/rooms"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalShorts: number;
    ratedShorts: number;
    pendingShorts: number;
    averageRating: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const isLoading = roomsLoading || statsLoading;

  // Calculate overall completion percentage
  const completionPercentage = stats && stats.totalShorts > 0 
    ? Math.round((stats.ratedShorts / stats.totalShorts) * 100) 
    : 0;

  // Get rating distribution (simplified for demo)
  const getRatingCategory = (rating: number) => {
    if (rating >= 8.5) return "Excelente";
    if (rating >= 7.0) return "Muy Bueno";
    if (rating >= 5.5) return "Bueno";
    if (rating >= 4.0) return "Regular";
    return "Mejorable";
  };

  const ratingCategory = stats ? getRatingCategory(stats.averageRating) : "";
  const ratingColor = stats 
    ? stats.averageRating >= 8.5 
      ? "text-green-400" 
      : stats.averageRating >= 7.0 
      ? "text-blue-400"
      : stats.averageRating >= 5.5 
      ? "text-yellow-400"
      : stats.averageRating >= 4.0 
      ? "text-orange-400"
      : "text-red-400"
    : "text-cinema-muted";

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-96 mx-auto bg-gray-700" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 bg-gray-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-playfair font-bold text-cinema-light">
          Progreso General de Evaluaciones
        </h2>
        <p className="text-lg text-cinema-muted max-w-2xl mx-auto">
          Seguimiento completo del avance en la evaluación de cortos cinematográficos
          en todas las salas especializadas.
        </p>
      </div>

      {/* Main Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-cinema-charcoal border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cinema-muted">
                Total de Cortos
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-cinema-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cinema-gold">
                {stats.totalShorts}
              </div>
              <p className="text-xs text-cinema-muted">
                En todas las salas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cinema-charcoal border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cinema-muted">
                Evaluados
              </CardTitle>
              <Target className="h-4 w-4 text-status-rated" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-rated">
                {stats.ratedShorts}
              </div>
              <p className="text-xs text-cinema-muted">
                {completionPercentage}% completado
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cinema-charcoal border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cinema-muted">
                Pendientes
              </CardTitle>
              <Clock className="h-4 w-4 text-status-pending" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-status-pending">
                {stats.pendingShorts}
              </div>
              <p className="text-xs text-cinema-muted">
                Por evaluar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cinema-charcoal border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cinema-muted">
                Promedio General
              </CardTitle>
              <Star className="h-4 w-4 text-cinema-copper" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${ratingColor}`}>
                {stats.averageRating.toFixed(1)}
              </div>
              <p className="text-xs text-cinema-muted">
                {ratingCategory}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Progress Overview */}
      {stats && (
        <Card className="bg-cinema-charcoal border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-cinema-light flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-cinema-gold" />
              Progreso de Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-cinema-muted">
                  Progreso Total
                </span>
                <span className="text-sm font-medium text-cinema-light">
                  {stats.ratedShorts} de {stats.totalShorts} cortos
                </span>
              </div>
              <Progress 
                value={completionPercentage} 
                className="w-full h-3 bg-gray-700"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-cinema-muted">0%</span>
                <span className="text-xs font-medium text-cinema-gold">
                  {completionPercentage}%
                </span>
                <span className="text-xs text-cinema-muted">100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-cinema-dark rounded-lg">
                <div className="text-2xl font-bold text-status-rated mb-1">
                  {completionPercentage}%
                </div>
                <div className="text-xs text-cinema-muted">Completado</div>
              </div>
              <div className="text-center p-4 bg-cinema-dark rounded-lg">
                <div className="text-2xl font-bold text-status-pending mb-1">
                  {100 - completionPercentage}%
                </div>
                <div className="text-xs text-cinema-muted">Restante</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Room-by-Room Progress */}
      <Card className="bg-cinema-charcoal border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-playfair text-cinema-light flex items-center">
            <Users className="mr-2 h-5 w-5 text-cinema-gold" />
            Progreso por Sala
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rooms.map((room) => (
              <div key={room.id} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-cinema-light">
                      {room.name}
                    </h4>
                    <p className="text-sm text-cinema-muted">
                      {room.category} • {room.shortsCount} cortos
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-cinema-gold">
                      {room.completionRate}%
                    </div>
                    <div className="text-xs text-cinema-muted">
                      {room.ratedCount}/{room.shortsCount}
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={room.completionRate} 
                  className="w-full h-2 bg-gray-700"
                />
                
                <div className="flex justify-between items-center text-xs">
                  <span className="text-status-rated">
                    ✓ {room.ratedCount} evaluados
                  </span>
                  <span className="text-status-pending">
                    ⏱ {room.shortsCount - room.ratedCount} pendientes
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {stats && stats.ratedShorts > 0 && (
        <Card className="bg-cinema-charcoal border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-playfair text-cinema-light">
              Insights de Evaluación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-cinema-dark rounded-lg">
                <div className="text-lg font-semibold text-cinema-light mb-2">
                  Estado Actual
                </div>
                <div className={`text-2xl font-bold ${ratingColor} mb-1`}>
                  {ratingCategory}
                </div>
                <div className="text-xs text-cinema-muted">
                  Basado en promedio de {stats.averageRating.toFixed(1)}
                </div>
              </div>

              <div className="text-center p-4 bg-cinema-dark rounded-lg">
                <div className="text-lg font-semibold text-cinema-light mb-2">
                  Productividad
                </div>
                <div className="text-2xl font-bold text-cinema-copper mb-1">
                  {Math.round((stats.ratedShorts / stats.totalShorts) * 100)}%
                </div>
                <div className="text-xs text-cinema-muted">
                  Evaluaciones completadas
                </div>
              </div>

              <div className="text-center p-4 bg-cinema-dark rounded-lg">
                <div className="text-lg font-semibold text-cinema-light mb-2">
                  Restante
                </div>
                <div className="text-2xl font-bold text-status-pending mb-1">
                  {stats.pendingShorts}
                </div>
                <div className="text-xs text-cinema-muted">
                  Cortos por evaluar
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}