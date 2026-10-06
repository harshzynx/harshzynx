import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import { api } from '../lib/api.ts';
import type { Profile, WebsiteSettings } from '../types/index.ts';

export const ContactSection: React.FC<{
  profile: Profile;
  settings?: WebsiteSettings;
}> = ({ profile, settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.submitContact({
        name,
        email,
        message,
        website: honeypot, // Honeypot
      });
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'Failed to transmit message. Please try again or use direct mailto.');
    } finally {
      setLoading(false);
    }
  };

  const contactEmail = settings?.contactEmail || profile.email || 'harshsharma18089@gmail.com';

  return (
    <section id="contact" className="py-20 border-t border-slate-800/80 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            15. Direct Communication
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Get in Touch
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Have a project in mind, an engineering role, or a technical question? Send a message directly to my inbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Direct Channel</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Messages submitted through this form are securely stored in the administrative database and reviewed by Harsh Raj.
              </p>

              <div className="space-y-3 pt-2 border-t border-slate-800/60">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block uppercase">Email</span>
                    <a href={`mailto:${contactEmail}`} className="hover:text-blue-400 font-medium">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                {profile.location && (
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono text-slate-500 block uppercase">Location</span>
                      <span>{profile.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl">
              {success ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Message Transmitted!</h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Thank you. Your message has been saved to the administrative inbox and I will respond to you shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-slate-800 rounded-lg transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-lg bg-rose-950/50 border border-rose-800/50 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Honeypot field hidden from users */}
                  <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Sharma"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share project specifications, internship inquiry, or questions..."
                      className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/25 transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
