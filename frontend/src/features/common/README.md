# Common Feature (Shared Components)

## 📌 개요

여러 기능(Feature)에서 공통적으로 사용되는 UI 컴포넌트, 훅(Hook), 유틸리티 함수 등을 관리하는 디렉토리입니다.
이곳에 위치한 컴포넌트들은 특정 도메인 로직에 종속되지 명확한 재사용성을 가져야 합니다.

## 🏗 주요 컴포넌트

### 1. `DateRangePicker`

- **역할**: 사용자가 시작일과 종료일을 선택할 수 있는 달력 팝오버 컴포넌트입니다.
- **기능**:
  - `react-day-picker` 기반의 날짜 범위 선택.
  - 최대 3년까지의 기간 제한 (성능 및 UX 고려).
  - '오늘', '이번 달' 등 프리셋은 없으나 직관적인 달력 UI 제공.
  - 미래 날짜 및 1900년 이전 날짜 선택 방지.

### 2. `ChartFilterControl`

- **역할**: 차트 데이터 조회를 위한 기간 선택 필터 UI입니다.
- **기능**:
  - **Quick Select**: '6개월', '1년', '3년' 등 자주 쓰는 기간을 버튼 클릭 한 번으로 선택.
  - **Custom Range**: `DateRangePicker`를 내장하여 사용자 정의 기간 선택 지원.
  - 선택된 모드에 따라 시각적 강조 효과(Active State) 제공.

## 🔑 사용 가이드

**차트 필터링 구현 예시:**

```tsx
import { ChartFilterControl } from "@/features/common/components/ChartFilterControl";
import type { ChartFilterType } from "@/features/common/components/ChartFilterControl";

function MyChartPage() {
  const handleFilterChange = (type: ChartFilterType, range?: DateRange) => {
    if (type === "custom" && range) {
      // 사용자 정의 기간 처리
      fetchData(range.from, range.to);
    } else {
      // 프리셋 기간 처리 (예: 최근 6개월)
      fetchDataByPreset(type);
    }
  };

  return (
    <ChartFilterControl defaultType="6m" onFilterChange={handleFilterChange} />
  );
}
```
