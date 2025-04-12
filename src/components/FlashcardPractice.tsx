import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { WordEntry } from "../types";

export const FlashcardPractice = () => {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [current, setCurrent] = useState<WordEntry | null>(null);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(collection(db, "words"));
      const entries: WordEntry[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WordEntry));
      setWords(entries);
      setCurrent(entries[Math.floor(Math.random() * entries.length)]);
    })();
  }, []);

  const checkAnswer = async () => {
    if (!current) return;
    if (guess.toLowerCase().trim() === current.spanish.toLowerCase()) {
      setFeedback("✅ Correct!");
      const ref = doc(db, "words", current.id!);
      await updateDoc(ref, {
        correctCount: current.correctCount + 1,
        lastSeen: Date.now(),
      });
    } else {
      setFeedback(`❌ Wrong! Correct answer: ${current.spanish}`);
    }
    setGuess("");
    const next = words[Math.floor(Math.random() * words.length)];
    setCurrent(next);
  };

  return (
    <div>
      <h2>Practice Mode</h2>
      {current && (
        <div>
          <p>Translate: <strong>{current.english}</strong></p>
          <input value={guess} onChange={e => setGuess(e.target.value)} placeholder="Type in Spanish" />
          <button onClick={checkAnswer}>Check</button>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};
