import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import type { Achievement } from '../types/index.ts';

export const AchievementsSection: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            08. Honors & Competitions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Achievements
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Verified milestones, competition highlights, and academic recognitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span>{item.organization}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 font-mono text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {item.link && (
                <div className="pt-3 border-t border-slate-800/60">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Verification / Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
