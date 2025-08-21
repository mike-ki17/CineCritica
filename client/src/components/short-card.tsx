import { type ShortWithRating } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Clock, Star, StarHalf } from "lucide-react";

interface ShortCardProps {
  short: ShortWithRating;
  onRate: (shortId: number) => void;
}

export function ShortCard({ short, onRate }: ShortCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-cinema-gold text-cinema-gold" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-cinema-gold text-cinema-gold" />);
    }
    
    const remainingStars = 10 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-cinema-muted" />);
    }
    
    return stars;
  };

  return (
    <div className="bg-cinema-charcoal rounded-xl overflow-hidden border border-gray-800 hover:border-cinema-gold transition-colors group">
      {short.imageUrl && (
        <img
          src={short.imageUrl}
          alt={short.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
        />
      )}
      {/* <p>{short.id}</p> */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-cinema-light">
            {short.title}
          </h3>
          
          <span className={`text-white text-xs px-2 py-1 rounded-full ${
            short.isRated ? 'bg-status-rated' : 'bg-status-pending'
          }`}>
            {short.isRated ? '✓ Evaluado' : '⏱ Pendiente'}
          </span>
        </div>
        
        <p className="text-cinema-muted text-sm mb-4">
          Director: {short.director}
        </p>
        
        {short.description && (
          <p className="text-cinema-muted text-sm mb-4">
            {short.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-cinema-muted" />
            <span className="text-cinema-light text-sm">{short.duration}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {short.isRated && short.rating ? (
              <>
                <span className="text-cinema-gold font-bold text-lg">
                  {short.rating.toFixed(1)}
                </span>
                <div className="flex">
                  {renderStars(short.rating).slice(0, 5)}
                </div>
              </>
            ) : (
              <span className="text-cinema-muted text-sm">Sin calificar</span>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => onRate(short.id)}
          className={`w-full font-medium ${
            short.isRated 
              ? 'bg-cinema-copper hover:bg-orange-600 text-white' 
              : 'bg-cinema-gold hover:bg-yellow-400 text-cinema-dark'
          }`}
        >
          {short.isRated ? 'Editar Calificación' : 'Calificar Ahora'}
        </Button>
      </div>
    </div>
  );
}
