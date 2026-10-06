import React, { useState, useMemo } from 'react';
import { Cpu, Code, Smartphone, Terminal, Layers, Server, BarChart3, Palette, Database, GitBranch, Wrench } from 'lucide-react';
import type { Skill } from '../types/index.ts';

export const SkillsSection: React.FC<{ skills: Skill[] }> = ({ skills }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(skills.map((s) => s.category))];
    return cats;
  }, [skills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  const getSkillIcon = (name: string, category: string) => {
    const str = `${name} ${category}`.toLowerCase();
    if (str.includes('script') || str.includes('python') || str.includes('java')) return <Code className="w-4 h-4 text-blue-400" />;
    if (str.includes('android') || str.includes('mobile')) return <Smartphone className="w-4 h-4 text-cyan-400" />;
    if (str.includes('react') || str.includes('web') || str.includes('css')) return <Layers className="w-4 h-4 text-indigo-400" />;
    if (str.includes('node') || str.includes('server')) return <Server className="w-4 h-4 text-emerald-400" />;
    if (str.includes('data') || str.includes('machine') || str.includes('chart')) return <BarChart3 className="w-4 h-4 text-purple-400" />;
    if (str.includes('database') || str.includes('sql')) return <Database className="w-4 h-4 text-amber-400" />;
    if (str.includes('git')) return <GitBranch className="w-4 h-4 text-rose-400" />;
    return <Cpu className="w-4 h-4 text-slate-400" />;
  };

  return (
    <section id="skills" className="py-20 border-t border-slate-800/80 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
              03. Technical Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Skills & Expertise
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Core technologies, programming languages, and specialized development frameworks.
            </p>
          </div>

          {/* Category Filter Tabs */}
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
        {filteredSkills.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
            <Wrench className="w-8 h-8 mx-auto mb-3 text-slate-600" />
            <p>No skills added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 sm:p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                      {getSkillIcon(skill.name, skill.category)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                      <p className="text-xs text-slate-500">{skill.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-blue-400 tabular-nums font-semibold">
                    {skill.level}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, skill.level))}%` }}
                  />
                </div>

                {skill.description && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {skill.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
