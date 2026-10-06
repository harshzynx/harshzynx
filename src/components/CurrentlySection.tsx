import React from 'react';
import { BookOpen, Hammer, Focus, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Currently } from '../types/index.ts';

export const CurrentlySection: React.FC<{ currently: Currently }> = ({ currently }) => {
  if (!currently.learning && !currently.building && !currently.focus) return null;

  const items = [
    {
      label: 'Currently Learning',
      value: currently.learning,
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      accent: 'border-emerald-500/20 bg-emerald-950/10',
    },
    {
      label: 'Currently Building',
      value: currently.building,
      icon: <Hammer className="w-4 h-4 text-blue-400" />,
      accent: 'border-blue-500/20 bg-blue-950/10',
    },
    {
      label: 'Current Technical Focus',
      value: currently.focus,
      icon: <Focus className="w-4 h-4 text-purple-400" />,
      accent: 'border-purple-500/20 bg-purple-950/10',
    },
    {
      label: 'Availability',
      value: currently.availability,
      icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
      accent: 'border-cyan-500/20 bg-cyan-950/10',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Now / Real-Time Status
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${item.accent} transition-all`}
            >
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 leading-snug">
                {item.value || 'Ongoing engineering exploration'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
