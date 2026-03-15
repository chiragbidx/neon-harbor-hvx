# Changelog
<!--
  Purpose:
  - Track project change history over time.
  - Record date, summary, and key files touched for each change set.
  - Keep entries append-only (do not delete past entries).
-->

## 2024-06-09

- Expanded Drizzle schema to add ClientFlow agency modules: clients, projects, project_team_members, invoices, invoice_line_items, tasks, milestones, activity_logs
- Rebranded all public landing and dashboard UI to "ClientFlow" (nav, hero, content, metadata)
- Updated landing content for agency-centric copy and CTAs ("Start Managing Clients" etc.)
- Updated dashboard sidebar for agency operations: Clients, Projects, Invoices, Tasks
- Set up migration reminder and added to migration journal
- Implemented full end-to-end CRUD pages, detail pages, and Zod-validated server actions for clients, projects, invoices, and tasks, all team-scoped and multi-tenant safe
- Added empty states, status badges, and branded headings everywhere (ClientFlow)
- Activity log list shipped (project view)
- All flows checked for auth safety and secured by current session/team

**Files touched:**
- lib/db/schema.ts
- drizzle/0001_clientflow_entity_tables.sql
- drizzle/meta/_journal.json
- components/dashboard/sidebar-nav.tsx
- components/home/LayoutHeroSection.tsx
- components/layout/navbar.tsx
- content/home.ts
- app/page.tsx
- app/dashboard/clients/page.tsx
- app/dashboard/clients/actions.tsx
- app/dashboard/projects/page.tsx
- app/dashboard/projects/actions.tsx
- app/dashboard/tasks/page.tsx
- app/dashboard/tasks/actions.tsx
- app/dashboard/invoices/page.tsx
- app/dashboard/invoices/actions.tsx
- app/dashboard/clients/[clientId]/page.tsx
- app/dashboard/clients/[clientId]/actions.tsx
- app/dashboard/projects/[projectId]/page.tsx
- app/dashboard/projects/[projectId]/actions.tsx
- app/dashboard/invoices/[invoiceId]/page.tsx
- app/dashboard/invoices/[invoiceId]/actions.tsx
- app/dashboard/tasks/[taskId]/page.tsx
- app/dashboard/tasks/[taskId]/actions.tsx
- app/dashboard/projects/[projectId]/activity-log.tsx
- CHANGELOG.md