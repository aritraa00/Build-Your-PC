# Build Your PC

A full-stack MVP PC builder built with React, Tailwind CSS, Express, and MongoDB.

## Features

- JWT-based signup and login
- Step-by-step PC builder workflow
- MongoDB-backed component and saved build storage
- Live compatibility checks
- Dynamic pricing and power estimation
- Basic gaming performance estimator
- Shareable saved build links
- Pre-built recommendation cards
- Modern dark UI with filters and comparison support

## Folder Structure

```text
build-your-pc/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── tailwind.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Local Setup

### 1. Backend

```bash
cd server
npm install
copy .env.example .env
```

Update `.env` if needed, then run:

```bash
npm run dev
```

The API starts on `http://localhost:5000`.

For production forgot-password support on Render, set these backend environment variables:

```env
CLIENT_URL=https://your-vercel-domain.vercel.app
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
EMAIL_USER=your-smtp-user
EMAIL_PASS=your-smtp-password
EMAIL_FROM=your-smtp-user
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
```

### 2. Frontend

```bash
cd client
npm install
```

If needed, create the client env file first:

```bash
copy .env.example .env
```

Then run:

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

For Vercel, set:

```env
VITE_API_URL=https://your-render-backend.onrender.com
```

## Test Commands

```bash
cd server && npm test
cd client && npm test
cd client && npm run build
```

## Backend Routes

- `POST /auth/register`
- `POST /auth/login`
- `GET /components?type=cpu`
- `POST /build/save`
- `PUT /build/:id`
- `DELETE /build/:id`
- `GET /build/:id`

Extra helper routes included:

- `GET /build/user/list`
- `GET /health`

## Notes

- Components are seeded automatically from starter mock data on startup.
- Saved builds require authentication.
- Shared build pages can be opened without login using the saved build id.

## Real Full Catalog Support

The app now supports large searchable catalogs with pagination, but no local project can truthfully ship with "every PC component that exists" hardcoded forever because the market changes constantly.

To load a real full catalog into MongoDB, import a JSON dataset:

```bash
cd server
npm run import:components -- src/data/catalog.template.json
```

To fully replace the existing catalog:

```bash
cd server
npm run import:components -- your-full-catalog.json --replace
```

Each item in the import file should follow this shape:

```json
{
  "name": "Ryzen 7 9700X",
  "type": "cpu",
  "brand": "AMD",
  "price": 359,
  "specs": {},
  "imageUrl": "https://example.com/component.jpg",
  "source": "custom-import",
  "externalId": "unique-id"
}
```
