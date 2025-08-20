// Firebase Auth Test Utility
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const testFirebaseAuth = async () => {
  console.log('🧪 Testing Firebase Authentication...');
  console.log('=====================================');
  
  try {
    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase Auth initialized:', !!auth);
    console.log('✅ Firebase DB initialized:', !!db);
    
    // Test 2: Check current user
    const currentUser = auth.currentUser;
    console.log('👤 Current user:', currentUser ? currentUser.email : 'None');
    
    // Test 3: Try to create a test user
    const testEmail = 'test@vayra.digital';
    const testPassword = 'VayraTest@2025';
    
    console.log('🔍 Testing user creation...');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('✅ User created successfully:', userCredential.user.email);
      
      // Test 4: Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      console.log('📄 User document exists:', userDoc.exists());
      
      // Test 5: Sign out
      await auth.signOut();
      console.log('✅ Sign out successful');
      
    } catch (createError: any) {
      console.log('ℹ️ User might already exist:', createError.code);
      
      // Test 6: Try to sign in
      console.log('🔍 Testing user sign in...');
      try {
        const signInCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
        console.log('✅ Sign in successful:', signInCredential.user.email);
        
        // Test 7: Check user document after sign in
        const userDoc = await getDoc(doc(db, 'users', signInCredential.user.uid));
        console.log('📄 User document exists:', userDoc.exists());
        
        // Test 8: Sign out
        await auth.signOut();
        console.log('✅ Sign out successful');
        
      } catch (signInError: any) {
        console.error('❌ Sign in failed:', signInError.code, signInError.message);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error);
  }
  
  console.log('=====================================');
};
