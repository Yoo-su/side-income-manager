import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const registerSchema = z.object({
  name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일을 입력해주세요."),
  password: z.string().min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
});

export const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(values);
      // 회원가입 성공 시 자동 로그인
      login(response.user, response.accessToken);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "회원가입에 실패했습니다. 다시 시도해주세요.",
        );
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-sm rounded-[2rem] border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] bg-white p-2">
        <CardHeader className="pb-8 pt-8 px-6">
          <CardTitle className="text-2xl font-bold text-center text-slate-800 tracking-tight">
            회원가입
          </CardTitle>
          <CardDescription className="text-center text-slate-500 font-medium tracking-tight mt-1.5">
            새로운 계정을 생성하여 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold text-slate-700 ml-1">
                      이름
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="홍길동"
                        {...field}
                        className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold text-slate-700 ml-1">
                      이메일
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="이메일 입력"
                        {...field}
                        className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[13px] font-semibold text-slate-700 ml-1">
                      비밀번호
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호 입력"
                        {...field}
                        className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus-visible:ring-slate-300 focus-visible:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="ml-1" />
                  </FormItem>
                )}
              />
              {error && (
                <p className="text-[13px] font-medium text-rose-500 ml-1">
                  {error}
                </p>
              )}
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[15px] transition-colors shadow-none"
                  disabled={isLoading}
                >
                  {isLoading ? "가입 중..." : "회원가입"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pb-8 pt-2">
          <p className="text-[13px] text-slate-500 font-medium">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="text-slate-900 hover:text-slate-700 hover:underline font-bold transition-colors ml-1"
            >
              로그인
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
