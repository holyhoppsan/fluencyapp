import { db, auth } from "../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { WordEntry } from "../types";

export async function fixOldVocabularyEntries() {
  const user = auth.currentUser;
  if (!user) {
    console.warn("User not authenticated");
    return;
  }

  const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
  const updates = [];

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as WordEntry;
    const correctCount = data.correctCount ?? 0;
    const seenCount = data.seenCount ?? 0;

    if (seenCount < correctCount) {
      const ref = doc(db, "users", user.uid, "words", docSnap.id);
      console.log(`Fixing word "${data.spanish}" / "${data.english}"`);

      updates.push(
        updateDoc(ref, {
          seenCount: correctCount,
        })
      );
    }
  }

  if (updates.length > 0) {
    await Promise.all(updates);
    console.log(`✅ Updated ${updates.length} entries.`);
  } else {
    console.log("✅ No updates needed.");
  }
}
