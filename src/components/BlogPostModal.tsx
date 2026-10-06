import React from 'react';
import { X, Calendar, Clock, Share2, Check } from 'lucide-react';
import type { BlogPost } from '../types/index.ts';

export const BlogPostModal: React.FC<{
  post: BlogPost | null;
  onClose: () => void;
}> = ({ post, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!post) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/#blog-${post.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url,
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-100">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share Article"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-3 pt-3 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {post.readTimeMinutes || 3} min read
              </span>
              <span>By {post.author || 'Harsh Raj'}</span>
            </div>
          </div>

          <div className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 font-sans">
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 text-xs font-mono text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
