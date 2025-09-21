import DoctorCard from '../DoctorCard';

export default function DoctorCardExample() {
  return (
    <div className="space-y-4 p-6">
      <DoctorCard
        name="Dr. Sarah Chen"
        specialty="Pediatric Neurologist"
        hospital="Rural Community Health Center"
        availability="available"
        nextSlot="Today 2:30 PM"
        distance="1.2 km"
        rating={4.8}
        onClick={() => console.log('Doctor profile clicked')}
        onBooking={() => console.log('Booking appointment')}
      />
      <DoctorCard
        name="Dr. Michael Rodriguez"
        specialty="ADHD Specialist"
        hospital="Mountain View Clinic"
        availability="busy"
        distance="2.5 km"
        rating={4.6}
        onClick={() => console.log('Doctor profile clicked')}
        onBooking={() => console.log('Booking appointment')}
      />
      <DoctorCard
        name="Dr. Emily Watson"
        specialty="Family Medicine"
        hospital="Valley Health Services"
        availability="available"
        nextSlot="Tomorrow 9:00 AM"
        distance="0.8 km"
        rating={4.9}
        onClick={() => console.log('Doctor profile clicked')}
        onBooking={() => console.log('Booking appointment')}
      />
    </div>
  );
}