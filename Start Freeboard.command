#!/bin/zsh
cd -- "${0:A:h}" || exit 1
if ! command -v node >/dev/null 2>&1; then
  print 'Node.js 22 or newer is required. Install it from https://nodejs.org, then reopen this file.'
  read '?Press Return to close.'
  exit 1
fi
node build.mjs && node local.mjs
