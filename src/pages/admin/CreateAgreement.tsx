
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AgreementForm from "@/components/agreements/AgreementForm";
import AgreementPreview from "@/components/agreements/AgreementPreview";
import { generateAgreementPdf } from "@/utils/pdf-generator";
import { Organizer, ServiceType } from "@/types";

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

// Mock organizers
const mockOrganizers: Organizer[] = [
  {
    id: "1",
    userId: "user-1",
    orgName: "Event Masters",
    orgLogo: "/placeholder.svg",
    address: "123 Main Street, Mumbai, 400001",
    gstDetails: {
      isRegistered: true,
      gstNumber: "27AAPFU0939F1ZV",
      gstCertificateFile: "/placeholder.svg"
    },
    bankDetails: {
      beneficiaryName: "Event Masters Pvt Ltd",
      accountType: "current",
      bankName: "ICICI Bank",
      accountNumber: "12345678901",
      bankIFSC: "ICIC0001234",
      upiId: "eventmasters@upi",
      splitPayments: {
        isSplitPayment: false
      }
    },
    createdAt: "2025-04-15T10:20:30Z",
    updatedAt: "2025-04-15T10:20:30Z"
  },
  {
    id: "2",
    userId: "user-2",
    orgName: "Festive Productions",
    address: "456 Park Avenue, Delhi, 110001",
    gstDetails: {
      isRegistered: true,
      gstNumber: "07AABFF8563D1ZX",
    },
    bankDetails: {
      beneficiaryName: "Festive Productions",
      accountType: "current",
      bankName: "HDFC Bank",
      accountNumber: "987654321001",
      bankIFSC: "HDFC0000123",
      splitPayments: {
        isSplitPayment: true,
        accountLabel: "Commission Account",
        commissionRate: 15
      }
    },
    createdAt: "2025-04-10T14:30:45Z",
    updatedAt: "2025-04-12T09:15:20Z"
  },
  {
    id: "3",
    userId: "user-3",
    orgName: "Showtime Entertainment",
    orgLogo: "/placeholder.svg",
    address: "789 Beach Road, Chennai, 600001",
    gstDetails: {
      isRegistered: false,
      gstNumber: null,
    },
    bankDetails: {
      beneficiaryName: "Showtime Entertainment",
      accountType: "savings",
      bankName: "SBI",
      accountNumber: "56789012345",
      bankIFSC: "SBIN0012345",
      upiId: "showtime@ybl",
      splitPayments: {
        isSplitPayment: false
      }
    },
    createdAt: "2025-04-05T08:45:12Z",
    updatedAt: "2025-04-05T08:45:12Z"
  }
];

const CreateAgreement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<Organizer | null>(null);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Find the selected organizer
      const organizer = mockOrganizers.find(org => org.id === data.organizerId);
      
      if (!organizer) {
        throw new Error("Selected organizer not found");
      }
      
      // Generate PDF (in a real app, this would create a real PDF)
      const pdfUrl = await generateAgreementPdf(data, organizer, mockServiceTypes);
      
      console.log("Form data submitted:", data);
      console.log("Generated PDF URL:", pdfUrl);
      
      toast({
        title: "Agreement created",
        description: "The agreement has been successfully created.",
      });
      
      navigate("/admin/agreements");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the agreement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = (data: any) => {
    // Find the selected organizer
    const organizer = mockOrganizers.find(org => org.id === data.organizerId);
    
    if (organizer) {
      setSelectedOrganizer(organizer);
      setPreviewData(data);
      setIsPreviewOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Please select an organizer to preview the agreement.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePdf = async () => {
    try {
      toast({
        title: "Generating PDF",
        description: "The PDF is being generated...",
      });
      
      if (!selectedOrganizer) {
        throw new Error("Selected organizer not found");
      }
      
      // Generate PDF (in a real app, this would create a real PDF)
      const pdfUrl = await generateAgreementPdf(previewData, selectedOrganizer, mockServiceTypes);
      
      console.log("Generated PDF URL:", pdfUrl);
      
      toast({
        title: "PDF Generated",
        description: "The PDF has been generated successfully.",
      });
      
      setIsPreviewOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Agreement</h1>
          <p className="text-muted-foreground">
            Create a new service agreement with an organizer
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/agreements")}>
          Cancel
        </Button>
      </div>

      <AgreementForm 
        organizers={mockOrganizers}
        onSubmit={handleSubmit} 
        onPreview={handlePreview}
        isSubmitting={isSubmitting} 
      />
      
      <AgreementPreview 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        agreement={previewData} 
        organizer={selectedOrganizer || undefined} 
        serviceTypes={mockServiceTypes}
        onGeneratePdf={handleGeneratePdf}
      />
    </div>
  );
};

export default CreateAgreement;
