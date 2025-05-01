
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, ArrowLeft } from "lucide-react";
import { Agreement, ServiceType } from "@/types";

// Mock service types data
const mockServiceTypes: ServiceType[] = [
  { 
    id: "1", 
    name: "Ticket Sales", 
    description: "Online ticket sales through our platform",
    defaultCommissionRate: 5 
  },
  { 
    id: "2", 
    name: "Marketing Services", 
    description: "Promote events through our marketing channels",
    defaultCommissionRate: 10 
  },
  { 
    id: "3", 
    name: "Venue Management", 
    description: "Venue booking and management services",
    defaultCommissionRate: 8 
  },
  { 
    id: "4", 
    name: "On-site Staff", 
    description: "Event staff provision and management",
    defaultCommissionRate: 15 
  },
  { 
    id: "5", 
    name: "Equipment Rental", 
    description: "Audio/visual equipment rental services",
    defaultCommissionRate: 12 
  },
];

// Mock agreement data
const mockAgreement: Agreement = {
  id: "1",
  organizerId: "1",
  organizer: {
    id: "1",
    userId: "user-1",
    orgName: "Event Masters",
    address: "123 Main Street, Mumbai, 400001",
    orgLogo: "/placeholder.svg",
    gstDetails: {
      isRegistered: true,
      gstNumber: "27AAPFU0939F1ZV"
    },
    bankDetails: {
      beneficiaryName: "Event Masters Pvt Ltd",
      accountType: "current",
      bankName: "ICICI Bank",
      accountNumber: "12345678901",
      bankIFSC: "ICIC0001234"
    },
    createdAt: "2025-04-15T10:20:30Z",
    updatedAt: "2025-04-15T10:20:30Z"
  },
  title: "Standard Service Agreement",
  description: "Agreement for ticket sales and marketing services",
  services: [
    {
      serviceType: {
        id: "1",
        name: "Ticket Sales",
        description: "Online ticket sales through our platform",
        defaultCommissionRate: 5
      },
      commissionRate: 5,
      isSelected: true
    },
    {
      serviceType: {
        id: "2",
        name: "Marketing Services",
        description: "Promote events through our marketing channels",
        defaultCommissionRate: 10
      },
      commissionRate: 8,
      isSelected: true
    }
  ],
  startDate: "2025-05-01T00:00:00Z",
  endDate: "2026-05-01T00:00:00Z",
  status: "active",
  documentUrl: "/agreements/agreement-1.pdf",
  signedByAdmin: true,
  signedByOrganizer: true,
  createdAt: "2025-04-20T14:30:00Z",
  updatedAt: "2025-04-22T10:15:30Z"
};

const ViewAgreement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgreement = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an API using the ID
        setAgreement(mockAgreement);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load agreement details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAgreement();
  }, [id, toast]);

  const getBadgeVariant = (status: Agreement['status']) => {
    switch (status) {
      case "draft": return "secondary";
      case "pending": return "warning";
      case "active": return "success";
      case "expired": return "default";
      case "terminated": return "destructive";
      default: return "outline";
    }
  };

  const getSignatureStatus = () => {
    if (!agreement) return null;
    
    if (agreement.signedByAdmin && agreement.signedByOrganizer) {
      return <Badge variant="outline" className="bg-green-50">Fully Signed</Badge>;
    } else if (agreement.signedByAdmin) {
      return <Badge variant="outline" className="bg-yellow-50">Admin Signed</Badge>;
    } else if (agreement.signedByOrganizer) {
      return <Badge variant="outline" className="bg-yellow-50">Organizer Signed</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50">Unsigned</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-10 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!agreement) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Agreement not found</h2>
          <p className="text-muted-foreground mt-2">
            The agreement you are looking for does not exist.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/admin/agreements")}
          >
            Back to Agreements
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/agreements")}
            className="mb-4 -ml-2 flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Agreements
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{agreement.title}</h1>
          {agreement.description && (
            <p className="text-muted-foreground">
              {agreement.description}
            </p>
          )}
        </div>
        {agreement.documentUrl && (
          <Button asChild>
            <a href={agreement.documentUrl} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement Details</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant={getBadgeVariant(agreement.status)}>
                  {agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1)}
                </Badge>
                {getSignatureStatus()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {new Date(agreement.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {agreement.endDate ? new Date(agreement.endDate).toLocaleDateString() : "No end date (ongoing)"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created On</p>
                <p className="font-medium">
                  {new Date(agreement.createdAt).toLocaleDateString()} at {new Date(agreement.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Services & Commission Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Service</th>
                    <th className="text-left py-2 px-2">Description</th>
                    <th className="text-right py-2 px-2">Commission Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {agreement.services
                    .filter(service => service.isSelected)
                    .map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-2 font-medium">{service.serviceType.name}</td>
                        <td className="py-3 px-2 text-sm text-muted-foreground">{service.serviceType.description}</td>
                        <td className="py-3 px-2 text-right">{service.commissionRate}%</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agreement.organizer && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {agreement.organizer.orgLogo ? (
                      <img 
                        src={agreement.organizer.orgLogo} 
                        alt={agreement.organizer.orgName} 
                        className="h-12 w-12 rounded-md object-cover" 
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center">
                        <span className="font-semibold text-blue-800">
                          {agreement.organizer.orgName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{agreement.organizer.orgName}</h3>
                      <p className="text-sm text-muted-foreground">ID: {agreement.organizer.id}</p>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p>{agreement.organizer.address}</p>
                  </div>
                  {agreement.organizer.gstDetails.isRegistered && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">GST Number</p>
                      <p>{agreement.organizer.gstDetails.gstNumber}</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate(`/admin/organizers/${agreement.organizer?.id}/edit`)}
                  >
                    View Organizer Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {agreement.documentUrl ? (
                <Button className="w-full" asChild>
                  <a href={agreement.documentUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    View Agreement Document
                  </a>
                </Button>
              ) : (
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Agreement Document
                </Button>
              )}
              {!agreement.signedByAdmin && (
                <Button variant="outline" className="w-full">
                  Sign Agreement as Admin
                </Button>
              )}
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              {agreement.signedByAdmin && agreement.signedByOrganizer ? (
                <p>This agreement has been fully signed and is active.</p>
              ) : agreement.signedByAdmin ? (
                <p>Waiting for organizer signature.</p>
              ) : agreement.signedByOrganizer ? (
                <p>Waiting for admin signature.</p>
              ) : (
                <p>This agreement has not been signed yet.</p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewAgreement;
