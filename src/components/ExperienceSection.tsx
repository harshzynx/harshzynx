import React from 'react';
import { Briefcase, Calendar, ExternalLink } from 'lucide-react';
import type { Experience } from '../types/index.ts';

export const ExperienceSection: React.FC<{ experience: Experience[] }> = ({ experience }) => {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            07. Work & Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Experience & Engagement
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Professional development engagements, freelance engineering, and collaborative projects.
          </p>
        </div>

        <div className="space-y-6">
          {experience.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white">{exp.role}</h3>
                  <div className="flex items-center gap-2 text-sm text-blue-400 font-medium mt-0.5">
                    <span>{exp.organization}</span>
                    {exp.link && (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate || 'Finished'}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {exp.description}
              </p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                  {exp.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
