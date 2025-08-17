import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { paths } from '@/services/db'

export default function DevSeed() {
  const [uid, setUid] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Waiting for auth...')

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) { setUid(null); setStatus('Please sign in first.'); return }
      setUid(user.uid)
    })
  }, [])

  const seed = async () => {
    if (!uid) return
    setStatus('Seeding...')
    await setDoc(paths.userProfile(uid), {
      name: 'VAYRA User',
      email: auth.currentUser?.email ?? 'user@example.com',
      country: 'IN',
      createdAt: serverTimestamp()
    }, { merge: true })
    await setDoc(paths.userAccess(uid), {
      plan: 'free',
      grandfathered: false,
      joinedAt: serverTimestamp(),
      pricePaid: 0
    }, { merge: true })
    setStatus('Seed complete ✅')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dev Seed</h1>
      <p>User: {uid ?? 'Not signed in'}</p>
      <button onClick={seed} disabled={!uid} style={{ padding: 12, borderRadius: 8 }}>
        Seed Profile + Access
      </button>
      <p style={{ marginTop: 12 }}>{status}</p>
    </div>
  )
}
