import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../api/axios';
import { CheckCircle2, AlertCircle, XCircle, RefreshCw, User, Mail, Calendar } from 'lucide-react';

export default function QrReader() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
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
      () => {}
    );

    scannerRef.current = scanner;
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        <div id="qr-reader" className="w-full" />
        {loading && <div className="p-8 text-center bg-slate-50"><RefreshCw className="animate-spin mx-auto text-indigo-600 mb-2" /><p>Verifying...</p></div>}
        {result && (
          <div className={`p-8 text-center ${result.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            {result.type === 'success' ? <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" /> : <XCircle size={64} className="mx-auto text-red-500 mb-4" />}
            <h3 className="text-2xl font-bold mb-4">{result.message}</h3>
            {result.participant && (
              <div className="text-left bg-white/50 p-4 rounded-xl space-y-2">
                <p><strong>Name:</strong> {result.participant.name}</p>
                <p><strong>Email:</strong> {result.participant.email}</p>
                <p><strong>Event:</strong> {result.participant.event}</p>
              </div>
            )}
            <button onClick={() => setResult(null)} className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">Scan Next</button>
          </div>
        )}
      </div>
    </div>
  );
}
