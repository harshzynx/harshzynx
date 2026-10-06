import React from 'react';
import { Wrench, Lock, ArrowRight } from 'lucide-react';

export const MaintenanceScreen: React.FC<{ onOpenAdmin: () => void }> = ({ onOpenAdmin }) => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/60 text-blue-400 flex items-center justify-center mx-auto shadow-xl shadow-blue-900/20">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
            System Upgrades in Progress
          </span>
          <h1 className="text-3xl font-black text-white tracking-tight">
            HARSHZYNX is Under Maintenance
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The platform is undergoing scheduled architecture and content updates. Please check back shortly or connect directly via social channels.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
          <a
            href="mailto:harshsharma18089@gmail.com"
            className="text-xs text-blue-400 hover:underline"
          >
            harshsharma18089@gmail.com
          </a>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 py-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Owner Admin Access</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
