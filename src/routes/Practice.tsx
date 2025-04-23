import { useEffect, useState } from "react";
import { PracticeSetup, PracticeOptions } from "../components/PracticeSetup";
import { FlashcardPractice } from "../components/FlashcardPractice";
import { WordEntry } from "../types";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

export default function Practice() {
  const [options, setOptions] = useState<PracticeOptions | null>(null);
  const [words, setWords] = useState<WordEntry[]>([]);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!options) return;

    const fetchWords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
      const allWords = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WordEntry[];

      const now = Date.now();
      const scoredWords = allWords.map((word) => {
        const lastSeen = word.lastSeen || 0;
        const correctCount = word.correctCount || 0;
        const score = (now - lastSeen) / (1 + correctCount);
        return { ...word, srScore: score };
      });

      const sorted = scoredWords.sort((a, b) => b.srScore - a.srScore);

      const selected =
        options.mode === "word-count"
          ? sorted.slice(0, options.count)
          : sorted;

      setWords(selected);
    };

    fetchWords();
  }, [options]);

  const handleSessionComplete = async (
    finalScore: number,
    seenWords: WordEntry[],
    correctWords: string[]
  ) => {
    setScore(finalScore);
    setComplete(true);

    const user = auth.currentUser;
    if (!user) return;

    const batch = writeBatch(db);
    const now = Date.now();

    seenWords.forEach((word) => {
      if (!word.id) {
        console.warn("Skipping update for word with missing ID", word);
        return;
      }

      const ref = doc(db, "users", user.uid, "words", word.id);
      const updates: Partial<WordEntry> = {
        lastSeen: now,
      };

      if (correctWords.includes(word.id)) {
        updates.correctCount = (word.correctCount || 0) + 1;
      }

      batch.update(ref, updates);
    });

    await batch.commit();
  };

  if (!options) {
    return <PracticeSetup onStart={setOptions} />;
  }

  if (complete) {
    return (
      <div>
        <h2>✅ Practice Complete!</h2>
        <p>
          You scored <strong>{score}</strong> out of{" "}
          <strong>{words.length}</strong>
        </p>
        <button
          onClick={() => {
            setOptions(null);
            setWords([]);
            setScore(0);
            setComplete(false);
          }}
        >
          Start New Session
        </button>
      </div>
    );
  }

  return (
    <div>
      <FlashcardPractice
        words={words}
        options={options}
        onComplete={(finalScore, seenWords, correctWords) =>
          handleSessionComplete(finalScore, seenWords, correctWords)
        }
      />
    </div>
  );
}
