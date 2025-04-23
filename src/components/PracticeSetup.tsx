import { useState } from "react";

export type PracticeDirection = "es-en" | "en-es" | "random";
export type PracticeMode = "word-count" | "timed";

export type PracticeOptions = {
  mode: PracticeMode;
  count: number;
  direction: PracticeDirection;
};

export const PracticeSetup = ({ onStart }: { onStart: (options: PracticeOptions) => void }) => {
  const [mode, setMode] = useState<PracticeMode>("word-count");
  const [count, setCount] = useState<number>(10);
  const [direction, setDirection] = useState<PracticeDirection>("random");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ mode, count, direction });
  };

  return (
    <div>
      <h2>Start Practice</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Mode:
            <select value={mode} onChange={(e) => setMode(e.target.value as PracticeMode)}>
              <option value="word-count">Fixed Number of Words</option>
              <option value="timed">Timed (Minutes)</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            {mode === "word-count" ? "Number of Words:" : "Session Time (minutes):"}
            <input
              type="number"
              min={1}
              max={999}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />
          </label>
        </div>

        <div>
          <label>
            Direction:
            <select value={direction} onChange={(e) => setDirection(e.target.value as PracticeDirection)}>
              <option value="es-en">Spanish → English</option>
              <option value="en-es">English → Spanish</option>
              <option value="random">Random</option>
            </select>
          </label>
        </div>

        <button type="submit">Start</button>
      </form>
    </div>
  );
};
