import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { WordEntry } from "../types";
import AddWordForm from "../components/AddWordForm";

export default function Vocabulary() {
  const [words, setWords] = useState<(WordEntry & { id: string; srScore: number })[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEnglish, setEditEnglish] = useState("");
  const [editSpanish, setEditSpanish] = useState("");
  const navigate = useNavigate();

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
        seenCount: data.seenCount ?? correctCount,
        correctCount,
        srScore,
      };
    });

    setWords(loadedWords);
  };

  useEffect(() => {
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

  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.split("\n").map((row) => row.trim()).filter(Boolean);

    const entries: { english: string; spanish: string }[] = [];
    const badRows: string[] = [];

    for (const row of rows) {
      const parts = row.split(",").map((p) => p.trim());
      if (parts.length !== 2 || parts.some((val) => !val || /[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/.test(val))) {
        badRows.push(row);
      } else {
        entries.push({ english: parts[0], spanish: parts[1] });
      }
    }

    if (badRows.length > 0) {
      alert("Invalid CSV format. Please ensure the file has exactly 2 columns and only contains valid Spanish/English characters.");
      return;
    }

    navigate("/vocabulary/import-preview", { state: { parsedEntries: entries } });
  };

  return (
    <div>
      <h2>Add / Edit Vocabulary</h2>
      <AddWordForm onWordAdded={fetchWords} />

      <h3 style={{ marginTop: "2rem" }}>Import Vocab</h3>
      <input
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        id="csvInput"
        onChange={handleCSVImport}
      />
      <button onClick={() => document.getElementById("csvInput")?.click()}>
        Import Vocabulary from CSV
      </button>

      <h3 style={{ marginTop: "2rem" }}>Your Words</h3>
      <table>
        <thead>
          <tr>
            <th>Spanish</th>
            <th>English</th>
            <th>SR Score</th>
            <th>Accuracy</th>
            <th>History</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {words.map((word) => {
            const seen = Math.max(word.seenCount ?? 0, word.correctCount ?? 0);
            const accuracy =
              seen > 0
                ? Math.min(100, Math.round((word.correctCount ?? 0) / seen * 100))
                : "–";

            return (
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
                <td>{typeof accuracy === "number" ? `${accuracy}%` : "–"}</td>
                <td>
                  {(word.history ?? []).map((result, i) => (
                    <span key={i}>{result ? "✅" : "❌"}</span>
                  ))}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
