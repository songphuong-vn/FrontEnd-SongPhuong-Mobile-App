const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

const rootDir = path.join(__dirname, '..');
const files = getAllFiles(rootDir).filter(f => f.endsWith('.js') || f.endsWith('.html'));

let count = 0;

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        // Replace http://songphuong.vn with https://songphuong.vn
        // Also http://www.songphuong.vn
        // We can be broader: replace http:// with https:// for specific domains if needed,
        // but let's stick to songphuong.vn as identified.

        let newContent = content.replace(/http:\/\/songphuong\.vn/g, 'https://songphuong.vn');
        newContent = newContent.replace(/http:\/\/www\.songphuong\.vn/g, 'https://www.songphuong.vn');

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Updated: ${file}`);
            count++;
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});

console.log(`Finished. Updated ${count} files.`);
