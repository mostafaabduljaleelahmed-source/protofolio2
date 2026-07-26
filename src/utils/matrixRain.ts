class MatrixRainEngine {
  private active: boolean = false;
  private animId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private drops: number[] = [];
  private chars: string = '01JALEELO.NETFLUTTERAI_CS_DOTNET';
  private fontSize: number = 14;
  private lastTime: number = 0;
  private fpsInterval: number = 1000 / 30; // 30 FPS target for matrix background

  public toggle(): boolean {
    if (this.active) {
      this.stop();
    } else {
      this.start();
    }
    return this.active;
  }

  public start(): void {
    if (this.active) return;
    this.canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement | null;
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.active = true;
    document.body.classList.add('matrix-active');

    this.resize();
    window.addEventListener('resize', this.handleResize);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop(): void {
    this.active = false;
    document.body.classList.remove('matrix-active');

    if (this.animId !== null) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }

    window.removeEventListener('resize', this.handleResize);

    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private handleResize = (): void => {
    if (this.active) {
      this.resize();
    }
  };

  private resize(): void {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    const cols = Math.floor(this.canvas.width / (this.fontSize * dpr));
    this.drops = Array(cols).fill(1);
  }

  private loop = (now: number): void => {
    if (!this.active) return;

    this.animId = requestAnimationFrame(this.loop);

    const delta = now - this.lastTime;
    if (delta < this.fpsInterval) return;
    this.lastTime = now - (delta % this.fpsInterval);

    if (!this.ctx || !this.canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scaledFontSize = this.fontSize * dpr;

    this.ctx.fillStyle = 'rgba(8, 11, 18, 0.08)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#88d9ff';
    this.ctx.font = `${scaledFontSize}px "DM Mono", monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const txt = this.chars[Math.floor(Math.random() * this.chars.length)];
      this.ctx.fillText(txt, i * scaledFontSize, this.drops[i] * scaledFontSize);
      if (this.drops[i] * scaledFontSize > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  };
}

export const matrixEngine = new MatrixRainEngine();
export function toggleMatrixMode(): boolean {
  return matrixEngine.toggle();
}
