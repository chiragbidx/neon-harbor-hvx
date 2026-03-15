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

**Files touched:**
- lib/db/schema.ts
- drizzle/0001_clientflow_entity_tables.sql
- drizzle/meta/_journal.json
- components/dashboard/sidebar-nav.tsx
- components/home/LayoutHeroSection.tsx
- components/layout/navbar.tsx
- content/home.ts
- app/page.tsx
- CHANGELOG.md