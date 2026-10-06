import express from 'express';
import path from 'path';
import fs from 'fs';
import apiRouter from './server/routes/api.ts';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Parse JSON bodies & urlencoded
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Static public directory (robots.txt, favicon, verification files)
const publicDir = path.resolve(process.cwd(), 'public');
app.use(express.static(publicDir, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('sw.js') || filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  },
}));

// Google Search Console verification direct handler
app.get('/google6eae13de3c0ac73d.html', (_req, res) => {
  const filePath = path.resolve(publicDir, 'google6eae13de3c0ac73d.html');
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(filePath);
  } else {
    res.status(200).send('google-site-verification: google6eae13de3c0ac73d.html\n');
  }
});

// Mount REST API
app.use('/api', apiRouter);

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        } else if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }));
    app.get('*', (_req, res) => {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 HARSHZYNX full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
