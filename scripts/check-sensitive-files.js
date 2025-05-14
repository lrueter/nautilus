#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// List of sensitive files that should never be committed
const SENSITIVE_FILES = [
  'src/config/firebase.ts',
  'src/config/admins.ts',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'firebase.json',
  '.firebaserc',
  'storage.rules'
];

// Get the list of files that are staged for commit
const getStagedFiles = () => {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACMRT', { encoding: 'utf-8' });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    process.exit(1);
  }
};

// Check if any sensitive files are staged
const checkSensitiveFiles = () => {
  const stagedFiles = getStagedFiles();
  const sensitiveFilesFound = stagedFiles.filter(file => 
    SENSITIVE_FILES.some(sensitiveFile => 
      file === sensitiveFile || file.endsWith(sensitiveFile)
    )
  );

  if (sensitiveFilesFound.length > 0) {
    console.error('\n🚫 Error: Attempting to commit sensitive files:');
    sensitiveFilesFound.forEach(file => {
      console.error(`   - ${file}`);
    });
    console.error('\nThese files contain sensitive information and should not be committed.');
    console.error('Please remove them from your commit using:');
    console.error('   git reset HEAD <file>');
    console.error('\nIf you need to commit a template/example file, please use the .example extension.');
    process.exit(1);
  }
};

// Run the check
checkSensitiveFiles(); 