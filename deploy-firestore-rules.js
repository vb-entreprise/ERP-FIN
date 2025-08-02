#!/usr/bin/env node

/**
 * Deploy Firestore Rules Script
 * Author: VB Entreprise
 * 
 * This script helps deploy Firestore security rules to fix connection issues
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Firebase Firestore Rules Deployment Script');
console.log('=============================================\n');

// Check if firestore.rules file exists
const rulesPath = path.join(__dirname, 'firestore.rules');
if (!fs.existsSync(rulesPath)) {
  console.error('❌ firestore.rules file not found!');
  console.error('Please ensure firestore.rules exists in the project root.');
  process.exit(1);
}

console.log('✅ firestore.rules file found');

// Check if firebase.json exists
const firebaseConfigPath = path.join(__dirname, 'firebase.json');
if (!fs.existsSync(firebaseConfigPath)) {
  console.error('❌ firebase.json file not found!');
  console.error('Please ensure firebase.json exists in the project root.');
  process.exit(1);
}

console.log('✅ firebase.json file found');

// Check if Firebase CLI is installed
try {
  const version = execSync('firebase --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Firebase CLI found (version: ${version})`);
} catch (error) {
  console.error('❌ Firebase CLI not found!');
  console.error('Please install Firebase CLI:');
  console.error('  npm install -g firebase-tools');
  console.error('  firebase login');
  process.exit(1);
}

// Check if user is logged in
try {
  const loginStatus = execSync('firebase projects:list', { encoding: 'utf8' });
  console.log('✅ Firebase CLI is logged in');
} catch (error) {
  console.error('❌ Firebase CLI not logged in!');
  console.error('Please run: firebase login');
  process.exit(1);
}

// Deploy Firestore rules
console.log('\n🚀 Deploying Firestore security rules...');
try {
  const deployOutput = execSync('firebase deploy --only firestore:rules', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log('✅ Firestore rules deployed successfully!');
  console.log('\nDeployment output:');
  console.log(deployOutput);
  
  console.log('\n🎉 Deployment completed successfully!');
  console.log('Your Firestore security rules are now active.');
  console.log('\nNext steps:');
  console.log('1. Test your application');
  console.log('2. Check the Firebase Console to verify rules are deployed');
  console.log('3. Monitor your application logs for any remaining issues');
  
} catch (error) {
  console.error('❌ Deployment failed!');
  console.error('Error:', error.message);
  
  if (error.stdout) {
    console.error('\nDeployment output:');
    console.error(error.stdout);
  }
  
  if (error.stderr) {
    console.error('\nError output:');
    console.error(error.stderr);
  }
  
  console.log('\nTroubleshooting tips:');
  console.log('1. Make sure you are logged into Firebase: firebase login');
  console.log('2. Check your project is selected: firebase use <project-id>');
  console.log('3. Verify your firestore.rules file is valid');
  console.log('4. Check your internet connection');
  console.log('5. Ensure your Firebase project has Firestore enabled');
  
  process.exit(1);
} 