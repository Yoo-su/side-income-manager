import { IncomeSourceList } from "../components/IncomeSourceList";
import { PageTransition } from "@/components/layout/PageTransition";

/** 수입원 관리 페이지 */
const IncomeSourcePage = () => {
  return (
    <PageTransition>
      <div className="space-y-8 p-8 lg:p-10">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            수입원 관리
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            모든 부수입원을 한곳에서 관리하고 트래킹하세요.
          </p>
        </div>

        <IncomeSourceList />
      </div>
    </PageTransition>
  );
};

export default IncomeSourcePage;
