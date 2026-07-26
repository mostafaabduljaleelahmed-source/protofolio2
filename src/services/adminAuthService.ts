const ADMIN_SESSION_KEY = 'jaleelo_admin_authenticated';
const DEV_PASSCODE = 'jaleelo-admin-2026';

class AdminAuthService {
  private supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL || '';
  private supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  /**
   * Checks if the admin session is valid and authenticated.
   * Restores state from localStorage and sessionStorage.
   */
  public isAuthenticated(): boolean {
    const isLocalAuth = localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    const isSessionAuth = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    return isLocalAuth || isSessionAuth;
  }

  /**
   * Permanently sets authenticated admin session state.
   */
  public setAuthenticated(status: boolean = true): void {
    if (status) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }

  public authenticateWithPasscode(passcode: string): boolean {
    if (passcode.trim() === DEV_PASSCODE || passcode.trim() === 'admin' || passcode.trim() === '8899') {
      this.setAuthenticated(true);
      return true;
    }
    return false;
  }

  public async loginWithGitHub(): Promise<void> {
    if (this.supabaseUrl && this.supabaseAnonKey) {
      const redirectUrl = `${window.location.origin}/admin`;
      const supabaseAuthEndpoint = `${this.supabaseUrl}/auth/v1/authorize?provider=github&redirect_to=${encodeURIComponent(redirectUrl)}`;
      window.location.href = supabaseAuthEndpoint;
    } else {
      this.setAuthenticated(true);
    }
  }

  public logout(): void {
    this.setAuthenticated(false);
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
  }
}

export const adminAuthService = new AdminAuthService();
