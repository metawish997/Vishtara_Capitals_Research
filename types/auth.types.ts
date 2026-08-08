// What we send to the server for Login
export interface LoginRequest {
  email: string;
  password: string;
  fcm_token?: string;
}

// What we send to the server for Register
export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  annual_income?: string;
  is_age_verified?: boolean;
}

// What the server sends back
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
  errors?: any;
}