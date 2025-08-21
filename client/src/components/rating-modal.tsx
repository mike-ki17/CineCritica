import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Star, StarHalf } from "lucide-react";
import { type ShortWithRating } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  short: ShortWithRating | null;
}

export function RatingModal({ isOpen, onClose, short }: RatingModalProps) {
  const [rating, setRating] = useState(short?.rating || 5);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const ratingMutation = useMutation({
    mutationFn: async (data: { shortId: number; rating: number }) => {
      const response = await apiRequest("POST", "/api/ratings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      if (short) {
        queryClient.invalidateQueries({ queryKey: ["/api/rooms", short.roomId.toString(), "shorts"] });
      }
      
      toast({
        title: "Éxito",
        description: "La calificación se ha guardado correctamente",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo guardar la calificación",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!short) return;
    
    ratingMutation.mutate({
      shortId: short.id,
      rating,
    });
  };

  const handleQuickRating = (quickRating: number) => {
    setRating(quickRating);
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-6 w-6 fill-cinema-gold text-cinema-gold" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-6 w-6 fill-cinema-gold text-cinema-gold" />);
    }
    
    const remainingStars = 10 - Math.ceil(ratingValue);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-6 w-6 text-cinema-muted" />);
    }
    
    return stars;
  };

  if (!short) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cinema-charcoal border-gray-800 text-cinema-light max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair font-semibold">
            Calificar Corto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-cinema-light mb-2">
              {short.title}
            </h4>
            <p className="text-cinema-muted text-sm">
              Director: {short.director}
            </p>
          </div>

          <div className="space-y-4">
            <label className="block text-cinema-light font-medium">
              Calificación (1.0 - 10.0)
            </label>

            {/* Rating Display */}
            <div className="text-center">
              <div className="text-4xl font-bold text-cinema-gold mb-2">
                {rating.toFixed(1)}
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                {renderStars(rating).slice(0, 10)}
              </div>
            </div>

            {/* Rating Slider */}
            <div className="space-y-2">
              <Slider
                value={[rating]}
                onValueChange={(value) => setRating(value[0])}
                max={10}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-cinema-muted">
                <span>1.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Quick Rating Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {[2, 4, 6, 8, 10].map((quickRating) => (
                <Button
                  key={quickRating}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickRating(quickRating)}
                  className="border-gray-600 text-cinema-muted hover:border-cinema-gold hover:text-cinema-gold bg-transparent"
                >
                  {quickRating}.0
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-cinema-light hover:bg-gray-700"
              disabled={ratingMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={ratingMutation.isPending}
              className="flex-1 bg-cinema-gold text-cinema-dark hover:bg-yellow-400 font-medium"
            >
              {ratingMutation.isPending ? "Guardando..." : "Guardar Calificación"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
