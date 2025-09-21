import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, Filter, MapPin, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Demo patient ID for appointment booking
const DEMO_PATIENT_ID = 'demo-patient-123';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  phone?: string;
  isAvailable: boolean;
  rating?: number;
  distance?: string;
}

interface AppointmentData {
  doctorId: string;
  appointmentDate: string;
  type: 'consultation' | 'follow-up' | 'assessment';
  notes?: string;
}

export default function DoctorDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    loadDoctors();
  }, []);
  
  const loadDoctors = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/doctors');
      const doctorsData = await response.json();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUniqueSpecialties = () => {
    const specialties = doctors.map(d => d.specialty);
    return ["all", ...Array.from(new Set(specialties))];
  };
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesAvailability = !showAvailableOnly || doctor.isAvailable;
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });
  
  const getAvailabilityStatus = (doctor: Doctor): "available" | "offline" => {
    return doctor.isAvailable ? "available" : "offline";
  };
  
  const getNextSlot = (doctor: Doctor): string | undefined => {
    if (!doctor.isAvailable) return undefined;
    // In a real app, this would come from a calendar API
    const slots = ["Today 2:30 PM", "Tomorrow 9:00 AM", "Today 4:00 PM", "Tomorrow 11:30 AM"];
    return slots[Math.floor(Math.random() * slots.length)];
  };

  const handleDoctorClick = (doctor: Doctor) => {
    console.log('Doctor profile:', doctor);
    // Navigate to doctor detail page
  };

  const handleBooking = (doctor: Doctor) => {
    setBookingDoctor(doctor);
  };
  
  const bookAppointment = async (appointmentData: AppointmentData) => {
    try {
      setIsBooking(true);
      
      const response = await apiRequest('POST', '/api/appointments', {
        patientId: DEMO_PATIENT_ID,
        ...appointmentData
      });
      
      const appointment = await response.json();
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with Dr. ${bookingDoctor?.name} has been scheduled.`,
      });
      
      setBookingDoctor(null);
      
    } catch (error) {
      console.error('Failed to book appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsBooking(false);
    }
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
            {getUniqueSpecialties().map((specialty) => (
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
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
                  availability={getAvailabilityStatus(doctor)}
                  nextSlot={getNextSlot(doctor)}
                  distance={doctor.distance}
                  rating={doctor.rating ? doctor.rating / 10 : undefined}
                  onClick={() => handleDoctorClick(doctor)}
                  onBooking={() => handleBooking(doctor)}
                />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <Dialog open={!!bookingDoctor} onOpenChange={() => setBookingDoctor(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
          </DialogHeader>
          <BookingForm
            doctor={bookingDoctor}
            onSubmit={bookAppointment}
            isLoading={isBooking}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}