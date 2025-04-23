import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { WordEntry } from "../types";
import AddWordForm from "../components/AddWordForm"; // ✅ updated to match default export

export default function Vocabulary() {
  const [words, setWords] = useState<(WordEntry & { srScore: number })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editSpanish, setEditSpanish] = useState("");

  useEffect(() => {
    const fetchWords = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
      const now = Date.now();

      const loadedWords = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as WordEntry;
        const lastSeen = data.lastSeen || 0;
        const correctCount = data.correctCount || 0;
        const srScore = (now - lastSeen) / (1 + correctCount);
        return {
          ...data,
          id: docSnap.id,
          srScore,
        };
      });

      setWords(loadedWords);
    };

    fetchWords();
  }, []);

  const handleEdit = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "users", user.uid, "words", id);
    await updateDoc(ref, {
      english: editEnglish,
      spanish: editSpanish,
    });

    setWords((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, english: editEnglish, spanish: editSpanish } : w
      )
    );

    setEditingId(null);
    setEditEnglish("");
    setEditSpanish("");
  };

  return (
    <div>
      <h2>Add / Edit Vocabulary</h2>
      <AddWordForm />
      <h3 style={{ marginTop: "2rem" }}>Your Words</h3>
      <table>
        <thead>
          <tr>
            <th>Spanish</th>
            <th>English</th>
            <th>SR Score</th>
            <th>Correct</th>
            <th>Last Seen</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => (
            <tr key={word.id}>
              <td>
                {editingId === word.id ? (
                  <input
                    value={editSpanish}
                    onChange={(e) => setEditSpanish(e.target.value)}
                  />
                ) : (
                  word.spanish
                )}
              </td>
              <td>
                {editingId === word.id ? (
                  <input
                    value={editEnglish}
                    onChange={(e) => setEditEnglish(e.target.value)}
                  />
                ) : (
                  word.english
                )}
              </td>
              <td>{Math.round(word.srScore)}</td>
              <td>{word.correctCount ?? 0}</td>
              <td>
                {word.lastSeen
                  ? new Date(word.lastSeen).toLocaleDateString()
                  : "Never"}
              </td>
              <td>
                {editingId === word.id ? (
                  <button onClick={() => handleEdit(word.id)}>Save</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(word.id);
                      setEditEnglish(word.english);
                      setEditSpanish(word.spanish);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
