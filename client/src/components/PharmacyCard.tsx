import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Package } from "lucide-react";

interface PharmacyCardProps {
  name: string;
  address: string;
  distance: string;
  phone?: string;
  hours?: string;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
  medicationName?: string;
  onClick?: () => void;
  onCall?: () => void;
}

export default function PharmacyCard({ 
  name, 
  address, 
  distance, 
  phone, 
  hours, 
  stockStatus, 
  medicationName,
  onClick,
  onCall 
}: PharmacyCardProps) {
  const getStockColor = () => {
    switch (stockStatus) {
      case "in-stock": return "bg-healthcare-success text-white";
      case "low-stock": return "bg-healthcare-warning text-white";
      case "out-of-stock": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStockText = () => {
    switch (stockStatus) {
      case "in-stock": return "In Stock";
      case "low-stock": return "Low Stock";
      case "out-of-stock": return "Out of Stock";
      default: return "Unknown";
    }
  };

  return (
    <Card className="p-6 hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-pharmacy-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-pharmacy-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>{address}</span>
              <span>•</span>
              <span>{distance}</span>
            </div>
          </div>
          <Badge 
            className={getStockColor()}
            data-testid={`badge-stock-${stockStatus}`}
          >
            {getStockText()}
          </Badge>
        </div>

        {/* Medication Info */}
        {medicationName && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{medicationName}</span>
          </div>
        )}

        {/* Details */}
        <div className="space-y-2">
          {hours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{hours}</span>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {phone && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onCall?.();
              }}
              data-testid={`button-call-${name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          )}
          <Button 
            className="flex-1"
            disabled={stockStatus === "out-of-stock"}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Visit pharmacy clicked');
            }}
            data-testid={`button-visit-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </div>
    </Card>
  );
}