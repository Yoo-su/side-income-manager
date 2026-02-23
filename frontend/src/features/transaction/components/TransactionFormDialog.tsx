import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { type Transaction, TransactionType } from "../types";
import { useEffect } from "react";
import { Spinner } from "@phosphor-icons/react";

const formSchema = z.object({
  type: z.enum([TransactionType.REVENUE, TransactionType.EXPENSE]),
  amount: z.coerce.number().min(1, "금액을 입력해주세요."),
  date: z.string().min(1, "날짜를 선택해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  hours: z.coerce.number().min(0).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => void;
  initialData?: Transaction | null;
  isLoading?: boolean;
}

/** 거래 내역 추가/수정 다이얼로그 */
export function TransactionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
}: TransactionFormDialogProps) {
  const isEditing = !!initialData;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      type: TransactionType.REVENUE,
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      hours: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          type: initialData.type,
          amount: Number(initialData.amount),
          date: new Date(initialData.date).toISOString().split("T")[0],
          description: initialData.description,
          hours: initialData.hours ? Number(initialData.hours) : undefined,
        });
      } else {
        form.reset({
          type: TransactionType.REVENUE,
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-32px)] sm:w-full sm:max-w-[425px] bg-white border-border rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "거래 내역 수정" : "거래 내역 추가"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* 금액 (Hero Input) */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="pt-2 pb-6 text-center">
                  <FormLabel className="sr-only">금액</FormLabel>
                  <FormControl>
                    <div className="flex items-baseline justify-center">
                      <Input
                        type="text"
                        placeholder="0"
                        {...field}
                        value={field.value ? field.value.toLocaleString() : ""}
                        onChange={(e) => {
                          const valStr = e.target.value.replace(/,/g, "");
                          if (valStr === "") {
                            field.onChange(0);
                          } else if (!isNaN(Number(valStr))) {
                            field.onChange(Number(valStr));
                          }
                        }}
                        style={{
                          width: `${Math.max((field.value ? field.value.toLocaleString() : "").length, 1)}ch`,
                        }}
                        className="h-20 text-5xl font-bold bg-transparent border-none shadow-none text-center focus-visible:ring-0 px-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-2xl font-semibold text-slate-400 ml-1 mb-2 shrink-0 pointer-events-none">
                        원
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            {/* 유형 선택 (Segmented Control 스타일) */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-0 pb-2">
                  <FormLabel className="sr-only">유형</FormLabel>
                  <FormControl>
                    <div className="flex p-1 bg-slate-100 rounded-2xl w-full">
                      <button
                        type="button"
                        onClick={() => field.onChange(TransactionType.REVENUE)}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                          field.value === TransactionType.REVENUE
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        }`}
                      >
                        수익 (+)
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange(TransactionType.EXPENSE)}
                        className={`flex-1 flex items-center justify-center py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                          field.value === TransactionType.EXPENSE
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        }`}
                      >
                        지출 (-)
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 투입 시간 (수익일 때만, 선택 사항) */}
            {form.watch("type") === TransactionType.REVENUE && (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2 mt-2">
                <FormField
                  control={form.control}
                  name="hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        투입 시간{" "}
                        <span className="text-slate-400 font-normal">
                          (선택)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="예: 2.5 (2시간 30분)"
                          step="0.1"
                          className="h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-slate-700"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                            )
                          }
                        />
                      </FormControl>
                      <p className="text-xs text-slate-500 mt-1">
                        입력 시 시급 효율 통계에 반영됩니다.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    설명
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 10월 광고 수익, 서버비 결제"
                      className="h-12 rounded-xl border-slate-200 bg-white focus-visible:ring-slate-700"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-slate-900 text-white rounded-xl text-[15px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                {isLoading && <Spinner className="mr-2 h-5 w-5 animate-spin" />}
                {isEditing ? "수정 완료" : "추가하기"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
