
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agreement, Organizer, ServiceType } from "@/types";
import { format } from "date-fns";
import { Download } from "lucide-react";

interface AgreementPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: Partial<Agreement>;
  organizer?: Organizer;
  serviceTypes: ServiceType[];
  onGeneratePdf: () => void;
}

const AgreementPreview: React.FC<AgreementPreviewProps> = ({
  isOpen,
  onClose,
  agreement,
  organizer,
  serviceTypes,
  onGeneratePdf,
}) => {
  if (!isOpen || !organizer) return null;

  // Find the service types for selected services
  const selectedServices = agreement.services?.filter(s => s.isSelected).map(service => {
    const serviceType = serviceTypes.find(st => st.id === service.serviceTypeId);
    return {
      name: serviceType?.name || "Unknown Service",
      description: serviceType?.description || "",
      commissionRate: service.commissionRate
    };
  }) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Agreement Preview</DialogTitle>
          <DialogDescription>
            Review the agreement terms before generating the PDF
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="border rounded-md p-6 max-h-[500px] bg-white">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">SERVICE AGREEMENT</h1>
                <p className="text-gray-600">{agreement.title}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Reference: AGR-{new Date().getTime().toString().slice(-6)}</p>
                <p>Date: {format(new Date(), "PPP")}</p>
              </div>
            </div>
            
            <div className="border-t border-b py-4 my-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">BETWEEN:</h3>
                  <p className="font-bold">ShowMates Platform</p>
                  <p>[Company Address]</p>
                  <p>[Company Email]</p>
                  <p className="mt-1">(hereinafter referred to as the "Platform")</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AND:</h3>
                  <p className="font-bold">{organizer.orgName}</p>
                  <p>{organizer.address}</p>
                  {organizer.gstDetails.isRegistered && (
                    <p>GST: {organizer.gstDetails.gstNumber}</p>
                  )}
                  <p className="mt-1">(hereinafter referred to as the "Organizer")</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold">1. TERM OF AGREEMENT</h2>
              <p>
                This Agreement shall commence on {agreement.startDate ? format(new Date(agreement.startDate), "PPP") : "[Start Date]"}
                {agreement.endDate ? ` and shall continue until ${format(new Date(agreement.endDate), "PPP")}` : " and shall continue indefinitely until terminated by either party with written notice"}. 
              </p>
              
              <h2 className="text-xl font-bold mt-6">2. SERVICES & COMMISSION STRUCTURE</h2>
              <p>
                The Platform agrees to provide the Organizer with the following services at the agreed commission rates:
              </p>
              
              <div className="mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Service</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-right">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map((service, index) => (
                      <tr key={index}>
                        <td className="border p-2">{service.name}</td>
                        <td className="border p-2">{service.description}</td>
                        <td className="border p-2 text-right">{service.commissionRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <h2 className="text-xl font-bold mt-6">3. PAYMENT TERMS</h2>
              <p>
                The Platform will process payments for events and deduct the agreed commission rates before transferring the remaining funds to the Organizer's designated account within 7 business days of the event completion.
              </p>
              <p className="mt-2">
                <strong>Beneficiary Details:</strong><br />
                Name: {organizer.bankDetails.beneficiaryName}<br />
                Bank: {organizer.bankDetails.bankName}<br />
                Account Number: {organizer.bankDetails.accountNumber}<br />
                IFSC Code: {organizer.bankDetails.bankIFSC}
              </p>
              
              {organizer.bankDetails.splitPayments?.isSplitPayment && (
                <div className="mt-2">
                  <p><strong>Split Payment Information:</strong></p>
                  <p>
                    Account Label: {organizer.bankDetails.splitPayments.accountLabel}<br />
                    Commission Rate: {organizer.bankDetails.splitPayments.commissionRate}%
                  </p>
                </div>
              )}
              
              <h2 className="text-xl font-bold mt-6">4. ORGANIZER RESPONSIBILITIES</h2>
              <p>
                The Organizer agrees to provide accurate and complete information about all events, ensure all necessary permits and licenses are obtained, and maintain professional conduct throughout the partnership.
              </p>
              
              <h2 className="text-xl font-bold mt-6">5. PLATFORM RESPONSIBILITIES</h2>
              <p>
                The Platform agrees to provide the listed services in a professional and timely manner, maintain the functionality of the platform, and provide reporting and analytics as applicable.
              </p>
              
              <h2 className="text-xl font-bold mt-6">6. TERMINATION</h2>
              <p>
                Either party may terminate this Agreement with [30] days written notice. Upon termination, all outstanding payments shall be settled within 14 business days.
              </p>
              
              <h2 className="text-xl font-bold mt-6">7. CONFIDENTIALITY</h2>
              <p>
                Both parties agree to maintain the confidentiality of all proprietary information shared during the course of this Agreement.
              </p>
              
              <div className="mt-12 pt-6 border-t">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">For the Platform:</h3>
                    <div className="h-16 border-b border-dashed border-gray-400 mb-2"></div>
                    <p>Name: ___________________________</p>
                    <p>Position: ________________________</p>
                    <p>Date: ___________________________</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">For the Organizer:</h3>
                    <div className="h-16 border-b border-dashed border-gray-400 mb-2"></div>
                    <p>Name: ___________________________</p>
                    <p>Position: ________________________</p>
                    <p>Date: ___________________________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="gap-2 sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              This is a preview. The final PDF may look slightly different.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onGeneratePdf}>
              <Download className="mr-2 h-4 w-4" />
              Generate PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementPreview;
