
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Shield, Clock, Phone, MessageCircle, Image as ImageIcon, Menu, UserMd, HelpCircle, Info } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">Vision Santé</h1>
              <p className="text-xs text-blue-600">Votre médecin en un clic</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSideMenu(true)}
            className="text-blue-700 hover:bg-blue-50"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {!showChat && !showDoctorDashboard && (
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              Un médecin pour votre famille,
              <span className="block text-blue-600">en un clic.</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Consultez un médecin qualifié depuis chez vous. Paiement sécurisé, 
              consultation immédiate, disponible 24h/24.
            </p>
            
            <Button
              onClick={handleConsultationClick}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl px-12 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-6 h-6 mr-3" />
              Appeler un médecin
            </Button>
            
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-green-600">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé • Consultation instantanée</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Chat Médical</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Discutez en temps réel avec un médecin qualifié via notre chat sécurisé.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-blue-900">Partage d'Images</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Envoyez vos ordonnances, résultats d'analyses ou photos médicales.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-blue-900">Disponible 24h/24</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Nos médecins sont disponibles à tout moment pour vos urgences.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Pricing */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center mb-12">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Tarification Simple</h3>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
                Consultation Standard: 1000 FCFA
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 text-lg px-4 py-2">
                Urgence: 2000 FCFA
              </Badge>
            </div>
            <p className="text-gray-600">Paiement sécurisé via Mobile Money (Orange, Moov, Airtel)</p>
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
  );
};

export default Index;
