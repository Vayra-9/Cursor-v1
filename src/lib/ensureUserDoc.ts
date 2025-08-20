import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export async function ensureUserDoc() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  
  if (!snap.exists()) {
    await setDoc(ref, {
      createdAt: serverTimestamp(),
      plan: "free",
      profile: { email: auth.currentUser?.email || null }
    });
  }
}
