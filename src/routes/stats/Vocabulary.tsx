import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import { WordEntry } from "../../types";

export default function Vocabulary() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [editWordId, setEditWordId] = useState<string | null>(null);
  const [editedEnglish, setEditedEnglish] = useState("");
  const [editedSpanish, setEditedSpanish] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
      const entries: WordEntry[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as WordEntry[];

      setWords(entries);
    };

    fetchWords();
  }, []);

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
      spanish: editedSpanish
    });

    setWords(words.map(w =>
      w.id === editWordId
        ? { ...w, english: editedEnglish, spanish: editedSpanish }
        : w
    ));

    setEditWordId(null);
  };

  return (
    <div>
      <h3>Your Vocabulary</h3>
      <table>
        <thead>
          <tr>
            <th>English</th>
            <th>Spanish</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map(word => (
            <tr key={word.id}>
              <td>
                {editWordId === word.id ? (
                  <input
                    value={editedEnglish}
                    onChange={e => setEditedEnglish(e.target.value)}
                  />
                ) : (
                  word.english
                )}
              </td>
              <td>
                {editWordId === word.id ? (
                  <input
                    value={editedSpanish}
                    onChange={e => setEditedSpanish(e.target.value)}
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
