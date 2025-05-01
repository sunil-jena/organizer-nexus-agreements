
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import OrganizerForm from "@/components/organizers/OrganizerForm";
import { Organizer } from "@/types";

// Mock data for a specific organizer
const mockOrganizer: Organizer = {
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
};

const EditOrganizer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrganizer = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch from an API using the ID
        setOrganizer(mockOrganizer);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load organizer details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrganizer();
  }, [id, toast]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form data submitted:", data);
      
      toast({
        title: "Organizer updated",
        description: "The organizer has been successfully updated.",
      });
      
      navigate("/admin/organizers");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the organizer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        <div className="space-y-4">
          {Array(3).fill(null).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Organizer not found</h2>
          <p className="text-muted-foreground mt-2">
            The organizer you are looking for does not exist.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => navigate("/admin/organizers")}
          >
            Back to Organizers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Organizer</h1>
          <p className="text-muted-foreground">
            Update details for {organizer.orgName}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/organizers")}>
          Cancel
        </Button>
      </div>

      <OrganizerForm 
        initialData={organizer} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting} 
      />
    </div>
  );
};

export default EditOrganizer;
