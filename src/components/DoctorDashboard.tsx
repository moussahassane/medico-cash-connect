
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  X, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  TrendingUp,
  Phone,
  MessageSquare,
  Settings
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  waitTime: string;
  priority: 'standard' | 'urgent';
  status: 'waiting' | 'in_consultation' | 'completed';
}

interface DoctorDashboardProps {
  onClose: () => void;
}

const DoctorDashboard = ({ onClose }: DoctorDashboardProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [waitingPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Patient anonyme #1',
      waitTime: '2 min',
      priority: 'urgent',
      status: 'waiting'
    },
    {
      id: '2',
      name: 'Patient anonyme #2',
      waitTime: '5 min',
      priority: 'standard',
      status: 'waiting'
    },
    {
      id: '3',
      name: 'Patient anonyme #3',
      waitTime: '8 min',
      priority: 'standard',
      status: 'waiting'
    }
  ]);

  const [consultationHistory] = useState([
    { id: '1', date: '2024-01-15', patients: 12, revenue: 15000 },
    { id: '2', date: '2024-01-14', patients: 8, revenue: 10000 },
    { id: '3', date: '2024-01-13', patients: 15, revenue: 18000 },
  ]);

  const handleAcceptPatient = (patient: Patient) => {
    setCurrentPatient(patient);
  };

  const handleRejectPatient = (patientId: string) => {
    // Handle rejection logic
    console.log('Patient rejected:', patientId);
  };

  const handleEndConsultation = () => {
    setCurrentPatient(null);
  };

  const totalRevenue = consultationHistory.reduce((sum, day) => sum + day.revenue, 0);
  const totalPatients = consultationHistory.reduce((sum, day) => sum + day.patients, 0);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Espace Médecin</h1>
              <p className="text-sm text-gray-600">Dr. Konaté - Médecin Généraliste</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Disponible</span>
              <Switch
                checked={isAvailable}
                onCheckedChange={setIsAvailable}
              />
              <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients en attente</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{waitingPatients.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations aujourd'hui</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">0</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenus du mois</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{totalRevenue.toLocaleString()} FCFA</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Statut</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={isAvailable ? "default" : "secondary"} className={isAvailable ? "bg-green-500" : ""}>
                  {isAvailable ? "En ligne" : "Hors ligne"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="queue" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="queue">File d'attente</TabsTrigger>
              <TabsTrigger value="consultation">Consultation</TabsTrigger>
              <TabsTrigger value="history">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="queue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patients en attente</CardTitle>
                  <CardDescription>
                    Acceptez ou refusez les demandes de consultation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {waitingPatients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun patient en attente</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {waitingPatients.map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>Attend depuis {patient.waitTime}</span>
                                <Badge variant={patient.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                  {patient.priority === 'urgent' ? 'Urgent' : 'Standard'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectPatient(patient.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Refuser
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAcceptPatient(patient)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accepter
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="consultation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Consultation en cours</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPatient ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-blue-900">{currentPatient.name}</div>
                            <Badge variant={currentPatient.priority === 'urgent' ? 'destructive' : 'secondary'}>
                              {currentPatient.priority === 'urgent' ? 'Urgent' : 'Standard'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Appel
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEndConsultation}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Terminer
                          </Button>
                        </div>
                      </div>
                      
                      {/* Consultation interface would go here */}
                      <div className="p-8 text-center text-gray-500">
                        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p>Interface de consultation</p>
                        <p className="text-sm">Le chat et les appels seront intégrés ici</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune consultation en cours</p>
                      <p className="text-sm">Acceptez un patient depuis la file d'attente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des consultations</CardTitle>
                  <CardDescription>
                    Résumé de vos consultations récentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {consultationHistory.map((day) => (
                      <div key={day.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{day.date}</div>
                          <div className="text-sm text-gray-500">
                            {day.patients} patients consultés
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            {day.revenue.toLocaleString()} FCFA
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
