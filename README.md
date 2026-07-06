# Vesync First Loop Flow Demo

Interactive demo for the **First Loop** biosignal calibration experience (Detect → Act → Confirm) with clickable flowchart navigation and iPhone-style app preview.

## Live demo

After enabling GitHub Pages, the site will be available at:

`https://<your-username>.github.io/<repo-name>/`

## Local development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000` (or the port shown in the terminal).

## Build

```bash
npm run build
npm run preview
```

## Flow paths

| Path | Duration | Description |
|------|----------|-------------|
| **A** | ~4 min | Rest → no emotional shift → Stroop → breathing → results |
| **B** | ~3.5 min | Rest → emotional shift → skip Stroop → breathing → results |
| **C** | ~1 min | Skip experience → Home |

## Tech stack

- React 19 + Vite 6
- Tailwind CSS 4
- TypeScript

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and publishes automatically.
