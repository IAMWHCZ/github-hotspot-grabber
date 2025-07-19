export interface Repository {
  id: number;
  gitHubId: number;
  name: string;
  fullName: string;
  description: string;
  owner: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  htmlUrl: string;
  cloneUrl: string;
  hotspotScore: number;
  lastAnalyzed: string;
  daysSinceCreated: number;
  daysSinceLastPush: number;
}

export interface TrendingRequest {
  language?: string;
  timePeriod: TimePeriod;
  limit: number;
  page: number;
}

export interface TrendingResponse {
  repositories: Repository[];
  totalCount: number;
  page: number;
  pageSize: number;
  language?: string;
  timePeriod: TimePeriod;
  generatedAt: string;
}

export interface LanguageStats {
  language: string;
  repositoryCount: number;
  averageStars: number;
  averageScore: number;
}

export enum TimePeriod {
  Daily = 0,
  Weekly = 1,
  Monthly = 2
}

export interface FilterOptions {
  language: string;
  timePeriod: TimePeriod;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}