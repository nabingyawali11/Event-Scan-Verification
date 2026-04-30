import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, XCircle, RefreshCw, User, Mail, Calendar } from 'lucide-react';

export default function QrReader() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const startScanner = () => {
    if (scannerRef.current) return;
    setError(null);

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
      supportedScanTypes: [0] // 0 = QR_CODE
    });

    scanner.render(
      async (decodedText) => {
        if (loading || result) return;
        setLoading(true);
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
        // Only log errors that aren't "QR not found"
        if (!errorMessage.includes("NotFoundException")) {
            console.warn("Scanner Error:", errorMessage);
        }
      }
    );

    scannerRef.current = scanner;
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
           <h3 className="font-bold text-slate-800">Scanner View</h3>
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        <div id="qr-reader" className="w-full !border-none" />

        {!result && !loading && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col space-y-4">
             <button 
                onClick={startScanner}
                className="w-full py-3 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center justify-center space-x-2"
             >
                <RefreshCw size={18} />
                <span>Retry Camera</span>
             </button>

             <div className="flex items-start space-x-3 bg-amber-50 p-4 rounded-xl border border-amber-100">
                <AlertCircle className="text-amber-600 shrink-0" size={18} />
                <p className="text-[10px] text-amber-800 leading-relaxed uppercase font-bold tracking-tight">
                  Camera requires HTTPS. Grant permission when prompted.
                </p>
             </div>
          </div>
        )}

        {loading && (
          <div className="p-12 text-center bg-white border-t border-slate-100">
             <RefreshCw className="animate-spin mx-auto text-indigo-600 mb-4" size={32} />
             <p className="text-slate-600 font-medium">Verifying Ticket...</p>
          </div>
        )}

        {result && (
          <div className={`p-8 text-center animate-in zoom-in-95 duration-200 border-t border-slate-100 ${result.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.type === 'success' ? (
              <CheckCircle2 size={72} className="mx-auto text-green-500 mb-4" />
            ) : (
              <XCircle size={72} className="mx-auto text-red-500 mb-4" />
            )}
            
            <h3 className={`text-2xl font-bold mb-6 ${result.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </h3>
            
            {result.participant && (
              <div className="text-left bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white/50 space-y-3 mb-6 shadow-sm">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Participant</p>
                  <p className="font-bold text-slate-800">{result.participant.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Event</p>
                  <p className="text-slate-700">{result.participant.event}</p>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setResult(null)} 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Scan Next Ticket
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
