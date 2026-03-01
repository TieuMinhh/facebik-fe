"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import authService, { RegisterData } from "../services/authService";

const formSchema = z.object({
  firstName: z.string().min(1, "Họ là bắt buộc"),
  lastName: z.string().min(1, "Tên là bắt buộc"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Tối thiểu 6 ký tự"),
  day: z.string(),
  month: z.string(),
  year: z.string(),
  gender: z.enum(["male", "female", "other"]),
});

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) =>
    (currentYear - i).toString(),
  );
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      day: new Date().getDate().toString(),
      month: (new Date().getMonth() + 1).toString(),
      year: currentYear.toString(),
      gender: "male",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const birthday = `${values.year}-${values.month.padStart(2, "0")}-${values.day.padStart(2, "0")}`;
      const registerData: RegisterData = {
        username: values.email.split("@")[0] + Math.floor(Math.random() * 1000), // Auto-gen unique username
        displayName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        gender: values.gender,
        birthday,
      };

      await authService.register(registerData);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/login");
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-[450px] border border-white/20 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <CardHeader className="text-center pt-8 pb-4">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 italic">
          Khởi đầu mới
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Gia nhập cộng đồng Facebik ngay hôm nay.
        </p>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Họ"
                        className="h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Tên"
                        className="h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email hoặc số điện thoại"
                      className="h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
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
                      placeholder="Mật khẩu cực bảo mật"
                      className="h-11 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 pl-1 mb-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Ngày sinh
                </span>
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="day"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="h-11 px-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="h-11 px-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                      {months.map((m) => (
                        <option key={m} value={m}>
                          T. {m}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <select
                      {...field}
                      className="h-11 px-3 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 pl-1 mb-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Giới tính
                </span>
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-3">
                    {["male", "female", "other"].map((g) => (
                      <label
                        key={g}
                        className={`flex items-center justify-center h-11 rounded-xl border-2 transition-all cursor-pointer ${field.value === g ? "border-blue-500 bg-blue-500/5 text-blue-600" : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 mt-2"}`}
                      >
                        <span className="text-sm font-semibold">
                          {g === "male"
                            ? "Nam"
                            : g === "female"
                              ? "Nữ"
                              : "Khác"}
                        </span>
                        <input
                          type="radio"
                          value={g}
                          checked={field.value === g}
                          onChange={field.onChange}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-13 text-lg font-bold bg-linear-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? "Đang khởi tạo..." : "Bắt đầu trải nghiệm"}
              </Button>
            </div>
          </form>
        </Form>
        <div className="text-center mt-8">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
            className="text-zinc-400 text-sm hover:text-blue-500 transition-colors hover:no-underline"
          >
            Đã gia nhập Facebik?{" "}
            <span className="text-blue-500 font-bold ml-1">Đăng nhập</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
