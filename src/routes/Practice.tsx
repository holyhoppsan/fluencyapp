import { useState } from "react";
import { PracticeSetup, PracticeOptions } from "../components/PracticeSetup";
// import { FlashcardPractice } from "../components/FlashcardPractice"; // will use later

export default function Practice() {
  const [options, setOptions] = useState<PracticeOptions | null>(null);

  if (!options) {
    return <PracticeSetup onStart={setOptions} />;
  }

  return (
    <div>
      <h2>Practice Session</h2>
      <p>
        Mode: {options.mode}, Count: {options.count}, Direction: {options.direction}
      </p>
      {/* Later we'll insert the practice component here */}
    </div>
  );
}
