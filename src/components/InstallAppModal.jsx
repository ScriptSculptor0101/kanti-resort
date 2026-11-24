import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function InstallAppModal({ isOpen, onClose, lang = 'hi' }) {
  const [copied, setCopied] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.hi;

  // App URL for sharing
  const appUrl = typeof window !== 'undefined' ? `${window.location.origin}/#app` : 'https://kantiresort.com/#app';
  // QR Code URL using standard Google Chart / QR Server API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(appUrl)}&color=1E252B&bgcolor=FFFDF7&margin=1`;

  // Listen for native PWA install prompt on Android Chrome / Edge
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      alert(
        lang === 'hi'
          ? 'अपने फोन के ब्राउज़र में ऊपर दाईं ओर 3 डॉट्स (⋮) पर क्लिक करें और "Install App" या "Add to Home screen" चुनें।'
          : 'In your mobile browser, tap the menu (⋮) and select "Install App" or "Add to Home screen".'
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(
      `*कांति रिसॉर्ट स्टाफ ऐप (Kanti Resort Staff App)*\n` +
      `केदारनाथ मार्ग, फाटा - फ्रंट डेस्क एवं रूम बिलिंग ऐप\n\n` +
      `📲 *ऐप खोलने एवं इंस्टॉल करने का लिंक:*\n` +
      `${appUrl}\n\n` +
      `💡 *फोन में कैसे लगाएं:* लिंक खोलें, फिर ब्राउज़र मेनू (⋮) में जाकर *"Install App"* या *"Add to Home Screen"* पर क्लिक करें।\n` +
      `यह आपके फोन में एक असली एंड्रॉयड ऐप (WebAPK) की तरह इंस्टॉल हो जाएगा!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-none">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-[#FFFDF7] rounded-3xl shadow-2xl border-2 border-[#D4A373]/40 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E252B] via-[#2A343D] to-[#1E252B] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#D4A373]/20 border border-[#D4A373]/40 flex items-center justify-center text-[#D4A373]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#F3E5AB]">
                {lang === 'hi' ? 'फोन पर ऐप चलाएं एवं शेयर करें' : 'Run on Phone & Share'}
              </h3>
              <p className="text-xs text-stone-300">
                {lang === 'hi' ? 'एंड्रॉयड फोन पर 1-टैप में इंस्टॉल करें' : 'Seamless WebAPK Installation on Mobile'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-stone-800">
          
          {/* Direct Install CTA Button */}
          <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-black text-[11px] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'एंड्रॉयड WebAPK समर्थित' : 'Native WebAPK Ready'}</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-stone-900">
              {lang === 'hi' ? 'इस फोन पर सीधे ऐप इंस्टॉल करें' : 'Install App Directly on this Device'}
            </h4>
            <p className="text-[11px] text-stone-600 font-medium">
              {lang === 'hi' 
                ? 'यह आपके फोन की होम स्क्रीन पर कांति रिसॉर्ट का लोगो और अलग ऐप आइकन लगा देगा।' 
                : 'Installs the native icon on your phone home screen with zero browser bars.'}
            </p>
            <div className="pt-1">
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>{lang === 'hi' ? '📱 अभी फोन में इंस्टॉल करें' : '📱 Install App Now'}</span>
              </button>
            </div>
          </div>

          {/* QR Code & Share via WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-stone-50 p-4 rounded-2xl border-2 border-stone-200">
            
            {/* QR Code Image */}
            <div className="flex flex-col items-center text-center space-y-1.5">
              <div className="p-2 bg-white rounded-2xl border-2 border-stone-300 shadow-sm">
                <img 
                  src={qrCodeUrl} 
                  alt="Kanti Staff App QR Code" 
                  className="w-36 h-36 object-contain rounded-xl"
                />
              </div>
              <span className="text-[11px] font-bold text-stone-600">
                📷 {lang === 'hi' ? 'फोन कैमरा से स्कैन करें' : 'Scan with Phone Camera'}
              </span>
            </div>

            {/* Share Buttons */}
            <div className="space-y-2.5">
              <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">
                {lang === 'hi' ? 'स्टाफ को भेजें (Share Link):' : 'Share to Staff:'}
              </span>

              {/* WhatsApp Share */}
              <button
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-3 bg-[#166534] hover:bg-[#14532D] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all text-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-800 border-2 border-stone-300 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (lang === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link Copied!') : (lang === 'hi' ? 'लिंक कॉपी करें' : 'Copy Direct Link')}</span>
              </button>
            </div>

          </div>

          {/* How to Install 3-Step Guide */}
          <div className="space-y-2 pt-1">
            <h5 className="font-serif font-black text-stone-900 text-xs uppercase tracking-wider">
              {lang === 'hi' ? 'किसी भी एंड्रॉयड फोन पर कैसे चलाएं (3 आसान स्टेप):' : 'How to Run on Any Android Phone:'}
            </h5>

            <div className="space-y-1.5 text-[11px] text-stone-700 font-medium">
              <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0891B2] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span>{lang === 'hi' ? 'फोन के Chrome ब्राउज़र में लिंक खोलें या QR कोड स्कैन करें।' : 'Open the link in Chrome or scan the QR code.'}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0891B2] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span>{lang === 'hi' ? 'स्क्रीन पर नीचे "Install App" का पॉपअप आएगा, अथवा ऊपर 3 डॉट्स (⋮) दबाकर "Install App" चुनें।' : 'Tap the "Install App" popup or choose "Install App" from the browser menu (⋮).'}</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-stone-200 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span>{lang === 'hi' ? 'एंड्रॉयड अपने आप इसका WebAPK बनाकर फोन की होम स्क्रीन पर लगा देगा। यह बिना किसी ब्राउज़र बार के फुल स्क्रीन ऐप की तरह चलेगा!' : 'Android automatically installs the WebAPK with a native icon on your home screen.'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-100 px-6 py-3 border-t-2 border-stone-200 flex items-center justify-between text-[11px] text-stone-600 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kanti Resort Phata Mobile RMS</span>
          </span>
          <button
            onClick={onClose}
            className="font-bold text-[#0891B2] hover:underline"
          >
            {lang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>

    </div>
  );
}
