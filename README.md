# 부수입 & 사이드 프로젝트 매니저 (Side Income Manager)

## 1. 개요 및 문제 정의

### 문제점

- **정보의 파편화**: 블로그, 외주, 파트타임 등 다양한 수입원의 정보가 흩어져 있어 전체 현황 파악이 어렵습니다.
- **수익 변동성 관리 부재**: 불규칙한 수입을 체계적으로 추적하고 예측할 도구가 부족합니다.
- **객관적 비교 불가**: 서로 다른 성격의 활동들을 동일 선상에서 비교하여 리소스 투입 효율을 판단하기 어렵습니다.

### 목표

다양한 부수입원을 **단일 인터페이스**에서 통합 관리하고, **직관적인 대시보드**를 통해 전체 수입 현황과 프로젝트별 핵심 지표(ROI, 순수익 등)를 확인하여 데이터 기반의 의사결정을 돕습니다.

---

## 2. 핵심 기능 (Core Features)

### 📊 통합 리소스/수익 관리

- **수입원(Income Source) 등록**: 각 프로젝트/활동을 개별 수입원으로 등록 및 관리.
- **트랜잭션 기록**:
  - **수익(Revenue)**: 발생한 수익 금액.
  - **지출(Expense)**: 활동에 소요된 금전적 비용.
  - **리소스(Resource)**: 투입된 시간 및 노력.

### 📈 실시간 변동 대시보드

- **종합 현황**: 전체 수입 합계, 총 투입 시간, 순수익 등을 한눈에 확인.
- **변동 추이**: 지난달 대비 수익/리소스 증감 확인.

### ⚖️ 비교 분석 리스트

- **효율성 지표**: 시간당 수익(Hourly Rate), 투자 대비 수익률(ROI) 자동 계산.
- **랭킹 시스템**: 리소스 대비 고효율 수입원 식별.

---

## 3. 부가 기능 (Planned Features)

- **시각화 차트**: 월별/분기별 수익 및 리소스 추이 그래프.
- **자동화된 인사이트**: "이번 달은 OO 프로젝트의 효율이 가장 좋습니다" 등의 리포트 제공.
- **목표 설정**: 월별 목표 수익 설정 및 달성률 추적.

---

## 4. 기술 스택 (Tech Stack)

### Frontend

- **Framework**: React (Vite) + TypeScript
- **State Management**: Zustand (Client), TanStack Query (Server)
- **Styling**: (TBD - Tailwind CSS or CSS Modules)
- **Architecture**: Feature-based + Container-Presentational Pattern

### Backend

- **Framework**: NestJS + TypeScript
- **Documentation**: Swagger (OpenAPI)
- **Database**: (TBD - e.g., PostgreSQL + TypeORM)
- **Architecture**: Feature-based (Module/Controller/Service)

---

## 5. 프로젝트 규칙 (Rules)

- **언어**: 한국어 (코드 주석, 커밋 메시지, 문서)
- **문서화**: 기능별 `README.md` 및 `FLOW.md` 필수 작성.
- **코드 규모**: 파일당 200라인 내외 유지 (컴포넌트 분리, 서비스 로직 분리).

---
