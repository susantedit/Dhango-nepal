const fs = require('fs');
const path = require('path');

const nm = path.resolve(__dirname, '../client/node_modules');
const entries = fs.readdirSync(nm);

console.log('Inspecting staged directories...');
for (const entry of entries) {
  if (entry.startsWith('.') && entry !== '.bin') {
    // Parse package name: e.g. .vite-PZgeG5Pr -> vite
    // or .esbuild-oGuD0yyr -> esbuild
    const parts = entry.slice(1).split('-');
    const hash = parts.pop();
    const pkgName = parts.join('-');
    
    if (pkgName) {
      const targetPath = path.join(nm, pkgName);
      const srcPath = path.join(nm, entry);
      
      const targetHasFiles = fs.existsSync(targetPath) && fs.readdirSync(targetPath).length > 1;
      if (!targetHasFiles) {
        try {
          if (fs.existsSync(targetPath)) {
            fs.rmSync(targetPath, { recursive: true, force: true });
          }
          fs.renameSync(srcPath, targetPath);
          console.log(`Replaced staged -> target: ${entry} => ${pkgName}`);
        } catch (err) {
          console.warn(`Could not rename ${entry} to ${pkgName}:`, err.message);
        }
      }
    }
  }
}
console.log('Staged promotion complete.');
