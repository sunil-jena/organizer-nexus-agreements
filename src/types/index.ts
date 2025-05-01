
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: {
    value: string;
    isVerified: boolean;
  };
  phoneNumber: {
    value: string;
    isVerified: boolean;
  };
  role: string;
  photo: string;
}

export interface BankDetails {
  beneficiaryName: string;
  accountType: string;
  bankName: string;
  upiId?: string;
  accountNumber: string;
  bankIFSC: string;
  splitPayments?: {
    isSplitPayment: boolean;
    accountLabel?: string;
    commissionRate?: number;
  };
}

export interface GSTDetails {
  gstNumber: string | null;
  gstCertificateFile?: string;
  isRegistered: boolean;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  defaultCommissionRate: number;
}

export interface AgreementService {
  serviceType: ServiceType;
  commissionRate: number;
  isSelected: boolean;
}

export interface Organizer {
  id: string;
  userId: string;
  orgLogo?: string;
  orgName: string;
  address: string;
  gstDetails: GSTDetails;
  bankDetails: BankDetails;
  servicesOffered?: ServiceType[];
  offlineCredits?: Array<{
    eventId: string;
    credits: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Agreement {
  id: string;
  organizerId: string;
  organizer?: Organizer;
  title: string;
  description?: string;
  services: AgreementService[];
  startDate: string;
  endDate?: string;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  documentUrl?: string;
  signedByAdmin: boolean;
  signedByOrganizer: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  organizerId: string;
  agreementId: string;
  commissionRate: number;
  totalAmount: number;
  commissionAmount: number;
  date: string;
}
