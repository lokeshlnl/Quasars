import { useState } from "react";
import HealthcareCard from "@/components/HealthcareCard";
import SyncStatusBanner from "@/components/SyncStatusBanner";
import { FileText, Users, Bot, Pill } from "lucide-react";

export default function Dashboard() {
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [isOnline, setIsOnline] = useState(true);

  // Mock data - remove in production
  const stats = {
    appointments: 3,
    doctors: 5,
    prescriptions: 2
  };

  const handleCardClick = (cardType: string) => {
    console.log(`Navigating to ${cardType}`);
    // Navigation logic would go here
  };

  const handleRetrySync = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sync Status */}
      <SyncStatusBanner
        isOnline={isOnline}
        lastSyncTime={new Date(Date.now() - 300000)}
        syncStatus={syncStatus}
        onRetrySync={handleRetrySync}
      />

      {/* Header */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">
            Welcome to Quasars Healthcare
          </h1>
          <p className="text-lg text-muted-foreground">
            Your health, accessible anywhere
          </p>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HealthcareCard
              title="Health Records"
              description="View your medical history, prescriptions, and visit summaries"
              icon={<FileText />}
              status="available"
              badge={stats.prescriptions > 0 ? `${stats.prescriptions} Active` : undefined}
              onClick={() => handleCardClick('records')}
            />
            
            <HealthcareCard
              title="Find Doctors"
              description="Browse specialists and book appointments"
              icon={<Users />}
              status="available"
              badge={`${stats.doctors} Available`}
              onClick={() => handleCardClick('doctors')}
            />
            
            <HealthcareCard
              title="AI Assistant"
              description="Get health guidance and symptom assessment"
              icon={<Bot />}
              status={isOnline ? "available" : "offline"}
              onClick={() => handleCardClick('ai-chat')}
            />
            
            <HealthcareCard
              title="Medicine Finder"
              description="Check local pharmacy stock and availability"
              icon={<Pill />}
              status="sync"
              onClick={() => handleCardClick('pharmacy')}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              className="p-4 bg-card hover-elevate rounded-lg border text-left transition-all"
              onClick={() => console.log('Emergency contacts')}
              data-testid="button-emergency-contacts"
            >
              <h3 className="font-medium text-foreground">Emergency Contacts</h3>
              <p className="text-sm text-muted-foreground mt-1">Quick access to emergency services</p>
            </button>
            
            <button 
              className="p-4 bg-card hover-elevate rounded-lg border text-left transition-all"
              onClick={() => console.log('Schedule reminder')}
              data-testid="button-medication-reminder"
            >
              <h3 className="font-medium text-foreground">Medication Reminders</h3>
              <p className="text-sm text-muted-foreground mt-1">Set up daily medication alerts</p>
            </button>
            
            <button 
              className="p-4 bg-card hover-elevate rounded-lg border text-left transition-all"
              onClick={() => console.log('Health tips')}
              data-testid="button-health-tips"
            >
              <h3 className="font-medium text-foreground">Daily Health Tips</h3>
              <p className="text-sm text-muted-foreground mt-1">ADHD and autism-friendly advice</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}