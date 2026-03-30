# SmartTax Full-Stack Setup & Git Fix
✅ **Backend fully restored** in `tax-project/smarttax-frontend/backend/` (server.js, models, routes, etc. verified)

## Remaining Steps:

### 1. **Fix Git Status** (in `tax-project/smarttax-frontend/`)
```
git reset HEAD    # Unstage deletions
git status        # Verify clean
git add backend/  # Add restored backend
git commit -m \"restored backend inside smarttax-frontend/\"
git push origin main
```

### 2. **Backend Setup**
```
cd tax-project/smarttax-frontend/backend
npm install
```

### 3. **Start Backend** (Terminal 1)
```
cd tax-project/smarttax-frontend/backend
npm run dev
```
*Backend runs on http://localhost:5000*
- Test: http://localhost:5000/health
- Test DB: http://localhost:5000/test-db
- Auto-loads sample CRSP data

### 4. **Frontend** (already running: http://localhost:3000)
Update `src/services/api.js` baseURL to `http://localhost:5000/api` if needed.

### 5. **Full Stack Ready!**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: localhost:27017 (ensure running)

### Pro Tips:
```
# Seed more data
curl -X POST http://localhost:5000/api/crsp/load-sample

# Health check
curl http://localhost:5000/health
```

**Project Complete! 🚀**

