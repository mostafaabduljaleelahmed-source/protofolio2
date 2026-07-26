import { ChatMessage } from '../types';

const HISTORY_KEY = 'jaleelo_ai_history';

class AIAssistantService {
  private apiKey: string = import.meta.env.VITE_AI_API_KEY || '';

  public getHistory(): ChatMessage[] {
    try {
      const raw = sessionStorage.getItem(HISTORY_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Fallback
    }

    return [
      {
        id: 'init-msg',
        sender: 'assistant',
        text: "Hello! I am Mostafa's AI Assistant. Ask me anything about his .NET 8 background, EduSphere architecture, recruiter questions, or ask for code samples!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  public saveHistory(history: ChatMessage[]): void {
    try {
      sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Quota fallback
    }
  }

  public clearHistory(): ChatMessage[] {
    sessionStorage.removeItem(HISTORY_KEY);
    return this.getHistory();
  }

  public renderMarkdownWithCode(text: string): string {
    if (!text) return '';

    // First handle code blocks ```lang code ```
    let formatted = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const language = lang || 'code';
      const cleanCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `<div style="margin: 10px 0; background: #05070c; border: 1px solid rgba(136, 217, 255, 0.2); border-radius: 8px; overflow: hidden;">
        <div style="background: rgba(255,255,255,0.04); padding: 4px 10px; font-size: 0.7rem; font-family: DM Mono, monospace; color: var(--accent); display: flex; justify: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
          <span>${language.toUpperCase()}</span>
          <span style="color: var(--text-dim);">Code Snippet</span>
        </div>
        <pre style="margin: 0; padding: 10px 12px; font-family: 'DM Mono', monospace; font-size: 0.8rem; color: #88d9ff; overflow-x: auto; white-space: pre-wrap;"><code>${cleanCode}</code></pre>
      </div>`;
    });

    // Handle Inline Code `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: DM Mono, monospace; color: var(--accent); font-size: 0.8rem;">$1</code>');

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff;">$1</strong>');

    // Italic *text*
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Newlines to <br/>
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  }

  private generateKnowledgeResponse(query: string): string {
    const q = query.toLowerCase();

    // RECRUITER AVAILABILITY & INTERNSHIPS
    if (q.includes('available') || q.includes('hire') || q.includes('recruiter') || q.includes('job') || q.includes('internship') || q.includes('role')) {
      return `Mostafa is **OPEN for Software Engineering Internships**, **Junior .NET Backend Developer roles**, and **Freelance Automation projects**!\n\nKey Highlights:\n- **Location**: Cairo, Egypt (Open to Remote & Relocation)\n- **Education**: Computer Science at Cairo University (FCAI)\n- **Core Focus**: High-throughput ASP.NET Core REST APIs, Clean Architecture, and AI Automations.\n- **Direct Contact**: email: mostafaabduljaleelahmed@gmail.com | WhatsApp: +20 101 131 9867`;
    }

    // TECH STACK & .NET 8
    if (q.includes('stack') || q.includes('dotnet') || q.includes('c#') || q.includes('backend') || q.includes('skills')) {
      return `Mostafa's core technical stack includes:\n\n- **Backend**: .NET 8 / C#, ASP.NET Core REST APIs, Entity Framework Core, SQL Server\n- **Mobile & Automation**: Flutter (Cross-platform), Python (Selenium & Claude API automation)\n- **Frontend & 3D**: React, TypeScript, Three.js, React Three Fiber, GSAP\n- **DevOps**: Docker, Git, CI/CD, Vercel\n\nHere is an example of Mostafa's C# Clean Architecture Controller pattern:\n\`\`\`csharp\n[ApiController]\n[Route("api/[controller]")]\npublic class SystemStatusController : ControllerBase\n{\n    private readonly ITelemetryService _telemetry;\n    public SystemStatusController(ITelemetryService telemetry) => _telemetry = telemetry;\n\n    [HttpGet("health")]\n    public async Task<IActionResult> GetHealthAsync()\n    {\n        var status = await _telemetry.GetHealthMetricsAsync();\n        return Ok(new { Status = "ONLINE", Version = "v2.6", Metrics = status });\n    }\n}\n\`\`\``;
    }

    // EDUSPHERE & PROJECTS
    if (q.includes('edusphere') || q.includes('project') || q.includes('work') || q.includes('portfolio')) {
      return `Here are Mostafa's top production projects:\n\n1. **EduSphere / Tutoring OS**: Founder & Full-Stack Architect built with .NET 8, C#, and SQL Server. Solved zero accounting drift for high-density student ledgers.\n2. **WhatsApp Messaging Assistant**: Automated bulk parent/student messaging via Twilio Sandbox & WhatsApp Business API.\n3. **Classroom to Meet Watcher**: Python & Selenium process monitoring Google Classroom and joining Meet links automatically.\n4. **JLJL Canvas Compositor**: JS Canvas tool turning raw artwork into product mockups.\n5. **AI Folder Organizer**: Python AI classifier sorting downloads automatically.`;
    }

    // CODE SAMPLE REQUEST
    if (q.includes('code') || q.includes('sample') || q.includes('example')) {
      return `Here is a sample Python automation script Mostafa built for Google Meet watching:\n\`\`\`python\nimport time\nfrom selenium import webdriver\nfrom selenium.webdriver.common.by import By\n\ndef monitor_classroom(target_url):\n    driver = webdriver.Chrome()\n    driver.get(target_url)\n    print("[watcher] Monitoring Classroom for Meet link...")\n    \n    while True:\n        links = driver.find_elements(By.XPATH, "//a[contains(@href, 'meet.google.com')]")\n        if links:\n            meet_url = links[0].get_attribute('href')\n            print(f"[found] Meet Link detected: {meet_url}")\n            driver.get(meet_url)\n            break\n        time.sleep(5)\n\`\`\``;
    }

    // EDUCATION & CAIRO UNIVERSITY
    if (q.includes('education') || q.includes('university') || q.includes('cairo') || q.includes('degree')) {
      return `Mostafa is currently pursuing his Bachelor of Computer Science degree at **Faculty of Computers and Artificial Intelligence, Cairo University** (FCAI).\n\nCourses & Specialization: Data Structures, Algorithms, Software Engineering, Database Systems (SQL), Operating Systems, and Artificial Intelligence.`;
    }

    // DEFAULT ANSWER
    return `Mostafa Abduljaleel Ahmed (Jaleelo) is a .NET 8 / C# Full-Stack Developer, AI Automation Engineer, and Computer Science student at Cairo University.\n\nHe specializes in building scalable backend systems, cross-platform Flutter applications, and intelligent Python automations.\n\nFeel free to ask about his **availability**, **EduSphere case study**, **tech stack**, or ask for **code samples**!`;
  }

  public streamResponse(
    query: string,
    onToken: (tokenText: string) => void,
    onComplete: (fullText: string) => void
  ): void {
    const fullResponse = this.generateKnowledgeResponse(query);
    let currentIndex = 0;
    const chunkSize = 2; // Stream 2 characters per frame tick

    const interval = setInterval(() => {
      currentIndex += chunkSize;
      const currentChunk = fullResponse.slice(0, currentIndex);
      onToken(currentChunk);

      if (currentIndex >= fullResponse.length) {
        clearInterval(interval);
        onComplete(fullResponse);
      }
    }, 18);
  }
}

export const aiAssistantService = new AIAssistantService();
