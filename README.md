# Portfolio Manager

A **Personal Portfolio Management System** that automatically manages your portfolio projects and redeploys to Vercel whenever you make changes.

## 🎯 System Goals

- **Never manually edit code** to add/remove projects
- **Dashboard** for easy project management (Add, Edit, Delete)
- **Auto-commit** changes to GitHub
- **Auto-deploy** via Vercel on every change

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER                                  │
├──────────────────────────┬──────────────────────────────────┤
│   Dashboard (/dashboard) │      Portfolio (/)               │
│   • Add/Edit/Delete      │      • Display projects          │
└───────────┬──────────────┴──────────────────────────────────┘
            │ API Calls
            ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js API Routes (/api/projects)             │
│              • Validation • CRUD Operations                  │
└───────────┬─────────────────────────────────────────────────┘
            │ GitHub API (Octokit)
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                         │
│              data/projects.json (Source of Truth)           │
└───────────┬─────────────────────────────────────────────────┘
            │ Webhook
            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Vercel                               │
│              Auto-deploys on every commit                    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
Portfolio Manager/
├── data/
│   └── projects.json          # All project data (source of truth)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Portfolio home page
│   │   ├── api/projects/      # API endpoints
│   │   └── dashboard/
│   │       ├── page.tsx       # Dashboard (list projects)
│   │       ├── new/           # Add new project
│   │       └── edit/[id]/     # Edit project
│   ├── components/
│   │   ├── ProjectCard.tsx    # Portfolio display card
│   │   ├── ProjectForm.tsx    # Add/Edit form
│   │   ├── DashboardCard.tsx  # Dashboard project card
│   │   └── DeleteModal.tsx    # Delete confirmation
│   └── lib/
│       ├── types.ts           # TypeScript interfaces
│       ├── projects.ts        # Local file utilities
│       ├── github.ts          # GitHub API integration
│       └── validation.ts      # Form validation
└── .env.example               # Environment template
```

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd portfolio-manager
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_portfolio_repo
```

### 3. Create GitHub Token

1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select `repo` scope (full control of repositories)
4. Copy the token to your `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

- Portfolio: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Add new project |
| PUT | `/api/projects` | Update project |
| DELETE | `/api/projects?id=xxx` | Delete project |

## 📦 Project Data Model

```typescript
interface Project {
  id: string;           // Auto-generated (timestamp)
  title: string;        // Project name (3-100 chars)
  overview: string;     // Description (10-500 chars)
  features: string[];   // List of features (min 1)
  techStack: string[];  // Technologies used (min 1)
  githubLink: string;   // GitHub repo URL
  documentation?: string; // Optional docs
  createdAt: string;    // ISO timestamp
}
```

## 🔒 Security Notes

- The dashboard has no authentication (admin-only access assumed)
- Never expose `GITHUB_TOKEN` in client-side code
- API routes only run on the server
- Delete requires typing project name to confirm

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Vercel will automatically redeploy whenever you commit changes through the dashboard.

## 📝 How It Works

1. **Add Project**: Fill form → API validates → Commit to GitHub → Vercel deploys
2. **Edit Project**: Update form → API merges changes → Commit → Redeploy
3. **Delete Project**: Confirm by typing name → API removes → Commit → Redeploy

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **GitHub API**: Octokit
- **Hosting**: Vercel

## 📄 License

MIT
