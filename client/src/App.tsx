import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import Home from "@/pages/home";
import Room from "@/pages/room";
import ProgressPage from "@/pages/progress";
import NotFound from "@/pages/not-found";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { type Room as RoomType } from "@shared/schema";


function AppContent() {
  const [location] = useLocation();
  
  // Extract room ID from location for breadcrumb
  const roomMatch = location.match(/^\/room\/(\d+)/);
  const roomId = roomMatch ? roomMatch[1] : null;
  
  const { data: room } = useQuery<RoomType>({
    queryKey: ["/api/rooms", roomId],
    enabled: !!roomId,
  });

  const currentView = location === "/" ? "home" : location === "/progress" ? "progress" : "room";
const queryClient = new QueryClient();
  return (
    <div className="min-h-screen bg-cinema-dark text-cinema-light">
      <Header 
        currentView={currentView} 
        currentRoom={room ? { name: room.name } : undefined} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/progress" component={ProgressPage} />
          <Route path="/room/:roomId" component={Room} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
