
import React from 'react';
// Fix: Use User instead of Student
import { User } from '../types';

interface HeaderProps {
  // Fix: Use User instead of Student
  user: User | null;
  activeView: 'feed' | 'dashboard' | 'admin';
  onViewChange: (view: 'feed' | 'dashboard' | 'admin') => void;
  onOpenRequest: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, activeView, onViewChange, onOpenRequest, onLogout }) => {
  return (
    <header className="sticky top-0 z-50 glass-morphism px-8 py-5">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onViewChange('feed')}
        >
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-emerald-100 group-hover:rotate-12 transition-all duration-500">
            S
          </div>
          <span className="font-black text-2xl tracking-tighter text-emerald-950">Student<span className="text-emerald-500">Aid</span></span>
        </div>

        <nav className="hidden lg:flex items-center gap-2 bg-emerald-50/50 p-1.5 rounded-[1.5rem] border border-emerald-100">
          <button 
            onClick={() => onViewChange('feed')}
            className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
              activeView === 'feed' 
                ? 'bg-emerald-950 text-white shadow-xl' 
                : 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100/50'
            }`}
          >
            Aid Ledger
          </button>
          
          {user?.role === 'STUDENT' && (
            <button 
              onClick={() => onViewChange('dashboard')}
              className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
                activeView === 'dashboard' 
                  ? 'bg-emerald-950 text-white shadow-xl' 
                  : 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100/50'
              }`}
            >
              My Impact
            </button>
          )}

          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => onViewChange('admin')}
              className={`px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
                activeView === 'admin' 
                  ? 'bg-emerald-900 text-white shadow-xl' 
                  : 'text-emerald-600 hover:text-emerald-900 hover:bg-emerald-100/50'
              }`}
            >
              Verify Queue
            </button>
          )}
        </nav>

        <div className="flex items-center gap-8">
          {user?.role === 'STUDENT' && (
            <button 
              onClick={onOpenRequest}
              className="hidden sm:flex items-center gap-2 px-6 py-3 border-2 border-emerald-100 text-emerald-900 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest"
            >
              Ask for Help
            </button>
          )}

          <button 
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all text-[11px] font-black uppercase tracking-widest"
          >
            Logout
          </button>
          
          {user && (
            <div className="flex items-center gap-5 pl-8 border-l border-emerald-100">
              <div className="text-right hidden sm:block">
                {/* Fix: Access full_name and college_name instead of name and university */}
                <p className="text-sm font-black text-emerald-950 leading-none">{user.full_name}</p>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1.5">{user.college_name}</p>
              </div>
              <div 
                className="relative group cursor-pointer active:scale-95 transition-all" 
                onClick={() => onViewChange(user.role === 'ADMIN' ? 'admin' : 'dashboard')}
              >
                <div className="absolute -inset-1.5 gradient-bg rounded-3xl opacity-10 blur-lg group-hover:opacity-30 transition duration-500"></div>
                <img 
                  src={user.avatar} 
                  alt={user.full_name} 
                  className="relative w-12 h-12 rounded-2xl border-2 border-white shadow-lg bg-emerald-50 p-1 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
