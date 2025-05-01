
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrganizerForm from "@/components/organizers/OrganizerForm";

const CreateOrganizer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form data submitted:", data);
      
      toast({
        title: "Organizer created",
        description: "The organizer has been successfully created.",
      });
      
      navigate("/admin/organizers");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error creating the organizer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Organizer</h1>
          <p className="text-muted-foreground">
            Add a new organizer account to the platform
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/organizers")}>
          Cancel
        </Button>
      </div>

      <OrganizerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default CreateOrganizer;
