// Firebase Configuration Debug Utility
// This file helps debug Firebase configuration issues

export const debugFirebaseConfig = () => {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  console.log('🔍 Firebase Environment Variables Check:');
  console.log('=====================================');
  
  const missingVars = Object.entries(envVars).filter(([key, value]) => !value);
  const presentVars = Object.entries(envVars).filter(([key, value]) => value);

  if (presentVars.length > 0) {
    console.log('✅ Present variables:');
    presentVars.forEach(([key, value]) => {
      console.log(`   ${key}: ${value?.substring(0, 10)}...`);
    });
  }

  if (missingVars.length > 0) {
    console.log('❌ Missing variables:');
    missingVars.forEach(([key]) => {
      console.log(`   ${key}`);
    });
    console.log('\n🚨 Firebase authentication will NOT work without these variables!');
    console.log('📝 Create a .env.local file in your project root with:');
    console.log('=====================================');
    console.log('# Firebase Configuration');
    console.log('VITE_FIREBASE_API_KEY=your-api-key-here');
    console.log('VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com');
    console.log('VITE_FIREBASE_PROJECT_ID=your-project-id');
    console.log('VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com');
    console.log('VITE_FIREBASE_MESSAGING_SENDER_ID=123456789');
    console.log('VITE_FIREBASE_APP_ID=1:123456789:web:your-app-id');
    console.log('=====================================');
  } else {
    console.log('✅ All Firebase environment variables are present!');
  }

  return {
    isConfigured: missingVars.length === 0,
    missingVars: missingVars.map(([key]) => key),
    presentVars: presentVars.map(([key]) => key)
  };
};
