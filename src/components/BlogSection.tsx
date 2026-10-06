import React, { useState, useMemo } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import type { BlogPost } from '../types/index.ts';
import { BlogPostModal } from './BlogPostModal.tsx';

export const BlogSection: React.FC<{ posts: BlogPost[] }> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(posts.map((p) => p.category).filter(Boolean))];
    return cats;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return posts;
    return posts.filter((p) => p.category === selectedCategory);
  }, [posts, selectedCategory]);

  return (
    <section id="blog" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              12. Written Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Blog & Articles
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Thoughts on software engineering, Android development paradigms, and data science.
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

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => setActivePost(post)}
                className="group p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                    <span className="text-blue-400 font-semibold">{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTimeMinutes || 3}m
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <BlogPostModal
        post={activePost}
        onClose={() => setActivePost(null)}
      />
    </section>
  );
};
