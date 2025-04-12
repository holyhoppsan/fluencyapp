import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { SignIn } from "./components/SignIn";
import { AddWordForm } from "./components/AddWordForm";
import { FlashcardPractice } from "./components/FlashcardPractice";
import { StatsDashboard } from "./components/StatsDashboard";
import { Navbar } from "./components/Navbar";

export default function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <Navbar user={user} />
      <div style={{ padding: 20 }}>
        {!user ? (
          <SignIn user={user} />
        ) : (
          <>
            <StatsDashboard />
            <AddWordForm />
            <FlashcardPractice />
          </>
        )}
      </div>
    </>
  );
}
