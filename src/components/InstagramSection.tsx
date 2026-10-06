import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import type { InstagramPost } from '../types/index.ts';

export const InstagramSection: React.FC<{ posts: InstagramPost[] }> = ({ posts }) => {
  if (posts.length === 0) return null;

  return (
    <section id="instagram" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              11. Social Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Instagram Feed
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Curated glimpses into developer life, tech gear, coding milestones, and campus moments.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-colors"
          >
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>Follow @harshzynx</span>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 block"
            >
              <img
                src={post.image}
                alt={post.caption || 'Instagram Post'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between text-white">
                <span className="text-[11px] font-mono text-slate-300">{post.date}</span>
                <p className="text-xs line-clamp-3 leading-relaxed">{post.caption}</p>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-pink-400">
                  <span>View on Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
