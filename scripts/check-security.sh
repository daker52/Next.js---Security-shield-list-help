#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Security Shield — pre-flight checks"
echo ""

fail=0

echo "▸ npm audit (moderate+)"
if npm audit --audit-level=moderate; then
  echo "  ✓ no moderate+ vulnerabilities"
else
  echo "  ✗ audit reported issues"
  fail=1
fi
echo ""

echo "▸ forbidden NEXT_PUBLIC_ secret patterns"
if rg -n "NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|PASSWORD)" . \
  --glob '!node_modules' --glob '!.next' --glob '!*.md' 2>/dev/null; then
  echo "  ✗ possible secret exposed to client bundle"
  fail=1
else
  echo "  ✓ no obvious NEXT_PUBLIC_ secret leaks"
fi
echo ""

echo "▸ .env.local not tracked"
if git check-ignore -q .env.local 2>/dev/null || [[ ! -f .env.local ]]; then
  echo "  ✓ .env.local ignored or absent"
else
  echo "  ✗ .env.local may be committed — add to .gitignore"
  fail=1
fi
echo ""

if [[ $fail -eq 0 ]]; then
  echo "✅ All checks passed"
  exit 0
fi

echo "❌ Security checks failed"
exit 1
