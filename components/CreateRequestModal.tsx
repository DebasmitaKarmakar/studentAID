
import React, { useState } from 'react';
import { FinancialRequest, RequestCategory, UrgencyLevel } from '../types';
import { geminiService } from '../services/geminiService';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: Partial<FinancialRequest>) => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<FinancialRequest>>({
    title: '',
    category: RequestCategory.OTHER,
    description: '',
    requested_amount: 0,
    urgency_level: UrgencyLevel.MEDIUM,
    hide_identity: false,
  });
  const [isPolishing, setIsPolishing] = useState(false);

  if (!isOpen) return null;

  const handlePolish = async () => {
    if (!formData.description || !formData.title) return;
    setIsPolishing(true);
    const polished = await geminiService.polishDescription(formData.title, formData.description);
    setFormData({ ...formData, description: polished });
    setIsPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      category: RequestCategory.OTHER,
      description: '',
      requested_amount: 0,
      urgency_level: UrgencyLevel.MEDIUM,
      hide_identity: false,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-md">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] border border-emerald-50">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tight">Register Aid Request</h2>
              <p className="text-emerald-500 font-medium text-sm mt-1">Stored in the system ledger for verification.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-emerald-50 rounded-2xl text-emerald-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Descriptive Title (e.g. Hospitalization Bill Support)"
              className="w-full px-6 py-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 font-bold text-emerald-950 outline-none"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as RequestCategory })}
                className="px-6 py-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 font-bold text-emerald-950 outline-none appearance-none"
              >
                <option value={RequestCategory.FEES}>Tuition Fees</option>
                <option value={RequestCategory.MEDICAL}>Medical Expenses</option>
                <option value={RequestCategory.HOUSING}>Housing & Rent</option>
                <option value={RequestCategory.OTHER}>Other</option>
              </select>

              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-400 font-black">₹</span>
                <input 
                  required
                  type="number" 
                  value={formData.requested_amount || ''}
                  onChange={(e) => setFormData({ ...formData, requested_amount: Number(e.target.value) })}
                  placeholder="Requested Capital"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-emerald-50/30 border border-emerald-100 font-black text-emerald-950 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 ml-1">Urgency Level</label>
              <div className="flex gap-2">
                {[UrgencyLevel.LOW, UrgencyLevel.MEDIUM, UrgencyLevel.HIGH].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency_level: lvl })}
                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.urgency_level === lvl ? 'bg-emerald-950 text-white' : 'bg-emerald-50 text-emerald-400'
                    }`}
                  >
                    Level {lvl} {lvl === 3 ? '(Critical)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">Context & Narrative</label>
                <button type="button" onClick={handlePolish} disabled={isPolishing || !formData.description} className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                  {isPolishing ? 'Analyzing...' : 'AI Optimization'}
                </button>
              </div>
              <textarea 
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain why this support is vital..."
                className="w-full px-6 py-4 rounded-3xl bg-emerald-50/30 border border-emerald-100 font-medium text-emerald-900 outline-none resize-none"
              ></textarea>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-50">
              <input 
                type="checkbox" 
                id="anon_reg"
                checked={formData.hide_identity}
                onChange={(e) => setFormData({ ...formData, hide_identity: e.target.checked })}
                className="w-5 h-5 accent-emerald-600"
              />
              <label htmlFor="anon_reg" className="text-xs font-bold text-emerald-700">Hide Identity from Community (Visible only to Admin)</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={onClose} className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-emerald-400">Cancel</button>
              <button type="submit" className="flex-[2] py-5 gradient-bg text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">Submit for Verification</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRequestModal;
