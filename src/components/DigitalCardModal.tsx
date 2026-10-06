import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, QrCode, ExternalLink, Mail, Github, Linkedin, Twitter, Instagram, Youtube, Sparkles } from 'lucide-react';
import type { Profile, SocialLink, ResumeEntry } from '../types/index.ts';

// Lightweight pure JS QR matrix generator or clean SVG QR representation
function generateQRCodeSvg(url: string): string {
  // SVG encoded QR code pattern container pointing to real digital card URL
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=0a0f1d&color=60a5fa&margin=2`;
}

export const DigitalCardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  socialLinks: SocialLink[];
  activeResume?: ResumeEntry | null;
}> = ({ isOpen, onClose, profile, socialLinks, activeResume }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/#card` : 'https://harshzynx.dev/#card';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HARSHZYNX — Harsh Raj Digital Card`,
          text: `${profile.name} (${profile.brandName}) — ${profile.tagline}`,
          url: currentUrl,
        });
        return;
      } catch {
        // user cancelled or fallback
      }
    }
    handleCopy();
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
N:Raj;Harsh;;;
ORG:HARSHZYNX
TITLE:Software Developer & Android Engineer
EMAIL;TYPE=INTERNET,HOME:${profile.email}
URL:${currentUrl}
NOTE:${profile.tagline}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Harsh_Raj_HARSHZYNX.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPlatformIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('git')) return <Github className="w-4 h-4" />;
    if (p.includes('link')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('twit') || p === 'x') return <Twitter className="w-4 h-4" />;
    if (p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('you')) return <Youtube className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col text-slate-100">
        {/* Top Header Controls */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-1.5 text-xs font-mono text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Brand Card</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQR(!showQR)}
              className={`p-1.5 rounded-lg transition-colors ${
                showQR ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Share Card"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-6 space-y-6 text-center">
          {showQR ? (
            /* QR Code Display Mode */
            <div className="py-4 space-y-4 animate-fade-in">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 inline-block shadow-inner">
                <img
                  src={generateQRCodeSvg(currentUrl)}
                  alt="HARSHZYNX Digital Card QR Code"
                  className="w-48 h-48 rounded-lg mx-auto"
                />
              </div>
              <div>
                <p className="text-xs font-mono text-slate-400">Scan to open digital card on mobile</p>
                <p className="text-[11px] text-blue-400 font-mono mt-1 break-all">{currentUrl}</p>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Return to Card Profile
              </button>
            </div>
          ) : (
            /* Standard Digital Card Mode */
            <>
              {/* Avatar and Name */}
              <div className="space-y-3">
                <div className="relative w-28 h-28 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400 shadow-xl shadow-blue-600/20">
                  <img
                    src={profile.avatarUrl || '/src/assets/images/harsh_developer_portrait_1791264967532.jpg'}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{profile.name}</h2>
                  <p className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase mt-0.5">
                    {profile.brandName || 'HARSHZYNX'}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                    {profile.tagline}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={downloadVCard}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Contact (vCard)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>Send Email</span>
                  </a>

                  {activeResume?.fileUrl ? (
                    <a
                      href={activeResume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-blue-400" />
                      <span>Resume</span>
                    </a>
                  ) : (
                    <a
                      href="#projects"
                      onClick={onClose}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                      <span>Projects</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Verified Social Channels */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  Verified Channels
                </span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {socialLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/60 text-xs text-slate-300 hover:text-white transition-colors"
                    >
                      <span className="text-blue-400">{getPlatformIcon(s.platform)}</span>
                      <span className="truncate font-medium">{s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Copy & Share Quick Bar */}
              <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
                <span aria-hidden="true">·</span>
                <button
                  onClick={() => setShowQR(true)}
                  className="flex items-center gap-1 hover:text-white transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-400" />
                  <span>Show QR Code</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
