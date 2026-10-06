import React from 'react';
import { Smartphone, ExternalLink, Play } from 'lucide-react';
import type { AppEntry } from '../types/index.ts';
import { api } from '../lib/api.ts';

export const AppsSection: React.FC<{ apps: AppEntry[] }> = ({ apps }) => {
  const handleAppClick = (app: AppEntry) => {
    api.recordAnalytics('app_click', `/apps/${app.name}`, app.id);
  };

  return (
    <section id="apps" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            05. Android Ecosystem
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Mobile Applications
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Native Android applications developed with Kotlin, Jetpack Compose, and clean architecture.
          </p>
        </div>

        {apps.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <Smartphone className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No apps added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <div
                key={app.id}
                className="rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">
                      {app.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">{app.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                      <span>{app.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>v{app.version}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {app.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  {app.playStoreUrl ? (
                    <a
                      href={app.playStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAppClick(app)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Open Google Play</span>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono italic">
                      Play Store link coming soon
                    </span>
                  )}

                  {app.otherStoreUrl && (
                    <a
                      href={app.otherStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400"
                    >
                      <span>Alt Store</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
