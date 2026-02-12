# Dashboard Feature Development Flow

## 2026-02-12: 대시보드 Insight 및 효율성 매트릭스 지원

### 1. 개요

대시보드 상단에 "수익왕", "효율왕", "수익률왕" 등 인사이트 카드를 표시하고, 산점도 차트(Efficiency Matrix)를 그리기 위해 데이터 구조를 개선했습니다.

### 2. 변경 사항

- **`DashboardController.getSourceRanking` 업데이트**:
  - `SourcePerformanceDto` 도입하여 Swagger 응답 명세 구체화.
  - `TransactionService`의 확장된 메서드를 사용하여 더 풍부한 데이터 반환.
- **DTO 생성**: `SourcePerformanceDto` 정의 (Swagger 데코레이터 포함).

### 3. 기대 효과

- 프론트엔드에서 별도의 추가 API 호출 없이, 한 번의 랭킹 조회로 다양한 시각화(카드, 차트 등)를 구현할 수 있게 됨.
