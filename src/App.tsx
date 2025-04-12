import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { SignIn } from "./components/SignIn";
import { AddWordForm } from "./components/AddWordForm";
import { FlashcardPractice } from "./components/FlashcardPractice";

export default function App() {
  const [user] = useAuthState(auth);

  return (
    <div style={{ padding: 20 }}>
      <h1>Fluency App</h1>
      <SignIn user={user} />
      {user && (
        <>
          <AddWordForm />
          <FlashcardPractice />
        </>
      )}
    </div>
  );
}
