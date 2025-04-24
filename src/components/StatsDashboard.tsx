import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { WordEntry } from "../types";

export const StatsDashboard = () => {
  const [stats, setStats] = useState<{
    total: number;
    totalCorrect: number;
    accuracy: number;
    practicedToday: number;
    practicedWeek: number;
    practicedMonth: number;
  }>({
    total: 0,
    totalCorrect: 0,
    accuracy: 0,
    practicedToday: 0,
    practicedWeek: 0,
    practicedMonth: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const now = Date.now();
      const oneDay = 1000 * 60 * 60 * 24;
      const oneWeek = oneDay * 7;
      const oneMonth = oneDay * 30;

      const snapshot = await getDocs(collection(db, "users", user.uid, "words"));
      const words: WordEntry[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as WordEntry[];

      const total = words.length;
      const totalCorrect = words.reduce((sum, w) => sum + (w.correctCount || 0), 0);
      const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

      const practicedToday = words.filter((w) => now - (w.lastSeen || 0) < oneDay).length;
      const practicedWeek = words.filter((w) => now - (w.lastSeen || 0) < oneWeek).length;
      const practicedMonth = words.filter((w) => now - (w.lastSeen || 0) < oneMonth).length;

      setStats({
        total,
        totalCorrect,
        accuracy,
        practicedToday,
        practicedWeek,
        practicedMonth
      });
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h2>📊 Your Progress</h2>
      <ul>
        <li><strong>Total words:</strong> {stats.total}</li>
        <li><strong>Total correct answers:</strong> {stats.totalCorrect}</li>
        <li><strong>Accuracy:</strong> {stats.accuracy}%</li>
        <li><strong>Practiced today:</strong> {stats.practicedToday}</li>
        <li><strong>Practiced this week:</strong> {stats.practicedWeek}</li>
        <li><strong>Practiced this month:</strong> {stats.practicedMonth}</li>
      </ul>
    </div>
  );
};
