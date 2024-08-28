"use client";
import { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error signing in with Google");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-100 via-red-100 to-pink-100">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome Back!</h1>
      <button
        className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg"
        onClick={handleGoogleSignIn}
      >
        Sign in with Google
      </button>
      <ToastContainer />
    </div>
  );
}
