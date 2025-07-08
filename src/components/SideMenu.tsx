
import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  UserMd, 
  HelpCircle, 
  Info, 
  Shield, 
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  onDoctorLogin: () => void;
}

const SideMenu = ({ open, onClose, onDoctorLogin }: SideMenuProps) => {
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    speciality: '',
    experience: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDoctorRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Demande envoyée !",
        description: "Votre demande d'inscription a été soumise. Nous vous contacterons sous 48h.",
      });
      setIsSubmitting(false);
      setDoctorForm({
        name: '',
        email: '',
        phone: '',
        speciality: '',
        experience: '',
        motivation: ''
      });
    }, 2000);
  };

  const faqItems = [
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Le paiement se fait via Mobile Money (Orange, Moov, Airtel) avant chaque consultation. C'est sécurisé et instantané."
    },
    {
      question: "Combien coûte une consultation ?",
      answer: "Consultation standard: 1000 FCFA, Consultation urgente: 2000 FCFA. Pas de frais cachés."
    },
    {
      question: "Combien de temps dure une consultation ?",
      answer: "Chaque consultation dure 15 minutes maximum. Pour les cas complexes, vous pouvez repayer pour prolonger."
    },
    {
      question: "Les médecins sont-ils qualifiés ?",
      answer: "Tous nos médecins sont diplômés et vérifiés. Ils fournissent leurs diplômes lors de l'inscription."
    },
    {
      question: "Puis-je envoyer des images ?",
      answer: "Oui, vous pouvez partager des photos (ordonnances, résultats d'analyses, etc.) durant la consultation."
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full sm:w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserMd className="w-5 h-5 text-white" />
            </div>
            <span>Vision Santé</span>
          </SheetTitle>
          <SheetDescription>
            Votre santé, notre priorité
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="doctor" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctor">Médecin</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="about">À propos</TabsTrigger>
          </TabsList>

          <TabsContent value="doctor" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserMd className="w-5 h-5 text-blue-600" />
                  <span>Devenir médecin partenaire</span>
                </CardTitle>
                <CardDescription>
                  Rejoignez notre équipe de médecins et consultez des patients en ligne
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
                      placeholder="Dr. Votre Nom"
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
                      placeholder="votre@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0X XX XX XX XX"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="speciality">Spécialité *</Label>
                    <Input
                      id="speciality"
                      value={doctorForm.speciality}
                      onChange={(e) => setDoctorForm(prev => ({ ...prev, speciality: e.target.value }))}
                      placeholder="Médecine générale, Pédiatrie, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Années d'expérience *</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivation">Motivation</Label>
                    <Textarea
                      id="motivation"
                      value={doctorForm.motivation}
                      onChange={(e) => setDoctorForm(prev => ({ ...prev, motivation: e.target.value }))}
                      placeholder="Pourquoi voulez-vous rejoindre Vision Santé ?"
                      rows={3}
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Upload className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-800">Documents requis</p>
                        <p className="text-amber-700">
                          Après validation, vous devrez fournir vos diplômes et certificats par email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Envoi en cours..." : "Envoyer ma candidature"}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onDoctorLogin}
                  >
                    <UserMd className="w-4 h-4 mr-2" />
                    Accès espace médecin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4 mt-4">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-start space-x-2">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{item.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>À propos de Vision Santé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notre Mission</h4>
                  <p className="text-sm text-gray-600">
                    Rendre la consultation médicale accessible à tous, partout et à tout moment. 
                    Nous connectons les patients avec des médecins qualifiés via une plateforme simple et sécurisée.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Sécurité & Confidentialité</span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Toutes les communications sont chiffrées. Vos données médicales restent strictement confidentielles 
                    et ne sont partagées qu'avec le médecin consultant.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span>Médecins Certifiés</span>
                  </h4>
                  <p className="text-sm text-gray-600">
                    Tous nos médecins sont diplômés d'État et vérifiés. Ils fournissent leurs diplômes 
                    et justificatifs lors de leur inscription.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Version 1.0.0 • © 2024 Vision Santé
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SideMenu;
