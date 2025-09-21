import { useState } from "react";
import HealthTimeline from "@/components/HealthTimeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, Filter, Download } from "lucide-react";

// Mock data - remove in production  
const mockEvents = [
  {
    id: '1',
    date: new Date('2024-01-15T10:30:00'),
    type: 'appointment' as const,
    title: 'Initial ADHD Assessment',
    description: 'Comprehensive evaluation and discussion of symptoms and treatment options',
    doctor: 'Sarah Chen',
    status: 'completed' as const,
  },
  {
    id: '2',
    date: new Date('2024-01-20T14:15:00'),
    type: 'prescription' as const,
    title: 'ADHD Medication Started',
    description: 'Prescribed Methylphenidate 10mg twice daily. Monitor for side effects.',
    doctor: 'Sarah Chen',
    status: 'completed' as const,
  },
  {
    id: '3',
    date: new Date('2024-02-01T09:00:00'),
    type: 'test' as const,
    title: 'Follow-up Blood Work',
    description: 'Routine monitoring tests to check medication effects',
    doctor: 'Sarah Chen',
    status: 'completed' as const,
  },
  {
    id: '4',
    date: new Date('2024-02-15T11:30:00'),
    type: 'appointment' as const,
    title: 'Monthly Check-in',
    description: 'Review progress, adjust medication dosage if needed',
    doctor: 'Sarah Chen',
    status: 'upcoming' as const,
  },
];

export default function HealthRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleEventClick = (event: any) => {
    console.log('Event details:', event);
    // Open event details modal or navigate to detail page
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => console.log('Navigate back')}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-records-title">
              Health Records
            </h1>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-base"
                data-testid="input-search-records"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => console.log('Filter clicked')}
                data-testid="button-filter"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => console.log('Download records')}
                data-testid="button-download"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-primary">{mockEvents.filter(e => e.type === 'appointment').length}</h3>
              <p className="text-sm text-muted-foreground">Total Appointments</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-healthcare-success">{mockEvents.filter(e => e.type === 'prescription').length}</h3>
              <p className="text-sm text-muted-foreground">Active Prescriptions</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-accent-foreground">{mockEvents.filter(e => e.type === 'test').length}</h3>
              <p className="text-sm text-muted-foreground">Lab Tests</p>
            </Card>
          </div>

          {/* Timeline */}
          <HealthTimeline
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        </div>
      </div>
    </div>
  );
}