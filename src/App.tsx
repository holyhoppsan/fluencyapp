import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { SignIn } from "./components/SignIn";
import { Layout } from "./components/Layout";

export default function App() {
  const [user] = useAuthState(auth);

  if (!user) return <SignIn user={user} />;
  return <Layout user={user} />;
}
