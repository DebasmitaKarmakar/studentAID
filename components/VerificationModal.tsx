
import React, { useState, useRef } from 'react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (university: string, idFile: string) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ isOpen, onClose, onVerify }) => {
  const [university, setUniversity] = useState('');
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setIdPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idPreview || !university) {
      alert("Please provide both university name and a clear scan of your ID.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onVerify(university, idPreview);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-xl">
      <div className="bg-white w-full max-w-lg rounded-[3.5rem] shadow-2xl overflow-hidden animate-reveal border border-emerald-50">
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tighter leading-none">Identity Audit</h2>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Upload your Student ID</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-emerald-50 rounded-2xl text-emerald-300">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            
            <div>
              <label className="block text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 ml-1">Institution Name</label>
              <input 
                required
                type="text" 
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Stanford University"
                className="w-full px-6 py-4 rounded-2xl bg-emerald-50/20 border border-emerald-100 font-bold text-emerald-950 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative h-64 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${idPreview ? 'border-emerald-500 bg-emerald-50/20' : 'border-emerald-100 bg-emerald-50/10 hover:bg-emerald-50/30'}`}
            >
              {idPreview ? (
                <>
                  <img src={idPreview} className="absolute inset-0 w-full h-full object-cover" alt="ID Preview" />
                  <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="text-white text-[10px] font-black uppercase tracking-widest">Tap to Replace Image</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-4">
                     📸
                  </div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Select ID Card Image</p>
                </>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !idPreview} 
              className="w-full py-5 gradient-bg text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50 active:scale-95 transition-all"
            >
              {isSubmitting ? 'Processing Identity...' : 'Submit to Admin for Audit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
