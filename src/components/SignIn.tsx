import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";

export const SignIn = ({ user }: { user: any }) => {
  return user ? (
    <button onClick={() => signOut(auth)}>Sign out</button>
  ) : (
    <button onClick={() => signInWithPopup(auth, provider)}>Sign in with Google</button>
  );
};
