# 💰 Side Income Manager (부수입 & 사이드 프로젝트 매니저)

> **"내 시간의 가치를 증명하는 퍼스널 CFO"**
>
> N잡러와 1인 기업가를 위한, 단순한 가계부를 넘어선 **수익성 분석 및 의사결정 도구**입니다.

---

## 🚀 Service Introduction

### 왜 이 서비스가 필요한가요?

파트타임, 외주, 블로그, 앱 서비스 등 여러 파이프라인을 운영하다 보면 **"그래서 내가 지금 잘하고 있는 건가?"** 라는 의문이 듭니다.

- **수입원마다 정산 주기가 제각각**이라 현금 흐름이 보이지 않습니다.
- 밤새 일해서 번 100만 원과, 잠자면서 번 10만 원은 가치가 다릅니다. 하지만 일반 가계부는 이를 똑같은 '수입'으로 취급합니다.
- 내 노동의 **진짜 시급(Real Hourly Rate)** 을 모르면, 비효율적인 일에 인생을 낭비하게 됩니다.

**Side Income Manager**는 당신의 모든 부수입 활동을 한곳에 모으고, **데이터 기반의 의사결정**을 돕습니다.
감으로 일하지 마세요. 데이터로 증명하세요.

---

## ✨ Key Features

### 1. 📊 Insight Dashboard (통합 대시보드)

- **실시간 성과 분석**: 이번 달 총 수입, 지출, 순수익을 한눈에 파악합니다.
- **성장률 트래킹**: 전월 대비 수익과 노동 시간이 어떻게 변했는지 즉각적으로 확인합니다.

### 2. ⏱️ 초정밀 효율 분석

- **Real Hourly Rate (실질 시급)**: `(순수익 / 투입 시간)` 공식을 통해 내 노동의 시장 가치를 냉정하게 평가합니다.
- **ROI (투자 대비 수익률)**: `(순수익 / 비용 * 100)` 계산을 통해 자본 효율성을 측정합니다.
- **"돈이 안 되는 일은 줄이고, 고효율 수익원에 집중하세요."**

### 3. 🧩 Income Source Management (수입원 관리)

- **유형별 분류**: 프리랜서, 프로젝트, 자동수익(Passive Income) 등 성격에 맞게 분류합니다.
- **비활성 모드**: 현재 집중하지 않는 프로젝트는 숨겨두고, 핵심 수익원에만 집중할 수 있습니다.

### 4. 📈 Visual Portfolio (데이터 시각화)

- **효율성 트리맵**: '규모(매출)'와 '내실(수익률)'을 동시에 시각화하여, 덩치만 큰 사업과 알짜배기 사업을 구분합니다.
- **인사이트 카드**: 최고의 수익을 낸 효자 종목, 시간 대비 효율이 가장 좋은 종목을 자동으로 찾아냅니다.

---

## 🛠️ Tech Stack

이 프로젝트는 최신 웹 기술 트렌드를 반영하여 **Monorepo** 환경에서 **Type-Safe**하게 구축되었습니다.

### Frontend

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Client), [TanStack Query](https://tanstack.com/query) (Server)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [ApexCharts](https://apexcharts.com/)

### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: PostgreSQL
- **ORM**: [TypeORM](https://typeorm.io/)
- **Documentation**: [Swagger (OpenAPI)](https://swagger.io/)
- **Precision Math**: [decimal.js](https://github.com/MikeMcl/decimal.js) (정확한 금전 연산)

### Tools

- **Monorepo Manager**: [PNPM Workspaces](https://pnpm.io/workspaces)
- **Linting & Formatting**: ESLint, Prettier

---

## 🏃‍♂️ Getting Started

### Prerequisites

실행을 위해 다음 도구들이 설치되어 있어야 합니다.

- **Node.js** (v18+)
- **PNPM** (`npm install -g pnpm`)
- **PostgreSQL** (Local DB)

### Installation

1. 저장소를 클론합니다.

   ```bash
   git clone https://github.com/your-username/side-income-manager.git
   cd side-income-manager
   ```

2. 의존성을 설치합니다 (Monorepo root).

   ```bash
   pnpm install
   ```

3. 환경 변수를 설정합니다.
   - `backend/.env.example` 파일을 복사하여 `backend/.env`를 생성하고 DB 정보를 입력하세요.
   ```bash
   cp backend/.env.example backend/.env
   ```

### Running the App

프론트엔드와 백엔드를 동시에 실행합니다.

```bash
# Root 디렉토리에서 실행
pnpm dev
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`
- **API Docs (Swagger)**: `http://localhost:3000/api`

---

## 📝 License

This project is licensed under the MIT License.
