import React, { useState } from 'react'

const DEFAULT_REPO = 'https://github.com/swipswaps/local-ops-hub.git'

export default function App() {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO)
  const [includeRuff, setIncludeRuff] = useState(true)
  const [includeEslint, setIncludeEslint] = useState(true)
  const [includeShellcheck, setIncludeShellcheck] = useState(true)
  const [script, setScript] = useState('')
  const [copied, setCopied] = useState(false)

  const generateScript = () => {
    const repo = repoUrl.trim() || DEFAULT_REPO
    const repoName = repo.split('/').pop()?.replace('.git', '') || 'repo'

    const lines = []
    lines.push('#!/bin/bash')
    lines.push('# Auto-generated setup script for ' + repo)
    lines.push('')
    lines.push('REPO_URL="' + repo + '"')
    lines.push('TARGET_DIR="${1:-./' + repoName + '}"')
    lines.push('')
    lines.push('echo "🔧 Cloning $REPO_URL into $TARGET_DIR..."')
    lines.push('if ! git clone "$REPO_URL" "$TARGET_DIR"; then')
    lines.push('  echo "❌ Git clone failed. Exiting."')
    lines.push('  exit 1')
    lines.push('fi')
    lines.push('cd "$TARGET_DIR" || { echo "❌ Cannot cd to $TARGET_DIR"; exit 1; }')
    lines.push('')
    lines.push('# ---------- Python (ruff) ----------')
    if (includeRuff) {
      lines.push('if command -v pip3 > /dev/null; then')
      lines.push('  echo "🐍 Installing ruff..."')
      lines.push('  if ! pip3 install ruff; then')
      lines.push('    echo "⚠️  ruff installation failed"')
      lines.push('  fi')
      lines.push('  if [ -f "backend/requirements.txt" ]; then')
      lines.push('    if ! pip3 install -r backend/requirements.txt; then')
      lines.push('      echo "⚠️  requirements.txt installation failed"')
      lines.push('    fi')
      lines.push('  fi')
      lines.push('else')
      lines.push('  echo "⚠️  pip3 not found, skipping Python setup"')
      lines.push('fi')
    } else {
      lines.push('echo "⏭️  Skipping Python (ruff)"')
    }
    lines.push('')
    lines.push('# ---------- Node.js (ESLint + anti-slop) ----------')
    if (includeEslint) {
      lines.push('if command -v npm > /dev/null; then')
      lines.push('  echo "📦 Installing ESLint + anti-slop..."')
      lines.push('  if ! npm init -y > /dev/null; then')
      lines.push('    echo "⚠️  npm init failed"')
      lines.push('  fi')
      lines.push('  if ! npm install --save-dev eslint eslint-plugin-react @dmmulroy/anti-slop; then')
      lines.push('    echo "⚠️  npm install failed"')
      lines.push('  fi')
      lines.push('  if [ -f "src/package.json" ]; then')
      lines.push('    (cd src && npm install) || echo "⚠️  src npm install failed"')
      lines.push('  fi')
      lines.push('  if [ ! -f ".eslintrc.js" ] && [ ! -f ".eslintrc.json" ]; then')
      lines.push('    cat > .eslintrc.js <<\'EOF\'')
      lines.push('module.exports = {')
      lines.push('  parserOptions: { ecmaVersion: 2020, sourceType: "module" },')
      lines.push('  env: { browser: true, node: true, es2020: true },')
      lines.push('  extends: ["plugin:react/recommended"],')
      lines.push('  plugins: ["@dmmulroy/anti-slop"],')
      lines.push('  rules: {')
      lines.push('    "@dmmulroy/anti-slop/no-chained-type-assertions": "error",')
      lines.push('    "@dmmulroy/anti-slop/no-conditional-empty-object-spread": "error",')
      lines.push('    "@dmmulroy/anti-slop/require-safety-comment-for-type-assertion": "error"')
      lines.push('  },')
      lines.push('  settings: { react: { version: "detect" } }')
      lines.push('};')
      lines.push('EOF')
      lines.push('  fi')
      lines.push('else')
      lines.push('  echo "⚠️  npm not found, skipping Node.js setup"')
      lines.push('fi')
    } else {
      lines.push('echo "⏭️  Skipping Node.js (ESLint)"')
    }
    lines.push('')
    lines.push('# ---------- ShellCheck ----------')
    if (includeShellcheck) {
      lines.push('echo "🔍 Installing ShellCheck..."')
      lines.push('if [[ "$OSTYPE" == "linux-gnu"* ]]; then')
      lines.push('  if command -v apt-get > /dev/null; then')
      lines.push('    if ! sudo apt-get update && sudo apt-get install -y shellcheck; then')
      lines.push('      echo "⚠️  apt-get install failed"')
      lines.push('    fi')
      lines.push('  elif command -v yum > /dev/null; then')
      lines.push('    if ! sudo yum install -y ShellCheck; then')
      lines.push('      echo "⚠️  yum install failed"')
      lines.push('    fi')
      lines.push('  else')
      lines.push('    SC_VERSION="v0.10.0"')
      lines.push('    SC_URL="https://github.com/koalaman/shellcheck/releases/download/${SC_VERSION}/shellcheck-${SC_VERSION}.linux.x86_64.tar.xz"')
      lines.push('    if ! curl -L "$SC_URL" | tar xJf -; then')
      lines.push('      echo "⚠️  Download or extraction failed"')
      lines.push('    else')
      lines.push('      if ! sudo cp "shellcheck-${SC_VERSION}/shellcheck" /usr/local/bin/; then')
      lines.push('        echo "⚠️  Copy to /usr/local/bin failed"')
      lines.push('      fi')
      lines.push('      rm -rf "shellcheck-${SC_VERSION}"')
      lines.push('    fi')
      lines.push('  fi')
      lines.push('elif [[ "$OSTYPE" == "darwin"* ]]; then')
      lines.push('  if command -v brew > /dev/null; then')
      lines.push('    if ! brew install shellcheck; then')
      lines.push('      echo "⚠️  brew install failed"')
      lines.push('    fi')
      lines.push('  else')
      lines.push('    echo "⚠️  Homebrew not found. Install ShellCheck manually: https://github.com/koalaman/shellcheck"')
      lines.push('  fi')
      lines.push('else')
      lines.push('  echo "⚠️  Unsupported OS. Install ShellCheck manually: https://github.com/koalaman/shellcheck"')
      lines.push('fi')
    } else {
      lines.push('echo "⏭️  Skipping ShellCheck"')
    }
    lines.push('')
    lines.push('echo ""')
    lines.push('echo "✅ Setup complete! Linters installed:"')
    if (includeRuff) lines.push('  - ruff')
    if (includeEslint) lines.push('  - ESLint + anti-slop')
    if (includeShellcheck) lines.push('  - ShellCheck')
    lines.push('echo ""')
    lines.push('echo "Next steps:"')
    lines.push('echo "  cd $TARGET_DIR"')
    lines.push('echo "  ruff check ."')
    lines.push('echo "  npx eslint src/"')
    lines.push('echo "  shellcheck *.sh scripts/*.sh"')

    setScript(lines.join('\n'))
    setCopied(false)
  }

  const copyScript = () => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container">
      <h1>🧩 Repo Setup Wizard</h1>
      <div className="subtitle">
        Generate a ready-to-run script that clones any Git repo, installs dependencies,
        and sets up the linters you choose.
      </div>

      <label htmlFor="repo">Git repository URL</label>
      <input
        id="repo"
        type="text"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="https://github.com/user/repo.git"
      />

      <label>Select linters to include</label>
      <div className="checkbox-group">
        <label>
          <input type="checkbox" checked={includeRuff} onChange={() => setIncludeRuff(!includeRuff)} />
          🐍 Ruff (Python)
        </label>
        <label>
          <input type="checkbox" checked={includeEslint} onChange={() => setIncludeEslint(!includeEslint)} />
          ⚛️ ESLint + anti-slop (JS/React)
        </label>
        <label>
          <input type="checkbox" checked={includeShellcheck} onChange={() => setIncludeShellcheck(!includeShellcheck)} />
          🖥️ ShellCheck (Bash)
        </label>
      </div>

      <button onClick={generateScript}>🚀 Generate Setup Script</button>

      {script && (
        <>
          <pre>{script}</pre>
          <div className="actions">
            <button className="copy-btn" onClick={copyScript}>
              {copied ? '✅ Copied!' : '📋 Copy script'}
            </button>
            <span style={{ fontSize: '0.9rem', color: '#57606a' }}>
              Save as <code>setup.sh</code>, then run <code>bash setup.sh</code>
            </span>
          </div>
          <div className="status">
            💡 The script detects your OS (macOS/Linux) and uses the right package managers.
            It clones the repo into a fresh folder and installs everything.
          </div>
        </>
      )}
    </div>
  )
}
