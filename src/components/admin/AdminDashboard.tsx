import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, User, BookOpen, Milestone, Cpu, FolderGit2, Link as LinkIcon,
  Smartphone, Share2, Instagram, Youtube, Award, FileText, Newspaper, Image as ImageIcon,
  Trophy, Briefcase, Sparkles, Inbox, BarChart2, Settings, Shield, Download,
  LogOut, ExternalLink, Plus, Trash2, Edit3, Save, Check, AlertCircle, Upload, Eye,
  Loader2, Palette, Bot, Search as SearchIcon, QrCode, ArrowUp, ArrowDown, Compass,
  GitCommit, RefreshCw, X, Radio, CheckCircle2, Activity, GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useData } from '../../context/DataContext.tsx';
import { api } from '../../lib/api.ts';
import type { DatabaseSchema } from '../../types/index.ts';

type AdminTab =
  | 'overview' | 'profile' | 'about' | 'currently' | 'projects' | 'custom_links'
  | 'apps' | 'skills' | 'timeline' | 'social_links' | 'certificates' | 'resumes'
  | 'blog_posts' | 'gallery' | 'youtube_videos' | 'instagram_posts' | 'achievements'
  | 'experience' | 'announcements' | 'changelog' | 'life_travel' | 'contact_messages'
  | 'analytics' | 'link_analytics' | 'theme_customizer' | 'ai_settings' | 'seo_settings'
  | 'qr_generator' | 'website_settings' | 'security' | 'backup';

export const AdminDashboard: React.FC<{ onBackToSite: () => void }> = ({ onBackToSite }) => {
  const { admin, logout, changePassword } = useAuth();
  const { refreshData } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [data, setData] = useState<DatabaseSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // QR Generator state
  const [qrUrl, setQrUrl] = useState('https://harshzynx.dev');
  const [qrColor, setQrColor] = useState('60a5fa');

  // AI Test state
  const [aiTestQuery, setAiTestQuery] = useState('');
  const [aiTestResponse, setAiTestResponse] = useState<string | null>(null);
  const [aiTesting, setAiTesting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminAllData();
      setData(res);
      setHasUnsavedChanges(false);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load database content' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'link_analytics') {
      api.getAnalytics().then(setAnalyticsData).catch(() => {});
    }
  }, [activeTab]);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Sync with database helper
  const syncAll = async (msg: string) => {
    await loadData();
    await refreshData();
    setHasUnsavedChanges(false);
    showFeedback('success', msg);
  };

  // Generic Save Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await api.updateProfile(data.profile);
      await syncAll('Profile identity updated and permanently saved.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await api.updateAbout(data.about);
      await syncAll('About Me details saved permanently to database.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to save about changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCurrently = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await api.updateCurrently(data.currently);
      await syncAll('Currently status updated permanently.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to save currently status. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!data) return;
    try {
      setSaving(true);
      await api.updateWebsiteSettings(data.website_settings);
      await syncAll('Website settings and branding saved permanently.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to save website settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Reorder Item Handler
  const handleMoveItem = async (collection: string, index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const items = [...((data as any)[collection] || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const orderedIds = items.map((i) => i.id);
    try {
      setSaving(true);
      await api.reorderItems(collection, orderedIds);
      await syncAll('Item order permanently updated in database.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Failed to update item order.');
    } finally {
      setSaving(false);
    }
  };

  // Generic Item CRUD Handlers
  const handleSaveItem = async (collection: string, item: any) => {
    try {
      setSaving(true);
      if (item.id && !isCreating) {
        await api.updateItem(collection, item.id, item);
        await syncAll(`${collection.replace('_', ' ')} item updated permanently.`);
      } else {
        await api.createItem(collection, item);
        await syncAll(`New ${collection.replace('_', ' ')} item created permanently.`);
      }
      setEditingItem(null);
      setIsCreating(false);
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to save item to database.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (collection: string, id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete ${name || 'this item'}? This will permanently remove it from the database.`)) return;
    try {
      setSaving(true);
      await api.deleteItem(collection, id);
      await syncAll('Item permanently deleted from database.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Unable to delete item.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, onDone: (url: string) => void) => {
    try {
      setUploading(true);
      const res = await api.uploadFile(file);
      onDone(res.url);
      setHasUnsavedChanges(true);
      showFeedback('success', 'File uploaded securely to disk storage.');
    } catch (err: any) {
      showFeedback('error', err.message || 'File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      setUploading(true);
      const res = await api.uploadProfilePhoto(file);
      setData((prev) => (prev ? { ...prev, profile: res.profile } : prev));
      await refreshData();
      showFeedback('success', 'Profile photo uploaded and permanently saved to database.');
    } catch (err: any) {
      showFeedback('error', err.message || 'Profile photo upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showFeedback('error', 'New passwords do not match.');
      return;
    }
    try {
      setSaving(true);
      await changePassword(currentPass, newPass);
      showFeedback('success', 'Password updated permanently.');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } catch (err: any) {
      showFeedback('error', err.message || 'Password update failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTestQuery.trim()) return;
    setAiTesting(true);
    setAiTestResponse(null);
    try {
      const res = await api.askAI(aiTestQuery.trim());
      setAiTestResponse(res.answer);
    } catch (err: any) {
      setAiTestResponse(`Error: ${err.message || 'Failed to query AI assistant'}`);
    } finally {
      setAiTesting(false);
    }
  };

  // Helper to construct a default empty entity when creating new items
  const getDefaultNewItem = (tab: string) => {
    const nextOrder = ((data as any)?.[tab]?.length || 0) + 1;
    switch (tab) {
      case 'skills':
        return { id: '', name: '', category: 'Programming', level: 80, description: '', icon: 'Code', order: nextOrder, enabled: true };
      case 'apps':
        return { id: '', name: '', description: '', version: '1.0.0', status: 'Live on Google Play', category: 'Productivity', playStoreUrl: '', otherStoreUrl: '', iconUrl: '', screenshots: [], featured: true, order: nextOrder };
      case 'custom_links':
        return { id: '', title: '', description: '', url: '', category: 'External', buttonText: 'Visit Link', badge: 'Featured', icon: 'ExternalLink', order: nextOrder, featured: true, active: true, openInNewTab: true };
      case 'timeline':
        return { id: '', year: `${new Date().getFullYear()}`, title: '', description: '', category: 'Milestone', image: '', link: '', featured: true, order: nextOrder };
      case 'social_links':
        return { id: '', platform: 'GitHub', username: '', url: '', description: '', icon: 'Github', order: nextOrder, active: true, featured: true };
      case 'certificates':
        return { id: '', title: '', issuer: '', issueDate: new Date().toISOString().split('T')[0], credentialUrl: '', credentialId: '', image: '', description: '', featured: true, order: nextOrder };
      case 'resumes':
        return { id: '', title: 'Harsh Raj — Software Engineer Resume', fileUrl: '', version: 'v1.0', uploadDate: new Date().toISOString().split('T')[0], active: true };
      case 'blog_posts':
        return { id: '', slug: '', title: '', excerpt: '', content: '', coverImage: '', category: 'Engineering', tags: ['Development'], author: 'Harsh Raj', date: new Date().toISOString().split('T')[0], featured: true, published: true, readTimeMinutes: 4 };
      case 'gallery':
        return { id: '', title: '', description: '', imageUrl: '', category: 'Tech & Setup', date: new Date().toISOString().split('T')[0], featured: true, order: nextOrder };
      case 'youtube_videos':
        return { id: '', title: '', youtubeUrl: '', thumbnailUrl: '', description: '', category: 'Tech Tutorial', date: new Date().toISOString().split('T')[0], featured: true, order: nextOrder };
      case 'instagram_posts':
        return { id: '', postUrl: '', imageUrl: '', caption: '', date: new Date().toISOString().split('T')[0], featured: true, order: nextOrder };
      case 'achievements':
        return { id: '', title: '', description: '', date: `${new Date().getFullYear()}`, organization: '', image: '', link: '', featured: true, order: nextOrder };
      case 'experience':
        return { id: '', role: '', organization: '', location: 'India', startDate: '2024', endDate: 'Present', isCurrent: true, description: '', technologies: ['TypeScript', 'Android'], order: nextOrder };
      case 'announcements':
        return { id: '', title: '', description: '', link: '', linkText: 'Learn More', active: true, priority: 1 };
      case 'changelog':
        return { id: '', version: '1.0.0', date: new Date().toISOString().split('T')[0], title: 'Version Release', features: ['Initial feature'], improvements: ['Optimized runtime'], fixes: [], breakingChanges: [], published: true };
      case 'life_travel':
        return { id: '', place: '', date: `${new Date().getFullYear()}`, description: '', story: '', photos: [], link: '', featured: true, order: nextOrder };
      default:
        return { id: '', title: '', name: '', order: nextOrder };
    }
  };

  const menuItems = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'profile', label: 'Profile & Education', icon: <User className="w-4 h-4" /> },
    { key: 'about', label: 'About Me', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'currently', label: 'Currently / Now', icon: <Milestone className="w-4 h-4" /> },
    { key: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { key: 'custom_links', label: 'Custom Links', icon: <LinkIcon className="w-4 h-4" /> },
    { key: 'apps', label: 'Android Apps', icon: <Smartphone className="w-4 h-4" /> },
    { key: 'skills', label: 'Skills Matrix', icon: <Cpu className="w-4 h-4" /> },
    { key: 'timeline', label: 'Journey Timeline', icon: <Milestone className="w-4 h-4" /> },
    { key: 'social_links', label: 'Social Media', icon: <Share2 className="w-4 h-4" /> },
    { key: 'certificates', label: 'Certificates', icon: <Award className="w-4 h-4" /> },
    { key: 'resumes', label: 'Resume Files', icon: <FileText className="w-4 h-4" /> },
    { key: 'blog_posts', label: 'Blog & Articles', icon: <Newspaper className="w-4 h-4" /> },
    { key: 'gallery', label: 'Photo Gallery', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'youtube_videos', label: 'YouTube Media', icon: <Youtube className="w-4 h-4" /> },
    { key: 'instagram_posts', label: 'Instagram Grid', icon: <Instagram className="w-4 h-4" /> },
    { key: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
    { key: 'experience', label: 'Work Experience', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'announcements', label: 'Announcements', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'changelog', label: 'Changelog Releases', icon: <GitCommit className="w-4 h-4" /> },
    { key: 'life_travel', label: 'Life & Travel', icon: <Compass className="w-4 h-4" /> },
    { key: 'contact_messages', label: 'Contact Messages', icon: <Inbox className="w-4 h-4" /> },
    { key: 'analytics', label: 'Site Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { key: 'link_analytics', label: 'Link Click Tracker', icon: <Activity className="w-4 h-4" /> },
    { key: 'theme_customizer', label: 'Theme Customizer', icon: <Palette className="w-4 h-4" /> },
    { key: 'ai_settings', label: 'AI Assistant CMS', icon: <Bot className="w-4 h-4" /> },
    { key: 'seo_settings', label: 'SEO & Metadata', icon: <SearchIcon className="w-4 h-4" /> },
    { key: 'qr_generator', label: 'QR Generator', icon: <QrCode className="w-4 h-4" /> },
    { key: 'website_settings', label: 'Website Settings', icon: <Settings className="w-4 h-4" /> },
    { key: 'security', label: 'Security & Auth', icon: <Shield className="w-4 h-4" /> },
    { key: 'backup', label: 'Database Backup', icon: <Download className="w-4 h-4" /> },
  ];

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-xs font-mono text-slate-400">Loading Persistent HARSHZYNX Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="h-14 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              HARSHZYNX CMS
            </span>
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300">
            Real Database Persistent
          </span>
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300">
              ● Unsaved Changes
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
            title="Reload Database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              onBackToSite();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={() => {
              logout();
              onBackToSite();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/60 transition"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/60 overflow-y-auto hidden md:block p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key as AdminTab);
                setEditingItem(null);
                setIsCreating(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                activeTab === item.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              {item.key === 'contact_messages' && data.contact_messages.filter((m) => !m.read).length > 0 && (
                <span className="ml-auto px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  {data.contact_messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Mobile Tab Selector */}
          <div className="md:hidden mb-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
            <label className="block text-[11px] font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
              Admin Section Navigation:
            </label>
            <select
              value={activeTab}
              onChange={(e) => {
                setActiveTab(e.target.value as AdminTab);
                setEditingItem(null);
                setIsCreating(false);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-white focus:border-blue-500"
            >
              {menuItems.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium animate-fade-in ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/90 border border-emerald-800 text-emerald-200 shadow-lg'
                  : 'bg-rose-950/90 border border-rose-800 text-rose-200 shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span>{feedback.message}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-xs underline hover:text-white">
                Dismiss
              </button>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-5xl">
              <div>
                <h2 className="text-2xl font-black text-white">Platform Overview</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Real-time database metrics, content records, and authenticated owner logs.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Projects', val: data.projects.length, tab: 'projects', icon: <FolderGit2 className="w-4 h-4 text-blue-400" /> },
                  { label: 'Skills', val: data.skills.length, tab: 'skills', icon: <Cpu className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Custom Links', val: data.custom_links.length, tab: 'custom_links', icon: <LinkIcon className="w-4 h-4 text-amber-400" /> },
                  { label: 'Mobile Apps', val: data.apps.length, tab: 'apps', icon: <Smartphone className="w-4 h-4 text-cyan-400" /> },
                  { label: 'Certificates', val: data.certificates.length, tab: 'certificates', icon: <Award className="w-4 h-4 text-rose-400" /> },
                  { label: 'Videos', val: data.youtube_videos.length, tab: 'youtube_videos', icon: <Youtube className="w-4 h-4 text-purple-400" /> },
                  { label: 'Articles', val: data.blog_posts.length, tab: 'blog_posts', icon: <Newspaper className="w-4 h-4 text-indigo-400" /> },
                  { label: 'Messages', val: data.contact_messages.length, tab: 'contact_messages', icon: <Inbox className="w-4 h-4 text-pink-400" /> },
                ].map((stat, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(stat.tab as AdminTab)}
                    className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 text-left hover:border-slate-700 transition space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">{stat.label}</span>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors tabular-nums">
                      {stat.val}
                    </p>
                  </button>
                ))}
              </div>

              {/* Activity Log */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Recent Administrative Activity (Persisted)</span>
                </h3>
                {data.activity_logs.length === 0 ? (
                  <p className="text-xs text-slate-500">No activity recorded yet.</p>
                ) : (
                  <div className="divide-y divide-slate-800/60">
                    {data.activity_logs.slice(0, 8).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-200">{log.action}</p>
                          <p className="text-slate-400">{log.details}</p>
                        </div>
                        <span className="font-mono text-slate-500 text-[11px] shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: PROFILE & HERO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Profile & Hero Configuration</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage personal branding, avatar image, hero tagline, contact info, and education records. All values persist permanently in the database.
                </p>
              </div>

              {/* Personal Identity Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Personal & Brand Identity</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={data.profile.name || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, name: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. Harsh Raj"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Brand Name</label>
                    <input
                      type="text"
                      required
                      value={data.profile.brandName || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, brandName: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. HARSHZYNX"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Professional Tagline</label>
                  <input
                    type="text"
                    value={data.profile.tagline || ''}
                    onChange={(e) => {
                      setData({ ...data, profile: { ...data.profile, tagline: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Enter professional tagline"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Introduction Paragraph</label>
                  <textarea
                    rows={4}
                    value={data.profile.intro || ''}
                    onChange={(e) => {
                      setData({ ...data, profile: { ...data.profile, intro: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="Enter introduction paragraph"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                  />
                </div>

                {/* Profile Photo & Persistent Storage Upload */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Profile Photo</label>
                  <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                    <div className="relative shrink-0">
                      {data.profile.avatarUrl ? (
                        <img
                          src={data.profile.avatarUrl}
                          alt="Avatar"
                          className="w-20 h-20 rounded-xl object-cover border border-slate-700 bg-slate-950 shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-xl border border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-slate-500">
                          <User className="w-8 h-8 opacity-40" />
                          <span className="text-[10px] mt-1 font-mono">No Photo</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="text"
                        value={data.profile.avatarUrl || ''}
                        onChange={(e) => {
                          setData({ ...data, profile: { ...data.profile, avatarUrl: e.target.value } });
                          setHasUnsavedChanges(true);
                        }}
                        placeholder="/uploads/... or external image URL"
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                      />

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-xs text-white cursor-pointer font-medium shadow-sm transition">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading ? 'Uploading & Saving...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleProfilePhotoUpload(e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {data.profile.avatarUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setData({ ...data, profile: { ...data.profile, avatarUrl: '' } });
                              setHasUnsavedChanges(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-xs text-rose-300 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Photo</span>
                          </button>
                        )}
                        <span className="text-[11px] text-slate-500">
                          Uploaded images are stored permanently on disk & synced to database.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Contact Email</label>
                    <input
                      type="email"
                      value={data.profile.email || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, email: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter contact email"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={data.profile.location || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, location: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter location"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Status Badge</label>
                    <input
                      type="text"
                      value={data.profile.status || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, status: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. Available for opportunities"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Education Information Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="border-b border-slate-800/80 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>Education Information</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    College / University, Degree, Graduation Year, and Secondary School marks saved permanently to the database and displayed on the public site.
                  </p>
                </div>

                {/* College / University Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-mono text-slate-400 mb-1">College / University Name</label>
                    <input
                      type="text"
                      value={data.profile.college || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, college: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter college / university name"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Degree / Course</label>
                    <input
                      type="text"
                      value={data.profile.degree || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, degree: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter degree / course"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={data.profile.graduationYear || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, graduationYear: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. 2026"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 12th School Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">12th School Name</label>
                    <input
                      type="text"
                      value={data.profile.twelfthSchool || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, twelfthSchool: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter 12th school name"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">12th Percentage / Score</label>
                    <input
                      type="text"
                      value={data.profile.twelfthPercentage || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, twelfthPercentage: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. 92% or 9.2 CGPA"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* 10th School Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800/80">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">10th School Name</label>
                    <input
                      type="text"
                      value={data.profile.tenthSchool || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, tenthSchool: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="Enter 10th school name"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">10th Percentage / Score</label>
                    <input
                      type="text"
                      value={data.profile.tenthPercentage || ''}
                      onChange={(e) => {
                        setData({ ...data, profile: { ...data.profile, tenthPercentage: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. 95% or 9.5 CGPA"
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save Profile & Hero'}</span>
                </button>
                {hasUnsavedChanges && (
                  <span className="text-xs text-amber-400 font-mono">
                    ● Unsaved changes in form
                  </span>
                )}
              </div>
            </form>
          )}

          {/* TAB: ABOUT ME */}
          {activeTab === 'about' && (
            <form onSubmit={handleSaveAbout} className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">About Me Configuration</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Detailed biography, academic history, interests, and career ambitions.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Short Summary Bio</label>
                  <textarea
                    rows={2}
                    value={data.about.shortBio}
                    onChange={(e) => {
                      setData({ ...data, about: { ...data.about, shortBio: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Full Narrative Biography</label>
                  <textarea
                    rows={6}
                    value={data.about.fullBio}
                    onChange={(e) => {
                      setData({ ...data, about: { ...data.about, fullBio: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Degree / Education</label>
                    <input
                      type="text"
                      value={data.about.education}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, education: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">University</label>
                    <input
                      type="text"
                      value={data.about.university}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, university: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={data.about.graduationYear}
                      onChange={(e) => {
                        setData({ ...data, about: { ...data.about, graduationYear: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Interests (comma separated)</label>
                  <input
                    type="text"
                    value={data.about.interests.join(', ')}
                    onChange={(e) => {
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Career Goals & Vision</label>
                  <textarea
                    rows={3}
                    value={data.about.careerGoals}
                    onChange={(e) => {
                      setData({ ...data, about: { ...data.about, careerGoals: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving to Database...' : 'Save About Changes'}</span>
              </button>
            </form>
          )}

          {/* TAB: CURRENTLY / NOW */}
          {activeTab === 'currently' && (
            <form onSubmit={handleSaveCurrently} className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Currently Building & Focus</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Update your active work, study focus, current Android project, and availability status.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Currently Building</label>
                  <input
                    type="text"
                    required
                    value={data.currently.building}
                    onChange={(e) => {
                      setData({ ...data, currently: { ...data.currently, building: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Currently Learning</label>
                  <input
                    type="text"
                    required
                    value={data.currently.learning}
                    onChange={(e) => {
                      setData({ ...data, currently: { ...data.currently, learning: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Primary Focus Area</label>
                  <input
                    type="text"
                    required
                    value={data.currently.focus}
                    onChange={(e) => {
                      setData({ ...data, currently: { ...data.currently, focus: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Availability Status</label>
                  <select
                    value={data.currently.availability}
                    onChange={(e) => {
                      setData({ ...data, currently: { ...data.currently, availability: e.target.value as any } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  >
                    <option value="Available">Available (Open for offers & contracts)</option>
                    <option value="Limited Availability">Limited Availability (Part-time / Consulting)</option>
                    <option value="Not Available">Not Available (Currently Focused)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Current Milestones & Goals</label>
                  <textarea
                    rows={3}
                    value={data.currently.goals}
                    onChange={(e) => {
                      setData({ ...data, currently: { ...data.currently, goals: e.target.value } });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-md transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving to Database...' : 'Save Currently Status'}</span>
              </button>
            </form>
          )}

          {/* TAB: WEBSITE SETTINGS & BRANDING */}
          {activeTab === 'website_settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-4xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Website Settings & Section Visibility</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Control branding words, titles, maintenance mode, OS mode, and homepage sections. All values persist permanently.
                </p>
              </div>

              {/* Core Titles & Branding */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono">Core Brand & Titles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Site Browser Title (HTML title)</label>
                    <input
                      type="text"
                      value={data.website_settings.siteTitle}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, siteTitle: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Brand Wordmark (Navbar Logo Text)</label>
                    <input
                      type="text"
                      value={data.website_settings.logoText}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, logoText: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Hero Main Title (Hero Headline)</label>
                    <input
                      type="text"
                      value={data.website_settings.heroTitle}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, heroTitle: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      placeholder="e.g. HARSHZYNX or My New Portfolio"
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Hero Tagline Description</label>
                    <input
                      type="text"
                      value={data.website_settings.heroDescription}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, heroDescription: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Footer Copyright Text</label>
                    <input
                      type="text"
                      value={data.website_settings.footerText}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, footerText: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Contact Recipient Email</label>
                    <input
                      type="email"
                      value={data.website_settings.contactEmail}
                      onChange={(e) => {
                        setData({ ...data, website_settings: { ...data.website_settings, contactEmail: e.target.value } });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Special Platform Modes */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono">Special Platform Modes</h3>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">Maintenance Mode</h4>
                    <p className="text-[11px] text-slate-400">Public visitors see maintenance screen (Admin bypasses)</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 rounded"
                    checked={data.website_settings.maintenanceMode}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: { ...data.website_settings, maintenanceMode: e.target.checked },
                      });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-white">HARSHZYNX OS Mode</h4>
                    <p className="text-[11px] text-slate-400">Enable optional desktop retro environment switcher</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 rounded"
                    checked={data.website_settings.osModeEnabled}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: { ...data.website_settings, osModeEnabled: e.target.checked },
                      });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Developer Easter Eggs</h4>
                    <p className="text-[11px] text-slate-400">Enable keyboard shortcuts and secret terminal commands</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 rounded"
                    checked={data.website_settings.easterEggsEnabled}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: { ...data.website_settings, easterEggsEnabled: e.target.checked },
                      });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>
              </div>

              {/* Section Visibility */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono">Public Section Visibility Toggles</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(data.website_settings.sectionsVisibility).map(([k, val]) => (
                    <label key={k} className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono capitalize cursor-pointer hover:border-slate-700">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => {
                          setData({
                            ...data,
                            website_settings: {
                              ...data.website_settings,
                              sectionsVisibility: {
                                ...data.website_settings.sectionsVisibility,
                                [k]: e.target.checked,
                              },
                            },
                          });
                          setHasUnsavedChanges(true);
                        }}
                        className="accent-blue-600"
                      />
                      <span>{k}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold shadow-md transition"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving to Database...' : 'Save All Website Settings'}</span>
              </button>
            </form>
          )}

          {/* TAB: THEME CUSTOMIZER */}
          {activeTab === 'theme_customizer' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Theme Customizer</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Fine-tune the design system, primary accents, border radius, card style, glass effects, and animation intensity.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
                {/* Primary Accent */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Primary Accent Color</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { key: 'blue', label: 'Electric Blue', hex: '#3b82f6' },
                      { key: 'indigo', label: 'Deep Indigo', hex: '#6366f1' },
                      { key: 'cyan', label: 'Vibrant Cyan', hex: '#06b6d4' },
                      { key: 'emerald', label: 'Neon Emerald', hex: '#10b981' },
                      { key: 'violet', label: 'Royal Violet', hex: '#8b5cf6' },
                    ].map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              primaryAccent: c.key as any,
                            },
                          };
                          setData({ ...data, website_settings: updated });
                          setHasUnsavedChanges(true);
                        }}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition ${
                          data.website_settings.themeCustomizer.primaryAccent === c.key
                            ? 'border-white bg-slate-800 text-white ring-2 ring-blue-500/30'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Style & Border Radius */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Border Radius</label>
                    <select
                      value={data.website_settings.themeCustomizer.borderRadius}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              borderRadius: e.target.value as any,
                            },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="minimal">Minimal (4px)</option>
                      <option value="rounded">Rounded (12px - Standard)</option>
                      <option value="curved">Curved (20px - Premium)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Card Material Style</label>
                    <select
                      value={data.website_settings.themeCustomizer.cardStyle}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              cardStyle: e.target.value as any,
                            },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="glass">Frosted Glass (Modern)</option>
                      <option value="solid">Solid High Contrast</option>
                      <option value="bordered">Outlined Minimal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Animation Motion</label>
                    <select
                      value={data.website_settings.themeCustomizer.animationIntensity}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              animationIntensity: e.target.value as any,
                            },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="standard">Standard (Smooth)</option>
                      <option value="subtle">Subtle</option>
                      <option value="high">Energetic</option>
                      <option value="reduced">Reduced Motion (Accessible)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">Glow Atmosphere</label>
                    <select
                      value={data.website_settings.themeCustomizer.glowIntensity}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              glowIntensity: e.target.value as any,
                            },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="subtle">Subtle Ambient Glow</option>
                      <option value="vibrant">Vibrant Cyber Glow</option>
                      <option value="none">None (Strict Flat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">UI Density</label>
                    <select
                      value={data.website_settings.themeCustomizer.uiDensity}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            themeCustomizer: {
                              ...data.website_settings.themeCustomizer,
                              uiDensity: e.target.value as any,
                            },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    >
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact Developer</option>
                      <option value="spacious">Spacious Editorial</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold shadow-md transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Applying & Saving...' : 'Save Theme Customizations'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: ASK HARSH AI SETTINGS */}
          {activeTab === 'ai_settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Ask Harsh AI Assistant Settings</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage the official AI assistant grounded strictly in verified HARSHZYNX portfolio data.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Enable AI Assistant on Website</h3>
                    <p className="text-xs text-slate-400">Allow visitors to ask questions about Harsh Raj</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 rounded"
                    checked={data.website_settings.aiSettings.enabled}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: {
                          ...data.website_settings,
                          aiSettings: {
                            ...data.website_settings.aiSettings,
                            enabled: e.target.checked,
                          },
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Welcome Message</label>
                  <input
                    type="text"
                    value={data.website_settings.aiSettings.welcomeMessage}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: {
                          ...data.website_settings,
                          aiSettings: {
                            ...data.website_settings.aiSettings,
                            welcomeMessage: e.target.value,
                          },
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">System Instructions Prompt</label>
                  <textarea
                    rows={4}
                    value={data.website_settings.aiSettings.systemInstruction}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: {
                          ...data.website_settings,
                          aiSettings: {
                            ...data.website_settings.aiSettings,
                            systemInstruction: e.target.value,
                          },
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                  <span>Total Queries Served:</span>
                  <span className="font-mono font-bold text-blue-400 tabular-nums">
                    {data.website_settings.aiSettings.totalQueries || 0} questions
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save AI Configuration'}</span>
                </button>
              </div>

              {/* AI Test Sandbox */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <span>Admin AI Test Sandbox</span>
                </h3>
                <form onSubmit={handleTestAI} className="flex gap-2">
                  <input
                    type="text"
                    value={aiTestQuery}
                    onChange={(e) => setAiTestQuery(e.target.value)}
                    placeholder="Test asking a question: e.g. What are Harsh's skills?"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                  <button
                    type="submit"
                    disabled={aiTesting}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
                  >
                    {aiTesting ? 'Querying...' : 'Ask'}
                  </button>
                </form>
                {aiTestResponse && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {aiTestResponse}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: SEO & METADATA */}
          {activeTab === 'seo_settings' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">SEO & Social Meta Configuration</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Manage search engine titles, OpenGraph previews, canonical tags, and keywords.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={data.website_settings.seoSettings.metaTitle}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: {
                          ...data.website_settings,
                          seoSettings: { ...data.website_settings.seoSettings, metaTitle: e.target.value },
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={data.website_settings.seoSettings.metaDescription}
                    onChange={(e) => {
                      setData({
                        ...data,
                        website_settings: {
                          ...data.website_settings,
                          seoSettings: { ...data.website_settings.seoSettings, metaDescription: e.target.value },
                        },
                      });
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">OpenGraph Title</label>
                    <input
                      type="text"
                      value={data.website_settings.seoSettings.ogTitle}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            seoSettings: { ...data.website_settings.seoSettings, ogTitle: e.target.value },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={data.website_settings.seoSettings.keywords}
                      onChange={(e) => {
                        setData({
                          ...data,
                          website_settings: {
                            ...data.website_settings,
                            seoSettings: { ...data.website_settings.seoSettings, keywords: e.target.value },
                          },
                        });
                        setHasUnsavedChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveSettings()}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold transition"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{saving ? 'Saving...' : 'Save SEO Metadata'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LINK ANALYTICS */}
          {activeTab === 'link_analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">External Link Analytics</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Track real user click frequency on GitHub, Play Store, Custom Links, and Resume downloads.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Label</th>
                      <th className="p-3.5">Destination URL</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Total Clicks</th>
                      <th className="p-3.5">Last Clicked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {data.link_analytics.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No link clicks recorded yet. Clicks are logged as visitors engage with links.
                        </td>
                      </tr>
                    ) : (
                      data.link_analytics.map((link) => (
                        <tr key={link.id} className="hover:bg-slate-800/40">
                          <td className="p-3.5 font-semibold text-white">{link.label}</td>
                          <td className="p-3.5 text-blue-400 font-mono truncate max-w-xs">{link.targetUrl}</td>
                          <td className="p-3.5 text-slate-400">{link.category}</td>
                          <td className="p-3.5 font-mono text-emerald-400 tabular-nums font-bold">{link.clickCount}</td>
                          <td className="p-3.5 text-slate-500 font-mono">{new Date(link.lastClickedAt).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: QR CODE GENERATOR TOOL */}
          {activeTab === 'qr_generator' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">QR Code Generator Tool</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Generate high-resolution QR codes for custom links, apps, digital cards, or websites.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Target URL</label>
                  <input
                    type="url"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Color Palette Accent</label>
                  <div className="flex items-center gap-2">
                    {[
                      { label: 'Blue', hex: '60a5fa' },
                      { label: 'Cyan', hex: '22d3ee' },
                      { label: 'Emerald', hex: '34d399' },
                      { label: 'White', hex: 'ffffff' },
                    ].map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setQrColor(c.hex)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          qrColor === c.hex ? 'border-white scale-110' : 'border-transparent opacity-60'
                        }`}
                        style={{ backgroundColor: `#${c.hex}` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-center p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrUrl)}&bgcolor=090d16&color=${qrColor}&margin=2`}
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg shadow-md"
                  />
                </div>

                <div className="flex justify-center">
                  <a
                    href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrUrl)}&bgcolor=090d16&color=${qrColor}&margin=2`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="harshzynx_qr.png"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full-Resolution PNG</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Security & Password</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Change administrative password and review authenticated session logs.
                </p>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">New Password (min 8 chars) *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold shadow-md transition"
                >
                  <Shield className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: BACKUP */}
          {activeTab === 'backup' && (
            <div className="max-w-xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Database Backup & Export</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Download a complete JSON snapshot of all portfolio entities, projects, links, and messages.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <a
                  href="/api/admin/export"
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Export JSON Database File</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB: CONTACT MESSAGES */}
          {activeTab === 'contact_messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Contact Inbox</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Inquiries received through the public portfolio contact form.
                </p>
              </div>

              {data.contact_messages.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-sm">
                  <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                  <p>Your contact inbox is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.contact_messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 rounded-xl border transition space-y-3 ${
                        msg.read ? 'bg-slate-900/40 border-slate-800/80' : 'bg-blue-950/20 border-blue-800/50 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{msg.name}</h4>
                            {!msg.read && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                                UNREAD
                              </span>
                            )}
                          </div>
                          <a href={`mailto:${msg.email}`} className="text-xs font-mono text-blue-400 hover:underline">
                            {msg.email}
                          </a>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                        {msg.message}
                      </p>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <a
                          href={`mailto:${msg.email}?subject=Reply%20from%20HARSHZYNX`}
                          className="text-blue-400 hover:underline font-semibold"
                        >
                          Reply via Email
                        </a>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={async () => {
                              await api.updateContactMessage(msg.id, { read: !msg.read });
                              await loadData();
                            }}
                            className="text-slate-400 hover:text-white"
                          >
                            {msg.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                          <button
                            onClick={async () => {
                              await api.deleteContactMessage(msg.id);
                              await loadData();
                            }}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Site Analytics & Engagement</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Private visitor metrics, views, and downloads.
                </p>
              </div>

              {analyticsData ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">Total Page Views</span>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">{analyticsData.counts.pageViews}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">Project Views</span>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">{analyticsData.counts.projectViews}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">Link Clicks</span>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">{analyticsData.counts.linkClicks}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-xs text-slate-400 font-mono">Resume Downloads</span>
                      <p className="text-2xl font-black text-white mt-1 tabular-nums">{analyticsData.counts.resumeDownloads}</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-3">Top Visited Routes</h3>
                    <div className="space-y-2">
                      {analyticsData.topPaths.map((p: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60">
                          <span className="font-mono text-slate-300">{p.path}</span>
                          <span className="font-mono text-blue-400 font-bold tabular-nums">{p.count} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">Loading analytics...</div>
              )}
            </div>
          )}

          {/* ALL DATA CRUD COLLECTIONS: projects, apps, custom_links, skills, timeline, social_links, certificates, resumes, blog_posts, gallery, youtube_videos, instagram_posts, achievements, experience, announcements, changelog, life_travel */}
          {[
            'projects', 'apps', 'custom_links', 'skills', 'timeline', 'social_links',
            'certificates', 'resumes', 'blog_posts', 'gallery', 'youtube_videos',
            'instagram_posts', 'achievements', 'experience', 'announcements', 'changelog', 'life_travel'
          ].includes(activeTab) && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white capitalize">{activeTab.replace('_', ' ')} CMS</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Manage {activeTab.replace('_', ' ')} records. Every action saves permanently to the persistent database.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setEditingItem(getDefaultNewItem(activeTab));
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New {activeTab.replace('_', ' ').slice(0, -1)}</span>
                </button>
              </div>

              {/* DEDICATED EDITING / CREATING FORM MODAL/CARD */}
              {editingItem && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4 max-w-3xl animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 font-bold">
                        {isCreating ? 'CREATE NEW' : 'EDIT ITEM'}
                      </span>
                      <span>{editingItem.name || editingItem.title || editingItem.platform || editingItem.role || editingItem.place || 'Record'}</span>
                    </h3>
                    <button
                      onClick={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* FORM FIELDS TAILORED PER COLLECTION */}
                  <div className="space-y-4">
                    {/* Common Name or Title */}
                    {(editingItem.name !== undefined || editingItem.title !== undefined) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {editingItem.name !== undefined && (
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Name *</label>
                            <input
                              type="text"
                              required
                              value={editingItem.name || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        )}
                        {editingItem.title !== undefined && (
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Title *</label>
                            <input
                              type="text"
                              required
                              value={editingItem.title || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        )}
                        {editingItem.slug !== undefined && (
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Slug URL Identifier</label>
                            <input
                              type="text"
                              value={editingItem.slug || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        )}
                        {editingItem.category !== undefined && (
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                            <input
                              type="text"
                              value={editingItem.category || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Platform for social links */}
                    {activeTab === 'social_links' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Platform</label>
                          <select
                            value={editingItem.platform || 'GitHub'}
                            onChange={(e) => setEditingItem({ ...editingItem, platform: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          >
                            <option value="GitHub">GitHub</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Twitter">Twitter / X</option>
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Facebook">Facebook</option>
                            <option value="Telegram">Telegram</option>
                            <option value="Custom">Custom</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Username / Handle</label>
                          <input
                            type="text"
                            value={editingItem.username || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, username: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* URLs: url, playStoreUrl, githubUrl, liveDemoUrl, etc. */}
                    {editingItem.url !== undefined && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Target URL *</label>
                        <input
                          type="url"
                          required
                          value={editingItem.url || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {activeTab === 'projects' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">GitHub URL</label>
                          <input
                            type="url"
                            value={editingItem.githubUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Live Demo URL</label>
                          <input
                            type="url"
                            value={editingItem.liveDemoUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, liveDemoUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'apps' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Google Play Store URL</label>
                          <input
                            type="url"
                            value={editingItem.playStoreUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, playStoreUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Other Store / APK URL</label>
                          <input
                            type="url"
                            value={editingItem.otherStoreUrl || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, otherStoreUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'youtube_videos' && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">YouTube Video URL *</label>
                        <input
                          type="url"
                          required
                          value={editingItem.youtubeUrl || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, youtubeUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {activeTab === 'instagram_posts' && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Instagram Post URL *</label>
                        <input
                          type="url"
                          required
                          value={editingItem.postUrl || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, postUrl: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {/* Skill Specifics */}
                    {activeTab === 'skills' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Skill Proficiency Level: {editingItem.level}%</label>
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={editingItem.level || 80}
                              onChange={(e) => setEditingItem({ ...editingItem, level: parseInt(e.target.value, 10) })}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Icon Identifier</label>
                            <input
                              type="text"
                              value={editingItem.icon || 'Code'}
                              onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                              placeholder="e.g. Smartphone, Code, Server, Terminal"
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image / Media File Upload */}
                    {(editingItem.imageUrl !== undefined || editingItem.image !== undefined || editingItem.thumbnailUrl !== undefined || editingItem.iconUrl !== undefined || editingItem.coverImage !== undefined || editingItem.fileUrl !== undefined) && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Media / Image / File URL</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingItem.imageUrl || editingItem.image || editingItem.thumbnailUrl || editingItem.iconUrl || editingItem.coverImage || editingItem.fileUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (editingItem.imageUrl !== undefined) setEditingItem({ ...editingItem, imageUrl: val });
                              else if (editingItem.image !== undefined) setEditingItem({ ...editingItem, image: val });
                              else if (editingItem.thumbnailUrl !== undefined) setEditingItem({ ...editingItem, thumbnailUrl: val });
                              else if (editingItem.iconUrl !== undefined) setEditingItem({ ...editingItem, iconUrl: val });
                              else if (editingItem.coverImage !== undefined) setEditingItem({ ...editingItem, coverImage: val });
                              else if (editingItem.fileUrl !== undefined) setEditingItem({ ...editingItem, fileUrl: val });
                            }}
                            placeholder="/uploads/... or external URL"
                            className="flex-1 px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                          <label className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 cursor-pointer flex items-center gap-1 shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], (url) => {
                                    if (editingItem.imageUrl !== undefined) setEditingItem({ ...editingItem, imageUrl: url });
                                    else if (editingItem.image !== undefined) setEditingItem({ ...editingItem, image: url });
                                    else if (editingItem.thumbnailUrl !== undefined) setEditingItem({ ...editingItem, thumbnailUrl: url });
                                    else if (editingItem.iconUrl !== undefined) setEditingItem({ ...editingItem, iconUrl: url });
                                    else if (editingItem.coverImage !== undefined) setEditingItem({ ...editingItem, coverImage: url });
                                    else if (editingItem.fileUrl !== undefined) setEditingItem({ ...editingItem, fileUrl: url });
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Descriptions */}
                    {editingItem.shortDescription !== undefined && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Short Summary</label>
                        <textarea
                          rows={2}
                          value={editingItem.shortDescription || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {editingItem.description !== undefined && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editingItem.description || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {editingItem.detailedDescription !== undefined && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Detailed Description / Case Study</label>
                        <textarea
                          rows={4}
                          value={editingItem.detailedDescription || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, detailedDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                        />
                      </div>
                    )}

                    {/* Blog post content */}
                    {editingItem.content !== undefined && (
                      <div>
                        <label className="block text-xs font-mono text-slate-400 mb-1">Article Full Content (Markdown or formatted)</label>
                        <textarea
                          rows={6}
                          value={editingItem.content || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                          className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white font-mono"
                        />
                      </div>
                    )}

                    {/* Life & Travel Specifics */}
                    {activeTab === 'life_travel' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Place / City *</label>
                            <input
                              type="text"
                              required
                              value={editingItem.place || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, place: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Year / Date</label>
                            <input
                              type="text"
                              value={editingItem.date || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Personal Story / Reflections</label>
                          <textarea
                            rows={3}
                            value={editingItem.story || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, story: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Timeline specific */}
                    {activeTab === 'timeline' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">Year / Date *</label>
                          <input
                            type="text"
                            required
                            value={editingItem.year || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-mono text-slate-400 mb-1">External Link</label>
                          <input
                            type="url"
                            value={editingItem.link || ''}
                            onChange={(e) => setEditingItem({ ...editingItem, link: e.target.value })}
                            className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Experience specific */}
                    {activeTab === 'experience' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Role / Position *</label>
                            <input
                              type="text"
                              required
                              value={editingItem.role || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Client</label>
                            <input
                              type="text"
                              value={editingItem.organization || ''}
                              onChange={(e) => setEditingItem({ ...editingItem, organization: e.target.value })}
                              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Boolean Toggles */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      {editingItem.featured !== undefined && (
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.featured}
                            onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                            className="accent-blue-600 rounded"
                          />
                          <span>Featured on Homepage</span>
                        </label>
                      )}
                      {editingItem.enabled !== undefined && (
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.enabled}
                            onChange={(e) => setEditingItem({ ...editingItem, enabled: e.target.checked })}
                            className="accent-blue-600 rounded"
                          />
                          <span>Enabled & Active</span>
                        </label>
                      )}
                      {editingItem.active !== undefined && (
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.active}
                            onChange={(e) => setEditingItem({ ...editingItem, active: e.target.checked })}
                            className="accent-blue-600 rounded"
                          />
                          <span>Active Status</span>
                        </label>
                      )}
                      {editingItem.published !== undefined && (
                        <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingItem.published}
                            onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                            className="accent-blue-600 rounded"
                          />
                          <span>Published</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* FORM ACTION BUTTONS */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleSaveItem(activeTab, editingItem)}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-semibold shadow-md transition"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      <span>{saving ? 'Writing to Database...' : isCreating ? 'Save New Item' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(null);
                        setIsCreating(false);
                      }}
                      className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* TABLE LISTING FOR CURRENT COLLECTION */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 w-16">Order</th>
                      <th className="p-3.5">Title / Name</th>
                      <th className="p-3.5">Details</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {(((data as any)[activeTab] || []) as any[]).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No records in this collection yet. Click &ldquo;Add New&rdquo; above to create one.
                        </td>
                      </tr>
                    ) : (
                      (((data as any)[activeTab] || []) as any[]).map((item: any, idx: number) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5 space-x-1 whitespace-nowrap">
                            <button
                              disabled={idx === 0 || saving}
                              onClick={() => handleMoveItem(activeTab, idx, 'up')}
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === (((data as any)[activeTab] || []) as any[]).length - 1 || saving}
                              onClick={() => handleMoveItem(activeTab, idx, 'down')}
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </td>
                          <td className="p-3.5 font-semibold text-white">
                            {item.title || item.name || item.platform || item.role || item.place}
                          </td>
                          <td className="p-3.5 text-slate-400 truncate max-w-sm">
                            {item.description || item.shortDescription || item.url || item.category || item.version || '—'}
                          </td>
                          <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                            {item.enabled !== undefined && (item.enabled ? <span className="text-emerald-400">Enabled</span> : <span className="text-slate-500">Disabled</span>)}
                            {item.active !== undefined && (item.active ? <span className="text-emerald-400">Active</span> : <span className="text-slate-500">Inactive</span>)}
                            {item.published !== undefined && (item.published ? <span className="text-emerald-400">Published</span> : <span className="text-slate-500">Draft</span>)}
                            {item.status && <span className="text-blue-400">{item.status}</span>}
                          </td>
                          <td className="p-3.5 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setIsCreating(false);
                                setEditingItem({ ...item });
                              }}
                              className="p-1.5 rounded text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition"
                              title="Edit Item"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(activeTab, item.id, item.title || item.name || item.platform || item.place)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
