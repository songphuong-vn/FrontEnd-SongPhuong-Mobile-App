const fs = require('fs');
const path = require('path');

// Create public directory
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// List of files and directories to copy
const itemsToCopy = [
    'index.html',
    'buildpc.html',
    'test-nav.html',
    'manifest.json',
    'robots.txt',
    'sitemap.xml',
    'css',
    'js',
    'icons',
    'pages',
    'database-product'
];

// Function to copy directory recursively
function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const entries = fs.readdirSync(src);
        for (let entry of entries) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy each item
itemsToCopy.forEach(item => {
    const srcPath = path.join(__dirname, '..', item);
    const destPath = path.join(publicDir, item);

    if (fs.existsSync(srcPath)) {
        console.log(`Copying ${item}...`);
        copyRecursive(srcPath, destPath);
    } else {
        console.warn(`Warning: ${item} not found, skipping...`);
    }
});

console.log('Build completed! All files copied to public/');
// Đã xóa file này vì không còn sử dụng.
