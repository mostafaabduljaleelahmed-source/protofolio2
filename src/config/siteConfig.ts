export interface ProjectCase {
  number: string;
  title: string;
  meta: string;
  summary: string;
  problem: string;
  goal: string;
  architecture: string;
  architectureDiagram?: string[];
  challenges: string[];
  decisions: string[];
  technologies: string[];
  results: string[];
  link?: string;
  code?: string;
}

export interface ExperimentSignal {
  tag: string;
  title: string;
  description: string;
}

export const SITE_CONFIG = {
  name: 'Mostafa Abduljaleel Ahmed',
  handle: 'Jaleelo',
  version: 'v2.6 OS',
  title: 'Mostafa Abduljaleel — Software & Systems Engineer',
  description: 'Full-stack .NET Backend Developer, AI Automation Engineer, and Computer Science Student at Cairo University.',
  location: 'CAIRO / EGYPT',
  email: 'mostafaabduljaleelahmed@gmail.com',
  whatsapp: 'https://wa.me/201011319867',
  github: 'https://github.com/mostafaabduljaleelahmed-source',
  linkedin: 'https://www.linkedin.com/in/mostafa-abduljaleel-7980893a3/',
  resumeUrl: '#resume-download',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  
  stack: [
    { name: '.NET 8 / C#', category: 'Backend Architecture', tag: 'ASP.NET Core' },
    { name: 'Flutter', category: 'Mobile Apps', tag: 'Cross-Platform' },
    { name: 'Python', category: 'Automation & AI', tag: 'Selenium & LLMs' },
    { name: 'React & TypeScript', category: 'Frontend', tag: 'Single Page Apps' },
    { name: 'SQL Server & Entity Framework', category: 'Databases', tag: 'Relational Schemas' }
  ],

  projects: [
    {
      number: '01',
      title: 'EduSphere / Tutoring OS',
      meta: 'Founder & Lead Architect • .NET 8 • SQL Server • React',
      summary: 'End-to-end management platform for tutoring operations with role-based access, automated ledger tracking, and session scheduling.',
      problem: 'Private tutoring centers manage hundreds of students, recurring payments, and attendance across multiple instructors manually using fragmented spreadsheets, causing financial discrepancies and scheduling conflicts.',
      goal: 'Architect a unified, deterministic management OS with zero ledger drift, role-based access control (RBAC), and automated student billing.',
      architecture: 'Layered Architecture (ASP.NET Core REST API) with Repository Pattern, Entity Framework Core, SQL Server transactional isolation, and a React administrative dashboard.',
      architectureDiagram: [
        '[ Client Apps: Web Admin & Mobile ]',
        '       │ HTTPS / JWT Auth',
        '       ▼',
        '[ ASP.NET Core 8 Web API Gateway ]',
        '       │ Middleware Pipeline (Auth, Validation, Exception Handling)',
        '       ▼',
        '[ Application Service Layer ] ──▶ [ Quartz.NET Cron Jobs (Billing) ]',
        '       │ EF Core / Dapper',
        '       ▼',
        '[ SQL Server Relational DB (ACID Transactions) ]'
      ],
      challenges: [
        'Handling concurrent session bookings without double-booking classrooms or tutors.',
        'Ensuring strict financial ledger immutability when recording partial or installment payments.'
      ],
      decisions: [
        'Selected SQL Server row-level locking over optimistic concurrency to prevent booking collisions under high load.',
        'Implemented JWT authentication with rotating refresh tokens stored in HttpOnly secure cookies for enterprise security.'
      ],
      technologies: ['.NET 8', 'C#', 'ASP.NET Core', 'EF Core', 'SQL Server', 'React', 'TypeScript', 'Tailwind CSS'],
      results: [
        '100% elimination of payment tracking discrepancies across test deployments.',
        'Sub-50ms API query response time for schedule & attendance lookups.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    },
    {
      number: '02',
      title: 'WhatsApp Messaging Assistant',
      meta: 'Backend Developer • Twilio Sandbox • Node.js / Python API',
      summary: 'Automated communication bridge connecting educational systems to parents and students via WhatsApp.',
      problem: 'Sending broadcast alerts, exam results, and schedule reminders manually to hundreds of parents via personal phones was inefficient and prone to missing recipients.',
      goal: 'Engineered an automated WhatsApp gateway capable of dispatching personalized notification templates with webhooks for delivery status.',
      architecture: 'Asynchronous event-driven webhook handler built with Node.js/Python, integrated with Twilio WhatsApp Business API and rate-limited dispatch queues.',
      architectureDiagram: [
        '[ Trigger Event: System Alert / Exam Result ]',
        '       │ HTTP Webhook / Queue',
        '       ▼',
        '[ Dispatcher Middleware ] ──▶ [ Rate Limiter (Token Bucket) ]',
        '       │ REST API (HTTPS)',
        '       ▼',
        '[ Twilio WhatsApp Business Gateway ]',
        '       │ Push Notification',
        '       ▼',
        '[ Recipient WhatsApp Client ]'
      ],
      challenges: [
        'Respecting WhatsApp Business API rate limits to prevent account throttling or flagging.',
        'Ensuring fallback mechanisms when recipient phone numbers lack active WhatsApp accounts.'
      ],
      decisions: [
        'Utilized a Token Bucket rate-limiting algorithm to guarantee compliance with messaging throughput limits.',
        'Stored message delivery states asynchronously to provide real-time delivery confirmation dashboards.'
      ],
      technologies:['Python', 'Node.js', 'Twilio API', 'WhatsApp Business API', 'REST Webhooks', 'Redis Queue'],
      results: [
        'Reduced parent broadcast notification delivery time from hours to under 30 seconds.',
        '99.4% message delivery success rate across automated campaigns.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    },
    {
      number: '03',
      title: 'Classroom to Meet Watcher',
      meta: 'Author • Python • Selenium • Automation',
      summary: 'Real-time monitoring bot that automatically joins newly posted Google Meet links from Google Classroom feeds.',
      problem: 'Instructors post Google Meet links at unpredictable times before lectures, forcing students to repeatedly refresh pages and risking missed session starts.',
      goal: 'Construct a headless background process that monitors Google Classroom webhooks/DOM updates and immediately launches and authenticates into the Meet session.',
      architecture: 'Python Selenium daemon with shadow DOM inspection, configurable polling intervals, audio/video auto-mute hooks, and desktop notification triggers.',
      architectureDiagram: [
        '[ Background Daemon Script ]',
        '       │ Headless Browser Polling',
        '       ▼',
        '[ Google Classroom Stream Inspector ]',
        '       │ Regex Pattern Matching (meet.google.com/*)',
        '       ▼',
        '[ Auto-Join Executor ] ──▶ [ Mute Mic & Camera Flags ]',
        '       │ OS System Notification',
        '       ▼',
        '[ Active Google Meet Session ]'
      ],
      challenges: [
        'Bypassing dynamic Google login re-authentication challenges without manual intervention.',
        'Parsing dynamically rendered React/Angular DOM elements inside Google Classroom streams.'
      ],
      decisions: [
        'Used persistent Chrome user profiles with OAuth tokens to bypass daily re-logins.',
        'Implemented explicit dynamic wait conditions (`WebDriverWait`) rather than static timeouts for instant response upon link posting.'
      ],
      technologies: ['Python', 'Selenium WebDriver', 'DOM Manipulation', 'OS Notifications', 'Chrome Profile Driver'],
      results: [
        'Zero missed lectures across 2 academic semesters of automated monitoring.',
        'Average response time under 1.8 seconds from link post to active meeting entry.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    },
    {
      number: '04',
      title: 'JLJL Compositing Engine',
      meta: 'Creator • HTML5 Canvas • JavaScript',
      summary: 'High-performance client-side image rendering engine generating dynamic product mockups.',
      problem: 'Creating artwork sticker previews across multiple color variations and product angles required repetitive manual graphic editor workflows.',
      goal: 'Develop an in-browser HTML5 Canvas compositing tool that dynamically layers raw artwork onto product templates in real time.',
      architecture: 'Pure JavaScript Canvas rendering pipeline with non-destructive layer blending, asset preloading, and high-DPI export options.',
      architectureDiagram: [
        '[ User Asset Upload / Artwork ]',
        '       │ File API / Image Buffer',
        '       ▼',
        '[ HTML5 Canvas Compositing Engine ]',
        '       │ Matrix Transformations (Scale, Rotate, Blend)',
        '       ▼',
        '[ Template Layer Overlay ] ──▶ [ Color Tint Shader ]',
        '       │ Client-side PNG Render',
        '       ▼',
        '[ High-Resolution Product Mockup Export ]'
      ],
      challenges: [
        'Maintaining 60 FPS viewport rendering during multi-layer transformation and zooming.',
        'Exporting crisp, print-ready 300 DPI PNG assets without browser memory crashes.'
      ],
      decisions: [
        'Adopted offscreen canvas buffers (`OffscreenCanvas`) for complex blend operations to preserve UI thread responsiveness.',
        'Built pure Vanilla JS calculations to eliminate external heavy graphics library dependencies.'
      ],
      technologies: ['JavaScript ES6+', 'HTML5 Canvas API', 'OffscreenCanvas', 'CSS3', 'Web APIs'],
      results: [
        'Accelerated mockup production speed by over 90% (from 5 minutes per image to under 10 seconds).',
        'Zero external runtime dependencies for maximum portability.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    },
    {
      number: '05',
      title: 'AI Folder Intelligence Classifier',
      meta: 'Author • Python • LLM Classification API',
      summary: 'Intelligent file system organizer utilizing natural language understanding to categorize unorganized downloads.',
      problem: 'Developers and students accumulate chaotic download folders containing diverse file types, research papers, source code snippets, and assets.',
      goal: 'Build an automated CLI utility that inspects file metadata and sample content, querying an LLM to categorize files into contextual directory trees.',
      architecture: 'CLI pipeline written in Python, combining file signature analysis, light text extraction, Claude API classification, and safe filesystem operations.',
      architectureDiagram: [
        '[ Unsorted Directory Stream ]',
        '       │ Metadata & Header Extraction',
        '       ▼',
        '[ Content Summarizer & MIME Parser ]',
        '       │ JSON Prompt Payload',
        '       ▼',
        '[ LLM Classification Service (Claude API) ]',
        '       │ Category Decision & Target Path',
        '       ▼',
        '[ Safe Atomic File Mover ] ──▶ [ Audit Log Manifest ]'
      ],
      challenges: [
        'Preventing accidental file overwrites or data loss during batch directory reorganization.',
        'Optimizing API token usage by sending concise file previews rather than full binary files.'
      ],
      decisions: [
        'Created a mandatory JSON dry-run manifest step allowing users to inspect and approve moves before execution.',
        'Implemented fallback rule-based regex classifiers for common binary extensions (e.g. .pdf, .zip, .exe) to reduce API cost.'
      ],
      technologies: ['Python', 'Claude API / LLM Integration', 'PyPDF2 / DocX Parsers', 'JSON Schema', 'CLI Argparse'],
      results: [
        'Organized over 3,000 files in benchmark tests with 98% categorical accuracy.',
        'Reduced manual desktop cleanup time to a single 5-second terminal invocation.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    },
    {
      number: '06',
      title: 'Lightweight To-Do PWA',
      meta: 'Author • Vanilla JS • Progressive Web App',
      summary: 'Offline-first, installable productivity web application focused on instant interaction and zero bloat.',
      problem: 'Modern task management web apps are heavily bloated with third-party tracking, long initial load times, and broken offline capabilities.',
      goal: 'Build a zero-dependency Progressive Web App with instant startup, offline persistence, and accessible keyboard shortcuts.',
      architecture: 'Vanilla JS single-file architecture with IndexedDB storage, Service Worker cache-first strategy, and Web Manifest for installability.',
      architectureDiagram: [
        '[ Web / Mobile Client ]',
        '       │ Service Worker Interceptor',
        '       ▼',
        '[ Cache First Asset Storage ] ──▶ [ Offline Fallback Shell ]',
        '       │ Local Data Sync',
        '       ▼',
        '[ IndexedDB Local Storage API ]'
      ],
      challenges: [
        'Achieving 100/100 Lighthouse performance, accessibility, and PWA scores.',
        'Synchronizing local state changes reliably without external frameworks.'
      ],
      decisions: [
        'Wrote zero third-party UI framework code to keep total bundle size under 15 KB.',
        'Used native Custom Events for clean component state reactivity.'
      ],
      technologies: ['JavaScript (ES6)', 'Service Workers', 'IndexedDB', 'Web App Manifest', 'CSS Variables'],
      results: [
        '100/100 Lighthouse audit score across Performance, Accessibility, Best Practices, and PWA.',
        'Sub-100ms cold start load time on standard mobile network connections.'
      ],
      code: 'https://github.com/mostafaabduljaleelahmed-source'
    }
  ] as ProjectCase[],

  experiments: [
    {
      tag: 'Agents & Workflows',
      title: 'Internship Application Automation',
      description: 'Exploring Python & Playwright agent loops to streamline application submissions, format resumes per job description, and log response statuses.'
    },
    {
      tag: 'Classroom Watcher',
      title: 'Automated Meeting Entry',
      description: 'Python Selenium daemon monitoring Google Classroom feeds for newly published meeting links with immediate audio/video muted joining.'
    },
    {
      tag: 'LLM Classification',
      title: 'FileSystem Intelligence',
      description: 'Combining file metadata inspection and LLM classification to automatically organize multi-terabyte download directories into semantic subfolders.'
    }
  ] as ExperimentSignal[],

  aiKnowledge: {
    available: 'Mostafa is currently OPEN for Software Engineering Internships, Junior .NET Backend Roles, and Systems / Automation Engineering positions.',
    stack: 'Core Stack: .NET 8 / C#, ASP.NET Core REST APIs, SQL Server, Entity Framework Core, Flutter, Python (Selenium / Webhooks / LLM Workflows), React, TypeScript, Git.',
    projects: 'Featured Projects: EduSphere (.NET Tutoring OS), WhatsApp Business Messaging Assistant, Classroom-to-Meet Python Watcher, JLJL Canvas Compositor, AI Folder Intelligence Classifier, Lightweight To-Do PWA.',
    university: 'Education: Computer Science student at Faculty of Computers and Artificial Intelligence, Cairo University.',
    contact: 'Email: mostafaabduljaleelahmed@gmail.com | WhatsApp: +20 101 131 9867 | LinkedIn: Mostafa Abduljaleel'
  } as Record<string, string>
};

