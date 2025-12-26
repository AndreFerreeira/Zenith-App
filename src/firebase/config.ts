// NOTE: This file reads the Firebase configuration from environment variables.
// You must create a .env.local file in the root of your project and add the following:
// NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
// NEXT_public_firebase_messaging_sender_id=12345...
// NEXT_PUBLIC_FIREBASE_APP_ID=1:12345...

export const firebaseConfig = {
  apiKey: "YOUR_EXACT_API_KEY_FROM_CONSOLE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
