
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Shield, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (consultationId: string) => void;
}

const PaymentModal = ({ open, onClose, onSuccess }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("mobile_money");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState("orange");
  const [consultationType, setConsultationType] = useState("standard");

  const prices = {
    standard: 1000,
    urgent: 2000
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if this is a free access email
      const isFreeAccess = phoneNumber === "karimassani52@gmail.com" || phoneNumber.includes("karimassani52");
      
      // Create consultation in database
      const { data: consultation, error: consultationError } = await supabase
        .from('consultations')
        .insert({
          patient_phone: phoneNumber,
          patient_email: phoneNumber.includes('@') ? phoneNumber : null,
          type: consultationType,
          amount: isFreeAccess ? 0 : prices[consultationType as keyof typeof prices],
          payment_status: isFreeAccess ? 'free' : 'pending',
          payment_provider: provider,
          payment_phone: phoneNumber,
          status: 'waiting'
        })
        .select()
        .single();

      if (consultationError) {
        throw new Error("Erreur lors de la création de la consultation");
      }

      if (isFreeAccess) {
        // Direct access for free user
        toast({
          title: "Accès gratuit accordé !",
          description: "Vous avez un accès gratuit à la consultation.",
        });
        onSuccess(consultation.id);
      } else {
        // Simulate payment processing
        const paymentData = {
          amount: prices[consultationType as keyof typeof prices],
          currency: 'XOF',
          description: `Consultation ${consultationType === 'standard' ? 'Standard' : 'Urgente'}`,
          customer: {
            phone: phoneNumber
          },
          payment_method: paymentMethod,
          provider: provider
        };

        console.log("Processing payment with FedaPay:", paymentData);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Update consultation status to paid
        const { error: updateError } = await supabase
          .from('consultations')
          .update({ payment_status: 'paid', status: 'waiting' })
          .eq('id', consultation.id);

        if (updateError) {
          throw new Error("Erreur lors de la validation du paiement");
        }

        toast({
          title: "Paiement réussi !",
          description: `Votre paiement de ${prices[consultationType as keyof typeof prices]} FCFA a été traité avec succès.`,
        });

        onSuccess(consultation.id);
      }
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-900 flex items-center justify-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Paiement sécurisé</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Réglez votre consultation avant de rencontrer le médecin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Consultation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Type de consultation</Label>
            <RadioGroup value={consultationType} onValueChange={setConsultationType}>
              <Card className={`cursor-pointer transition-colors ${consultationType === 'standard' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                <CardContent className="flex items-center space-x-3 p-4">
                  <RadioGroupItem value="standard" id="standard" />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-blue-900">Consultation Standard</CardTitle>
                    <CardDescription>Réponse sous 5-10 minutes</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">1000</div>
                    <div className="text-sm text-gray-500">FCFA</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`cursor-pointer transition-colors ${consultationType === 'urgent' ? 'ring-2 ring-red-500 bg-red-50' : ''}`}>
                <CardContent className="flex items-center space-x-3 p-4">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <div className="flex-1">
                    <CardTitle className="text-lg text-red-900">Consultation Urgente</CardTitle>
                    <CardDescription>Réponse immédiate, priorité absolue</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">2000</div>
                    <div className="text-sm text-gray-500">FCFA</div>
                  </div>
                </CardContent>
              </Card>
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Méthode de paiement</Label>
            <RadioGroup value={provider} onValueChange={setProvider}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="orange" id="orange" />
                <Label htmlFor="orange" className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                  <span>Orange Money</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moov" id="moov" />
                <Label htmlFor="moov" className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
                  <span>Moov Money</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="airtel" id="airtel" />
                <Label htmlFor="airtel" className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                  <span>Airtel Money</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Phone Number or Email */}
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone ou Email</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="text"
                placeholder="0X XX XX XX XX ou email@example.com"
                className="pl-10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            {phoneNumber.includes("karimassani52") && (
              <p className="text-sm text-green-600 font-medium">
                ✅ Accès gratuit détecté pour ce compte
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-green-800">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Paiement 100% sécurisé</span>
            </div>
            <div className="text-sm text-green-700 mt-1">
              Vos données bancaires sont protégées par le cryptage SSL
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-3"
            disabled={isLoading || !phoneNumber}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Traitement en cours...</span>
              </div>
            ) : phoneNumber.includes("karimassani52") ? (
              <div className="flex items-center space-x-2">
                <Check className="w-5 h-5" />
                <span>Accéder gratuitement</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Payer {prices[consultationType as keyof typeof prices]} FCFA</span>
              </div>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
