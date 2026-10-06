import React, { useState } from 'react';
import { Play, Youtube, X } from 'lucide-react';
import type { YouTubeVideo } from '../types/index.ts';

export const YouTubeSection: React.FC<{ videos: YouTubeVideo[] }> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  if (videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('embed/')) return url;
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtu.be')) {
        return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
      }
      const v = urlObj.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    } catch {
      // fallback
    }
    return url;
  };

  return (
    <section id="videos" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            10. Media & Engineering Content
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            YouTube & Videos
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Tech breakdowns, tutorial highlights, and architecture overviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div
              key={vid.id}
              className="group rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
            >
              <div
                className="relative aspect-video bg-slate-950 cursor-pointer overflow-hidden"
                onClick={() => setActiveVideo(vid)}
              >
                <img
                  src={vid.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="p-3 rounded-full bg-rose-600 text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span>{vid.category}</span>
                  {vid.date && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{vid.date}</span>
                    </>
                  )}
                </div>
                <h3
                  onClick={() => setActiveVideo(vid)}
                  className="text-base font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer line-clamp-2"
                >
                  {vid.title}
                </h3>
                {vid.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl space-y-4 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-semibold text-white truncate max-w-md">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
              <iframe
                src={`${getEmbedUrl(activeVideo.youtubeUrl)}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
