import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-screen bg-linear-to-br from-[#1877f2] via-[#063970] to-[#041e42] dark:from-zinc-950 dark:to-zinc-900 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] aspect-square bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Left Side: Brand & Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-12 relative z-10">
        <div className="max-w-[540px] w-full text-white">
          <div className="mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-white fill-current"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-5xl font-black tracking-tighter">
              FaceBik.
            </span>
          </div>

          <h1 className="text-[40px] font-bold leading-tight mb-8 text-white/90 animate-in fade-in slide-in-from-left duration-700 delay-100">
            Khơi nguồn kết nối, <br />
            <span className="text-blue-300">định nghĩa tương lai.</span>
          </h1>

          <div className="relative aspect-square w-full scale-105 animate-in fade-in zoom-in duration-1000 delay-300">
            <Image
              src="/images/fb-illustration.png"
              alt="Premium social illustration"
              fill
              className="object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 animate-in fade-in slide-in-from-right duration-700">
        <div className="w-full flex justify-center scale-105">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
