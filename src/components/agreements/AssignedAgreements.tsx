
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { FileText, Eye, ArrowRight, Calendar, Search, FileCheck } from "lucide-react";
import { Agreement } from "@/types";

interface AssignedAgreementsProps {
  agreements: Agreement[];
}

const AssignedAgreements: React.FC<AssignedAgreementsProps> = ({ agreements }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const activeAgreements = agreements.filter(
    agreement => agreement.status === "active" && 
    (agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     agreement.organizer?.orgName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const pendingAgreements = agreements.filter(
    agreement => agreement.status === "pending" && 
    (agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     agreement.organizer?.orgName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const otherAgreements = agreements.filter(
    agreement => (agreement.status !== "active" && agreement.status !== "pending") && 
    (agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     agreement.organizer?.orgName.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assigned Agreements</h2>
          <p className="text-muted-foreground">View and manage agreements assigned to organizers.</p>
        </div>
        <Button onClick={() => navigate("/admin/agreements/create")}>
          <FileCheck className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search agreements or organizers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeAgreements.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAgreements.length})
          </TabsTrigger>
          <TabsTrigger value="other">
            Other ({otherAgreements.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAgreements.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-lg">No active agreements found</h3>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm ? "Try adjusting your search terms" : "Create a new agreement to get started"}
                </p>
              </div>
            ) : (
              activeAgreements.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  onClick={() => navigate(`/admin/agreements/${agreement.id}`)}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingAgreements.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-lg">No pending agreements</h3>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm ? "Try adjusting your search terms" : "All agreements are fully signed or in draft status"}
                </p>
              </div>
            ) : (
              pendingAgreements.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  onClick={() => navigate(`/admin/agreements/${agreement.id}`)}
                />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="other">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherAgreements.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-dashed">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-lg">No other agreements</h3>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm ? "Try adjusting your search terms" : "No draft, expired or terminated agreements found"}
                </p>
              </div>
            ) : (
              otherAgreements.map((agreement) => (
                <AgreementCard
                  key={agreement.id}
                  agreement={agreement}
                  onClick={() => navigate(`/admin/agreements/${agreement.id}`)}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface AgreementCardProps {
  agreement: Agreement;
  onClick: () => void;
}

const AgreementCard: React.FC<AgreementCardProps> = ({ agreement, onClick }) => {
  const getBadgeVariant = (status: Agreement['status']) => {
    switch (status) {
      case "draft": return "secondary";
      case "pending": return "outline";
      case "active": return "default";
      case "expired": return "outline";
      case "terminated": return "destructive";
      default: return "outline";
    }
  };
  
  const getSignatureStatus = () => {
    if (agreement.signedByAdmin && agreement.signedByOrganizer) {
      return "Fully signed";
    } else if (agreement.signedByAdmin) {
      return "Admin signed";
    } else if (agreement.signedByOrganizer) {
      return "Organizer signed";
    } else {
      return "Unsigned";
    }
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <Badge variant={getBadgeVariant(agreement.status)}>
            {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
          </Badge>
          {agreement.documentUrl && <FileText className="h-4 w-4 text-muted-foreground" />}
        </div>
        <CardTitle className="line-clamp-2">{agreement.title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {agreement.organizer?.orgName || "Unknown Organization"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center mb-3 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {new Date(agreement.startDate).toLocaleDateString()} 
            {agreement.endDate ? ` - ${new Date(agreement.endDate).toLocaleDateString()}` : " (No end date)"}
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Services:</p>
          <ul className="space-y-1">
            {agreement.services
              .filter(service => service.isSelected)
              .slice(0, 2)
              .map((service, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>{service.serviceType.name}</span>
                  <span className="font-medium">{service.commissionRate}%</span>
                </li>
              ))}
            {agreement.services.filter(service => service.isSelected).length > 2 && (
              <li className="text-sm text-muted-foreground">
                +{agreement.services.filter(service => service.isSelected).length - 2} more services
              </li>
            )}
          </ul>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between pt-4">
        <div className="text-sm text-muted-foreground">
          {getSignatureStatus()}
        </div>
        <Button variant="ghost" size="sm" onClick={onClick}>
          <Eye className="h-4 w-4 mr-1" />
          View
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssignedAgreements;
