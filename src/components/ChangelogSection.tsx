import React from 'react';
import { GitCommit, Sparkles, Wrench, AlertTriangle, Calendar } from 'lucide-react';
import type { ChangelogEntry } from '../types/index.ts';

export const ChangelogSection: React.FC<{ changelog: ChangelogEntry[] }> = ({ changelog }) => {
  if (changelog.length === 0) return null;

  return (
    <section id="changelog" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            16. Platform Evolution
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            System Changelog
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Live record of iterative features, backend enhancements, and architectural upgrades.
          </p>
        </div>

        <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-12">
          {changelog.map((entry) => (
            <div key={entry.id} className="relative group space-y-4">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-slate-900 border-2 border-blue-500" />

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-white font-mono bg-blue-950/80 border border-blue-800/60 px-2.5 py-0.5 rounded-lg text-blue-300">
                      v{entry.version}
                    </span>
                    <h3 className="text-base font-bold text-white">{entry.title}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{entry.date}</span>
                  </div>
                </div>

                {/* Features */}
                {entry.features && entry.features.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400 uppercase font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>New Features</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-slate-300">
                      {entry.features.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {entry.improvements && entry.improvements.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 uppercase font-semibold">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Improvements</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-slate-300">
                      {entry.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes */}
                {entry.fixes && entry.fixes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase font-semibold">
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Fixes</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-xs sm:text-sm text-slate-300">
                      {entry.fixes.map((fix, i) => (
                        <li key={i}>{fix}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
