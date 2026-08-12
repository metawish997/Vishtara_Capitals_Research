const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'src', 'pages', 'admin');

const walk = (dir) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;
            if (content.includes('var(--card)') || content.includes('var(--bg)')) {
                content = content.replace(/var\(--card\)/g, 'white');
                content = content.replace(/var\(--bg\)/g, 'slate-50');
                content = content.replace(/var\(--border\)/g, 'slate-200');
                content = content.replace(/var\(--text-primary\)/g, 'slate-800');
                content = content.replace(/var\(--text-secondary\)/g, 'slate-500');
                content = content.replace(/var\(--accent\)/g, '[#011d52]');
                content = content.replace(/bg-\[white\]/g, 'bg-white');
                content = content.replace(/bg-\[slate-50\]/g, 'bg-slate-50');
                content = content.replace(/border-\[slate-200\]/g, 'border-slate-200');
                content = content.replace(/text-\[slate-800\]/g, 'text-slate-800');
                content = content.replace(/text-\[slate-500\]/g, 'text-slate-500');
                
                if (original !== content) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log('Updated: ' + file);
                }
            }
        }
    });
};

walk(targetDir);
