import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Mic, Bot, User, AlertTriangle, CheckCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  severity?: 'mild' | 'moderate' | 'severe';
}

interface ChatInterfaceProps {
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isOffline?: boolean;
}

export default function ChatInterface({ messages = [], onSendMessage, isOffline = false }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue);
      setInputValue("");
      console.log('Message sent:', inputValue);
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    console.log('Voice recording:', !isRecording);
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'severe': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'moderate': return <AlertTriangle className="w-4 h-4 text-healthcare-warning" />;
      case 'mild': return <CheckCircle className="w-4 h-4 text-healthcare-success" />;
      default: return null;
    }
  };

  return (
    <Card className="flex flex-col h-96" data-testid="chat-interface">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">AI Health Assistant</h3>
            <p className="text-sm text-muted-foreground">
              {isOffline ? "Limited offline mode" : "Online and ready"}
            </p>
          </div>
        </div>
        {isOffline && (
          <Badge variant="secondary" data-testid="badge-offline">
            Offline
          </Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">Hello! I'm here to help</p>
            <p className="text-sm">Describe your symptoms or ask any health questions</p>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.type}-${message.id}`}
            >
              {message.type === 'ai' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <div className="flex items-start gap-2 mb-1">
                  {message.type === 'ai' && message.severity && getSeverityIcon(message.severity)}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.type === 'user' && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isOffline ? "Limited offline responses..." : "Describe your symptoms..."}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 text-base"
            disabled={isOffline}
            data-testid="input-chat-message"
          />
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            onClick={handleVoiceToggle}
            disabled={isOffline}
            data-testid="button-voice-toggle"
          >
            <Mic className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!inputValue.trim() || isOffline}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}