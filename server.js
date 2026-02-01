import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// Path to the built static files
const distPath = path.join(__dirname, 'dist');

// Serve static files
app.use(express.static(distPath));

// Handle all other routes by serving index.html with runtime env injection
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html', err);
      return res.status(500).send('Internal Server Error');
    }

    // Inject API Key from server environment to client window object
    // This allows the key to be set in Cloud Run runtime without rebuilding
    const apiKey = process.env.API_KEY || '';
    const envScript = `<script>window.env = { API_KEY: "${apiKey}" };</script>`;
    
    // Inject before </head>
    const finalHtml = htmlData.replace('</head>', `${envScript}</head>`);
    
    res.send(finalHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});