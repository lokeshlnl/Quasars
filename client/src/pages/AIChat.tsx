import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mic, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

// Demo configuration - in production this would come from auth/routing
const DEMO_PATIENT_ID = 'demo-patient-123';
const DEMO_SESSION_ID = `session-${Date.now()}`;

export default function AIChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(DEMO_SESSION_ID);
  const { toast } = useToast();
  
  // Load existing chat messages on component mount
  useEffect(() => {
    loadChatHistory();
  }, []);
  
  const loadChatHistory = async () => {
    try {
      const response = await apiRequest('GET', `/api/chat/${sessionId}`);
      const chatMessages = await response.json();
      const formattedMessages = chatMessages.map((msg: any) => ({
        id: msg.id,
        type: msg.type,
        content: msg.content,
        timestamp: new Date(msg.createdAt),
        severity: msg.severity
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/ai-chat', {
        patientId: DEMO_PATIENT_ID,
        message: content,
        sessionId
      });
      
      const result = await response.json();
      
      // Add both user and AI messages to the UI
      const userMessage = {
        id: result.userMessage.id,
        type: 'user' as const,
        content: result.userMessage.content,
        timestamp: new Date(result.userMessage.createdAt)
      };
      
      const aiMessage = {
        id: result.aiMessage.id,
        type: 'ai' as const,
        content: result.aiMessage.content,
        timestamp: new Date(result.aiMessage.createdAt),
        severity: result.aiMessage.severity
      };
      
      setMessages(prev => [...prev, userMessage, aiMessage]);
      
      // Show severity-based toast if needed
      if (result.severity === 'severe') {
        toast({
          title: "Important",
          description: "Please consider seeking immediate medical attention for severe symptoms.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "My child is having trouble focusing at school",
    "How can I help with autism sensory issues?", 
    "Are these ADHD medication side effects normal?",
    "When should I be concerned about these symptoms?",
    "Can you teach me breathing exercises?",
    "What focus techniques work for ADHD?"
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
          {isLoading && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              AI is thinking...
            </div>
          )}
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