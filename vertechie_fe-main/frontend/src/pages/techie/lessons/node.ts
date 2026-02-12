/**
 * Node.js Tutorial - Lesson content for each lesson slug
 */
export const generateNodeLessonContent = (lessonSlug: string) => {
  const nodeLessons: Record<string, { title: string; content: string; tryItCode: string }> = {
    home: {
      title: 'Node.js Tutorial',
      content: `
# Welcome to Node.js Tutorial

Node.js is a JavaScript **runtime** built on Chrome's V8 engine. It lets you run JavaScript on the **server**.

## Why Node.js?

- **JavaScript everywhere** – Same language for frontend and backend
- **Fast** – V8 is highly optimized
- **Non-blocking I/O** – Great for I/O-heavy and real-time apps
- **NPM** – Huge ecosystem of packages
- **Scalable** – Event-driven, single-threaded model

## What You'll Learn

- Installing and running Node.js
- Using **NPM** (Node Package Manager)
- **Modules** (require / import)
- **HTTP** server and requests
- **File system** (fs) operations
- **Express.js** for building APIs and web apps

Run code with: \`node script.js\`
      `,
      tryItCode: `// Run with: node script.js
console.log('Hello from Node.js!');
console.log('Node version:', process.version);

// Simple HTTP server (Node built-in)
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js!');
});
server.listen(3000, () => console.log('Server at http://localhost:3000'));`,
    },
    intro: {
      title: 'Node.js Intro',
      content: `
# What is Node.js?

Node.js is **not** a language or a framework. It is a **runtime** that executes JavaScript outside the browser.

## Key Concepts

- **Runtime** – Environment where JavaScript runs (V8 engine + Node APIs)
- **Event loop** – Handles async operations without blocking
- **Single-threaded** – One main thread; I/O is delegated
- **NPM** – Default package manager (npm install, npm run, etc.)

## When to Use Node.js

- REST APIs and backends
- Real-time apps (WebSockets, chat)
- Microservices
- Scripts and CLI tools
- Build tools (Bundler, Babel, etc.)

## When to Consider Alternatives

- CPU-heavy tasks (use worker threads or another language)
- Tight multithreading needs
      `,
      tryItCode: `// Node.js runs JavaScript on the server
const os = require('os');
console.log('Platform:', os.platform());
console.log('CPUs:', os.cpus().length);

// Async by default
setTimeout(() => console.log('Async log'), 100);
console.log('This runs first');`,
    },
    install: {
      title: 'Node.js Install',
      content: `
# Installing Node.js

## Option 1: Official Installer

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS** (Long Term Support) version
3. Run the installer (Windows/macOS) or use your package manager (Linux)

## Option 2: Package Managers

- **Windows (winget):** \`winget install OpenJS.NodeJS.LTS\`
- **macOS (Homebrew):** \`brew install node\`
- **Linux (Ubuntu):** \`sudo apt install nodejs npm\`

## Verify Installation

<pre><code class="bash">
node --version   # e.g. v20.x.x
npm --version    # e.g. 10.x.x
</code></pre>

## Optional: nvm (Node Version Manager)

Use **nvm** (or **fnm**) to switch between Node versions:

<pre><code class="bash">
nvm install 20
nvm use 20
</code></pre>
      `,
      tryItCode: `// After installing Node, run: node thisfile.js
console.log('Node is installed! Version:', process.version);`,
    },
    npm: {
      title: 'Node.js NPM',
      content: `
# Using NPM

**NPM** (Node Package Manager) is the default package manager for Node.js.

## Common Commands

| Command | Description |
|---------|-------------|
| \`npm init\` | Create \`package.json\` |
| \`npm install\` | Install dependencies from package.json |
| \`npm install &lt;pkg&gt;\` | Add a dependency |
| \`npm install -D &lt;pkg&gt;\` | Add dev dependency |
| \`npm run &lt;script&gt;\` | Run script from package.json |
| \`npm update\` | Update packages |

## package.json

<pre><code class="json">
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {},
  "devDependencies": {}
}
</code></pre>

## Global vs Local

- \`npm install express\` – local (in \`node_modules\`)
- \`npm install -g nodemon\` – global (CLI tools)
      `,
      tryItCode: `// After: npm init -y
// Add to package.json "scripts": { "start": "node index.js" }
// Run: npm start

console.log('Running from npm script!');
console.log('Process args:', process.argv);`,
    },
    modules: {
      title: 'Node.js Modules',
      content: `
# Node.js Modules

Node uses a **module system**: each file is a module. Use \`require()\` (CommonJS) or \`import\` (ES modules).

## CommonJS (default)

<pre><code class="javascript">
// Load built-in module
const fs = require('fs');

// Load local module
const myModule = require('./myModule');

// Export from myModule.js
module.exports = { foo, bar };
</code></pre>

## ES Modules

In \`package.json\` add \`"type": "module"\`:

<pre><code class="javascript">
import fs from 'fs';
import { foo } from './myModule.js';
export { bar };
</code></pre>

## Built-in Modules

- \`fs\` – file system
- \`http\` / \`https\` – HTTP
- \`path\` – path utilities
- \`os\` – OS info
- \`events\` – EventEmitter
      `,
      tryItCode: `// CommonJS
const path = require('path');
console.log('Current file:', __filename);
console.log('Dir name:', path.dirname(__filename));

// Export example: module.exports = { myFunc: () => 42 };`,
    },
    http: {
      title: 'Node.js HTTP',
      content: `
# Node.js HTTP Module

The \`http\` module lets you create HTTP servers and make HTTP requests.

## Create a Server

<pre><code class="javascript">
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => console.log('Listening on 3000'));
</code></pre>

## Request and Response

- \`req.url\`, \`req.method\` – URL and HTTP method
- \`req.headers\` – Request headers
- \`res.writeHead(status, headers)\` – Send status and headers
- \`res.write(data)\` / \`res.end(data)\` – Send body

## Make a Request

<pre><code class="javascript">
const https = require('https');
https.get('https://api.example.com/data', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
</code></pre>
      `,
      tryItCode: `const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello from Node HTTP!',
    url: req.url,
    method: req.method
  }));
});
server.listen(3000, () => console.log('http://localhost:3000'));`,
    },
    fs: {
      title: 'Node.js File System',
      content: `
# Node.js File System (fs)

The \`fs\` module provides APIs to work with the **file system**.

## Sync vs Async

- \`fs.readFileSync\` / \`fs.writeFileSync\` – blocking
- \`fs.readFile\` / \`fs.writeFile\` – non-blocking (callbacks)
- \`fs.promises.readFile\` – Promise-based (preferred)

## Read a File

<pre><code class="javascript">
const fs = require('fs');

// Sync
const data = fs.readFileSync('file.txt', 'utf8');

// Async (callback)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Promises
const fsPromises = require('fs').promises;
const text = await fsPromises.readFile('file.txt', 'utf8');
</code></pre>

## Write a File

<pre><code class="javascript">
fs.writeFileSync('output.txt', 'Hello');
fs.writeFile('output.txt', 'Hello', (err) => { });
</code></pre>

## Other Useful Methods

\`readdir\`, \`mkdir\`, \`unlink\`, \`stat\`, \`existsSync\`
      `,
      tryItCode: `const fs = require('fs');

// Write then read (use a temp path in production)
const file = 'node_fs_demo.txt';
fs.writeFileSync(file, 'Hello from Node fs!');
const content = fs.readFileSync(file, 'utf8');
console.log('Read back:', content);
fs.unlinkSync(file);
console.log('Done');`,
    },
    express: {
      title: 'Express Introduction',
      content: `
# Express.js Introduction

**Express** is the most popular Node.js **web framework**. It is minimal and flexible.

## Install

<pre><code class="bash">
npm init -y
npm install express
</code></pre>

## Hello World

<pre><code class="javascript">
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(PORT, () => console.log('Server on', PORT));
</code></pre>

## Key Concepts

- **Routes** – \`app.get(path, handler)\`, \`app.post(path, handler)\`
- **Middleware** – Functions that run between request and response
- **req** / **res** – Request and response objects
- **res.send()** – Send response (string, JSON, etc.)
      `,
      tryItCode: `const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello, Express!'));
app.get('/api/hello', (req, res) => res.json({ message: 'Hello API' }));

app.listen(3000, () => console.log('http://localhost:3000'));`,
    },
    routing: {
      title: 'Express Routing',
      content: `
# Express Routing

**Routing** maps HTTP method + URL path to a handler function.

## Basic Routes

<pre><code class="javascript">
app.get('/users', (req, res) => { });
app.post('/users', (req, res) => { });
app.put('/users/:id', (req, res) => { });
app.delete('/users/:id', (req, res) => { });
</code></pre>

## Route Parameters

<pre><code class="javascript">
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.send('User ' + userId);
});
</code></pre>

## Query String

<pre><code class="javascript">
// GET /search?q=node
app.get('/search', (req, res) => {
  const q = req.query.q;
  res.json({ query: q });
});
</code></pre>

## Router (modular routes)

<pre><code class="javascript">
const router = express.Router();
router.get('/', (req, res) => { });
app.use('/api/users', router);
</code></pre>
      `,
      tryItCode: `const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});
app.get('/search', (req, res) => {
  res.json({ q: req.query.q });
});

app.listen(3000);`,
    },
    middleware: {
      title: 'Express Middleware',
      content: `
# Express Middleware

**Middleware** are functions that run in order. They receive \`req\`, \`res\`, and \`next\`. Call \`next()\` to pass to the next middleware or route.

## Syntax

<pre><code class="javascript">
function myMiddleware(req, res, next) {
  console.log('Request:', req.method, req.url);
  next();
}
app.use(myMiddleware);
</code></pre>

## Built-in Middleware

<pre><code class="javascript">
app.use(express.json());       // Parse JSON body
app.use(express.urlencoded({ extended: true }));  // Form data
app.use(express.static('public'));  // Serve static files
</code></pre>

## Order Matters

Middleware runs in the order it is added. Put \`express.json()\` before routes that need \`req.body\`.

## Route-level Middleware

<pre><code class="javascript">
const auth = (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).send('Unauthorized');
  next();
};
app.get('/admin', auth, (req, res) => res.send('Admin area'));
</code></pre>
      `,
      tryItCode: `const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.post('/data', (req, res) => {
  res.json({ received: req.body });
});

app.listen(3000);`,
    },
    'rest-api': {
      title: 'Building REST APIs',
      content: `
# Building REST APIs with Express

A **REST API** exposes resources via HTTP methods and URLs.

## REST Conventions

| Method | Path | Action |
|--------|------|--------|
| GET | /users | List users |
| GET | /users/:id | Get one user |
| POST | /users | Create user |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

## Example CRUD

<pre><code class="javascript">
let users = [{ id: 1, name: 'Alice' }];

app.get('/users', (req, res) => res.json(users));
app.get('/users/:id', (req, res) => {
  const u = users.find(x => x.id == req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  res.json(u);
});
app.post('/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});
app.put('/users/:id', (req, res) => { /* update */ });
app.delete('/users/:id', (req, res) => { /* delete */ });
</code></pre>

## Status Codes

- 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error
      `,
      tryItCode: `const express = require('express');
const app = express();
app.use(express.json());

const items = [{ id: 1, name: 'Item 1' }];

app.get('/items', (req, res) => res.json(items));
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.post('/items', (req, res) => {
  const item = { id: Date.now(), name: req.body.name || 'Unnamed' };
  items.push(item);
  res.status(201).json(item);
});

app.listen(3000);`,
    },
  };

  return (
    nodeLessons[lessonSlug] || {
      title: 'Node.js Lesson',
      content: '# Coming Soon\n\nThis lesson is being prepared.',
      tryItCode: '// Node.js example',
    }
  );
};
