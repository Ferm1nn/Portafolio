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
  linkedin: 'https://www.linkedin.com/in/fermin-espinoza',
  headline: 'Reliable network support and automation workflows built with clear diagnostics and clean handoffs.',
  summary:
    'Systems engineering and cybersecurity student focused on networking, automation, and structured L1/L2 support. I document repeatable fixes, validate connectivity end to end, and build n8n + Supabase workflows that reduce manual handoffs by [ADD METRIC: time saved].',
};

export const heroMetrics: Metric[] = [
  { label: 'Years of labs', value: 3, suffix: '+' },
  { label: 'Tools used', value: 12, suffix: '+' },
  { label: 'Workflows delivered', value: 3, suffix: '+' },
];

export const technicalSkills: Capability[] = [
  {
    title: 'IT Support & Troubleshooting',
    summary: 'Reduce incident time with repeatable diagnostics and crisp handoffs.',
    bullets: [
      'Validated cabling, link speed, and duplex settings to isolate L1/L2 faults and restore connectivity.',
      'Verified IP, DNS, and DHCP configuration to remove misconfigurations and stabilize endpoints.',
      'Documented incident steps in runbooks to cut repeat escalations by [ADD METRIC: time saved].',
    ],
    tools: ['Cabling', 'Speed/Duplex', 'IP/DNS/DHCP', 'Incident documentation'],
    proof: 'Reduced troubleshooting time by [ADD METRIC] by documenting repeatable L1/L2 steps.',
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
      'Built n8n workflows with webhooks + Supabase to route leads and trigger follow-ups, cutting manual routing by [ADD METRIC: time saved].',
      'Handled API authentication and error paths to reduce workflow failures by [ADD METRIC: error rate].',
      'Documented automation logic for maintainable handoffs and support coverage.',
    ],
    tools: ['n8n', 'Supabase', 'Webhooks', 'OpenAI API', 'Python'],
    proof: 'Automated lead intake and onboarding to remove [ADD METRIC] manual touches.',
  },
  {
    title: 'Languages',
    summary: 'Script and prototype automation utilities with clear inputs and outputs.',
    bullets: [
      'Wrote Python utilities to parse data and support automation steps.',
      'Used Java fundamentals to model logic and validate structured workflows.',
      'Produced small tooling scripts to reduce repetitive work by [ADD METRIC: time saved].',
    ],
    tools: ['Python', 'Java'],
    proof: 'Built scripting utilities to speed up data handling by [ADD METRIC: time saved].',
  },
];

export const expandedSkills: Capability[] = [
  {
    title: 'No-Code Automation Specialist (n8n, Make)',
    summary: 'Designs and builds automation workflows for business processes.',
    bullets: [
      'Connected tools using webhooks and API-based integrations for dependable data flow.',
      'Structured workflows for reliability, maintainability, and clear logic paths.',
      'Delivered automation handoffs that reduce manual follow-ups by [ADD METRIC: time saved].',
    ],
    tools: ['n8n', 'Make', 'Webhooks', 'APIs'],
    proof: 'Built workflow templates that reduce setup time by [ADD METRIC].',
  },
  {
    title: 'Programming Knowledge (Python, Java)',
    summary: 'Understands programming fundamentals and structured problem-solving.',
    bullets: [
      'Created scripts to support automations and data handling with clean inputs/outputs.',
      'Applied structured logic to build maintainable utilities for daily workflows.',
      'Validated edge cases to reduce runtime errors by [ADD METRIC].',
    ],
    tools: ['Python', 'Java'],
    proof: 'Used scripting to reduce manual data prep by [ADD METRIC: time saved].',
  },
  {
    title: 'Networking Technician (DHCP, TCP/IP, IPv4, L1-L3)',
    summary: 'Understands connectivity concepts and structured diagnostics.',
    bullets: [
      'Validated DHCP addressing, renewals, and conflicts to restore endpoint connectivity.',
      'Performed layered troubleshooting across L1, L2, and L3 to isolate root causes.',
      'Verified gateway, DNS, and routing paths to maintain reachability.',
    ],
    tools: ['DHCP', 'TCP/IP', 'IPv4', 'L1-L3 troubleshooting'],
    proof: 'Improved lab connectivity reliability by [ADD METRIC: uptime].',
  },
  {
    title: 'Website Builder (Domains, Publishing, Hosting)',
    summary: 'Publishes and hosts websites with front-end structure awareness.',
    bullets: [
      'Managed domains, hosting, and deployment steps for reliable publishing.',
      'Assembled UI pages with structured content and deployment plans.',
      'Reduced launch delays by [ADD METRIC: time saved] through repeatable checklists.',
    ],
    tools: ['Domains', 'Hosting', 'Publishing'],
    proof: 'Shipped front-end pages with predictable deployment steps.',
  },
  {
    title: 'Backend Framework Knowledge (JavaScript, TypeScript, Supabase)',
    summary: 'Connects backend concepts with automation and integration workflows.',
    bullets: [
      'Mapped JS/TS backend concepts to automation triggers and data flows.',
      'Used Supabase for data, auth, and API structure when applicable.',
      'Reduced integration setup time by [ADD METRIC: time saved].',
    ],
    tools: ['JavaScript', 'TypeScript', 'Supabase'],
    proof: 'Connected backend logic to automation flows with clean data contracts.',
  },
  {
    title: 'Vibe-Coding',
    summary: 'Iterative building mindset for rapid prototyping and refinement.',
    bullets: [
      'Prioritized speed to results while keeping clarity and maintainability.',
      'Tested and refined automation steps quickly with feedback loops.',
      'Shipped iterative improvements that reduce rework by [ADD METRIC].',
    ],
    tools: ['Rapid prototyping', 'Iteration'],
    proof: 'Delivered fast prototypes that informed final workflows.',
  },
];

export const experiences: Experience[] = [
  {
    role: 'Freelance AI Automation Developer',
    organisation: 'Self-employed',
    location: 'Remote',
    period: '2025 - Present',
    context: 'Remote client delivery for automation and integrations.',
    bullets: [
      'Built n8n + Supabase automation pipelines to connect lead intake and onboarding, cutting manual routing by [ADD METRIC: time saved].',
      'Debugged auth and API failures across Supabase and OpenAI integrations to restore workflow reliability by [ADD METRIC].',
      'Documented workflow logic and change logs to reduce repeat tickets by [ADD METRIC].',
    ],
    tools: ['n8n', 'Supabase', 'OpenAI API', 'Webhooks', 'Python'],
    shipped: ['Lead intake workflow', 'Onboarding automation', 'Email processing pipeline'],
  },
  {
    role: 'Networking Labs Assistant',
    organisation: 'Cisco Networking Academy / Personal Labs',
    location: 'Costa Rica',
    period: '2022 - 2025',
    context: 'Cisco NetAcad labs and personal networking practice.',
    bullets: [
      'Configured LAN and Wi-Fi lab topologies with DHCP/static IPs and STP to prevent loops.',
      'Performed L1-L3 troubleshooting (cabling, speed/duplex, IP/DNS/DHCP) and documented repeatable steps.',
      'Validated ACLs and NAT/PAT policies to maintain least-privilege access and reachability.',
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
    topics: ['Networking fundamentals', 'Cybersecurity basics', 'Systems analysis'],
  },
  {
    title: 'High School Diploma',
    institution: 'Completed secondary education',
    period: '2024',
    status: 'Completed',
    enabled: 'Foundation for continued technical study and lab practice.',
    topics: ['General studies', 'Applied research', 'Technical communication'],
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
    status: 'In progress',
  },
  {
    name: 'Introduction to IoT (Cisco NetAcad)',
    year: 2025,
    description: 'Foundational concepts in the Internet of Things.',
    status: 'In progress',
  },
];

export const projects: Project[] = [
  {
    title: 'Lead Intake Automation',
    problem: 'Manual lead routing and delayed follow-ups across channels.',
    solution: 'Webhook-driven workflow that captures leads, writes to Supabase, and triggers follow-up tasks.',
    stack: ['n8n', 'Supabase', 'OpenAI API', 'Webhooks'],
    outcome: 'Reduced response time by [ADD METRIC: time saved].',
    links: [{ label: '[ADD LINK: project]', href: '#' }],
  },
  {
    title: 'Lab Network Validation Runbook',
    problem: 'Inconsistent troubleshooting steps across lab sessions.',
    solution: 'Structured L1-L3 checklist with validation steps for DHCP, DNS, and routing.',
    stack: ['TCP/IP', 'DHCP/DNS', 'STP', 'NAT/PAT'],
    outcome: 'Improved lab resolution speed by [ADD METRIC: time saved].',
    links: [{ label: '[ADD LINK: runbook]', href: '#' }],
  },
  {
    title: 'Email Processing Workflow',
    problem: 'Manual inbox triage and delayed response routing.',
    solution: 'Automated tagging and routing workflow with enrichment steps.',
    stack: ['n8n', 'Supabase', 'OpenAI API'],
    outcome: 'Reduced manual triage effort by [ADD METRIC: time saved].',
    links: [{ label: '[ADD LINK: workflow]', href: '#' }],
  },
];
