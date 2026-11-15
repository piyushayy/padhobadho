const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const binaryName = process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks';
const localBinary = path.join(process.cwd(), 'tools', binaryName);

let cmd = '';
if (fs.existsSync(localBinary)) {
    cmd = `"${localBinary}" detect --source . -v`;
} else {
    cmd = 'gitleaks detect --source . -v';
}

console.log('Running security audit via Gitleaks:');
try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('\n✅ Security check PASSED: No secrets or leaks detected.');
} catch (error) {
    console.error('\n❌ Security check FAILED: Secrets detected or scan error.');
    process.exit(1);
}
