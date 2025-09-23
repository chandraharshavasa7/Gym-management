
export enum PaymentStatus {
  PAID = 'Paid',
  UNPAID = 'Unpaid',
}

export interface Member {
  id: string;
  photo: string; // Base64 string
  fullName: string;
  address: string;
  phoneNumber: string;
  fatherName: string;
  fatherPhoneNumber: string;
  height: string;
  weight: string;
  whatsAppNumber: string;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string; // ISO string
  joiningDate: string; // ISO string
  lastUpdatedDate: string; // ISO string
  paymentHistory: { date: string; amount: number }[];
  age: number | '';
  bloodGroup: string;
}

export enum FilterOption {
    ALL = 'all',
    UNPAID_THIS_MONTH = 'unpaid_this_month',
    RECENTLY_UPDATED = 'recently_updated_95_days',
}
