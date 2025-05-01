
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AgreementsList from "@/components/agreements/AgreementsList";
import { Agreement } from "@/types";

// Mock data for agreements
const mockAgreements: Agreement[] = [
  {
    id: "1",
    organizerId: "1",
    organizer: {
      id: "1",
      userId: "user-1",
      orgName: "Event Masters",
      address: "123 Main Street, Mumbai, 400001",
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
  },
  {
    id: "2",
    organizerId: "2",
    organizer: {
      id: "2",
      userId: "user-2",
      orgName: "Festive Productions",
      address: "456 Park Avenue, Delhi, 110001",
      gstDetails: {
        isRegistered: true,
        gstNumber: "07AABFF8563D1ZX"
      },
      bankDetails: {
        beneficiaryName: "Festive Productions",
        accountType: "current",
        bankName: "HDFC Bank",
        accountNumber: "987654321001",
        bankIFSC: "HDFC0000123"
      },
      createdAt: "2025-04-10T14:30:45Z",
      updatedAt: "2025-04-12T09:15:20Z"
    },
    title: "Premium Partnership Agreement",
    description: "Comprehensive services agreement including venue management",
    services: [
      {
        serviceType: {
          id: "1",
          name: "Ticket Sales",
          description: "Online ticket sales through our platform",
          defaultCommissionRate: 5
        },
        commissionRate: 4.5,
        isSelected: true
      },
      {
        serviceType: {
          id: "3",
          name: "Venue Management",
          description: "Venue booking and management services",
          defaultCommissionRate: 8
        },
        commissionRate: 7.5,
        isSelected: true
      }
    ],
    startDate: "2025-04-15T00:00:00Z",
    endDate: null,
    status: "pending",
    documentUrl: "/agreements/agreement-2.pdf",
    signedByAdmin: true,
    signedByOrganizer: false,
    createdAt: "2025-04-10T11:20:00Z",
    updatedAt: "2025-04-10T11:20:00Z"
  },
  {
    id: "3",
    organizerId: "3",
    organizer: {
      id: "3",
      userId: "user-3",
      orgName: "Showtime Entertainment",
      address: "789 Beach Road, Chennai, 600001",
      gstDetails: {
        isRegistered: false
      },
      bankDetails: {
        beneficiaryName: "Showtime Entertainment",
        accountType: "savings",
        bankName: "SBI",
        accountNumber: "56789012345",
        bankIFSC: "SBIN0012345"
      },
      createdAt: "2025-04-05T08:45:12Z",
      updatedAt: "2025-04-05T08:45:12Z"
    },
    title: "Basic Services Agreement",
    description: "Agreement for ticket sales only",
    services: [
      {
        serviceType: {
          id: "1",
          name: "Ticket Sales",
          description: "Online ticket sales through our platform",
          defaultCommissionRate: 5
        },
        commissionRate: 6,
        isSelected: true
      }
    ],
    startDate: "2025-03-01T00:00:00Z",
    endDate: "2025-09-01T00:00:00Z",
    status: "draft",
    documentUrl: null,
    signedByAdmin: false,
    signedByOrganizer: false,
    createdAt: "2025-03-28T09:45:00Z",
    updatedAt: "2025-03-28T09:45:00Z"
  }
];

const Agreements = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreements, setAgreements] = React.useState<Agreement[]>(mockAgreements);

  const handleDelete = (id: string) => {
    setAgreements(agreements.filter(agreement => agreement.id !== id));
    toast({
      title: "Agreement deleted",
      description: "The agreement has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agreements</h1>
          <p className="text-muted-foreground">
            Manage service agreements with organizers
          </p>
        </div>
        <Button onClick={() => navigate("/admin/agreements/create")}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Agreement
        </Button>
      </div>

      <AgreementsList agreements={agreements} onDelete={handleDelete} />
    </div>
  );
};

export default Agreements;
