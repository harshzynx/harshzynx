import React from 'react';
import { Bell, X, Megaphone, FolderGit2, Smartphone, Newspaper, Check } from 'lucide-react';
import type { PublicDataResponse } from '../lib/api.ts';

export const NotificationCenterModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: PublicDataResponse;
}> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const notifications = [
    ...data.announcements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      type: 'announcement',
      link: a.link,
      icon: <Megaphone className="w-4 h-4 text-blue-400" />,
    })),
    ...data.projects.slice(0, 2).map((p) => ({
      id: p.id,
      title: `Project: ${p.name}`,
      description: p.shortDescription,
      type: 'project',
      link: '#projects',
      icon: <FolderGit2 className="w-4 h-4 text-indigo-400" />,
    })),
    ...data.apps.slice(0, 1).map((a) => ({
      id: a.id,
      title: `Android App: ${a.name}`,
      description: a.description,
      type: 'app',
      link: '#apps',
      icon: <Smartphone className="w-4 h-4 text-cyan-400" />,
    })),
    ...data.blogPosts.slice(0, 1).map((b) => ({
      id: b.id,
      title: `Article: ${b.title}`,
      description: b.excerpt,
      type: 'article',
      link: '#blog',
      icon: <Newspaper className="w-4 h-4 text-purple-400" />,
    })),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-14 flex flex-col max-h-[80vh] text-slate-100 animate-fade-in">
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Notification Center</h3>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-bold">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 pt-3 flex items-start gap-3 hover:bg-slate-800/40 rounded-xl transition">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                {n.icon}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-xs font-bold text-white">{n.title}</h4>
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{n.description}</p>
                {n.link && (
                  <a
                    href={n.link}
                    onClick={onClose}
                    className="inline-block text-[11px] font-semibold text-blue-400 hover:underline pt-0.5"
                  >
                    View Details →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
