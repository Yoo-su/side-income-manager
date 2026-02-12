# Dashboard Feature Development Flow (Frontend)

## 2026-02-12: 인사이트 카드 및 효율성 매트릭스 구현

### 1. 개요

백엔드에서 확장된 대시보드 데이터를 활용하여, 사용자에게 유의미한 의사결정 정보를 제공하는 UI 컴포넌트를 추가했습니다.

### 2. 구현 내용

- **`InsightCards` 컴포넌트**:
  - `SourcePerformance` 데이터를 받아 수익왕, 효율왕, 수익률왕을 선별하여 표시.
  - `framer-motion`을 적용하여 부드러운 진입 애니메이션 구현.
- **`EfficiencyTreemap` 컴포넌트**:
  - `react-apexcharts`의 Treemap을 활용한 순수익/효율 시각화.
  - **Size**: 순수익 (크면 클수록 효자).
  - **Color**: 시간당 수익 (진하면 진할수록 고효율).
  - Custom Tooltip을 구현하여 상세 지표(ROI, 투입시간 등) 표시.
- **`DashboardPage` 레이아웃 개선**:
  - 상단에 Insight Cards 배치.
  - 하단에 Trend Chart와 Efficiency Matrix를 2열 그리드로 배치하여 공간 효율성 증대.

### 3. 기술적 상세

- **Type Safety**: `SourcePerformance` 인터페이스에 새로운 필드(`totalHours`, `roi`, `hourlyRate`) 추가.
- **Lint Compliance**: `any` 타입 사용을 배제하고 구체적인 Payload 타입 정의.
