import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

type Entry = {
  english: string;
  spanish: string;
  import: boolean;
};

export default function ImportPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<Entry[]>([]);

  const parsedEntries = (location.state?.parsedEntries ?? []) as {
    english: string;
    spanish: string;
  }[];

  useEffect(() => {
    const checkDuplicates = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
      const existingWords = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          english: (data.english ?? "").toLowerCase().replace(/\s+/g, ""),
          spanish: (data.spanish ?? "").toLowerCase().replace(/\s+/g, ""),
        };
      });

      const entriesWithStatus = parsedEntries.map((entry) => {
        const normalizedEnglish = entry.english.toLowerCase().replace(/\s+/g, "");
        const normalizedSpanish = entry.spanish.toLowerCase().replace(/\s+/g, "");
        const exists = existingWords.some(
          (word) =>
            word.english === normalizedEnglish &&
            word.spanish === normalizedSpanish
        );
        return { ...entry, import: !exists };
      });

      setPreviewData(entriesWithStatus);
    };

    checkDuplicates();
  }, [parsedEntries]);

  const handleImport = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const batch = previewData.filter((row) => row.import);
    for (const word of batch) {
      const newDoc = doc(collection(db, "users", user.uid, "words"));
      await setDoc(newDoc, {
        english: word.english,
        spanish: word.spanish,
        correctCount: 0,
        seenCount: 0,
        history: [],
        lastSeen: 0,
      });
    }

    navigate("/vocabulary", { state: { importSuccess: true } });
  };

  return (
    <div>
      <h2>Import Preview</h2>
      <table>
        <thead>
          <tr>
            <th>English</th>
            <th>Spanish</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {previewData.map((entry, idx) => (
            <tr key={idx}>
              <td>{entry.english}</td>
              <td>{entry.spanish}</td>
              <td>{entry.import ? "✅ Will Import" : "❌ Already Exists"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleImport}>✅ Confirm Import</button>
        <button onClick={() => navigate("/vocabulary")}>❌ Cancel</button>
      </div>
    </div>
  );
}
