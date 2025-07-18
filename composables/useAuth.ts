import { ref } from "vue";
import { auth, provider, signInWithPopup, signOut } from "~/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth"; // 型専用import

interface UserInfo {
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

const user = ref<UserInfo | null>(null);

onAuthStateChanged(auth, (u) => {
  user.value = u
    ? {
        name: u.displayName,
        email: u.email,
        photoURL: u.photoURL,
        uid: u.uid, // ここを追加！
      }
    : null;
});

export function useAuth() {
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error("Login Error:", e);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout Error:", e);
    }
  };

  return { user, login, logout };
}
