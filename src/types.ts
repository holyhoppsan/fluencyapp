export interface WordEntry {
  id?: string;
  english: string;
  spanish: string;
  correctCount?: number;
  seenCount?: number;
  lastSeen?: number;
  history?: boolean[]; // last 5 attempts (true = correct, false = incorrect)
}
