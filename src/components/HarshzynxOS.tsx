import React, { useState, useEffect } from 'react';
import {
  X, Minus, Square, Terminal as TerminalIcon, FolderGit2, Smartphone, Cpu,
  User, FileText, Newspaper, Mail, Settings, Globe, Sparkles, Power,
  ExternalLink, ArrowRight, Clock
} from 'lucide-react';
import type { PublicDataResponse } from '../lib/api.ts';

interface WindowState {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export const HarshzynxOS: React.FC<{
  data: PublicDataResponse;
  onExitOS: () => void;
  onOpenCard: () => void;
  onOpenAI: () => void;
}> = ({ data, onExitOS, onOpenCard, onOpenAI }) => {
  const [activeWindow, setActiveWindow] = useState<string>('terminal');
  const [maxZ, setMaxZ] = useState(10);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: 'HARSHZYNX OS v2.6.0 [Interactive Kernel Initialized]' },
    { type: 'output', text: 'Type "help" for a list of available commands.' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  const [windows, setWindows] = useState<Record<string, WindowState>>({
    terminal: { id: 'terminal', title: 'harsh@kernel:~', icon: <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />, isOpen: true, isMinimized: false, zIndex: 1 },
    about: { id: 'about', title: 'About Harsh Raj', icon: <User className="w-3.5 h-3.5 text-blue-400" />, isOpen: false, isMinimized: false, zIndex: 2 },
    projects: { id: 'projects', title: 'Projects Explorer', icon: <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />, isOpen: false, isMinimized: false, zIndex: 3 },
    apps: { id: 'apps', title: 'Android App Store', icon: <Smartphone className="w-3.5 h-3.5 text-cyan-400" />, isOpen: false, isMinimized: false, zIndex: 4 },
    skills: { id: 'skills', title: 'Tech Capabilities Matrix', icon: <Cpu className="w-3.5 h-3.5 text-purple-400" />, isOpen: false, isMinimized: false, zIndex: 5 },
    resume: { id: 'resume', title: 'Official Resume', icon: <FileText className="w-3.5 h-3.5 text-rose-400" />, isOpen: false, isMinimized: false, zIndex: 6 },
    blog: { id: 'blog', title: 'Written Articles', icon: <Newspaper className="w-3.5 h-3.5 text-amber-400" />, isOpen: false, isMinimized: false, zIndex: 7 },
    contact: { id: 'contact', title: 'Direct Channel & Mail', icon: <Mail className="w-3.5 h-3.5 text-pink-400" />, isOpen: false, isMinimized: false, zIndex: 8 },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const openWindow = (id: string) => {
    const nextZ = maxZ + 1;
    setMaxZ(nextZ);
    setActiveWindow(id);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: nextZ },
    }));
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: true },
    }));
  };

  const focusWindow = (id: string) => {
    const nextZ = maxZ + 1;
    setMaxZ(nextZ);
    setActiveWindow(id);
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: false, zIndex: nextZ },
    }));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { type: 'input' as const, text: `harsh@hzx:~$ ${terminalInput}` }];

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'Available commands:\n- bio: View Harsh Raj background\n- skills: List technical proficiencies\n- projects: View featured works\n- apps: List Android apps\n- contact: View email address\n- clear: Clear terminal output\n- web: Exit OS Mode and return to Web\n- secret: Discover developer Easter egg',
        });
        break;
      case 'bio':
        newHistory.push({ type: 'output', text: `${data.profile.name} (${data.profile.brandName})\n${data.profile.tagline}\n${data.about.shortBio}` });
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: data.skills.map((s) => `• ${s.name} [${s.category}] - ${s.level}%`).join('\n') });
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: data.projects.map((p) => `• ${p.name} (${p.status}) - ${p.shortDescription}`).join('\n') });
        break;
      case 'apps':
        newHistory.push({ type: 'output', text: data.apps.map((a) => `• ${a.name} (v${a.version}) - ${a.status}`).join('\n') });
        break;
      case 'contact':
        newHistory.push({ type: 'output', text: `Email: ${data.profile.email}\nStatus: ${data.currently.availability}` });
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'web':
        onExitOS();
        return;
      case 'secret':
        newHistory.push({ type: 'output', text: '⚡ HARSHZYNX KERNEL SECRET: Crafted with React 19, TypeScript, and Express. Pure sovereignty.' });
        break;
      default:
        newHistory.push({ type: 'output', text: `command not found: "${cmd}". Type "help" for a list of commands.` });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-slate-100 flex flex-col select-none overflow-hidden font-sans">
      {/* Desktop Background & Grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Desktop Icons Area */}
      <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-1 gap-6 auto-rows-min w-fit z-10">
        {[
          { id: 'terminal', label: 'Terminal', icon: <TerminalIcon className="w-6 h-6 text-emerald-400" /> },
          { id: 'about', label: 'About Me', icon: <User className="w-6 h-6 text-blue-400" /> },
          { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-6 h-6 text-indigo-400" /> },
          { id: 'apps', label: 'Android Apps', icon: <Smartphone className="w-6 h-6 text-cyan-400" /> },
          { id: 'skills', label: 'Skills', icon: <Cpu className="w-6 h-6 text-purple-400" /> },
          { id: 'resume', label: 'Resume', icon: <FileText className="w-6 h-6 text-rose-400" /> },
          { id: 'blog', label: 'Articles', icon: <Newspaper className="w-6 h-6 text-amber-400" /> },
          { id: 'contact', label: 'Contact', icon: <Mail className="w-6 h-6 text-pink-400" /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => openWindow(item.id)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/60 focus:bg-blue-900/40 focus:ring-1 focus:ring-blue-500/60 transition group w-20 text-center"
          >
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-md group-hover:scale-105 transition-transform">
              {item.icon}
            </div>
            <span className="text-[11px] font-medium text-slate-300 group-hover:text-white drop-shadow">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Active Windows Layer */}
      <div className="absolute inset-0 pointer-events-none p-4 sm:p-8 flex items-center justify-center">
        {/* Window: Terminal */}
        {windows.terminal.isOpen && !windows.terminal.isMinimized && (
          <div
            onClick={() => focusWindow('terminal')}
            style={{ zIndex: windows.terminal.zIndex }}
            className="pointer-events-auto absolute w-full max-w-2xl bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[420px]"
          >
            <div className="h-9 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-move">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <TerminalIcon className="w-3.5 h-3.5" />
                <span>harsh@kernel:~ (hzx-sh)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => minimizeWindow('terminal')} className="p-1 text-slate-400 hover:text-white">
                  <Minus className="w-3 h-3" />
                </button>
                <button onClick={() => closeWindow('terminal')} className="p-1 text-slate-400 hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 text-slate-300">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className={item.type === 'input' ? 'text-blue-400 font-semibold' : 'text-slate-300 whitespace-pre-wrap'}>
                  {item.text}
                </div>
              ))}
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1.5 pt-1">
                <span className="text-emerald-400">harsh@hzx:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none font-mono text-xs"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}

        {/* Window: About */}
        {windows.about.isOpen && !windows.about.isMinimized && (
          <div
            onClick={() => focusWindow('about')}
            style={{ zIndex: windows.about.zIndex }}
            className="pointer-events-auto absolute w-full max-w-xl bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
          >
            <div className="h-9 px-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>About Harsh Raj (HARSHZYNX)</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => minimizeWindow('about')} className="p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                <button onClick={() => closeWindow('about')} className="p-1 text-slate-400 hover:text-rose-400"><X className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div className="flex items-center gap-4">
                <img
                  src={data.profile.avatarUrl || '/src/assets/images/harsh_developer_portrait_1791264967532.jpg'}
                  alt="Harsh"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{data.profile.name}</h3>
                  <p className="text-blue-400 font-mono text-[11px]">{data.profile.tagline}</p>
                  <p className="text-slate-400 mt-1">{data.about.education} · {data.about.university}</p>
                </div>
              </div>
              <p className="leading-relaxed text-slate-200">{data.about.fullBio}</p>
            </div>
          </div>
        )}

        {/* Window: Projects */}
        {windows.projects.isOpen && !windows.projects.isMinimized && (
          <div
            onClick={() => focusWindow('projects')}
            style={{ zIndex: windows.projects.zIndex }}
            className="pointer-events-auto absolute w-full max-w-2xl bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[520px]"
          >
            <div className="h-9 px-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Projects Explorer</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => minimizeWindow('projects')} className="p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                <button onClick={() => closeWindow('projects')} className="p-1 text-slate-400 hover:text-rose-400"><X className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              {data.projects.map((p) => (
                <div key={p.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{p.shortDescription}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Window: Apps */}
        {windows.apps.isOpen && !windows.apps.isMinimized && (
          <div
            onClick={() => focusWindow('apps')}
            style={{ zIndex: windows.apps.zIndex }}
            className="pointer-events-auto absolute w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[460px]"
          >
            <div className="h-9 px-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Android App Ecosystem</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => minimizeWindow('apps')} className="p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                <button onClick={() => closeWindow('apps')} className="p-1 text-slate-400 hover:text-rose-400"><X className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {data.apps.map((a) => (
                <div key={a.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{a.name}</h4>
                    <span className="text-[10px] font-mono text-cyan-400">v{a.version} · {a.status}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Window: Skills */}
        {windows.skills.isOpen && !windows.skills.isMinimized && (
          <div
            onClick={() => focusWindow('skills')}
            style={{ zIndex: windows.skills.zIndex }}
            className="pointer-events-auto absolute w-full max-w-lg bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[460px]"
          >
            <div className="h-9 px-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Skills & Frameworks</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => minimizeWindow('skills')} className="p-1 text-slate-400 hover:text-white"><Minus className="w-3 h-3" /></button>
                <button onClick={() => closeWindow('skills')} className="p-1 text-slate-400 hover:text-rose-400"><X className="w-3 h-3" /></button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto space-y-3">
              {data.skills.map((s) => (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>{s.name} ({s.category})</span>
                    <span className="font-mono text-blue-400">{s.level}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Start Menu Popup */}
      {startMenuOpen && (
        <div className="absolute bottom-12 left-2 z-50 w-64 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl p-3 space-y-2 backdrop-blur-xl animate-fade-in">
          <div className="p-2 border-b border-slate-800 flex items-center gap-3">
            <img
              src={data.profile.avatarUrl || '/src/assets/images/harsh_developer_portrait_1791264967532.jpg'}
              alt="Harsh"
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-xs font-bold text-white">{data.profile.name}</p>
              <p className="text-[10px] text-blue-400 font-mono">HARSHZYNX OS</p>
            </div>
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setStartMenuOpen(false);
                onOpenAI();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-blue-400 hover:bg-slate-800 text-left transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Harsh AI Assistant</span>
            </button>
            <button
              onClick={() => {
                setStartMenuOpen(false);
                onOpenCard();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 text-left transition"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Digital Brand Card</span>
            </button>
            <button
              onClick={onExitOS}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-950/40 text-left transition pt-2 border-t border-slate-800"
            >
              <Power className="w-4 h-4" />
              <span>Exit OS Mode (Return to Web)</span>
            </button>
          </div>
        </div>
      )}

      {/* OS Taskbar */}
      <footer className="h-11 bg-slate-950/90 border-t border-slate-800 px-3 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {/* Start Button */}
          <button
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              startMenuOpen ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>HZYNX</span>
          </button>

          {/* Active Tabs */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto">
            {Object.values(windows)
              .filter((w) => w.isOpen)
              .map((w) => (
                <button
                  key={w.id}
                  onClick={() => focusWindow(w.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    activeWindow === w.id && !w.isMinimized
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {w.icon}
                  <span className="truncate max-w-[100px]">{w.title}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Right Status Tray */}
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <button
            onClick={onExitOS}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[11px] text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
            title="Exit Desktop OS Mode"
          >
            <span>Web View</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </button>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{currentTime}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
