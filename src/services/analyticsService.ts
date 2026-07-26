import { AnalyticsSummary, AdminAnalyticsSummary, PublicSocialProof } from '../types';
import { adminAuthService } from './adminAuthService';

const VISITOR_ID_KEY = 'jaleelo_visitor_id';
const SESSION_START_KEY = 'jaleelo_session_start';
const LOCAL_ANALYTICS_KEY = 'jaleelo_local_analytics_db';

interface ExtendedLocalDB {
  pageViews: Array<{
    id: string;
    visitorId: string;
    isReturning: boolean;
    country: string;
    referrer: string;
    sessionDuration: number;
    createdAt: string;
  }>;
  projectViews: Array<{
    id: string;
    projectTitle: string;
    createdAt: string;
  }>;
  resumeDownloads: Array<{
    id: string;
    createdAt: string;
  }>;
  buttonClicks: Array<{
    id: string;
    label: string;
    createdAt: string;
  }>;
  aiQueries: Array<{
    id: string;
    query: string;
    createdAt: string;
  }>;
}

class AnalyticsService {
  private visitorId: string = '';
  private isReturning: boolean = false;
  private sessionStart: number = Date.now();
  private supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
  private supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  constructor() {
    this.initVisitorInfo();
  }

  private initVisitorInfo(): void {
    let storedId = localStorage.getItem(VISITOR_ID_KEY);
    if (storedId) {
      this.visitorId = storedId;
      this.isReturning = true;
    } else {
      this.visitorId = this.generateUUID();
      localStorage.setItem(VISITOR_ID_KEY, this.visitorId);
      this.isReturning = false;
    }

    let storedSession = sessionStorage.getItem(SESSION_START_KEY);
    if (storedSession) {
      this.sessionStart = parseInt(storedSession, 10);
    } else {
      this.sessionStart = Date.now();
      sessionStorage.setItem(SESSION_START_KEY, this.sessionStart.toString());
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private detectCountry(): string {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (timeZone.includes('Cairo') || timeZone.includes('Egypt')) return 'Egypt';
      if (timeZone.includes('Riyadh') || timeZone.includes('Saudi')) return 'Saudi Arabia';
      if (timeZone.includes('Dubai') || timeZone.includes('UAE')) return 'United Arab Emirates';
      if (timeZone.includes('London') || timeZone.includes('Europe/London')) return 'United Kingdom';
      if (timeZone.includes('America')) return 'United States';
      if (timeZone.includes('Berlin') || timeZone.includes('Europe')) return 'Germany';
      return 'Global';
    } catch {
      return 'Global';
    }
  }

  private getCleanReferrer(): string {
    const rawRef = document.referrer;
    if (!rawRef) return 'Direct / Bookmark';
    try {
      const url = new URL(rawRef);
      return url.hostname;
    } catch {
      return 'External Link';
    }
  }

  private getLocalDB(): ExtendedLocalDB {
    try {
      const raw = localStorage.getItem(LOCAL_ANALYTICS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }

    // Initial mock data for seed testing
    return {
      pageViews: [
        { id: '1', visitorId: 'v-1', isReturning: true, country: 'Egypt', referrer: 'linkedin.com', sessionDuration: 180, createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', visitorId: 'v-2', isReturning: false, country: 'United States', referrer: 'github.com', sessionDuration: 240, createdAt: new Date(Date.now() - 7200000).toISOString() },
        { id: '3', visitorId: 'v-3', isReturning: true, country: 'Germany', referrer: 'Direct / Bookmark', sessionDuration: 310, createdAt: new Date(Date.now() - 10800000).toISOString() }
      ],
      projectViews: [
        { id: 'p1', projectTitle: 'EduSphere / Tutoring OS', createdAt: new Date().toISOString() },
        { id: 'p2', projectTitle: 'WhatsApp Messaging Assistant', createdAt: new Date().toISOString() }
      ],
      resumeDownloads: [
        { id: 'r1', createdAt: new Date(Date.now() - 3600000).toISOString() },
        { id: 'r2', createdAt: new Date().toISOString() }
      ],
      buttonClicks: [
        { id: 'b1', label: '✨ Discover Architect', createdAt: new Date().toISOString() },
        { id: 'b2', label: 'Sign Guestbook', createdAt: new Date().toISOString() },
        { id: 'b3', label: '⌘K Command Palette', createdAt: new Date().toISOString() }
      ],
      aiQueries: [
        { id: 'q1', query: 'Tech Stack & .NET', createdAt: new Date().toISOString() },
        { id: 'q2', query: 'Available for work?', createdAt: new Date().toISOString() }
      ]
    };
  }

  private saveLocalDB(db: ExtendedLocalDB): void {
    try {
      localStorage.setItem(LOCAL_ANALYTICS_KEY, JSON.stringify(db));
    } catch {
      // Quota fallback
    }
  }

  public async trackPageView(): Promise<void> {
    const sessionDuration = Math.max(1, Math.floor((Date.now() - this.sessionStart) / 1000));
    const country = this.detectCountry();
    const referrer = this.getCleanReferrer();

    const db = this.getLocalDB();
    db.pageViews.unshift({
      id: this.generateUUID(),
      visitorId: this.visitorId,
      isReturning: this.isReturning,
      country,
      referrer,
      sessionDuration,
      createdAt: new Date().toISOString()
    });
    this.saveLocalDB(db);
  }

  public async trackProjectView(projectTitle: string): Promise<void> {
    const db = this.getLocalDB();
    db.projectViews.unshift({
      id: this.generateUUID(),
      projectTitle,
      createdAt: new Date().toISOString()
    });
    this.saveLocalDB(db);
  }

  public async trackResumeDownload(): Promise<void> {
    const db = this.getLocalDB();
    db.resumeDownloads.unshift({
      id: this.generateUUID(),
      createdAt: new Date().toISOString()
    });
    this.saveLocalDB(db);
  }

  public async trackButtonClick(label: string): Promise<void> {
    const db = this.getLocalDB();
    db.buttonClicks.unshift({
      id: this.generateUUID(),
      label,
      createdAt: new Date().toISOString()
    });
    this.saveLocalDB(db);
  }

  public async trackAIQuery(query: string): Promise<void> {
    const db = this.getLocalDB();
    db.aiQueries.unshift({
      id: this.generateUUID(),
      query,
      createdAt: new Date().toISOString()
    });
    this.saveLocalDB(db);
  }

  public async getPublicSocialProof(): Promise<PublicSocialProof> {
    const db = this.getLocalDB();
    const totalVisitors = Math.max(db.pageViews.length, 1420);
    const uniqueCountries = new Set(db.pageViews.map(pv => pv.country));
    const countriesCount = Math.max(uniqueCountries.size, 18);
    const projectsCompleted = 25;

    return {
      totalVisitors,
      countriesCount,
      projectsCompleted
    };
  }

  public async getSummary(): Promise<AnalyticsSummary> {
    if (!adminAuthService.isAuthenticated()) {
      throw new Error('Unauthorized access to telemetry breakdown');
    }

    const db = this.getLocalDB();

    const totalVisitors = db.pageViews.length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisitors = db.pageViews.filter(pv => pv.createdAt.startsWith(todayStr)).length;

    const totalDuration = db.pageViews.reduce((acc, pv) => acc + (pv.sessionDuration || 0), 0);
    const avgSessionSeconds = totalVisitors > 0 ? Math.round(totalDuration / totalVisitors) : 0;

    const returningCount = db.pageViews.filter(pv => pv.isReturning).length;
    const returningRatio = totalVisitors > 0 ? Math.round((returningCount / totalVisitors) * 100) : 0;

    const lastVisitTime = db.pageViews.length > 0 ? new Date(db.pageViews[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just Now';

    const countryMap: Record<string, number> = {};
    db.pageViews.forEach(pv => { countryMap[pv.country] = (countryMap[pv.country] || 0) + 1; });
    const topCountries = Object.entries(countryMap).map(([country, count]) => ({ country, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const refMap: Record<string, number> = {};
    db.pageViews.forEach(pv => { refMap[pv.referrer] = (refMap[pv.referrer] || 0) + 1; });
    const topReferrers = Object.entries(refMap).map(([referrer, count]) => ({ referrer, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const projMap: Record<string, number> = {};
    db.projectViews.forEach(pv => { projMap[pv.projectTitle] = (projMap[pv.projectTitle] || 0) + 1; });
    const topProjects = Object.entries(projMap).map(([projectTitle, count]) => ({ projectTitle, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      totalVisitors,
      todayVisitors,
      avgSessionSeconds,
      returningRatio,
      lastVisitTime,
      topCountries,
      topReferrers,
      topProjects
    };
  }

  public async getAdminSummary(): Promise<AdminAnalyticsSummary> {
    if (!adminAuthService.isAuthenticated()) {
      throw new Error('Unauthorized admin access');
    }

    const summary = await this.getSummary();
    const db = this.getLocalDB();

    const resumeDownloads = db.resumeDownloads ? db.resumeDownloads.length : 0;
    const aiQueriesCount = db.aiQueries ? db.aiQueries.length : 0;

    const buttonMap: Record<string, number> = {};
    (db.buttonClicks || []).forEach(b => { buttonMap[b.label] = (buttonMap[b.label] || 0) + 1; });
    const mostClickedButtons = Object.entries(buttonMap).map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    const aiMap: Record<string, number> = {};
    (db.aiQueries || []).forEach(q => { aiMap[q.query] = (aiMap[q.query] || 0) + 1; });
    const aiQueryLogs = Object.entries(aiMap).map(([query, count]) => ({ query, count })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      ...summary,
      resumeDownloads,
      aiQueriesCount,
      mostClickedButtons,
      aiQueryLogs
    };
  }
}

export const analyticsService = new AnalyticsService();
