import { useState } from "react";
import PharmacyCard from "@/components/PharmacyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Search, MapPin, Pill } from "lucide-react";

// Mock data - remove in production
const mockPharmacies = [
  {
    id: '1',
    name: 'Green Valley Pharmacy',
    address: '123 Main Street, Valley Town',
    distance: '0.5 km',
    phone: '(555) 123-4567',
    hours: 'Open until 8:00 PM',
    stockStatus: 'in-stock' as const,
  },
  {
    id: '2',
    name: 'Mountain View Drugs',
    address: '456 Hill Road, Highland',
    distance: '1.2 km',
    phone: '(555) 987-6543',
    hours: 'Open 24 hours',
    stockStatus: 'low-stock' as const,
  },
  {
    id: '3',
    name: 'Community Health Pharmacy',
    address: '789 Center Ave, Downtown',
    distance: '2.1 km',
    phone: '(555) 456-7890',
    hours: 'Closed (Opens at 9:00 AM)',
    stockStatus: 'out-of-stock' as const,
  },
  {
    id: '4',
    name: 'Rural Care Dispensary',
    address: '321 Country Road, Farmland',
    distance: '3.5 km',
    phone: '(555) 234-5678',
    hours: 'Open until 6:00 PM',
    stockStatus: 'in-stock' as const,
  },
];

const commonMedications = [
  'Methylphenidate (Ritalin)',
  'Aripiprazole (Abilify)',
  'Sertraline (Zoloft)',
  'Risperidone (Risperdal)',
  'Atomoxetine (Strattera)',
  'Fluoxetine (Prozac)'
];

export default function PharmacyFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedication, setSelectedMedication] = useState<string>("Methylphenidate (Ritalin)");
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const filteredPharmacies = mockPharmacies.filter(pharmacy => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStock = !showInStockOnly || pharmacy.stockStatus === "in-stock";
    return matchesSearch && matchesStock;
  });

  const handlePharmacyClick = (pharmacy: any) => {
    console.log('Pharmacy details:', pharmacy);
  };

  const handleCall = (pharmacy: any) => {
    console.log('Calling:', pharmacy.name, pharmacy.phone);
  };

  const getStockCount = (status: string) => {
    return mockPharmacies.filter(p => p.stockStatus === status).length;
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
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-pharmacy-title">
              Medicine Finder
            </h1>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search pharmacies or enter medication name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base"
              data-testid="input-search-pharmacy"
            />
          </div>

          {/* Medication Selection */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Common ADHD/Autism Medications:</p>
            <div className="flex flex-wrap gap-2">
              {commonMedications.map((med) => (
                <Button
                  key={med}
                  variant={selectedMedication === med ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMedication(med)}
                  className="text-xs"
                  data-testid={`button-medication-${med.split(' ')[0].toLowerCase()}`}
                >
                  {med}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location & Filters */}
      <div className="p-4 bg-muted/50">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Searching near Valley Town, Rural Area</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant={showInStockOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowInStockOnly(!showInStockOnly)}
              data-testid="button-in-stock-only"
            >
              In Stock Only
            </Button>
            <Badge variant="secondary" data-testid="badge-pharmacy-count">
              {filteredPharmacies.length} pharmacies
            </Badge>
          </div>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-healthcare-success">{getStockCount('in-stock')}</h3>
              <p className="text-sm text-muted-foreground">In Stock</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-healthcare-warning">{getStockCount('low-stock')}</h3>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </Card>
            <Card className="p-4 text-center">
              <h3 className="text-2xl font-bold text-destructive">{getStockCount('out-of-stock')}</h3>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </Card>
          </div>

          {/* Selected Medication */}
          {selectedMedication && (
            <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3">
                <Pill className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Searching for: {selectedMedication}</h3>
                  <p className="text-sm text-muted-foreground">Stock status updated 15 minutes ago</p>
                </div>
              </div>
            </Card>
          )}

          {/* Pharmacy List */}
          <div className="space-y-4">
            {filteredPharmacies.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No pharmacies found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredPharmacies.map((pharmacy) => (
                <PharmacyCard
                  key={pharmacy.id}
                  name={pharmacy.name}
                  address={pharmacy.address}
                  distance={pharmacy.distance}
                  phone={pharmacy.phone}
                  hours={pharmacy.hours}
                  stockStatus={pharmacy.stockStatus}
                  medicationName={selectedMedication}
                  onClick={() => handlePharmacyClick(pharmacy)}
                  onCall={() => handleCall(pharmacy)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}