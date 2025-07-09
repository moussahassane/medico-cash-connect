
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Send, Image as ImageIcon, User, Paperclip, Phone, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: 'patient' | 'doctor';
  timestamp: Date;
  image?: string;
}

interface ConsultationChatProps {
  consultationId: string;
  onClose: () => void;
}

const ConsultationChat = ({ consultationId, onClose }: ConsultationChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [consultationTime, setConsultationTime] = useState(900); // 15 minutes en secondes
  const [consultation, setConsultation] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [isWaitingForDoctor, setIsWaitingForDoctor] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConsultation();
    loadMessages();
    
    // Subscribe to new messages
    const messageSubscription = supabase
      .channel('consultation-messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'consultation_messages',
          filter: `consultation_id=eq.${consultationId}`
        }, 
        (payload) => {
          const newMsg = payload.new;
          setMessages(prev => [...prev, {
            id: newMsg.id,
            text: newMsg.message_text,
            sender: newMsg.sender_type,
            timestamp: new Date(newMsg.created_at),
            image: newMsg.image_url
          }]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [consultationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isWaitingForDoctor) {
      const timer = setInterval(() => {
        setConsultationTime(prev => {
          if (prev <= 1) {
            toast({
              title: "Consultation terminée",
              description: "Votre temps de consultation est écoulé.",
              variant: "destructive"
            });
            endConsultation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWaitingForDoctor]);

  const loadConsultation = async () => {
    try {
      const { data: consultationData, error } = await supabase
        .from('consultations')
        .select(`
          *,
          doctors (*)
        `)
        .eq('id', consultationId)
        .single();

      if (error) throw error;

      setConsultation(consultationData);
      if (consultationData.doctors) {
        setDoctor(consultationData.doctors);
      }

      // If consultation is active, doctor has joined
      if (consultationData.status === 'active') {
        setIsWaitingForDoctor(false);
        // Add welcome message from doctor
        if (messages.length === 0) {
          const welcomeMessage: Message = {
            id: 'welcome',
            text: `Bonjour ! Je suis ${consultationData.doctors?.full_name || 'Dr. Martin'}. Comment puis-je vous aider aujourd'hui ?`,
            sender: 'doctor',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      } else {
        // Simulate doctor joining after a short delay
        setTimeout(() => {
          simulateDoctorJoining();
        }, Math.random() * 5000 + 3000); // 3-8 seconds
      }
    } catch (error) {
      console.error('Error loading consultation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la consultation.",
        variant: "destructive"
      });
    }
  };

  const loadMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = messagesData.map(msg => ({
        id: msg.id,
        text: msg.message_text,
        sender: msg.sender_type as 'patient' | 'doctor',
        timestamp: new Date(msg.created_at),
        image: msg.image_url
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const simulateDoctorJoining = async () => {
    try {
      // Update consultation status to active
      await supabase
        .from('consultations')
        .update({ 
          status: 'active',
          started_at: new Date().toISOString()
        })
        .eq('id', consultationId);

      setIsWaitingForDoctor(false);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome-' + Date.now(),
        text: `Bonjour ! Je suis ${doctor?.full_name || 'Dr. Martin'}. Comment puis-je vous aider aujourd'hui ?`,
        sender: 'doctor',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, welcomeMessage]);
      
      // Save welcome message to database
      await supabase
        .from('consultation_messages')
        .insert({
          consultation_id: consultationId,
          sender_type: 'doctor',
          message_text: welcomeMessage.text
        });

      toast({
        title: "Médecin connecté",
        description: `${doctor?.full_name || 'Dr. Martin'} a rejoint la consultation.`,
      });
    } catch (error) {
      console.error('Error updating consultation:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'patient',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Save message to database
    try {
      await supabase
        .from('consultation_messages')
        .insert({
          consultation_id: consultationId,
          sender_type: 'patient',
          message_text: newMessage
        });

      // Simulate doctor response
      setIsTyping(true);
      setTimeout(async () => {
        const responses = [
          'Je comprends vos symptômes. Pouvez-vous me donner plus de détails ?',
          'D\'après ce que vous me dites, voici mon diagnostic préliminaire...',
          'Avez-vous déjà eu des problèmes similaires par le passé ?',
          'Je vous recommande de prendre rendez-vous pour un examen plus approfondi.',
          'Pouvez-vous me préciser depuis quand vous ressentez ces symptômes ?'
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const doctorResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: randomResponse,
          sender: 'doctor',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, doctorResponse]);
        setIsTyping(false);

        // Save doctor response
        await supabase
          .from('consultation_messages')
          .insert({
            consultation_id: consultationId,
            sender_type: 'doctor',
            message_text: randomResponse
          });
      }, 2000 + Math.random() * 3000);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageMessage: Message = {
          id: Date.now().toString(),
          text: 'Image partagée',
          sender: 'patient',
          timestamp: new Date(),
          image: e.target?.result as string
        };
        setMessages(prev => [...prev, imageMessage]);

        // Save image message to database
        try {
          await supabase
            .from('consultation_messages')
            .insert({
              consultation_id: consultationId,
              sender_type: 'patient',
              message_text: 'Image partagée',
              image_url: e.target?.result as string
            });
        } catch (error) {
          console.error('Error saving image message:', error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const endConsultation = async () => {
    try {
      await supabase
        .from('consultations')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('id', consultationId);
      
      onClose();
    } catch (error) {
      console.error('Error ending consultation:', error);
      onClose();
    }
  };

  if (isWaitingForDoctor) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Connexion en cours...</h3>
          <p className="text-gray-600 mb-4">Un médecin va vous rejoindre dans quelques instants</p>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Annuler
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-blue-700">
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{doctor?.full_name || 'Dr. Martin'}</h3>
            <p className="text-xs text-blue-200">{doctor?.speciality || 'Médecin généraliste'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm font-medium">Temps restant</div>
            <div className="text-lg font-bold">{formatTime(consultationTime)}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={endConsultation}
            className="text-white hover:bg-blue-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 p-3 flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone className="w-4 h-4 mr-2" />
          Appel audio
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Video className="w-4 h-4 mr-2" />
          Appel vidéo
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'patient' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'patient'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Shared content"
                  className="w-full h-auto rounded mb-2"
                />
              )}
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'patient' ? 'text-blue-200' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationChat;
