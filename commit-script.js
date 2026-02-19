const { execSync } = require('child_process');
const path = require('path');

try {
  const projectPath = 'c:\\Users\\tigra\\Рабочий стол\\evrocontayner';
  process.chdir(projectPath);
  console.log('✓ Current directory:', process.cwd());
  
  // Сначала подтянуть изменения с remote, чтобы избежать ошибок push
  try {
    execSync('git pull --rebase', { stdio: 'inherit' });
    console.log('✓ git pull --rebase successful');
  } catch (pullErr) {
    console.warn('! git pull не удался, продолжаем коммит (возможно, нет изменений на сервере)');
  }

  execSync('git add index.html images/kiosks/kiosk-recycling', { stdio: 'inherit' });
  console.log('✓ Files added');

  execSync('git commit -m "Add kiosk 1 recycling real photos with 4 views"', { stdio: 'inherit' });
  console.log('✓ Commit successful');
} catch (err) {
  console.error('✗ Error:', err.message);
  process.exit(1);
}
