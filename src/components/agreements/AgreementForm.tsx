
import React, { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, FilePlus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ServiceType, Organizer } from "@/types";

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

const formSchema = z.object({
  organizerId: z.string().min(1, "Please select an organizer"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date().optional(),
  services: z.array(
    z.object({
      serviceTypeId: z.string(),
      isSelected: z.boolean(),
      commissionRate: z.number().min(0).max(100),
    })
  ),
});

type AgreementFormValues = z.infer<typeof formSchema>;

interface AgreementFormProps {
  organizers: Organizer[];
  initialData?: Partial<AgreementFormValues>;
  onSubmit: (data: AgreementFormValues) => void;
  onPreview: (data: AgreementFormValues) => void;
  isSubmitting?: boolean;
}

const AgreementForm: React.FC<AgreementFormProps> = ({
  organizers,
  initialData,
  onSubmit,
  onPreview,
  isSubmitting = false,
}) => {
  // Initialize services with mock service types
  const initialServices = mockServiceTypes.map(service => ({
    serviceTypeId: service.id,
    isSelected: false,
    commissionRate: service.defaultCommissionRate,
  }));

  const form = useForm<AgreementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizerId: initialData?.organizerId || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialData?.startDate || new Date(),
      endDate: initialData?.endDate,
      services: initialData?.services || initialServices,
    },
  });

  const handleSubmit = (values: AgreementFormValues) => {
    onSubmit(values);
  };

  const handlePreview = () => {
    const values = form.getValues();
    onPreview(values);
  };

  const selectedServices = form.watch("services").filter(s => s.isSelected);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Agreement Details</CardTitle>
            <CardDescription>
              Create a new agreement with an organizer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="organizerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organizer</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an organizer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {organizers.map((organizer) => (
                        <SelectItem key={organizer.id} value={organizer.id}>
                          {organizer.orgName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agreement Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter agreement title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter agreement description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < form.getValues("startDate") || 
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Leave blank for no end date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services & Commissions</CardTitle>
            <CardDescription>
              Select services included in this agreement and set commission rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockServiceTypes.map((serviceType, index) => (
                <Card key={serviceType.id} className="border-gray-200">
                  <CardHeader className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <FormField
                          control={form.control}
                          name={`services.${index}.isSelected`}
                          render={({ field }) => (
                            <FormItem className="flex items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-base cursor-pointer">
                                  {serviceType.name}
                                </FormLabel>
                                <FormDescription>
                                  {serviceType.description}
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`services.${index}.serviceTypeId`}
                        render={({ field }) => (
                          <input type="hidden" {...field} value={serviceType.id} />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.commissionRate`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center space-x-2">
                              <FormLabel className="text-sm font-normal">Commission Rate:</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="w-20 h-8"
                                  disabled={!form.getValues(`services.${index}.isSelected`)}
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <span className="text-sm">%</span>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardHeader>
                </Card>
              ))}

              {selectedServices.length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No services selected yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected
            </p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handlePreview}
            >
              <FilePlus className="mr-2 h-4 w-4" />
              Preview Agreement
            </Button>
          </CardFooter>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="submit" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Agreement"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgreementForm;
