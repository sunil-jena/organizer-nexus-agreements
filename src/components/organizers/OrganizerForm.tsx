
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
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs,
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Organizer } from "@/types";

// Mock function for image upload
const uploadImage = async (file: File): Promise<string> => {
  // In a real app, this would upload to your server/cloud storage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file));
    }, 500);
  });
};

const formSchema = z.object({
  // Organization details
  orgName: z.string().min(2, "Organization name is required"),
  orgLogo: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  
  // GST details
  gstDetails: z.object({
    isRegistered: z.boolean(),
    gstNumber: z.string().optional()
      .refine(val => !val || val.length === 15, {
        message: "GST number must be 15 characters",
      }),
    gstCertificateFile: z.string().optional(),
  }),
  
  // Bank details
  bankDetails: z.object({
    beneficiaryName: z.string().min(2, "Beneficiary name is required"),
    accountType: z.string().min(1, "Account type is required"),
    bankName: z.string().min(2, "Bank name is required"),
    upiId: z.string().optional(),
    accountNumber: z.string().min(5, "Account number is required"),
    bankIFSC: z.string().min(11, "IFSC code is required"),
    splitPayments: z.object({
      isSplitPayment: z.boolean(),
      accountLabel: z.string().optional(),
      commissionRate: z.number().optional(),
    }),
  }),
  
  // User details
  user: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number is required"),
  }),
});

type OrganizerFormValues = z.infer<typeof formSchema>;

interface OrganizerFormProps {
  initialData?: Partial<Organizer>;
  onSubmit: (data: OrganizerFormValues) => void;
  isSubmitting?: boolean;
}

const OrganizerForm: React.FC<OrganizerFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  const form = useForm<OrganizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgName: initialData?.orgName || "",
      orgLogo: initialData?.orgLogo || "",
      address: initialData?.address || "",
      gstDetails: {
        isRegistered: initialData?.gstDetails?.isRegistered || false,
        gstNumber: initialData?.gstDetails?.gstNumber || "",
        gstCertificateFile: initialData?.gstDetails?.gstCertificateFile || "",
      },
      bankDetails: {
        beneficiaryName: initialData?.bankDetails?.beneficiaryName || "",
        accountType: initialData?.bankDetails?.accountType || "",
        bankName: initialData?.bankDetails?.bankName || "",
        upiId: initialData?.bankDetails?.upiId || "",
        accountNumber: initialData?.bankDetails?.accountNumber || "",
        bankIFSC: initialData?.bankDetails?.bankIFSC || "",
        splitPayments: {
          isSplitPayment: initialData?.bankDetails?.splitPayments?.isSplitPayment || false,
          accountLabel: initialData?.bankDetails?.splitPayments?.accountLabel || "",
          commissionRate: initialData?.bankDetails?.splitPayments?.commissionRate || 0,
        },
      },
      user: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
    },
  });

  const handleSubmit = async (values: OrganizerFormValues) => {
    try {
      // Handle logo upload if there's a new file
      if (logoFile) {
        const logoUrl = await uploadImage(logoFile);
        values.orgLogo = logoUrl;
      }
      
      // Handle GST certificate upload if there's a new file
      if (gstFile) {
        const gstFileUrl = await uploadImage(gstFile);
        values.gstDetails.gstCertificateFile = gstFileUrl;
      }
      
      onSubmit(values);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isGstRegistered = form.watch("gstDetails.isRegistered");
  const isSplitPayment = form.watch("bankDetails.splitPayments.isSplitPayment");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="organization" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="organization">Organization Details</TabsTrigger>
            <TabsTrigger value="bank">Bank Details</TabsTrigger>
            <TabsTrigger value="admin">Admin Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="organization" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>
                  Enter the details about the organizer's organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orgName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="orgLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Logo</FormLabel>
                        <FormControl>
                          <FileUpload
                            id="orgLogo"
                            label=""
                            accept="image/*"
                            value={field.value}
                            onChange={(file) => {
                              setLogoFile(file);
                              // Don't update the form value yet - it'll be updated on submit
                            }}
                            onClear={() => {
                              field.onChange("");
                              setLogoFile(null);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organization address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">GST Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <FormField
                      control={form.control}
                      name="gstDetails.isRegistered"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>GST Registered</FormLabel>
                            <FormDescription>
                              Is this organization registered for GST?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {isGstRegistered && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="gstDetails.gstNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter GST number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="gstDetails.gstCertificateFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>GST Certificate</FormLabel>
                              <FormControl>
                                <FileUpload
                                  id="gstCertificate"
                                  label=""
                                  accept="application/pdf,image/*"
                                  value={field.value}
                                  onChange={(file) => {
                                    setGstFile(file);
                                  }}
                                  onClear={() => {
                                    field.onChange("");
                                    setGstFile(null);
                                  }}
                                  hint="Upload GST certificate (PDF or Image)"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bank" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
                <CardDescription>
                  Enter the bank account details for payments to this organizer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankDetails.beneficiaryName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Beneficiary Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter beneficiary name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankDetails.accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankDetails.bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankDetails.upiId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter UPI ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankDetails.accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bankDetails.bankIFSC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IFSC Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter IFSC code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="text-base">Split Payment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <FormField
                      control={form.control}
                      name="bankDetails.splitPayments.isSplitPayment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Enable Split Payments</FormLabel>
                            <FormDescription>
                              Enable this if payments should be split between multiple accounts
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    {isSplitPayment && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="bankDetails.splitPayments.accountLabel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Account Label</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter account label" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bankDetails.splitPayments.commissionRate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commission Rate (%)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter commission rate" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Details</CardTitle>
                <CardDescription>
                  Create an admin account for this organizer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="user.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="user.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="user.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormDescription className="text-sm text-muted-foreground pt-2">
                  A temporary password will be auto-generated and sent to the email address.
                </FormDescription>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button type="submit" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Organizer" : "Create Organizer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrganizerForm;
