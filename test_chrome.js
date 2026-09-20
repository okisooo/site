const { spawn } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = 'C:\\Users\\samue\\.gemini\\antigravity-temp-profile-9333';

console.log('Spawning Chrome...');
console.log('Path:', chromePath);
console.log('User Data Dir:', userDataDir);

const chrome = spawn(chromePath, [
    '--remote-debugging-port=9333',
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage'
]);

chrome.stdout.on('data', (data) => {
    console.log(`STDOUT: ${data}`);
});

chrome.stderr.on('data', (data) => {
    console.log(`STDERR: ${data}`);
});

chrome.on('close', (code) => {
    console.log(`Chrome process exited with code ${code}`);
});

// Wait 5 seconds then kill it
setTimeout(() => {
    console.log('Killing Chrome...');
    chrome.kill();
}, 5000);
