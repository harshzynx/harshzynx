import React from 'react';
import { ArrowUp, Github, Linkedin, Twitter, Instagram, Youtube, Mail, Lock } from 'lucide-react';
import type { SocialLink, WebsiteSettings } from '../types/index.ts';

interface FooterProps {
  settings?: WebsiteSettings;
  socialLinks?: SocialLink[];
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, socialLinks = [], onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-4 h-4" />;
    if (p.includes('link')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('twit') || p === 'x') return <Twitter className="w-4 h-4" />;
    if (p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('you')) return <Youtube className="w-4 h-4" />;
    return <Mail className="w-4 h-4" />;
  };

  const footerText = settings?.footerText || 'HARSHZYNX — All Rights Reserved';

  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/70 text-slate-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold text-white tracking-wider">HARSHZYNX</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Harsh Raj — Developer, Android builder, and Data Science learner.
            </p>
          </div>

          {/* Social Icons from DB */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 transition-colors"
                title={`${s.platform} (@${s.username})`}
                aria-label={`Open Harsh Raj's ${s.platform}`}
              >
                {getSocialIcon(s.platform)}
              </a>
            ))}
          </div>

          {/* Actions & Back to top */}
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-md bg-slate-900 border border-slate-800"
              aria-label="Scroll back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenAdmin}
              className="p-1.5 rounded text-slate-500 hover:text-slate-300 transition-colors"
              title="Admin CMS Access"
              aria-label="Admin CMS"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{footerText}</p>
          <div className="flex items-center gap-4">
            <a href="#about" className="hover:text-slate-400 transition-colors">About</a>
            <span aria-hidden="true">·</span>
            <a href="#projects" className="hover:text-slate-400 transition-colors">Projects</a>
            <span aria-hidden="true">·</span>
            <a href="#contact" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
