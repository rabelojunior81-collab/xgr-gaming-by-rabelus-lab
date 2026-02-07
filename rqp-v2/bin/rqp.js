#!/usr/bin/env node
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the CLI from dist using file URL
const cliPath = join(__dirname, '../dist/cli.js').replace(/\\/g, '/');
const cliUrl = `file:///${cliPath}`;

import(cliUrl).catch(err => {
  console.error('Error loading RQP CLI:', err.message);
  console.error('Did you run "npm run build"?');
  process.exit(1);
});
