import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { GoogleGenAI } from '@google/genai';
import { db } from '../db.ts';
import { generateToken, requireAdmin } from '../auth.ts';
import type { AuthenticatedRequest } from '../auth.ts';
import type {
  Profile,
  About,
  Project,
  Skill,
  CustomLink,
  AppEntry,
  SocialLink,
  InstagramPost,
  YouTubeVideo,
  Certificate,
  ResumeEntry,
  BlogPost,
  GalleryItem,
  Achievement,
  Experience,
  TimelineEntry,
  Announcement,
  ChangelogEntry,
  LifeTravelEntry,
} from '../../src/types/index.ts';

const router = Router();

// Ensure all API endpoints never serve stale browser or proxy cache
router.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Configure Multer for secure file uploads
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${cleanBase}_${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDF files are allowed.'));
    }
  },
});

// URL validation helper (prevents javascript: or malicious protocol schemes)
function isValidUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  const trimmed = rawUrl.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:';
  } catch {
    return false;
  }
}

// Google GenAI client initialization (server-side only)
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/* ==========================================
   PUBLIC ROUTES
   ========================================== */

// 1. Get Public Website Data
router.get('/public/data', (_req: Request, res: Response) => {
  const settings = db.get('website_settings');
  const profile = db.get('profile');
  const about = db.get('about');
  const currently = db.get('currently');

  const skills = db.get('skills').filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  const projects = db.get('projects').filter((p) => p.enabled).sort((a, b) => a.order - b.order);
  const customLinks = db.get('custom_links').filter((l) => l.active).sort((a, b) => a.order - b.order);
  const apps = db.get('apps').sort((a, b) => a.order - b.order);
  const socialLinks = db.get('social_links').filter((s) => s.active).sort((a, b) => a.order - b.order);
  const instagramPosts = db.get('instagram_posts').sort((a, b) => a.order - b.order);
  const youtubeVideos = db.get('youtube_videos').sort((a, b) => a.order - b.order);
  const certificates = db.get('certificates').sort((a, b) => a.order - b.order);
  const resumes = db.get('resumes').filter((r) => r.active);
  const blogPosts = db.get('blog_posts').filter((b) => b.published).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const gallery = db.get('gallery').sort((a, b) => a.order - b.order);
  const achievements = db.get('achievements').sort((a, b) => a.order - b.order);
  const experience = db.get('experience').sort((a, b) => a.order - b.order);
  const timeline = db.get('timeline').sort((a, b) => a.order - b.order);
  const activeAnnouncements = db.get('announcements').filter((a) => a.active);
  const changelog = (db.get('changelog') || []).filter((c) => c.published);
  const lifeTravel = (db.get('life_travel') || []).sort((a, b) => a.order - b.order);

  res.json({
    success: true,
    data: {
      settings,
      profile,
      about,
      currently,
      skills,
      projects,
      customLinks,
      apps,
      socialLinks,
      instagramPosts,
      youtubeVideos,
      certificates,
      activeResume: resumes[0] || null,
      blogPosts,
      gallery,
      achievements,
      experience,
      timeline,
      announcements: activeAnnouncements,
      changelog,
      lifeTravel,
    },
  });
});

// 2. Public Project Details
router.get('/public/projects/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const project = db.get('projects').find((p) => p.slug === slug && p.enabled);
  if (!project) {
    res.status(404).json({ success: false, error: 'Project not found' });
    return;
  }
  res.json({ success: true, data: project });
});

// 3. Public Blog Post Details
router.get('/public/blog/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const post = db.get('blog_posts').find((p) => p.slug === slug && p.published);
  if (!post) {
    res.status(404).json({ success: false, error: 'Article not found' });
    return;
  }
  res.json({ success: true, data: post });
});

// 4. Contact Form Submission
router.post('/public/contact', (req: Request, res: Response) => {
  const { name, email, message, website } = req.body;

  if (website) {
    res.json({ success: true, message: 'Message received' });
    return;
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ success: false, error: 'Please enter a valid name.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ success: false, error: 'Please enter a message with at least 5 characters.' });
    return;
  }

  const newMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    read: false,
    archived: false,
  };

  const messages = db.get('contact_messages');
  messages.unshift(newMessage);
  db.set('contact_messages', messages);

  db.recordAnalytics('contact_submit', '/contact', newMessage.id, req.headers['user-agent']);

  res.json({
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
    id: newMessage.id,
  });
});

// 5. Record Analytics Event
router.post('/public/analytics', (req: Request, res: Response) => {
  const { type, path: reqPath, targetId } = req.body;
  if (!type || !reqPath) {
    res.status(400).json({ success: false, error: 'Missing analytics parameters' });
    return;
  }

  const allowedTypes = ['page_view', 'project_view', 'link_click', 'app_click', 'resume_download', 'contact_submit'];
  if (!allowedTypes.includes(type)) {
    res.status(400).json({ success: false, error: 'Invalid analytics event type' });
    return;
  }

  db.recordAnalytics(type, reqPath, targetId, req.headers['user-agent']);
  res.json({ success: true });
});

// 6. Track External Link Click
router.post('/public/track-link', (req: Request, res: Response) => {
  const { targetUrl, label, category } = req.body;
  if (!targetUrl) {
    res.status(400).json({ success: false, error: 'Missing targetUrl' });
    return;
  }
  db.trackLinkClick(targetUrl, label || targetUrl, category || 'Link');
  db.recordAnalytics('link_click', targetUrl, label, req.headers['user-agent']);
  res.json({ success: true });
});

// 7. Ask Harsh AI (Grounded strictly on database facts)
router.post('/public/ai/ask', async (req: Request, res: Response) => {
  const { question } = req.body;
  const settings = db.get('website_settings');

  if (!settings.aiSettings?.enabled) {
    res.status(403).json({ success: false, error: 'Ask Harsh AI is currently disabled by the owner.' });
    return;
  }

  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    res.status(400).json({ success: false, error: 'Please enter a valid question.' });
    return;
  }

  // Increment totalQueries
  settings.aiSettings.totalQueries = (settings.aiSettings.totalQueries || 0) + 1;
  db.set('website_settings', settings);

  // Compile grounded context from DB
  const profile = db.get('profile');
  const about = db.get('about');
  const currently = db.get('currently');
  const skills = db.get('skills').filter((s) => s.enabled);
  const projects = db.get('projects').filter((p) => p.enabled);
  const apps = db.get('apps');
  const timeline = db.get('timeline');

  const knowledgeContext = `
Grounded Information about Harsh Raj (HARSHZYNX):
Name: ${profile.name}
Brand Name: ${profile.brandName}
Tagline: ${profile.tagline}
Bio: ${about.fullBio}
Education: ${about.education} at ${about.university} (Class of ${about.graduationYear})
Career Goals: ${about.careerGoals}
Interests: ${about.interests.join(', ')}
Location: ${profile.location}
Email: ${profile.email}
Availability: ${currently.availability}
Currently Learning: ${currently.learning}
Currently Building: ${currently.building}
Current Technical Focus: ${currently.focus}

Skills:
${skills.map((s) => `- ${s.name} (${s.category}, level: ${s.level}%)`).join('\n')}

Projects:
${projects.map((p) => `- ${p.name}: ${p.shortDescription}. Technologies: ${p.technologies.join(', ')}. Status: ${p.status}.`).join('\n')}

Android Apps:
${apps.map((a) => `- ${a.name} (v${a.version}, status: ${a.status}): ${a.description}`).join('\n')}

Milestones:
${timeline.map((t) => `- ${t.year} [${t.category}]: ${t.title} - ${t.description}`).join('\n')}
`;

  const systemInstruction = `${settings.aiSettings.systemInstruction}

CRITICAL RULES:
1. Answer ONLY using the facts provided in the Grounded Information above.
2. NEVER fabricate past jobs, followers, university degrees, or projects not in the text.
3. If the user asks about something not in the grounded text, respond politely that Harsh has not published that detail yet.
4. Keep responses concise, professional, warm, and developer-oriented.`;

  // Try calling Gemini API via @google/genai SDK
  if (aiClient) {
    try {
      const geminiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: question.trim(),
        config: {
          systemInstruction: `${systemInstruction}\n\n${knowledgeContext}`,
          temperature: 0.2, // low temperature for high grounding accuracy
        },
      });

      const answer = geminiResponse.text;
      if (answer) {
        res.json({ success: true, answer: answer.trim() });
        return;
      }
    } catch (err) {
      console.error('Gemini API call error, falling back to local grounded reasoning:', err);
    }
  }

  // Fallback Grounded Keyword Matching
  const q = question.toLowerCase();
  let fallbackAnswer = '';

  if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('framework')) {
    fallbackAnswer = `Harsh's core technical skills include ${skills.map((s) => s.name).slice(0, 6).join(', ')}, and more across Android, Data Science, and Web Development.`;
  } else if (q.includes('project') || q.includes('build') || q.includes('work')) {
    fallbackAnswer = `Harsh is currently building the ${currently.building}. Featured projects include ${projects.map((p) => p.name).join(', ')}.`;
  } else if (q.includes('android') || q.includes('app') || q.includes('play store') || q.includes('radha')) {
    const appList = apps.map((a) => `${a.name} (${a.status})`).join(', ');
    fallbackAnswer = `Harsh develops native Android applications using Kotlin and Jetpack. Current apps include ${appList}.`;
  } else if (q.includes('education') || q.includes('college') || q.includes('university') || q.includes('degree')) {
    fallbackAnswer = `Harsh is pursuing a ${about.education} at ${about.university}, graduating in ${about.graduationYear}.`;
  } else if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('available')) {
    fallbackAnswer = `Harsh is currently ${currently.availability}. You can contact him directly at ${profile.email} or via the contact form on this site.`;
  } else if (q.includes('who') || q.includes('about') || q.includes('harsh')) {
    fallbackAnswer = `${profile.name} (${profile.brandName}) is a ${profile.tagline}. ${about.shortBio}`;
  } else {
    fallbackAnswer = `Harsh Raj (HARSHZYNX) is an Android & Full-Stack developer and Data Science learner. For specific details on his projects, skills, or collaboration opportunities, feel free to ask or contact him directly at ${profile.email}.`;
  }

  res.json({ success: true, answer: fallbackAnswer });
});

/* ==========================================
   AUTHENTICATION ROUTES
   ========================================== */

// Admin Login
router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  const admins = db.get('admins');
  const admin = admins.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());

  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    res.status(401).json({ success: false, error: 'Invalid email or password.' });
    return;
  }

  admin.lastLoginAt = new Date().toISOString();
  db.set('admins', admins);

  const token = generateToken({ id: admin.id, email: admin.email });
  db.logActivity('Admin Login', `Logged in from ${req.ip || 'web'}`, admin.email);

  res.json({
    success: true,
    token,
    admin: { id: admin.id, email: admin.email, lastLoginAt: admin.lastLoginAt },
  });
});

// Verify Current Admin
router.get('/auth/me', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const admins = db.get('admins');
  const admin = admins.find((a) => a.id === req.user?.id);
  if (!admin) {
    res.status(404).json({ success: false, error: 'Admin not found' });
    return;
  }
  res.json({
    success: true,
    admin: { id: admin.id, email: admin.email, lastLoginAt: admin.lastLoginAt, createdAt: admin.createdAt },
  });
});

// Change Password
router.post('/auth/change-password', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({
      success: false,
      error: 'New password must be at least 8 characters long.',
    });
    return;
  }

  const admins = db.get('admins');
  const adminIndex = admins.findIndex((a) => a.id === req.user?.id);
  if (adminIndex === -1) {
    res.status(404).json({ success: false, error: 'Admin not found.' });
    return;
  }

  const admin = admins[adminIndex];
  if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    res.status(400).json({ success: false, error: 'Incorrect current password.' });
    return;
  }

  const salt = bcrypt.genSaltSync(10);
  admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  admins[adminIndex] = admin;
  db.set('admins', admins);

  db.logActivity('Password Changed', 'Admin password was updated successfully.', admin.email);
  res.json({ success: true, message: 'Password updated successfully.' });
});

/* ==========================================
   ADMIN CMS ROUTES (Protected)
   ========================================== */

// General File Upload
router.post('/upload', requireAdmin, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No file uploaded or invalid file type.' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  db.logActivity('File Uploaded', `Uploaded file: ${req.file.originalname}`, req.user!.email);
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    size: req.file.size,
    mimetype: req.file.mimetype,
  });
});

// Dedicated Profile Photo Upload: Saves file to disk, removes old uploaded avatar safely, and updates DB immediately
router.post('/admin/profile/photo', requireAdmin, upload.single('file'), (req: AuthenticatedRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ success: false, error: 'No photo uploaded or invalid image format.' });
    return;
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const currentProfile = db.get('profile') || ({} as Profile);
  const oldAvatar = currentProfile.avatarUrl;

  // Safely cleanup previous uploaded avatar from disk if it was stored in /uploads
  if (oldAvatar && typeof oldAvatar === 'string' && oldAvatar.startsWith('/uploads/')) {
    const oldFilename = path.basename(oldAvatar);
    if (oldFilename !== req.file.filename) {
      const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
      if (fs.existsSync(oldFilePath)) {
        try {
          fs.unlinkSync(oldFilePath);
        } catch (err) {
          console.warn('Could not remove previous avatar file:', err);
        }
      }
    }
  }

  // Update profile record directly in persistent database
  const updatedProfile: Profile = {
    ...currentProfile,
    avatarUrl: fileUrl,
  };
  db.set('profile', updatedProfile);
  db.logActivity('Profile Photo Updated', `New profile photo saved permanently: ${req.file.filename}`, req.user!.email);

  res.json({
    success: true,
    url: fileUrl,
    profile: updatedProfile,
  });
});

// Get Complete CMS Data
router.get('/admin/all-data', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const allData = db.getAll();
  const safeAdmins = allData.admins.map(({ id, email, createdAt, lastLoginAt }) => ({
    id,
    email,
    createdAt,
    lastLoginAt,
  }));
  res.json({
    success: true,
    data: {
      ...allData,
      admins: safeAdmins,
    },
  });
});

// Update Profile & Education Details
router.put('/admin/profile', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const newProfile = req.body;
  if (!newProfile || typeof newProfile !== 'object') {
    res.status(400).json({ success: false, error: 'Invalid profile data provided.' });
    return;
  }

  const currentProfile = db.get('profile') || ({} as Profile);
  const oldAvatar = currentProfile.avatarUrl;

  // If avatar was replaced or removed and old avatar was an uploaded file in /uploads, safely delete it
  if (oldAvatar && typeof oldAvatar === 'string' && oldAvatar.startsWith('/uploads/') && oldAvatar !== newProfile.avatarUrl) {
    const oldFilename = path.basename(oldAvatar);
    const oldFilePath = path.join(UPLOADS_DIR, oldFilename);
    if (fs.existsSync(oldFilePath)) {
      try {
        fs.unlinkSync(oldFilePath);
      } catch (err) {
        console.warn('Could not remove previous avatar file:', err);
      }
    }
  }

  // Construct sanitized profile record
  const updatedProfile: Profile = {
    ...currentProfile,
    ...newProfile,
    name: newProfile.name !== undefined ? String(newProfile.name).trim() : currentProfile.name,
    brandName: newProfile.brandName !== undefined ? String(newProfile.brandName).trim() : currentProfile.brandName,
    tagline: newProfile.tagline !== undefined ? String(newProfile.tagline).trim() : (currentProfile.tagline || ''),
    intro: newProfile.intro !== undefined ? String(newProfile.intro).trim() : (currentProfile.intro || ''),
    avatarUrl: newProfile.avatarUrl !== undefined ? String(newProfile.avatarUrl).trim() : (currentProfile.avatarUrl || ''),
    email: newProfile.email !== undefined ? String(newProfile.email).trim() : (currentProfile.email || ''),
    location: newProfile.location !== undefined ? String(newProfile.location).trim() : (currentProfile.location || ''),
    status: newProfile.status !== undefined ? String(newProfile.status).trim() : (currentProfile.status || ''),
    college: newProfile.college !== undefined ? String(newProfile.college).trim() : (currentProfile.college || ''),
    degree: newProfile.degree !== undefined ? String(newProfile.degree).trim() : (currentProfile.degree || ''),
    graduationYear: newProfile.graduationYear !== undefined ? String(newProfile.graduationYear).trim() : (currentProfile.graduationYear || ''),
    twelfthSchool: newProfile.twelfthSchool !== undefined ? String(newProfile.twelfthSchool).trim() : (currentProfile.twelfthSchool || ''),
    twelfthPercentage: newProfile.twelfthPercentage !== undefined ? String(newProfile.twelfthPercentage).trim() : (currentProfile.twelfthPercentage || ''),
    tenthSchool: newProfile.tenthSchool !== undefined ? String(newProfile.tenthSchool).trim() : (currentProfile.tenthSchool || ''),
    tenthPercentage: newProfile.tenthPercentage !== undefined ? String(newProfile.tenthPercentage).trim() : (currentProfile.tenthPercentage || ''),
  };

  db.set('profile', updatedProfile);

  // Synchronize education fields with about
  const currentAbout = db.get('about') || ({} as About);
  const updatedAbout: About = {
    ...currentAbout,
    university: updatedProfile.college || currentAbout.university || '',
    college: updatedProfile.college || '',
    education: updatedProfile.degree || currentAbout.education || '',
    degree: updatedProfile.degree || '',
    graduationYear: updatedProfile.graduationYear || currentAbout.graduationYear || '',
    twelfthSchool: updatedProfile.twelfthSchool || '',
    twelfthPercentage: updatedProfile.twelfthPercentage || '',
    tenthSchool: updatedProfile.tenthSchool || '',
    tenthPercentage: updatedProfile.tenthPercentage || '',
  };
  db.set('about', updatedAbout);

  db.logActivity('Profile & Education Updated', 'Profile information and education records saved permanently.', req.user!.email);
  res.json({ success: true, data: updatedProfile });
});

// Update About
router.put('/admin/about', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const about = req.body;
  const currentAbout = db.get('about') || ({} as About);
  const updatedAbout: About = {
    ...currentAbout,
    ...about,
  };
  db.set('about', updatedAbout);

  // Also sync education fields back to profile if modified from About tab
  const currentProfile = db.get('profile') || ({} as Profile);
  const updatedProfile: Profile = {
    ...currentProfile,
    college: updatedAbout.university || updatedAbout.college || currentProfile.college || '',
    degree: updatedAbout.education || updatedAbout.degree || currentProfile.degree || '',
    graduationYear: updatedAbout.graduationYear || currentProfile.graduationYear || '',
    twelfthSchool: updatedAbout.twelfthSchool || currentProfile.twelfthSchool || '',
    twelfthPercentage: updatedAbout.twelfthPercentage || currentProfile.twelfthPercentage || '',
    tenthSchool: updatedAbout.tenthSchool || currentProfile.tenthSchool || '',
    tenthPercentage: updatedAbout.tenthPercentage || currentProfile.tenthPercentage || '',
  };
  db.set('profile', updatedProfile);

  db.logActivity('About Updated', 'About Me biography and educational fields updated.', req.user!.email);
  res.json({ success: true, data: updatedAbout });
});

// Update Currently
router.put('/admin/currently', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const currently = req.body;
  currently.lastUpdated = new Date().toISOString().split('T')[0];
  db.set('currently', currently);
  db.logActivity('Currently Updated', 'Current learning, building, and focus updated.', req.user!.email);
  res.json({ success: true, data: currently });
});

// Update Website Settings
router.put('/admin/website-settings', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const settings = req.body;
  db.set('website_settings', settings);
  db.logActivity('Settings Updated', 'Website settings, branding, or section visibility changed.', req.user!.email);
  res.json({ success: true, data: settings });
});

// Reorder Items (Drag and Drop / Ordering)
router.put('/admin/reorder', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { collection, orderedIds } = req.body;
  if (!collection || !Array.isArray(orderedIds)) {
    res.status(400).json({ success: false, error: 'Invalid reorder parameters' });
    return;
  }
  db.reorderItems(collection, orderedIds);
  db.logActivity('Items Reordered', `Reordered collection ${collection}`, req.user!.email);
  res.json({ success: true });
});

// Generic CRUD Handlers
function setupCrud<T extends { id: string }>(
  collectionKey: keyof typeof db['data'],
  itemName: string,
  urlValidator?: (item: T) => boolean
) {
  // GET
  router.get(`/admin/${collectionKey}`, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
    res.json({ success: true, data: db.get(collectionKey) || [] });
  });

  // POST (Create)
  router.post(`/admin/${collectionKey}`, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const item = req.body as T;
    if (urlValidator && !urlValidator(item)) {
      res.status(400).json({ success: false, error: 'One or more URLs provided are invalid or insecure.' });
      return;
    }
    const currentItems = (db.get(collectionKey) as unknown as T[]) || [];
    const items = [...currentItems];
    if (!item.id) {
      item.id = `${collectionKey.substring(0, 4)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    }
    items.unshift(item);
    db.set(collectionKey, items as any);
    db.logActivity(`${itemName} Created`, `Created ${(item as any).name || (item as any).title || (item as any).platform || item.id}`, req.user!.email);
    res.json({ success: true, data: item });
  });

  // PUT (Update)
  router.put(`/admin/${collectionKey}/:id`, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updateData = req.body as T;
    if (urlValidator && !urlValidator(updateData)) {
      res.status(400).json({ success: false, error: 'One or more URLs provided are invalid or insecure.' });
      return;
    }
    const currentItems = (db.get(collectionKey) as unknown as T[]) || [];
    const items = [...currentItems];
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      res.status(404).json({ success: false, error: `${itemName} not found` });
      return;
    }
    items[index] = { ...items[index], ...updateData, id };
    db.set(collectionKey, items as any);
    db.logActivity(`${itemName} Updated`, `Updated ${(updateData as any).name || (updateData as any).title || (updateData as any).platform || id}`, req.user!.email);
    res.json({ success: true, data: items[index] });
  });

  // DELETE
  router.delete(`/admin/${collectionKey}/:id`, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const currentItems = (db.get(collectionKey) as unknown as T[]) || [];
    const items = [...currentItems];
    const filtered = items.filter((i) => i.id !== id);
    db.set(collectionKey, filtered as any);
    db.logActivity(`${itemName} Deleted`, `Deleted ${itemName} ID: ${id}`, req.user!.email);
    res.json({ success: true, message: `${itemName} deleted` });
  });
}

// Setup collections
setupCrud<Project>('projects', 'Project', (p) => {
  if (p.githubUrl && !isValidUrl(p.githubUrl)) return false;
  if (p.liveDemoUrl && !isValidUrl(p.liveDemoUrl)) return false;
  if (p.videoUrl && !isValidUrl(p.videoUrl)) return false;
  return true;
});

setupCrud<Skill>('skills', 'Skill');

setupCrud<CustomLink>('custom_links', 'Custom Link', (l) => {
  return isValidUrl(l.url);
});

setupCrud<AppEntry>('apps', 'App', (a) => {
  if (a.playStoreUrl && !isValidUrl(a.playStoreUrl)) return false;
  if (a.otherStoreUrl && !isValidUrl(a.otherStoreUrl)) return false;
  return true;
});

setupCrud<SocialLink>('social_links', 'Social Link', (s) => isValidUrl(s.url));
setupCrud<InstagramPost>('instagram_posts', 'Instagram Post', (i) => isValidUrl(i.postUrl));
setupCrud<YouTubeVideo>('youtube_videos', 'YouTube Video', (y) => isValidUrl(y.youtubeUrl));
setupCrud<Certificate>('certificates', 'Certificate', (c) => {
  if (c.credentialUrl && !isValidUrl(c.credentialUrl)) return false;
  return true;
});
setupCrud<ResumeEntry>('resumes', 'Resume');
setupCrud<BlogPost>('blog_posts', 'Blog Post');
setupCrud<GalleryItem>('gallery', 'Gallery Item');
setupCrud<Achievement>('achievements', 'Achievement');
setupCrud<Experience>('experience', 'Experience');
setupCrud<TimelineEntry>('timeline', 'Timeline Entry');
setupCrud<Announcement>('announcements', 'Announcement');
setupCrud<ChangelogEntry>('changelog', 'Changelog');
setupCrud<LifeTravelEntry>('life_travel', 'Life Travel Entry');

// Contact Messages Management
router.get('/admin/contact-messages', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: db.get('contact_messages') });
});

router.put('/admin/contact-messages/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { read, archived } = req.body;
  const messages = db.get('contact_messages');
  const index = messages.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ success: false, error: 'Message not found' });
    return;
  }
  if (typeof read === 'boolean') messages[index].read = read;
  if (typeof archived === 'boolean') messages[index].archived = archived;
  db.set('contact_messages', messages);
  res.json({ success: true, data: messages[index] });
});

router.delete('/admin/contact-messages/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const messages = db.get('contact_messages');
  const filtered = messages.filter((m) => m.id !== id);
  db.set('contact_messages', filtered);
  db.logActivity('Message Deleted', `Deleted contact message ${id}`, req.user!.email);
  res.json({ success: true, message: 'Message deleted' });
});

// Analytics Dashboard Data
router.get('/admin/analytics', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const events = db.get('analytics_events');
  const linkAnalytics = db.get('link_analytics') || [];

  const counts = {
    totalEvents: events.length,
    pageViews: events.filter((e) => e.type === 'page_view').length,
    projectViews: events.filter((e) => e.type === 'project_view').length,
    linkClicks: events.filter((e) => e.type === 'link_click').length,
    appClicks: events.filter((e) => e.type === 'app_click').length,
    resumeDownloads: events.filter((e) => e.type === 'resume_download').length,
    contactSubmissions: events.filter((e) => e.type === 'contact_submit').length,
  };

  const pathMap: Record<string, number> = {};
  events.forEach((e) => {
    pathMap[e.path] = (pathMap[e.path] || 0) + 1;
  });

  const topPaths = Object.entries(pathMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const recentEvents = events.slice(0, 50);

  res.json({
    success: true,
    data: {
      counts,
      topPaths,
      recentEvents,
      linkAnalytics,
    },
  });
});

// Activity Logs
router.get('/admin/activity', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const logs = db.get('activity_logs');
  res.json({ success: true, data: logs });
});

// Database Backup / Export
router.get('/admin/export', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const allData = db.getAll();
  const exportPayload = {
    ...allData,
    admins: allData.admins.map((a) => ({ id: a.id, email: a.email, createdAt: a.createdAt, lastLoginAt: a.lastLoginAt })),
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };

  db.logActivity('Data Export', 'Full non-sensitive database export generated.', req.user!.email);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=harshzynx_backup_${Date.now()}.json`);
  res.send(JSON.stringify(exportPayload, null, 2));
});

export default router;
