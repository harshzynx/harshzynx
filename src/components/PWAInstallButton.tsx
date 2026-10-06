import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={
          compact
            ? 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800/60 rounded-md transition-colors whitespace-nowrap'
            : 'flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-colors whitespace-nowrap'
        }
        title="Install HARSHZYNX App"
        aria-label="Install HARSHZYNX Progressive Web App"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
          title="Install on iOS Safari"
          aria-label="Install on iOS"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-semibold text-white">Install on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                1. Tap the <span className="font-semibold text-blue-400">Share</span> icon in your Safari toolbar.<br />
                2. Scroll down and choose <span className="font-semibold text-blue-400">Add to Home Screen</span>.<br />
                3. Tap <span className="font-semibold text-blue-400">Add</span> to install HARSHZYNX to your device.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
