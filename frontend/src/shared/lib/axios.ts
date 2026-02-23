import axios from "axios";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

// 환경 변수에서 API Base URL 로드
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 추가: 토큰 주입
instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 추가: 401 처리 등
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 에러 발생 시 로그아웃 처리
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login"; // 인증 실패 시 로그인 페이지로 강제 이동
    }
    return Promise.reject(error);
  },
);
