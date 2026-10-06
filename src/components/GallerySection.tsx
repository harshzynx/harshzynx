import React, { useState, useMemo } from 'react';
import { Image as ImageIcon, X, Calendar } from 'lucide-react';
import type { GalleryItem } from '../types/index.ts';

export const GallerySection: React.FC<{ gallery: GalleryItem[] }> = ({ gallery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gallery.map((g) => g.category).filter(Boolean))];
    return cats;
  }, [gallery]);

  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return gallery;
    return gallery.filter((g) => g.category === selectedCategory);
  }, [gallery, selectedCategory]);

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              13. Visual Documentation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Photo Gallery
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Moments from university hackathons, workspace setups, and community events.
            </p>
          </div>

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

        {filteredPhotos.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <ImageIcon className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No photos added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-800/80 cursor-pointer"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                  <p className="text-xs font-bold leading-snug">{photo.title}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-300 font-mono mt-1">
                    <span>{photo.category}</span>
                    {photo.date && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span>{photo.date}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-blue-400">{activePhoto.category}</span>
                  {activePhoto.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {activePhoto.date}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[65vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {activePhoto.description && (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {activePhoto.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
