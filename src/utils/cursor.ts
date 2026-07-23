import { audioEngine } from './audioEngine';

export function initCustomCursor(): () => void {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (!cursor || !cursorDot) return () => {};

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let animId: number;

  const handleMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  };

  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    animId = requestAnimationFrame(animateCursor);
  };

  window.addEventListener('mousemove', handleMouseMove);
  animateCursor();

  const handleMouseEnter = () => {
    document.body.classList.add('cursor-hover');
    audioEngine.playHover();
  };

  const handleMouseLeave = () => {
    document.body.classList.remove('cursor-hover');
  };

  const handleClick = () => {
    audioEngine.playClick();
  };

  const attachHoverListeners = () => {
    document.querySelectorAll('a, button, .live-panel, .hotspot, .cmdk-item, .brand, .ai-chip, #ai-chat-trigger').forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('click', handleClick);
    });
  };

  attachHoverListeners();

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    cancelAnimationFrame(animId);
  };
}
