
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (userType: 'patient' | 'doctor') => void;
}

const LoginModal = ({ open, onClose, onSuccess }: LoginModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState({ email: '', password: '' });
  const [doctorCode, setDoctorCode] = useState('');

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté en tant que patient.",
      });
      setIsLoading(false);
      onSuccess('patient');
    }, 1000);
  };

  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate doctor code verification
    setTimeout(() => {
      if (doctorCode === "DOC2024") {
        toast({
          title: "Accès médecin accordé",
          description: "Bienvenue dans votre espace médecin.",
        });
        onSuccess('doctor');
      } else {
        toast({
          title: "Code incorrect",
          description: "Veuillez vérifier votre code médecin.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-900">Connexion</DialogTitle>
          <DialogDescription className="text-center">
            Choisissez votre type de compte
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="patient" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Patient</span>
            </TabsTrigger>
            <TabsTrigger value="doctor" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Médecin</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patient" className="space-y-4">
            <form onSubmit={handlePatientLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    value={patientData.email}
                    onChange={(e) => setPatientData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={patientData.password}
                    onChange={(e) => setPatientData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="doctor" className="space-y-4">
            <form onSubmit={handleDoctorLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doctorCode">Code Médecin</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="doctorCode"
                    type="password"
                    placeholder="Entrez votre code médecin"
                    className="pl-10"
                    value={doctorCode}
                    onChange={(e) => setDoctorCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Code de démonstration: DOC2024
              </p>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Vérification..." : "Accéder à l'espace médecin"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
