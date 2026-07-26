/**
 * Utility for managing hidden easter-egg admin triggers:
 * 1. Clicking logo 5 times within 3 seconds
 * 2. Pressing Ctrl + Shift + A
 * 3. Typing "admin" anywhere on the page
 */

export interface AdminTriggerOptions {
  onTrigger: () => void;
}

export class AdminTriggerManager {
  private logoClickTimestamps: number[] = [];
  private typedBuffer: string[] = [];
  private readonly TARGET_KEYWORD = ['a', 'd', 'm', 'i', 'n'];
  private onTriggerCallback: () => void;
  private keydownListener?: (e: KeyboardEvent) => void;

  constructor(onTrigger: () => void) {
    this.onTriggerCallback = onTrigger;
  }

  /**
   * Call when header logo is clicked. Returns true if 5 clicks in 3 seconds matched.
   */
  public handleLogoClick(): boolean {
    const now = Date.now();
    this.logoClickTimestamps.push(now);

    // Keep only timestamps within last 3 seconds (3000ms)
    this.logoClickTimestamps = this.logoClickTimestamps.filter(t => now - t <= 3000);

    if (this.logoClickTimestamps.length >= 5) {
      this.logoClickTimestamps = [];
      this.onTriggerCallback();
      return true;
    }
    return false;
  }

  /**
   * Initializes global keyboard shortcut (Ctrl+Shift+A) and keystroke sequence ("admin") listeners.
   */
  public initGlobalListeners(): () => void {
    this.keydownListener = (e: KeyboardEvent) => {
      // Ignore key events when typing inside text inputs, textareas, or editable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }

      // Trigger 2: Ctrl + Shift + A or Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        this.onTriggerCallback();
        return;
      }

      // Trigger 3: Typing sequence "admin"
      const char = e.key.toLowerCase();
      if (char.length === 1 && char >= 'a' && char <= 'z') {
        this.typedBuffer.push(char);
        if (this.typedBuffer.length > 5) {
          this.typedBuffer.shift();
        }

        if (this.typedBuffer.length === 5 && this.typedBuffer.join('') === 'admin') {
          this.typedBuffer = [];
          this.onTriggerCallback();
        }
      }
    };

    window.addEventListener('keydown', this.keydownListener);

    return () => {
      if (this.keydownListener) {
        window.removeEventListener('keydown', this.keydownListener);
      }
    };
  }
}
