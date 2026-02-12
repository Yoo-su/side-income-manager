# Transaction Feature Development Flow

## 2026-02-12: 대시보드 고도화를 위한 효율성 지표 추가

### 1. 개요

대시보드에서 단순 수익뿐만 아니라 "효율성"을 판단할 수 있는 지표(ROI, 시간당 수익 등)를 제공하기 위해 `TransactionService` 로직을 강화했습니다.

### 2. 변경 사항

- **`getIncomeSourcePerformance` 메서드 수정**:
  - 기존: 순수익, 총매출, 총비용만 반환.
  - 변경: `totalHours`(총 투입 시간), `roi`(투자 대비 수익률), `hourlyRate`(시간당 수익) 필드 추가.
- **`Decimal.js` 활용**:
  - 나눗셈 연산이 포함되므로 부동소수점 오차를 방지하기 위해 `Decimal` 라이브러리로 정밀 계산 처리.

### 3. 기술적 상세

- SQL `SUM(hours)` 집계 추가.
- `hourlyRate = netProfit / totalHours` (시간이 0이면 0 처리).
- `roi = (netProfit / totalExpense) * 100` (비용이 0이면 0 처리).
