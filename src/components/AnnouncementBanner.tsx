import React, { useState } from 'react';
import { ArrowRight, X, Megaphone } from 'lucide-react';
import type { Announcement } from '../types/index.ts';

export const AnnouncementBanner: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [dismissed, setDismissed] = useState(false);

  const activeAnnouncement = announcements.find((a) => a.active);
  if (!activeAnnouncement || dismissed) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-900/90 via-blue-800/80 to-indigo-900/90 text-white text-xs py-2.5 px-4 border-b border-blue-700/40 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/30 text-blue-300">
            <Megaphone className="h-3 w-3" />
          </span>
          <p className="truncate font-medium text-slate-100">
            <span className="font-semibold text-white mr-1.5">{activeAnnouncement.title}</span>
            <span className="hidden sm:inline text-slate-300">— {activeAnnouncement.description}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {activeAnnouncement.link && (
            <a
              href={activeAnnouncement.link}
              className="inline-flex items-center gap-1 font-semibold text-blue-200 hover:text-white underline decoration-blue-400 underline-offset-2 transition-colors whitespace-nowrap"
            >
              <span>{activeAnnouncement.buttonText || 'Learn More'}</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="rounded p-1 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
