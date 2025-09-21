import HealthcareCard from '../HealthcareCard';
import { FileText, Users, Bot, Pill } from 'lucide-react';

export default function HealthcareCardExample() {
  return (
    <div className="space-y-4 p-6">
      <HealthcareCard
        title="Health Records"
        description="View your medical history, prescriptions, and visit summaries"
        icon={<FileText />}
        status="available"
        onClick={() => console.log('Records clicked')}
      />
      <HealthcareCard
        title="Find Doctors"
        description="Browse specialists and book appointments"
        icon={<Users />}
        status="available"
        badge="5 Available"
        onClick={() => console.log('Doctors clicked')}
      />
      <HealthcareCard
        title="AI Assistant"
        description="Get health guidance and symptom assessment"
        icon={<Bot />}
        status="offline"
        onClick={() => console.log('AI clicked')}
      />
      <HealthcareCard
        title="Medicine Finder"
        description="Check local pharmacy stock and availability"
        icon={<Pill />}
        status="sync"
        onClick={() => console.log('Medicine clicked')}
      />
    </div>
  );
}