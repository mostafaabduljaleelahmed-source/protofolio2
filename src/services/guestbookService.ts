import { GuestbookEntry } from '../types';

const LOCAL_GUESTBOOK_KEY = 'jaleelo_guestbook_db';
const LAST_SUBMIT_KEY = 'jaleelo_guestbook_last_submit';
const RATE_LIMIT_MS = 15 * 60 * 1000; // 15 Minutes

class GuestbookService {
  private supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
  private supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  private getLocalDB(): GuestbookEntry[] {
    try {
      const raw = localStorage.getItem(LOCAL_GUESTBOOK_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }

    // Default initial approved entries for seamless demo
    const initial: GuestbookEntry[] = [
      {
        id: 'gb-1',
        authorName: 'Alex Rivera',
        company: 'CloudScale Inc.',
        linkedIn: 'https://linkedin.com',
        country: 'United States',
        content: 'Remarkable architecture and **Three.js performance**. Mostafa\'s .NET background shows in the system precision!',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: 'gb-2',
        authorName: 'Fatima Al-Mansoor',
        company: 'TechHub Cairo',
        linkedIn: 'https://linkedin.com',
        country: 'Egypt',
        content: 'Sublime interactive operating environment. Inspiring work for Cairo University developers!',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];

    localStorage.setItem(LOCAL_GUESTBOOK_KEY, JSON.stringify(initial));
    return initial;
  }

  private saveLocalDB(entries: GuestbookEntry[]): void {
    try {
      localStorage.setItem(LOCAL_GUESTBOOK_KEY, JSON.stringify(entries));
    } catch {
      // LocalStorage quota fallback
    }
  }

  public detectCountry(): string {
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

  public isRateLimited(): boolean {
    const last = localStorage.getItem(LAST_SUBMIT_KEY);
    if (!last) return false;
    const elapsed = Date.now() - parseInt(last, 10);
    return elapsed < RATE_LIMIT_MS;
  }

  public renderMarkdown(text: string): string {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Inline code `code`
    escaped = escaped.replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 5px; border-radius: 3px; font-family: DM Mono, monospace;">$1</code>');
    // Links [text](url)
    escaped = escaped.replace(/\[(.*?)\]\((https?:\/\/.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">$1</a>');

    return escaped;
  }

  public async fetchApprovedEntries(): Promise<GuestbookEntry[]> {
    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        const res = await fetch(`${this.supabaseUrl}/rest/v1/guestbook_entries?status=eq.approved&order=created_at.desc`, {
          headers: {
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          return data.map((d: any) => ({
            id: d.id,
            authorName: d.author_name,
            company: d.company,
            linkedIn: d.linkedin,
            country: d.country,
            content: d.content,
            status: d.status,
            createdAt: d.created_at,
            updatedAt: d.updated_at
          }));
        }
      } catch {
        // Fallback to local
      }
    }

    const local = this.getLocalDB();
    return local.filter(e => e.status === 'approved').sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async fetchAllEntriesForAdmin(): Promise<GuestbookEntry[]> {
    const local = this.getLocalDB();
    return local.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async submitEntry(data: {
    authorName: string;
    company?: string;
    linkedIn?: string;
    content: string;
    honeypot?: string;
  }): Promise<{ success: boolean; message: string }> {
    // Spam Honeypot Check
    if (data.honeypot && data.honeypot.trim() !== '') {
      return { success: false, message: 'Spam bot detected.' };
    }

    // Rate Limit Check
    if (this.isRateLimited()) {
      return { success: false, message: 'Rate limit reached. Please wait 15 minutes before signing again.' };
    }

    if (!data.authorName.trim() || !data.content.trim()) {
      return { success: false, message: 'Name and signature message are required.' };
    }

    const country = this.detectCountry();
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      authorName: data.authorName.trim(),
      company: data.company?.trim() || undefined,
      linkedIn: data.linkedIn?.trim() || undefined,
      country,
      content: data.content.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    if (this.supabaseUrl && this.supabaseAnonKey) {
      try {
        await fetch(`${this.supabaseUrl}/rest/v1/guestbook_entries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          },
          body: JSON.stringify({
            author_name: newEntry.authorName,
            company: newEntry.company,
            linkedin: newEntry.linkedIn,
            country: newEntry.country,
            content: newEntry.content,
            status: 'pending'
          })
        });
      } catch {
        // Fallback
      }
    }

    const db = this.getLocalDB();
    db.unshift(newEntry);
    this.saveLocalDB(db);

    localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());

    return {
      success: true,
      message: 'Signature submitted! Your entry is pending admin review.'
    };
  }

  public async adminApproveEntry(id: string): Promise<void> {
    const db = this.getLocalDB();
    const target = db.find(e => e.id === id);
    if (target) {
      target.status = 'approved';
      target.updatedAt = new Date().toISOString();
      this.saveLocalDB(db);
    }
  }

  public async adminDeleteEntry(id: string): Promise<void> {
    const db = this.getLocalDB();
    const filtered = db.filter(e => e.id !== id);
    this.saveLocalDB(filtered);
  }

  public async adminUpdateEntry(id: string, updatedContent: string): Promise<void> {
    const db = this.getLocalDB();
    const target = db.find(e => e.id === id);
    if (target) {
      target.content = updatedContent;
      target.updatedAt = new Date().toISOString();
      this.saveLocalDB(db);
    }
  }
}

export const guestbookService = new GuestbookService();
