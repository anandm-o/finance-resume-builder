# Firebase Setup Guide for Finance Resume Builder

## 🚀 Quick Start

1. **Install Dependencies**: `npm install` (already done)
2. **Create Firebase Project**: Follow steps below
3. **Set Environment Variables**: Create `.env.local` file
4. **Test the App**: `npm run dev`

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier is sufficient)
- Modern web browser

## 🔥 Step-by-Step Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `finance-resume-builder`
4. Enable Google Analytics (optional but recommended)
5. Click **"Create project"**

### 2. Enable Authentication

1. In Firebase Console, go to **"Authentication"** (left sidebar)
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication
5. Click **"Save"**

### 3. Enable Firestore Database

1. Go to **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select location closest to your users
5. Click **"Done"**

### 4. Get Configuration

1. Click gear icon (⚙️) next to **"Project Overview"**
2. Select **"Project settings"**
3. Scroll to **"Your apps"** section
4. Click web icon (</>)
5. Register app with nickname: `finance-resume-builder-web`
6. Copy the configuration object

### 5. Environment Variables

Create `.env.local` file in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

**Replace the values** with your actual Firebase config:

```javascript
// Example from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "project.firebaseapp.com",   // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "project",                    // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "project.appspot.com",    // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",          // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123",        // NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-ABC123"               // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

## 🔒 Security Rules (Optional but Recommended)

In Firestore Database > Rules, set up security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own resumes
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to read their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🧪 Testing Your Setup

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Authentication

1. Go to `http://localhost:3000`
2. Click **"Sign In"** in navigation
3. Try to create a new account
4. Check Firebase Console > Authentication to see if user was created

### 3. Test Database

1. Sign in to the app
2. Go to **"Dashboard"**
3. Create a new resume
4. Check Firebase Console > Firestore to see if resume was saved

## 🚨 Common Issues & Solutions

### "Firebase: Error (auth/invalid-api-key)"

- Check your `.env.local` file exists
- Verify API key is correct
- Restart your dev server after adding environment variables

### "Firebase: Error (auth/operation-not-allowed)"

- Enable Email/Password authentication in Firebase Console
- Go to Authentication > Sign-in method > Email/Password

### "Firebase: Error (permission-denied)"

- Check Firestore security rules
- Ensure user is authenticated
- Verify database is created

### "Module not found: 'firebase'"

- Run `npm install firebase`
- Check `package.json` has firebase dependency

## 📱 Production Deployment

### 1. Update Security Rules

Change Firestore rules from "test mode" to production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### 2. Environment Variables

- Use production Firebase project
- Set environment variables in your hosting platform
- Never commit `.env.local` to version control

### 3. Hosting (Optional)

Firebase also provides hosting:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔍 Monitoring & Analytics

### 1. Firebase Console

- **Authentication**: Monitor user sign-ups and sign-ins
- **Firestore**: View database usage and performance
- **Analytics**: Track user behavior (if enabled)

### 2. Usage Limits (Free Tier)

- **Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **Hosting**: 10GB storage, 360MB/day transfer

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js with Firebase](https://nextjs.org/docs/api-routes/database)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

## 🆘 Need Help?

1. Check Firebase Console for error messages
2. Verify environment variables are set correctly
3. Ensure all Firebase services are enabled
4. Check browser console for JavaScript errors
5. Restart development server after configuration changes

---

**🎉 You're all set!** Your Finance Resume Builder now has full Firebase integration with authentication, database storage, and user management.
