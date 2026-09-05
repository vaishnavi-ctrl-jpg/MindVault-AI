import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { JournalEntry } from '../types';

/**
 * Save a new journal entry under the user's isolated subcollection:
 * /users/{userId}/journals/{journalId}
 */
export async function saveUserJournal(userId: string, entry: JournalEntry): Promise<void> {
  if (!userId) throw new Error('User ID required for isolated Firestore write.');

  try {
    const journalRef = doc(db, 'users', userId, 'journals', entry.id);
    await setDoc(journalRef, {
      ...entry,
      userId: userId, // Enforces security rule match request.auth.uid == userId
      createdAt: entry.createdAt || Date.now()
    });
    console.log(`[Firestore Secure Write] Saved journal ${entry.id} under isolated path /users/${userId}/journals/`);
  } catch (err: any) {
    console.warn('[Firestore Fallback] Saving to isolated user storage:', err.message);
  }

  // Always keep user-isolated localStorage fallback key
  const storageKey = `mindvault_journals_isolated_${userId}`;
  const existingRaw = localStorage.getItem(storageKey);
  const existing: JournalEntry[] = existingRaw ? JSON.parse(existingRaw) : [];
  const updated = [entry, ...existing.filter(e => e.id !== entry.id)];
  localStorage.setItem(storageKey, JSON.stringify(updated));
}

/**
 * Fetch all journal entries for the specific authenticated user only:
 * /users/{userId}/journals/
 */
export async function getUserJournals(userId: string): Promise<JournalEntry[]> {
  if (!userId) return [];

  try {
    const journalsRef = collection(db, 'users', userId, 'journals');
    const q = query(journalsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const results: JournalEntry[] = [];
      snapshot.forEach(docSnap => {
        results.push(docSnap.data() as JournalEntry);
      });
      return results;
    }
  } catch (err: any) {
    console.warn('[Firestore Query Notice] Reading from user-isolated local vault:', err.message);
  }

  // User-isolated local storage key
  const storageKey = `mindvault_journals_isolated_${userId}`;
  const existingRaw = localStorage.getItem(storageKey);
  if (existingRaw) {
    try {
      return JSON.parse(existingRaw);
    } catch (e) {}
  }

  // Pre-populate realistic seed entry for instant demo if fresh user
  const seedEntry: JournalEntry = {
    id: 'seed-entry-1',
    userId: userId,
    title: 'Architecting Zero-Trust AI Applications',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    summary: 'Reflected on building secure AI systems with Google AI Studio directives, Firebase user isolation, and Secret Manager key fetching.',
    keyTakeaways: [
      'Configured Google AI Studio system directives constitution.',
      'Enforced strict Firestore rules: request.auth.uid == userId.',
      'Hidden Gemini API keys inside Google Cloud Secret Manager backend proxy.'
    ],
    sentiment: { positivity: 90, clarity: 95, energy: 85, anxiety: 10 },
    tags: ['#GoogleAIStudio', '#Security', '#Ideathon', '#Firestore'],
    emotionalTone: 'Confident & Strategic',
    chatHistory: [
      { id: '1', role: 'user', text: 'How do I ensure my AI app is production-ready and secure?', timestamp: '10:00 AM' },
      { id: '2', role: 'model', text: 'To achieve enterprise-grade security: bake security directives into your AI Studio constitution, isolate Firestore subcollections by userId, and retrieve API keys from Google Cloud Secret Manager.', timestamp: '10:01 AM' }
    ],
    personaUsed: 'Strategic Planner',
    createdAt: Date.now() - 3600000
  };

  const initialList = [seedEntry];
  localStorage.setItem(storageKey, JSON.stringify(initialList));
  return initialList;
}

/**
 * Delete a journal entry for the authenticated user only
 */
export async function deleteUserJournal(userId: string, journalId: string): Promise<void> {
  if (!userId || !journalId) return;

  try {
    const journalRef = doc(db, 'users', userId, 'journals', journalId);
    await deleteDoc(journalRef);
  } catch (e) {}

  const storageKey = `mindvault_journals_isolated_${userId}`;
  const existingRaw = localStorage.getItem(storageKey);
  if (existingRaw) {
    const existing: JournalEntry[] = JSON.parse(existingRaw);
    const filtered = existing.filter(item => item.id !== journalId);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
  }
}
