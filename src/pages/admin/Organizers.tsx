
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import OrganizersList from "@/components/organizers/OrganizersList";
import { Organizer } from "@/types";

// Mock data for organizers
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

const Organizers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [organizers, setOrganizers] = React.useState<Organizer[]>(mockOrganizers);

  const handleDelete = (id: string) => {
    setOrganizers(organizers.filter(org => org.id !== id));
    toast({
      title: "Organizer deleted",
      description: "The organizer has been successfully deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organizers</h1>
          <p className="text-muted-foreground">
            Manage organizer accounts and their details
          </p>
        </div>
        <Button onClick={() => navigate("/admin/organizers/create")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Organizer
        </Button>
      </div>

      <OrganizersList organizers={organizers} onDelete={handleDelete} />
    </div>
  );
};

export default Organizers;
