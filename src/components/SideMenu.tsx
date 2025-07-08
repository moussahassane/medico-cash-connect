import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  User,
  HelpCircle,
  Info,
  Shield,
  FileText,
  Upload,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onDoctorLogin: () => void;
}

const SideMenu = ({ open, onClose, onDoctorLogin }: SideMenuProps) => {
  const [activeSection, setActiveSection] = useState<string>('main');
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    experience: '',
    description: ''
  });

  const handleDoctorRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demande envoyée",
      description: "Votre demande d'enregistrement a été soumise. Nous vous contacterons sous 48h.",
    });
    setActiveSection('main');
  };

  const menuItems = [
    {
      id: 'doctor-register',
      title: 'Je suis médecin',
      icon: User,
      description: 'Rejoignez notre équipe'
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      description: 'Questions fréquentes'
    },
    {
      id: 'about',
      title: 'À propos',
      icon: Info,
      description: 'En savoir plus'
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      icon: Shield,
      description: 'Politique de confidentialité'
    }
  ];

  const renderMainMenu = () => (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className="w-full justify-start h-auto p-4"
          onClick={() => setActiveSection(item.id)}
        >
          <item.icon className="w-5 h-5 mr-3" />
          <div className="text-left">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-500">{item.description}</div>
          </div>
        </Button>
      ))}
      
      <Separator className="my-4" />
      
      <Button
        variant="outline"
        className="w-full"
        onClick={onDoctorLogin}
      >
        Connexion Médecin
      </Button>
    </div>
  );

  const renderDoctorRegistration = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setActiveSection('main')}
        className="mb-4"
      >
        ← Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Inscription Médecin</CardTitle>
          <CardDescription>
            Rejoignez notre plateforme de téléconsultation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDoctorRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="speciality">Spécialité *</Label>
              <Input
                id="speciality"
                value={doctorForm.speciality}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, speciality: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experience">Années d'expérience</Label>
              <Input
                id="experience"
                value={doctorForm.experience}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Présentation</Label>
              <Textarea
                id="description"
                value={doctorForm.description}
                onChange={(e) => setDoctorForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Parlez-nous de votre parcours..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Diplôme médical *</Label>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Télécharger le diplôme
              </Button>
              <p className="text-xs text-gray-500">
                Format accepté: PDF, JPG, PNG (max 5MB)
              </p>
            </div>
            
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Soumettre la demande
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setActiveSection('main')}
        className="mb-4"
      >
        ← Retour
      </Button>
      
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              1. Cliquez sur "Appeler un médecin"<br/>
              2. Payez via Mobile Money<br/>
              3. Vous êtes automatiquement connecté à un médecin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quels sont les tarifs ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Consultation standard: 1000 FCFA<br/>
              Consultation urgente: 2000 FCFA
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Les paiements sont-ils sécurisés ?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Oui, nous utilisons FedaPay qui assure la sécurité de toutes vos transactions Mobile Money.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setActiveSection('main')}
        className="mb-4"
      >
        ← Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Vision Santé</CardTitle>
          <CardDescription>Votre médecin en un clic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Vision Santé révolutionne l'accès aux soins de santé en Afrique en permettant 
            des consultations médicales instantanées via votre smartphone.
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium">Notre mission</h4>
            <p className="text-sm text-gray-600">
              Rendre les soins de santé accessibles à tous, partout et à tout moment.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Contact</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+227 80 81 31 13</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              <span>karimassani52@gmail.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={() => setActiveSection('main')}
        className="mb-4"
      >
        ← Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Politique de confidentialité</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Protection des données</h4>
            <p className="text-sm text-gray-600">
              Vos données médicales sont chiffrées et protégées selon les normes internationales.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Confidentialité médicale</h4>
            <p className="text-sm text-gray-600">
              Toutes les consultations respectent le secret médical le plus strict.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Utilisation des données</h4>
            <p className="text-sm text-gray-600">
              Vos données ne sont jamais partagées avec des tiers sans votre consentement explicite.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'doctor-register':
        return renderDoctorRegistration();
      case 'faq':
        return renderFAQ();
      case 'about':
        return renderAbout();
      case 'privacy':
        return renderPrivacy();
      default:
        return renderMainMenu();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-blue-900">Menu</SheetTitle>
          <SheetDescription>
            Navigation et informations
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          {renderContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
