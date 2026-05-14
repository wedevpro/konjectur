const fs = require('fs-extra');
const path = require('path');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const terser = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');
const glob = require('glob');
const crypto = require('crypto');

// Config
const srcDir = 'src';
const distDir = 'dist';
const siteUrl = 'https://www.konjectur.com'; // à personnaliser
  
const hash = generateHash(Date.now().toString());

// Utilitaire pour remplacer les chemins dans le HTML
function replaceAssetsPaths(content) {
    // Remplacer les liens CSS/JS uniquement s'ils ne sont pas des URLs externes
    return content
      .replace(/(href=["'])(?!http)([^"']+\.css)(["'])/g, (_, pre, file, post) => {
        return pre + file.replace(/\.css$/, `.min.${hash}.css`) + post;
      })
      .replace(/(src=["'])(?!http)([^"']+\.js)(["'])/g, (_, pre, file, post) => {
        return pre + file.replace(/\.js$/, `.obf.${hash}.js`) + post;
      });
  }

function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}  

(async () => {
  await fs.remove(distDir);
  await fs.ensureDir(distDir);
  // Copie tous les fichiers sauf *.css et *.js
  await fs.copy(srcDir, distDir, {
      filter: (src) => {
      if (src.endsWith('.css') || src.endsWith('.js')) {
          return false;
      }
      return true;
      }
  });

  // --- Traitement CSS ---
  const cssFiles = glob.sync(`${srcDir}/**/*.css`);
  for (const file of cssFiles) {
    const content = await fs.readFile(file, 'utf8');
    const minified = new CleanCSS().minify(content).styles;

    const relPath = path.relative(srcDir, file);
    const outPath = path.join(distDir, relPath.replace(/\.css$/, `.min.${hash}.css`));
    await fs.outputFile(outPath, minified);
  }

  // --- Traitement JS ---
  const jsFiles = glob.sync(`${srcDir}/**/*.js`);
  for (const file of jsFiles) {
    const content = await fs.readFile(file, 'utf8');
    const minified = await terser.minify(content);
    const obfuscated = JavaScriptObfuscator.obfuscate(minified.code, {
      compact: true,
      controlFlowFlattening: true,
      selfDefending: true,
      stringArray: true,
    });

    const relPath = path.relative(srcDir, file);
    const outPath = path.join(distDir, relPath.replace(/\.js$/, `.obf.${hash}.js`));
    await fs.outputFile(outPath, obfuscated.getObfuscatedCode());
  }
  
  // --- Traitement HTML ---
  const htmlFiles = glob.sync(`${srcDir}/**/*.html`);
  const sitemapEntries = [];
  const spaRoutes = [
    'about',
    'videos',
    'stream',
    'shows',
    'contact',
    'legal'
  ];

  for (const file of htmlFiles) {
    let content = await fs.readFile(file, 'utf8');
    content = replaceAssetsPaths(content);
    const minified = minify(content, {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true,
    });

    const relPath = path.relative(srcDir, file);
    await fs.outputFile(path.join(distDir, relPath), minified);

    let urlPath = relPath.replace(/\\/g, '/');

    if(urlPath === 'index.html') {
      urlPath = '';
    }

    urlPath = urlPath.replace(/index\.html$/, '');
    urlPath = urlPath.replace(/\.html$/, '');

    sitemapEntries.push(
      `${siteUrl}/${urlPath}`
    );
  }

  for(const route of spaRoutes) {
    sitemapEntries.push(route ? `${siteUrl}/${route}` : siteUrl);
  }

  const uniqueEntries = [...new Set(sitemapEntries)];

  // --- Sitemap ---
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    uniqueEntries.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === siteUrl+'/' ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n') +
    `\n</urlset>`;
  await fs.outputFile(path.join(distDir, 'sitemap.xml'), sitemap);

  // --- Robots.txt ---
  const robotsTxt = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
  await fs.outputFile(path.join(distDir, 'robots.txt'), robotsTxt);

  // --- HTACCESS ---
  await fs.rename(path.join(distDir, '.htaccess.prod'), path.join(distDir, '.htaccess'));

  console.log('Build terminé avec succès !');
})();