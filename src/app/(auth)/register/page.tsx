import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-[#f0f2f5] dark:bg-zinc-950 p-6">
      <RegisterForm />
    </div>
  );
}
