import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X, QrCode, Lock, Sparkles, Monitor, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import type { WebsiteSettings } from '../types/index.ts';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCard: () => void;
  onOpenAdmin: () => void;
  onOpenAI: () => void;
  onToggleOS: () => void;
  onOpenNotifications: () => void;
  notificationCount?: number;
  osModeActive?: boolean;
  settings?: WebsiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenCard,
  onOpenAdmin,
  onOpenAI,
  onToggleOS,
  onOpenNotifications,
  notificationCount = 0,
  osModeActive = false,
  settings,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Journey', href: '#journey' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Apps', href: '#apps' },
    { label: 'Links', href: '#links' },
    { label: 'Articles', href: '#blog' },
    { label: 'Changelog', href: '#changelog' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white hover:text-blue-400 transition-colors flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300 bg-clip-text text-transparent font-extrabold tracking-wider">
            {settings?.logoText || 'HARSHZYNX'}
          </span>
        </a>

        {/* Zone 2: 4–6 clean text navigation links (desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-blue-400 transition-colors py-1 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Ask AI Button */}
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800/60 shadow-sm transition"
            title="Ask Harsh AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          {/* OS Mode Switcher Button */}
          <button
            onClick={onToggleOS}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
              osModeActive
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
            }`}
            title="Toggle HARSHZYNX OS Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>OS Mode</span>
          </button>

          {/* Notifications Center */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
            )}
          </button>

          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Search (Ctrl+K)"
            aria-label="Open search dialog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton compact />

          {/* Digital Card Action */}
          <button
            onClick={onOpenCard}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            title="View Digital Business Card"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Card</span>
          </button>

          {/* Admin CMS Access */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 rounded-lg transition-colors ${
              isAuthenticated
                ? 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title={isAuthenticated ? 'Admin Dashboard (Active)' : 'Admin Portal'}
            aria-label="Admin Portal"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 backdrop-blur-xl animate-fade-in">
          <nav className="flex flex-col space-y-3 pb-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-slate-200 hover:text-blue-400 py-1 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onToggleOS();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 py-1"
              >
                <Monitor className="w-4 h-4 text-indigo-400" />
                <span>Launch HARSHZYNX OS Desktop</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAI();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-blue-400 py-1"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Ask Harsh AI</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCard();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-slate-300 py-1"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>My Digital Business Card</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
