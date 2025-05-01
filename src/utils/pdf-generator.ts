
import { Agreement, Organizer, ServiceType } from "@/types";
import { format } from "date-fns";

// Mock function for generating PDF
// In a real application, you would use a library like jspdf or a server-side API
export const generateAgreementPdf = async (
  agreement: Partial<Agreement>,
  organizer: Organizer,
  serviceTypes: ServiceType[]
): Promise<string> => {
  console.log("Generating PDF for agreement:", agreement);
  console.log("Organizer:", organizer);
  
  // Find the selected services
  const selectedServices = agreement.services?.filter(s => s.isSelected).map(service => {
    return {
      name: service.serviceType.name,
      description: service.serviceType.description,
      commissionRate: service.commissionRate
    };
  }) || [];
  
  console.log("Selected services:", selectedServices);
  
  // In a real implementation, you would generate a PDF here
  // and return a URL to the generated PDF
  
  // For this mock implementation, we'll just return a mock URL after a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would be a URL to the generated PDF
      resolve(`/agreements/${Date.now()}-agreement.pdf`);
    }, 1000);
  });
};

// Helper function to get the current date in the format needed for the agreement
export const getCurrentDate = (): string => {
  return format(new Date(), "PPP");
};

// Helper function to calculate commission amount
export const calculateCommission = (
  amount: number, 
  commissionRate: number
): number => {
  return (amount * commissionRate) / 100;
};
