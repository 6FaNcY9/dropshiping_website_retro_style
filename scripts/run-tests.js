#!/usr/bin/env node
const { spawnSync } = require('node:child_process');

const filteredArgs = process.argv.slice(2).filter((arg) => arg !== '--runInBand');
const result = spawnSync('npx', ['vitest', 'run', ...filteredArgs], { stdio: 'inherit' });
process.exit(result.status ?? 1);
