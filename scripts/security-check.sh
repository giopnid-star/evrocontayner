#!/bin/bash
# Security check script — поиск чувствительных данных в репозитории

echo "🔍 Checking for sensitive data in repository..."
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES_FOUND=0

# Check 1: .env files
echo "Checking for .env files..."
if git ls-files | grep -E '\.env($|\.local)'; then
  echo -e "${RED}❌ ERROR: .env files found in git index!${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo -e "${GREEN}✅ No .env files in git${NC}"
fi
echo ""

# Check 2: Common secret patterns
echo "Checking for common secret patterns..."
if git log --all -S "BEGIN RSA PRIVATE KEY" --name-only | head -1; then
  echo -e "${RED}❌ WARNING: Private keys detected in history${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
  echo -e "${GREEN}✅ No RSA private keys detected${NC}"
fi
echo ""

# Check 3: High-entropy strings (likely secrets)
echo "Checking for high-entropy secrets in last 10 commits..."
for file in $(git diff HEAD~10...HEAD --name-only 2>/dev/null | head -20); do
  if git show HEAD:$file 2>/dev/null | grep -E '(password|token|secret|key|api_key|aws_secret)' -i; then
    echo -e "${YELLOW}⚠️  WARNING: Pattern found in $file - review manually${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
  fi
done
echo ""

# Check 4: .gitignore validation
echo "Checking .gitignore for .env protection..."
if grep -q '\.env' .gitignore; then
  echo -e "${GREEN}✅ .env protected in .gitignore${NC}"
else
  echo -e "${RED}❌ ERROR: .env NOT in .gitignore${NC}"
  ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi
echo ""

# Summary
echo "======================================"
if [ $ISSUES_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ Security check passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Security issues found: $ISSUES_FOUND${NC}"
  echo "Please review and fix before pushing"
  exit 1
fi
