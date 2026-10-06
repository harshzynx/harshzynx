import React from 'react';
import { Compass, MapPin, Calendar, ExternalLink } from 'lucide-react';
import type { LifeTravelEntry } from '../types/index.ts';

export const LifeTravelSection: React.FC<{ lifeTravel: LifeTravelEntry[] }> = ({ lifeTravel }) => {
  if (lifeTravel.length === 0) return null;

  return (
    <section id="travel" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            17. Life, Places & Exploration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Life & Travel Dispatch
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Real documented journeys, campus visits, conferences, and personal inspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lifeTravel.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden flex flex-col justify-between space-y-4 p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.place}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>

                {item.photos && item.photos.length > 0 && (
                  <div className="rounded-xl overflow-hidden aspect-video border border-slate-800 bg-slate-950">
                    <img
                      src={item.photos[0]}
                      alt={item.place}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {item.story && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                    &ldquo;{item.story}&rdquo;
                  </p>
                )}
              </div>

              {item.link && (
                <div className="pt-3 border-t border-slate-800/60">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>View More / External</span>
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
