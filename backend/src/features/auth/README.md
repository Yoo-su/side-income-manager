# Auth Feature (인증 관리)

## 📌 개요

사용자의 회원가입, 로그인, JWT 토큰 발급 및 검증을 담당하는 기능입니다.

## 🏗 구조

- **Controller**: `AuthController`
  - `/auth/register`, `/auth/login` 엔드포인트 제공.
- **Service**: `AuthService`
  - 패스워드 검증 및 JWT 발급 처리.
- **Strategies/Guards**: `JwtStrategy`, `JwtAuthGuard`
  - 요청 헤더의 Bearer 토큰을 검증하여 보호된 리소스 접근 제어.

## 🔑 주요 역할

1. **사용자 등록/인증**: `bcrypt`를 통한 비밀번호 암호화 및 검증.
2. **토큰 기반 인가(Authorization)**: `Passport-JWT` 기반으로 사용자 정보를 식별하여 컨트롤러 단에서 가로채기(Guard) 역할 수행.
