import React from 'react';
import { ArrowRight, Download, Mail, User, Github, Linkedin, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';
import type { Profile, SocialLink, ResumeEntry, WebsiteSettings } from '../types/index.ts';

interface HeroSectionProps {
  profile: Profile;
  socialLinks: SocialLink[];
  activeResume?: ResumeEntry | null;
  onOpenCard?: () => void;
  settings?: WebsiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, socialLinks, activeResume, onOpenCard, settings }) => {
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-4 h-4" />;
    if (p.includes('link')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('twit') || p === 'x') return <Twitter className="w-4 h-4" />;
    if (p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('you')) return <Youtube className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-indigo-600/10 blur-[110px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Status indicator */}
            {profile.status && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-800/40 text-xs font-medium text-blue-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span>{profile.status}</span>
              </div>
            )}

            {/* Brand and Personal Name */}
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-semibold block mb-2">
                {profile.brandName || settings?.logoText || 'HARSHZYNX'}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {settings?.heroTitle || profile.name || 'Harsh Raj'}
              </h1>
            </div>

            {/* Tagline */}
            <p className="text-lg sm:text-xl font-medium text-blue-300/90 leading-snug">
              {settings?.heroDescription || profile.tagline || 'Developer · Android & Web Architect · Data Science Learner'}
            </p>

            {/* Introduction */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
              {profile.intro}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>About Me</span>
              </a>

              {activeResume?.fileUrl ? (
                <a
                  href={activeResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Resume</span>
                </a>
              ) : (
                <a
                  href="#resume"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>Resume</span>
                </a>
              )}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs sm:text-sm font-medium transition-colors"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Dynamic Social Links from DB */}
            <div className="pt-4 border-t border-slate-800/60 w-full flex items-center gap-3">
              <span className="text-xs text-slate-500 font-mono">Connect:</span>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800 transition-colors"
                    title={`${s.platform} (@${s.username})`}
                    aria-label={`Open ${s.platform}`}
                  >
                    {getSocialIcon(s.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Image Presentation */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Outer decorative ring */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600/40 via-indigo-600/20 to-blue-500/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Main Card Frame */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-2 overflow-hidden shadow-2xl max-w-sm sm:max-w-md">
                <div className="relative aspect-square w-72 sm:w-80 md:w-96 rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={profile.avatarUrl || '/src/assets/images/harsh_developer_portrait_1791264967532.jpg'}
                    alt={profile.name || 'Harsh Raj'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback container
                      (e.currentTarget as HTMLImageElement).src = '/src/assets/images/harsh_developer_portrait_1791264967532.jpg';
                    }}
                  />
                  {/* Subtle contrast scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Overlay identity badge */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <p className="text-sm font-bold tracking-tight">{profile.name}</p>
                      <p className="text-[11px] text-blue-300 font-mono tracking-wider">HARSHZYNX</p>
                    </div>
                    {onOpenCard && (
                      <button
                        onClick={onOpenCard}
                        className="text-xs px-2.5 py-1 rounded-md bg-blue-600/90 hover:bg-blue-600 text-white font-medium shadow-sm transition-colors"
                      >
                        Digital Card
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
