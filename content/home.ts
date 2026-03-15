export type HeroContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  featureCards: { title: string; subtitle: string; body: string }[];
};

export type LogosContent = {
  title: string;
  subtitle: string;
  logos: string[];
};

export type FeaturesContent = {
  title: string;
  intro: string;
  items: { title: string; body: string }[];
};

export type MetricsContent = {
  title: string;
  blurb: string;
  stats: { label: string; value: string }[];
  snapshot: string[];
};

export type PricingContent = {
  title: string;
  blurb: string;
  ctas: { sales: { label: string; href: string }; terms: { label: string; href: string } };
  plans: { name: string; price: string; desc: string; features: string[]; cta: { label: string; href: string } }[];
};

export type SecurityContent = {
  title: string;
  blurb: string;
  checklist: string[];
  badges: string[];
  cta: { label: string; href: string };
};

export type DocsSupportContent = {
  title: string;
  blurb: string;
  links: { label: string; link: string }[];
  supportBullets: string[];
  supportBadge: string;
  supportCta: { label: string; href: string };
};

export type LegalContent = {
  title: string;
  blurb: string;
  docs: { label: string; link: string; tag?: string }[];
  corporate: string[];
  note: string;
};

export type CtaContent = {
  title: string;
  blurb: string;
  productLinks: { label: string; href: string }[];
  resourceLinks: { label: string; href: string }[];
  footer: string;
};

export type HomeContent = {
  hero: HeroContent;
  logos: LogosContent;
  features: FeaturesContent;
  metrics: MetricsContent;
  pricing: PricingContent;
  security: SecurityContent;
  docs: DocsSupportContent;
  legal: LegalContent;
  cta: CtaContent;
};

export const defaultHomeContent: HomeContent = {
  hero: {
    eyebrow: "Welcome to ClientFlow",
    title: "The all-in-one portal for your agency clients and projects.",
    subtitle:
      "Manage clients, track projects, and centralize invoicing in a single, secure workspace. Empower your team and streamline agency delivery.",
    primaryCta: { label: "Start Managing Clients", href: "/auth#signup" },
    secondaryCta: { label: "See features", href: "#features" },
    featureCards: [
      { title: "Clients CRM", subtitle: "Know your clients", body: "Centralized management for all client details, contacts, and notes, safely separated by team." },
      { title: "Project Tracker", subtitle: "Plan & execute", body: "Track client projects, deadlines, milestones, and team responsibilities in one place." },
      { title: "Invoicing Made Simple", subtitle: "Get paid, clearly", body: "Draft, send, and track invoice status—keep your agency finances organized and visible." },
      { title: "Team & Activity", subtitle: "Collaborate smoothly", body: "Assign work, track milestones, and see an audit history of who did what for key actions." },
    ],
  },
  logos: {
    title: "Trusted by agencies",
    subtitle: "ClientFlow powers top creative, marketing, and consulting agencies",
    logos: ["WPP", "Ogilvy", "Havas", "McKinsey", "Bain", "Deloitte", "Fiverr Pro", "Upwork", "Accenture", "Sapient"],
  },
  features: {
    title: "Your agency operations made simple",
    intro: "Everything you need to run your agency—purpose-built for fast-moving teams.",
    items: [
      { title: "Client Management", body: "Store, search, and filter your entire book of business, with billing and contacts all in one place." },
      { title: "Project Board", body: "Visualize project status, deadlines, budget, and contributors easily." },
      { title: "Invoicing", body: "Automate invoice creation, status, and totals for every client and project." },
      { title: "Team Collaboration", body: "Assign team members, manage roles, and keep everyone informed." },
      { title: "Reporting", body: "Track agency health with built-in reporting widgets and customizable views." },
      { title: "Audit Trail", body: "Key actions and changes are auto-logged for accountability and transparency." },
    ],
  },
  metrics: {
    title: "Clear insights for busy agencies",
    blurb: "Jumpstart your team with actionable reports—see urgency, payments, and overdue work at a glance.",
    stats: [
      { label: "Clients managed", value: "100+" },
      { label: "Active projects", value: "250+" },
      { label: "Invoices sent", value: "500+" },
      { label: "Audit events", value: "5,000+" },
    ],
    snapshot: [
      "Client & Project separation: no data leaks",
      "Invoice tracker with status highlights",
      "Milestone and task tracking on every project",
      "Permissions at the team and project level",
      "Accessible, modern interface — mobile and desktop",
    ],
  },
  pricing: {
    title: "Flexible pricing for every agency",
    blurb: "Start free and pay as your book of clients and work grows. Always accessible and secure.",
    ctas: {
      sales: { label: "Talk to sales", href: "mailto:hi@chirag.co" },
      terms: { label: "Review terms", href: "#legal" },
    },
    plans: [
      {
        name: "Starter",
        price: "$0",
        desc: "Perfect for indie consultants and small teams.",
        features: ["Up to 3 teammates", "Email support", "Client/project/invoice core flows"],
        cta: { label: "Start now", href: "/auth#signup" },
      },
      {
        name: "Agency Pro",
        price: "$49",
        desc: "For established agencies and those scaling up.",
        features: ["Unlimited teammates", "Advanced audits", "Priority support"],
        cta: { label: "Upgrade now", href: "/auth#signup" },
      },
      {
        name: "Enterprise",
        price: "Custom",
        desc: "Best for distributed and enterprise agencies.",
        features: ["Custom integrations", "Vendor compliance", "Dedicated onboarding"],
        cta: { label: "Book a demo", href: "/auth#signup" },
      },
    ],
  },
  security: {
    title: "Security first, always",
    blurb: "Enterprise-grade access controls, audit logs, and encryption—ClientFlow protects your work.",
    checklist: [
      "Team and project-level permissions",
      "Strong password and session policies",
      "Audit logging and change tracking",
      "Data isolation for every agency workspace",
    ],
    badges: ["SOC2", "GDPR", "ISO 27001", "PCI Ready", "CCPA"],
    cta: { label: "Email for security overview", href: "mailto:hi@chirag.co" },
  },
  docs: {
    title: "Human support, always-on docs",
    blurb: "Quickstart guides, how-tos, and support from folks who know agencies.",
    links: [
      { label: "API reference", link: "https://nextjs.org/docs" },
      { label: "How-to guides", link: "https://vercel.com/changelog" },
      { label: "Status page", link: "https://status.example.com" },
      { label: "Demo request", link: "https://vercel.com/templates" },
    ],
    supportBullets: [
      "Dedicated onboarding session free for new agencies",
      "US and EU data centers on demand",
      "Regular security training for support staff",
      "Contract amendments possible for custom needs",
    ],
    supportBadge: "24/7 included",
    supportCta: { label: "Contact us", href: "mailto:hi@chirag.co" },
  },
  legal: {
    title: "Agency-friendly terms",
    blurb: "We keep legal clear and up front—compliance starters, agency contracts, and more.",
    docs: [
      { label: "Master Service Agreement", link: "https://example.com/msa", tag: "PDF" },
      { label: "Data Processing Addendum", link: "https://example.com/dpa", tag: "PDF" },
      { label: "Privacy Policy", link: "https://example.com/privacy", tag: "PDF" },
      { label: "Acceptable Use", link: "https://example.com/aup", tag: "PDF" },
    ],
    corporate: [
      "HQ: Mumbai, IN • Remote first",
      "Agency onboarding — zero setup fees for new clients",
      "Detailed onboarding and support documentation",
      "Production SLAs for paid plans",
      "Accessibility statement aligned to WCAG 2.1 AA",
    ],
    note: "Need a custom clause? Email hi@chirag.co and we'll review it together.",
  },
  cta: {
    title: "Modern agency ops, made easy.",
    blurb: "Centralize your client work, delight your team, and keep growth in reach—all with ClientFlow.",
    productLinks: [
      { label: "Docs", href: "https://nextjs.org/docs" },
      { label: "Features", href: "#features" },
      { label: "Templates", href: "https://vercel.com/templates" },
    ],
    resourceLinks: [
      { label: "Changelog", href: "https://vercel.com/changelog" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "Support", href: "mailto:hi@chirag.co" },
    ],
    footer: "Built with ClientFlow • MIT licensed • For agencies, by agencies",
  },
};

// Helper for future overrides (e.g., reading JSON from env or file)
export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}