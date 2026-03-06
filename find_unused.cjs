const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');

const allFiles = [];
function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
            allFiles.push(fullPath);
        }
    }
}
walk(srcPath);

const entryPoints = [
    path.join(srcPath, 'main.tsx'),
    path.join(srcPath, 'vite-env.d.ts'),
    path.join(srcPath, 'components', 'MobilePortfolio.tsx')
];
const visited = new Set(entryPoints);

function explore(file) {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    // Match standard and dynamic imports
    const regex = /from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const importStr = match[1] || match[2] || match[3];
        if (importStr && importStr.startsWith('.')) {
            const resolvedPrefix = path.resolve(path.dirname(file), importStr);
            const toTry = ['', '.tsx', '.ts', '.css', '/index.tsx', '/index.ts'];
            let found = false;
            for (const ext of toTry) {
                const fullCandidate = resolvedPrefix + ext;
                if (fs.existsSync(fullCandidate) && fs.statSync(fullCandidate).isFile()) {
                    found = true;
                    if (!visited.has(fullCandidate)) {
                        visited.add(fullCandidate);
                        explore(fullCandidate);
                    }
                    break;
                }
            }
        }
    }
}

entryPoints.forEach(explore);

const unusedFiles = allFiles.filter(f => !visited.has(f));
fs.writeFileSync('unused_files.json', JSON.stringify(unusedFiles, null, 2));
console.log('Unused files count:', unusedFiles.length);
