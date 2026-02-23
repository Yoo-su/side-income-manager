# 디자인 시스템 (Design System)

사이드 인컴 매니저(Income Note)의 일관된 UI/UX를 유지하기 위한 디자인 가이드라인입니다.

## 1. 디자인 철학 (Design Philosophy)

- **Clean & Professional**: 가계부 및 수입 관리 서비스의 특성에 맞게 신뢰감을 주는 깔끔하고 전문적인 느낌을 지향합니다.
- **Glassmorphism & Depth**: 배경과 카드의 구분을 뚜렷하게 하면서도 무겁지 않게, 은은한 블러(blur) 효과와 투명도를 활용합니다.
- **Micro-interactions**: 버튼 호버, 탭 전환 등의 상호작용 시 부드러운 애니메이션(`framer-motion`, `transition`)을 통해 생동감을 줍니다.
- **Avoid Generic Looks**: 일반적인 부트스트랩(Bootstrap) 느낌의 둥근 모서리(Pill shape)나 단조로운 원색(빨강, 파랑, 초록) 사용을 지양하고, HSL 기반의 세련된 조색을 사용합니다.

## 2. 색상 테마 (Color Palette)

현재 애플리케이션은 **모노크롬(Monochrome) + 인디고(Indigo) 포인트** 테마를 베이스로 하고 있습니다. (`src/index.css` 및 `tailwind.config.ts` 참고)

### Base Colors (명도 기반)

- **Background**: 흰색 바탕 또는 매우 밝은 회색 계열 (Dark mode: `#0a0a0a`)
- **Card / Surface**: 배경과 구분되는 흰색 띄움 (Dark mode: `#121212`)
- **Text (Foreground)**: 짙은 흑회색 (`#111827`, 텍스트 가독성 확보)

### Primary / Accent Colors (포인트 컬러)

대시보드 차트, 핵심 버튼, 활성화된 내비게이션 아이템 등에 사용됩니다.

- **Primary (Indigo)**: `#6366f1` (Indigo 500) ~ `#4f46e5` (Indigo 600)
- **Secondary (Slate/Gray)**: `#64748b` (Slate 500) - 보조 버튼 및 텍스트
- **Success (Teal/Emerald)**: `#10b981` (Emerald 500) - 수익(Revenue) 및 긍정적 지표
- **Danger/Destructive (Rose)**: `#f43f5e` (Rose 500) - 지출(Expense), 삭제, 경고 액션

_Layout의 사이드바 등 특수 영역은 짙은 네이비/다크블루(`bg-[#252b3b]`)를 사용하여 안정감을 줍니다._

## 3. 타이포그래피 (Typography)

- **Main Font**: `Pretendard` (가독성이 뛰어난 산세리프 국문 폰트)
- **Logo/Brand Font**: `Moirai One` (사이드바 로고 등 특수 아이덴티티 영역)
- **Hierarchy**:
  - `h1` (페이지 제목): `text-2xl font-bold tracking-tight`
  - `h2` (섹션 제목): `text-xl font-semibold`
  - `h3` (카드 제목): `text-base font-medium`
  - `body` (본문): `text-sm text-muted-foreground`

## 4. UI 컴포넌트 원칙 (Component Rules)

- **Radius (모서리 곡률)**: 테일윈드 기준 `rounded-lg` 또는 `rounded-xl`을 주력으로 사용. (완전한 둥근 모양인 `rounded-full`은 뱃지나 아이콘 배경에만 제한적 사용)
- **Shadows (그림자)**: 딱딱한 그림자보다는 부드럽고 넓게 퍼지는 그림자(`shadow-sm`, `shadow-md` + opacity 조절)를 선호합니다.
- **Icons**: 절대 `lucide-react` 사용을 금지합니다(흔하고 뻔한 느낌 지양). 웹앱의 완성도 높은 디자인을 위해 반드시 `@phosphor-icons/react`를 사용하세요. 컴포넌트나 상황에 맞게 `weight` 속성(`regular`, `bold`, `fill` 등)을 유연하게 활용하여 트렌디하고 세련된 느낌을 줍니다.

---

## 💡 레퍼런스 가이드: 좋은 웹 디자인을 참고하는 방법

디자인 감각을 유지하고 최신 트렌드를 파악하기 위해 다음의 레퍼런스 사이트들을 참고하는 것을 강력히 권장합니다.

1. **Mobbin (mobbin.com)**
   - 실제 상용화된 세계 최고 수준의 앱/웹 서비스(토스, 애플, 에어비앤비 등)의 스크린샷과 UI 패턴을 모아놓은 곳입니다. 컴포넌트나 레이아웃이 막힐 때 가장 먼저 찾아보는 실무 레퍼런스입니다.
2. **Dribbble (dribbble.com) & Behance (behance.net)**
   - 전 세계 디자이너들의 화려한 포트폴리오를 볼 수 있습니다. "Finance Dashboard", "Admin Panel" 등으로 검색하여 전체적인 색감(Color Vibe)이나 레이아웃 비율을 참고하기 좋습니다. (단, 실제 구현하기 너무 비현실적인 디자인도 많으니 주의)
3. **Godly (godly.website)**
   - 트렌디하고 화려한(애니메이션이 뛰어난) 최신 웹사이트들을 큐레이션 해놓은 사이트입니다. 부드러운 모션과 인터랙션 영감을 얻기에 최고입니다.
4. **Shadcn/ui (ui.shadcn.com/blocks)**
   - 현재 우리 프로젝트의 베이스가 되는 라이브러리입니다. Blocks 탭에 들어가면 이미 아름답게 구성된 대시보드 레이아웃 예시들을 제공하므로 이를 기반으로 변형하는 것이 효율적입니다.
