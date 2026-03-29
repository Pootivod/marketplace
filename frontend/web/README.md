# marketplace-web

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Debug fallback

Create `.env` from `.env.example`.

- `VITE_API_BASE_URL` - base URL for backend API
- `VITE_DEBUG_FALLBACK=true` - use mock data when API is unavailable or returns an error

Behavior:
- if `VITE_DEBUG_FALLBACK=true`, the app uses mock data when request fails
- if `VITE_DEBUG_FALLBACK=false`, request errors are shown normally
