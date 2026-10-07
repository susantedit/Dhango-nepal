const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../client/node_modules');
if (fs.existsSync(dir)) {
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    if (entry.startsWith('.') && entry !== '.bin') {
      const fullPath = path.join(dir, entry);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log('Removed temp folder:', entry);
      } catch (err) {
        console.warn('Could not remove:', entry, err.message);
      }
    }
  }
}
console.log('Clean complete.');
