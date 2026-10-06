import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FolderGit2, Cpu, BookOpen, Smartphone, Link as LinkIcon, Award, ArrowUpRight } from 'lucide-react';
import type { PublicDataResponse } from '../lib/api.ts';

interface SearchResult {
  type: 'project' | 'skill' | 'blog' | 'app' | 'link' | 'certificate';
  title: string;
  subtitle: string;
  href?: string;
  onClick?: () => void;
}

export const GlobalSearchModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: PublicDataResponse | null;
  onSelectProject?: (slug: string) => void;
  onSelectBlog?: (slug: string) => void;
}> = ({ isOpen, onClose, data, onSelectProject, onSelectBlog }) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo<SearchResult[]>(() => {
    if (!data || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const list: SearchResult[] = [];

    // Projects
    data.projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q))) {
        list.push({
          type: 'project',
          title: p.name,
          subtitle: p.technologies.join(', '),
          onClick: () => {
            onClose();
            if (onSelectProject) onSelectProject(p.slug);
            else window.location.hash = '#projects';
          },
        });
      }
    });

    // Skills
    data.skills.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) {
        list.push({
          type: 'skill',
          title: s.name,
          subtitle: `${s.category} · ${s.level}% proficiency`,
          onClick: () => {
            onClose();
            window.location.hash = '#skills';
          },
        });
      }
    });

    // Blog
    data.blogPosts.forEach((b) => {
      if (b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)) {
        list.push({
          type: 'blog',
          title: b.title,
          subtitle: `${b.category} · ${b.date}`,
          onClick: () => {
            onClose();
            if (onSelectBlog) onSelectBlog(b.slug);
            else window.location.hash = '#blog';
          },
        });
      }
    });

    // Apps
    data.apps.forEach((a) => {
      if (a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q)) {
        list.push({
          type: 'app',
          title: a.name,
          subtitle: `Android Application · ${a.status}`,
          onClick: () => {
            onClose();
            window.location.hash = '#apps';
          },
        });
      }
    });

    // Custom Links
    data.customLinks.forEach((l) => {
      if (l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
        list.push({
          type: 'link',
          title: l.title,
          subtitle: l.category || 'Link',
          href: l.url,
          onClick: () => {
            onClose();
            window.open(l.url, l.openInNewTab ? '_blank' : '_self');
          },
        });
      }
    });

    // Certificates
    data.certificates.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)) {
        list.push({
          type: 'certificate',
          title: c.name,
          subtitle: `${c.issuer} · ${c.issueDate}`,
          onClick: () => {
            onClose();
            window.location.hash = '#certificates';
          },
        });
      }
    });

    return list.slice(0, 12);
  }, [data, query, onClose, onSelectProject, onSelectBlog]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-blue-400" />;
      case 'skill':
        return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'blog':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'app':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'link':
        return <LinkIcon className="w-4 h-4 text-amber-400" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills, articles, apps, links..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-500"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-800/40">
          {!query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Type keywords to search across projects, technical skills, articles, or apps...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No results found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={res.onClick}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-800/70 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-800 border border-slate-700/50">
                    {getIcon(res.type)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate max-w-md">{res.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 group-hover:text-slate-300">
                  <span className="capitalize">{res.type}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Navigate with mouse or touch</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
