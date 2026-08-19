import { createRequire } from 'node:module'
const require = createRequire('D:/codee/code8/app/package.json')
const { build } = require('esbuild')

await build({
  bundle: true,
  entryPoints: {
    index: './src/index.ts',
    startup: './src/startup.ts',
    invariant: './src/invariant.ts',
  },
  format: 'esm',
  outdir: './dist',
  packages: 'external',
  platform: 'node',
  target: 'node24',
  logLevel: 'info',
})