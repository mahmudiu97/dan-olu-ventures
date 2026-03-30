**Deploying the app (Vercel or Netlify)**

This project supports automated deploys via GitHub Actions. Add one of the providers below and push to `main` to trigger a deployment.

1) Vercel (recommended)

- Create a Vercel personal token: https://vercel.com/account/tokens
- In your GitHub repository, add these repository secrets:
  - `VERCEL_TOKEN` — your Vercel personal token
  - `VERCEL_ORG_ID` — your Vercel organization ID
  - `VERCEL_PROJECT_ID` — your Vercel project ID

- The workflow file is `.github/workflows/deploy-vercel.yml`. It runs on push to `main` and deploys with `--prod`.

Manual deploy using Vercel CLI:
```bash
npm i -g vercel
vercel login
vercel --prod
```

2) Netlify

- Create a Netlify Personal Access Token: https://app.netlify.com/user/applications#personal-access-tokens
- Find your Site ID in Site settings → Site information.
- In GitHub repository secrets, add:
  - `NETLIFY_AUTH_TOKEN`
  - `NETLIFY_SITE_ID`

- The workflow file is `.github/workflows/deploy-netlify.yml`. It runs on push to `main` and deploys the `dist` folder.

Notes
- The GitHub Actions will only run the provider workflow if the corresponding secret is present (the workflow checks for the secret value).
- Ensure your Firebase environment variables (VITE_FIREBASE_*) are set in the hosting provider dashboard or GitHub Actions secrets if you want server builds to have them. Example secret names used in Actions: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.
