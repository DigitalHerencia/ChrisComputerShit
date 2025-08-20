import { Octokit } from '@octokit/rest'

interface Label {
  name: string
  color: string
  description: string
}

interface Milestone {
  title: string
  description: string
}

interface Issue {
  title: string
  description: string
  labels: string[]
  milestone: string
  priority: 'High' | 'Medium' | 'Low'
  dependencies?: string
}

const token = process.env.GITHUB_TOKEN
const owner = process.env.REPO_OWNER
const repo = process.env.REPO_NAME

if (!token || !owner || !repo) {
  throw new Error('GITHUB_TOKEN, REPO_OWNER, and REPO_NAME env vars are required')
}

const octokit = new Octokit({ auth: token })

const projectName = 'MVP Roadmap'
const projectColumns = ['Backlog', 'In Progress', 'Blocked', 'Code Review', 'QA', 'Done']

const labels: Label[] = [
  { name: 'feature', color: '1D76DB', description: 'A new feature or enhancement request.' },
  { name: 'bug', color: 'D73A4A', description: 'A defect or error that needs to be fixed.' },
  { name: 'infra', color: '006B75', description: 'Infrastructure and devOps tasks.' },
  { name: 'auth', color: '0E8A16', description: 'Issues related to authentication or authorization.' },
  { name: 'design', color: 'A2EEEF', description: 'UI/UX design tasks or visual improvements.' },
  { name: 'ux', color: 'C5DEF5', description: 'User experience improvements and usability.' },
  { name: 'security', color: 'E99695', description: 'Security-related tasks.' },
  { name: 'performance', color: 'BFD4F2', description: 'Performance optimization tasks.' },
  { name: 'database', color: 'F9D0C4', description: 'Database and data model related tasks.' },
  { name: 'tests', color: '5319E7', description: 'Adding or fixing tests.' },
  { name: 'documentation', color: 'FFD78A', description: 'Documentation work.' },
  { name: 'priority: high', color: 'B60205', description: 'High priority' },
  { name: 'priority: medium', color: 'FBCA04', description: 'Medium priority' },
  { name: 'priority: low', color: '0E8A16', description: 'Low priority' },
]

const milestones: Milestone[] = [
  { title: 'Core MVP (v0.1.0)', description: 'Foundation of the app with core features.' },
  { title: 'Timesheets & Daily Logs (v0.2.0)', description: 'Expand time tracking and daily logging features.' },
  { title: 'Procurement (v0.3.0)', description: 'Introduce procurement and cost-tracking features.' },
  { title: 'Phase 2 Enhancements (v0.4.0+)', description: 'Post-MVP improvements and advanced features.' },
]

const issues: Issue[] = [
  {
    title: 'Initialize Next.js 15 Project and Repository',
    description:
      'Set up a new Next.js 15 app with TypeScript, Tailwind CSS 4.x, shadcn UI library, Prettier, ESLint, and TypeScript strict mode. Verify dev server runs and commit base project structure.',
    labels: ['infra', 'design', 'feature', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Set up Neon PostgreSQL Database & Prisma Schema',
    description:
      'Provision a Neon Postgres database and connect via Prisma. Define initial data model and run migrations. Configure environment variables for database connection.',
    labels: ['infra', 'database', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Integrate Clerk for User Authentication',
    description:
      'Configure Clerk SDK with Next.js, set up providers, and protect routes. Sync Clerk user ID with database on first login.',
    labels: ['feature', 'auth', 'security', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Project Creation & Listing',
    description:
      'Create UI to add new projects and list user projects. Save project records linked to creator and optional client entity.',
    labels: ['feature', 'database', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Project Dashboard Page (Job Overview)',
    description:
      'Develop project dashboard showing project details and recent activity. Ensure mobile-friendly design using Tailwind.',
    labels: ['feature', 'ux', 'design', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Daily Log Creation Form (with Photo Upload)',
    description:
      'Build a form for daily log entries including date, weather, crew count, notes, and photo attachments with validation via Zod.',
    labels: ['feature', 'database', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Photo Uploads for Daily Logs',
    description:
      'Enable uploading of photos for daily logs using storage solution and save metadata to LogPhoto table.',
    labels: ['feature', 'infra', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Daily Logs List & Detail View',
    description:
      'List all daily logs for a project with summary info and detail view including photo gallery, ordered by date.',
    labels: ['feature', 'ux', 'priority: medium'],
    milestone: 'Timesheets & Daily Logs (v0.2.0)',
    priority: 'Medium',
  },
  {
    title: 'Implement Timesheet Entry Form',
    description:
      'Create form to log hours worked with date, hours, overtime, and description. Validate and save to TimeEntry table.',
    labels: ['feature', 'database', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Timesheet List and Summary',
    description:
      'Provide view to list timesheet entries and allow supervisors to approve hours, including summary calculations.',
    labels: ['feature', 'ux', 'auth', 'priority: medium'],
    milestone: 'Timesheets & Daily Logs (v0.2.0)',
    priority: 'Medium',
  },
  {
    title: 'Implement Task Creation (To-Do) Feature',
    description:
      'Add form to create tasks with title, description, due date, priority level, and optional assignee.',
    labels: ['feature', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Task List & Status Updates',
    description:
      'Provide task list view with ability to update status and edit details, ordered by due date or priority.',
    labels: ['feature', 'ux', 'priority: medium'],
    milestone: 'Timesheets & Daily Logs (v0.2.0)',
    priority: 'Medium',
  },
  {
    title: 'Implement Contacts Directory (Clients/Vendors/Burrito Trucks)',
    description:
      'Create contacts directory managing clients, vendors, contractors, and burrito trucks using Entity model.',
    labels: ['feature', 'database', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Document Upload & Management',
    description:
      'Allow uploading and listing of project documents with metadata and storage integration.',
    labels: ['feature', 'infra', 'priority: medium'],
    milestone: 'Timesheets & Daily Logs (v0.2.0)',
    priority: 'Medium',
  },
  {
    title: 'Ensure Mobile-First Responsive UI (Tailwind + shadcn Components)',
    description:
      'Polish UI for mobile-first usage ensuring responsiveness and consistent styling across pages.',
    labels: ['design', 'ux', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Implement Form Validation & Error Handling with Zod',
    description:
      'Integrate Zod schemas for validating all form inputs and provide user-friendly error messages.',
    labels: ['feature', 'security', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Set Up Testing Framework (Unit & Basic Integration Tests)',
    description:
      'Configure testing environment (Vitest or Jest) and write sample tests for critical utilities or components.',
    labels: ['infra', 'tests', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Enforce Code Quality: ESLint, Prettier, and TypeScript Strict',
    description:
      'Ensure robust ESLint and Prettier configs with TypeScript strict mode enabled and npm scripts for linting.',
    labels: ['infra', 'security', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Set Up CI/CD Pipeline (GitHub Actions & Vercel Deployment)',
    description:
      'Configure GitHub Actions for lint, test, and build, and connect repository to Vercel for deployments.',
    labels: ['infra', 'feature', 'priority: high'],
    milestone: 'Core MVP (v0.1.0)',
    priority: 'High',
  },
  {
    title: 'Documentation & Usage Guides',
    description:
      'Write documentation for developers and end users, including README updates and usage guides.',
    labels: ['documentation', 'priority: medium'],
    milestone: 'Timesheets & Daily Logs (v0.2.0)',
    priority: 'Medium',
  },
  {
    title: 'Implement Purchase Orders Management (Procurement)',
    description:
      'Add purchase order feature with vendor selection, items, and status tracking tied to contacts and documents.',
    labels: ['feature', 'database', 'priority: low'],
    milestone: 'Procurement (v0.3.0)',
    priority: 'Low',
  },
  {
    title: 'Role-Based Access Control & Dashboards',
    description:
      'Implement role-based permission system adjusting UI and restricting actions based on user roles.',
    labels: ['auth', 'security', 'feature', 'priority: low'],
    milestone: 'Phase 2 Enhancements (v0.4.0+)',
    priority: 'Low',
  },
  {
    title: 'Offline Support (Progressive Web App Enhancements)',
    description:
      'Enhance application with offline capabilities using caching strategies and service workers.',
    labels: ['feature', 'performance', 'priority: low'],
    milestone: 'Phase 2 Enhancements (v0.4.0+)',
    priority: 'Low',
  },
  {
    title: 'Notifications & Scheduled Digests',
    description:
      'Implement notification system for key events, including daily digest emails or in-app notifications.',
    labels: ['feature', 'infra', 'priority: low'],
    milestone: 'Phase 2 Enhancements (v0.4.0+)',
    priority: 'Low',
  },
  {
    title: 'OCR and PDF Export for Receipts',
    description:
      'Use OCR on uploaded photos of receipts and implement PDF export for logs or timesheets.',
    labels: ['feature', 'performance', 'priority: low'],
    milestone: 'Phase 2 Enhancements (v0.4.0+)',
    priority: 'Low',
  },
]

async function ensureLabels() {
  for (const l of labels) {
    try {
      await octokit.issues.getLabel({ owner, repo, name: l.name })
    } catch {
      await octokit.issues.createLabel({ owner, repo, name: l.name, color: l.color, description: l.description })
    }
  }
}

async function ensureMilestones() {
  const existing = await octokit.issues.listMilestones({ owner, repo, state: 'all', per_page: 100 })
  const map: Record<string, number> = {}
  for (const m of milestones) {
    const found = existing.data.find((mi) => mi.title === m.title)
    if (found) {
      map[m.title] = found.number
    } else {
      const created = await octokit.issues.createMilestone({ owner, repo, title: m.title, description: m.description })
      map[m.title] = created.data.number
    }
  }
  return map
}

async function ensureProject() {
  const existing = await octokit.projects.listForRepo({ owner, repo })
  let project = existing.data.find((p) => p.name === projectName)
  if (!project) {
    const created = await octokit.projects.createForRepo({ owner, repo, name: projectName, body: 'Auto-generated MVP project board.' })
    project = created.data
  }
  return project
}

async function ensureColumns(projectId: number) {
  const existing = await octokit.projects.listColumns({ project_id: projectId })
  const map: Record<string, number> = {}
  for (const colName of projectColumns) {
    const found = existing.data.find((c) => c.name === colName)
    if (found) {
      map[colName] = found.id
    } else {
      const created = await octokit.projects.createColumn({ project_id: projectId, name: colName })
      map[colName] = created.data.id
    }
  }
  return map
}

async function createIssues(milestoneMap: Record<string, number>, columnMap: Record<string, number>) {
  for (const issue of issues) {
    const { data } = await octokit.issues.create({
      owner,
      repo,
      title: issue.title,
      body: `**Description**\n${issue.description}\n\n**Priority:** ${issue.priority}\n\n**Dependencies:** ${issue.dependencies ?? 'None'}\n`,
      labels: issue.labels,
      milestone: milestoneMap[issue.milestone],
    })

    await octokit.projects.createCard({
      column_id: columnMap['Backlog'],
      content_id: data.id,
      content_type: 'Issue',
    })

    await octokit.issues.createComment({
      owner,
      repo,
      issue_number: data.number,
      body: 'Codex agents: please complete this task according to the issue description.',
    })
  }
}

async function main() {
  await ensureLabels()
  const milestoneMap = await ensureMilestones()
  const project = await ensureProject()
  const columnMap = await ensureColumns(project.id)
  await createIssues(milestoneMap, columnMap)
  console.log('Bootstrap complete')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
