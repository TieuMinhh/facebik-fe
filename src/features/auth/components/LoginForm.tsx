"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import authService, { LoginData } from "../services/authService";
import { useAuthStore } from "@/store/authStore";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "At least 6 characters"),
});

export function LoginForm() {
  const router = useRouter();
  const { setUser, setAccessToken } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const response = await authService.login(values as LoginData);
      const { user, accessToken } = response.data;

      setUser(user);
      setAccessToken(accessToken);

      toast.success("Chào mừng bạn quay lại!");
      router.push("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[420px] border border-white/20 shadow-2xl backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 rounded-2xl overflow-hidden p-2">
      <CardHeader className="text-center pt-8 pb-4">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Đăng nhập
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Chào mừng đạo hữu quay trở lại!
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative group">
                      <Input
                        placeholder="Email hoặc số điện thoại"
                        className="h-13 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base px-4"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Mật khẩu"
                      className="h-13 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base px-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-13 text-lg font-semibold bg-linear-to-r from-[#1877f2] to-[#0866ff] hover:brightness-110 text-white rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Tiếp tục"}
            </Button>
          </form>
        </Form>
        <div className="flex flex-col items-center gap-4 mt-6">
          <Button
            variant="link"
            className="text-blue-600 dark:text-blue-400 font-medium text-sm hover:no-underline"
          >
            Quên mật khẩu?
          </Button>
          <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800/50 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400 uppercase tracking-widest font-bold">
              hoặc
            </span>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/register")}
            className="w-full h-13 text-base font-semibold border-2 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-all"
          >
            Tạo tài khoản mới
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-6 items-center bg-zinc-50/50 dark:bg-zinc-800/20 p-6">
        <div className="flex items-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500">
          {/* Logos represent tech stack/standard apps for professional look */}
          <div className="h-4 w-4 bg-zinc-400 rounded-full" />
          <div className="h-4 w-4 bg-zinc-400 rounded-full" />
          <div className="h-4 w-4 bg-zinc-400 rounded-full" />
        </div>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
          &copy; 2026 Facebik by Minh Lao Ma
        </p>
      </CardFooter>
    </Card>
  );
}
