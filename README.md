# Zomato Food Delivery App

A modern TikTok-style food delivery platform with vertical video feeds, like/save features, and seamless user experience.

## 🚀 Features

### For Users
- ✅ Vertical video feed (TikTok-style)
- ✅ Like and Save food items
- ✅ User profile with saved/liked collections
- ✅ Watch videos fullscreen
- ✅ Visit partner stores

### For Food Partners
- ✅ Upload food items with videos
- ✅ Dashboard with stats
- ✅ Manage food items (delete)
- ✅ Public profile page
- ✅ Video management

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- React Router
- Axios
- CSS Variables

**Backend:**
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- ImageKit (video storage)
- Cookie Parser
- Bcrypt

## 📦 Installation

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_atlas_uri
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

Run:
```bash
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Deployment

**Backend:** Deployed on Vercel
**Frontend:** Deployed on Vercel
**Database:** MongoDB Atlas

## 📝 API Endpoints

### Auth
- POST `/api/auth/user/register` - User registration
- POST `/api/auth/user/login` - User login
- POST `/api/auth/foodpartner/register` - Partner registration
- POST `/api/auth/foodpartner/login` - Partner login

### Food
- GET `/api/food` - Get all food items
- POST `/api/food` - Create food item
- DELETE `/api/food/:id` - Delete food item

### User
- POST `/api/user/like/:foodId` - Like/unlike food
- POST `/api/user/save/:foodId` - Save/unsave food
- GET `/api/user/liked` - Get liked foods
- GET `/api/user/saved` - Get saved foods
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/profile` - Update profile

## 🎨 Features Highlights

- **TikTok-Style UI**: Vertical video scrolling
- **Like & Save**: Instagram-style interactions
- **User Profiles**: Manage saved and liked items
- **Food Partner Dashboard**: Complete management system
- **Responsive Design**: Works on all devices
- **Secure Auth**: JWT + HTTP-only cookies

## 📄 License

MIT

## 👤 Author

Ashish (nordzx777)
