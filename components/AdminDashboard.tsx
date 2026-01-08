
import React, { useState } from 'react';
import { FinancialRequest, AdminLog, User } from '../types';
import { StorageService } from '../services/storage';

interface AdminDashboardProps {
  requests: FinancialRequest[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
  currentUser: User;
  // Fix: Added users and logs props to replace getDB() calls
  users: User[];
  logs: AdminLog[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ requests, onUpdateStatus, currentUser, users, logs }) => {
  const [activeTab, setActiveTab] = useState<'queue' | 'logs'>('queue');

  // Fix: Removed internal logs state and useEffect as logs are now passed as props from parent component

  const handleAction = (id: string, status: 'approved' | 'rejected') => {
    onUpdateStatus(id, status);
    StorageService.addLog({
      action: `${status.toUpperCase()}_REQUEST`,
      target_id: id,
      admin_id: currentUser.user_id,
      admin_name: currentUser.full_name,
      details: `Request ${id} was ${status} by ${currentUser.full_name}`
    });
  };

  return (
    <div className="space-y-12 animate-reveal">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black text-emerald-950 tracking-tighter">Verification <span className="gradient-text">Vault</span></h1>
          <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Active Overseer: {currentUser.full_name}</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-emerald-100 shadow-sm">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-emerald-950 text-white' : 'text-emerald-400'}`}
          >
            Pending ({requests.length})
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-emerald-950 text-white' : 'text-emerald-400'}`}
          >
            Audit Logs
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="grid gap-8">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.request_id} className="pretty-card p-10 rounded-[3rem] border-emerald-50 bg-white shadow-xl">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="w-full lg:w-1/3">
                    <img src={req.imageUrl} className="w-full h-48 object-cover rounded-3xl shadow-lg mb-6" alt="Evidence" />
                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                      <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        Admin-Only Sensitive Data
                      </p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[8px] font-bold text-rose-300 uppercase">Direct Contact</p>
                          {/* Fix: Access users from props instead of non-existent StorageService.getDB() */}
                          <p className="text-sm font-black text-rose-900">{users.find(u => u.user_id === req.user_id)?.phone || 'No Phone recorded'}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-rose-300 uppercase">Identity Integrity</p>
                          <p className="text-sm font-black text-rose-900">{req.student_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-3xl font-black text-emerald-950 tracking-tight">{req.title}</h3>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">{req.category}</span>
                      </div>
                      <p className="text-emerald-800/70 text-sm leading-relaxed mb-6 italic border-l-4 border-emerald-100 pl-4">"{req.description}"</p>
                      <div className="flex gap-10">
                        <div>
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Requested</p>
                          <p className="text-xl font-black text-emerald-950">₹{req.requested_amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Urgency Score</p>
                          <p className="text-xl font-black text-rose-600">{(req.urgency_level * 3.33).toFixed(1)}/10</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button 
                        onClick={() => handleAction(req.request_id, 'rejected')}
                        className="flex-1 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-all"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(req.request_id, 'approved')}
                        className="flex-[2] gradient-bg text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100"
                      >
                        Approve Publication
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-40 bg-white rounded-[4rem] border-2 border-dashed border-emerald-100">
              <p className="text-emerald-400 font-black text-sm uppercase tracking-[0.4em]">Queue Empty - System Stable</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-emerald-950 rounded-[3rem] p-10 text-emerald-100 shadow-2xl overflow-hidden font-mono">
          <div className="flex justify-between items-center mb-10 border-b border-emerald-800 pb-6">
            <h2 className="text-xl font-black tracking-tighter uppercase">Platform Audit Stream</h2>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
            {logs.length > 0 ? (logs.map(log => (
              <div key={log.log_id} className="text-xs p-4 bg-emerald-900/40 rounded-xl border border-emerald-800 hover:bg-emerald-900/60 transition-colors">
                <span className="text-emerald-500 font-black mr-4">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className="text-white font-black px-2 py-0.5 bg-emerald-700 rounded mr-4">{log.action}</span>
                <span className="text-emerald-300">Target: {log.target_id}</span>
                <p className="mt-2 text-emerald-400/70 ml-24 opacity-80">{log.details}</p>
              </div>
            ))) : (
              <p className="text-center py-20 text-emerald-700 uppercase tracking-widest">No activity recorded on current session.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
