import React, { useState, useMemo } from 'react';
import { ExternalLink, Calendar, Milestone } from 'lucide-react';
import type { TimelineEntry } from '../types/index.ts';

export const JourneySection: React.FC<{ timeline: TimelineEntry[] }> = ({ timeline }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(timeline.map((t) => t.category))];
    return cats;
  }, [timeline]);

  const filteredEntries = useMemo(() => {
    if (selectedCategory === 'All') return timeline;
    return timeline.filter((t) => t.category === selectedCategory);
  }, [timeline, selectedCategory]);

  return (
    <section id="journey" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              02. Timeline & Milestones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Personal Journey
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Chronological evolution of projects, learning milestones, and academic progress.
            </p>
          </div>

          {/* Category Filter Tabs */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <Milestone className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No timeline entries found in this category.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-800 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-10">
            {filteredEntries.map((item) => (
              <div key={item.id} className="relative group">
                {/* Node Dot */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 h-4 w-4 rounded-full bg-slate-900 border-2 border-blue-500 group-hover:scale-125 transition-transform" />

                <div className="p-5 sm:p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.year}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-slate-400">{item.category}</span>
                    </div>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {item.image && (
                    <div className="mt-3 rounded-lg overflow-hidden max-w-sm border border-slate-800">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-auto object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
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
