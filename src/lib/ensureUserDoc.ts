import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function ensureUserDoc(uid?: string, email?: string) {
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return;
  
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    await setDoc(ref, {
      email: email || auth.currentUser?.email,
      plan: "free",
      createdAt: serverTimestamp()
    }, { merge: true });
  }
}
