# Dashboard Feature (Frontend)

## 📌 개요

사용자의 수입/지출 현황을 시각화하고 핵심 지표를 제공하는 대시보드 페이지입니다.

## 🏗 구조

- **Pages**:
  - `DashboardPage.tsx`: 데이터 페칭 및 레이아웃 조립.
- **Components**:
  - `StatsCards.tsx`: 이번 달 실적 요약 (수익, 지출, 순수익).
  - `InsightCards.tsx`: [NEW] 최고 실적(수익, 효율, 수익률) 하이라이트.
  - `TrendChart.tsx`: 월별 수익 추이 그래프.
  - `DashboardChartSection.tsx`: 월별 수익 추이 및 수입원별 매출 비교 차트.
  - `PortfolioSection.tsx`: 수입원별 랭킹 및 비중 포트폴리오.
- **API**:
  - `dashboard.api.ts`: 백엔드 대시보드 API 연동.

## 🔑 주요 기능

1. **종합 요약**: 통계 카드를 통해 핵심 지표의 전월 대비 증감을 확인.
2. **인사이트 발견**: `InsightCards`와 비교 분석 차트를 통해 어떤 수입원이 효자인지, 성장하고 있는지 판단.
3. **추이 분석**: 6개월간의 재무 흐름 파악.
4. **기간별 조회**: `DateFilter`를 통해 특정 년/월의 성과를 과거 시점으로 조회 가능. (미래 시점 방지 포함)
