import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
// };

const firebaseConfig = {
  apiKey: "AIzaSyCA0OveMPitCBSsfcyDYp2clRMbKInGIHE",
  authDomain: "hng-stage-2-ae71e.firebaseapp.com",
  projectId: "hng-stage-2-ae71e",
  storageBucket: "hng-stage-2-ae71e.firebasestorage.app",
  messagingSenderId: "289611323124",
  appId: "1:289611323124:web:842f6f8a40fef95d28f0a1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
