
import React, { useState, useMemo } from 'react';
import { FinancialRequest, User } from '../types';
import RequestCard from './RequestCard';

interface FeedProps {
  requests: FinancialRequest[];
  onDonate: (requestId: string, amount: number) => void;
  user: User | null;
}

const Feed: React.FC<FeedProps> = ({ requests, onDonate, user }) => {
  const [sortBy, setSortBy] = useState<'critical' | 'newest'>('critical');

  const sortedAndFilteredRequests = useMemo(() => {
    const approved = requests.filter(r => r.status === 'approved');
    
    if (sortBy === 'critical') {
      return [...approved].sort((a, b) => {
        // Criticality score = urgency_score + (funding_gap / 1000)
        const gapA = a.requested_amount - a.amount_raised;
        const gapB = b.requested_amount - b.amount_raised;
        return (b.urgency_score + gapB/1000) - (a.urgency_score + gapA/1000);
      });
    } else {
      return [...approved].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
  }, [requests, sortBy]);

  return (
    <div className="space-y-16 max-w-5xl mx-auto px-4 pb-20">
      <section className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl animate-reveal bg-emerald-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 transition-transform duration-10s hover:scale-110"
            alt="Students working together"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-10 md:p-20 text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 backdrop-blur-lg rounded-full border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            Peer-to-Peer Aid Network
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8 tracking-tighter">
            Empowering <span className="text-emerald-400">Futures</span>, One Student at a Time.
          </h1>
          <p className="text-lg md:text-xl text-emerald-100/80 font-medium leading-relaxed mb-12 max-w-xl">
            A safe, verified space for students to overcome urgent financial hurdles through collective community support.
          </p>
          <div className="flex flex-wrap gap-10 border-t border-white/10 pt-10">
            <div>
              <p className="text-3xl font-black text-white">{sortedAndFilteredRequests.length}</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Requests</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Verified Profiles</p>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-100 pb-8">
          <div>
            <h2 className="text-3xl font-black text-emerald-950 tracking-tight">Support Ledger</h2>
            <p className="text-emerald-500 font-medium mt-1">Verified community needs awaiting your impact.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-emerald-300 uppercase tracking-[0.3em]">Sort Priority:</span>
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-emerald-50">
              <button 
                onClick={() => setSortBy('critical')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  sortBy === 'critical' ? 'bg-emerald-950 text-white shadow-md' : 'text-emerald-400 hover:bg-emerald-50'
                }`}
              >
                Critical
              </button>
              <button 
                onClick={() => setSortBy('newest')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                  sortBy === 'newest' ? 'bg-emerald-950 text-white shadow-md' : 'text-emerald-400 hover:bg-emerald-50'
                }`}
              >
                Newest
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-12">
          {sortedAndFilteredRequests.length > 0 ? (
            sortedAndFilteredRequests.map((request, index) => (
              <RequestCard 
                key={request.request_id} 
                index={index}
                request={request} 
                onDonate={onDonate}
                isVerified={user?.is_verified || false}
              />
            ))
          ) : (
            <div className="text-center py-40 bg-white rounded-[3rem] border border-emerald-50 shadow-sm">
              <div className="text-7xl mb-6">🤝</div>
              <h3 className="text-2xl font-black text-emerald-950">The ledger is currently clear.</h3>
              <p className="text-emerald-500 font-medium mt-2">All student requests have been successfully fulfilled!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
