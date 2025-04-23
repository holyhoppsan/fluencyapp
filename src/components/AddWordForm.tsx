import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddWordForm({ onWordAdded }: { onWordAdded?: () => void }) {
  const [english, setEnglish] = useState("");
  const [spanish, setSpanish] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !english || !spanish) return;

    const wordsRef = collection(db, "users", user.uid, "words");
    await addDoc(wordsRef, {
      english: english.trim(),
      spanish: spanish.trim(),
      correctCount: 0,
      lastSeen: 0,
    });

    setEnglish("");
    setSpanish("");

    if (onWordAdded) onWordAdded(); // ✅ trigger refresh in parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="English"
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Spanish"
        value={spanish}
        onChange={(e) => setSpanish(e.target.value)}
        required
      />
      <button type="submit">Add Word</button>
    </form>
  );
}
