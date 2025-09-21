import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Mic, Volume2 } from "lucide-react";

// Mock data - remove in production
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

export default function AIChat() {
  const [messages, setMessages] = useState(mockMessages);
  const [isOffline, setIsOffline] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: "I understand your concern. Let me help you with that. Can you provide more details about the symptoms?",
        timestamp: new Date(),
        severity: 'mild' as const,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const quickQuestions = [
    "Help with ADHD symptoms",
    "Autism support resources", 
    "Medication side effects",
    "When to see a doctor",
    "Breathing exercises",
    "Focus techniques"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log('Navigate back')}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-ai-chat-title">
                  AI Health Assistant
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isOffline ? "Limited offline mode" : "Available 24/7 for health guidance"}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={audioEnabled ? "default" : "outline"}
                size="icon"
                onClick={() => setAudioEnabled(!audioEnabled)}
                data-testid="button-audio-toggle"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Quick Questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(question)}
                  className="text-xs"
                  data-testid={`button-quick-question-${index}`}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isOffline={isOffline}
          />
        </div>
      </div>

      {/* Help Section */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-3">How I can help:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-foreground mb-2">Symptom Assessment</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• ADHD and autism symptom evaluation</li>
                  <li>• Severity assessment and recommendations</li>
                  <li>• When to seek professional help</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Self-Care Guidance</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Breathing and mindfulness exercises</li>
                  <li>• Focus and attention techniques</li>
                  <li>• Daily routine suggestions</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}