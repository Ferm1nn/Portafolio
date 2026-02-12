import { SiPython, SiCisco, SiLinux, SiN8N, SiReact, SiMongodb, SiDocker, SiWireshark } from '../components/icons/BrandIcons';
import { Network, Bot, Activity, type LucideIcon } from 'lucide-react';
import type { ComponentType } from 'react';

// ─── Tech Stack Marquee Data ────────────────────────────────────

export interface TechStackItem {
    name: string;
    icon: ComponentType<{ className?: string; size?: number }>;
    color: string;
}

export const TECH_STACK: TechStackItem[] = [
    { name: 'Python', icon: SiPython, color: 'group-hover:text-[#3776AB]' },
    { name: 'Networking', icon: SiCisco, color: 'group-hover:text-[#1BA0D7]' },
    { name: 'Linux', icon: SiLinux, color: 'group-hover:text-white' },
    { name: 'n8n', icon: SiN8N, color: 'group-hover:text-[#EA4B71]' },
    { name: 'React', icon: SiReact, color: 'group-hover:text-[#61DAFB]' },
    { name: 'MongoDB', icon: SiMongodb, color: 'group-hover:text-[#47A248]' },
    { name: 'Docker', icon: SiDocker, color: 'group-hover:text-[#2496ED]' },
    { name: 'Wireshark', icon: SiWireshark, color: 'group-hover:text-[#1679A7]' },
];

// ─── Service Pillar Card Data ───────────────────────────────────

export interface HighlightCard {
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
    border: string;
}

export const HIGHLIGHT_CARDS: HighlightCard[] = [
    {
        title: 'Network Architecture',
        desc: 'L1-L3 Support & Topology Design.',
        icon: Network,
        color: 'text-cyan-400',
        border: 'border-cyan-500/30',
    },
    {
        title: 'Process Automation',
        desc: 'Python & n8n Workflow Orchestration.',
        icon: Bot,
        color: 'text-violet-400',
        border: 'border-violet-500/30',
    },
    {
        title: 'System Visibility',
        desc: 'Real-time Dashboards & Monitoring.',
        icon: Activity,
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
    },
];

// ─── Skills Page: Radar Proficiency Data ────────────────────────

export interface SkillProficiency {
    title: string;
    level: number;
}

export const SKILL_PROFICIENCIES: SkillProficiency[] = [
    { title: 'Networking', level: 85 },
    { title: 'IT Support', level: 90 },
    { title: 'AI Automation', level: 80 },
    { title: 'Python', level: 70 },
    { title: 'Cybersecurity', level: 78 },
    { title: 'Linux', level: 72 },
];

export const FOCUS_AREAS: string[] = [
    'Network Support Technician',
    'Cybersecurity',
    'Automations',
];
