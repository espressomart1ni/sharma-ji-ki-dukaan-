#!/usr/bin/env bash
# Run from the project root:  bash deploy/install-hidden-files.sh
# Recreates the three dot-files that Finder/Explorer hide by default.
set -e
mkdir -p .github/workflows public
cp deploy/github-workflow-deploy.yml .github/workflows/deploy.yml
cp deploy/gitignore.txt .gitignore
: > public/.nojekyll
echo "Done. Created: .github/workflows/deploy.yml  .gitignore  public/.nojekyll"
