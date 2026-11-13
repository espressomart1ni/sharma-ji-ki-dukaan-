@echo off
REM Run from the project root:  deploy\install-hidden-files.bat
if not exist .github\workflows mkdir .github\workflows
if not exist public mkdir public
copy /Y deploy\github-workflow-deploy.yml .github\workflows\deploy.yml
copy /Y deploy\gitignore.txt .gitignore
type nul > public\.nojekyll
echo Done. Created: .github\workflows\deploy.yml  .gitignore  public\.nojekyll
