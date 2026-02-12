# Side Income Manager (부수입 관리자)

N잡러와 1인 기업가를 위한 수익성 분석 및 의사결정 도구입니다.
다양한 파이프라인의 수입과 지출을 통합 관리하고, 데이터 기반으로 효율적인 의사결정을 내릴 수 있도록 돕습니다.

---

## 서비스 소개

단순한 가계부를 넘어, 각 수입원별 성과를 분석하는 데 초점을 맞추었습니다.
프리랜서, 외주, 사이드 프로젝트 등 성격이 다른 여러 수입원을 한눈에 파악하고,
수익률(ROI)과 시간당 수익을 계산하여 어떤 활동이 가장 효율적인지 판단할 수 있습니다.

---

## 핵심 기능

### 1. 통합 대시보드

- 월별 총 수입, 지출, 순수익을 확인합니다.
- 전월 대비 성장률과 추세를 그래프로 시각화하여 제공합니다.

### 2. 수입원 관리

- 프로젝트 성격에 따라 수입원을 분류하여 관리합니다.
- 현재 진행 중인 프로젝트와 중단된 프로젝트를 구분하여 관리할 수 있습니다.

### 3. 성과 및 효율 분석

- **시간당 수익**: 투입 시간 대비 순수익을 계산하여 노동의 가치를 측정합니다.
- **수익률**: 투자 비용 대비 수익을 분석하여 자본 효율성을 파악합니다.
- **포트폴리오**: 전체 수익에서 각 수입원이 차지하는 비중과 기여도를 분석합니다.

### 4. 거래 내역 관리

- 수입 및 지출 내역을 상세하게 기록하고 관리합니다.
- 날짜, 금액, 유형(수입/지출), 관련 수입원 등을 체계적으로 저장합니다.

---

## 기술 스택

이 프로젝트는 최신 웹 기술을 사용하여 Monorepo 환경에서 구축되었습니다.

### Frontend

- **Framework**: React, Vite
- **Language**: TypeScript
- **State Management**: Zustand (Client), TanStack Query (Server)
- **Styling**: Tailwind CSS, shadcn/ui
- **Visualization**: ApexCharts

### Backend

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **API Docs**: Swagger (OpenAPI)
- **Math**: decimal.js (정밀 연산)

### Tools

- **Package Manager**: PNPM Workspaces
- **Linting**: ESLint, Prettier

---

## 시작하기

### 실행 환경

- Node.js (v18 이상)
- PNPM
- PostgreSQL

### 설치 및 실행

1. 저장소 클론

   ```bash
   git clone https://github.com/your-username/side-income-manager.git
   cd side-income-manager
   ```

2. 의존성 설치 (루트 경로)

   ```bash
   pnpm install
   ```

3. 환경 변수 설정
   `backend/.env.example` 파일을 복사하여 `backend/.env`를 생성하고 데이터베이스 정보를 입력합니다.

   ```bash
   cp backend/.env.example backend/.env
   ```

4. 애플리케이션 실행
   프론트엔드와 백엔드를 동시에 실행합니다.
   ```bash
   pnpm dev
   ```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api

---

## 라이선스

MIT License
