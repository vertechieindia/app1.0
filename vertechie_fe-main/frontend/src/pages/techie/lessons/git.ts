/**
 * Git Tutorial - Lesson content for each lesson slug
 */
export const generateGitLessonContent = (lessonSlug: string) => {
  const gitLessons: Record<string, { title: string; content: string; tryItCode: string }> = {
    home: {
      title: 'Git Tutorial',
      content: `
# Welcome to Git Tutorial

Git is a **distributed version control system** for tracking changes in your code.

## What is Version Control?

- Track **every change** to your files over time
- **Revert** to any previous state
- **Branch** to try ideas without affecting the main code
- **Collaborate** with others on the same project

## Why Git?

- **Free and open source**
- **Fast** and efficient
- **Distributed** – every clone is a full backup
- **Industry standard** – used by millions of developers
- Works with **GitHub**, **GitLab**, **Bitbucket**, etc.

## What You'll Learn

- Installing and configuring Git
- **init**, **add**, **commit** – basic workflow
- **push** / **pull** – sync with a remote (e.g. GitHub)
- **branch** and **merge** – work on features safely
- Resolving **conflicts**
      `,
      tryItCode: `# Git is used in the terminal (no "try it" in browser)
# After installing Git, run:

git --version
git config --global user.name "Your Name"
git config --global user.email "you@example.com"`,
    },
    intro: {
      title: 'Git Intro',
      content: `
# What is Git?

Git was created by **Linus Torvalds** in 2005 for Linux kernel development.

## Key Concepts

- **Repository (repo)** – A project folder tracked by Git (all history is in \`.git\`)
- **Commit** – A snapshot of your project at a point in time
- **Branch** – A parallel line of development (e.g. \`main\`, \`feature/login\`)
- **Remote** – A copy of the repo on a server (e.g. GitHub)
- **Clone** – Download a repo; **Pull** – get latest; **Push** – send your commits

## Distributed vs Centralized

- **Centralized** (e.g. old SVN): one server; everyone commits to it
- **Distributed** (Git): every clone has full history; you push/pull to sync

## Basic Workflow

1. \`git init\` or \`git clone\` – start a repo
2. Edit files → \`git add\` → \`git commit\`
3. \`git push\` to send, \`git pull\` to get updates
      `,
      tryItCode: `# Check if Git is installed
git --version

# See Git help
git help
git status --help`,
    },
    install: {
      title: 'Git Install',
      content: `
# Installing Git

## Windows

- Download from [git-scm.com](https://git-scm.com)
- Or: \`winget install Git.Git\`
- Use **Git Bash** or **PowerShell** for the terminal

## macOS

<pre><code class="bash">
# Option 1: Xcode Command Line Tools (includes Git)
xcode-select --install

# Option 2: Homebrew
brew install git
</code></pre>

## Linux

<pre><code class="bash">
# Ubuntu/Debian
sudo apt update && sudo apt install git

# Fedora
sudo dnf install git
</code></pre>

## Verify

<pre><code class="bash">
git --version
</code></pre>
      `,
      tryItCode: `# After installing, run in terminal:
git --version
# e.g. git version 2.39.0`,
    },
    config: {
      title: 'Git Config',
      content: `
# Configuring Git

Set your **identity** (used in every commit):

<pre><code class="bash">
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
</code></pre>

## Config Levels

- \`--global\` – for your user (stored in \`~/.gitconfig\`)
- \`--local\` – for current repo only (default)
- \`--system\` – for all users

## View Config

<pre><code class="bash">
git config --list
git config user.name
</code></pre>

## Other Useful Settings

<pre><code class="bash">
git config --global init.defaultBranch main
git config --global core.editor "code --wait"
</code></pre>
      `,
      tryItCode: `# Set your name and email (required for commits)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Check
git config --list --show-origin`,
    },
    init: {
      title: 'Git Init',
      content: `
# Git Init

\`git init\` creates a new Git repository in the current folder.

## Create a New Repo

<pre><code class="bash">
mkdir my-project
cd my-project
git init
</code></pre>

This creates a hidden \`.git\` folder that stores all history and config.

## After Init

- The folder is now a **repo**
- No commits yet – add files and run \`git add\` then \`git commit\`
- Default branch is usually \`main\` or \`master\`

## Clone Instead of Init

To get a copy of an existing repo (e.g. from GitHub):

<pre><code class="bash">
git clone https://github.com/user/repo.git
cd repo
</code></pre>
      `,
      tryItCode: `# In a new folder:
mkdir git-demo && cd git-demo
git init
git status   # On branch main, no commits yet`,
    },
    add: {
      title: 'Git Add',
      content: `
# Git Add

\`git add\` stages changes for the next commit. Only **staged** changes are included in \`git commit\`.

## Stage Specific Files

<pre><code class="bash">
git add file1.js
git add src/
git add *.html
</code></pre>

## Stage All Changes

<pre><code class="bash">
git add .
# or
git add -A
</code></pre>

## Check Status

<pre><code class="bash">
git status
</code></pre>

Shows **untracked**, **modified**, and **staged** files.

## Unstage

<pre><code class="bash">
git restore --staged file.js
</code></pre>
      `,
      tryItCode: `# After editing files:
git add index.html
git add .
git status
# Then: git commit -m "Your message"`,
    },
    commit: {
      title: 'Git Commit',
      content: `
# Git Commit

\`git commit\` saves a **snapshot** of your staged changes with a message.

## Basic Commit

<pre><code class="bash">
git add .
git commit -m "Add login feature"
</code></pre>

## Good Commit Messages

- **Present tense**, imperative: "Add feature" not "Added feature"
- **Short summary** in the first line (under 50 chars)
- Optional body: explain *why* if needed

## Amend Last Commit

<pre><code class="bash">
git add forgotten-file.js
git commit --amend -m "Same message or new one"
</code></pre>

## View History

<pre><code class="bash">
git log
git log --oneline
</code></pre>
      `,
      tryItCode: `# Full flow:
git add .
git commit -m "Describe what you did"

# View commits
git log --oneline -5`,
    },
    push: {
      title: 'Git Push',
      content: `
# Git Push

\`git push\` sends your **commits** to a **remote** repository (e.g. GitHub).

## First Time: Add Remote

<pre><code class="bash">
git remote add origin https://github.com/username/repo.git
</code></pre>

## Push to Remote

<pre><code class="bash">
# Push current branch to origin
git push -u origin main
</code></pre>

\`-u\` sets \`origin main\` as upstream so later you can just \`git push\`.

## After First Push

<pre><code class="bash">
git push
</code></pre>

## Push a New Branch

<pre><code class="bash">
git push -u origin feature-branch
</code></pre>
      `,
      tryItCode: `# Add remote (once)
git remote add origin https://github.com/user/repo.git

# Push
git push -u origin main
# Later: git push`,
    },
    pull: {
      title: 'Git Pull',
      content: `
# Git Pull

\`git pull\` **fetches** from the remote and **merges** into your current branch. It is \`git fetch\` + \`git merge\`.

## Basic Pull

<pre><code class="bash">
git pull
# or
git pull origin main
</code></pre>

## Before You Push

Always **pull** first when working with others to get the latest changes, then push:

<pre><code class="bash">
git pull
# fix conflicts if any
git push
</code></pre>

## Pull with Rebase

<pre><code class="bash">
git pull --rebase
</code></pre>

Puts your commits on top of the remote branch (cleaner history).
      `,
      tryItCode: `# Get latest from remote
git pull

# If you have local commits and remote has new commits:
# Git will merge (or ask you to pull first before push)`,
    },
    branch: {
      title: 'Git Branch',
      content: `
# Git Branch

**Branches** let you work on features or fixes without affecting \`main\`.

## List Branches

<pre><code class="bash">
git branch          # local
git branch -a       # all (local + remote)
</code></pre>

## Create a Branch

<pre><code class="bash">
git branch feature-login
git checkout feature-login
# or in one step:
git checkout -b feature-login
</code></pre>

## Switch Branch

<pre><code class="bash">
git checkout main
git checkout feature-login
</code></pre>

## Delete a Branch

<pre><code class="bash">
git branch -d feature-old   # delete merged
git branch -D feature-old   # force delete
</code></pre>
      `,
      tryItCode: `# Create and switch to new branch
git checkout -b my-feature

# Work, commit, then push branch
git push -u origin my-feature`,
    },
    merge: {
      title: 'Git Merge',
      content: `
# Git Merge

\`git merge\` combines another branch into your **current** branch.

## Merge a Branch into Main

<pre><code class="bash">
git checkout main
git pull
git merge feature-login
git push
</code></pre>

## How It Works

- **Fast-forward**: If \`main\` has no new commits, Git just moves \`main\` to the tip of \`feature-login\`
- **Merge commit**: If both branches have new commits, Git creates a merge commit with two parents

## Merge Conflicts

If the same lines were changed in both branches, Git will ask you to resolve **conflicts** in the files, then:

<pre><code class="bash">
git add .
git commit -m "Merge feature-login, resolve conflicts"
</code></pre>
      `,
      tryItCode: `# Merge flow:
git checkout main
git merge feature-branch
# Resolve conflicts if any, then:
git add .
git commit
git push`,
    },
    conflicts: {
      title: 'Git Conflicts',
      content: `
# Resolving Merge Conflicts

A **conflict** happens when Git cannot automatically merge because both branches changed the same part of a file.

## What You'll See

<pre><code class="text">
<<<<<<< HEAD
code from current branch
=======
code from incoming branch
>>>>>>> feature-branch
</code></pre>

## Steps to Resolve

1. Open the conflicted file(s)
2. Choose what to keep: delete the markers and one (or both) versions, or rewrite
3. Remove \`<<<<<<<\`, \`=======\`, \`>>>>>>>\`
4. Save the file
5. \`git add &lt;file&gt;\`
6. \`git commit\` (no \`-m\` needed; default message is "Merge ...")

## Tools

- **VS Code** – built-in merge editor
- \`git mergetool\` – open configured diff tool
- \`git diff\` – see differences
      `,
      tryItCode: `# When conflict appears:
# 1. Open file, find <<<<<<< ======= >>>>>>>
# 2. Edit to keep correct code, remove markers
# 3. git add file
# 4. git commit`,
    },
  };

  return (
    gitLessons[lessonSlug] || {
      title: 'Git Lesson',
      content: '# Coming Soon\n\nThis lesson is being prepared.',
      tryItCode: '# Git commands run in terminal',
    }
  );
};
