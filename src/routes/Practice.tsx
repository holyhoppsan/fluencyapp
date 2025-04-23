import { useEffect, useState } from "react";
import { PracticeSetup, PracticeOptions } from "../components/PracticeSetup";
import { FlashcardPractice } from "../components/FlashcardPractice";
import { WordEntry } from "../types";
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

      // TODO: Replace with spaced repetition logic
      const shuffled = allWords.sort(() => Math.random() - 0.5);
      const selected =
        options.mode === "word-count"
          ? shuffled.slice(0, options.count)
          : shuffled;

      setWords(selected);
    };

    fetchWords();
  }, [options]);

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
        onComplete={(finalScore: number) => {
          setScore(finalScore);
          setComplete(true);
        }}
      />
    </div>
  );
}
