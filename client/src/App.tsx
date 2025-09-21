import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Dashboard from "@/pages/Dashboard";
import HealthRecords from "@/pages/HealthRecords";
import DoctorDirectory from "@/pages/DoctorDirectory";
import AIChat from "@/pages/AIChat";
import PharmacyFinder from "@/pages/PharmacyFinder";
import NotFound from "@/pages/not-found";
import heroImage from "@assets/generated_images/Rural_healthcare_worker_helping_patient_1343bf77.png";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/records" component={HealthRecords} />
      <Route path="/doctors" component={DoctorDirectory} />
      <Route path="/ai-chat" component={AIChat} />
      <Route path="/pharmacy" component={PharmacyFinder} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            {/* App Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
              <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">Q</span>
                  </div>
                  <h1 className="text-xl font-bold text-foreground">Quasars Healthcare</h1>
                </div>
                <ThemeToggle />
              </div>
            </header>
            
            {/* Main Content */}
            <main>
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
