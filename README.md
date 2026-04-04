# Next.js Web App

Frontend alternatif berbasis Next.js App Router.

## Run Locally

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Environment Variables

Optional:

```env
NEXT_PUBLIC_API_URL=https://rust.asepharyana.tech/api
```

Jika tidak diisi, app otomatis memakai `https://rust.asepharyana.tech/api`.

## Extra Script

Tersedia script untuk refresh data GitHub stats:

```bash
GITHUB_TOKEN=<token> node scripts/fetch-github-stats.mjs
```

`GITHUB_TOKEN` bersifat opsional, tapi disarankan agar data kontribusi GraphQL dapat diambil lengkap.

