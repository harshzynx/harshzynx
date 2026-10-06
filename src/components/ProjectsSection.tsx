import React, { useState, useMemo } from 'react';
import { ExternalLink, Github, FolderGit2, ArrowRight } from 'lucide-react';
import type { Project } from '../types/index.ts';
import { ProjectDetailsModal } from './ProjectDetailsModal.tsx';
import { api } from '../lib/api.ts';

export const ProjectsSection: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(projects.map((p) => p.category))];
    return cats;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    api.recordAnalytics('project_view', `/projects/${project.slug}`, project.id);
  };

  return (
    <section id="projects" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              04. Portfolio Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Production web applications, native Android utilities, and applied data solutions.
            </p>
          </div>

          {/* Category Tabs */}
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

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <FolderGit2 className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No projects added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col justify-between rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Project Image */}
                <div
                  className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => handleOpenProject(project)}
                >
                  <img
                    src={project.image || '/src/assets/images/harsh_developer_portrait_1791264967532.jpg'}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 left-3 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-slate-300">
                    {project.status}
                  </div>
                </div>

                {/* Content Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Unboxed Metadata per frontend-design */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <span>{project.category}</span>
                      {project.startDate && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{project.startDate}</span>
                        </>
                      )}
                    </div>

                    <h3
                      onClick={() => handleOpenProject(project)}
                      className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      {project.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/60">
                      {project.technologies.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-850 bg-slate-800/80 text-[11px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[11px] text-slate-500 self-center">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links / Details trigger */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
                    <button
                      onClick={() => handleOpenProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>Case Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                          title="Open Live Demonstration"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <ProjectDetailsModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
};
