
import React from 'react';
// Fix: Use User instead of Student
import { User, FinancialRequest, Donation } from '../types';

interface DashboardProps {
  // Fix: Use User instead of Student
  user: User | null;
  requests: FinancialRequest[];
  donations: Donation[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, requests, donations }) => {
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  // Fix: Access amount_raised instead of raisedAmount
  const totalRaised = requests.reduce((sum, r) => sum + r.amount_raised, 0);

  return (
    <div className="space-y-16 animate-reveal max-w-5xl mx-auto px-4 pb-20">
      <div className="flex flex-col gap-3 items-center text-center sm:items-start sm:text-left">
        <h1 className="text-5xl font-black text-emerald-950 tracking-tighter">Impact <span className="gradient-text">Ledger</span></h1>
        {/* Fix: Access full_name instead of name */}
        <p className="text-emerald-400 font-bold uppercase tracking-[0.3em] text-[10px]">Active Verified Member • {user?.full_name}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-10">
        <div className="pretty-card p-12 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000">
            <svg className="w-32 h-32 text-emerald-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
          </div>
          <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Total Aid Received</p>
          <p className="text-7xl font-black text-emerald-950 tracking-tighter leading-none">₹{totalRaised.toLocaleString()}</p>
          <div className="mt-10 flex items-center gap-4">
             <span className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
              {requests.length} Requests Filed
            </span>
          </div>
        </div>

        <div className="pretty-card p-12 rounded-[3rem] relative overflow-hidden group bg-emerald-950 text-white border-none shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
             <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
             </svg>
          </div>
          <p className="text-[11px] font-black text-emerald-300 uppercase tracking-[0.3em] mb-4">Peer Support Given</p>
          <p className="text-7xl font-black text-white tracking-tighter leading-none">₹{totalDonated.toLocaleString()}</p>
          <div className="mt-10">
            <span className="px-5 py-2 bg-white/10 text-emerald-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
              {donations.length} Active Contributions
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-6">
          Your Direct Aid Requests
          <div className="h-0.5 flex-1 bg-emerald-50"></div>
        </h2>
        <div className="bg-white rounded-[3rem] border border-emerald-100 shadow-xl shadow-emerald-900/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50 border-b border-emerald-100">
              <tr>
                <th className="px-12 py-7 text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em]">Request Heading</th>
                <th className="px-12 py-7 text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em]">Status</th>
                <th className="px-12 py-7 text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em] text-right">Raised / Goal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {requests.length > 0 ? (
                requests.map(req => (
                  // Fix: Access request_id instead of id
                  <tr key={req.request_id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-12 py-9 font-black text-emerald-950 text-xl group-hover:text-emerald-700 transition-colors">{req.title}</td>
                    <td className="px-12 py-9">
                      <span className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
                        {req.status}
                      </span>
                    </td>
                    <td className="px-12 py-9 text-right font-black text-emerald-900">
                      {/* Fix: Access amount_raised and requested_amount instead of raisedAmount and requestedAmount */}
                      <span className="text-2xl">₹{req.amount_raised.toLocaleString()}</span>
                      <span className="text-emerald-200 text-sm ml-2">/ ₹{req.requested_amount.toLocaleString()}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-12 py-24 text-center">
                    <p className="text-emerald-300 font-black text-sm uppercase tracking-[0.4em] italic">The ledger is empty.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-10">
        <h2 className="text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-6">
          Recent Community Gifts
          <div className="h-0.5 flex-1 bg-emerald-50"></div>
        </h2>
        <div className="grid gap-6">
          {donations.length > 0 ? (
            donations.map(don => (
              // Fix: Access donation_id instead of id
              <div key={don.donation_id} className="pretty-card p-10 rounded-[2.5rem] flex justify-between items-center group">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 border border-emerald-100 shadow-inner">
                    🌿
                  </div>
                  <div>
                    {/* Fix: Access request_id instead of requestId */}
                    <p className="font-black text-emerald-950 text-xl tracking-tight">Gift to Request #{don.request_id.slice(0, 8)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.25em]">{new Date(don.timestamp).toLocaleDateString()}</p>
                      <div className="w-1.5 h-1.5 bg-emerald-100 rounded-full"></div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em]">Transaction Recorded</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-black text-emerald-900 tracking-tighter">+ ₹{don.amount.toLocaleString()}</p>
                   <p className="text-[9px] font-bold text-emerald-200 uppercase tracking-widest mt-1">Impact Made</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-emerald-300 py-24 font-black uppercase tracking-[0.4em] italic text-sm">Your legacy of kindness is waiting to bloom.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
