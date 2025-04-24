import { useState } from "react";
import { fixOldVocabularyEntries } from "../utils/fixOldVocabularyEntries";

export default function Maintenance() {
  const [status, setStatus] = useState<string>("");

  const handleClick = async () => {
    setStatus("Running...");
    try {
      await fixOldVocabularyEntries();
      setStatus("✅ Fix complete! You can now refresh your vocabulary.");
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to run fix. See console for details.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🛠 Maintenance</h2>
      <p>This tool fixes old vocabulary entries with invalid accuracy values.</p>
      <button onClick={handleClick}>Run Fix</button>
      <p>{status}</p>
    </div>
  );
}
