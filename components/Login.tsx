
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Icons } from '../constants';
import { StorageService } from '../services/storage';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'signup') {
      const existing = StorageService.getUserByEmail(email);
      if (existing) {
        setError("This email is already registered.");
        return;
      }

      const newUser: User = {
        user_id: `u_${Math.random().toString(36).substr(2, 9)}`,
        full_name: name.trim(),
        college_name: college.trim() || 'Institutional Guest',
        email: email.trim().toLowerCase(),
        phone: 'Not provided',
        is_verified: role === 'ADMIN',
        is_email_verified: true,
        verification_status: role === 'ADMIN' ? 'approved' : 'pending',
        role,
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${email}`,
        created_at: new Date().toISOString()
      };
      
      await StorageService.addUser(newUser);
      onLogin(newUser);
    } else {
      const user = StorageService.getUserByEmail(email);
      if (user) {
        // Simple mock password check
        onLogin(user);
      } else {
        setError("User not found. Please register.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f0f9f6]">
      <div className="bg-white/80 backdrop-blur-xl w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden border border-emerald-50 animate-reveal">
        <div className="p-10 md:p-14">
          <div className="text-center mb-10">
            <div className="w-20 h-20 gradient-bg rounded-3xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-6 shadow-2xl">
              S
            </div>
            <h1 className="text-3xl font-black text-emerald-950 tracking-tight">StudentAid Ledger</h1>
            <p className="text-emerald-500/70 font-semibold text-sm mt-2">Verified Institutional Access</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8 bg-emerald-50/50 p-1.5 rounded-2xl border border-emerald-100">
            <button 
              onClick={() => setMode('signin')}
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                mode === 'signin' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-300'
              }`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                mode === 'signup' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-300'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setRole('STUDENT')} className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${role === 'STUDENT' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-300'}`}>Student</button>
                  <button type="button" onClick={() => setRole('ADMIN')} className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest ${role === 'ADMIN' ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-300'}`}>Admin</button>
                </div>
                <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full px-6 py-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 font-bold text-emerald-950 outline-none" />
                {role === 'STUDENT' && <input required type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="University" className="w-full px-6 py-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 font-bold text-emerald-950 outline-none" />}
              </div>
            )}

            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="University Email" className="w-full px-6 py-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 font-bold text-emerald-950 outline-none" />
            
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-300"><Icons.Shield /></span>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passcode" className="w-full pl-14 pr-6 py-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 font-bold text-emerald-950 outline-none" />
            </div>

            {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center mt-2">{error}</p>}

            <button type="submit" className="w-full py-5 gradient-bg text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl mt-4 active:scale-95 transition-all">
              {mode === 'signin' ? 'Unlock Account' : 'Initialize Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
