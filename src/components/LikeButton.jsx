import { useEffect, useState } from "react";
import { getApp, getApps, initializeApp } from "firebase/app";
import { doc, getFirestore, increment, onSnapshot, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
};

const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
const firebaseApp = () => getApps().length ? getApp() : initializeApp(firebaseConfig);

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) {
      console.error("Firebase likes are unavailable: configure all PUBLIC_FIREBASE_* values in .env.local.");
      return undefined;
    }

    setIsLiked(localStorage.getItem("websiteIsLiked") === "true");
    const likeDoc = doc(getFirestore(firebaseApp()), "likes", "counter");
    return onSnapshot(likeDoc, (snapshot) => {
      if (snapshot.exists()) setLikes(Math.max(0, snapshot.data().likes));
    }, (error) => {
      console.error("Could not read the Firestore likes counter:", error);
    });
  }, []);

  async function handleLike() {
    if (!firebaseConfigured || isProcessing || isLiked) return;

    const previousLikes = likes;
    setLikes((count) => count + 1);
    setIsLiked(true);
    setIsProcessing(true);
    setIsAnimating(true);
    localStorage.setItem("websiteIsLiked", "true");
    window.setTimeout(() => setIsAnimating(false), 600);

    try {
      await updateDoc(doc(getFirestore(firebaseApp()), "likes", "counter"), { likes: increment(1) });
    } catch (error) {
      console.error("Could not update the Firestore likes counter:", error);
      setLikes(previousLikes);
      setIsLiked(false);
      localStorage.removeItem("websiteIsLiked");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <button
      type="button"
      className={`like-button${isAnimating ? " animate-heart-pulse" : ""}`}
      aria-pressed={isLiked}
      disabled={!firebaseConfigured || isProcessing || isLiked}
      onClick={handleLike}
    >
      <span aria-hidden="true">♥</span>
      <span>{likes} Likes</span>
    </button>
  );
}
