# The files you can't see

Three files start with a dot, so Finder (Mac) and File Explorer (Windows) hide them. They ARE in the zip.

| Real file (hidden)                 | Visible copy in this folder          |
|------------------------------------|--------------------------------------|
| `.github/workflows/deploy.yml`     | `deploy/github-workflow-deploy.yml`  |
| `.gitignore`                       | `deploy/gitignore.txt`               |
| `public/.nojekyll`                 | `deploy/nojekyll-empty-file.txt` (empty on purpose) |

Show hidden files: Mac Finder = Cmd+Shift+. | Windows Explorer = View > Show > Hidden items | VS Code shows them already.

If your copy is missing them, run from the project root: `bash deploy/install-hidden-files.sh` (Mac/Linux/Git Bash)
or `deploy\install-hidden-files.bat` (Windows). The `.github` folder MUST be committed, or GitHub never runs the deployment.
You can delete this `deploy/` folder afterwards; the site does not need it.
