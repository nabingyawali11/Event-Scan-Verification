import QrReader from '../components/scanner/QrReader';

export default function Scanner() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800">Event Check-in</h1>
        <p className="text-slate-500 mt-2">
          Use your device's camera to scan participant QR codes. 
          The system will instantly verify registration and mark them as checked in.
        </p>
      </div>

      <QrReader />
    </div>
  );
}
