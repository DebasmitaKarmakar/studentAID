
// Fix: Use User instead of Student as exported from types.ts
import { User, FinancialRequest, Donation, UrgencyLevel, RequestCategory } from './types';

// Fix: Change Student[] to User[] and update property names to match User interface
export const mockUsers: User[] = [
  {
    user_id: 'u1',
    full_name: 'Ankita Das',
    email: 'ankita.das@iitd.ac.in',
    college_name: 'IIT Delhi',
    is_verified: true,
    is_email_verified: true,
    verification_status: 'approved',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Ankita&backgroundColor=d1fae5&shape1Color=059669',
    role: 'STUDENT',
    phone: '9876543210',
    created_at: new Date().toISOString()
  },
  {
    user_id: 'u_admin',
    full_name: 'Admin Overseer',
    email: 'audit@studentaid.network',
    college_name: 'System Governance',
    is_verified: true,
    is_email_verified: true,
    verification_status: 'approved',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Admin&backgroundColor=064e3b&shape1Color=ffffff',
    role: 'ADMIN',
    phone: '0000000000',
    created_at: new Date().toISOString()
  }
];

// Fix: Update property names and status values to match FinancialRequest interface. 
// Fix: Map BOOKS category to OTHER as it's not in the enum.
export const mockRequests: FinancialRequest[] = [
  {
    request_id: 'r1',
    user_id: 'u2',
    student_name: 'Rahul Mehra',
    title: 'Final Semester Hostel & Mess Fees Assistance',
    category: RequestCategory.HOUSING,
    imageUrl: 'https://images.unsplash.com/photo-1555854817-5b2260d50c47?q=80&w=800&auto=format&fit=crop', // Dorm room with desk and notes
    description: 'My father unexpectedly fell ill, and our household income has been diverted to medical bills. I need help covering my final semester hostel and food charges so I can focus on my upcoming placements. Documentation of mess bills is available.',
    requested_amount: 48000,
    amount_raised: 18200,
    urgency_level: UrgencyLevel.HIGH,
    urgency_score: 90,
    deadline: '2024-12-25',
    hide_identity: false,
    status: 'approved',
    created_at: new Date().toISOString(),
  },
  {
    request_id: 'r2',
    user_id: 'u4',
    student_name: 'Priya Verma',
    title: 'Advanced Engineering Textbooks & Software License',
    category: RequestCategory.OTHER,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop', // Stacks of heavy academic books
    description: 'I need to purchase specialized structural engineering software licenses and the latest edition of three core textbooks required for my dissertation. These are not available in the college library.',
    requested_amount: 12500,
    amount_raised: 4200,
    urgency_level: UrgencyLevel.MEDIUM,
    urgency_score: 50,
    hide_identity: false,
    status: 'approved',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    request_id: 'r3',
    user_id: 'u5',
    student_name: 'Anonymous Peer',
    title: 'Wisdom Tooth Extraction & Post-Op Medication',
    category: RequestCategory.MEDICAL,
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop', // Medical setting/clinic
    description: 'I am experiencing severe pain from impacted wisdom teeth. I need an urgent extraction as the infection is spreading. My student insurance only covers 20% of the dental surgical costs.',
    requested_amount: 8500,
    amount_raised: 6100,
    urgency_level: UrgencyLevel.HIGH,
    urgency_score: 95,
    hide_identity: true,
    status: 'approved',
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    request_id: 'r4',
    user_id: 'u6',
    student_name: 'Kabir Singh',
    title: 'Shared Student Housing Security Deposit',
    category: RequestCategory.HOUSING,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop', // Simple apartment keys or room
    description: 'I am moving to a shared flat as the campus hostel is full. I need to pay a security deposit to secure the accommodation. I have already secured the first month rent via my part-time job.',
    requested_amount: 15000,
    amount_raised: 2000,
    urgency_level: UrgencyLevel.LOW,
    urgency_score: 25,
    hide_identity: false,
    status: 'approved',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    request_id: 'r_pending_1',
    user_id: 'u7',
    student_name: 'Sanya Malhotra',
    title: 'Commute Support for Research Internship',
    category: RequestCategory.OTHER,
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop', // Public transport bus
    description: 'I secured a prestigious internship at a laboratory 30km away. I need funds for a monthly bus pass to cover the commute for the next 3 months.',
    requested_amount: 4500,
    amount_raised: 0,
    urgency_level: UrgencyLevel.MEDIUM,
    urgency_score: 45,
    hide_identity: false,
    status: 'pending',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    request_id: 'r_pending_invalid',
    user_id: 'u_suspicious',
    student_name: 'Aryan Khan',
    title: 'Latest Smartphone Upgrade for "Study Purposes"',
    category: RequestCategory.OTHER,
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', // Flashy smartphone
    description: 'I want to buy the new iPhone 15 Pro Max to take better notes and "study" more effectively. My current phone is a year old and too slow for high-end gaming—I mean, high-end educational apps.',
    requested_amount: 120000,
    amount_raised: 0,
    urgency_level: UrgencyLevel.LOW,
    urgency_score: 10,
    hide_identity: false,
    status: 'pending',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    request_id: 'r_pending_3',
    user_id: 'u9',
    student_name: 'Meera Nair',
    title: 'Architecture Drafting Board & Supplies',
    category: RequestCategory.OTHER,
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592dea58ef21?q=80&w=800&auto=format&fit=crop', // Drafting tools
    description: 'First-year architecture kit is extremely expensive. I need support to buy a professional drafting board, T-squares, and drawing sets required for my first studio project.',
    requested_amount: 9200,
    amount_raised: 0,
    urgency_level: UrgencyLevel.HIGH,
    urgency_score: 80,
    hide_identity: false,
    status: 'pending',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  }
];

export const mockDonations: Donation[] = [];
