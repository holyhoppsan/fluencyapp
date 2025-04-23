import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { WordEntry } from "../types";

export default function Vocabulary() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [editWordId, setEditWordId] = useState<string | null>(null);
  const [editedEnglish, setEditedEnglish] = useState("");
  const [editedSpanish, setEditedSpanish] = useState("");

  const [newEnglish, setNewEnglish] = useState("");
  const [newSpanish, setNewSpanish] = useState("");

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
    const entries: WordEntry[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as WordEntry[];

    setWords(entries);
  };

  const startEdit = (word: WordEntry) => {
    setEditWordId(word.id || null);
    setEditedEnglish(word.english);
    setEditedSpanish(word.spanish);
  };

  const submitEdit = async () => {
    if (!editWordId) return;
    const user = auth.currentUser;
    if (!user) return;

    const wordRef = doc(db, "users", user.uid, "words", editWordId);
    await updateDoc(wordRef, {
      english: editedEnglish,
      spanish: editedSpanish,
    });

    await fetchWords();
    setEditWordId(null);
  };

  const addWord = async () => {
    const user = auth.currentUser;
    if (!user || !newEnglish || !newSpanish) return;

    const userWordsRef = collection(db, "users", user.uid, "words");

    await addDoc(userWordsRef, {
      english: newEnglish,
      spanish: newSpanish,
      correctCount: 0,
      lastSeen: Date.now(),
    });

    setNewEnglish("");
    setNewSpanish("");
    await fetchWords();
  };

  return (
    <div>
      <h2>Vocabulary</h2>

      <h3>Add New Word</h3>
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={newEnglish}
          onChange={(e) => setNewEnglish(e.target.value)}
          placeholder="English"
        />
        <input
          value={newSpanish}
          onChange={(e) => setNewSpanish(e.target.value)}
          placeholder="Spanish"
        />
        <button onClick={addWord}>Add Word</button>
      </div>

      <h3>Your Words</h3>
      <table>
        <thead>
          <tr>
            <th>English</th>
            <th>Spanish</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.id}>
              <td>
                {editWordId === word.id ? (
                  <input
                    value={editedEnglish}
                    onChange={(e) => setEditedEnglish(e.target.value)}
                  />
                ) : (
                  word.english
                )}
              </td>
              <td>
                {editWordId === word.id ? (
                  <input
                    value={editedSpanish}
                    onChange={(e) => setEditedSpanish(e.target.value)}
                  />
                ) : (
                  word.spanish
                )}
              </td>
              <td>
                {editWordId === word.id ? (
                  <button onClick={submitEdit}>Save</button>
                ) : (
                  <button onClick={() => startEdit(word)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
