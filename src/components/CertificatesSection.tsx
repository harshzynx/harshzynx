import React, { useState } from 'react';
import { Award, ExternalLink, Calendar, FileText, X } from 'lucide-react';
import type { Certificate } from '../types/index.ts';

export const CertificatesSection: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => {
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-20 border-t border-slate-800/80 bg-slate-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            09. Certifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Certificates & Credentials
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Verified course completions, specialized credentials, and technical assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {cert.issueDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{cert.name}</h3>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">{cert.issuer}</p>
                </div>

                {cert.description && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {cert.credentialId && (
                  <div className="text-[11px] font-mono text-slate-500">
                    ID: <span className="text-slate-400">{cert.credentialId}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {cert.image && (
                  <button
                    onClick={() => setActiveCert(cert)}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{activeCert.name}</h3>
                <p className="text-xs text-slate-400">{activeCert.issuer}</p>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {activeCert.image && (
              <div className="rounded-lg overflow-hidden border border-slate-800">
                <img
                  src={activeCert.image}
                  alt={activeCert.name}
                  className="w-full h-auto object-contain max-h-[60vh]"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
