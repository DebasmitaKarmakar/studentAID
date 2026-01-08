export enum UrgencyLevel {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3
}

export enum RequestCategory {
  FEES = 'fees',
  MEDICAL = 'medical',
  HOUSING = 'housing',
  OTHER = 'other'
}

export type UserRole = 'STUDENT' | 'ADMIN';
export type VerificationStatus = 'pending' | 'approved' | 'rejected';
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'closed';

export interface User {
  user_id: string;
  full_name: string;
  college_name: string;
  email: string;
  phone: string;
  is_verified: boolean; // Admin approval
  is_email_verified: boolean; // Firebase auth check
  verification_status: VerificationStatus;
  role: UserRole;
  avatar: string;
  created_at: string;
  id_card_url?: string;
  last_request_date?: string;
}

export interface FinancialRequest {
  request_id: string;
  user_id: string;
  student_name: string;
  title: string;
  description: string;
  category: RequestCategory;
  requested_amount: number;
  amount_raised: number;
  urgency_level: UrgencyLevel;
  urgency_score: number;
  deadline?: string;
  hide_identity: boolean;
  status: RequestStatus;
  imageUrl?: string;
  created_at: string;
  approved_at?: string;
}

export interface Donation {
  donation_id: string;
  request_id: string;
  donor_id: string;
  donor_name: string;
  amount: number;
  payment_mode: 'mock' | 'test';
  timestamp: string;
}

export interface AdminLog {
  log_id: string;
  action: string;
  target_id: string;
  admin_id: string;
  admin_name: string;
  timestamp: string;
  details?: string;
}

export interface DatabaseSchema {
  users: User[];
  requests: FinancialRequest[];
  donations: Donation[];
  admin_logs: AdminLog[];
}