# GitHub Pages Deployment Guide for VEGGIE NADU

The blank screen and `Failed to load resource: main.tsx (404)` error occur because GitHub Pages was serving raw unbuilt source code from the repository root rather than the compiled Vite production bundle in `dist/`.

We have already configured:
1. `vite.config.ts` with `base: './'` for repository subpaths (`/VEGGIE-NADU/`).
2. `public/favicon.svg` and updated `index.html` to resolve 404s.
3. Automated GitHub Actions workflow in `.github/workflows/deploy.yml`.

---

## Recommended Solution: Enable GitHub Actions Deployment (1-Minute Fix)

1. Open your repository on GitHub: `https://github.com/secondmedic-ops/VEGGIE-NADU`
2. Click **Settings** (top tab)
3. In the left sidebar, click **Pages**
4. Under **Build and deployment** > **Source**, change the dropdown from **"Deploy from a branch"** to **"GitHub Actions"**
5. Go to the **Actions** tab in your repository and run the **"Deploy to GitHub Pages"** workflow (or make a commit/push).

Once the action completes (typically ~30 seconds), refresh `https://secondmedic-ops.github.io/VEGGIE-NADU/`. The app will load.
