import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

const distPath = path.join(__dirname, 'dist');

// --- Debugging: Server Startup Check ---
console.log('Starting server...');
console.log(`Looking for static files in: ${distPath}`);

if (fs.existsSync(distPath)) {
  console.log('✅ Build directory (dist) found.');
  try {
    const files = fs.readdirSync(distPath);
    console.log(`📂 Directory contents (${files.length} files):`, files.join(', '));
    
    if (!files.includes('index.html')) {
      console.error('❌ CRITICAL: index.html is missing in dist folder!');
    }
  } catch (e) {
    console.error('⚠️ Error reading dist directory:', e);
  }
} else {
  console.error('❌ CRITICAL ERROR: dist directory NOT found.');
  console.error('   Make sure "npm run build" was executed before starting the server.');
  console.error('   If using Docker, check if "RUN npm run build" is in the Dockerfile.');
}
// ---------------------------------------

// 1. Serve Static Assets from 'dist'
// This serves js, css, images, manifest.json, etc.
app.use(express.static(distPath));

// 2. SPA Fallback: Serve index.html for any unknown routes
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  // Prevent caching index.html so users get updates immediately
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error serving index.html:', err);
      return res.status(500).send(`
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
          <h1>Server Error (500)</h1>
          <p>Application build artifacts are missing.</p>
          <p style="color: #666; font-size: 0.9em;">Error: Could not read ${indexPath}</p>
        </div>
      `);
    }

    // Inject Runtime Environment Variables (API Key) safely
    const apiKey = process.env.API_KEY || '';
    const envScript = `<script>window.env = { API_KEY: "${apiKey}" };</script>`;
    
    // Insert the env script before the closing head tag
    const finalHtml = htmlData.replace('</head>', `${envScript}</head>`);
    
    res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});