import axios, { isAxiosError } from 'axios';
import type {
  ReplenishmentProduct,
  DashboardMetrics,
  CreateStockMovementDto,
  StockMovement,
  AuthSession,
  Tenant,
} from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const tenantId = localStorage.getItem('tenantId');
  if (tenantId && !config.params?.tenantId) {
    config.params = { ...config.params, tenantId };
  }
  return config;
});

export const authService = {
  async registerEstablishment(data: {
    establishmentName: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthSession> {
    const res = await api.post<AuthSession>('/auth/register-establishment', data);
    if (res.data.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      if (res.data.tenant?.id) {
        localStorage.setItem('tenantId', res.data.tenant.id);
      }
    }
    return res.data;
  },

  async login(email: string, pass: string): Promise<AuthSession> {
    const res = await api.post<AuthSession>('/auth/login', { email, password: pass });
    if (res.data.accessToken) {
      localStorage.setItem('token', res.data.accessToken);
      if (res.data.tenant?.id) {
        localStorage.setItem('tenantId', res.data.tenant.id);
      }
    }
    return res.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
  },
};

export const tenantService = {
  async getCurrentTenant(): Promise<Tenant> {
    const res = await api.get<Tenant>('/tenants/current');
    return res.data;
  },
};

export const inventoryService = {
  async getReplenishmentProducts(): Promise<ReplenishmentProduct[]> {
    const res = await api.get<ReplenishmentProduct[]>('/products/replenishment');
    return res.data;
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await api.get<DashboardMetrics>('/dashboard/metrics');
    return res.data;
  },

  async createStockMovement(dto: CreateStockMovementDto): Promise<StockMovement> {
    const res = await api.post<StockMovement>('/stock-movements', dto);
    return res.data;
  },

  async getStoreSettings() {
    const res = await api.get('/settings');
    return res.data;
  },
};

export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'Ocorreu um erro inesperado'
): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join('\n') : data.message;
    }
    return error.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}
