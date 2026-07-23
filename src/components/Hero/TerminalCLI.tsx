import React, { useState, useRef, useEffect } from 'react';
import { toggleMatrixMode } from '../../utils/matrixRain';
import { audioEngine } from '../../utils/audioEngine';

interface TerminalLine {
  text: string;
  type: 'sys' | 'cmd' | 'err';
}

export const TerminalCLI: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { text: '> booting portfolio kernel v2.6...', type: 'sys' },
    { text: '> loading AI modules & .NET runtime...', type: 'sys' },
    { text: '> rendering 3D living environment...', type: 'sys' },
    { text: '> welcome! Type "help" for interactive commands.', type: 'sys' }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    audioEngine.playClick();
    const newLines = [...lines, { text: `> ${cmd}`, type: 'cmd' as const }];

    switch (trimmed) {
      case 'help':
        newLines.push(
          { text: 'Available Commands:', type: 'sys' },
          { text: '  stack      - Output full engineering tech stack', type: 'sys' },
          { text: '  matrix     - Toggle Matrix Rain Mode', type: 'sys' },
          { text: '  theme      - Cycle 3D Scene Lighting Color', type: 'sys' },
          { text: '  contact    - Display direct contact details', type: 'sys' },
          { text: '  clear      - Wipe terminal history', type: 'sys' }
        );
        break;
      case 'stack':
        newLines.push(
          { text: '-> .NET 8 / C# (ASP.NET Core, EF Core, SQL Server)', type: 'sys' },
          { text: '-> Flutter & Dart (Cross-Platform Mobile Apps)', type: 'sys' },
          { text: '-> Python (Selenium, Automation, Playwright, LLMs)', type: 'sys' },
          { text: '-> Frontend (React, TypeScript, Three.js, R3F, GSAP)', type: 'sys' }
        );
        break;
      case 'matrix':
        toggleMatrixMode();
        newLines.push({ text: 'Matrix mode toggled!', type: 'sys' });
        break;
      case 'contact':
        newLines.push(
          { text: 'Email: mostafaabduljaleelahmed@gmail.com', type: 'sys' },
          { text: 'WhatsApp: +20 101 131 9867', type: 'sys' }
        );
        break;
      case 'clear':
        setLines([]);
        setInputVal('');
        return;
      default:
        newLines.push({ text: `Unknown command: "${cmd}". Type "help" for options.`, type: 'err' });
        break;
    }

    setLines(newLines);
    setInputVal('');
  };

  return (
    <div className="hero-terminal">
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot red"></div>
          <div className="terminal-dot yellow"></div>
          <div className="terminal-dot green"></div>
        </div>
        <div className="terminal-title">jaleelo-os ~/interactive-cli</div>
      </div>
      <div className="terminal-body" ref={outputRef}>
        {lines.map((l, i) => (
          <div key={i} className={`terminal-line ${l.type}`}>
            {l.text}
          </div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span>&gt;</span>
        <input
          type="text"
          className="terminal-input"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleCommand(inputVal);
          }}
          placeholder="type 'help', 'stack', 'matrix'..."
          autoComplete="off"
        />
      </div>
    </div>
  );
};
