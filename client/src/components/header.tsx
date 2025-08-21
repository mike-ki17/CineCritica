import { Film, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportToExcel } from "@/lib/api";
import { useState } from "react";

interface HeaderProps {
  currentView: "home" | "room";
  currentRoom?: { name: string };
}

export function Header({ currentView, currentRoom }: HeaderProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToExcel();
      toast({
        title: "Éxito",
        description: "El archivo Excel se ha descargado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo generar el archivo Excel",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="bg-cinema-charcoal border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Film className="text-cinema-gold text-2xl h-8 w-8" />
            <h1 className="text-xl font-playfair font-semibold text-cinema-light">
              CineEval Pro
            </h1>
          </div>

          {/* Breadcrumb Navigation */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-cinema-muted">Evaluación</span>
            <ChevronRight className="h-4 w-4 text-cinema-muted" />
            <span className="text-cinema-gold">
              {currentView === "home" ? "Salas" : currentRoom?.name || "Sala"}
            </span>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-cinema-gold text-cinema-dark hover:bg-yellow-400 font-medium"
            >
              <Download className="mr-2 h-4 w-4" />
              {isExporting ? "Exportando..." : "Exportar Excel"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
