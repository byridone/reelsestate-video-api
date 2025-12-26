# ReelsEstate Video Render API

Railway'de çalışan video render servisi.

## Endpoints

- `GET /health` - Sağlık kontrolü
- `POST /render` - Video oluştur

## Deploy

1. Railway'de "New Service" → "GitHub Repo" seç
2. Environment variables ekle:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Usage

```bash
POST /render
Content-Type: application/json

{
  "photos": ["https://...", "https://..."],
  "title": "Harika Daire",
  "location": "İstanbul",
  "price": "4.500.000",
  "dayOfMonth": 25
}
```

Response:
```json
{
  "success": true,
  "videoUrl": "https://res.cloudinary.com/...",
  "duration": "58.2s",
  "format": "1080x1920"
}
```
