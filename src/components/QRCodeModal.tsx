import React, { useState } from 'react';
import { QrCode, X, Copy, Check, Download, ExternalLink } from 'lucide-react';

export const QRCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  defaultUrl?: string;
  defaultTitle?: string;
}> = ({ isOpen, onClose, defaultUrl, defaultTitle }) => {
  const [url, setUrl] = useState(defaultUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://harshzynx.dev'));
  const [color, setColor] = useState('60a5fa'); // blue
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(url)}&bgcolor=090d16&color=${color}&margin=2`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5 text-slate-100 animate-fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">{defaultTitle || 'QR Code Generator'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Preview Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
          <img
            src={qrImageUrl}
            alt="Generated QR Code"
            className="w-48 h-48 rounded-lg shadow-md"
          />
        </div>

        {/* Color Switcher */}
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400">Accent Tone:</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Blue', hex: '60a5fa' },
              { label: 'Cyan', hex: '22d3ee' },
              { label: 'Emerald', hex: '34d399' },
              { label: 'White', hex: 'ffffff' },
            ].map((c) => (
              <button
                key={c.hex}
                onClick={() => setColor(c.hex)}
                className={`w-5 h-5 rounded-full border-2 transition ${
                  color === c.hex ? 'border-white scale-110' : 'border-transparent opacity-60'
                }`}
                style={{ backgroundColor: `#${c.hex}` }}
                title={c.label}
              />
            ))}
          </div>
        </div>

        {/* Target URL */}
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Destination URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono outline-none focus:border-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy URL'}</span>
          </button>
          <a
            href={qrImageUrl}
            download="harshzynx_qrcode.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open Image</span>
          </a>
        </div>
      </div>
    </div>
  );
};
