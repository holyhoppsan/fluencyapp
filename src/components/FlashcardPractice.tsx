import { useEffect, useMemo, useRef, useState } from "react";
import { WordEntry } from "../types";
import { PracticeOptions } from "./PracticeSetup";

type WordWithDirection = WordEntry & { direction: "es-en" | "en-es" };

type Props = {
  words: WordEntry[];
  options: PracticeOptions;
  onComplete: (score: number, seenWords: WordEntry[], correctIds: string[]) => void;
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
  const [correctWordIds, setCorrectWordIds] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(
    options.mode === "timed" ? options.count * 60 : 0
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = sessionWords[currentIndex];

  useEffect(() => {
    if (!showAnswer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, showAnswer]);

  useEffect(() => {
    if (options.mode === "timed") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete(score, sessionWords, correctWordIds);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [options, score, correctWordIds, onComplete]);

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

    setWasCorrect(isCorrect);

    if (isCorrect) {
      const id = currentWord.id;
      if (!id) return;
      setScore((prev) => prev + 1);
      setCorrectWordIds((prev) => [...prev, id]);
    }

    setShowAnswer(true);
  };

  const next = () => {
    setInput("");
    setShowAnswer(false);
    setWasCorrect(null);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= sessionWords.length) {
      onComplete(score, sessionWords, correctWordIds);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  if (!sessionWords.length) {
    return <div>No words available for practice.</div>;
  }

  if (!currentWord) {
    return null; // onComplete will handle exiting the session
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

      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (!showAnswer) {
              checkAnswer();
            } else {
              next();
            }
          }
        }}
        placeholder="Your answer"
      />

      {!showAnswer ? (
        <button onClick={checkAnswer}>Check</button>
      ) : (
        <>
          <h4 style={{ color: wasCorrect ? "green" : "red" }}>
            {wasCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </h4>
          <p>
            <strong>Your answer:</strong> {input || "(blank)"}
          </p>
          <p>
            <strong>Correct answer:</strong> {getAnswer()}
          </p>
          <button onClick={next}>Next</button>
        </>
      )}
    </div>
  );
};
