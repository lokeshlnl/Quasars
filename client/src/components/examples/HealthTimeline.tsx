import HealthTimeline from '../HealthTimeline';

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
  {
    id: '5',
    date: new Date('2024-02-20T16:00:00'),
    type: 'note' as const,
    title: 'Behavioral Therapy Session',
    description: 'Cognitive behavioral therapy focused on attention and organization skills',
    doctor: 'Michael Rodriguez',
    status: 'upcoming' as const,
  },
];

export default function HealthTimelineExample() {
  return (
    <div className="space-y-6 p-6">
      <HealthTimeline
        events={mockEvents}
        onEventClick={(event) => console.log('Timeline event clicked:', event.title)}
      />
      <HealthTimeline
        events={[]}
        onEventClick={(event) => console.log('Timeline event clicked:', event.title)}
      />
    </div>
  );
}