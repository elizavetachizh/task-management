import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function resolvePort() {
  const fromEnv = process.env.VITE_API_PORT?.trim()
  if (fromEnv) return fromEnv

  const envPath = join(root, '.env')
  if (existsSync(envPath)) {
    const line = readFileSync(envPath, 'utf8')
      .split('\n')
      .find((l) => /^\s*VITE_API_PORT\s*=/.test(l))
    if (line) {
      const m = line.match(/=\s*(\d+)/)
      if (m) return m[1]
    }
  }

  return '3001'
}

const port = resolvePort()

const child = spawn(
  'npx',
  ['json-server', '--watch', 'db.json', '--port', port],
  { cwd: root, stdio: 'inherit', shell: true },
)

child.on('exit', (code) => process.exit(code ?? 0))
