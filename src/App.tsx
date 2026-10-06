/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider, useData } from './context/DataContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { CurrentlySection } from './components/CurrentlySection.tsx';
import { JourneySection } from './components/JourneySection.tsx';
import { SkillsSection } from './components/SkillsSection.tsx';
import { ProjectsSection } from './components/ProjectsSection.tsx';
import { AppsSection } from './components/AppsSection.tsx';
import { CustomLinksSection } from './components/CustomLinksSection.tsx';
import { CertificatesSection } from './components/CertificatesSection.tsx';
import { YouTubeSection } from './components/YouTubeSection.tsx';
import { InstagramSection } from './components/InstagramSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { AchievementsSection } from './components/AchievementsSection.tsx';
import { ExperienceSection } from './components/ExperienceSection.tsx';
import { ResumeSection } from './components/ResumeSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { AnnouncementBanner } from './components/AnnouncementBanner.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { DigitalCardModal } from './components/DigitalCardModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { MaintenanceScreen } from './components/MaintenanceScreen.tsx';
import { AskHarshAIModal } from './components/AskHarshAIModal.tsx';
import { HarshzynxOS } from './components/HarshzynxOS.tsx';
import { NotificationCenterModal } from './components/NotificationCenterModal.tsx';
import { ChangelogSection } from './components/ChangelogSection.tsx';
import { LifeTravelSection } from './components/LifeTravelSection.tsx';
import { AdminLoginPage } from './components/admin/AdminLoginPage.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { Loader2 } from 'lucide-react';

function MainAppContent() {
  const { data, loading, error, refreshData } = useData();
  const { isAuthenticated } = useAuth();

  // Navigation / View state
  const [route, setRoute] = useState<'site' | 'admin' | 'card'>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/admin') || hash.includes('#admin')) return 'admin';
    if (path.includes('/card') || hash.includes('#card')) return 'card';
    return 'site';
  });

  const [searchOpen, setSearchOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [osModeActive, setOsModeActive] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  // Listen to path / hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('#admin')) {
        setRoute('admin');
      } else if (path.includes('/card') || hash.includes('#card')) {
        setRoute('site');
        setCardOpen(true);
      } else {
        setRoute('site');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-xs font-mono text-slate-400">Loading HARSHZYNX Portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-3">
          <h2 className="text-xl font-bold text-rose-400">Service Temporarily Unavailable</h2>
          <p className="text-xs text-slate-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white mt-4"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // Admin View
  if (route === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            setRoute('admin');
            refreshData();
          }}
          onBackToSite={() => {
            window.location.hash = '';
            setRoute('site');
            refreshData();
          }}
        />
      );
    }
    return (
      <AdminDashboard
        onBackToSite={() => {
          window.location.hash = '';
          setRoute('site');
          refreshData();
        }}
      />
    );
  }

  // Check Maintenance Mode (admin bypasses)
  if (data.settings?.maintenanceMode && !isAuthenticated) {
    return <MaintenanceScreen onOpenAdmin={() => setRoute('admin')} />;
  }

  const visibility = data.settings?.sectionsVisibility || {
    about: true,
    journey: true,
    skills: true,
    projects: true,
    apps: true,
    customLinks: true,
    currently: true,
    experience: true,
    achievements: true,
    certificates: true,
    youtube: true,
    instagram: true,
    gallery: true,
    blog: true,
    resume: true,
    contact: true,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 transition-colors">
      {/* Top Announcement Banner */}
      <AnnouncementBanner announcements={data.announcements} />

      {/* Primary Top Bar Navbar */}
      <Navbar
        settings={data.settings}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenCard={() => setCardOpen(true)}
        onOpenAdmin={() => setRoute('admin')}
        onOpenAI={() => setAiModalOpen(true)}
        onToggleOS={() => setOsModeActive(!osModeActive)}
        onOpenNotifications={() => setNotificationModalOpen(true)}
        notificationCount={(data.announcements?.length || 0) + 1}
        osModeActive={osModeActive}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          profile={data.profile}
          settings={data.settings}
          socialLinks={data.socialLinks}
          activeResume={data.activeResume}
          onOpenCard={() => setCardOpen(true)}
        />

        {/* Currently / Now Section */}
        {visibility.currently && <CurrentlySection currently={data.currently} />}

        {/* About Section */}
        {visibility.about && <AboutSection about={data.about} profile={data.profile} />}

        {/* Journey / Timeline Section */}
        {visibility.journey && <JourneySection timeline={data.timeline} />}

        {/* Skills Section */}
        {visibility.skills && <SkillsSection skills={data.skills} />}

        {/* Projects Section */}
        {visibility.projects && <ProjectsSection projects={data.projects} />}

        {/* Apps Section */}
        {visibility.apps && <AppsSection apps={data.apps} />}

        {/* Custom Links Manager Section */}
        {visibility.customLinks && <CustomLinksSection links={data.customLinks} />}

        {/* Experience Section */}
        {visibility.experience && <ExperienceSection experience={data.experience} />}

        {/* Achievements Section */}
        {visibility.achievements && <AchievementsSection achievements={data.achievements} />}

        {/* Certificates Section */}
        {visibility.certificates && <CertificatesSection certificates={data.certificates} />}

        {/* YouTube Section */}
        {visibility.youtube && <YouTubeSection videos={data.youtubeVideos} />}

        {/* Instagram Section */}
        {visibility.instagram && <InstagramSection posts={data.instagramPosts} />}

        {/* Blog & Articles Section */}
        {visibility.blog && <BlogSection posts={data.blogPosts} />}

        {/* System Changelog Section */}
        {data.changelog && data.changelog.length > 0 && (
          <ChangelogSection changelog={data.changelog} />
        )}

        {/* Life & Travel Section */}
        {data.lifeTravel && data.lifeTravel.length > 0 && (
          <LifeTravelSection lifeTravel={data.lifeTravel} />
        )}

        {/* Photo Gallery Section */}
        {visibility.gallery && <GallerySection gallery={data.gallery} />}

        {/* Resume Section */}
        {visibility.resume && <ResumeSection resume={data.activeResume} />}

        {/* Contact Section */}
        {visibility.contact && (
          <ContactSection profile={data.profile} settings={data.settings} />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={data.settings}
        socialLinks={data.socialLinks}
        onOpenAdmin={() => setRoute('admin')}
      />

      {/* Interactive OS Desktop Mode Overlay */}
      {osModeActive && (
        <HarshzynxOS
          data={data}
          onExitOS={() => setOsModeActive(false)}
          onOpenCard={() => setCardOpen(true)}
          onOpenAI={() => setAiModalOpen(true)}
        />
      )}

      {/* Ask Harsh AI Grounded Modal */}
      <AskHarshAIModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
        data={data}
      />

      {/* Modals & Floating Utilities */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        data={data}
      />

      <DigitalCardModal
        isOpen={cardOpen}
        onClose={() => setCardOpen(false)}
        profile={data.profile}
        socialLinks={data.socialLinks}
        activeResume={data.activeResume}
      />

      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
