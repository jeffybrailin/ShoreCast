import Link from "next/link";
import { Waves } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{ background: "var(--c-bg)" }}>

      {/* Decorative blobs – adapt per theme via opacity */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #FCD34D, transparent 70%)" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #7DD3FC, transparent 70%)" }} />

      {/* Theme toggle top-right */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center gap-6 animate-fade-in"
        style={{ background: "var(--c-card)", border: "1px solid var(--c-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>

        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #FBBF24, #06B6D4)" }}>
            <Waves className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-center leading-tight" style={{ color: "var(--c-text)" }}>
            Login to your<br />Account
          </h1>
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-black tracking-tight" style={{ color: "var(--c-text)" }}>
            Shore<span style={{ color: "#F59E0B" }}>cast</span>
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase mt-0.5" style={{ color: "var(--c-muted)" }}>
            Coastal Intelligence
          </span>
        </div>

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Link href="/dashboard"
            className="w-full text-center font-bold py-3.5 rounded-2xl text-base transition-all duration-200 active:scale-95 hover:opacity-90"
            style={{ background: "#FBBF24", color: "#0F172A" }}>
            Sign Up
          </Link>
          <Link href="/dashboard"
            className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 active:scale-95"
            style={{ background: "var(--c-input)", border: "1px solid var(--c-border)", color: "var(--c-text)" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign In with Google
          </Link>
          <Link href="/dashboard"
            className="w-full flex items-center justify-center gap-3 font-semibold py-3.5 rounded-2xl text-sm transition-all duration-200 active:scale-95 text-white"
            style={{ background: "#0F172A" }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z"/>
            </svg>
            Sign In with Apple
          </Link>
        </div>

        <p className="text-xs font-medium" style={{ color: "var(--c-muted)" }}>
          Already have an account?{" "}
          <Link href="/dashboard" className="font-bold hover:underline" style={{ color: "#0891B2" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}