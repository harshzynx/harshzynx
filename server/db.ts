import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { DatabaseSchema } from '../src/types/index.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

const INITIAL_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'harshsharma18089@gmail.com';
const INITIAL_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Harshzynx@2026';

function getDefaultDatabase(): DatabaseSchema {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(INITIAL_ADMIN_PASSWORD, salt);

  return {
    admins: [
      {
        id: 'admin_initial',
        email: INITIAL_ADMIN_EMAIL.toLowerCase().trim(),
        passwordHash,
        createdAt: new Date().toISOString(),
      },
    ],
    profile: {
      name: 'Harsh Raj',
      brandName: 'HARSHZYNX',
      tagline: 'Developer · Android & Web Architect · Data Science Learner',
      intro: '',
      avatarUrl: '',
      heroBackdropUrl: '',
      resumeUrl: '',
      location: 'India',
      email: INITIAL_ADMIN_EMAIL,
      phone: '',
      status: 'Available',
      college: '',
      degree: '',
      graduationYear: '',
      twelfthSchool: '',
      twelfthPercentage: '',
      tenthSchool: '',
      tenthPercentage: '',
    },
    about: {
      name: 'Harsh Raj',
      shortBio: '',
      fullBio: '',
      location: 'India',
      education: '',
      university: '',
      graduationYear: '',
      interests: [
        'Android (Kotlin, Jetpack)',
        'Full-Stack Web (React, Node.js, TypeScript)',
        'Data Science & Predictive Modeling',
        'Clean Architecture & APIs',
        'Open Source Software',
      ],
      careerGoals: '',
      college: '',
      degree: '',
      twelfthSchool: '',
      twelfthPercentage: '',
      tenthSchool: '',
      tenthPercentage: '',
    },
    timeline: [
      {
        id: 'timeline_1',
        year: '2023',
        title: 'Commenced Computer Science Studies',
        description: 'Began academic journey diving deep into data structures, algorithms, and core computing principles.',
        category: 'Education',
        featured: true,
        order: 1,
      },
      {
        id: 'timeline_2',
        year: '2024',
        title: 'Android & Full-Stack Exploration',
        description: 'Developed native Android apps and modern responsive web systems with TypeScript and Node.js.',
        category: 'Milestone',
        featured: true,
        order: 2,
      },
      {
        id: 'timeline_3',
        year: '2025',
        title: 'Data Science & Machine Learning Deep Dive',
        description: 'Explored data analytics pipelines, exploratory data analysis, and predictive model training.',
        category: 'Milestone',
        featured: true,
        order: 3,
      },
      {
        id: 'timeline_4',
        year: '2026',
        title: 'HARSHZYNX Brand Platform Launch',
        description: 'Launched official personal brand hub and self-hosted content management platform.',
        category: 'Project',
        featured: true,
        order: 4,
      },
    ],
    skills: [
      { id: 'sk_1', name: 'TypeScript / JavaScript', category: 'Programming', icon: 'Code', level: 90, order: 1, enabled: true },
      { id: 'sk_2', name: 'Kotlin / Java', category: 'Android', icon: 'Smartphone', level: 85, order: 2, enabled: true },
      { id: 'sk_3', name: 'Python', category: 'Data Science', icon: 'Terminal', level: 80, order: 3, enabled: true },
      { id: 'sk_4', name: 'React & Next.js', category: 'Web Development', icon: 'Layers', level: 88, order: 4, enabled: true },
      { id: 'sk_5', name: 'Node.js & Express', category: 'Web Development', icon: 'Server', level: 84, order: 5, enabled: true },
      { id: 'sk_6', name: 'Android SDK & Jetpack', category: 'Android', icon: 'Cpu', level: 82, order: 6, enabled: true },
      { id: 'sk_7', name: 'Data Analysis (Pandas, NumPy)', category: 'Data Science', icon: 'BarChart3', level: 78, order: 7, enabled: true },
      { id: 'sk_8', name: 'Tailwind CSS', category: 'Web Development', icon: 'Palette', level: 92, order: 8, enabled: true },
      { id: 'sk_9', name: 'PostgreSQL & SQLite', category: 'Database', icon: 'Database', level: 80, order: 9, enabled: true },
      { id: 'sk_10', name: 'Git & GitHub Workflows', category: 'Tools', icon: 'GitBranch', level: 88, order: 10, enabled: true },
    ],
    projects: [
      {
        id: 'proj_1',
        slug: 'harshzynx-brand-platform',
        name: 'HARSHZYNX Brand Platform',
        shortDescription: 'Production full-stack personal brand ecosystem with custom CMS, OS mode, and analytics.',
        detailedDescription: 'Engineered a modern, high-performance personal digital brand platform featuring dynamic content management, real-time analytics, and mobile-friendly digital business card.',
        image: '/src/assets/images/harsh_developer_portrait_1791264967532.jpg',
        gallery: [],
        technologies: ['React 19', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
        category: 'Web Development',
        githubUrl: 'https://github.com/harshsharma18089',
        problem: 'Needed a unified, self-hosted platform allowing instant updates without modifying source code.',
        solution: 'Built a headless API with atomic file database persistence, multi-tab CMS, and responsive public showcase.',
        features: [
          'Full-featured admin dashboard with real-time editing',
          'First-party privacy-respecting analytics',
          'PWA support, Digital Business Card, and OS Mode',
        ],
        status: 'Completed',
        featured: true,
        order: 1,
        enabled: true,
      },
    ],
    custom_links: [
      {
        id: 'link_1',
        title: 'GitHub Repositories',
        description: 'Explore my open source code, Android projects, and web experiments.',
        url: 'https://github.com/harshsharma18089',
        icon: 'Github',
        category: 'Code',
        buttonText: 'View GitHub',
        badge: 'Open Source',
        order: 1,
        featured: true,
        active: true,
        openInNewTab: true,
        clickCount: 0,
      },
      {
        id: 'link_2',
        title: 'LinkedIn Network',
        description: 'Connect professionally and view career updates.',
        url: 'https://www.linkedin.com',
        icon: 'Linkedin',
        category: 'Professional',
        buttonText: 'Connect on LinkedIn',
        badge: 'Network',
        order: 2,
        featured: true,
        active: true,
        openInNewTab: true,
        clickCount: 0,
      },
    ],
    apps: [
      {
        id: 'app_1',
        name: 'Radha Jap',
        icon: 'HeartHandshake',
        description: 'A serene spiritual chanting and counting Android application built for focused daily mindfulness.',
        screenshots: [],
        playStoreUrl: '',
        version: '1.0.0',
        category: 'Lifestyle & Android',
        featured: true,
        status: 'In Development',
        order: 1,
      },
    ],
    social_links: [
      { id: 'soc_1', platform: 'GitHub', username: 'harshsharma18089', url: 'https://github.com/harshsharma18089', icon: 'Github', active: true, featured: true, order: 1 },
      { id: 'soc_2', platform: 'LinkedIn', username: 'Harsh Raj', url: 'https://linkedin.com', icon: 'Linkedin', active: true, featured: true, order: 2 },
      { id: 'soc_3', platform: 'X', username: 'harshzynx', url: 'https://x.com', icon: 'Twitter', active: true, featured: true, order: 3 },
      { id: 'soc_4', platform: 'Instagram', username: 'harshzynx', url: 'https://instagram.com', icon: 'Instagram', active: true, featured: true, order: 4 },
      { id: 'soc_5', platform: 'YouTube', username: 'HARSHZYNX', url: 'https://youtube.com', icon: 'Youtube', active: true, featured: false, order: 5 },
    ],
    instagram_posts: [],
    youtube_videos: [],
    certificates: [],
    resumes: [],
    blog_posts: [
      {
        id: 'post_1',
        slug: 'building-harshzynx-personal-brand',
        title: 'Architecting HARSHZYNX: Why I Built My Own Headless Portfolio & CMS',
        excerpt: 'An inside look into designing a responsive developer platform with self-hosted database persistence and zero third-party dependencies.',
        content: `As developers, we frequently default to static template generators or third-party hosting that locks our personal content behind external services. 

When building **HARSHZYNX**, my goal was simple: complete sovereignty over my digital presence.

### Key Architectural Tenets:
1. **Zero Fake Metrics:** Real information only.
2. **Instant Content Control:** Full CMS allowing instant updates to projects, links, skills, and timeline entries without git commits.
3. **Privacy First:** First-party event analytics that never track cookies or invasive user fingerprinting.

I'm excited to keep iterating on this platform as I advance further in Android development and Data Science.`,
        category: 'Engineering',
        tags: ['Architecture', 'TypeScript', 'CMS', 'Personal Brand'],
        author: 'Harsh Raj',
        date: new Date().toISOString().split('T')[0],
        featured: true,
        published: true,
        seoTitle: 'Architecting HARSHZYNX — Harsh Raj',
        seoDescription: 'Why I built my own full-stack personal brand platform and headless CMS.',
        readTimeMinutes: 4,
      },
    ],
    gallery: [],
    currently: {
      learning: 'Data Science & Deep Learning Pipelines',
      building: 'HARSHZYNX Ecosystem & Native Android Utilities',
      focus: 'Scalable Full-Stack Architecture & Applied Machine Learning',
      availability: 'Available',
      goals: 'Publishing quality open-source tools and mastering end-to-end data pipelines',
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    achievements: [],
    experience: [
      {
        id: 'exp_1',
        role: 'Full-Stack & Android Developer',
        organization: 'Independent / Freelance',
        startDate: '2024-01',
        isCurrent: true,
        description: 'Designing bespoke web applications, responsive user interfaces, and exploring Android applications with Jetpack Compose.',
        technologies: ['React', 'Kotlin', 'TypeScript', 'Node.js', 'Tailwind CSS'],
        order: 1,
      },
    ],
    contact_messages: [],
    announcements: [
      {
        id: 'ann_1',
        title: 'Welcome to HARSHZYNX!',
        description: 'The official digital portfolio and personal platform for Harsh Raj is now live with CMS and OS Mode.',
        link: '#projects',
        buttonText: 'Explore Projects',
        startDate: new Date().toISOString().split('T')[0],
        active: true,
      },
    ],
    changelog: [
      {
        id: 'ch_1',
        version: '1.0.0',
        date: new Date().toISOString().split('T')[0],
        title: 'Initial Production Release of HARSHZYNX',
        features: [
          'Full-stack architecture with Express & Vite middleware',
          'Administrative CMS with real-time database persistence',
          'HARSHZYNX OS Mode desktop environment',
          'Ask Harsh AI assistant grounded strictly on database facts',
          'First-party privacy analytics and link tracking',
        ],
        improvements: [
          'Optimized dark-first styling with Plus Jakarta Sans',
          'Mobile-first Digital Business Card with real QR code generator',
        ],
        fixes: [
          'Zero external dependency failures or fake telemetry',
        ],
        breakingChanges: [],
        published: true,
      },
    ],
    life_travel: [],
    link_analytics: [],
    website_settings: {
      siteTitle: 'HARSHZYNX — Harsh Raj Portfolio & CMS',
      logoText: 'HARSHZYNX',
      heroTitle: 'HARSHZYNX',
      heroDescription: 'Official portfolio and digital identity of Harsh Raj — Developer, Android builder, and Data Science learner.',
      footerText: 'HARSHZYNX — All Rights Reserved',
      contactEmail: INITIAL_ADMIN_EMAIL,
      theme: 'dark',
      accentColor: 'blue',
      maintenanceMode: false,
      osModeEnabled: true,
      easterEggsEnabled: true,
      themeCustomizer: {
        primaryAccent: 'blue',
        secondaryAccent: '#60a5fa',
        borderRadius: 'rounded',
        cardStyle: 'glass',
        glassIntensity: 'medium',
        animationIntensity: 'standard',
        glowIntensity: 'subtle',
        buttonStyle: 'rounded',
        uiDensity: 'comfortable',
      },
      aiSettings: {
        enabled: true,
        systemInstruction: 'You are Ask Harsh AI, the official verified personal assistant for Harsh Raj (HARSHZYNX). Answer questions ONLY based on the provided portfolio and database facts. Never fabricate projects, companies, experience, or contacts.',
        allowedDataSources: ['profile', 'about', 'projects', 'skills', 'apps', 'timeline', 'currently'],
        welcomeMessage: 'Hi! I am the verified AI assistant for Harsh Raj (HARSHZYNX). Ask me about my skills, projects, Android development, or experience!',
        totalQueries: 0,
      },
      seoSettings: {
        metaTitle: 'HARSHZYNX — Harsh Raj Portfolio & CMS',
        metaDescription: 'Official personal brand platform of Harsh Raj — Developer, Android architect & Data Science learner.',
        ogTitle: 'HARSHZYNX — Harsh Raj Portfolio',
        ogDescription: 'Official personal brand platform and portfolio of Harsh Raj.',
        ogImage: '/src/assets/images/harsh_developer_portrait_1791264967532.jpg',
        canonicalUrl: 'https://harshzynx.dev',
        keywords: 'Harsh Raj, HARSHZYNX, Developer, Android, Web, Data Science, Portfolio',
      },
      sectionsVisibility: {
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
        changelog: true,
        lifeTravel: true,
      },
    },
    analytics_events: [],
    activity_logs: [
      {
        id: 'act_1',
        action: 'System Initialized',
        details: 'Initial database bootstrap completed with secure admin account.',
        timestamp: new Date().toISOString(),
        adminEmail: INITIAL_ADMIN_EMAIL,
      },
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        const defaults = getDefaultDatabase();

        // Sanitize test/demo values from profile if encountered
        const parsedProfile = parsed.profile || {};
        if (parsedProfile.name === 'Harsh Raj Test') parsedProfile.name = 'Harsh Raj';
        if (parsedProfile.tagline === 'Test Tagline') parsedProfile.tagline = '';
        if (parsedProfile.intro === 'Test Intro') parsedProfile.intro = '';

        return {
          ...defaults,
          ...parsed,
          profile: {
            ...defaults.profile,
            ...parsedProfile,
          },
          about: {
            ...defaults.about,
            ...(parsed.about || {}),
          },
          website_settings: {
            ...defaults.website_settings,
            ...(parsed.website_settings || {}),
            themeCustomizer: {
              ...defaults.website_settings.themeCustomizer,
              ...(parsed.website_settings?.themeCustomizer || {}),
            },
            aiSettings: {
              ...defaults.website_settings.aiSettings,
              ...(parsed.website_settings?.aiSettings || {}),
            },
            seoSettings: {
              ...defaults.website_settings.seoSettings,
              ...(parsed.website_settings?.seoSettings || {}),
            },
            sectionsVisibility: {
              ...defaults.website_settings.sectionsVisibility,
              ...(parsed.website_settings?.sectionsVisibility || {}),
            },
          },
        };
      }
    } catch (err) {
      console.error('Error reading database file, resetting to default schema:', err);
    }

    const defaultData = getDefaultDatabase();
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave: DatabaseSchema) {
    this.ensureDirectory();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    const serialized = JSON.stringify(dataToSave, null, 2);
    const fd = fs.openSync(tempFile, 'w');
    fs.writeSync(fd, serialized);
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fs.renameSync(tempFile, DB_FILE);
  }

  public save() {
    this.saveData(this.data);
  }

  public get<K extends keyof DatabaseSchema>(key: K): DatabaseSchema[K] {
    return this.data[key];
  }

  public set<K extends keyof DatabaseSchema>(key: K, value: DatabaseSchema[K]) {
    this.data[key] = value;
    this.save();
  }

  public getAll(): DatabaseSchema {
    return this.data;
  }

  public logActivity(action: string, details: string, adminEmail: string) {
    const log = {
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action,
      details,
      timestamp: new Date().toISOString(),
      adminEmail,
    };
    this.data.activity_logs.unshift(log);
    if (this.data.activity_logs.length > 250) {
      this.data.activity_logs = this.data.activity_logs.slice(0, 250);
    }
    this.save();
  }

  public recordAnalytics(type: DatabaseSchema['analytics_events'][0]['type'], path: string, targetId?: string, userAgent?: string) {
    const event = {
      id: `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      path,
      targetId,
      timestamp: new Date().toISOString(),
      userAgent: userAgent ? userAgent.substring(0, 150) : undefined,
    };
    this.data.analytics_events.unshift(event);
    if (this.data.analytics_events.length > 5000) {
      this.data.analytics_events = this.data.analytics_events.slice(0, 5000);
    }
    this.save();
  }

  public trackLinkClick(targetUrl: string, label: string, category: string = 'General') {
    if (!this.data.link_analytics) {
      this.data.link_analytics = [];
    }
    const existing = this.data.link_analytics.find((l) => l.targetUrl === targetUrl);
    const now = new Date().toISOString();
    if (existing) {
      existing.clickCount += 1;
      existing.lastClickedAt = now;
      existing.label = label || existing.label;
    } else {
      this.data.link_analytics.push({
        id: `link_an_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        targetUrl,
        label: label || targetUrl,
        category,
        clickCount: 1,
        firstClickedAt: now,
        lastClickedAt: now,
      });
    }

    // Also update custom link clickCount if exists
    const customLink = this.data.custom_links.find((cl) => cl.url === targetUrl);
    if (customLink) {
      customLink.clickCount = (customLink.clickCount || 0) + 1;
    }

    this.save();
  }

  public reorderItems(collectionKey: keyof DatabaseSchema, orderedIds: string[]) {
    const items = this.data[collectionKey] as any[];
    if (!Array.isArray(items)) return;
    const itemMap = new Map(items.map((i) => [i.id, i]));
    const reordered: any[] = [];

    orderedIds.forEach((id, index) => {
      const item = itemMap.get(id);
      if (item) {
        item.order = index + 1;
        reordered.push(item);
        itemMap.delete(id);
      }
    });

    // Append any unmentioned items
    itemMap.forEach((item) => {
      item.order = reordered.length + 1;
      reordered.push(item);
    });

    (this.data as any)[collectionKey] = reordered;
    this.save();
  }
}

export const db = new Database();
