import { instance } from "@/shared/lib/axios";
import type { LoginDto, RegisterDto, AuthResponse } from "../types/auth.types";

export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await instance.post<AuthResponse>("/auth/login", data);
    return response.data;
  },
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await instance.post<AuthResponse>("/auth/register", data);
    return response.data;
  },
};
