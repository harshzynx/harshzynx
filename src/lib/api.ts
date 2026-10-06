import type {
  DatabaseSchema,
  Profile,
  About,
  Currently,
  WebsiteSettings,
} from '../types/index.ts';

const TOKEN_KEY = 'harshzynx_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface PublicDataResponse {
  settings: WebsiteSettings;
  profile: Profile;
  about: About;
  currently: Currently;
  skills: DatabaseSchema['skills'];
  projects: DatabaseSchema['projects'];
  customLinks: DatabaseSchema['custom_links'];
  apps: DatabaseSchema['apps'];
  socialLinks: DatabaseSchema['social_links'];
  instagramPosts: DatabaseSchema['instagram_posts'];
  youtubeVideos: DatabaseSchema['youtube_videos'];
  certificates: DatabaseSchema['certificates'];
  activeResume: DatabaseSchema['resumes'][0] | null;
  blogPosts: DatabaseSchema['blog_posts'];
  gallery: DatabaseSchema['gallery'];
  achievements: DatabaseSchema['achievements'];
  experience: DatabaseSchema['experience'];
  timeline: DatabaseSchema['timeline'];
  announcements: DatabaseSchema['announcements'];
  changelog: DatabaseSchema['changelog'];
  lifeTravel: DatabaseSchema['life_travel'];
}

export const api = {
  // Public
  async getPublicData(): Promise<PublicDataResponse> {
    const res = await fetch(`/api/public/data?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
    if (!res.ok) throw new Error('Failed to load portfolio data');
    const json = await res.json();
    return json.data;
  },

  async getProjectBySlug(slug: string) {
    const res = await fetch(`/api/public/projects/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Project not found');
    const json = await res.json();
    return json.data;
  },

  async getBlogBySlug(slug: string) {
    const res = await fetch(`/api/public/blog/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Article not found');
    const json = await res.json();
    return json.data;
  },

  async submitContact(data: { name: string; email: string; message: string; website?: string }) {
    const res = await fetch('/api/public/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send message');
    return json;
  },

  async recordAnalytics(type: string, path: string, targetId?: string) {
    try {
      await fetch('/api/public/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, path, targetId }),
      });
    } catch {
      // Non-blocking analytics
    }
  },

  async trackLink(targetUrl: string, label: string, category: string = 'External') {
    try {
      await fetch('/api/public/track-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, label, category }),
      });
    } catch {
      // Non-blocking
    }
  },

  async askAI(question: string): Promise<{ answer: string }> {
    const res = await fetch('/api/public/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'AI query failed');
    return json;
  },

  // Auth
  async login(email: string, password: string) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    if (json.token) setAdminToken(json.token);
    return json;
  },

  async checkAuth() {
    const token = getAdminToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        removeAdminToken();
        return null;
      }
      const json = await res.json();
      return json.admin;
    } catch {
      return null;
    }
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update password');
    return json;
  },

  logout() {
    removeAdminToken();
  },

  // Admin CMS
  async getAdminAllData(): Promise<DatabaseSchema> {
    const res = await fetch(`/api/admin/all-data?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        ...getAuthHeaders(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
    if (!res.ok) throw new Error('Failed to load CMS data');
    const json = await res.json();
    return json.data;
  },

  async updateProfile(profile: Profile) {
    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update profile');
    return json.data;
  },

  async updateAbout(about: About) {
    const res = await fetch('/api/admin/about', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(about),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update about details');
    return json.data;
  },

  async updateCurrently(currently: Currently) {
    const res = await fetch('/api/admin/currently', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(currently),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update currently');
    return json.data;
  },

  async updateWebsiteSettings(settings: WebsiteSettings) {
    const res = await fetch('/api/admin/website-settings', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update settings');
    return json.data;
  },

  async reorderItems(collection: string, orderedIds: string[]) {
    const res = await fetch('/api/admin/reorder', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ collection, orderedIds }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to reorder items');
    return json;
  },

  // Generic Collection CRUD
  async createItem<T>(collection: string, item: T): Promise<T> {
    const res = await fetch(`/api/admin/${collection}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Failed to create item in ${collection}`);
    return json.data;
  },

  async updateItem<T>(collection: string, id: string, item: Partial<T>): Promise<T> {
    const res = await fetch(`/api/admin/${collection}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(item),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Failed to update item in ${collection}`);
    return json.data;
  },

  async deleteItem(collection: string, id: string) {
    const res = await fetch(`/api/admin/${collection}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `Failed to delete item from ${collection}`);
    return json;
  },

  // Contact Messages
  async getContactMessages() {
    const res = await fetch('/api/admin/contact-messages', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load contact messages');
    const json = await res.json();
    return json.data;
  },

  async updateContactMessage(id: string, updates: { read?: boolean; archived?: boolean }) {
    const res = await fetch(`/api/admin/contact-messages/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update message');
    return json.data;
  },

  async deleteContactMessage(id: string) {
    const res = await fetch(`/api/admin/contact-messages/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete message');
    return json;
  },

  // Analytics & Activity
  async getAnalytics() {
    const res = await fetch('/api/admin/analytics', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load analytics');
    const json = await res.json();
    return json.data;
  },

  async getActivityLogs() {
    const res = await fetch('/api/admin/activity', { headers: getAuthHeaders() });
    if (!res.ok) throw new Error('Failed to load activity logs');
    const json = await res.json();
    return json.data;
  },

  // File Upload
  async uploadFile(file: File): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAdminToken();

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'File upload failed');
    return json;
  },

  // Dedicated Profile Photo Upload & Immediate Database Persistence
  async uploadProfilePhoto(file: File): Promise<{ success: boolean; url: string; profile: Profile }> {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAdminToken();

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/admin/profile/photo', {
      method: 'POST',
      headers,
      body: formData,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Profile photo upload failed');
    return json;
  },
};
