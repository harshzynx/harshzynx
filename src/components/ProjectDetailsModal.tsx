import React from 'react';
import { X, ExternalLink, Github, Video, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import type { Project } from '../types/index.ts';

export const ProjectDetailsModal: React.FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col text-slate-100">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-slate-900/95 border-b border-slate-800 backdrop-blur-sm">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold">{project.category}</span>
            <h3 className="text-xl font-bold text-white mt-0.5">{project.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Hero Image */}
          {project.image && (
            <div className="rounded-xl overflow-hidden border border-slate-800 max-h-80 bg-slate-950">
              <img
                src={project.image}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveDemoUrl && (
              <a
                href={project.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>Video Walkthrough</span>
              </a>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Technologies Used</h4>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 font-mono text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Project Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {project.detailedDescription || project.shortDescription}
            </p>
          </div>

          {/* Problem & Solution Case Study */}
          {(project.problem || project.solution) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.problem && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Problem Statement</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <Lightbulb className="w-4 h-4" />
                    <span>Engineered Solution</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{project.solution}</p>
                </div>
              )}
            </div>
          )}

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Key Features & Architecture</h4>
              <ul className="space-y-2">
                {project.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery screenshots */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Gallery Screenshots</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-slate-800">
                    <img
                      src={imgUrl}
                      alt={`${project.name} screenshot ${idx + 1}`}
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
