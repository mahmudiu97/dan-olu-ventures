# GitHub Actions Secrets and CI environment template

This file lists the repository secrets and environment variables the CI/deploy workflows expect. Add them in GitHub → Settings → Secrets → Actions, or use the `gh` CLI.

## Provider secrets (required for deploy workflows)

- `VERCEL_TOKEN` — Vercel personal token
- `VERCEL_ORG_ID` — Vercel organization ID
- `VERCEL_PROJECT_ID` — Vercel project ID
- `NETLIFY_AUTH_TOKEN` — Netlify personal access token
- `NETLIFY_SITE_ID` — Netlify Site ID

## Firebase client environment variables

Add the following `VITE_` variables so the build can initialize Firebase on the client:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Also keep a local `.env.local` file (already gitignored) for local development with the same keys.

## Setting secrets via GitHub CLI

Install GitHub CLI: https://cli.github.com/

Example commands (run from the repository directory):

```bash
# set a single secret interactively
gh secret set VERCEL_TOKEN

# set from a file or environment variable
echo "${VERCEL_TOKEN}" | gh secret set VERCEL_TOKEN --body -

# set multiple Firebase env vars
gh secret set VITE_FIREBASE_API_KEY --body "your-api-key-here"
gh secret set VITE_FIREBASE_AUTH_DOMAIN --body "your-app.firebaseapp.com"

# set Netlify secrets
gh secret set NETLIFY_AUTH_TOKEN --body "<netlify-token>"
gh secret set NETLIFY_SITE_ID --body "<netlify-site-id>"

```

## Notes and recommendations

- Never commit `.env.local` or real secret values to the repository.
- For Vercel, you can also add Environment Variables in the Vercel project settings (recommended for preview/production differences).
- For Netlify, add Build & Deploy → Environment → Environment variables in the site settings.
- If you want me to add an example GitHub Actions environment file or encrypt values with `git-crypt`, tell me which approach you prefer.
