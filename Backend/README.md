# HR Management Backend

## Quick start

1. Create `.env` in `Backend/` with:

```
PORT=8000
# Replace <username> and <password> with your real Atlas credentials
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.82iazhd.mongodb.net/DairyLiciousHR?retryWrites=true&w=majority
```

2. Install dependencies

```
npm install
```

3. Start dev server

```
npm run dev
```

Server runs on http://localhost:8000 and mounts API under `/api`.

## Project structure

- `Controllers/` – business logic layer
- `Models/` – Mongoose schemas
- `Routes/` – API endpoint routers
- `app.js` – Express entry point (includes MongoDB connection)
