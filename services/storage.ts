
import { User, FinancialRequest, Donation, AdminLog, DatabaseSchema } from '../types';
import { mockRequests, mockUsers } from '../mockData';

const STORAGE_KEY = 'studentaid_ledger_v2';

const getInitialData = (): DatabaseSchema => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse local data", e);
    }
  }
  return {
    users: mockUsers,
    requests: mockRequests,
    donations: [],
    admin_logs: []
  };
};

let currentDB: DatabaseSchema = getInitialData();

const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentDB));
};

export const StorageService = {
  getDB: () => ({ ...currentDB }),

  subscribeToDB: (callback: (db: DatabaseSchema) => void) => {
    // Return initial state
    callback({ ...currentDB });
    
    // Poll for changes to ensure reactivity across the app
    const interval = setInterval(() => {
      callback({ ...currentDB });
    }, 1000);
    return () => clearInterval(interval);
  },

  addUser: async (user: User) => {
    currentDB.users = [...currentDB.users, user];
    save();
  },

  getUserByEmail: (email: string) => {
    return currentDB.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserProfile: async (userId: string) => {
    return currentDB.users.find(u => u.user_id === userId) || null;
  },

  updateUserVerification: async (userId: string, university: string, idCardBase64: string) => {
    currentDB.users = currentDB.users.map(u => 
      u.user_id === userId 
        ? { ...u, college_name: university, id_card_url: idCardBase64, verification_status: 'pending' as const }
        : u
    );
    save();
  },

  updateUserStatus: async (userId: string, status: 'approved' | 'rejected') => {
    currentDB.users = currentDB.users.map(u => 
      u.user_id === userId 
        ? { ...u, verification_status: status, is_verified: status === 'approved' }
        : u
    );
    save();
  },

  addRequest: async (request: FinancialRequest) => {
    currentDB.requests = [request, ...currentDB.requests];
    save();
  },

  updateRequestStatus: async (requestId: string, status: any) => {
    currentDB.requests = currentDB.requests.map(r => 
      r.request_id === requestId 
        ? { ...r, status, approved_at: status === 'approved' ? new Date().toISOString() : r.approved_at }
        : r
    );
    save();
  },

  addDonation: async (donation: Donation) => {
    currentDB.donations = [donation, ...currentDB.donations];
    currentDB.requests = currentDB.requests.map(r => {
      if (r.request_id === donation.request_id) {
        return { ...r, amount_raised: r.amount_raised + donation.amount };
      }
      return r;
    });
    save();
  },

  addLog: async (log: Omit<AdminLog, 'log_id' | 'timestamp'>) => {
    const newLog: AdminLog = {
      ...log,
      log_id: `log_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    currentDB.admin_logs = [newLog, ...currentDB.admin_logs];
    save();
  }
};
