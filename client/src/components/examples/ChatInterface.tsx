import ChatInterface from '../ChatInterface';

const mockMessages = [
  {
    id: '1',
    type: 'user' as const,
    content: 'My 8-year-old is having trouble focusing at school and seems very restless',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    type: 'ai' as const,
    content: 'Thank you for sharing. These symptoms could indicate ADHD, but I need more information. How long have you noticed these behaviors? Are they consistent across different settings?',
    timestamp: new Date(Date.now() - 240000),
    severity: 'moderate' as const,
  },
  {
    id: '3',
    type: 'user' as const,
    content: 'About 6 months now, both at home and school',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    type: 'ai' as const,
    content: 'Based on your description, I recommend scheduling an appointment with Dr. Sarah Chen, our pediatric neurologist. In the meantime, try creating a structured routine and consider mindfulness exercises.',
    timestamp: new Date(Date.now() - 120000),
    severity: 'mild' as const,
  },
];

export default function ChatInterfaceExample() {
  return (
    <div className="space-y-6 p-6">
      <ChatInterface
        messages={mockMessages}
        onSendMessage={(message) => console.log('Sent message:', message)}
        isOffline={false}
      />
      <ChatInterface
        messages={[]}
        onSendMessage={(message) => console.log('Sent message:', message)}
        isOffline={true}
      />
    </div>
  );
}