
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Image as ImageIcon, X, Clock, User, UserMd, Phone } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  image?: string;
}

interface ConsultationChatProps {
  onClose: () => void;
}

const ConsultationChat = ({ onClose }: ConsultationChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Je suis Dr. Konaté, médecin généraliste. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'doctor',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsConnected(false);
          toast({
            title: "Consultation terminée",
            description: "Votre temps de consultation est écoulé. Merci d'avoir utilisé Vision Santé !",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'patient',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponses = [
        "Je comprends votre préoccupation. Pouvez-vous me donner plus de détails ?",
        "D'accord, et depuis combien de temps ressentez-vous ces symptômes ?",
        "Avez-vous pris des médicaments récemment ?",
        "Je vous recommande de surveiller ces symptômes. Si ça persiste, consultez en urgence.",
        "Basé sur vos symptômes, je pense que c'est bénin. Voici mes recommandations..."
      ];
      
      const randomResponse = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
      
      const doctorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'doctor',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const message: Message = {
          id: Date.now().toString(),
          text: "Image partagée",
          sender: 'patient',
          timestamp: new Date(),
          image: e.target?.result as string
        };
        setMessages(prev => [...prev, message]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <UserMd className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Dr. Konaté</h3>
            <div className="flex items-center space-x-2 text-sm text-blue-100">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>{isConnected ? 'En ligne' : 'Hors ligne'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-1">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'patient'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Image partagée"
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <p className="text-sm">{message.text}</p>
              <div className={`text-xs mt-1 ${
                message.sender === 'patient' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {isConnected ? (
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
          <div className="flex space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="px-3"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Décrivez vos symptômes..."
              className="flex-1"
            />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <div className="text-center text-red-800">
            <p className="font-medium">Consultation terminée</p>
            <p className="text-sm">Votre temps de consultation est écoulé.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationChat;
