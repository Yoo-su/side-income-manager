import axios from "axios";

// 환경 변수에서 API Base URL 로드
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 필요 시 인터셉터 추가
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 글로벌 에러 처리 (예: 401 Unauthorized 등)
    return Promise.reject(error);
  },
);
