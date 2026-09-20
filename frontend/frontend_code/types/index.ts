export interface UserProfile {
  name: string;
  email: string;
  mobile_number: string;
}

export interface AuthResponse {
  success: boolean;
  user_id?: string;
  email?: string;
  name?: string;
  mobile_number?: string;
  access_token?: string;
  error?: string;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
  name?: string;
  email?: string;
  mobile_number?: string;
}

export interface MessageState {
  text: string;
  type: 'error' | 'success' | 'info' | '';
}
