import React from 'react';
import { FileText, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import type { ResumeEntry } from '../types/index.ts';
import { api } from '../lib/api.ts';

export const ResumeSection: React.FC<{ resume: ResumeEntry | null }> = ({ resume }) => {
  const handleDownload = () => {
    if (resume) {
      api.recordAnalytics('resume_download', '/resume', resume.id);
    }
  };

  return (
    <section id="resume" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            14. Credentials & Curriculum Vitae
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            Official Resume
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
            Verified technical competencies, project portfolio, education, and career track.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/40 text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {resume?.title || 'Harsh Raj — Software Engineering Resume'}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                  <span>Version {resume?.version || '2026.1'}</span>
                  {resume?.uploadDate && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {resume.uploadDate}
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Active
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Updated with recent Android implementations, full-stack applications, and foundational data science projects.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {resume?.fileUrl ? (
              <>
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>View in Browser</span>
                </a>
                <a
                  href={resume.fileUrl}
                  download
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              </>
            ) : (
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-md transition-colors"
              >
                <span>Request Resume Directly</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
