export type Metric = {
  label: string;
  value: number;
  suffix?: string;
};

export type Capability = {
  title: string;
  summary: string;
  bullets: string[];
  tools: string[];
  proof: string;
  issues?: string[];
};

export type Experience = {
  role: string;
  organisation: string;
  location: string;
  period: string;
  context: string;
  bullets: string[];
  tools: string[];
  shipped: string[];
};

export type Education = {
  title: string;
  institution: string;
  period: string;
  status: 'In progress' | 'Completed';
  enabled: string;
  topics: string[];
};

export type Certification = {
  name: string;
  year: number;
  description: string;
  status: 'Completed' | 'In progress';
};

export type Project = {
  title: string;
  problem: string;
  solution: string;
  stack: string[];
  outcome: string;
  links: { label: string; href: string }[];
};

export const profile = {
  name: 'Fermin Espinoza',
  role: 'Network Technician / IT Support',
  location: 'Costa Rica',
  email: 'fezgar12@gmail.com',
  phone: '+506 8708 8364',
  github: 'https://github.com/Ferm1nn',
  linkedin: 'https://www.linkedin.com/in/fermin-espinoza',
  headline: 'Systems Engineering and Cybersecurity student specializing in secure networking, automation, and comprehensive L1-L3 technical support.',
  summary:
    'I document repeatable fixes, validate connectivity end to end, and build workflows that reduce manual handoffs.',
};

export const heroMetrics: Metric[] = [
  { label: 'Years of labs', value: 3, suffix: '+' },
  { label: 'Tools used', value: 40, suffix: '+' },
  { label: 'Workflows delivered', value: 50, suffix: '+' },
];

export const technicalSkills: Capability[] = [
  {
    title: 'IT Support & Troubleshooting',
    summary: 'Reduce incident time with repeatable diagnostics.',
    bullets: [
      'Validate cabling, link speed, and duplex settings to isolate L1/L2 faults and restore connectivity.',
      'Verify IP, DNS, and DHCP configurations to remove misconfigurations and stabilize endpoints.',
      'Document incident steps in runbooks to cut repeat escalations.',
    ],
    tools: ['Cabling', 'Speed/Duplex', 'IP/DNS/DHCP', 'Incident documentation'],
    proof: 'Reduced troubleshooting time by documenting repeatable L1/L2 steps.',
    issues: ['No IP lease', 'Intermittent link', 'DNS resolution failure'],
  },
  {
    title: 'Networking',
    summary: 'Design and validate core network services in lab environments.',
    bullets: [
      'Built IPv4 subnet plans and validated routing to maintain reachability across lab segments.',
      'Configured STP to prevent loops and maintain stable switching during topology changes.',
      'Applied NAT/PAT and ACL checks to confirm least-privilege access and outbound reachability.',
    ],
    tools: ['TCP/IP', 'IPv4 subnetting', 'STP', 'DHCP/DNS', 'NAT/PAT', 'ACL concepts', 'WLAN fundamentals'],
    proof: 'Validated VLAN segmentation across lab topology; verified reachability and broadcast isolation.',
    issues: ['Gateway misconfiguration', 'Looping switch ports', 'ACL blocking'],
  },
  {
    title: 'Automation & Systems',
    summary: 'Bridge API integrations and operations with reliable workflows.',
    bullets: [
      'Design backend automation workflows using n8n as an orchestration layer for websites, handling HTTP webhooks as API-style entry points.',
      'Process, validate, and transform incoming frontend data before persisting structured records in Supabase.',
      'Implement conditional business logic, status tracking, and deduplication to maintain data integrity across workflows.',
      'Build event-driven automations to trigger follow-up actions such as notifications and third-party service integrations.',
    ],
    tools: ['n8n', 'Supabase', 'Webhooks', 'OpenAI API', 'Python'],
    proof: 'Applied backend concepts including request/response handling, data consistency, and operational reliability within automation systems.',
  },
  {
    title: 'Languages',
    summary: 'Use Python and Java to support automation tasks and reinforce backend concepts.',
    bullets: [
      'Write small Python scripts to automate simple, repetitive tasks and basic data handling.',
      'Use Python to parse input data and support automation steps in workflows.',
      'Apply Java fundamentals (classes, conditionals, loops) to model basic logic and validate structured processes.',
      'Build simple Java programs for learning and reinforcing backend and workflow concepts.',
    ],
    tools: ['Python', 'Java'],
    proof: 'Built scripting utilities to support automation tasks and data parsing.',
  },
];

export const expandedSkills: Capability[] = [
  {
    title: 'Networking Technician',
    summary: 'Understands connectivity concepts and structured diagnostics.',
    bullets: [
      'Validate DHCP addressing, renewals, and conflicts to restore endpoint connectivity.',
      'Perform layered troubleshooting across L1, L2, and L3 to isolate root causes.',
      'Verify gateway, DNS, and routing paths to maintain reachability.',
    ],
    tools: ['DHCP', 'TCP/IP', 'DNS', 'Routing', 'L1-L3 troubleshooting'],
    proof: 'Ensured lab connectivity reliability through structured diagnostics and testing.',
  },
  {
    title: 'No-Code Automation Specialist (n8n, Make)',
    summary: 'Designs and builds automation workflows for business processes.',
    bullets: [
      'Connect tools using webhooks and API-based integrations to ensure dependable data flow.',
      'Structure workflows for reliability, maintainability, and clear logic paths.',
      'Deliver automation handoffs that reduce manual follow-ups.',
      'Build reusable workflow templates to speed up setup and deployment.',
    ],
    tools: ['n8n', 'Make', 'Webhooks', 'APIs'],
    proof: 'Built workflow templates that reduce setup time.',
  },
  {
    title: 'Website Builder (Domains, Publishing, Hosting)',
    summary: 'Publishes and hosts websites with solid front-end structure awareness.',
    bullets: [
      'Manage domains, hosting, and deployment steps for reliable publishing.',
      'Assemble website pages with structured content and clear launch plans.',
      'Use repeatable checklists to keep launches consistent and avoid common delays.',
    ],
    tools: ['Domains', 'Hosting', 'Publishing', 'Deployment'],
    proof: 'Shipped front-end pages with predictable deployment and update workflows.',
  },
  {
    title: 'Programming Knowledge (Python, Java)',
    summary: 'Understands programming fundamentals and structured problem solving.',
    bullets: [
      'Practice core control flow (variables, conditions, loops) and write simple functions/methods.',
      'Work with basic data structures like arrays/lists for structured data handling.',
      'Build small console-style programs using input/output, basic calculations, and step-by-step logic.',
      'Apply beginner OOP concepts (classes, objects, attributes, methods) to organize code.',
      'Add simple validation and edge-case handling to avoid common runtime errors.',
    ],
    tools: ['Python', 'Java', 'Control flow', 'OOP basics'],
    proof: 'Created utilities to support automations and data handling with clean inputs/outputs.',
  },
  {
    title: 'Backend Framework Knowledge (JavaScript, TypeScript, Supabase)',
    summary: 'Understands backend concepts and how they connect to integrations and data flows.',
    bullets: [
      'Map JS/TS backend fundamentals to real API-style requests, responses, and data handling.',
      'Use Supabase for basic database structure, authentication concepts, and secure API patterns when needed.',
      'Connect backend logic to external tools through clear payloads and consistent data contracts.',
      'Keep integrations organized with predictable inputs/outputs and maintainable structure.',
    ],
    tools: ['JavaScript', 'TypeScript', 'Supabase'],
    proof: 'Connected backend logic to automation flows with clean data contracts.',
  },
  {
    title: 'Vibe-Coding',
    summary: 'AI-driven rapid prototyping with an iterative build-test-refine workflow.',
    bullets: [
      'Use AI tools to accelerate development cycles while keeping structure, readability, and maintainability.',
      'Iterate quickly through small, testable changes with tight feedback loops to converge on working solutions.',
      'Translate vague ideas into functional prototypes, then refine them into more stable, production-ready implementations.',
      'Focus on clear requirements, predictable behavior, and clean handoffs from prototype to final build.',
    ],
    tools: ['Rapid prototyping', 'Iteration', 'AI tools'],
    proof: 'Delivered fast prototypes that informed final workflows.',
  },
];

export const experiences: Experience[] = [
  {
    role: 'Freelance AI Automation Developer',
    organisation: 'Self-employed',
    location: 'Remote',
    period: '2025 - Present',
    context: 'Delivered production-ready automation and integration systems using n8n, Supabase, OpenAI API, webhooks, and Python, connecting lead intake and onboarding into reliable backend pipelines that reduced manual routing and improved operational consistency.',
    bullets: [
      'Built automation pipelines with n8n and Supabase to connect lead intake and onboarding into reliable backend workflows.',
      'Diagnosed and fixed authentication, API, and workflow failures to strengthen reliability and execution stability.',
      'Created clear documentation and change logs to reduce repeat support issues and simplify maintenance.',
    ],
    tools: ['n8n', 'Supabase', 'OpenAI API', 'Webhooks', 'Python'],
    shipped: ['Lead intake workflow', 'Onboarding automation', 'Email processing pipeline'],
  },
  {
    role: 'Networking Labs Assistant',
    organisation: 'Cisco Networking Academy / Personal Labs',
    location: 'Costa Rica',
    period: '2022 - 2025',
    context: 'Cisco NetAcad labs & real-world networking practice across core domains including TCP/IP, STP, DHCP/DNS, NAT/PAT, ACLs, and WLAN.',
    bullets: [
      'Configured LAN and Wi-Fi lab topologies using DHCP and static addressing, implemented STP to prevent switching loops, and performed L1-L3 troubleshooting (cabling, speed/duplex, IP configuration, DNS, and DHCP) with repeatable documented steps.',
      'Validated and tested ACL and NAT/PAT policies to enforce least-privilege access while maintaining required reachability.',
      'Covered core domains including TCP/IP, STP, DHCP/DNS, NAT/PAT, ACLs, and WLAN.',
    ],
    tools: ['TCP/IP', 'STP', 'DHCP/DNS', 'NAT/PAT', 'ACLs', 'WLAN'],
    shipped: ['Lab topology setup', 'Troubleshooting runbook', 'ACL/NAT validation checklist'],
  },
];

export const education: Education[] = [
  {
    title: 'B.Sc. Systems Engineering',
    institution: 'Universidad Fidelitas, Costa Rica',
    period: 'In progress',
    status: 'In progress',
    enabled: 'Applied systems thinking to networking and security labs.',
    topics: ['Networking fundamentals', 'Cybersecurity basics', 'Computer troubleshooting and analysis'],
  },
  {
    title: 'High School Diploma',
    institution: 'Completed secondary education',
    period: '2024',
    status: 'Completed',
    enabled: 'Foundation for continued technical study and lab practice.',
    topics: [],
  },
];

export const certifications: Certification[] = [
  {
    name: 'Cisco CCNA 1',
    year: 2024,
    description: 'Network architectures, IP addressing, and Ethernet fundamentals.',
    status: 'Completed',
  },
  {
    name: 'Cisco CCNA 2',
    year: 2024,
    description: 'Switching, routing, and wireless fundamentals.',
    status: 'Completed',
  },
  {
    name: 'Cisco CCNA 3',
    year: 2025,
    description: 'Enterprise networking, security, and automation.',
    status: 'Completed',
  },
  {
    name: 'Cisco CCNA 200-301',
    year: 2026,
    description: 'Switching/routing, IP services, security, wireless, and automation fundamentals.',
    status: 'In progress',
  },
  {
    name: 'Cisco Networking Essentials',
    year: 2023,
    description: 'Fundamental networking concepts and best practices.',
    status: 'Completed',
  },
  {
    name: 'Python Programming',
    year: 2025,
    description: 'Scripting, data structures, and automation fundamentals.',
    status: 'Completed',
  },
  {
    name: 'Introduction to IoT (Cisco NetAcad)',
    year: 2025,
    description: 'Foundational concepts in the Internet of Things.',
    status: 'Completed',
  },
];

export const projects: Project[] = [
  {
    title: 'Lead Intake Automation',
    problem: 'Manual lead routing and delayed follow-ups across channels.',
    solution: 'Webhook-driven workflow that captures leads, writes to Supabase, and triggers follow-up tasks.',
    stack: ['n8n', 'Supabase', 'OpenAI API', 'Webhooks'],
    outcome: 'Reduced response time for lead follow-ups with automated routing.',
    links: [],
  },
  {
    title: 'Lab Network Validation Runbook',
    problem: 'Inconsistent troubleshooting steps across lab sessions.',
    solution: 'Structured L1-L3 checklist with validation steps for DHCP, DNS, and routing.',
    stack: ['TCP/IP', 'DHCP/DNS', 'STP', 'NAT/PAT'],
    outcome: 'Improved lab resolution speed with standardized diagnostics.',
    links: [],
  },
  {
    title: 'Email Processing Workflow',
    problem: 'Manual inbox triage and delayed response routing.',
    solution: 'Automated tagging and routing workflow with enrichment steps.',
    stack: ['n8n', 'Supabase', 'OpenAI API'],
    outcome: 'Reduced manual triage effort with automated tagging and routing.',
    links: [],
  },
];
