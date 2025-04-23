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

  useEffect(() => {
    if (options) {
      const fetchWords = async () => {
        const user = auth.currentUser;
        if (!user) return;
        const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
        const allWords = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as WordEntry[];

        // TODO: Apply spaced repetition sorting here

        const selected = allWords.slice(0, options.count);
        setWords(selected);
      };

      fetchWords();
    }
  }, [options]);

  if (!options) return <PracticeSetup onStart={setOptions} />;

  if (complete) {
    return <div>✅ Practice Complete! <button onClick={() => { setOptions(null); setComplete(false); }}>Start New</button></div>;
  }

  return (
    <div>
      <FlashcardPractice words={words} options={options} onComplete={() => setComplete(true)} />
    </div>
  );
}
