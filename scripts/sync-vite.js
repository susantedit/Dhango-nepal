const fs = require('fs');
const path = require('path');

const nm = path.resolve(__dirname, '../client/node_modules');
const src = path.join(nm, '.vite-PZgeG5Pr');
const dest = path.join(nm, 'vite');
const oldDest = path.join(nm, 'vite_trash_' + Date.now());

try {
  if (fs.existsSync(dest)) {
    fs.renameSync(dest, oldDest);
    console.log('Renamed old vite to trash folder');
  }
  if (fs.existsSync(src)) {
    fs.renameSync(src, dest);
    console.log('Renamed .vite-PZgeG5Pr to vite successfully!');
  }
  console.log('vite/bin/vite.js exists:', fs.existsSync(path.join(dest, 'bin/vite.js')));
} catch (err) {
  console.error('Error:', err.message);
}
