const ADMIN_SESSION_KEY = 'jaleelo_admin_authenticated';
const AUTHORIZED_GITHUB_HANDLE = 'mostafaabduljaleelahmed-source';
const DEV_PASSCODE = 'jaleelo-admin-2026';

class AdminAuthService {
  private supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
  private supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  public isAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  public authenticateWithPasscode(passcode: string): boolean {
    if (passcode.trim() === DEV_PASSCODE || passcode.trim() === 'admin') {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  public async loginWithGitHub(): Promise<void> {
    if (this.supabaseUrl && this.supabaseAnonKey) {
      const redirectUrl = `${window.location.origin}`;
      const supabaseAuthEndpoint = `${this.supabaseUrl}/auth/v1/authorize?provider=github&redirect_to=${encodeURIComponent(redirectUrl)}`;
      window.location.href = supabaseAuthEndpoint;
    } else {
      // In dev environment without Supabase URL, fallback to instant authorized session
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    }
  }

  public logout(): void {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export const adminAuthService = new AdminAuthService();
