import React, { useState, useMemo } from 'react';
import { ExternalLink, Link as LinkIcon, ArrowUpRight } from 'lucide-react';
import type { CustomLink } from '../types/index.ts';
import { api } from '../lib/api.ts';

export const CustomLinksSection: React.FC<{ links: CustomLink[] }> = ({ links }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(links.map((l) => l.category).filter(Boolean))];
    return cats;
  }, [links]);

  const filteredLinks = useMemo(() => {
    if (selectedCategory === 'All') return links;
    return links.filter((l) => l.category === selectedCategory);
  }, [links, selectedCategory]);

  const handleLinkClick = (link: CustomLink) => {
    api.recordAnalytics('link_click', `/links/${link.title}`, link.id);
  };

  return (
    <section id="links" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              06. Hub & Quick Access
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Custom Links & Portals
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Direct access to live repositories, developer tools, community channels, and verified profiles.
            </p>
          </div>

          {/* Filter Categories */}
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

        {filteredLinks.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <LinkIcon className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No links added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.openInNewTab ? '_blank' : '_self'}
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link)}
                className="group p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-blue-500/50 hover:bg-slate-900/90 transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono text-slate-500">{link.category || 'Link'}</span>
                    </div>

                    {link.badge && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-950/50 border border-blue-800/50 text-blue-300">
                        {link.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {link.title}
                  </h3>

                  {link.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {link.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>{link.buttonText || 'Open Link'}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
