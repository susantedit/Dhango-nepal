const { execSync } = require('child_process');
const path = require('path');

const clientDir = path.resolve(__dirname, '../client');
console.log('Running npm install in', clientDir);

try {
  const output = execSync('npm.cmd install --no-audit --no-fund --loglevel=info', {
    cwd: clientDir,
    stdio: 'inherit',
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' }
  });
  console.log('Install completed successfully.');
} catch (err) {
  console.error('Install failed:', err.message);
  process.exit(1);
}
