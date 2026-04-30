import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/axios';
import { CheckCircle2, XCircle, RefreshCw, AlertCircle, ArrowLeft, Scan } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QrReader() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = () => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
      supportedScanTypes: [0]
    });

    scanner.render(
      async (decodedText) => {
        // Guard against multiple scans while processing or showing result
        if (loading || result || isPaused) return;

        setLoading(true);
        setIsPaused(true); // Immediately pause scanning
        
        // Pause the visual scanner if possible
        try {
            if (scannerRef.current) {
                // Some versions of html5-qrcode-scanner have pause()
                // If not, we rely on our state guard
                scanner.pause(true);
            }
        } catch (e) {
            console.log("Pause not supported, using state guard");
        }

        const parts = decodedText.split('/');
        const token = parts[parts.length - 1];

        try {
          const { data } = await api.get(`/verify/${token}`);
          setResult({ ...data, type: data.valid ? 'success' : 'warning' });
        } catch (err) {
          setResult({ type: 'error', message: err.response?.data?.message || 'Invalid QR' });
        } finally {
          setLoading(false);
        }
      },
      (errorMessage) => {
        if (!errorMessage.includes("NotFoundException")) {
            // console.warn("Scanner Error:", errorMessage);
        }
      }
    );

    scannerRef.current = scanner;
  };

  const handleNextScan = () => {
    setResult(null);
    setIsPaused(false);
    try {
        if (scannerRef.current) {
            scannerRef.current.resume();
        }
    } catch (e) {
        console.log("Resume error");
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((e) => console.error("Clear error:", e));
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center space-x-2">
              <Scan className="text-indigo-600" size={20} />
              <h3 className="font-bold text-slate-800">Check-in Scanner</h3>
           </div>
           {!result && (
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           )}
        </div>

        {/* Scanner Container */}
        <div className={`relative ${result ? 'hidden' : 'block'}`}>
            <div id="qr-reader" className="w-full !border-none" />
        </div>

        {loading && (
          <div className="p-12 text-center bg-white">
             <RefreshCw className="animate-spin mx-auto text-indigo-600 mb-4" size={40} />
             <p className="text-slate-600 font-bold">Verifying...</p>
          </div>
        )}

        {result && (
          <div className={`p-8 text-center animate-in zoom-in-95 duration-200 ${result.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.type === 'success' ? (
              <CheckCircle2 size={80} className="mx-auto text-green-500 mb-4" />
            ) : (
              <XCircle size={80} className="mx-auto text-red-500 mb-4" />
            )}
            
            <h3 className={`text-2xl font-black mb-6 ${result.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </h3>
            
            {result.participant && (
              <div className="text-left bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 space-y-4 mb-8 shadow-sm">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Participant</p>
                  <p className="text-lg font-bold text-slate-800">{result.participant.name}</p>
                  <p className="text-xs text-slate-500">{result.participant.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Event</p>
                  <p className="text-slate-700 font-medium">{result.participant.event}</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3">
                <button 
                  onClick={handleNextScan} 
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all"
                >
                  Scan Next Ticket
                </button>

                <Link 
                  to="/" 
                  className="w-full py-4 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 flex items-center justify-center space-x-2 transition-all"
                >
                  <ArrowLeft size={18} />
                  <span>Back to Dashboard</span>
                </Link>
            </div>
          </div>
        )}

        {!result && !loading && (
             <div className="p-4 bg-amber-50 flex items-start space-x-3 border-t border-amber-100">
                <AlertCircle className="text-amber-600 shrink-0" size={16} />
                <p className="text-[10px] text-amber-800 font-bold leading-tight">
                  POSITION THE QR CODE WITHIN THE BOX ABOVE.
                </p>
             </div>
        )}
      </div>
    </div>
  );
}
