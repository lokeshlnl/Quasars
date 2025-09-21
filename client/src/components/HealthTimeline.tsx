import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Pill, Activity } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: Date;
  type: 'appointment' | 'prescription' | 'test' | 'note';
  title: string;
  description: string;
  doctor?: string;
  status?: 'completed' | 'upcoming' | 'cancelled';
}

interface HealthTimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

export default function HealthTimeline({ events, onEventClick }: HealthTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-5 h-5" />;
      case 'prescription': return <Pill className="w-5 h-5" />;
      case 'test': return <Activity className="w-5 h-5" />;
      case 'note': return <FileText className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string, status?: string) => {
    if (status === 'cancelled') return 'text-destructive bg-destructive/10';
    if (status === 'upcoming') return 'text-healthcare-warning bg-healthcare-warning/10';
    
    switch (type) {
      case 'appointment': return 'text-primary bg-primary/10';
      case 'prescription': return 'text-healthcare-success bg-healthcare-success/10';
      case 'test': return 'text-accent-foreground bg-accent';
      case 'note': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default" className="bg-healthcare-success">Completed</Badge>;
      case 'upcoming': return <Badge variant="default" className="bg-healthcare-warning">Upcoming</Badge>;
      case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
      default: return null;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4" data-testid="health-timeline">
      {events.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No Health Records</h3>
          <p className="text-muted-foreground">Your medical history will appear here</p>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {events.map((event, index) => (
            <div 
              key={event.id} 
              className="relative flex gap-4 pb-6 cursor-pointer hover-elevate rounded-lg p-2 -ml-2"
              onClick={() => onEventClick?.(event)}
              data-testid={`timeline-event-${event.id}`}
            >
              {/* Timeline dot */}
              <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full border-4 border-background flex items-center justify-center ${getEventColor(event.type, event.status)}`}>
                {getEventIcon(event.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0 pt-2">
                <Card className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg" data-testid={`text-event-title-${event.id}`}>
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-base leading-relaxed mt-1">
                        {event.description}
                      </p>
                      {event.doctor && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Dr. {event.doctor}
                        </p>
                      )}
                    </div>
                    {event.status && getStatusBadge(event.status)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">{formatDate(event.date)}</span>
                    <span>{formatTime(event.date)}</span>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}