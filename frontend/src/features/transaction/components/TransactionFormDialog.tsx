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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

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
      <DialogContent className="sm:max-w-[425px] bg-white border-border">
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
            {/* 유형 선택 */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium">유형</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={TransactionType.REVENUE} />
                        </FormControl>
                        <FormLabel className="font-medium text-foreground cursor-pointer">
                          수익 (+)
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={TransactionType.EXPENSE} />
                        </FormControl>
                        <FormLabel className="font-medium text-muted-foreground cursor-pointer">
                          지출 (-)
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 날짜 */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">날짜</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 금액 */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">금액</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      value={field.value as number}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 투입 시간 (수익일 때만, 선택 사항) */}
            {form.watch("type") === TransactionType.REVENUE && (
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      투입 시간 (시간 단위, 선택)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="예: 2.5 (2시간 30분)"
                        step="0.1"
                        {...field}
                        value={field.value || ""} // 0일 때 placeholder 보이게 하려면 "" 처리 고민 필요하지만 일단 value 유지
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      * 입력하지 않으면 시간당 수익 계산에서 제외됩니다.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* 설명 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">설명</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 10월 광고 수익, 서버비 결제"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "수정 완료" : "추가하기"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
