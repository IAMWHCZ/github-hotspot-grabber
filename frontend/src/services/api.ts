import axios from 'axios';
import { Repository, TrendingRequest, TrendingResponse, LanguageStats } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const repositoryApi = {
  // 获取热门仓库
  getTrending: async (request: TrendingRequest): Promise<TrendingResponse> => {
    const params = new URLSearchParams();
    if (request.language) params.append('language', request.language);
    params.append('timePeriod', request.timePeriod.toString());
    params.append('limit', request.limit.toString());
    params.append('page', request.page.toString());

    const response = await apiClient.get<TrendingResponse>(`/repositories/trending?${params}`);
    return response.data;
  },

  // 搜索仓库
  search: async (query: string, limit: number = 20): Promise<Repository[]> => {
    const response = await apiClient.get<Repository[]>(`/repositories/search`, {
      params: { query, limit }
    });
    return response.data;
  },

  // 获取单个仓库详情
  getRepository: async (owner: string, name: string): Promise<Repository> => {
    const response = await apiClient.get<Repository>(`/repositories/${owner}/${name}`);
    return response.data;
  },

  // 刷新数据
  refreshData: async (request: TrendingRequest): Promise<{ message: string; count: number }> => {
    const response = await apiClient.post<{ message: string; count: number }>('/repositories/refresh', request);
    return response.data;
  },

  // 获取支持的编程语言
  getLanguages: async (): Promise<string[]> => {
    // 这里返回常用语言列表，实际项目中可能需要从后端获取
    return [
      'All Languages',
      'JavaScript',
      'Python',
      'Java',
      'TypeScript',
      'C#',
      'PHP',
      'C++',
      'C',
      'Shell',
      'Ruby',
      'Go',
      'Rust',
      'Kotlin',
      'Swift',
      'Scala',
      'Dart',
      'R',
      'Objective-C',
      'Perl',
      'Haskell'
    ];
  }
};

export default apiClient;