import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const AddWordForm = () => {
  const [english, setEnglish] = useState("");
  const [spanish, setSpanish] = useState("");

  const addWord = async () => {
    const user = auth.currentUser;
    if (!user || !english || !spanish) return;

    const userWordsRef = collection(db, "users", user.uid, "words");

    await addDoc(userWordsRef, {
      english,
      spanish,
      correctCount: 0,
      lastSeen: Date.now()
    });

    setEnglish("");
    setSpanish("");
  };

  return (
    <div>
      <h2>Add New Word</h2>
      <input
        value={english}
        onChange={(e) => setEnglish(e.target.value)}
        placeholder="English"
      />
      <input
        value={spanish}
        onChange={(e) => setSpanish(e.target.value)}
        placeholder="Spanish"
      />
      <button onClick={addWord}>Add Word</button>
    </div>
  );
};
