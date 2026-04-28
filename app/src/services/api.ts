import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail
      || error.response?.data?.error
      || error.message
      || '请求失败';
    return Promise.reject(new Error(message));
  }
);

export interface HealthData {
  status: string;
  version: string;
  ollama_connected: boolean;
}

export interface Task {
  id: string;
  project_id: string | null;
  type: string;
  status: string;
  input_data: Record<string, unknown> | null;
  output_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const healthApi = {
  check: () => api.get<ApiResponse<HealthData>>('/api/health'),
};

export const llmApi = {
  test: () => api.post<ApiResponse<{ message: string }>>('/api/llm/test'),
  generate: (prompt: string, model?: string, options?: Record<string, unknown>) =>
    api.post<ApiResponse<{ text: string }>>('/api/llm/generate', { prompt, model, options }),
};

export const mediaApi = {
  simpleRender: (image: File, audio: File) => {
    const form = new FormData();
    form.append('image', image);
    form.append('audio', audio);
    return api.post<ApiResponse<{ output_path: string }>>('/api/media/simple-render', form);
  },
};

export const tasksApi = {
  list: () => api.get<ApiResponse<Task[]>>('/api/tasks'),
  create: (project_id: string | null, type: string, input_data: Record<string, unknown>) =>
    api.post<ApiResponse<Task>>('/api/tasks', { project_id, type, input_data }),
};

export default api;
