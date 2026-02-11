import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type IncomeSource, IncomeSourceType } from "../types";
import {
  useCreateIncomeSource,
  useUpdateIncomeSource,
} from "../hooks/useIncomeSources";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { IncomeSourceTypeLabel } from "@/shared/constants/localization";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해주세요.")
    .max(100, "이름은 100자 이내여야 합니다."),
  type: z.nativeEnum(IncomeSourceType),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface IncomeSourceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IncomeSource;
}

/** 수입원 생성/수정 다이얼로그 */
export function IncomeSourceFormDialog({
  open,
  onOpenChange,
  initialData,
}: IncomeSourceFormDialogProps) {
  const createMutation = useCreateIncomeSource();
  const updateMutation = useUpdateIncomeSource();

  const isEditing = !!initialData;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: IncomeSourceType.ETC,
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          type: initialData.type,
          description: initialData.description || "",
        });
      } else {
        form.reset({
          name: "",
          type: IncomeSourceType.ETC,
          description: "",
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = (values: FormValues) => {
    if (isEditing && initialData) {
      updateMutation.mutate(
        { id: initialData.id, data: values },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "수입원 수정" : "새 수입원 추가"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "수입원 정보를 수정합니다."
              : "새로운 파이프라인을 추가하여 관리하세요."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">이름</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="예: 블로그 수익, 외주 프로젝트"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">유형</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="유형을 선택하세요" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IncomeSourceType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {IncomeSourceTypeLabel[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">설명</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="상세 내용을 입력하세요 (선택)"
                      className="resize-none"
                      {...field}
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
