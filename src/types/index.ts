export interface ProjectCase {
  number: string;
  title: string;
  meta: string;
  pressure: string;
  response: string;
  link?: string;
  code?: string;
}

export interface ExperimentSignal {
  tag: string;
  title: string;
  description: string;
}

export interface StackItem {
  name: string;
  category: string;
  tag: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AnalyticsSummary {
  totalVisitors: number;
  todayVisitors: number;
  avgSessionSeconds: number;
  returningRatio: number;
  lastVisitTime: string;
  topCountries: Array<{ country: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  topProjects: Array<{ projectTitle: string; count: number }>;
}

export interface AdminAnalyticsSummary extends AnalyticsSummary {
  resumeDownloads: number;
  aiQueriesCount: number;
  mostClickedButtons: Array<{ label: string; count: number }>;
  aiQueryLogs: Array<{ query: string; count: number }>;
}

export interface GuestbookEntry {
  id: string;
  authorName: string;
  company?: string;
  linkedIn?: string;
  country: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
}

export interface SiteConfig {
  name: string;
  handle: string;
  version: string;
  title: string;
  description: string;
  location: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
  stack: StackItem[];
  projects: ProjectCase[];
  experiments: ExperimentSignal[];
  aiKnowledge: Record<string, string>;
}
