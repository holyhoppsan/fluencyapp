import { useEffect, useState } from "react";
import { WordEntry } from "../types";
import { PracticeOptions } from "./PracticeSetup";

type Props = {
  words: WordEntry[];
  options: PracticeOptions;
  onComplete: () => void;
};

export const FlashcardPractice = ({ words, options, onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(options.mode === "timed" ? options.count * 60 : 0);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (options.mode === "timed") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [options]);

  const getPrompt = () => {
    switch (options.direction) {
      case "es-en":
        return currentWord.spanish;
      case "en-es":
        return currentWord.english;
      case "random":
        return Math.random() > 0.5 ? currentWord.english : currentWord.spanish;
    }
  };

  const getAnswer = () => {
    switch (options.direction) {
      case "es-en":
        return currentWord.english;
      case "en-es":
        return currentWord.spanish;
      case "random":
        return `${currentWord.english}|${currentWord.spanish}`;
    }
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

    if (options.mode === "word-count" && nextIndex >= options.count) {
      onComplete();
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  if (!currentWord) {
    return <div>✅ Session complete! Score: {score}/{words.length}</div>;
  }

  return (
    <div>
      {options.mode === "timed" && (
        <div>⏱ Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</div>
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
          <p>Correct answer: <strong>{getAnswer()}</strong></p>
          <button onClick={next}>Next</button>
        </>
      )}
    </div>
  );
};
