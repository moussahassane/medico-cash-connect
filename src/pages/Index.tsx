
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Shield, Clock, Phone, MessageCircle, Image as ImageIcon, Menu, User, HelpCircle, Info, Smartphone } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import PaymentModal from "@/components/PaymentModal";
import ConsultationChat from "@/components/ConsultationChat";
import DoctorDashboard from "@/components/DoctorDashboard";
import SideMenu from "@/components/SideMenu";

const Index = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showDoctorDashboard, setShowDoctorDashboard] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [userType, setUserType] = useState<'patient' | 'doctor' | null>(null);

  const handleConsultationClick = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowChat(true);
  };

  const handleDoctorLogin = () => {
    setUserType('doctor');
    setShowDoctorDashboard(true);
    setShowSideMenu(false);
  };

  const handlePlayStoreClick = () => {
    // Ouvre le Play Store dans un nouvel onglet
    window.open('https://play.google.com/store/search?q=vision%20sant%C3%A9&c=apps', '_blank');
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-blue-800/80 to-blue-700/75"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Vision Santé</h1>
                <p className="text-xs text-white/80">Votre médecin en un clic</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSideMenu(true)}
              className="text-white hover:bg-white/10 border border-white/20"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {!showChat && !showDoctorDashboard && (
          <main className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-r from-white/20 to-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/20">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                Un médecin pour votre famille,
                <span className="block text-white/90">en un clic.</span>
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto drop-shadow-md">
                Consultez un médecin qualifié depuis chez vous. Paiement sécurisé, 
                consultation immédiate, disponible 24h/24.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                <Button
                  onClick={handleConsultationClick}
                  className="bg-gradient-to-r from-white to-white/95 hover:from-white/95 hover:to-white text-blue-900 text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Appeler un médecin
                </Button>
                
                <Button
                  onClick={handlePlayStoreClick}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Télécharger l'app
                </Button>
              </div>
              
              <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-white/90">
                <Shield className="w-4 h-4" />
                <span>Paiement sécurisé • Consultation instantanée</span>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Chat Médical</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-white/80">
                    Discutez en temps réel avec un médecin qualifié via notre chat sécurisé.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Partage d'Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-white/80">
                    Envoyez vos ordonnances, résultats d'analyses ou photos médicales.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3 border border-white/20">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">Disponible 24h/24</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-white/80">
                    Nos médecins sont disponibles à tout moment pour vos urgences.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Pricing */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center mb-12 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">Tarification Simple</h3>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white text-lg px-4 py-2 border border-white/20">
                  Consultation Standard: 1000 FCFA
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 backdrop-blur-sm text-white text-lg px-4 py-2 border border-red-300/20">
                  Urgence: 2000 FCFA
                </Badge>
              </div>
              <p className="text-white/80">Paiement sécurisé via Mobile Money (Orange, Moov, Airtel)</p>
            </div>
          </main>
        )}

        {/* Modals and Components */}
        <LoginModal 
          open={showLogin} 
          onClose={() => setShowLogin(false)}
          onSuccess={(type) => {
            setUserType(type);
            setShowLogin(false);
            if (type === 'doctor') {
              setShowDoctorDashboard(true);
            }
          }}
        />
        
        <PaymentModal 
          open={showPayment} 
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />

        {showChat && (
          <div className="fixed inset-0 z-50">
            <ConsultationChat onClose={() => setShowChat(false)} />
          </div>
        )}

        {showDoctorDashboard && (
          <div className="fixed inset-0 z-50">
            <DoctorDashboard onClose={() => setShowDoctorDashboard(false)} />
          </div>
        )}

        <SideMenu 
          open={showSideMenu} 
          onClose={() => setShowSideMenu(false)}
          onDoctorLogin={handleDoctorLogin}
        />
      </div>
    </div>
  );
};

export default Index;
