import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface HealthcareCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  status?: "available" | "offline" | "sync";
  onClick?: () => void;
  badge?: string;
}

export default function HealthcareCard({ title, description, icon, status, onClick, badge }: HealthcareCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "available": return "bg-healthcare-success text-white";
      case "offline": return "bg-muted text-muted-foreground";
      case "sync": return "bg-healthcare-warning text-white";
      default: return "bg-primary text-primary-foreground";
    }
  };

  return (
    <Card className="p-6 hover-elevate cursor-pointer transition-all" onClick={onClick} data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-primary text-2xl">{icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="mt-1" data-testid={`badge-${badge.toLowerCase()}`}>
                  {badge}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed mb-4">{description}</p>
          {status && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
              <span className="text-sm text-muted-foreground capitalize">{status}</span>
            </div>
          )}
        </div>
        <ChevronRight className="text-muted-foreground ml-4 flex-shrink-0" size={20} />
      </div>
    </Card>
  );
}