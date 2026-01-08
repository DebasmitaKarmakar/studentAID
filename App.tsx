
import React, { useState, useEffect, useMemo } from 'react';
import { 
  User, 
  FinancialRequest, 
  Donation, 
  UrgencyLevel, 
  RequestCategory,
  DatabaseSchema
} from './types';
import Header from './components/Header';
import Feed from './components/Feed';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import VerificationModal from './components/VerificationModal';
import CreateRequestModal from './components/CreateRequestModal';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('active_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [db, setDb] = useState<DatabaseSchema>(StorageService.getDB());
  const [view, setView] = useState<'feed' | 'dashboard' | 'admin'>('feed');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    const unsub = StorageService.subscribeToDB((newDB) => {
      setDb({ ...newDB });
    });
    return () => unsub();
  }, []);

  const sortedRequests = useMemo(() => {
    return db.requests
      .filter(r => r.status === 'approved')
      .sort((a, b) => b.urgency_score - a.urgency_score);
  }, [db.requests]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    sessionStorage.setItem('active_user', JSON.stringify(user));
    if (user.role === 'ADMIN') setView('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('active_user');
    setView('feed');
  };

  const handleUpdateStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    await StorageService.updateRequestStatus(requestId, status);
  };

  const handleDonate = async (requestId: string, amount: number) => {
    if (!currentUser) return;
    if (!currentUser.is_verified) {
      setIsVerificationModalOpen(true);
      return;
    }
    const donation: Donation = {
      donation_id: `d_${Math.random().toString(36).substr(2, 9)}`,
      request_id: requestId,
      donor_id: currentUser.user_id,
      donor_name: currentUser.full_name,
      amount,
      payment_mode: 'mock',
      timestamp: new Date().toISOString()
    };
    await StorageService.addDonation(donation);
  };

  const handleCreateRequest = async (data: Partial<FinancialRequest>) => {
    if (!currentUser) return;
    const newRequest: FinancialRequest = {
      request_id: `r_${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUser.user_id,
      student_name: currentUser.full_name,
      title: data.title || 'Support Request',
      description: data.description || '',
      category: data.category || RequestCategory.OTHER,
      requested_amount: data.requested_amount || 0,
      amount_raised: 0,
      urgency_level: data.urgency_level || UrgencyLevel.MEDIUM,
      urgency_score: (data.urgency_level || 2) * 2.5,
      hide_identity: data.hide_identity || false,
      status: 'pending',
      imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
      created_at: new Date().toISOString()
    };
    await StorageService.addRequest(newRequest);
    setIsRequestModalOpen(false);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <Header 
        user={currentUser as any} 
        activeView={view === 'admin' ? 'feed' : view} 
        onViewChange={(v) => setView(v as any)} 
        onOpenRequest={() => setIsRequestModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {currentUser.role === 'STUDENT' && !currentUser.is_verified && (
          <div className="pretty-card rounded-[3rem] p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 border-amber-100 bg-white shadow-xl shadow-amber-900/5">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl">🛡️</div>
               <div>
                  <h3 className="text-2xl font-black text-amber-950 tracking-tight">Identity Verification Required</h3>
                  <p className="text-amber-600 font-medium text-sm">Please upload your Student ID card to unlock institutional aid.</p>
               </div>
            </div>
            <button onClick={() => setIsVerificationModalOpen(true)} className="px-10 py-4 bg-amber-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Verify Profile</button>
          </div>
        )}

        {view === 'admin' && currentUser.role === 'ADMIN' ? (
          <AdminDashboard requests={db.requests.filter(r => r.status === 'pending')} onUpdateStatus={handleUpdateStatus} currentUser={currentUser} users={db.users} logs={db.admin_logs} />
        ) : view === 'feed' ? (
          <Feed requests={sortedRequests as any} onDonate={handleDonate} user={currentUser as any} />
        ) : (
          <Dashboard user={currentUser as any} requests={db.requests.filter(r => r.user_id === currentUser.user_id) as any} donations={db.donations.filter(d => d.donor_id === currentUser.user_id) as any} />
        )}
      </main>

      <VerificationModal 
        isOpen={isVerificationModalOpen} 
        onClose={() => setIsVerificationModalOpen(false)} 
        onVerify={async (college, idFile) => {
          await StorageService.updateUserVerification(currentUser.user_id, college, idFile);
          alert("Profile Submitted. Please wait for Admin review.");
        }}
      />
      
      <CreateRequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onSubmit={handleCreateRequest as any} />
    </div>
  );
};

export default App;
