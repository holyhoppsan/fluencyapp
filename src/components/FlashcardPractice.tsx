import { useEffect, useMemo, useState } from "react";
import { WordEntry } from "../types";
import { PracticeOptions } from "./PracticeSetup";

type WordWithDirection = WordEntry & { direction: "es-en" | "en-es" };

type Props = {
  words: WordEntry[];
  options: PracticeOptions;
  onComplete: (score: number) => void;
};

export const FlashcardPractice = ({ words, options, onComplete }: Props) => {
  const sessionWords: WordWithDirection[] = useMemo(() => {
    const count = Math.min(options.count, words.length);
    const limitedWords = options.mode === "word-count" ? words.slice(0, count) : words;

    return limitedWords.map((word) => {
      let direction: "es-en" | "en-es";
      if (options.direction === "random") {
        direction = Math.random() > 0.5 ? "es-en" : "en-es";
      } else {
        direction = options.direction;
      }
      return { ...word, direction };
    });
  }, [words, options]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    options.mode === "timed" ? options.count * 60 : 0
  );

  const currentWord = sessionWords[currentIndex];

  useEffect(() => {
    if (options.mode === "timed") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete(score);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [options, score, onComplete]);

  const getPrompt = () => {
    return currentWord.direction === "es-en"
      ? currentWord.spanish
      : currentWord.english;
  };

  const getAnswer = () => {
    return currentWord.direction === "es-en"
      ? currentWord.english
      : currentWord.spanish;
  };

  const checkAnswer = () => {
    const correctAnswers = getAnswer().toLowerCase().split("|").map((s) => s.trim());
    const userAnswer = input.trim().toLowerCase();
    const isCorrect = correctAnswers.includes(userAnswer);
    if (isCorrect) setScore((prev) => prev + 1);
    setShowAnswer(true);
  };

  const next = () => {
    setInput("");
    setShowAnswer(false);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sessionWords.length) {
      onComplete(score);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  if (!sessionWords.length) {
    return <div>No words available for practice.</div>;
  }

  if (!currentWord) {
    return null; // We now end session with onComplete(), so this should never render
  }

  return (
    <div>
      {options.mode === "timed" && (
        <div>
          ⏱ Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      )}

      <h3>Translate:</h3>
      <div style={{ fontSize: "1.5rem", margin: "1rem 0" }}>
        <strong>{getPrompt()}</strong>
      </div>

      {!showAnswer ? (
        <>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your answer"
          />
          <button onClick={checkAnswer}>Check</button>
        </>
      ) : (
        <>
          <p>
            Correct answer: <strong>{getAnswer()}</strong>
          </p>
          <button onClick={next}>Next</button>
        </>
      )}
    </div>
  );
};
