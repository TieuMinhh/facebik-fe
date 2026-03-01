import api from '@/lib/axios';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  displayName: string;
  gender: string;
  birthday: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  }
};

export default authService;
