export interface ProjectCase {
  number: string;
  title: string;
  meta: string;
  pressure: string;
  response: string;
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
  title: 'JALEELO / Interactive Operating Environment',
  description: 'Full-stack .NET Developer, AI Automation Engineer, and Computer Science Student at Cairo University.',
  location: 'CAIRO / EGYPT',
  email: 'mostafaabduljaleelahmed@gmail.com',
  whatsapp: 'https://wa.me/201011319867',
  github: 'https://github.com/mostafaabduljaleelahmed-source',
  linkedin: 'https://www.linkedin.com/in/mostafa-abduljaleel-7980893a3/',
  
  stack: [
    { name: '.NET 8 / C#', category: 'Backend Architecture', tag: 'ASP.NET Core' },
    { name: 'Flutter', category: 'Mobile Apps', tag: 'Cross-Platform' },
    { name: 'Python', category: 'Automation & AI', tag: 'Selenium & Claude' },
    { name: 'React & Three.js', category: 'Frontend & 3D Graphics', tag: 'R3F / GSAP' },
    { name: 'SQL Server', category: 'Databases', tag: 'Relational Schemas' }
  ],

  projects: [
    {
      number: '01',
      title: 'EduSphere / Tutoring OS',
      meta: 'Founder & Full-Stack Architect / .NET 8 / SQL Server',
      pressure: 'High-density scheduling, multi-role access control, and student ledger tracking required zero room for accounting drift.',
      response: 'Built an end-to-end management platform for tutoring operations with role-based access, automated payments, and session logs.'
    },
    {
      number: '02',
      title: 'WhatsApp Messaging Assistant',
      meta: 'Workflow design / Twilio / WhatsApp Business API',
      pressure: 'A tutoring-centre message should reach parents and students without hundreds of manual sends.',
      response: 'Prototyped in Twilio Sandbox before moving toward official WhatsApp Business API where scale and reliability matter.'
    },
    {
      number: '03',
      title: 'Classroom to Meet Watcher',
      meta: 'Personal automation / Python / Selenium',
      pressure: 'Meeting links appear at unpredictable moments; the cost of noticing late is missing the session.',
      response: 'A watcher monitors Google Classroom and joins when a new Meet link arrives, turning attention into a system responsibility.'
    },
    {
      number: '04',
      title: 'JLJL Compositing Tool',
      meta: 'Founder tool / JavaScript / Canvas',
      pressure: 'Creating consistent product images by hand does not scale with a growing sticker brand.',
      response: 'Built an internal compositor that turns raw artwork into finished product imagery without repeating a manual Photoshop workflow.'
    },
    {
      number: '05',
      title: 'AI Folder Organizer',
      meta: 'Personal utility / Python / AI classification',
      pressure: 'Downloads and working folders become unusable long before anyone has time to organize them.',
      response: 'An AI classifier assigns files to useful subfolders, turning cleanup into one deliberate action rather than a recurring chore.'
    },
    {
      number: '06',
      title: 'To-Do PWA',
      meta: 'Live / JavaScript / Progressive Web App',
      pressure: 'A task tool should not require an app store or a bloated interface to be useful.',
      response: 'An installable PWA focused on the smallest version of a task tracker that still feels fast and complete.'
    }
  ] as ProjectCase[],

  experiments: [
    {
      tag: 'Agents',
      title: 'Application workflows',
      description: 'Exploring a Flask and React assistant that uses Playwright and Claude API to help prepare internship applications and monitor status updates.'
    },
    {
      tag: 'Classroom watcher',
      title: 'Never miss the link',
      description: 'A Python and Selenium process that monitors Google Classroom and joins a newly posted Google Meet link immediately.'
    },
    {
      tag: 'Classification',
      title: 'Folder intelligence',
      description: 'AI classification that makes "organize this folder" a one-click action instead of a Sunday afternoon.'
    }
  ] as ExperimentSignal[],

  aiKnowledge: {
    available: 'Mostafa is currently OPEN for Software Engineering Internships, Junior .NET Backend Roles, and Freelance Automation Projects.',
    stack: 'Core Stack: .NET 8 / C#, ASP.NET Core REST APIs, SQL Server, Flutter, Python (Selenium/Automation), React, Three.js, GSAP, Git.',
    projects: 'Featured Projects: EduSphere (.NET Tutoring OS), WhatsApp Business Assistant, Classroom-to-Meet Python Watcher, JLJL Canvas Compositor, AI Folder Classifier.',
    university: 'Education: Computer Science student at Faculty of Computers and Artificial Intelligence, Cairo University.',
    contact: 'Email: mostafaabduljaleelahmed@gmail.com | WhatsApp: +20 101 131 9867 | LinkedIn: Mostafa Abduljaleel'
  } as Record<string, string>
};
