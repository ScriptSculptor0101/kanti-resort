import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  X, 
  Eye, 
  EyeOff, 
  Globe, 
  Clock, 
  UserCheck, 
  KeyRound,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { 
  AUTHORIZED_STAFF_ACCOUNTS, 
  authenticateStaffUser 
} from '../lib/staffAuthService';
import { TRANSLATIONS } from '../data/translations';
import InstallAppModal from './InstallAppModal';

export default function StaffAuth({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  lang = 'hi', 
  onToggleLang 
}) {
  const [selectedStaff, setSelectedStaff] = useState(AUTHORIZED_STAFF_ACCOUNTS[1]); // Default to Desk 1
  const [password, setPassword] = useState(AUTHORIZED_STAFF_ACCOUNTS[1].initialPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [installModalOpen, setInstallModalOpen] = useState(false);

  if (!isOpen) return null;

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleSelectUser = (account) => {
    setSelectedStaff(account);
    setPassword(account.initialPassword);
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const emailToUse = selectedStaff ? selectedStaff.email : '';
      const res = await authenticateStaffUser(emailToUse, password);

      if (!res.success) {
        setErrorMsg(lang === 'hi' ? res.errorHi : res.errorEn);
      } else {
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setErrorMsg(lang === 'hi' ? 'लॉगिन में समस्या आई। पुनः प्रयास करें।' : 'Login failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#FFFDF7] rounded-3xl shadow-2xl border-2 border-[#D4A373]/40 overflow-hidden my-auto">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1E252B] via-[#2A343D] to-[#1E252B] text-white p-5 sm:p-6 relative">
          
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <img 
                src="/kanti-logo-circle.png" 
                alt="Kanti Logo" 
                className="w-11 h-11 rounded-full ring-2 ring-[#D4A373]/50 object-cover"
              />
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#F3E5AB]">
                  {t.staffLoginTitle}
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-300">
                  {t.staffLoginSubtitle}
                </p>
              </div>
            </div>

            {/* Language Switcher Pill */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleLang}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5 transition-all"
                title="भाषा बदलें / Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{lang === 'hi' ? 'English में देखें' : 'हिन्दी में देखें'}</span>
              </button>

              <button 
                onClick={onClose}
                className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Security Sub-ribbon */}
          <div className="mt-3.5 pt-2.5 border-t border-stone-700/80 flex items-center justify-between text-[11px] text-stone-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.securityBadge}</span>
            </span>
            <span className="text-amber-300 font-medium">
              🔒 {lang === 'hi' ? 'सीमित: केवल 5 अधिकृत स्टाफ' : 'Strict Limit: 5 Staff Accounts'}
            </span>
          </div>

        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-300 rounded-2xl text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Prompt */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t.usersListTitle}
            </label>

            {/* 5 User Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AUTHORIZED_STAFF_ACCOUNTS.map((acc, index) => {
                const isSelected = selectedStaff?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectUser(acc)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-amber-50/70 border-[#D4A373] ring-2 ring-[#D4A373]/30 shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isSelected ? 'bg-[#0891B2] text-white shadow' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {index + 1}
                    </div>

                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight truncate">
                        {lang === 'hi' ? acc.name_hi : acc.name_en}
                      </h4>
                      <p className="text-[11px] font-semibold text-[#0891B2] mt-0.5 truncate">
                        {lang === 'hi' ? acc.role_hi : acc.role_en}
                      </p>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5 truncate">
                        {acc.email}
                      </p>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#D4A373] absolute top-3 right-3 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Password Input & Quick Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-1">
            
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">
                  {lang === 'hi' ? 'लॉगिन क्रेडेंशियल' : 'Staff Access Credential'}:
                </span>
                <span className="text-[11px] font-mono text-stone-600 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
                  {selectedStaff?.email}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                  {t.enterPassword}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#0891B2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Hint / Quick Set for easy staff use */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-stone-500">
                  {lang === 'hi' ? 'पासवर्ड:' : 'Default Password:'} <strong className="font-mono text-stone-800">{selectedStaff?.initialPassword}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setPassword(selectedStaff?.initialPassword)}
                  className="text-[11px] font-bold text-[#0891B2] hover:underline"
                >
                  {lang === 'hi' ? 'ऑटो भरें' : 'Fill Default'}
                </button>
              </div>
            </div>

            {/* Install on Phone / Share Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setInstallModalOpen(true)}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-900 font-black rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? '📲 फोन पर ऐप चलाएं / शेयर करें (WebAPK)' : '📲 Run & Install on Phone (WebAPK)'}</span>
              </button>
            </div>

            {/* Big Touch-Friendly Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D4A373] via-[#c49363] to-[#B88758] hover:from-[#c49363] hover:to-[#A77647] text-stone-950 font-black text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-stone-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4 text-stone-900" />
                  <span>{t.btnLogin}</span>
                  <ArrowRight className="w-4 h-4 text-stone-900" />
                </>
              )}
            </button>

          </form>

        </div>

        {/* Security Footer Note */}
        <div className="bg-stone-100 px-6 py-3 border-t border-stone-200 text-[11px] text-stone-600 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kanti Resort • Phata Kedarnath Front Desk Terminal</span>
          </span>
          <span className="font-mono text-[10px] text-stone-500">
            5-User Security Whitelist Active
          </span>
        </div>

      </div>

      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        lang={lang}
      />

    </div>
  );
}
