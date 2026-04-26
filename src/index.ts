#!/usr/bin/env node

// This package is a brand-protective alias for swisstrip-mcp (canonical SwissTrip MCP client).
// Install `swisstrip-mcp` directly — this alias just spawns it.

import { createRequire } from 'module'
import { spawn } from 'child_process'
import { dirname, resolve } from 'path'

const require = createRequire(import.meta.url)
const swissTripMcpPath = resolve(dirname(require.resolve('swisstrip-mcp/package.json')), 'dist', 'index.js')

const child = spawn('node', [swissTripMcpPath], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code) => process.exit(code ?? 0))
