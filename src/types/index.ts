export interface Profile {
  name: string;
  brandName: string;
  tagline: string;
  intro: string;
  avatarUrl: string;
  heroBackdropUrl: string;
  resumeUrl: string;
  location: string;
  email: string;
  phone: string;
  status: string;

  // Education Information
  college?: string;
  degree?: string;
  graduationYear?: string;
  twelfthSchool?: string;
  twelfthPercentage?: string;
  tenthSchool?: string;
  tenthPercentage?: string;
}

export interface About {
  name: string;
  shortBio: string;
  fullBio: string;
  location: string;
  education: string;
  university: string;
  graduationYear: string;
  interests: string[];
  careerGoals: string;

  // Synchronized Education Fields
  college?: string;
  degree?: string;
  twelfthSchool?: string;
  twelfthPercentage?: string;
  tenthSchool?: string;
  tenthPercentage?: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'Education' | 'Project' | 'Achievement' | 'Experience' | 'Milestone' | 'Other';
  image?: string;
  link?: string;
  featured: boolean;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
  level: number; // 0 - 100
  description?: string;
  order: number;
  enabled: boolean;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  detailedDescription: string;
  image: string;
  gallery: string[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  videoUrl?: string;
  problem?: string;
  solution?: string;
  features?: string[];
  results?: string;
  startDate?: string;
  completionDate?: string;
  status: 'In Progress' | 'Completed' | 'Beta' | 'Concept';
  featured: boolean;
  order: number;
  enabled: boolean;
}

export interface CustomLink {
  id: string;
  title: string;
  description: string;
  url: string;
  icon?: string;
  thumbnail?: string;
  category: string;
  buttonText: string;
  badge?: string;
  order: number;
  featured: boolean;
  active: boolean;
  openInNewTab: boolean;
  clickCount?: number;
}

export interface AppEntry {
  id: string;
  name: string;
  icon: string;
  description: string;
  screenshots: string[];
  playStoreUrl?: string;
  otherStoreUrl?: string;
  version: string;
  category: string;
  featured: boolean;
  status: 'Published' | 'In Development' | 'Beta' | 'Coming Soon';
  order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon?: string;
  description?: string;
  active: boolean;
  featured: boolean;
  order: number;
}

export interface InstagramPost {
  id: string;
  postUrl: string;
  image: string;
  caption: string;
  date: string;
  featured: boolean;
  order: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  description: string;
  category: string;
  date: string;
  featured: boolean;
  order: number;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  pdfUrl?: string;
  description: string;
  featured: boolean;
  order: number;
}

export interface ResumeEntry {
  id: string;
  title: string;
  fileUrl: string;
  version: string;
  uploadDate: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
  readTimeMinutes?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  date: string;
  featured: boolean;
  order: number;
}

export interface Currently {
  learning: string;
  building: string;
  focus: string;
  availability: 'Available' | 'Limited Availability' | 'Not Available';
  goals: string;
  lastUpdated?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  image?: string;
  link?: string;
  featured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  link?: string;
  logo?: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  link?: string;
  buttonText?: string;
  startDate: string;
  endDate?: string;
  active: boolean;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  breakingChanges: string[];
  published: boolean;
}

export interface LifeTravelEntry {
  id: string;
  place: string;
  date: string;
  description: string;
  photos: string[];
  story: string;
  link?: string;
  featured: boolean;
  order: number;
}

export interface ThemeCustomizer {
  primaryAccent: 'blue' | 'indigo' | 'cyan' | 'emerald' | 'violet';
  secondaryAccent: string;
  borderRadius: 'minimal' | 'rounded' | 'curved';
  cardStyle: 'glass' | 'solid' | 'bordered';
  glassIntensity: 'low' | 'medium' | 'high';
  animationIntensity: 'reduced' | 'subtle' | 'standard' | 'high';
  glowIntensity: 'none' | 'subtle' | 'vibrant';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  uiDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface AISettings {
  enabled: boolean;
  systemInstruction: string;
  allowedDataSources: string[];
  welcomeMessage: string;
  totalQueries: number;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  keywords: string;
}

export interface WebsiteSettings {
  siteTitle: string;
  logoText: string;
  heroTitle: string;
  heroDescription: string;
  footerText: string;
  contactEmail: string;
  theme: 'dark' | 'light';
  accentColor: string;
  maintenanceMode: boolean;
  osModeEnabled: boolean;
  easterEggsEnabled: boolean;
  themeCustomizer: ThemeCustomizer;
  aiSettings: AISettings;
  seoSettings: SEOSettings;
  sectionsVisibility: {
    about: boolean;
    journey: boolean;
    skills: boolean;
    projects: boolean;
    apps: boolean;
    customLinks: boolean;
    currently: boolean;
    experience: boolean;
    achievements: boolean;
    certificates: boolean;
    youtube: boolean;
    instagram: boolean;
    gallery: boolean;
    blog: boolean;
    resume: boolean;
    contact: boolean;
    changelog: boolean;
    lifeTravel: boolean;
  };
}

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'project_view' | 'link_click' | 'app_click' | 'resume_download' | 'contact_submit';
  path: string;
  targetId?: string;
  timestamp: string;
  userAgent?: string;
}

export interface LinkAnalytics {
  id: string;
  targetUrl: string;
  label: string;
  category: string;
  clickCount: number;
  lastClickedAt: string;
  firstClickedAt: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  adminEmail: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DatabaseSchema {
  admins: AdminUser[];
  profile: Profile;
  about: About;
  timeline: TimelineEntry[];
  skills: Skill[];
  projects: Project[];
  custom_links: CustomLink[];
  apps: AppEntry[];
  social_links: SocialLink[];
  instagram_posts: InstagramPost[];
  youtube_videos: YouTubeVideo[];
  certificates: Certificate[];
  resumes: ResumeEntry[];
  blog_posts: BlogPost[];
  gallery: GalleryItem[];
  currently: Currently;
  achievements: Achievement[];
  experience: Experience[];
  contact_messages: ContactMessage[];
  announcements: Announcement[];
  changelog: ChangelogEntry[];
  life_travel: LifeTravelEntry[];
  link_analytics: LinkAnalytics[];
  website_settings: WebsiteSettings;
  analytics_events: AnalyticsEvent[];
  activity_logs: ActivityLog[];
}
