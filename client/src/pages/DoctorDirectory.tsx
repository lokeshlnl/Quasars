import { useState } from "react";
import DoctorCard from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Filter, MapPin } from "lucide-react";

// Mock data - remove in production
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Chen',
    specialty: 'Pediatric Neurologist',
    hospital: 'Rural Community Health Center',
    availability: 'available' as const,
    nextSlot: 'Today 2:30 PM',
    distance: '1.2 km',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Dr. Michael Rodriguez',
    specialty: 'ADHD Specialist',
    hospital: 'Mountain View Clinic',
    availability: 'busy' as const,
    distance: '2.5 km',
    rating: 4.6,
  },
  {
    id: '3',
    name: 'Dr. Emily Watson',
    specialty: 'Family Medicine',
    hospital: 'Valley Health Services',
    availability: 'available' as const,
    nextSlot: 'Tomorrow 9:00 AM',
    distance: '0.8 km',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Dr. James Kumar',
    specialty: 'Child Psychology',
    hospital: 'Autism Support Center',
    availability: 'available' as const,
    nextSlot: 'Today 4:00 PM',
    distance: '3.1 km',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Psychiatry',
    hospital: 'Mental Health Clinic',
    availability: 'offline' as const,
    distance: '1.8 km',
    rating: 4.5,
  },
];

export default function DoctorDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const specialties = ["all", "Pediatric Neurologist", "ADHD Specialist", "Family Medicine", "Child Psychology", "Psychiatry"];

  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesAvailability = !showAvailableOnly || doctor.availability === "available";
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const handleDoctorClick = (doctor: any) => {
    console.log('Doctor profile:', doctor);
    // Navigate to doctor detail page
  };

  const handleBooking = (doctor: any) => {
    console.log('Booking appointment with:', doctor.name);
    // Open booking modal or navigate to booking page
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
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-doctors-title">
              Find Doctors
            </h1>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name, specialty, or hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-base"
              data-testid="input-search-doctors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                variant={selectedSpecialty === specialty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSpecialty(specialty)}
                data-testid={`button-specialty-${specialty.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {specialty === "all" ? "All Specialties" : specialty}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={showAvailableOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              data-testid="button-available-only"
            >
              <Filter className="w-4 h-4 mr-2" />
              Available Only
            </Button>
            <Badge variant="secondary" data-testid="badge-results-count">
              {filteredDoctors.length} doctors found
            </Badge>
          </div>
        </div>
      </div>

      {/* Location Banner */}
      <div className="p-4 bg-muted/50">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Showing doctors near Valley Town, Rural Area</span>
        </div>
      </div>

      {/* Doctor List */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredDoctors.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold mb-2">No doctors found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  hospital={doctor.hospital}
                  availability={doctor.availability}
                  nextSlot={doctor.nextSlot}
                  distance={doctor.distance}
                  rating={doctor.rating}
                  onClick={() => handleDoctorClick(doctor)}
                  onBooking={() => handleBooking(doctor)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}