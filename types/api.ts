export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
