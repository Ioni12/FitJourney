# Software Development Lifecycle (SDLC) & Agile Workflow

This document illustrates the Agile workflows and processes utilized by the FitJourney team to manage tickets, code, and deployment.

## 1. Issue Tracking Lifecycle (Kanban/Scrum Board)

How a feature moves from an idea to production.

```mermaid
stateDiagram-v2
    [*] --> Backlog: Feature Request Opened
    Backlog --> SelectedForDevelopment: Sprint Planning
    SelectedForDevelopment --> InProgress: Developer Assigned
    InProgress --> CodeReview: Pull Request Opened
    CodeReview --> InProgress: Changes Requested
    CodeReview --> QualityAssurance: PR Approved & Merged
    QualityAssurance --> InProgress: Bug Found
    QualityAssurance --> Done: Testing Passed
    Done --> [*]
```

## 2. Git Branching Strategy (GitHub Flow)

How code is integrated into the source repository.

```mermaid
gitGraph
    commit id: "Initial Commit"
    branch feature/user-login
    checkout feature/user-login
    commit id: "Add login form"
    commit id: "Add JWT auth"
    checkout main
    merge feature/user-login id: "PR #1: User Login" type: HIGHLIGHT
    branch bugfix/auth-crash
    checkout bugfix/auth-crash
    commit id: "Fix crash on invalid token"
    checkout main
    merge bugfix/auth-crash id: "PR #2: Fix Auth" type: HIGHLIGHT
    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Add activity charts"
    checkout main
    merge feature/dashboard id: "PR #3: Dashboard" type: HIGHLIGHT
```

## 3. CI/CD Pipeline Flow

How code reaches the server automatically.

```mermaid
flowchart LR
    A[Developer Pushes to GitHub] --> B(GitHub Actions Triggered)
    B --> C{Lint & Tests Pass?}
    C -->|No| D[Notify Developer: Failed]
    C -->|Yes| E[Build Production Bundle]
    E --> F[Deploy to Server/Vercel]
    F --> G[Live Environment Updated]
```
