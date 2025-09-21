import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Star } from "lucide-react";

interface DoctorCardProps {
  name: string;
  specialty: string;
  hospital: string;
  avatar?: string;
  availability: "available" | "busy" | "offline";
  nextSlot?: string;
  distance?: string;
  rating?: number;
  onClick?: () => void;
  onBooking?: () => void;
}

export default function DoctorCard({ 
  name, 
  specialty, 
  hospital, 
  avatar, 
  availability, 
  nextSlot, 
  distance,
  rating,
  onClick,
  onBooking 
}: DoctorCardProps) {
  const getAvailabilityColor = () => {
    switch (availability) {
      case "available": return "bg-healthcare-success";
      case "busy": return "bg-healthcare-warning";
      case "offline": return "bg-muted";
      default: return "bg-muted";
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="p-6 hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-doctor-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-4">
        <div className="relative">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg font-semibold">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getAvailabilityColor()}`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground" data-testid={`text-doctor-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>{name}</h3>
              <p className="text-muted-foreground">{specialty}</p>
            </div>
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-healthcare-warning text-healthcare-warning" />
                <span className="text-sm font-medium">{rating}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{hospital}</span>
              {distance && <span>• {distance}</span>}
            </div>
            
            {nextSlot && availability === "available" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Next available: {nextSlot}</span>
              </div>
            )}
            
            <Badge 
              variant={availability === "available" ? "default" : "secondary"}
              className={availability === "available" ? "bg-healthcare-success" : ""}
              data-testid={`badge-availability-${availability}`}
            >
              {availability === "available" ? "Available" : availability === "busy" ? "Busy" : "Offline"}
            </Badge>
          </div>
          
          <Button 
            className="w-full" 
            disabled={availability !== "available"}
            onClick={(e) => {
              e.stopPropagation();
              onBooking?.();
            }}
            data-testid={`button-book-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {availability === "available" ? "Book Appointment" : "Not Available"}
          </Button>
        </div>
      </div>
    </Card>
  );
}