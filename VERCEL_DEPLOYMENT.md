# EduLift - Vercel Deployment Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free at vercel.com)
- Your project pushed to GitHub

## Step 1: Push Project to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Create a repo on GitHub and push:
git remote add origin https://github.com/YOUR_USERNAME/EduLift.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Vercel

1. **Sign up/Login to Vercel**: https://vercel.com
2. **Click "Add New..." → "Project"**
3. **Select your GitHub repository (EduLift)**
4. **Configure the project:**
   - Framework: Node.js
   - Root Directory: `Server`
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. **Add Environment Variables:**
   - Click "Environment Variables" and add:
     ```
     PORT=5000
     MONGO_URI=mongodb+srv://surajsharma60923_db_user:doi5FmSxoN4QWRoh@eduliftcluster.i46hcdv.mongodb.net/
     JWT_SECRET=supersecretkey
     CLOUDINARY_NAME=dvxmc19s2
     CLOUDINARY_API_KEY=849886954663797
     CLOUDINARY_API_SECRET=L0CuBQt7tyV-mpuMbdvPFuTla7k
     ```

6. **Click "Deploy"** - Wait 2-5 minutes
7. **Copy your Backend URL** (will look like: `https://edulift-server.vercel.app`)

## Step 3: Deploy Frontend to Vercel

1. **Create NEW project on Vercel** (separate deployment)
2. **Select the SAME GitHub repository**
3. **Configure the project:**
   - Framework: Vite
   - Root Directory: `Client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables:**
   - Create `.env` file in Client folder:
     ```
     VITE_API_URL=https://your-backend-url.vercel.app/api
     ```
   - Add this to Vercel environment variables

5. **Update axios.js in frontend:**
   - Change baseURL from `http://localhost:5000/api` to use environment variable

6. **Click "Deploy"** - Wait 2-5 minutes

## Step 4: Update Frontend API URL

Edit `Client/src/api/axios.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## Step 5: Enable CORS in Backend

Update `Server/src/app.js`:

```javascript
import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend-url.vercel.app" // Add your frontend URL
  ],
  credentials: true
}));
```

## Final Steps

1. Commit and push changes:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. Both deployments will auto-redeploy on push

3. Test your app at your frontend URL

## Troubleshooting

**Backend not connecting?**
- Check CORS settings in `app.js`
- Verify MongoDB connection string
- Check environment variables in Vercel

**Frontend not loading?**
- Check `VITE_API_URL` is set correctly
- Clear browser cache
- Check browser console for errors (F12)

**Functions not working?**
- Check Vercel logs for errors
- Verify all environment variables are set
- Check MongoDB is accessible

## Free Tier Limits
- ✅ Unlimited deployments
- ✅ Unlimited projects
- ✅ 10GB bandwidth/month
- ✅ Enough for development and testing

---

**Questions?** Check Vercel docs: https://vercel.com/docs
