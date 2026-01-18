export type Experience = {
  role: string;
  organisation: string;
  location: string;
  period: string;
  bullets: string[];
};

export type Education = {
  title: string;
  institution: string;
  period: string;
};

export type Certification = {
  name: string;
  year: number;
  description: string;
};

export type SkillCategory = {
  title: string;
  items: string[];
};

export type ExpandedSkill = {
  title: string;
  focus: string;
  bullets: string[];
};

export const profile = {
  name: 'Fermin Espinoza',
  role: 'AI Automation Developer & Networking Student',
  location: 'Costa Rica (remote-friendly)',
  email: 'fezgar12@gmail.com',
  phone: '+506 8708 8364',
  linkedin: 'https://linkedin.com/in/fermin-espinoza',
  summary:
    'Systems engineering and cybersecurity student focused on networking, automation, and structured troubleshooting. Delivers clear documentation, reliable workflows, and customer-focused support.',
};

export const technicalSkills: SkillCategory[] = [
  {
    title: 'IT Support & Troubleshooting',
    items: [
      'Cabling validation and labeling',
      'Speed/duplex checks',
      'IP/DNS/DHCP verification',
      'Connectivity validation',
      'Incident documentation',
      'Escalation readiness',
    ],
  },
  {
    title: 'Networking',
    items: [
      'TCP/IP fundamentals',
      'IPv4 subnetting',
      'Routing & switching fundamentals',
      'Spanning Tree Protocol (STP)',
      'DHCP and DNS',
      'NAT/PAT',
      'WLAN fundamentals',
      'ACL concepts',
    ],
  },
  {
    title: 'Automation & Systems',
    items: [
      'API integrations',
      'Authentication handling',
      'Supabase basics',
      'n8n workflow building',
      'Python scripting',
    ],
  },
  {
    title: 'Languages',
    items: ['Python', 'Java'],
  },
];

export const expandedSkills: ExpandedSkill[] = [
  {
    title: 'No-Code Automation Specialist (n8n, Make)',
    focus: 'Designs and builds automation workflows for business processes.',
    bullets: [
      'Connects tools using incoming/outgoing webhooks and API-based integrations.',
      'Structures workflows for reliability, maintainability, and clear logic.',
    ],
  },
  {
    title: 'Programming Knowledge (Python, Java)',
    focus: 'Understands programming fundamentals and structured problem-solving.',
    bullets: [
      'Creates scripts/utilities to support automations and data handling.',
      'Uses code to solve practical problems with an outcome-first mindset.',
    ],
  },
  {
    title: 'Networking Technician (DHCP, TCP/IP, IPv4, L1–L3)',
    focus: 'Understands connectivity concepts and structured diagnostics.',
    bullets: [
      'DHCP: addressing assignment, renewal, conflicts, and validation.',
      'Layered troubleshooting: L1 physical/link, L2 local/switching, L3 IP/gateway/DNS/DHCP checks.',
    ],
  },
  {
    title: 'Website Builder (Domains, Publishing, Hosting)',
    focus: 'Publishes and hosts websites with front-end structure awareness.',
    bullets: [
      'Manages domains, hosting, and deployment steps.',
      'Assembles and ships UI pages with a clear deployment plan.',
    ],
  },
  {
    title: 'Backend Framework Knowledge (JavaScript, TypeScript, Supabase)',
    focus: 'Connects backend concepts with automation and integration workflows.',
    bullets: [
      'Understands JS/TS backend ecosystem and integration logic.',
      'Uses Supabase as a foundation for data/auth/APIs when applicable.',
    ],
  },
  {
    title: 'Vibe-Coding',
    focus: 'Iterative building mindset for quick prototyping and refinement.',
    bullets: [
      'Prioritizes speed-to-result while keeping clarity and maintainability.',
      'Tests, refines, and ships incremental improvements quickly.',
    ],
  },
];

export const experiences: Experience[] = [
  {
    role: 'Freelance AI Automation Developer',
    organisation: 'Self-employed',
    location: 'Remote',
    period: '2025 – Present',
    bullets: [
      'Designed and deployed automation solutions integrating Supabase, n8n, and OpenAI APIs to connect systems reliably.',
      'Troubleshot authentication, API access, permissions, and integration failures; delivered root-cause fixes and preventative improvements.',
      'Built operational workflows for lead intake, onboarding, and email processing to reduce manual work and improve reliability.',
      'Documented workflows, changes, and expected behaviour to enable support, maintenance, and faster handoffs.',
    ],
  },
  {
    role: 'Networking Labs Assistant',
    organisation: 'Cisco Networking Academy / Personal Labs',
    location: 'Costa Rica',
    period: '2022 – 2025',
    bullets: [
      'Set up and supported LAN and Wi-Fi lab environments (SSID/security, DHCP/static IPs) applying STP to prevent loops.',
      'Performed structured L1/L2/L3 troubleshooting (cabling, duplex/speed, IP/DNS/DHCP) and documented repeatable steps.',
      'Configured and validated ACLs, NAT/PAT, and DHCP while verifying least-privilege access and connectivity outcomes.',
    ],
  },
];

export const education: Education[] = [
  {
    title: 'B.Sc. Systems Engineering (In progress)',
    institution: 'Universidad Fidelitas, Costa Rica',
    period: 'In progress',
  },
  {
    title: 'High School Diploma',
    institution: 'Completed secondary education',
    period: '2024',
  },
];

export const certifications: Certification[] = [
  {
    name: 'Cisco CCNA 1',
    year: 2024,
    description: 'Network architectures, IP addressing, and Ethernet fundamentals.',
  },
  {
    name: 'Cisco CCNA 2',
    year: 2024,
    description: 'Switching, routing, and wireless fundamentals.',
  },
  {
    name: 'Cisco CCNA 3',
    year: 2025,
    description: 'Enterprise networking, security, and automation.',
  },
  {
    name: 'Cisco Networking Essentials',
    year: 2023,
    description: 'Fundamental networking concepts and best practices.',
  },
  {
    name: 'Python Programming',
    year: 2025,
    description: 'Scripting, data structures, and automation fundamentals.',
  },
  {
    name: 'Introduction to IoT (Cisco NetAcad)',
    year: 2025,
    description: 'Foundational concepts in the Internet of Things.',
  },
];
