let matrixInterval: ReturnType<typeof setInterval> | null = null;

export function toggleMatrixMode(): void {
  const matrixCanvas = document.getElementById('matrix-canvas') as HTMLCanvasElement | null;
  if (!matrixCanvas) return;

  const mCtx = matrixCanvas.getContext('2d');
  if (!mCtx) return;

  document.body.classList.toggle('matrix-active');

  if (document.body.classList.contains('matrix-active')) {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    const chars = '01JALEELO.NETFLUTTERAI';
    const fontSize = 14;
    const cols = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(cols).fill(1);

    if (matrixInterval) clearInterval(matrixInterval);
    matrixInterval = setInterval(() => {
      mCtx.fillStyle = 'rgba(8, 11, 18, 0.05)';
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      mCtx.fillStyle = '#88d9ff';
      mCtx.font = `${fontSize}px DM Mono`;
      for (let i = 0; i < drops.length; i++) {
        const txt = chars[Math.floor(Math.random() * chars.length)];
        mCtx.fillText(txt, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 33);
  } else {
    if (matrixInterval) clearInterval(matrixInterval);
  }
}
