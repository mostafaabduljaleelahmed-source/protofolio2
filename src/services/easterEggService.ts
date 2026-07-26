import { audioEngine } from '../utils/audioEngine';

const ACHIEVEMENTS_KEY = 'jaleelo_achievements';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'konami',
    title: 'Retro Master',
    description: 'Entered the classic Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)',
    icon: '🎮',
    unlocked: false
  },
  {
    id: 'cmd_k',
    title: 'Master Orchestrator',
    description: 'Opened the Command Palette interface using ⌘K',
    icon: '⌘',
    unlocked: false
  },
  {
    id: 'dev_mode',
    title: 'System Architect',
    description: 'Unlocked Developer Mode by clicking the logo 5 times',
    icon: '🛠️',
    unlocked: false
  },
  {
    id: 'matrix',
    title: 'Cyber Reality',
    description: 'Toggled the Matrix Digital Rain overlay',
    icon: '🟢',
    unlocked: false
  },
  {
    id: 'night',
    title: 'Midnight Developer',
    description: 'Toggled Night Vision stealth mode',
    icon: '🌙',
    unlocked: false
  }
];

class EasterEggService {
  private konamiSequence: string[] = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  private konamiIndex: number = 0;
  private nightMode: boolean = false;
  private toastCallback: ((title: string, msg: string) => void) | null = null;

  public init(showToastFn: (title: string, msg: string) => void): () => void {
    this.toastCallback = showToastFn;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = this.konamiSequence[this.konamiIndex].length === 1
        ? this.konamiSequence[this.konamiIndex].toLowerCase()
        : this.konamiSequence[this.konamiIndex];

      if (key === expectedKey) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.triggerKonamiCode();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }

  private triggerKonamiCode(): void {
    audioEngine.playCrystal();
    this.unlockAchievement('konami');
    document.body.classList.toggle('konami-active');

    if (this.toastCallback) {
      this.toastCallback('SECRET EASTER EGG UNLOCKED!', '🎮 Konami Code Accepted! Retro Arcade Synthesizer Active.');
    }
  }

  public toggleNightMode(): boolean {
    this.nightMode = !this.nightMode;
    document.body.classList.toggle('night-vision-mode', this.nightMode);
    this.unlockAchievement('night');

    if (this.toastCallback) {
      this.toastCallback('NIGHT VISION MODE', this.nightMode ? '🌙 Stealth Night Vision Activated.' : '☀️ Daylight Mode Restored.');
    }
    return this.nightMode;
  }

  public getAchievements(): Achievement[] {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (raw) {
        const stored: Record<string, string> = JSON.parse(raw);
        return INITIAL_ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: !!stored[a.id],
          unlockedAt: stored[a.id]
        }));
      }
    } catch {
      // Fallback
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public unlockAchievement(id: string): void {
    try {
      const raw = localStorage.getItem(ACHIEVEMENTS_KEY);
      const stored: Record<string, string> = raw ? JSON.parse(raw) : {};

      if (!stored[id]) {
        stored[id] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(stored));
        audioEngine.playCrystal();

        const target = INITIAL_ACHIEVEMENTS.find(a => a.id === id);
        if (target && this.toastCallback) {
          this.toastCallback('SECRET ACHIEVEMENT UNLOCKED', `${target.icon} ${target.title}: ${target.description}`);
        }
      }
    } catch {
      // Storage quota fallback
    }
  }
}

export const easterEggService = new EasterEggService();
