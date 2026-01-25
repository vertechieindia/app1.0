export const generateReactLessonContent = (lessonSlug: string) => {
  const reactLessons: Record<string, { title: string; content: string; tryItCode?: string }> = {
    // PHASE 0 — FOUNDATION
    home: {
      title: 'React HOME',
      content: `## Welcome to React

React is the world's most popular JavaScript library for building user interfaces.

### What You'll Learn

- **Component-Based Architecture**: Build encapsulated components that manage their own state
- **Declarative UI**: Describe what you want, React figures out how
- **Virtual DOM**: Efficient updates through intelligent diffing
- **Modern Hooks**: Powerful state and lifecycle management
- **Real-World Skills**: Production-ready patterns and best practices

### Why React?

- Used by **Meta, Netflix, Airbnb, Twitter, and millions more**
- **2+ million** weekly npm downloads
- Huge ecosystem of tools and libraries
- Career opportunities in every tech hub

### Course Structure

1. **Foundation** - Understanding React's mental model
2. **JSX & Components** - Building blocks of React apps
3. **Props & Events** - Data flow and interactivity
4. **Forms** - Handling user input
5. **Styling** - Making apps beautiful
6. **Routing** - Single-page applications
7. **Hooks** - Modern state management
8. **Advanced Patterns** - Senior-level techniques

### Prerequisites

- HTML & CSS fundamentals
- JavaScript ES6+ (especially arrow functions, destructuring, modules)
- Basic command line usage

**Let's build something amazing!** ⚛️`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Welcome to React!</h2>
<div id="demo"></div>

<script>
// What is React?
let reactInfo = {
  name: "React",
  creator: "Meta (Facebook)",
  type: "JavaScript Library",
  purpose: "Building User Interfaces",
  released: 2013,
  currentVersion: "18.x"
};

let features = [
  "Component-Based",
  "Declarative",
  "Virtual DOM",
  "One-Way Data Flow",
  "Hooks",
  "Server Components"
];

let output = "<h3>React Overview</h3>";
output += "<p><strong>Name:</strong> " + reactInfo.name + "</p>";
output += "<p><strong>Created by:</strong> " + reactInfo.creator + "</p>";
output += "<p><strong>Type:</strong> " + reactInfo.type + "</p>";
output += "<p><strong>Purpose:</strong> " + reactInfo.purpose + "</p>";
output += "<p><strong>Released:</strong> " + reactInfo.released + "</p>";

output += "<h3>Key Features</h3><ul>";
features.forEach(function(f) {
  output += "<li>" + f + "</li>";
});
output += "</ul>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    intro: {
      title: 'React Introduction',
      content: `## What is React?

React is a **declarative, component-based JavaScript library** for building user interfaces.

### The Core Philosophy

\`\`\`
UI = f(state)
\`\`\`

Your UI is a **function of your state**. When state changes, React efficiently updates only what needs to change.

### Declarative vs Imperative

**Imperative (jQuery style):**
\`\`\`javascript
// You tell the browser HOW to do it
document.getElementById('counter').innerHTML = count;
document.getElementById('btn').addEventListener('click', increment);
\`\`\`

**Declarative (React style):**
\`\`\`jsx
// You describe WHAT you want
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

### Virtual DOM Explained

React doesn't directly manipulate the real DOM. Instead:

1. **State changes** trigger a re-render
2. React creates a **Virtual DOM** (JavaScript object tree)
3. React **diffs** the new Virtual DOM against the previous one
4. Only **actual changes** are applied to the real DOM

This makes React incredibly efficient.

### React vs Other Frameworks

| Feature | React | Angular | Vue |
|---------|-------|---------|-----|
| Type | Library | Framework | Framework |
| Learning Curve | Moderate | Steep | Gentle |
| Size | Small | Large | Small |
| Flexibility | High | Opinionated | Balanced |
| State Management | External | Built-in | External/Pinia |

### React's Mental Model

Think of your app as a **tree of components**, each responsible for:
- Its own rendering logic
- Its own state (if needed)
- Receiving data from parents (props)
- Passing data to children (props)`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>React Mental Model</h2>
<div id="demo"></div>

<script>
// Simulating React's declarative approach

// State
let state = {
  count: 0,
  user: "Developer",
  items: ["Learn React", "Build Apps", "Get Hired"]
};

// Render function - describes WHAT we want
function render(state) {
  let output = "<h3>Welcome, " + state.user + "!</h3>";
  output += "<p>Count: <strong>" + state.count + "</strong></p>";
  output += "<h4>Your Goals:</h4><ul>";
  state.items.forEach(function(item) {
    output += "<li>" + item + "</li>";
  });
  output += "</ul>";
  output += "<p><em>UI = f(state) - When state changes, UI updates!</em></p>";
  return output;
}

// Initial render
document.getElementById("demo").innerHTML = render(state);

// Simulate state change after 2 seconds
setTimeout(function() {
  state.count = 10;
  state.items.push("Master Hooks");
  document.getElementById("demo").innerHTML = render(state);
}, 2000);
</script>

</body>
</html>`,
    },
    'get-started': {
      title: 'React Get Started',
      content: `## Setting Up React

### Tooling Landscape

| Tool | Description | Best For |
|------|-------------|----------|
| **Vite** | Lightning-fast build tool | New projects (recommended) |
| **Create React App** | Official starter (deprecated) | Legacy projects |
| **Next.js** | Full-stack framework | Production apps, SSR, SEO |
| **Remix** | Full-stack framework | Data-heavy apps |

### Creating a React App with Vite

\`\`\`bash
# Create new project
npm create vite@latest my-react-app -- --template react

# Navigate to project
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Project Structure

\`\`\`
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx        ← Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
\`\`\`

### Understanding the Entry Point

\`\`\`jsx
// main.jsx - Where React mounts to the DOM
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
\`\`\`

### React.StrictMode

- Enables additional development checks
- Helps identify unsafe lifecycles
- Warns about deprecated APIs
- Double-invokes functions to detect side effects
- **Only runs in development**, no production impact

### Dev vs Production Builds

\`\`\`bash
# Development (hot reload, error overlays)
npm run dev

# Production build (optimized, minified)
npm run build

# Preview production build locally
npm run preview
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Project Structure</h2>
<pre id="demo"></pre>

<script>
// Simulating React project structure

let projectStructure = {
  "my-react-app/": {
    "node_modules/": "[dependencies]",
    "public/": {
      "vite.svg": "static asset"
    },
    "src/": {
      "assets/": "[images, fonts]",
      "App.css": "component styles",
      "App.jsx": "root component",
      "index.css": "global styles",
      "main.jsx": "← ENTRY POINT"
    },
    "index.html": "HTML template",
    "package.json": "dependencies & scripts",
    "vite.config.js": "build configuration"
  }
};

let commands = [
  { cmd: "npm create vite@latest my-app", desc: "Create project" },
  { cmd: "cd my-app", desc: "Enter directory" },
  { cmd: "npm install", desc: "Install dependencies" },
  { cmd: "npm run dev", desc: "Start dev server" },
  { cmd: "npm run build", desc: "Production build" }
];

let output = "Project Structure:\\n";
output += JSON.stringify(projectStructure, null, 2);
output += "\\n\\nEssential Commands:\\n";
commands.forEach(function(c) {
  output += "  " + c.cmd + "\\n    → " + c.desc + "\\n";
});

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'first-app': {
      title: 'React First App',
      content: `## Your First React Application

### The Entry Point

Every React app has a single entry point where React takes control:

\`\`\`jsx
// main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
\`\`\`

### Your First Component

\`\`\`jsx
// App.jsx
function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to my first React app.</p>
    </div>
  )
}

export default App
\`\`\`

### How It Works

1. **index.html** contains \`<div id="root"></div>\`
2. **main.jsx** finds this element
3. React **mounts** the \`App\` component inside it
4. React now **controls** this DOM subtree

### Adding State

\`\`\`jsx
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Click me!
      </button>
    </div>
  )
}
\`\`\`

### Multiple Components

\`\`\`jsx
// Header.jsx
function Header() {
  return <header><h1>My App</h1></header>
}

// Footer.jsx
function Footer() {
  return <footer>© 2024</footer>
}

// App.jsx
import Header from './Header'
import Footer from './Footer'

function App() {
  return (
    <>
      <Header />
      <main>Content here</main>
      <Footer />
    </>
  )
}
\`\`\`

### Fragment Shorthand

Use \`<></>\` (Fragment) when you need to return multiple elements without a wrapper div.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>First React App Simulation</h2>
<div id="root"></div>

<script>
// Simulating React component structure

// Component: Header
function Header() {
  return "<header><h1>⚛️ My First React App</h1></header>";
}

// Component: Counter (with state simulation)
let count = 0;
function Counter() {
  return '<div class="counter">' +
    '<p>Count: <strong id="count-value">' + count + '</strong></p>' +
    '<button onclick="increment()">Click Me!</button>' +
    '</div>';
}

// Component: Footer
function Footer() {
  return "<footer><p>Built with React ❤️</p></footer>";
}

// App Component (combines everything)
function App() {
  return Header() + 
    '<main>' + Counter() + '</main>' +
    Footer();
}

// Mount to DOM (like ReactDOM.render)
function render() {
  document.getElementById("root").innerHTML = App();
}

// State update function
function increment() {
  count++;
  render(); // Re-render on state change
}

// Initial render
render();
</script>

<style>
#root { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; }
header { background: #282c34; color: #61dafb; padding: 20px; }
main { padding: 20px; text-align: center; }
button { background: #61dafb; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; }
footer { background: #f5f5f5; padding: 10px; text-align: center; }
</style>

</body>
</html>`,
    },
    'render-html': {
      title: 'React Render HTML',
      content: `## Rendering JSX to the DOM

### The Root

React apps have a single root element where everything renders:

\`\`\`html
<!-- index.html -->
<div id="root"></div>
\`\`\`

\`\`\`jsx
// main.jsx
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
\`\`\`

### What Triggers Re-renders?

1. **State changes** via \`setState\` or \`useState\`
2. **Props changes** from parent component
3. **Context changes** if using \`useContext\`
4. **Parent re-renders** (children re-render too)

### Idempotency Concept

React render functions should be **idempotent** - calling them with the same props/state should produce the same output.

\`\`\`jsx
// ✅ Idempotent - same input = same output
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}

// ❌ Not idempotent - different output each render
function Greeting({ name }) {
  return <h1>Hello, {name}! Time: {Date.now()}</h1>
}
\`\`\`

### Rendering Multiple Elements

\`\`\`jsx
// Using Fragment
function App() {
  return (
    <>
      <Header />
      <Main />
      <Footer />
    </>
  )
}

// Rendering from array
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
\`\`\`

### Conditional Rendering

\`\`\`jsx
function Dashboard({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <UserPanel /> : <LoginForm />}
    </div>
  )
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Rendering Concepts</h2>
<div id="demo"></div>

<script>
// Demonstrating React rendering concepts

let renderCount = 0;

// Simulating idempotent render
function Greeting(props) {
  // Same props = same output (idempotent)
  return "<h3>Hello, " + props.name + "!</h3>";
}

// Simulating conditional render
function Dashboard(props) {
  if (props.isLoggedIn) {
    return "<div>Welcome back! <button onclick='logout()'>Logout</button></div>";
  }
  return "<div>Please <button onclick='login()'>Login</button></div>";
}

// State
let state = { isLoggedIn: false, name: "Developer" };

// Render function
function render() {
  renderCount++;
  let output = Greeting({ name: state.name });
  output += Dashboard({ isLoggedIn: state.isLoggedIn });
  output += "<p><em>Render count: " + renderCount + "</em></p>";
  output += "<p>Each state change triggers a re-render!</p>";
  document.getElementById("demo").innerHTML = output;
}

// State updaters
function login() {
  state.isLoggedIn = true;
  render();
}

function logout() {
  state.isLoggedIn = false;
  render();
}

// Initial render
render();
</script>

</body>
</html>`,
    },
    es6: {
      title: 'React ES6 Essentials',
      content: `## ES6 for React

React without ES6 is dead weight. Master these features:

### Arrow Functions

\`\`\`javascript
// Traditional
function greet(name) {
  return 'Hello, ' + name;
}

// Arrow function
const greet = (name) => 'Hello, ' + name;

// In React - event handlers
<button onClick={() => setCount(count + 1)}>Click</button>
\`\`\`

### Destructuring

\`\`\`javascript
// Object destructuring
const { name, age } = user;

// Props destructuring
function UserCard({ name, email, avatar }) {
  return <div>{name} - {email}</div>;
}

// Array destructuring (useState)
const [count, setCount] = useState(0);
\`\`\`

### Spread Operator

\`\`\`javascript
// Copying arrays
const newItems = [...items, newItem];

// Copying objects
const updatedUser = { ...user, name: 'New Name' };

// Spreading props
<Component {...props} />
\`\`\`

### Template Literals

\`\`\`javascript
// String interpolation
const message = \`Hello, \${name}!\`;

// Multi-line
const html = \`
  <div>
    <h1>\${title}</h1>
  </div>
\`;
\`\`\`

### Modules

\`\`\`javascript
// Named exports
export const Button = () => <button>Click</button>;
export const Input = () => <input />;

// Named imports
import { Button, Input } from './components';

// Default export
export default function App() { ... }

// Default import
import App from './App';
\`\`\`

### Short-circuit Evaluation

\`\`\`jsx
// Show only if condition is true
{isLoggedIn && <LogoutButton />}

// Default values
const name = user.name || 'Guest';
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>ES6 for React</h2>
<pre id="demo"></pre>

<script>
// ES6 Features Essential for React

// 1. Arrow Functions
const greet = (name) => "Hello, " + name + "!";

// 2. Destructuring
const user = { name: "Alice", age: 25, role: "Developer" };
const { name, age, role } = user;

// 3. Array Destructuring (like useState)
const stateArray = [0, function(n) { return n; }];
const [count, setCount] = stateArray;

// 4. Spread Operator
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5];

const newUser = { ...user, name: "Bob" };

// 5. Template Literals
const message = \`Welcome, \${name}! You are \${age} years old.\`;

// 6. Short-circuit
const isLoggedIn = true;
const greeting = isLoggedIn && "Welcome back!";

let output = "ES6 Features for React:\\n\\n";
output += "1. Arrow Functions:\\n";
output += "   " + greet("React Developer") + "\\n\\n";

output += "2. Object Destructuring:\\n";
output += "   name: " + name + ", age: " + age + ", role: " + role + "\\n\\n";

output += "3. Array Destructuring (useState pattern):\\n";
output += "   const [count, setCount] = useState(0)\\n";
output += "   count = " + count + "\\n\\n";

output += "4. Spread Operator:\\n";
output += "   Original: [" + arr + "] → New: [" + newArr + "]\\n";
output += "   Original user: " + user.name + " → Spread: " + newUser.name + "\\n\\n";

output += "5. Template Literals:\\n";
output += "   " + message + "\\n\\n";

output += "6. Short-circuit (conditional rendering):\\n";
output += "   {isLoggedIn && <Component />}\\n";
output += "   Result: " + greeting;

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },

    // PHASE 2 — JSX & COMPONENTS
    'jsx-intro': {
      title: 'React JSX Intro',
      content: `## Understanding JSX

JSX is **syntax sugar** for \`React.createElement()\`.

### JSX is NOT HTML

\`\`\`jsx
// This JSX:
<div className="container">
  <h1>Hello</h1>
</div>

// Compiles to:
React.createElement(
  'div',
  { className: 'container' },
  React.createElement('h1', null, 'Hello')
)
\`\`\`

### Key Differences from HTML

| HTML | JSX |
|------|-----|
| \`class\` | \`className\` |
| \`for\` | \`htmlFor\` |
| \`onclick\` | \`onClick\` |
| \`tabindex\` | \`tabIndex\` |
| Self-closing optional | Self-closing required \`<img />\` |

### JSX Rules

1. **Single Root Element**
\`\`\`jsx
// ❌ Invalid - multiple roots
return (
  <h1>Title</h1>
  <p>Content</p>
)

// ✅ Valid - single root
return (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
)

// ✅ Using Fragment
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
)
\`\`\`

2. **Close All Tags**
\`\`\`jsx
<img src="photo.jpg" />
<input type="text" />
<br />
\`\`\`

3. **camelCase Attributes**
\`\`\`jsx
<div tabIndex="0" onClick={handleClick}>
  <label htmlFor="name">Name</label>
</div>
\`\`\`

### The Compilation Pipeline

\`\`\`
JSX → Babel/SWC → React.createElement() → Virtual DOM → Real DOM
\`\`\`

Babel or SWC transforms JSX at build time, not runtime.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JSX Compilation</h2>
<div id="demo"></div>

<script>
// JSX compiles to React.createElement()

// Simulating what JSX compiles to:
function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.length === 1 ? children[0] : children
    }
  };
}

// This JSX:
// <div className="container">
//   <h1>Hello, React!</h1>
//   <p>Welcome to JSX</p>
// </div>

// Compiles to:
let element = createElement(
  'div',
  { className: 'container' },
  createElement('h1', null, 'Hello, React!'),
  createElement('p', null, 'Welcome to JSX')
);

let output = "<h3>JSX → React.createElement()</h3>";
output += "<p>JSX is just syntax sugar!</p>";
output += "<pre>" + JSON.stringify(element, null, 2) + "</pre>";

output += "<h4>Key Differences from HTML:</h4>";
output += "<table border='1' style='border-collapse:collapse'>";
output += "<tr><th>HTML</th><th>JSX</th></tr>";
output += "<tr><td>class</td><td>className</td></tr>";
output += "<tr><td>for</td><td>htmlFor</td></tr>";
output += "<tr><td>onclick</td><td>onClick</td></tr>";
output += "<tr><td>tabindex</td><td>tabIndex</td></tr>";
output += "</table>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'jsx-expressions': {
      title: 'JSX Expressions',
      content: `## Expressions in JSX

Use curly braces \`{}\` to embed JavaScript expressions in JSX.

### Expressions vs Statements

\`\`\`jsx
// ✅ Expressions (return a value)
{2 + 2}
{user.name}
{formatDate(date)}
{items.map(i => <li key={i.id}>{i.name}</li>)}

// ❌ Statements (don't return a value)
{if (x) { ... }}  // Use ternary instead
{for (let i...) {...}}  // Use map instead
\`\`\`

### Common Expression Patterns

\`\`\`jsx
// Variables
<h1>{userName}</h1>

// Calculations
<p>Total: \${price * quantity}</p>

// Function calls
<span>{formatCurrency(amount)}</span>

// Object properties
<img src={user.avatar} alt={user.name} />

// Array methods
<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>

// Ternary
{isLoading ? <Spinner /> : <Content />}

// Logical AND
{hasError && <ErrorMessage />}
\`\`\`

### Dynamic Styling

\`\`\`jsx
// Inline styles (object)
<div style={{ color: 'red', fontSize: '20px' }}>
  Styled text
</div>

// Dynamic classes
<div className={\`card \${isActive ? 'active' : ''}\`}>
  Content
</div>
\`\`\`

### Avoid These Mistakes

\`\`\`jsx
// ❌ Don't use quotes around expressions
<img src="{imageUrl}" />  // Wrong - renders literally

// ✅ Use curly braces
<img src={imageUrl} />    // Correct

// ❌ Don't put braces around string literals
<div className={"container"} />  // Unnecessary

// ✅ Just use the string
<div className="container" />    // Cleaner
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>JSX Expressions</h2>
<div id="demo"></div>

<script>
// JSX Expression Examples

let user = {
  name: "Alice",
  role: "Developer",
  avatar: "👩‍💻"
};

let items = [
  { id: 1, name: "Learn JSX", done: true },
  { id: 2, name: "Build Components", done: false },
  { id: 3, name: "Master Hooks", done: false }
];

let isLoggedIn = true;
let hasNotifications = true;
let notificationCount = 5;

// Simulating JSX expressions
function render() {
  let output = "<h3>Expression Examples</h3>";
  
  // Variable expression
  output += "<p>User: <strong>{user.name}</strong> → " + user.name + "</p>";
  
  // Calculation expression
  let price = 29.99, qty = 3;
  output += "<p>Total: <strong>{price * qty}</strong> → $" + (price * qty).toFixed(2) + "</p>";
  
  // Ternary expression
  output += "<p>Status: {isLoggedIn ? 'Welcome!' : 'Please login'} → ";
  output += (isLoggedIn ? "Welcome!" : "Please login") + "</p>";
  
  // Logical AND
  output += "<p>Notifications: {hasNotifications && count} → ";
  output += (hasNotifications && notificationCount) + "</p>";
  
  // Array map
  output += "<h4>Todo List (using map):</h4><ul>";
  items.forEach(function(item) {
    let style = item.done ? "text-decoration: line-through" : "";
    output += "<li style='" + style + "'>" + item.name + "</li>";
  });
  output += "</ul>";
  
  return output;
}

document.getElementById("demo").innerHTML = render();
</script>

</body>
</html>`,
    },
    'jsx-attributes': {
      title: 'JSX Attributes',
      content: `## JSX Attributes

### Dynamic Attributes

\`\`\`jsx
// String attributes
<img src="/images/logo.png" alt="Logo" />

// Dynamic attributes
<img src={imageUrl} alt={altText} />

// Spread attributes
<Button {...buttonProps} />
\`\`\`

### Boolean Props

\`\`\`jsx
// Presence = true
<input disabled />
<button hidden />

// Explicit boolean
<input disabled={isDisabled} />

// Shorthand patterns
<Modal open />           // open={true}
<Modal open={isOpen} />  // conditional
\`\`\`

### Event Handlers

\`\`\`jsx
// Inline handler
<button onClick={() => console.log('clicked')}>
  Click
</button>

// Function reference
<button onClick={handleClick}>Click</button>

// With parameters
<button onClick={() => handleDelete(id)}>Delete</button>
\`\`\`

### Style Attribute

\`\`\`jsx
// Object syntax (camelCase properties)
<div style={{ 
  backgroundColor: 'blue',
  fontSize: '16px',
  padding: '20px'
}}>
  Styled div
</div>

// Dynamic styles
<div style={{ 
  color: isError ? 'red' : 'green',
  opacity: isVisible ? 1 : 0 
}}>
  Dynamic styling
</div>
\`\`\`

### Common Attribute Patterns

\`\`\`jsx
// Conditional className
<div className={\`btn \${isActive ? 'btn-active' : ''}\`}>

// Multiple classes (with classnames library)
<div className={classNames('btn', { 'active': isActive })}>

// Data attributes
<div data-testid="submit-button" data-id={itemId}>

// ARIA attributes
<button aria-label="Close" aria-pressed={isPressed}>
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>JSX Attributes</h2>
<div id="demo"></div>

<script>
// JSX Attribute Patterns

let props = {
  src: "https://placekitten.com/100/100",
  alt: "A cute kitten",
  className: "avatar",
  onClick: function() { alert("Clicked!"); }
};

let isActive = true;
let isDisabled = false;

function render() {
  let output = "<h3>Attribute Examples</h3>";
  
  // Dynamic attributes
  output += "<h4>1. Dynamic Attributes</h4>";
  output += '<img src="' + props.src + '" alt="' + props.alt + '" style="border-radius:50%" />';
  
  // Boolean props
  output += "<h4>2. Boolean Props</h4>";
  output += '<input type="text" placeholder="Enabled input" /><br>';
  output += '<input type="text" placeholder="Disabled input" disabled />';
  
  // Conditional className
  output += "<h4>3. Conditional Classes</h4>";
  let buttonClass = "btn " + (isActive ? "btn-active" : "");
  output += '<button class="' + buttonClass + '" style="padding:10px 20px;background:' + (isActive ? '#61dafb' : '#ccc') + '">Active Button</button>';
  
  // Style object
  output += "<h4>4. Style Object</h4>";
  output += '<div style="background-color:#282c34;color:#61dafb;padding:15px;border-radius:8px">Styled with inline style object</div>';
  
  // Spread props simulation
  output += "<h4>5. Spread Props Pattern</h4>";
  output += "<p>In React: <code>&lt;Img {...props} /&gt;</code></p>";
  output += "<p>All props spread onto element automatically!</p>";
  
  return output;
}

document.getElementById("demo").innerHTML = render();
</script>

<style>
.btn { padding: 10px 20px; border: none; cursor: pointer; }
.btn-active { background: #61dafb; color: #282c34; }
</style>

</body>
</html>`,
    },
    'jsx-conditionals': {
      title: 'JSX Conditionals',
      content: `## Conditional Rendering

### Ternary Operator

\`\`\`jsx
function Welcome({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in</h1>
      )}
    </div>
  );
}
\`\`\`

### Logical AND (&&)

\`\`\`jsx
// Show only if true
function Notifications({ count }) {
  return (
    <div>
      {count > 0 && (
        <span className="badge">{count}</span>
      )}
    </div>
  );
}
\`\`\`

**⚠️ Warning with &&:**
\`\`\`jsx
// ❌ Dangerous - renders "0"
{count && <Badge count={count} />}

// ✅ Safe - explicit boolean
{count > 0 && <Badge count={count} />}
\`\`\`

### Early Return Pattern

\`\`\`jsx
function Dashboard({ user }) {
  // Guard clause
  if (!user) {
    return <LoginPrompt />;
  }

  // Main render
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <UserContent />
    </div>
  );
}
\`\`\`

### Switch-like Rendering

\`\`\`jsx
function StatusBadge({ status }) {
  const badges = {
    pending: <span className="yellow">Pending</span>,
    approved: <span className="green">Approved</span>,
    rejected: <span className="red">Rejected</span>,
  };

  return badges[status] || <span>Unknown</span>;
}
\`\`\`

### Render Guards (Clean Pattern)

\`\`\`jsx
function UserProfile({ user, isLoading, error }) {
  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <ProfileCard user={user} />;
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Conditional Rendering</h2>
<div id="demo"></div>

<script>
// Conditional Rendering Patterns

let state = {
  isLoggedIn: true,
  notificationCount: 3,
  status: "approved",
  isLoading: false,
  error: null,
  user: { name: "Alice" }
};

function render() {
  let output = "";
  
  // 1. Ternary
  output += "<h4>1. Ternary Operator</h4>";
  output += state.isLoggedIn 
    ? "<p>✅ Welcome back, " + state.user.name + "!</p>"
    : "<p>❌ Please sign in</p>";
  
  // 2. Logical AND
  output += "<h4>2. Logical AND (&&)</h4>";
  if (state.notificationCount > 0) {
    output += '<p>🔔 You have <span style="background:#ff4444;color:white;padding:2px 8px;border-radius:10px">' + state.notificationCount + '</span> notifications</p>';
  } else {
    output += "<p>No notifications</p>";
  }
  
  // 3. Switch-like
  output += "<h4>3. Switch-like Pattern</h4>";
  let badges = {
    pending: '<span style="background:#ffa500;padding:4px 8px">⏳ Pending</span>',
    approved: '<span style="background:#4caf50;color:white;padding:4px 8px">✅ Approved</span>',
    rejected: '<span style="background:#f44336;color:white;padding:4px 8px">❌ Rejected</span>'
  };
  output += "<p>Status: " + (badges[state.status] || "Unknown") + "</p>";
  
  // 4. Render Guards
  output += "<h4>4. Render Guards</h4>";
  if (state.isLoading) {
    output += "<p>⏳ Loading...</p>";
  } else if (state.error) {
    output += "<p>❌ Error: " + state.error + "</p>";
  } else if (!state.user) {
    output += "<p>👤 User not found</p>";
  } else {
    output += "<p>👋 Profile: " + state.user.name + "</p>";
  }
  
  output += "<button onclick='toggleLogin()'>Toggle Login</button>";
  
  return output;
}

function toggleLogin() {
  state.isLoggedIn = !state.isLoggedIn;
  document.getElementById("demo").innerHTML = render();
}

document.getElementById("demo").innerHTML = render();
</script>

</body>
</html>`,
    },
    components: {
      title: 'React Components',
      content: `## Functional Components

Components are the building blocks of React applications.

### Basic Component

\`\`\`jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}

// Arrow function syntax
const Welcome = () => <h1>Hello, World!</h1>;
\`\`\`

### Component with Props

\`\`\`jsx
function Greeting({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Greeting name="Alice" age={25} />
\`\`\`

### Component Purity

Components should be **pure functions**:

\`\`\`jsx
// ✅ Pure - same input = same output
function PureComponent({ value }) {
  return <div>{value * 2}</div>;
}

// ❌ Impure - modifies external state
let counter = 0;
function ImpureComponent() {
  counter++;  // Side effect!
  return <div>{counter}</div>;
}
\`\`\`

### Single Responsibility Principle

Each component should do ONE thing well:

\`\`\`jsx
// ❌ Too many responsibilities
function UserDashboard() {
  // fetches data
  // manages state
  // handles auth
  // renders UI
  // manages forms
}

// ✅ Separated concerns
function UserDashboard() {
  return (
    <Layout>
      <UserHeader />
      <UserStats />
      <UserActivity />
      <UserSettings />
    </Layout>
  );
}
\`\`\`

### Component Composition

\`\`\`jsx
// Small, focused components
function Avatar({ src, alt }) {
  return <img className="avatar" src={src} alt={alt} />;
}

function UserInfo({ name, role }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
}

// Composed together
function UserCard({ user }) {
  return (
    <div className="card">
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} role={user.role} />
    </div>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Components</h2>
<div id="root"></div>

<script>
// Component-Based Architecture

// Component: Avatar
function Avatar(props) {
  return '<img class="avatar" src="' + props.src + '" alt="' + props.alt + '" style="width:50px;height:50px;border-radius:50%" />';
}

// Component: UserInfo
function UserInfo(props) {
  return '<div class="user-info"><h4 style="margin:0">' + props.name + '</h4><p style="margin:0;color:#666">' + props.role + '</p></div>';
}

// Component: UserCard (composed)
function UserCard(props) {
  return '<div class="card" style="display:flex;gap:15px;padding:15px;border:1px solid #ddd;border-radius:8px;margin:10px 0">' +
    Avatar({ src: props.avatar, alt: props.name }) +
    UserInfo({ name: props.name, role: props.role }) +
  '</div>';
}

// Component: App (root)
function App() {
  let users = [
    { id: 1, name: "Alice", role: "Frontend Developer", avatar: "https://i.pravatar.cc/50?u=alice" },
    { id: 2, name: "Bob", role: "Backend Developer", avatar: "https://i.pravatar.cc/50?u=bob" },
    { id: 3, name: "Charlie", role: "Full Stack Developer", avatar: "https://i.pravatar.cc/50?u=charlie" }
  ];
  
  let output = '<h3>Team Members</h3>';
  users.forEach(function(user) {
    output += UserCard(user);
  });
  
  output += '<p style="margin-top:20px;color:#61dafb"><em>Each card is a composition of Avatar + UserInfo components!</em></p>';
  
  return output;
}

// Mount to root
document.getElementById("root").innerHTML = App();
</script>

</body>
</html>`,
    },
    'class': {
      title: 'React Class Components',
      content: `## Class Components (Legacy)

Class components are the **older way** of writing React components. Understand them to read legacy code.

### Basic Class Component

\`\`\`jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
\`\`\`

### State in Class Components

\`\`\`jsx
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}
\`\`\`

### Lifecycle Methods

\`\`\`jsx
class DataFetcher extends Component {
  componentDidMount() {
    // Runs after component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Runs after updates
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    // Cleanup before unmount
    this.cancelRequest();
  }

  render() {
    return <div>{this.state.data}</div>;
  }
}
\`\`\`

### Why Hooks Replaced Classes

| Issue with Classes | Hooks Solution |
|-------------------|----------------|
| Complex lifecycle | useEffect combines mount/update/unmount |
| \`this\` binding confusion | No \`this\` needed |
| Hard to share logic | Custom hooks |
| Larger bundle size | Smaller, tree-shakeable |
| Harder to test | Pure functions |

### When You'll See Classes

- Legacy codebases
- Error boundaries (still require classes)
- Some third-party libraries

**For new code, always use functional components with hooks.**`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Class vs Functional Components</h2>
<div id="demo"></div>

<script>
// Comparing Class and Functional Components

// CLASS COMPONENT STRUCTURE (pseudo-code)
let classComponent = {
  name: "Counter",
  type: "Class Component",
  code: \`
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <button onClick={this.increment}>
        {this.state.count}
      </button>
    );
  }
}
\`
};

// FUNCTIONAL COMPONENT (modern)
let functionalComponent = {
  name: "Counter",
  type: "Functional Component",
  code: \`
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
\`
};

let output = "<h3>Class vs Functional</h3>";

output += "<h4>❌ Class Component (Legacy)</h4>";
output += "<pre style='background:#fff3f3;padding:10px;overflow-x:auto'>" + classComponent.code + "</pre>";

output += "<h4>✅ Functional Component (Modern)</h4>";
output += "<pre style='background:#f3fff3;padding:10px;overflow-x:auto'>" + functionalComponent.code + "</pre>";

output += "<h4>Why Hooks Won:</h4>";
output += "<ul>";
output += "<li>No 'this' binding confusion</li>";
output += "<li>Simpler syntax</li>";
output += "<li>Easier to share logic (custom hooks)</li>";
output += "<li>Better for tree-shaking</li>";
output += "<li>Easier to test</li>";
output += "</ul>";

output += "<p><em>Use classes only for Error Boundaries or legacy code.</em></p>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },

    // PHASE 3 — PROPS, DATA FLOW & EVENTS
    props: {
      title: 'React Props',
      content: `## React Props

Props are how components receive data from their parents.

### One-Way Data Flow

Data flows **down** from parent to child. This is React's fundamental pattern.

\`\`\`jsx
// Parent passes data
function App() {
  return <UserCard name="Alice" role="Developer" />;
}

// Child receives props
function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}
\`\`\`

### Props vs State

| Props | State |
|-------|-------|
| Passed from parent | Owned by component |
| Read-only | Can be changed |
| Triggers re-render when changed | Triggers re-render when changed |
| Used for configuration | Used for interactivity |

### Immutability Rule

**Never modify props!**

\`\`\`jsx
// ❌ WRONG - mutating props
function BadComponent(props) {
  props.name = 'New Name';  // Don't do this!
  return <div>{props.name}</div>;
}

// ✅ CORRECT - props are read-only
function GoodComponent({ name }) {
  return <div>{name}</div>;
}
\`\`\`

### Default Props

\`\`\`jsx
function Button({ label = 'Click me', color = 'blue' }) {
  return (
    <button style={{ backgroundColor: color }}>
      {label}
    </button>
  );
}

// All these work:
<Button />
<Button label="Submit" />
<Button label="Cancel" color="red" />
\`\`\`

### Passing Functions as Props

\`\`\`jsx
function Parent() {
  const handleClick = (message) => {
    console.log(message);
  };

  return <Child onAction={handleClick} />;
}

function Child({ onAction }) {
  return (
    <button onClick={() => onAction('Hello from child!')}>
      Click me
    </button>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Props</h2>
<div id="root"></div>

<script>
// Props - One Way Data Flow

// Child component receives props
function UserCard(props) {
  return '<div style="border:1px solid #ddd;padding:15px;margin:10px;border-radius:8px">' +
    '<h3>' + props.name + '</h3>' +
    '<p>Role: ' + props.role + '</p>' +
    '<p>Department: ' + (props.department || 'Not specified') + '</p>' +
  '</div>';
}

// Parent component passes props
function App() {
  let users = [
    { name: "Alice", role: "Frontend Developer", department: "Engineering" },
    { name: "Bob", role: "Designer", department: "UX" },
    { name: "Charlie", role: "Manager" }  // No department - will use default
  ];
  
  let output = '<h3>Team Directory</h3>';
  output += '<p><em>Data flows from Parent (App) → Child (UserCard)</em></p>';
  
  users.forEach(function(user) {
    output += UserCard(user);  // Passing props
  });
  
  output += '<h4>Props Flow:</h4>';
  output += '<pre>App (parent) → UserCard (child)</pre>';
  output += '<p>Props are <strong>read-only</strong> - children cannot modify them!</p>';
  
  return output;
}

document.getElementById("root").innerHTML = App();
</script>

</body>
</html>`,
    },
    'props-destructuring': {
      title: 'Props Destructuring',
      content: `## Props Destructuring

Clean, readable component APIs through destructuring.

### Basic Destructuring

\`\`\`jsx
// Without destructuring
function UserCard(props) {
  return <h1>{props.name}</h1>;
}

// With destructuring (preferred)
function UserCard({ name, email, avatar }) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}
\`\`\`

### Default Values

\`\`\`jsx
function Button({ 
  label = 'Click me',
  size = 'medium',
  variant = 'primary',
  disabled = false
}) {
  return (
    <button 
      className={\`btn btn-\${size} btn-\${variant}\`}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
\`\`\`

### Rest Props

\`\`\`jsx
function Input({ label, error, ...inputProps }) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} />
      {error && <span className="error">{error}</span>}
    </div>
  );
}

// Usage - all extra props go to <input>
<Input
  label="Email"
  type="email"
  placeholder="Enter email"
  required
  error={errors.email}
/>
\`\`\`

### Nested Destructuring

\`\`\`jsx
function Profile({ 
  user: { name, email },
  settings: { theme = 'light' }
}) {
  return (
    <div className={theme}>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}
\`\`\`

### Renaming Props

\`\`\`jsx
function Item({ id: itemId, name: itemName }) {
  return <li data-id={itemId}>{itemName}</li>;
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Props Destructuring</h2>
<div id="demo"></div>

<script>
// Props Destructuring Patterns

// 1. Basic destructuring with defaults
function Button(props) {
  // Destructure with defaults
  let label = props.label || "Click me";
  let size = props.size || "medium";
  let variant = props.variant || "primary";
  
  let styles = {
    primary: "background:#61dafb;color:#282c34",
    secondary: "background:#282c34;color:#61dafb",
    danger: "background:#dc3545;color:white"
  };
  
  let sizes = {
    small: "padding:5px 10px;font-size:12px",
    medium: "padding:10px 20px;font-size:14px",
    large: "padding:15px 30px;font-size:18px"
  };
  
  return '<button style="' + styles[variant] + ';' + sizes[size] + ';border:none;border-radius:4px;margin:5px">' + label + '</button>';
}

// 2. Rest props pattern
function Input(props) {
  let label = props.label;
  let error = props.error;
  // Rest would go to input element
  
  let errorStyle = error ? "border-color:red" : "";
  
  return '<div style="margin:10px 0">' +
    '<label style="display:block;margin-bottom:5px">' + label + '</label>' +
    '<input type="' + (props.type || 'text') + '" placeholder="' + (props.placeholder || '') + '" style="padding:8px;border:1px solid #ccc;border-radius:4px;' + errorStyle + '" />' +
    (error ? '<span style="color:red;font-size:12px">' + error + '</span>' : '') +
  '</div>';
}

let output = "<h3>Destructuring Patterns</h3>";

// Button examples
output += "<h4>1. Buttons with Default Props</h4>";
output += Button({ label: "Primary", variant: "primary", size: "medium" });
output += Button({ label: "Secondary", variant: "secondary", size: "small" });
output += Button({ label: "Danger", variant: "danger", size: "large" });
output += Button({});  // Uses all defaults

// Input examples
output += "<h4>2. Input with Rest Props</h4>";
output += Input({ label: "Username", type: "text", placeholder: "Enter username" });
output += Input({ label: "Email", type: "email", placeholder: "Enter email", error: "Invalid email" });

output += "<h4>3. Pattern Summary</h4>";
output += "<pre>function Component({ prop1, prop2 = 'default', ...rest }) { }</pre>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'props-children': {
      title: 'Props Children',
      content: `## Props Children

The \`children\` prop enables component composition.

### Basic Children

\`\`\`jsx
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Usage
<Card>
  <h1>Title</h1>
  <p>Content goes here</p>
</Card>
\`\`\`

### Slot-Based Thinking

\`\`\`jsx
function Layout({ header, sidebar, children, footer }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
}

// Usage
<Layout
  header={<Navigation />}
  sidebar={<Menu />}
  footer={<Copyright />}
>
  <PageContent />
</Layout>
\`\`\`

### Composition vs Inheritance

React favors **composition** over inheritance:

\`\`\`jsx
// ❌ Inheritance thinking
class SpecialButton extends Button { ... }

// ✅ Composition thinking
function SpecialButton({ children, ...props }) {
  return (
    <Button {...props} className="special">
      <Icon name="star" />
      {children}
    </Button>
  );
}
\`\`\`

### Render Props Pattern

\`\`\`jsx
function DataProvider({ render }) {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return render(data);
}

// Usage
<DataProvider render={(data) => (
  <ul>
    {data.map(item => <li key={item.id}>{item.name}</li>)}
  </ul>
)} />
\`\`\`

### Children as Function

\`\`\`jsx
function Toggle({ children }) {
  const [isOn, setIsOn] = useState(false);
  
  return children({
    isOn,
    toggle: () => setIsOn(!isOn)
  });
}

// Usage
<Toggle>
  {({ isOn, toggle }) => (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  )}
</Toggle>
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Props Children</h2>
<div id="demo"></div>

<script>
// Children prop for composition

// Card component that accepts children
function Card(props) {
  return '<div style="border:1px solid #ddd;border-radius:8px;padding:20px;margin:10px 0;box-shadow:0 2px 4px rgba(0,0,0,0.1)">' +
    props.children +
  '</div>';
}

// Layout with multiple slots
function Layout(props) {
  return '<div style="display:grid;grid-template-columns:200px 1fr;gap:20px">' +
    '<aside style="background:#f5f5f5;padding:15px;border-radius:8px">' + props.sidebar + '</aside>' +
    '<main>' + props.children + '</main>' +
  '</div>';
}

// Alert component with icon
function Alert(props) {
  let icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
  let colors = { success: "#d4edda", error: "#f8d7da", warning: "#fff3cd", info: "#d1ecf1" };
  
  return '<div style="background:' + colors[props.type] + ';padding:15px;border-radius:4px;margin:10px 0">' +
    '<span style="margin-right:10px">' + icons[props.type] + '</span>' +
    props.children +
  '</div>';
}

let output = "<h3>Composition with Children</h3>";

// Card example
output += "<h4>1. Card Component</h4>";
output += Card({
  children: "<h3>Card Title</h3><p>This content is passed as children!</p>"
});

// Alert examples
output += "<h4>2. Alert Component</h4>";
output += Alert({ type: "success", children: "Operation completed successfully!" });
output += Alert({ type: "error", children: "Something went wrong." });
output += Alert({ type: "warning", children: "Please review your input." });

// Layout example
output += "<h4>3. Layout with Slots</h4>";
output += Layout({
  sidebar: "<strong>Sidebar</strong><ul><li>Menu 1</li><li>Menu 2</li></ul>",
  children: Card({ children: "<h3>Main Content</h3><p>Content rendered in the main slot.</p>" })
});

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    events: {
      title: 'React Events',
      content: `## React Events

React uses **Synthetic Events** - a cross-browser wrapper around native events.

### Basic Event Handling

\`\`\`jsx
function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
}
\`\`\`

### Event Object

\`\`\`jsx
function Form() {
  const handleChange = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);
  };

  return (
    <input 
      name="email"
      onChange={handleChange}
    />
  );
}
\`\`\`

### Passing Arguments

\`\`\`jsx
function List({ items, onDelete }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          {/* Arrow function to pass argument */}
          <button onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Preventing Default

\`\`\`jsx
function Form({ onSubmit }) {
  const handleSubmit = (event) => {
    event.preventDefault();  // Stop form submission
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

### Common Events

| Event | Description |
|-------|-------------|
| onClick | Click handler |
| onChange | Input value change |
| onSubmit | Form submission |
| onFocus / onBlur | Focus events |
| onMouseEnter / onMouseLeave | Hover events |
| onKeyDown / onKeyUp | Keyboard events |

### Event Bubbling

\`\`\`jsx
function Parent() {
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <button onClick={(e) => {
        e.stopPropagation();  // Prevent bubbling
        console.log('Button clicked');
      }}>
        Click me
      </button>
    </div>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Events</h2>
<div id="demo"></div>
<div id="log" style="margin-top:20px;padding:10px;background:#f5f5f5;border-radius:4px;min-height:100px"></div>

<script>
let logs = [];

function log(message) {
  logs.push(new Date().toLocaleTimeString() + ": " + message);
  document.getElementById("log").innerHTML = "<h4>Event Log:</h4>" + logs.slice(-5).map(l => "<div>" + l + "</div>").join("");
}

// Event examples
function render() {
  let output = "<h3>Event Handling Examples</h3>";
  
  // Click event
  output += "<h4>1. onClick</h4>";
  output += '<button onclick="log(\\'Button clicked!\\')" style="padding:10px 20px;margin:5px">Click Me</button>';
  
  // Input change
  output += "<h4>2. onChange</h4>";
  output += '<input type="text" placeholder="Type something..." oninput="log(\\'Input: \\' + this.value)" style="padding:8px;margin:5px" />';
  
  // Form submit
  output += "<h4>3. onSubmit (with preventDefault)</h4>";
  output += '<form onsubmit="event.preventDefault(); log(\\'Form submitted!\\'); return false;">';
  output += '<input type="text" placeholder="Name" style="padding:8px;margin:5px" />';
  output += '<button type="submit" style="padding:8px 16px">Submit</button>';
  output += '</form>';
  
  // Mouse events
  output += "<h4>4. Mouse Events</h4>";
  output += '<div onmouseenter="log(\\'Mouse entered!\\')" onmouseleave="log(\\'Mouse left!\\')" style="padding:20px;background:#61dafb;display:inline-block;border-radius:4px;cursor:pointer">Hover over me!</div>';
  
  // Keyboard event
  output += "<h4>5. Keyboard Events</h4>";
  output += '<input type="text" placeholder="Press any key..." onkeydown="log(\\'Key: \\' + event.key)" style="padding:8px;margin:5px" />';
  
  // Event bubbling
  output += "<h4>6. Event Bubbling</h4>";
  output += '<div onclick="log(\\'Parent clicked\\')" style="padding:20px;background:#ddd;border-radius:4px">';
  output += '<button onclick="event.stopPropagation(); log(\\'Button clicked (stopped propagation)\\')" style="padding:10px">Click (stops bubbling)</button>';
  output += '</div>';
  
  return output;
}

document.getElementById("demo").innerHTML = render();
</script>

</body>
</html>`,
    },
    conditionals: {
      title: 'React Conditionals',
      content: `## Conditional Rendering

Multiple patterns for rendering content conditionally.

### Ternary Operator

\`\`\`jsx
function Greeting({ isLoggedIn }) {
  return (
    <h1>
      {isLoggedIn ? 'Welcome back!' : 'Please log in'}
    </h1>
  );
}
\`\`\`

### Logical AND (&&)

\`\`\`jsx
function Notification({ message, show }) {
  return (
    <div>
      {show && <div className="notification">{message}</div>}
    </div>
  );
}
\`\`\`

### Nullish Coalescing

\`\`\`jsx
function UserGreeting({ name }) {
  return <h1>Hello, {name ?? 'Guest'}!</h1>;
}
\`\`\`

### Early Return

\`\`\`jsx
function Profile({ user, loading, error }) {
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <NotFound />;

  return <UserCard user={user} />;
}
\`\`\`

### Element Variables

\`\`\`jsx
function LoginControl({ isLoggedIn }) {
  let button;
  
  if (isLoggedIn) {
    button = <LogoutButton />;
  } else {
    button = <LoginButton />;
  }

  return (
    <nav>
      {button}
    </nav>
  );
}
\`\`\`

### Preventing Rendering

\`\`\`jsx
function Warning({ show, message }) {
  if (!show) {
    return null;  // Renders nothing
  }
  
  return <div className="warning">{message}</div>;
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Conditional Rendering</h2>
<div id="demo"></div>

<script>
// State for demo
let state = {
  isLoggedIn: true,
  hasNotification: true,
  notificationCount: 3,
  userName: null,  // Will use fallback
  isLoading: false,
  error: null
};

function render() {
  let output = "<h3>Conditional Patterns</h3>";
  
  // 1. Ternary
  output += "<h4>1. Ternary Operator</h4>";
  output += "<p>" + (state.isLoggedIn ? "✅ Welcome back!" : "❌ Please log in") + "</p>";
  output += '<button onclick="toggleLogin()">Toggle Login</button>';
  
  // 2. Logical AND
  output += "<h4>2. Logical AND (&&)</h4>";
  if (state.hasNotification && state.notificationCount > 0) {
    output += '<div style="background:#61dafb;padding:10px;border-radius:4px">🔔 You have ' + state.notificationCount + ' notifications</div>';
  }
  output += '<button onclick="toggleNotification()">Toggle Notification</button>';
  
  // 3. Nullish coalescing
  output += "<h4>3. Nullish Coalescing (??)</h4>";
  output += "<p>Hello, " + (state.userName ?? "Guest") + "!</p>";
  output += '<button onclick="toggleName()">Toggle Name</button>';
  
  // 4. Early return / Guard clauses
  output += "<h4>4. Guard Clauses</h4>";
  output += renderProfile();
  output += '<button onclick="cycleState()">Cycle State</button>';
  
  return output;
}

function renderProfile() {
  if (state.isLoading) return '<div style="color:orange">⏳ Loading...</div>';
  if (state.error) return '<div style="color:red">❌ Error: ' + state.error + '</div>';
  if (!state.isLoggedIn) return '<div style="color:gray">👤 Please log in to see profile</div>';
  return '<div style="color:green">✅ User Profile Loaded!</div>';
}

function toggleLogin() {
  state.isLoggedIn = !state.isLoggedIn;
  document.getElementById("demo").innerHTML = render();
}

function toggleNotification() {
  state.hasNotification = !state.hasNotification;
  document.getElementById("demo").innerHTML = render();
}

function toggleName() {
  state.userName = state.userName ? null : "Alice";
  document.getElementById("demo").innerHTML = render();
}

let stateIndex = 0;
function cycleState() {
  let states = [
    { isLoading: true, error: null },
    { isLoading: false, error: "Network error" },
    { isLoading: false, error: null }
  ];
  stateIndex = (stateIndex + 1) % states.length;
  Object.assign(state, states[stateIndex]);
  document.getElementById("demo").innerHTML = render();
}

document.getElementById("demo").innerHTML = render();
</script>

</body>
</html>`,
    },
    lists: {
      title: 'React Lists',
      content: `## Rendering Lists

Use \`.map()\` to render arrays as JSX elements.

### Basic List Rendering

\`\`\`jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
\`\`\`

### The Key Prop

Keys help React identify which items have changed:

\`\`\`jsx
// ✅ Good - stable, unique identifier
{items.map(item => (
  <ListItem key={item.id} {...item} />
))}

// ⚠️ Acceptable only if list is static
{items.map((item, index) => (
  <ListItem key={index} {...item} />
))}

// ❌ Bad - keys should be unique
{items.map(item => (
  <ListItem key={Math.random()} {...item} />
))}
\`\`\`

### Why Keys Matter

- **Performance**: React uses keys to minimize DOM updates
- **State preservation**: Keys help React track component instances
- **Correct behavior**: Wrong keys cause bugs with stateful components

### Extracting Components

\`\`\`jsx
// Clean separation
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
}

function UserListItem({ user }) {
  return (
    <li>
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </li>
  );
}
\`\`\`

### Filtering and Sorting

\`\`\`jsx
function ProductList({ products, filter, sortBy }) {
  const filteredProducts = products
    .filter(p => p.category === filter)
    .sort((a, b) => a[sortBy] - b[sortBy]);

  return (
    <div>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Rendering Lists</h2>
<div id="demo"></div>

<script>
// List rendering examples

let todos = [
  { id: 1, text: "Learn React", done: true },
  { id: 2, text: "Build a project", done: false },
  { id: 3, text: "Deploy to production", done: false },
  { id: 4, text: "Get hired!", done: false }
];

let users = [
  { id: 1, name: "Alice", role: "Developer", avatar: "👩‍💻" },
  { id: 2, name: "Bob", role: "Designer", avatar: "👨‍🎨" },
  { id: 3, name: "Charlie", role: "Manager", avatar: "👨‍💼" }
];

function TodoList(items) {
  let output = '<ul style="list-style:none;padding:0">';
  items.forEach(function(item) {
    let style = item.done ? "text-decoration:line-through;color:#888" : "";
    output += '<li style="padding:8px;border-bottom:1px solid #eee;' + style + '">';
    output += '<input type="checkbox" ' + (item.done ? 'checked' : '') + ' onclick="toggleTodo(' + item.id + ')" /> ';
    output += '<span>key={' + item.id + '}</span> ' + item.text;
    output += '</li>';
  });
  output += '</ul>';
  return output;
}

function UserList(users) {
  let output = '<div style="display:flex;gap:15px;flex-wrap:wrap">';
  users.forEach(function(user) {
    output += '<div style="border:1px solid #ddd;padding:15px;border-radius:8px;text-align:center">';
    output += '<div style="font-size:40px">' + user.avatar + '</div>';
    output += '<h4 style="margin:5px 0">' + user.name + '</h4>';
    output += '<p style="margin:0;color:#666;font-size:14px">' + user.role + '</p>';
    output += '<small style="color:#999">key={' + user.id + '}</small>';
    output += '</div>';
  });
  output += '</div>';
  return output;
}

function render() {
  let output = "<h3>List Rendering with Keys</h3>";
  
  output += "<h4>1. Todo List</h4>";
  output += TodoList(todos);
  
  output += "<h4>2. User Cards</h4>";
  output += UserList(users);
  
  output += "<h4>3. Why Keys Matter</h4>";
  output += "<ul>";
  output += "<li>✅ Use stable, unique IDs (like database IDs)</li>";
  output += "<li>⚠️ Use index only for static lists</li>";
  output += "<li>❌ Never use Math.random() as keys</li>";
  output += "</ul>";
  
  return output;
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
  document.getElementById("demo").innerHTML = render();
}

document.getElementById("demo").innerHTML = render();
</script>

</body>
</html>`,
    },

    // PHASE 4 — FORMS
    forms: {
      title: 'React Forms',
      content: `## React Forms

React forms use **controlled components** where React controls the form state.

### Controlled vs Uncontrolled

\`\`\`jsx
// Controlled - React owns the value
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled - DOM owns the value
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
\`\`\`

### Single Source of Truth

With controlled components, React state is the **single source of truth**:

\`\`\`jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

### Form State Object

\`\`\`jsx
function SignupForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="password" value={form.password} onChange={handleChange} />
    </form>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Forms</h2>
<div id="demo"></div>
<div id="formOutput" style="margin-top:15px;padding:15px;background:#f5f5f5;border-radius:8px"></div>

<script>
// Form state
let formData = {
  name: "",
  email: "",
  password: ""
};

function handleChange(field, value) {
  formData[field] = value;
  updateOutput();
}

function handleSubmit(event) {
  event.preventDefault();
  alert("Form submitted!\\n" + JSON.stringify(formData, null, 2));
  return false;
}

function updateOutput() {
  document.getElementById("formOutput").innerHTML = 
    "<h4>Form State (Single Source of Truth):</h4>" +
    "<pre>" + JSON.stringify(formData, null, 2) + "</pre>";
}

function render() {
  let output = "<h3>Controlled Form</h3>";
  
  output += '<form onsubmit="return handleSubmit(event)">';
  
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Name:</label>';
  output += '<input type="text" value="' + formData.name + '" oninput="handleChange(\\'name\\', this.value)" style="padding:8px;width:200px" />';
  output += '</div>';
  
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Email:</label>';
  output += '<input type="email" value="' + formData.email + '" oninput="handleChange(\\'email\\', this.value)" style="padding:8px;width:200px" />';
  output += '</div>';
  
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Password:</label>';
  output += '<input type="password" value="' + formData.password + '" oninput="handleChange(\\'password\\', this.value)" style="padding:8px;width:200px" />';
  output += '</div>';
  
  output += '<button type="submit" style="padding:10px 20px;background:#61dafb;border:none;border-radius:4px;cursor:pointer">Submit</button>';
  output += '</form>';
  
  output += "<h4>Key Concepts:</h4>";
  output += "<ul>";
  output += "<li><strong>Controlled:</strong> React state drives input values</li>";
  output += "<li><strong>onChange:</strong> Updates state on every keystroke</li>";
  output += "<li><strong>Single Source:</strong> State is the truth, DOM reflects it</li>";
  output += "</ul>";
  
  return output;
}

document.getElementById("demo").innerHTML = render();
updateOutput();
</script>

</body>
</html>`,
    },
    'forms-submit': {
      title: 'Forms Submit',
      content: `## Form Submission

Handling form submission in React.

### Preventing Default

\`\`\`jsx
function ContactForm() {
  const handleSubmit = (event) => {
    event.preventDefault();  // Stop page reload
    // Process form data
    submitToAPI(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit">Send</button>
    </form>
  );
}
\`\`\`

### With Validation

\`\`\`jsx
function SignupForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = 'Email is required';
    if (form.password.length < 8) {
      newErrors.password = 'Password must be 8+ characters';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm(form);
      // Success handling
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
\`\`\`

### Reset Form

\`\`\`jsx
const initialState = { name: '', email: '' };

function Form() {
  const [form, setForm] = useState(initialState);

  const handleReset = () => {
    setForm(initialState);
  };

  return (
    <form>
      {/* fields */}
      <button type="button" onClick={handleReset}>Reset</button>
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Form Submission</h2>
<div id="demo"></div>

<script>
let form = { email: "", password: "" };
let errors = {};
let isSubmitting = false;
let submitResult = null;

function validate() {
  errors = {};
  if (!form.email) {
    errors.email = "Email is required";
  } else if (!form.email.includes("@")) {
    errors.email = "Invalid email format";
  }
  if (form.password.length < 8) {
    errors.password = "Password must be 8+ characters";
  }
  return Object.keys(errors).length === 0;
}

function handleSubmit(event) {
  event.preventDefault();
  submitResult = null;
  
  if (!validate()) {
    render();
    return false;
  }
  
  isSubmitting = true;
  render();
  
  // Simulate API call
  setTimeout(function() {
    isSubmitting = false;
    submitResult = "✅ Form submitted successfully!";
    render();
  }, 1500);
  
  return false;
}

function handleReset() {
  form = { email: "", password: "" };
  errors = {};
  submitResult = null;
  render();
}

function updateField(field, value) {
  form[field] = value;
  if (errors[field]) {
    delete errors[field];
    render();
  }
}

function render() {
  let output = "<h3>Form with Validation</h3>";
  
  output += '<form onsubmit="return handleSubmit(event)">';
  
  // Email field
  output += '<div style="margin:10px 0">';
  output += '<label>Email:</label><br>';
  output += '<input type="text" value="' + form.email + '" oninput="updateField(\\'email\\', this.value)" style="padding:8px;width:250px;border:1px solid ' + (errors.email ? 'red' : '#ccc') + '" />';
  if (errors.email) {
    output += '<div style="color:red;font-size:12px">' + errors.email + '</div>';
  }
  output += '</div>';
  
  // Password field
  output += '<div style="margin:10px 0">';
  output += '<label>Password:</label><br>';
  output += '<input type="password" value="' + form.password + '" oninput="updateField(\\'password\\', this.value)" style="padding:8px;width:250px;border:1px solid ' + (errors.password ? 'red' : '#ccc') + '" />';
  if (errors.password) {
    output += '<div style="color:red;font-size:12px">' + errors.password + '</div>';
  }
  output += '</div>';
  
  // Buttons
  output += '<div style="margin:15px 0">';
  output += '<button type="submit" style="padding:10px 20px;background:#61dafb;border:none;border-radius:4px;margin-right:10px" ' + (isSubmitting ? 'disabled' : '') + '>';
  output += isSubmitting ? '⏳ Submitting...' : 'Submit';
  output += '</button>';
  output += '<button type="button" onclick="handleReset()" style="padding:10px 20px;background:#ddd;border:none;border-radius:4px">Reset</button>';
  output += '</div>';
  
  output += '</form>';
  
  if (submitResult) {
    output += '<div style="padding:15px;background:#d4edda;border-radius:4px;margin-top:15px">' + submitResult + '</div>';
  }
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    textarea: {
      title: 'React Textarea',
      content: `## Textarea in React

Textarea works like input with a value prop.

### Controlled Textarea

\`\`\`jsx
function TextEditor() {
  const [content, setContent] = useState('');

  return (
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows={10}
      cols={50}
      placeholder="Write your content..."
    />
  );
}
\`\`\`

### Character Counter

\`\`\`jsx
function LimitedTextarea({ maxLength = 280 }) {
  const [text, setText] = useState('');

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, maxLength))}
        rows={4}
      />
      <div>
        {text.length}/{maxLength}
      </div>
    </div>
  );
}
\`\`\`

### Auto-resize Textarea

\`\`\`jsx
function AutoResizeTextarea() {
  const textareaRef = useRef();

  const handleChange = (e) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <textarea
      ref={textareaRef}
      onChange={handleChange}
      style={{ overflow: 'hidden', resize: 'none' }}
    />
  );
}
\`\`\`

### With Form State

\`\`\`jsx
function FeedbackForm() {
  const [form, setForm] = useState({
    name: '',
    feedback: ''
  });

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <textarea
        name="feedback"
        value={form.feedback}
        onChange={(e) => setForm({ ...form, feedback: e.target.value })}
        rows={5}
      />
    </form>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Textarea</h2>
<div id="demo"></div>

<script>
let textContent = "";
let maxLength = 280;

function handleChange(value) {
  textContent = value.slice(0, maxLength);
  render();
}

function render() {
  let remaining = maxLength - textContent.length;
  let counterColor = remaining < 20 ? (remaining < 0 ? "red" : "orange") : "green";
  
  let output = "<h3>Controlled Textarea</h3>";
  
  output += '<div style="margin:10px 0">';
  output += '<textarea oninput="handleChange(this.value)" rows="5" style="width:100%;max-width:400px;padding:10px;font-family:inherit;font-size:14px;border:1px solid #ccc;border-radius:4px">' + textContent + '</textarea>';
  output += '</div>';
  
  output += '<div style="display:flex;justify-content:space-between;max-width:400px">';
  output += '<span style="color:' + counterColor + '">' + textContent.length + '/' + maxLength + ' characters</span>';
  if (remaining < 20) {
    output += '<span style="color:' + counterColor + '">' + remaining + ' remaining</span>';
  }
  output += '</div>';
  
  // Preview
  if (textContent) {
    output += '<div style="margin-top:20px">';
    output += '<h4>Preview:</h4>';
    output += '<div style="padding:15px;background:#f5f5f5;border-radius:4px;white-space:pre-wrap">' + textContent + '</div>';
    output += '</div>';
  }
  
  output += '<h4 style="margin-top:20px">Key Points:</h4>';
  output += '<ul>';
  output += '<li>Use <code>value</code> prop (not children like HTML)</li>';
  output += '<li>Character limiting with slice()</li>';
  output += '<li>Real-time preview possible</li>';
  output += '</ul>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    select: {
      title: 'React Select',
      content: `## Select Dropdowns

React handles select with the value prop on the select element.

### Basic Select

\`\`\`jsx
function ColorPicker() {
  const [color, setColor] = useState('blue');

  return (
    <select value={color} onChange={(e) => setColor(e.target.value)}>
      <option value="red">Red</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
    </select>
  );
}
\`\`\`

### Dynamic Options

\`\`\`jsx
function CountrySelect({ countries }) {
  const [selected, setSelected] = useState('');

  return (
    <select value={selected} onChange={(e) => setSelected(e.target.value)}>
      <option value="">Select a country</option>
      {countries.map(country => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}
\`\`\`

### Multiple Select

\`\`\`jsx
function MultiSelect({ options }) {
  const [selected, setSelected] = useState([]);

  const handleChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      option => option.value
    );
    setSelected(values);
  };

  return (
    <select multiple value={selected} onChange={handleChange}>
      {options.map(opt => (
        <option key={opt.id} value={opt.id}>{opt.label}</option>
      ))}
    </select>
  );
}
\`\`\`

### Grouped Options

\`\`\`jsx
function GroupedSelect() {
  return (
    <select>
      <optgroup label="Fruits">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </optgroup>
      <optgroup label="Vegetables">
        <option value="carrot">Carrot</option>
        <option value="broccoli">Broccoli</option>
      </optgroup>
    </select>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Select</h2>
<div id="demo"></div>

<script>
let selectedColor = "blue";
let selectedCountry = "";
let selectedSkills = [];

let countries = [
  { code: "us", name: "United States" },
  { code: "uk", name: "United Kingdom" },
  { code: "in", name: "India" },
  { code: "de", name: "Germany" },
  { code: "jp", name: "Japan" }
];

let skills = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "node", label: "Node.js" }
];

function handleColorChange(value) {
  selectedColor = value;
  render();
}

function handleCountryChange(value) {
  selectedCountry = value;
  render();
}

function handleSkillChange(select) {
  selectedSkills = Array.from(select.selectedOptions).map(o => o.value);
  render();
}

function render() {
  let output = "<h3>Select Examples</h3>";
  
  // Basic Select
  output += "<h4>1. Basic Select</h4>";
  output += '<select onchange="handleColorChange(this.value)" style="padding:8px;font-size:14px">';
  ["red", "blue", "green", "purple"].forEach(function(c) {
    output += '<option value="' + c + '"' + (c === selectedColor ? ' selected' : '') + '>' + c.charAt(0).toUpperCase() + c.slice(1) + '</option>';
  });
  output += '</select>';
  output += '<div style="width:50px;height:50px;background:' + selectedColor + ';margin-top:10px;border-radius:4px"></div>';
  
  // Dynamic Options
  output += "<h4>2. Dynamic Options</h4>";
  output += '<select onchange="handleCountryChange(this.value)" style="padding:8px;font-size:14px">';
  output += '<option value="">Select a country</option>';
  countries.forEach(function(c) {
    output += '<option value="' + c.code + '"' + (c.code === selectedCountry ? ' selected' : '') + '>' + c.name + '</option>';
  });
  output += '</select>';
  if (selectedCountry) {
    let country = countries.find(c => c.code === selectedCountry);
    output += '<p>Selected: <strong>' + country.name + '</strong> (' + country.code.toUpperCase() + ')</p>';
  }
  
  // Multiple Select
  output += "<h4>3. Multiple Select</h4>";
  output += '<select multiple onchange="handleSkillChange(this)" style="padding:8px;font-size:14px;height:120px">';
  skills.forEach(function(s) {
    output += '<option value="' + s.id + '"' + (selectedSkills.includes(s.id) ? ' selected' : '') + '>' + s.label + '</option>';
  });
  output += '</select>';
  output += '<p>Hold Ctrl/Cmd to select multiple</p>';
  if (selectedSkills.length > 0) {
    output += '<p>Selected: <strong>' + selectedSkills.join(", ") + '</strong></p>';
  }
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    'multiple-inputs': {
      title: 'Multiple Inputs',
      content: `## Handling Multiple Inputs

Use a single handler for multiple inputs with the name attribute.

### Single Handler Pattern

\`\`\`jsx
function RegistrationForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value  // Computed property name
    }));
  };

  return (
    <form>
      <input name="firstName" value={form.firstName} onChange={handleChange} />
      <input name="lastName" value={form.lastName} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <input name="phone" value={form.phone} onChange={handleChange} />
    </form>
  );
}
\`\`\`

### With Different Input Types

\`\`\`jsx
function ProfileForm() {
  const [profile, setProfile] = useState({
    name: '',
    age: 0,
    bio: '',
    isPublic: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form>
      <input name="name" type="text" onChange={handleChange} />
      <input name="age" type="number" onChange={handleChange} />
      <textarea name="bio" onChange={handleChange} />
      <input name="isPublic" type="checkbox" onChange={handleChange} />
    </form>
  );
}
\`\`\`

### Reusable Input Component

\`\`\`jsx
function FormInput({ label, name, type = 'text', value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Multiple Inputs</h2>
<div id="demo"></div>
<pre id="state" style="background:#f5f5f5;padding:15px;border-radius:4px"></pre>

<script>
// Single form state object
let form = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  bio: ""
};

// Single handler for all inputs
function handleChange(event) {
  let name = event.target.name;
  let value = event.target.value;
  
  form[name] = value;
  updateState();
}

function updateState() {
  document.getElementById("state").innerHTML = 
    "<strong>Form State:</strong>\\n" + JSON.stringify(form, null, 2);
}

function render() {
  let output = "<h3>Single Handler for Multiple Inputs</h3>";
  
  output += '<form style="max-width:400px">';
  
  // First Name
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">First Name:</label>';
  output += '<input type="text" name="firstName" value="' + form.firstName + '" oninput="handleChange(event)" style="width:100%;padding:8px;box-sizing:border-box" />';
  output += '</div>';
  
  // Last Name
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Last Name:</label>';
  output += '<input type="text" name="lastName" value="' + form.lastName + '" oninput="handleChange(event)" style="width:100%;padding:8px;box-sizing:border-box" />';
  output += '</div>';
  
  // Email
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Email:</label>';
  output += '<input type="email" name="email" value="' + form.email + '" oninput="handleChange(event)" style="width:100%;padding:8px;box-sizing:border-box" />';
  output += '</div>';
  
  // Age
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Age:</label>';
  output += '<input type="number" name="age" value="' + form.age + '" oninput="handleChange(event)" style="width:100%;padding:8px;box-sizing:border-box" />';
  output += '</div>';
  
  // Bio
  output += '<div style="margin:10px 0">';
  output += '<label style="display:block;margin-bottom:5px">Bio:</label>';
  output += '<textarea name="bio" oninput="handleChange(event)" rows="3" style="width:100%;padding:8px;box-sizing:border-box">' + form.bio + '</textarea>';
  output += '</div>';
  
  output += '</form>';
  
  output += '<h4>The Pattern:</h4>';
  output += '<pre style="background:#e8f4fc;padding:10px;border-radius:4px">';
  output += 'const handleChange = (e) => {\\n';
  output += '  const { name, value } = e.target;\\n';
  output += '  setForm(prev => ({\\n';
  output += '    ...prev,\\n';
  output += '    [name]: value  // Computed property\\n';
  output += '  }));\\n';
  output += '};';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
  updateState();
}

render();
</script>

</body>
</html>`,
    },
    'checkbox-radio': {
      title: 'Checkbox & Radio',
      content: `## Checkbox and Radio Inputs

Handle checked inputs differently from text inputs.

### Single Checkbox

\`\`\`jsx
function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={subscribed}
        onChange={(e) => setSubscribed(e.target.checked)}
      />
      Subscribe to newsletter
    </label>
  );
}
\`\`\`

### Multiple Checkboxes

\`\`\`jsx
function Preferences() {
  const [prefs, setPrefs] = useState({
    notifications: true,
    darkMode: false,
    autoSave: true
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setPrefs(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div>
      <label>
        <input type="checkbox" name="notifications"
          checked={prefs.notifications} onChange={handleChange} />
        Notifications
      </label>
      <label>
        <input type="checkbox" name="darkMode"
          checked={prefs.darkMode} onChange={handleChange} />
        Dark Mode
      </label>
    </div>
  );
}
\`\`\`

### Radio Buttons

\`\`\`jsx
function PaymentMethod() {
  const [method, setMethod] = useState('card');

  return (
    <div>
      <label>
        <input type="radio" name="payment" value="card"
          checked={method === 'card'}
          onChange={(e) => setMethod(e.target.value)} />
        Credit Card
      </label>
      <label>
        <input type="radio" name="payment" value="paypal"
          checked={method === 'paypal'}
          onChange={(e) => setMethod(e.target.value)} />
        PayPal
      </label>
      <label>
        <input type="radio" name="payment" value="bank"
          checked={method === 'bank'}
          onChange={(e) => setMethod(e.target.value)} />
        Bank Transfer
      </label>
    </div>
  );
}
\`\`\`

### Key Difference

| Text Inputs | Checkboxes/Radio |
|-------------|------------------|
| \`value={state}\` | \`checked={state}\` |
| \`e.target.value\` | \`e.target.checked\` |`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Checkbox & Radio</h2>
<div id="demo"></div>

<script>
// State
let preferences = {
  notifications: true,
  darkMode: false,
  autoSave: true
};

let paymentMethod = "card";
let selectedToppings = ["cheese"];

let toppings = ["cheese", "pepperoni", "mushrooms", "olives", "onions"];

function handlePrefChange(name, checked) {
  preferences[name] = checked;
  render();
}

function handlePaymentChange(value) {
  paymentMethod = value;
  render();
}

function handleToppingChange(topping, checked) {
  if (checked) {
    selectedToppings.push(topping);
  } else {
    selectedToppings = selectedToppings.filter(t => t !== topping);
  }
  render();
}

function render() {
  let output = "";
  
  // Checkbox - Single
  output += "<h3>1. Single Checkbox</h3>";
  output += '<label style="display:block;margin:5px 0">';
  output += '<input type="checkbox" ' + (preferences.notifications ? 'checked' : '') + ' onchange="handlePrefChange(\\'notifications\\', this.checked)" /> ';
  output += 'Enable Notifications';
  output += '</label>';
  output += '<label style="display:block;margin:5px 0">';
  output += '<input type="checkbox" ' + (preferences.darkMode ? 'checked' : '') + ' onchange="handlePrefChange(\\'darkMode\\', this.checked)" /> ';
  output += 'Dark Mode';
  output += '</label>';
  output += '<label style="display:block;margin:5px 0">';
  output += '<input type="checkbox" ' + (preferences.autoSave ? 'checked' : '') + ' onchange="handlePrefChange(\\'autoSave\\', this.checked)" /> ';
  output += 'Auto Save';
  output += '</label>';
  output += '<p>Preferences: ' + JSON.stringify(preferences) + '</p>';
  
  // Radio Buttons
  output += "<h3>2. Radio Buttons</h3>";
  ["card", "paypal", "bank"].forEach(function(method) {
    let labels = { card: "💳 Credit Card", paypal: "🅿️ PayPal", bank: "🏦 Bank Transfer" };
    output += '<label style="display:block;margin:5px 0">';
    output += '<input type="radio" name="payment" value="' + method + '" ' + (paymentMethod === method ? 'checked' : '') + ' onchange="handlePaymentChange(this.value)" /> ';
    output += labels[method];
    output += '</label>';
  });
  output += '<p>Selected: <strong>' + paymentMethod + '</strong></p>';
  
  // Multiple Checkboxes (Array)
  output += "<h3>3. Multiple Checkboxes (Array)</h3>";
  output += '<p>Select pizza toppings:</p>';
  toppings.forEach(function(t) {
    output += '<label style="display:inline-block;margin:5px 10px 5px 0">';
    output += '<input type="checkbox" ' + (selectedToppings.includes(t) ? 'checked' : '') + ' onchange="handleToppingChange(\\'' + t + '\\', this.checked)" /> ';
    output += t.charAt(0).toUpperCase() + t.slice(1);
    output += '</label>';
  });
  output += '<p>Selected: <strong>' + selectedToppings.join(", ") + '</strong></p>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 5 — STYLING
    'css-styling': {
      title: 'CSS Styling',
      content: `## CSS Styling in React

Multiple approaches to styling React components.

### Inline Styles

\`\`\`jsx
function Card() {
  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return <div style={cardStyle}>Content</div>;
}
\`\`\`

### External CSS

\`\`\`jsx
// styles.css
.card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
}

// Component.jsx
import './styles.css';

function Card() {
  return <div className="card">Content</div>;
}
\`\`\`

### Dynamic Styling

\`\`\`jsx
function Button({ variant, size }) {
  const className = \`btn btn-\${variant} btn-\${size}\`;
  
  return (
    <button className={className}>
      Click
    </button>
  );
}

// Conditional classes
<div className={\`card \${isActive ? 'active' : ''}\`}>
\`\`\`

### Global CSS Risks

- **Name collisions**: Same class name in different files
- **Specificity wars**: !important everywhere
- **Dead code**: Hard to remove unused styles

### Naming Conventions

**BEM (Block Element Modifier):**
\`\`\`css
.card { }
.card__title { }
.card__title--large { }
.card--featured { }
\`\`\`

**In React:**
\`\`\`jsx
<div className="card card--featured">
  <h2 className="card__title card__title--large">
    Title
  </h2>
</div>
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>CSS Styling in React</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "";
  
  // 1. Inline Styles
  output += "<h3>1. Inline Styles</h3>";
  output += '<div style="background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);margin:10px 0">';
  output += '<p>style={{ backgroundColor: "#fff", padding: "20px" }}</p>';
  output += '</div>';
  
  // 2. External CSS classes
  output += "<h3>2. External CSS Classes</h3>";
  output += '<div class="card">className="card"</div>';
  
  // 3. Dynamic classes
  output += "<h3>3. Dynamic Classes</h3>";
  let variants = ["primary", "secondary", "danger"];
  variants.forEach(function(v) {
    output += '<button class="btn btn-' + v + '">' + v + '</button> ';
  });
  
  // 4. BEM Naming
  output += "<h3>4. BEM Convention</h3>";
  output += '<div class="profile-card profile-card--featured">';
  output += '<img class="profile-card__avatar" src="https://i.pravatar.cc/60" />';
  output += '<h4 class="profile-card__name">Alice Developer</h4>';
  output += '<p class="profile-card__role profile-card__role--highlight">Frontend Engineer</p>';
  output += '</div>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

<style>
/* External CSS */
.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin: 10px 0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin: 5px;
  cursor: pointer;
  font-size: 14px;
}
.btn-primary { background: #61dafb; color: #282c34; }
.btn-secondary { background: #282c34; color: #61dafb; }
.btn-danger { background: #dc3545; color: white; }

/* BEM Example */
.profile-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 10px 0;
}
.profile-card--featured {
  border-left: 4px solid #61dafb;
}
.profile-card__avatar {
  border-radius: 50%;
}
.profile-card__name {
  margin: 0;
}
.profile-card__role {
  margin: 0;
  color: #666;
}
.profile-card__role--highlight {
  color: #61dafb;
  font-weight: bold;
}
</style>

</body>
</html>`,
    },
    'css-modules': {
      title: 'CSS Modules',
      content: `## CSS Modules

Locally scoped CSS that prevents naming collisions.

### How It Works

\`\`\`css
/* Button.module.css */
.button {
  padding: 10px 20px;
  border-radius: 4px;
}

.primary {
  background: #61dafb;
  color: #282c34;
}
\`\`\`

\`\`\`jsx
// Button.jsx
import styles from './Button.module.css';

function Button({ children, variant = 'primary' }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  );
}
\`\`\`

### Generated Class Names

CSS Modules generates unique class names:

\`\`\`html
<!-- Input -->
<button className={styles.button}>

<!-- Output (production) -->
<button class="Button_button__x7Z3a">
\`\`\`

### Composing Styles

\`\`\`css
/* styles.module.css */
.base {
  padding: 10px;
  border-radius: 4px;
}

.primary {
  composes: base;
  background: blue;
}

.secondary {
  composes: base;
  background: gray;
}
\`\`\`

### Global Styles in Modules

\`\`\`css
/* Still add global classes when needed */
:global(.active) {
  opacity: 1;
}

.button :global(.icon) {
  margin-right: 8px;
}
\`\`\`

### When to Use CSS Modules

- ✅ Medium to large projects
- ✅ Team environments
- ✅ Component libraries
- ✅ When you want to avoid CSS-in-JS runtime

### Benefits

- No class name collisions
- Clear dependency (explicit imports)
- Dead code elimination
- Standard CSS (no new syntax to learn)`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>CSS Modules Concept</h2>
<div id="demo"></div>

<script>
// Simulating CSS Modules behavior
// In real React, you import: import styles from './Button.module.css';

let styles = {
  button: "Button_button__x7Z3a",
  primary: "Button_primary__k2M9b",
  secondary: "Button_secondary__n4P1c",
  danger: "Button_danger__q8R2d"
};

function Button(props) {
  let variant = props.variant || "primary";
  let classNames = styles.button + " " + styles[variant];
  return '<button class="' + classNames + '">' + props.children + '</button>';
}

function render() {
  let output = "<h3>CSS Modules Example</h3>";
  
  output += "<h4>1. Component Usage</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px">';
  output += "import styles from './Button.module.css';\\n\\n";
  output += "function Button({ variant }) {\\n";
  output += "  return (\\n";
  output += "    &lt;button className={" + String.fromCharCode(96) + String.fromCharCode(36) + "{styles.button} " + String.fromCharCode(36) + "{styles[variant]}" + String.fromCharCode(96) + "}&gt;\\n";
  output += "      Click\\n";
  output += "    &lt;/button&gt;\\n";
  output += "  );\\n";
  output += "}";
  output += '</pre>';
  
  output += "<h4>2. Rendered Output</h4>";
  output += Button({ variant: "primary", children: "Primary" }) + " ";
  output += Button({ variant: "secondary", children: "Secondary" }) + " ";
  output += Button({ variant: "danger", children: "Danger" });
  
  output += "<h4>3. Generated Class Names</h4>";
  output += "<p>CSS Modules hashes class names to prevent collisions:</p>";
  output += "<ul>";
  for (let key in styles) {
    output += "<li><code>." + key + "</code> → <code>." + styles[key] + "</code></li>";
  }
  output += "</ul>";
  
  output += "<h4>4. Benefits</h4>";
  output += "<ul>";
  output += "<li>✅ No class name collisions</li>";
  output += "<li>✅ Scoped to component</li>";
  output += "<li>✅ Standard CSS syntax</li>";
  output += "<li>✅ Dead code elimination</li>";
  output += "</ul>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

<style>
.Button_button__x7Z3a {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin: 5px;
}
.Button_primary__k2M9b { background: #61dafb; color: #282c34; }
.Button_secondary__n4P1c { background: #6c757d; color: white; }
.Button_danger__q8R2d { background: #dc3545; color: white; }
</style>

</body>
</html>`,
    },
    'css-in-js': {
      title: 'CSS-in-JS',
      content: `## CSS-in-JS

Write CSS directly in JavaScript files.

### Styled Components

\`\`\`jsx
import styled from 'styled-components';

const Button = styled.button\`
  padding: 10px 20px;
  background: \${props => props.primary ? '#61dafb' : '#fff'};
  color: \${props => props.primary ? '#282c34' : '#333'};
  border: 2px solid #61dafb;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
\`;

// Usage
<Button primary>Primary</Button>
<Button>Secondary</Button>
\`\`\`

### Emotion

\`\`\`jsx
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyle = css\`
  padding: 10px 20px;
  background: #61dafb;
  border: none;
  border-radius: 4px;
\`;

function Button() {
  return <button css={buttonStyle}>Click</button>;
}
\`\`\`

### Runtime vs Build-Time

| Runtime (styled-components) | Build-Time (Linaria) |
|-----------------------------|---------------------|
| CSS generated at runtime | CSS extracted at build |
| Smaller initial bundle | Zero runtime overhead |
| Dynamic styles easy | Better performance |
| More overhead | More build complexity |

### Pros and Cons

**Pros:**
- Full JavaScript power
- Dynamic props-based styling
- Automatic vendor prefixing
- Dead code elimination

**Cons:**
- Runtime overhead (some libraries)
- Larger bundle size
- Learning curve
- SSR complexity`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>CSS-in-JS Concepts</h2>
<div id="demo"></div>

<script>
// Simulating styled-components pattern

// In real React with styled-components:
// const Button = styled.button\`
//   padding: 10px 20px;
//   background: \${props => props.primary ? '#61dafb' : '#fff'};
// \`;

function StyledButton(props) {
  let bg = props.primary ? "#61dafb" : "#fff";
  let color = props.primary ? "#282c34" : "#333";
  let style = "padding:10px 20px;background:" + bg + ";color:" + color + ";border:2px solid #61dafb;border-radius:4px;cursor:pointer;margin:5px";
  return '<button style="' + style + '">' + props.children + '</button>';
}

function render() {
  let output = "<h3>CSS-in-JS Example</h3>";
  
  output += "<h4>1. Styled Components Pattern</h4>";
  output += '<pre style="background:#282c34;color:#61dafb;padding:15px;border-radius:4px;overflow-x:auto">';
  output += "const Button = styled.button" + String.fromCharCode(96) + "\\n";
  output += "  padding: 10px 20px;\\n";
  output += "  background: " + String.fromCharCode(36) + "{props => props.primary ? '#61dafb' : '#fff'};\\n";
  output += "  color: " + String.fromCharCode(36) + "{props => props.primary ? '#282c34' : '#333'};\\n";
  output += "  border: 2px solid #61dafb;\\n";
  output += "  border-radius: 4px;\\n";
  output += String.fromCharCode(96) + ";";
  output += '</pre>';
  
  output += "<h4>2. Usage</h4>";
  output += StyledButton({ primary: true, children: "Primary Button" });
  output += StyledButton({ children: "Secondary Button" });
  
  output += "<h4>3. Dynamic Props</h4>";
  let sizes = [
    { size: "small", padding: "5px 10px" },
    { size: "medium", padding: "10px 20px" },
    { size: "large", padding: "15px 30px" }
  ];
  sizes.forEach(function(s) {
    output += '<button style="padding:' + s.padding + ';background:#61dafb;border:none;border-radius:4px;margin:5px">' + s.size + '</button>';
  });
  
  output += "<h4>4. Popular Libraries</h4>";
  output += '<ul>';
  output += '<li><strong>styled-components</strong> - Most popular, great DX</li>';
  output += '<li><strong>Emotion</strong> - Fast, flexible</li>';
  output += '<li><strong>Linaria</strong> - Zero runtime</li>';
  output += '<li><strong>Stitches</strong> - Near-zero runtime</li>';
  output += '</ul>';
  
  output += "<h4>5. Trade-offs</h4>";
  output += '<table border="1" style="border-collapse:collapse;width:100%">';
  output += '<tr><th style="padding:8px">Pros</th><th style="padding:8px">Cons</th></tr>';
  output += '<tr><td style="padding:8px">Dynamic styling with props</td><td style="padding:8px">Runtime overhead</td></tr>';
  output += '<tr><td style="padding:8px">Scoped styles</td><td style="padding:8px">Learning curve</td></tr>';
  output += '<tr><td style="padding:8px">Full JS power</td><td style="padding:8px">Bundle size</td></tr>';
  output += '</table>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    sass: {
      title: 'React Sass',
      content: `## Sass with React

Using Sass/SCSS for enhanced CSS capabilities.

### Setup

\`\`\`bash
npm install sass
\`\`\`

No additional configuration needed with Vite or CRA.

### Basic Usage

\`\`\`scss
// styles.scss
$primary-color: #61dafb;
$border-radius: 8px;

.card {
  padding: 20px;
  background: white;
  border-radius: $border-radius;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &__title {
    color: $primary-color;
    margin-bottom: 10px;
  }
  
  &__content {
    color: #666;
  }
}
\`\`\`

\`\`\`jsx
import './styles.scss';

function Card({ title, content }) {
  return (
    <div className="card">
      <h2 className="card__title">{title}</h2>
      <p className="card__content">{content}</p>
    </div>
  );
}
\`\`\`

### Variables

\`\`\`scss
// _variables.scss
$colors: (
  primary: #61dafb,
  secondary: #282c34,
  success: #28a745,
  danger: #dc3545
);

@function color($key) {
  @return map-get($colors, $key);
}

// Usage
.btn-primary {
  background: color(primary);
}
\`\`\`

### Mixins

\`\`\`scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button-variant($bg, $color) {
  background: $bg;
  color: $color;
  &:hover {
    background: darken($bg, 10%);
  }
}

.container {
  @include flex-center;
}

.btn-primary {
  @include button-variant(#61dafb, #282c34);
}
\`\`\`

### Maintainability Concerns

- Keep nesting shallow (3 levels max)
- Organize with partials (_variables, _mixins, etc.)
- Avoid overusing @extend
- Document complex mixins`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>React Sass/SCSS</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "<h3>Sass Features</h3>";
  
  // 1. Variables
  output += "<h4>1. Variables</h4>";
  output += '<pre style="background:#fff5f5;padding:10px;border-radius:4px">';
  output += "$primary-color: #61dafb;\\n";
  output += "$border-radius: 8px;\\n\\n";
  output += ".button {\\n";
  output += "  background: $primary-color;\\n";
  output += "  border-radius: $border-radius;\\n";
  output += "}";
  output += '</pre>';
  
  // 2. Nesting
  output += "<h4>2. Nesting & Parent Selector (&)</h4>";
  output += '<pre style="background:#f5fff5;padding:10px;border-radius:4px">';
  output += ".card {\\n";
  output += "  padding: 20px;\\n\\n";
  output += "  &:hover {\\n";
  output += "    box-shadow: 0 4px 8px rgba(0,0,0,0.1);\\n";
  output += "  }\\n\\n";
  output += "  &__title {\\n";
  output += "    font-size: 24px;\\n";
  output += "  }\\n";
  output += "}";
  output += '</pre>';
  
  // 3. Mixins
  output += "<h4>3. Mixins</h4>";
  output += '<pre style="background:#f5f5ff;padding:10px;border-radius:4px">';
  output += "@mixin flex-center {\\n";
  output += "  display: flex;\\n";
  output += "  justify-content: center;\\n";
  output += "  align-items: center;\\n";
  output += "}\\n\\n";
  output += ".container {\\n";
  output += "  @include flex-center;\\n";
  output += "}";
  output += '</pre>';
  
  // Demo cards
  output += "<h4>4. Demo Output</h4>";
  output += '<div class="demo-card">';
  output += '<h3 class="demo-card__title">Sass Card</h3>';
  output += '<p class="demo-card__content">Styled with SCSS variables and nesting</p>';
  output += '</div>';
  
  // Best practices
  output += "<h4>5. Best Practices</h4>";
  output += '<ul>';
  output += '<li>Keep nesting to 3 levels max</li>';
  output += '<li>Use partials: _variables.scss, _mixins.scss</li>';
  output += '<li>Prefer mixins over @extend</li>';
  output += '<li>Use BEM naming with Sass</li>';
  output += '</ul>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

<style>
/* Compiled SCSS output simulation */
.demo-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 10px 0;
  transition: box-shadow 0.3s;
}
.demo-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.demo-card__title {
  color: #61dafb;
  margin: 0 0 10px;
}
.demo-card__content {
  color: #666;
  margin: 0;
}
</style>

</body>
</html>`,
    },

    // PHASE 6 — ROUTING & UI FLOW
    router: {
      title: 'React Router',
      content: `## React Router

Client-side routing for single-page applications.

### Installation

\`\`\`bash
npm install react-router-dom
\`\`\`

### Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

### Route Parameters

\`\`\`jsx
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  return <h1>User ID: {id}</h1>;
}
\`\`\`

### Nested Routes

\`\`\`jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}

<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<DashboardHome />} />
  <Route path="settings" element={<Settings />} />
  <Route path="profile" element={<Profile />} />
</Route>
\`\`\`

### Navigation

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await login();
    navigate('/dashboard');
  };
}
\`\`\`

### Protected Routes

\`\`\`jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Router Concepts</h2>
<div id="demo"></div>

<script>
// Simulating React Router behavior
let currentPath = "/";
let routes = {
  "/": { component: "Home", content: "Welcome to the home page!" },
  "/about": { component: "About", content: "Learn more about us." },
  "/users/1": { component: "UserProfile", content: "User Profile: Alice (ID: 1)" },
  "/dashboard": { component: "Dashboard", content: "Your Dashboard" }
};

function navigate(path) {
  currentPath = path;
  render();
}

function render() {
  let output = "<h3>Client-Side Routing</h3>";
  
  // Navigation
  output += '<nav style="background:#282c34;padding:15px;border-radius:4px;margin-bottom:20px">';
  ["/", "/about", "/users/1", "/dashboard"].forEach(function(path) {
    let isActive = currentPath === path;
    let style = isActive ? "color:#61dafb;font-weight:bold" : "color:white";
    let label = path === "/" ? "Home" : path.slice(1);
    output += '<a href="#" onclick="navigate(\\'' + path + '\\'); return false;" style="' + style + ';margin-right:20px;text-decoration:none">' + label + '</a>';
  });
  output += '</nav>';
  
  // Current Route
  let route = routes[currentPath] || { component: "NotFound", content: "404 - Page not found" };
  output += '<div style="padding:20px;background:#f5f5f5;border-radius:4px">';
  output += '<h4>Current Route: ' + currentPath + '</h4>';
  output += '<p><strong>Component:</strong> &lt;' + route.component + ' /&gt;</p>';
  output += '<p>' + route.content + '</p>';
  output += '</div>';
  
  // Code example
  output += '<h4>Router Setup:</h4>';
  output += '<pre style="background:#282c34;color:#61dafb;padding:15px;border-radius:4px;overflow-x:auto">';
  output += '&lt;BrowserRouter&gt;\\n';
  output += '  &lt;Routes&gt;\\n';
  output += '    &lt;Route path="/" element={&lt;Home /&gt;} /&gt;\\n';
  output += '    &lt;Route path="/about" element={&lt;About /&gt;} /&gt;\\n';
  output += '    &lt;Route path="/users/:id" element={&lt;User /&gt;} /&gt;\\n';
  output += '  &lt;/Routes&gt;\\n';
  output += '&lt;/BrowserRouter&gt;';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    portals: {
      title: 'React Portals',
      content: `## React Portals

Render children into a DOM node outside the parent component.

### Why Portals?

- Modals that need to break out of overflow:hidden
- Tooltips that need to avoid clipping
- Dropdowns that need to overlay other content

### Basic Portal

\`\`\`jsx
import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    document.body  // Target DOM node
  );
}
\`\`\`

### Portal with Backdrop

\`\`\`jsx
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal">
        <button onClick={onClose}>×</button>
        {children}
      </div>
    </>,
    document.getElementById('modal-root')
  );
}
\`\`\`

### Events Still Bubble

Even though portals render outside the parent DOM, events still bubble up through the React tree:

\`\`\`jsx
function Parent() {
  // This will catch clicks from the portal!
  return (
    <div onClick={() => console.log('Parent clicked')}>
      <Modal>
        <button>Click in modal</button>
      </Modal>
    </div>
  );
}
\`\`\`

### Tooltip Example

\`\`\`jsx
function Tooltip({ text, targetRef }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const rect = targetRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 5,
      left: rect.left
    });
  }, []);

  return createPortal(
    <div style={{ position: 'fixed', ...position }}>
      {text}
    </div>,
    document.body
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Portals</h2>
<div id="demo"></div>
<div id="modal-root"></div>

<script>
let isModalOpen = false;
let isTooltipVisible = false;

function toggleModal() {
  isModalOpen = !isModalOpen;
  render();
}

function showTooltip() {
  isTooltipVisible = true;
  render();
}

function hideTooltip() {
  isTooltipVisible = false;
  render();
}

function render() {
  let output = "<h3>Portal Examples</h3>";
  
  // Modal example
  output += "<h4>1. Modal (Portal to body)</h4>";
  output += '<button onclick="toggleModal()" style="padding:10px 20px;background:#61dafb;border:none;border-radius:4px;cursor:pointer">Open Modal</button>';
  
  // The modal portal
  let modalHTML = '';
  if (isModalOpen) {
    modalHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:1000">';
    modalHTML += '<div style="background:white;padding:30px;border-radius:8px;max-width:400px">';
    modalHTML += '<h3>Modal Title</h3>';
    modalHTML += '<p>This modal is rendered via a portal to document.body!</p>';
    modalHTML += '<p>Even though it\\'s defined inside a component, it renders at the root level.</p>';
    modalHTML += '<button onclick="toggleModal()" style="padding:10px 20px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer">Close</button>';
    modalHTML += '</div></div>';
  }
  document.getElementById("modal-root").innerHTML = modalHTML;
  
  // Tooltip example
  output += "<h4>2. Tooltip</h4>";
  output += '<span onmouseenter="showTooltip()" onmouseleave="hideTooltip()" style="border-bottom:2px dashed #61dafb;cursor:help">Hover over me</span>';
  if (isTooltipVisible) {
    output += '<div style="position:absolute;background:#282c34;color:white;padding:8px 12px;border-radius:4px;font-size:14px;margin-top:5px">This is a tooltip!</div>';
  }
  
  // Use cases
  output += "<h4>3. When to Use Portals</h4>";
  output += '<ul>';
  output += '<li>✅ Modals / Dialogs</li>';
  output += '<li>✅ Tooltips</li>';
  output += '<li>✅ Dropdowns</li>';
  output += '<li>✅ Toast notifications</li>';
  output += '<li>✅ Anything that needs to break out of overflow:hidden</li>';
  output += '</ul>';
  
  // Code
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;margin-top:10px">';
  output += 'createPortal(\\n';
  output += '  &lt;Modal&gt;Content&lt;/Modal&gt;,\\n';
  output += '  document.body\\n';
  output += ')';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    suspense: {
      title: 'React Suspense',
      content: `## React Suspense

Handle loading states declaratively.

### Lazy Loading Components

\`\`\`jsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
      <HeavyChart />
    </Suspense>
  );
}
\`\`\`

### Route-Based Code Splitting

\`\`\`jsx
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

### Data Fetching with Suspense

\`\`\`jsx
// With React Query or similar
function UserProfile() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserData />
    </Suspense>
  );
}

function UserData() {
  // This hook suspends until data is ready
  const user = useSuspenseQuery(['user']);
  return <div>{user.name}</div>;
}
\`\`\`

### Nested Suspense

\`\`\`jsx
<Suspense fallback={<PageLoader />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
  </Suspense>
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
</Suspense>
\`\`\`

### Benefits

- Declarative loading states
- Automatic code splitting
- Better user experience
- Simpler component logic`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>React Suspense</h2>
<div id="demo"></div>

<script>
let loadingStates = {
  header: false,
  sidebar: false,
  content: false
};

function simulateLoad(component) {
  loadingStates[component] = true;
  render();
  
  setTimeout(function() {
    loadingStates[component] = false;
    render();
  }, 1500);
}

function resetAll() {
  loadingStates = { header: true, sidebar: true, content: true };
  render();
  
  setTimeout(() => { loadingStates.header = false; render(); }, 800);
  setTimeout(() => { loadingStates.sidebar = false; render(); }, 1200);
  setTimeout(() => { loadingStates.content = false; render(); }, 1800);
}

function render() {
  let output = "<h3>Suspense Concept</h3>";
  
  // Simulated lazy-loaded components
  output += "<h4>1. Lazy Loading Simulation</h4>";
  output += '<div style="display:grid;gap:10px">';
  
  // Header
  output += '<div style="background:#f5f5f5;padding:15px;border-radius:4px">';
  if (loadingStates.header) {
    output += '<div style="background:#ddd;height:20px;width:60%;border-radius:4px;animation:pulse 1s infinite"></div>';
    output += '<span style="color:#999;font-size:12px">Loading header...</span>';
  } else {
    output += '<strong>Header Component</strong> ✅';
  }
  output += '</div>';
  
  // Sidebar
  output += '<div style="background:#f5f5f5;padding:15px;border-radius:4px">';
  if (loadingStates.sidebar) {
    output += '<div style="background:#ddd;height:60px;width:100%;border-radius:4px;animation:pulse 1s infinite"></div>';
    output += '<span style="color:#999;font-size:12px">Loading sidebar...</span>';
  } else {
    output += '<strong>Sidebar Component</strong> ✅';
  }
  output += '</div>';
  
  // Content
  output += '<div style="background:#f5f5f5;padding:15px;border-radius:4px">';
  if (loadingStates.content) {
    output += '<div style="background:#ddd;height:100px;width:100%;border-radius:4px;animation:pulse 1s infinite"></div>';
    output += '<span style="color:#999;font-size:12px">Loading content...</span>';
  } else {
    output += '<strong>Main Content Component</strong> ✅<p>All data loaded!</p>';
  }
  output += '</div>';
  
  output += '</div>';
  
  output += '<button onclick="resetAll()" style="margin-top:15px;padding:10px 20px;background:#61dafb;border:none;border-radius:4px;cursor:pointer">Simulate Page Load</button>';
  
  // Code example
  output += '<h4>2. Suspense Pattern</h4>';
  output += '<pre style="background:#282c34;color:#61dafb;padding:15px;border-radius:4px;overflow-x:auto">';
  output += 'const Dashboard = lazy(() => import("./Dashboard"));\\n\\n';
  output += '&lt;Suspense fallback={&lt;Loading /&gt;}&gt;\\n';
  output += '  &lt;Dashboard /&gt;\\n';
  output += '&lt;/Suspense&gt;';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

<style>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>

</body>
</html>`,
    },
    transitions: {
      title: 'React Transitions',
      content: `## React Transitions

Smooth UI transitions and animations.

### CSS Transitions

\`\`\`jsx
function FadeIn({ show, children }) {
  return (
    <div style={{
      opacity: show ? 1 : 0,
      transition: 'opacity 300ms ease-in-out'
    }}>
      {children}
    </div>
  );
}
\`\`\`

### CSS Classes Approach

\`\`\`css
.fade-enter { opacity: 0; }
.fade-enter-active { opacity: 1; transition: opacity 300ms; }
.fade-exit { opacity: 1; }
.fade-exit-active { opacity: 0; transition: opacity 300ms; }
\`\`\`

### useTransition Hook (React 18)

\`\`\`jsx
import { useTransition, useState } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setQuery(e.target.value);
    
    // Mark as low priority
    startTransition(() => {
      setResults(filterResults(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </div>
  );
}
\`\`\`

### Animation Libraries

**Framer Motion:**
\`\`\`jsx
import { motion, AnimatePresence } from 'framer-motion';

function Modal({ isOpen }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          Modal content
        </motion.div>
      )}
    </AnimatePresence>
  );
}
\`\`\`

### State-Driven Transitions

\`\`\`jsx
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id}>
          <button onClick={() => setOpenIndex(index)}>
            {item.title}
          </button>
          <div style={{
            maxHeight: openIndex === index ? '500px' : '0',
            overflow: 'hidden',
            transition: 'max-height 300ms ease'
          }}>
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>React Transitions</h2>
<div id="demo"></div>

<script>
let showBox = true;
let openAccordion = 0;
let isPending = false;

function toggleBox() {
  showBox = !showBox;
  render();
}

function setAccordion(index) {
  openAccordion = openAccordion === index ? -1 : index;
  render();
}

function simulateTransition() {
  isPending = true;
  render();
  setTimeout(function() {
    isPending = false;
    render();
  }, 1000);
}

function render() {
  let output = "<h3>Transition Examples</h3>";
  
  // 1. Fade transition
  output += "<h4>1. Fade Transition</h4>";
  output += '<button onclick="toggleBox()" style="padding:10px 20px;background:#61dafb;border:none;border-radius:4px;cursor:pointer;margin-bottom:10px">Toggle</button>';
  output += '<div style="opacity:' + (showBox ? '1' : '0') + ';transition:opacity 300ms;background:#282c34;color:white;padding:20px;border-radius:4px">';
  output += 'This box fades in and out!';
  output += '</div>';
  
  // 2. Accordion
  output += "<h4>2. Accordion (Max-Height)</h4>";
  let items = [
    { title: "Section 1", content: "Content for section 1. This expands smoothly." },
    { title: "Section 2", content: "Content for section 2. Click to expand." },
    { title: "Section 3", content: "Content for section 3. Transitions are smooth!" }
  ];
  
  items.forEach(function(item, idx) {
    let isOpen = openAccordion === idx;
    output += '<div style="border:1px solid #ddd;border-radius:4px;margin:5px 0">';
    output += '<button onclick="setAccordion(' + idx + ')" style="width:100%;padding:15px;text-align:left;background:' + (isOpen ? '#61dafb' : '#f5f5f5') + ';border:none;cursor:pointer">';
    output += item.title + ' ' + (isOpen ? '▼' : '▶');
    output += '</button>';
    output += '<div style="max-height:' + (isOpen ? '200px' : '0') + ';overflow:hidden;transition:max-height 300ms ease;padding:' + (isOpen ? '15px' : '0 15px') + '">';
    output += item.content;
    output += '</div></div>';
  });
  
  // 3. useTransition concept
  output += "<h4>3. useTransition (Priority)</h4>";
  output += '<button onclick="simulateTransition()" style="padding:10px 20px;background:#61dafb;border:none;border-radius:4px;cursor:pointer">Start Transition</button>';
  if (isPending) {
    output += '<span style="margin-left:10px;color:#666">⏳ Low priority update pending...</span>';
  } else {
    output += '<span style="margin-left:10px;color:green">✅ Ready</span>';
  }
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 7 — HOOKS
    'hooks-intro': {
      title: 'What is Hooks?',
      content: `## React Hooks

Hooks let you use state and other React features in functional components.

### Why Hooks Exist

Before hooks, you needed class components for:
- State management
- Lifecycle methods
- Context consumption

Hooks solve:
- **Reusing logic** - Share stateful logic without render props/HOCs
- **Complex components** - Split by concern, not lifecycle
- **Classes confusion** - No \`this\` binding issues

### Rules of Hooks

**Non-negotiable rules:**

1. **Only call at the top level**
\`\`\`jsx
// ❌ Wrong - inside condition
if (condition) {
  const [state, setState] = useState();
}

// ✅ Correct - top level
const [state, setState] = useState();
\`\`\`

2. **Only call from React functions**
\`\`\`jsx
// ❌ Wrong - regular function
function helper() {
  const [state, setState] = useState();
}

// ✅ Correct - React component or custom hook
function useCustomHook() {
  const [state, setState] = useState();
}
\`\`\`

### Available Hooks

| Hook | Purpose |
|------|---------|
| useState | Local state |
| useEffect | Side effects |
| useContext | Context consumption |
| useRef | Mutable refs |
| useReducer | Complex state |
| useCallback | Memoized callbacks |
| useMemo | Memoized values |
| useTransition | Concurrent features |
| useDeferredValue | Deferred updates |

### The Mental Model

Think of hooks as **subscriptions**:
- useState subscribes to state changes
- useEffect subscribes to render completion
- useContext subscribes to context changes`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>React Hooks Overview</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "<h3>Why Hooks?</h3>";
  
  // Before vs After
  output += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">';
  
  // Before (Class)
  output += '<div style="background:#fff5f5;padding:15px;border-radius:8px">';
  output += '<h4>❌ Before (Class)</h4>';
  output += '<pre style="font-size:12px">';
  output += 'class Counter extends Component {\\n';
  output += '  constructor(props) {\\n';
  output += '    super(props);\\n';
  output += '    this.state = { count: 0 };\\n';
  output += '    this.increment = this.increment.bind(this);\\n';
  output += '  }\\n';
  output += '  increment() {\\n';
  output += '    this.setState({ count: this.state.count + 1 });\\n';
  output += '  }\\n';
  output += '  render() {\\n';
  output += '    return &lt;button onClick={this.increment}&gt;...';
  output += '</pre>';
  output += '</div>';
  
  // After (Hooks)
  output += '<div style="background:#f5fff5;padding:15px;border-radius:8px">';
  output += '<h4>✅ After (Hooks)</h4>';
  output += '<pre style="font-size:12px">';
  output += 'function Counter() {\\n';
  output += '  const [count, setCount] = useState(0);\\n';
  output += '\\n';
  output += '  return (\\n';
  output += '    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;\\n';
  output += '      {count}\\n';
  output += '    &lt;/button&gt;\\n';
  output += '  );\\n';
  output += '}';
  output += '</pre>';
  output += '</div>';
  
  output += '</div>';
  
  // Rules
  output += '<h4 style="margin-top:20px">Rules of Hooks ⚠️</h4>';
  output += '<div style="background:#fff3cd;padding:15px;border-radius:8px">';
  output += '<ol>';
  output += '<li><strong>Top Level Only</strong> - Never inside loops, conditions, or nested functions</li>';
  output += '<li><strong>React Functions Only</strong> - Only in components or custom hooks</li>';
  output += '</ol>';
  output += '</div>';
  
  // Available hooks
  output += '<h4>Core Hooks</h4>';
  output += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">';
  let hooks = [
    { name: "useState", desc: "Local state" },
    { name: "useEffect", desc: "Side effects" },
    { name: "useContext", desc: "Context" },
    { name: "useRef", desc: "Refs" },
    { name: "useReducer", desc: "Complex state" },
    { name: "useMemo", desc: "Memoization" }
  ];
  hooks.forEach(function(h) {
    output += '<div style="background:#f5f5f5;padding:10px;border-radius:4px;text-align:center">';
    output += '<strong>' + h.name + '</strong><br>';
    output += '<small>' + h.desc + '</small>';
    output += '</div>';
  });
  output += '</div>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    usestate: {
      title: 'React useState',
      content: `## useState Hook

Add state to functional components.

### Basic Usage

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

### State Update Patterns

\`\`\`jsx
// Direct value
setCount(5);

// Functional update (when new state depends on previous)
setCount(prevCount => prevCount + 1);

// Object state
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'Alice' }));

// Array state
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);
\`\`\`

### Lazy Initial State

\`\`\`jsx
// ❌ Runs on every render
const [data, setData] = useState(expensiveComputation());

// ✅ Runs only on first render
const [data, setData] = useState(() => expensiveComputation());
\`\`\`

### Multiple States

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  
  // Or group related state
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: 0
  });
}
\`\`\`

### State is Asynchronous

\`\`\`jsx
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1);
  console.log(count); // Still 0! State updates are async
};

// Use functional update for sequential updates
const incrementTwice = () => {
  setCount(prev => prev + 1);
  setCount(prev => prev + 1); // Will be 2
};
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>useState Hook</h2>
<div id="demo"></div>

<script>
// Simulating useState behavior
let states = {
  count: 0,
  name: "",
  items: ["Item 1", "Item 2"]
};

function setState(key, value) {
  if (typeof value === 'function') {
    states[key] = value(states[key]);
  } else {
    states[key] = value;
  }
  render();
}

function render() {
  let output = "<h3>useState Examples</h3>";
  
  // Counter
  output += "<h4>1. Counter</h4>";
  output += '<p>Count: <strong>' + states.count + '</strong></p>';
  output += '<button onclick="setState(\\'count\\', states.count + 1)" style="padding:8px 16px;margin:2px">+1</button>';
  output += '<button onclick="setState(\\'count\\', states.count - 1)" style="padding:8px 16px;margin:2px">-1</button>';
  output += '<button onclick="setState(\\'count\\', 0)" style="padding:8px 16px;margin:2px">Reset</button>';
  
  // Input
  output += "<h4>2. Input State</h4>";
  output += '<input type="text" value="' + states.name + '" oninput="setState(\\'name\\', this.value)" placeholder="Type your name..." style="padding:8px;width:200px" />';
  output += '<p>Hello, <strong>' + (states.name || "Guest") + '</strong>!</p>';
  
  // Array state
  output += "<h4>3. Array State</h4>";
  output += '<ul>';
  states.items.forEach(function(item, idx) {
    output += '<li>' + item + ' <button onclick="removeItem(' + idx + ')" style="margin-left:10px">×</button></li>';
  });
  output += '</ul>';
  output += '<button onclick="addItem()" style="padding:8px 16px">Add Item</button>';
  
  // Functional update
  output += "<h4>4. Functional Update (Batching)</h4>";
  output += '<p>For sequential updates, use functional form:</p>';
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px">';
  output += 'setCount(prev => prev + 1);\\n';
  output += 'setCount(prev => prev + 1); // Both work!';
  output += '</pre>';
  output += '<button onclick="incrementTwice()" style="padding:8px 16px">+2 (functional)</button>';
  
  document.getElementById("demo").innerHTML = output;
}

function addItem() {
  let newItem = "Item " + (states.items.length + 1);
  setState('items', prev => [...prev, newItem]);
}

function removeItem(idx) {
  setState('items', prev => prev.filter((_, i) => i !== idx));
}

function incrementTwice() {
  setState('count', prev => prev + 1);
  setState('count', prev => prev + 1);
}

render();
</script>

</body>
</html>`,
    },
    useeffect: {
      title: 'React useEffect',
      content: `## useEffect Hook

Handle side effects in functional components.

### Basic Syntax

\`\`\`jsx
import { useEffect, useState } from 'react';

function Component() {
  useEffect(() => {
    // Side effect code
    console.log('Effect ran');
    
    return () => {
      // Cleanup function
      console.log('Cleanup');
    };
  }, [/* dependencies */]);
}
\`\`\`

### Dependency Array Patterns

\`\`\`jsx
// Run on every render
useEffect(() => {
  console.log('Every render');
});

// Run once on mount
useEffect(() => {
  console.log('Only on mount');
}, []);

// Run when dependencies change
useEffect(() => {
  console.log('userId changed:', userId);
}, [userId]);
\`\`\`

### Data Fetching

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    
    async function fetchUser() {
      setLoading(true);
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      
      if (!cancelled) {
        setUser(data);
        setLoading(false);
      }
    }
    
    fetchUser();
    
    return () => { cancelled = true; };
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
\`\`\`

### Cleanup Examples

\`\`\`jsx
// Event listener
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

// Timer
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, []);

// Subscription
useEffect(() => {
  const subscription = api.subscribe(handler);
  return () => subscription.unsubscribe();
}, []);
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>useEffect Hook</h2>
<div id="demo"></div>

<script>
let state = {
  count: 0,
  userId: 1,
  user: null,
  timer: 0,
  logs: []
};

let timerInterval = null;

function log(message) {
  state.logs.push(new Date().toLocaleTimeString() + ": " + message);
  if (state.logs.length > 5) state.logs.shift();
}

// Simulating useEffect on mount
function onMount() {
  log("Component mounted ([] dependency)");
  startTimer();
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(function() {
    state.timer++;
    render();
  }, 1000);
  log("Timer started (cleanup needed)");
}

function cleanup() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    log("Timer cleaned up! (return () => {})");
    state.timer = 0;
    render();
  }
}

function changeUser(id) {
  state.userId = id;
  log("userId changed to " + id + " - fetching user...");
  // Simulate fetch
  setTimeout(function() {
    state.user = { id: id, name: "User " + id };
    log("User " + id + " loaded");
    render();
  }, 500);
  render();
}

function render() {
  let output = "<h3>useEffect Examples</h3>";
  
  // 1. Mount effect
  output += "<h4>1. Run Once on Mount ([])</h4>";
  output += '<button onclick="onMount()" style="padding:8px 16px">Simulate Mount</button>';
  
  // 2. Timer with cleanup
  output += "<h4>2. Timer with Cleanup</h4>";
  output += '<p>Timer: <strong>' + state.timer + '</strong> seconds</p>';
  output += '<button onclick="startTimer()" style="padding:8px 16px;margin-right:10px">Start</button>';
  output += '<button onclick="cleanup()" style="padding:8px 16px">Stop (Cleanup)</button>';
  
  // 3. Dependency change
  output += "<h4>3. Dependency Change [userId]</h4>";
  output += '<p>Current userId: <strong>' + state.userId + '</strong></p>';
  output += '<button onclick="changeUser(1)" style="padding:8px 16px;margin:2px">User 1</button>';
  output += '<button onclick="changeUser(2)" style="padding:8px 16px;margin:2px">User 2</button>';
  output += '<button onclick="changeUser(3)" style="padding:8px 16px;margin:2px">User 3</button>';
  if (state.user) {
    output += '<p>Loaded: <strong>' + state.user.name + '</strong></p>';
  }
  
  // Effect log
  output += "<h4>4. Effect Log</h4>";
  output += '<div style="background:#282c34;color:#61dafb;padding:15px;border-radius:4px;font-family:monospace;font-size:12px">';
  state.logs.forEach(function(l) {
    output += l + '<br>';
  });
  output += '</div>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
log("Initial render");
</script>

</body>
</html>`,
    },
    usecontext: {
      title: 'React useContext',
      content: `## useContext Hook

Consume context without nesting.

### Creating Context

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext('light');

// Provider component
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
\`\`\`

### Consuming Context

\`\`\`jsx
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
    >
      Toggle Theme
    </button>
  );
}
\`\`\`

### Custom Hook Pattern

\`\`\`jsx
// Create a custom hook for cleaner API
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Usage becomes cleaner
function Component() {
  const { theme } = useTheme();
}
\`\`\`

### Multiple Contexts

\`\`\`jsx
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <Main />
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
\`\`\`

### When to Use Context

✅ **Good for:**
- Theme (dark/light mode)
- Authentication state
- Locale/Language
- Feature flags

❌ **Avoid for:**
- Frequently updating data (use state management)
- Props that only go 2-3 levels deep`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>useContext Hook</h2>
<div id="demo"></div>

<script>
// Simulating React Context
let ThemeContext = { theme: "light" };
let AuthContext = { user: null, isLoggedIn: false };

function setTheme(newTheme) {
  ThemeContext.theme = newTheme;
  render();
}

function login() {
  AuthContext.user = { name: "Alice" };
  AuthContext.isLoggedIn = true;
  render();
}

function logout() {
  AuthContext.user = null;
  AuthContext.isLoggedIn = false;
  render();
}

function render() {
  let theme = ThemeContext.theme;
  let bgColor = theme === "dark" ? "#282c34" : "#ffffff";
  let textColor = theme === "dark" ? "#61dafb" : "#333333";
  
  let output = '<div style="background:' + bgColor + ';color:' + textColor + ';padding:20px;border-radius:8px">';
  output += "<h3>Context Examples</h3>";
  
  // Theme Context
  output += "<h4>1. Theme Context</h4>";
  output += '<p>Current theme: <strong>' + theme + '</strong></p>';
  output += '<button onclick="setTheme(\\'' + (theme === 'light' ? 'dark' : 'light') + '\\')" style="padding:10px 20px;background:' + (theme === 'dark' ? '#61dafb' : '#282c34') + ';color:' + (theme === 'dark' ? '#282c34' : '#fff') + ';border:none;border-radius:4px;cursor:pointer">Toggle Theme</button>';
  
  // Auth Context
  output += "<h4>2. Auth Context</h4>";
  if (AuthContext.isLoggedIn) {
    output += '<p>Welcome, <strong>' + AuthContext.user.name + '</strong>!</p>';
    output += '<button onclick="logout()" style="padding:10px 20px;background:#dc3545;color:white;border:none;border-radius:4px;cursor:pointer">Logout</button>';
  } else {
    output += '<p>Not logged in</p>';
    output += '<button onclick="login()" style="padding:10px 20px;background:#28a745;color:white;border:none;border-radius:4px;cursor:pointer">Login</button>';
  }
  
  // Nested component simulation
  output += "<h4>3. Deep Nested Component</h4>";
  output += '<div style="border:1px dashed ' + textColor + ';padding:10px;border-radius:4px">';
  output += '<p>This component uses <code>useContext(ThemeContext)</code></p>';
  output += '<p>No prop drilling needed!</p>';
  output += '</div>';
  
  output += '</div>';
  
  // Code example
  output += '<h4>Pattern:</h4>';
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;overflow-x:auto">';
  output += '// Create\\n';
  output += 'const ThemeContext = createContext("light");\\n\\n';
  output += '// Provide\\n';
  output += '&lt;ThemeContext.Provider value={theme}&gt;\\n\\n';
  output += '// Consume\\n';
  output += 'const theme = useContext(ThemeContext);';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    useref: {
      title: 'React useRef',
      content: `## useRef Hook

Access DOM elements and persist values across renders.

### DOM Reference

\`\`\`jsx
import { useRef } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
    </>
  );
}
\`\`\`

### Mutable Values

Unlike state, ref changes don't trigger re-renders:

\`\`\`jsx
function Timer() {
  const intervalRef = useRef(null);
  const [count, setCount] = useState(0);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <>
      <span>{count}</span>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
\`\`\`

### Previous Value Pattern

\`\`\`jsx
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  }, [value]);
  
  return ref.current;
}

// Usage
function Component({ count }) {
  const prevCount = usePrevious(count);
  return <p>Previous: {prevCount}, Current: {count}</p>;
}
\`\`\`

### Ref vs State

| useRef | useState |
|--------|----------|
| Doesn't trigger re-render | Triggers re-render |
| Mutable | Immutable |
| Synchronous updates | Async updates |
| Good for DOM refs, timers | Good for UI state |`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>useRef Hook</h2>
<div id="demo"></div>

<script>
let timerRef = { current: null };
let countRef = { current: 0 };
let renderCount = 0;

function startTimer() {
  if (timerRef.current) return;
  timerRef.current = setInterval(function() {
    countRef.current++;
    document.getElementById("refCount").textContent = countRef.current;
  }, 1000);
}

function stopTimer() {
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }
}

function focusInput() {
  document.getElementById("myInput").focus();
}

function render() {
  renderCount++;
  let output = "<h3>useRef Examples</h3>";
  
  // 1. DOM Reference
  output += "<h4>1. DOM Reference</h4>";
  output += '<input id="myInput" type="text" placeholder="Click button to focus" style="padding:8px;width:200px" />';
  output += '<button onclick="focusInput()" style="margin-left:10px;padding:8px 16px">Focus Input</button>';
  
  // 2. Mutable Value (no re-render)
  output += "<h4>2. Mutable Value (no re-render)</h4>";
  output += '<p>Timer count: <strong id="refCount">' + countRef.current + '</strong></p>';
  output += '<p style="color:#666;font-size:12px">Updating ref doesn\\'t trigger re-render!</p>';
  output += '<button onclick="startTimer()" style="padding:8px 16px;margin-right:10px">Start</button>';
  output += '<button onclick="stopTimer()" style="padding:8px 16px">Stop</button>';
  
  // 3. Render count
  output += "<h4>3. Component Render Count</h4>";
  output += '<p>This component rendered <strong>' + renderCount + '</strong> times</p>';
  output += '<button onclick="render()" style="padding:8px 16px">Force Re-render</button>';
  
  // Comparison
  output += "<h4>4. Ref vs State</h4>";
  output += '<table border="1" style="border-collapse:collapse;width:100%">';
  output += '<tr><th style="padding:8px">useRef</th><th style="padding:8px">useState</th></tr>';
  output += '<tr><td style="padding:8px">No re-render on change</td><td style="padding:8px">Triggers re-render</td></tr>';
  output += '<tr><td style="padding:8px">.current is mutable</td><td style="padding:8px">Immutable update</td></tr>';
  output += '<tr><td style="padding:8px">DOM refs, timers</td><td style="padding:8px">UI state</td></tr>';
  output += '</table>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    usereducer: {
      title: 'React useReducer',
      content: `## useReducer Hook

Manage complex state with reducer pattern.

### Basic Usage

\`\`\`jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error('Unknown action');
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </>
  );
}
\`\`\`

### With Payload

\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_AGE':
      return { ...state, age: action.payload };
    case 'SET_USER':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

dispatch({ type: 'SET_NAME', payload: 'Alice' });
dispatch({ type: 'SET_USER', payload: { name: 'Bob', age: 25 } });
\`\`\`

### When to Use

| useState | useReducer |
|----------|------------|
| Simple values | Complex objects |
| Independent updates | Related updates |
| Few state variables | Many state variables |
| Simple logic | Complex logic |

### With Context

\`\`\`jsx
const StateContext = createContext();
const DispatchContext = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>useReducer Hook</h2>
<div id="demo"></div>

<script>
// Initial state
let state = {
  count: 0,
  todos: [
    { id: 1, text: "Learn React", done: false },
    { id: 2, text: "Build a project", done: false }
  ]
};

// Reducer function
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t)
      };
    case 'REMOVE_TODO':
      return {
        ...state,
        todos: state.todos.filter(t => t.id !== action.payload)
      };
    default:
      return state;
  }
}

function dispatch(action) {
  state = reducer(state, action);
  render();
}

function addTodo() {
  let text = document.getElementById("todoInput").value;
  if (text.trim()) {
    dispatch({ type: 'ADD_TODO', payload: text });
    document.getElementById("todoInput").value = "";
  }
}

function render() {
  let output = "<h3>useReducer Examples</h3>";
  
  // Counter
  output += "<h4>1. Counter with Reducer</h4>";
  output += '<p>Count: <strong>' + state.count + '</strong></p>';
  output += '<button onclick="dispatch({type:\\'INCREMENT\\'})" style="padding:8px 16px;margin:2px">+</button>';
  output += '<button onclick="dispatch({type:\\'DECREMENT\\'})" style="padding:8px 16px;margin:2px">-</button>';
  output += '<button onclick="dispatch({type:\\'RESET\\'})" style="padding:8px 16px;margin:2px">Reset</button>';
  
  // Todos
  output += "<h4>2. Todo List with Reducer</h4>";
  output += '<input id="todoInput" placeholder="New todo..." style="padding:8px;width:200px" />';
  output += '<button onclick="addTodo()" style="padding:8px 16px;margin-left:10px">Add</button>';
  output += '<ul style="list-style:none;padding:0">';
  state.todos.forEach(function(todo) {
    let style = todo.done ? "text-decoration:line-through;color:#888" : "";
    output += '<li style="padding:8px;border-bottom:1px solid #eee;' + style + '">';
    output += '<input type="checkbox" ' + (todo.done ? 'checked' : '') + ' onchange="dispatch({type:\\'TOGGLE_TODO\\',payload:' + todo.id + '})" /> ';
    output += todo.text;
    output += '<button onclick="dispatch({type:\\'REMOVE_TODO\\',payload:' + todo.id + '})" style="float:right;background:#dc3545;color:white;border:none;padding:2px 8px;border-radius:4px">×</button>';
    output += '</li>';
  });
  output += '</ul>';
  
  // Reducer code
  output += "<h4>3. Reducer Pattern</h4>";
  output += '<pre style="background:#282c34;color:#61dafb;padding:10px;border-radius:4px;font-size:11px;overflow-x:auto">';
  output += 'function reducer(state, action) {\\n';
  output += '  switch (action.type) {\\n';
  output += '    case "INCREMENT": return { count: state.count + 1 };\\n';
  output += '    case "ADD_TODO": return { ...state, todos: [...] };\\n';
  output += '    default: return state;\\n';
  output += '  }\\n';
  output += '}';
  output += '</pre>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    usecallback: {
      title: 'React useCallback',
      content: `## useCallback Hook

Memoize functions to prevent unnecessary re-renders.

### The Problem

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);
  
  // New function created every render!
  const handleClick = () => {
    console.log('clicked');
  };
  
  return <Child onClick={handleClick} />;
}
\`\`\`

### The Solution

\`\`\`jsx
import { useCallback } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  
  // Same function reference unless dependencies change
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <Child onClick={handleClick} />;
}
\`\`\`

### With Dependencies

\`\`\`jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');
  
  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);
  
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
    </>
  );
}
\`\`\`

### When to Use

✅ **Use when:**
- Passing callbacks to memoized children
- Callback is a dependency of useEffect
- Performance optimization needed

❌ **Don't use when:**
- Simple components
- No memoized children
- Premature optimization

### With React.memo

\`\`\`jsx
const ExpensiveChild = React.memo(({ onClick }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>Click</button>;
});

function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return <ExpensiveChild onClick={handleClick} />;
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>useCallback Hook</h2>
<div id="demo"></div>

<script>
let renderCounts = {
  parent: 0,
  childWithoutCallback: 0,
  childWithCallback: 0
};

// Simulating function identity
let cachedCallback = null;

function withoutCallback() {
  // New function every time
  return function() { console.log("clicked"); };
}

function withCallback(deps) {
  // Same function if deps haven't changed
  if (!cachedCallback) {
    cachedCallback = function() { console.log("clicked"); };
  }
  return cachedCallback;
}

function simulateParentRender() {
  renderCounts.parent++;
  
  // Without useCallback - new function, child re-renders
  renderCounts.childWithoutCallback++;
  
  // With useCallback - same function, child skips render (if memoized)
  // childWithCallback only re-renders if callback actually changed
  
  render();
}

function simulateCallbackChange() {
  cachedCallback = function() { console.log("NEW callback"); };
  renderCounts.childWithCallback++;
  render();
}

function render() {
  let output = "<h3>useCallback Concept</h3>";
  
  // Problem
  output += "<h4>1. The Problem</h4>";
  output += '<div style="background:#fff5f5;padding:15px;border-radius:4px">';
  output += '<p>Without useCallback, a new function is created every render:</p>';
  output += '<pre style="font-size:12px">const handleClick = () => { ... }  // NEW every time!</pre>';
  output += '<p>This breaks React.memo optimization.</p>';
  output += '</div>';
  
  // Solution
  output += "<h4>2. The Solution</h4>";
  output += '<div style="background:#f5fff5;padding:15px;border-radius:4px">';
  output += '<pre style="font-size:12px">const handleClick = useCallback(() => {\\n  ...\\n}, [dependencies]);</pre>';
  output += '<p>Same function reference until dependencies change!</p>';
  output += '</div>';
  
  // Demo
  output += "<h4>3. Render Demo</h4>";
  output += '<button onclick="simulateParentRender()" style="padding:10px 20px;margin:5px">Parent Re-render</button>';
  output += '<button onclick="simulateCallbackChange()" style="padding:10px 20px;margin:5px">Change Callback</button>';
  
  output += '<table border="1" style="border-collapse:collapse;width:100%;margin-top:10px">';
  output += '<tr><th style="padding:8px">Component</th><th style="padding:8px">Render Count</th></tr>';
  output += '<tr><td style="padding:8px">Parent</td><td style="padding:8px">' + renderCounts.parent + '</td></tr>';
  output += '<tr><td style="padding:8px;color:#dc3545">Child (no useCallback)</td><td style="padding:8px">' + renderCounts.childWithoutCallback + ' ⚠️</td></tr>';
  output += '<tr><td style="padding:8px;color:#28a745">Child (with useCallback + memo)</td><td style="padding:8px">' + renderCounts.childWithCallback + ' ✅</td></tr>';
  output += '</table>';
  
  // When to use
  output += "<h4>4. When to Use</h4>";
  output += '<ul>';
  output += '<li>✅ Passing callbacks to React.memo children</li>';
  output += '<li>✅ Callback is useEffect dependency</li>';
  output += '<li>❌ Premature optimization</li>';
  output += '</ul>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    usememo: {
      title: 'React useMemo',
      content: `## useMemo Hook

Memoize expensive computations.

### Basic Usage

\`\`\`jsx
import { useMemo } from 'react';

function ExpensiveList({ items, filter }) {
  // Only recalculates when items or filter change
  const filteredItems = useMemo(() => {
    return items.filter(item => item.name.includes(filter));
  }, [items, filter]);
  
  return (
    <ul>
      {filteredItems.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

### Expensive Computation

\`\`\`jsx
function Fibonacci({ n }) {
  const result = useMemo(() => {
    // Expensive calculation
    function fib(n) {
      if (n <= 1) return n;
      return fib(n - 1) + fib(n - 2);
    }
    return fib(n);
  }, [n]);
  
  return <span>Fibonacci({n}) = {result}</span>;
}
\`\`\`

### Object/Array Stability

\`\`\`jsx
function Component({ items }) {
  // Without useMemo - new array every render
  const sortedItems = items.sort((a, b) => a - b);
  
  // With useMemo - stable reference
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => a - b);
  }, [items]);
  
  return <Child items={sortedItems} />;
}
\`\`\`

### useMemo vs useCallback

\`\`\`jsx
// useMemo - memoizes a VALUE
const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);

// useCallback - memoizes a FUNCTION
const memoizedFn = useCallback(() => doSomething(a, b), [a, b]);

// These are equivalent:
useCallback(fn, deps)
useMemo(() => fn, deps)
\`\`\`

### When to Use

✅ **Use when:**
- Expensive calculations
- Referential equality for deps
- Preventing child re-renders

❌ **Don't use when:**
- Simple calculations
- Premature optimization
- No performance issue`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>useMemo Hook</h2>
<div id="demo"></div>

<script>
let cache = {};
let computeCount = 0;

// Expensive computation (simulated)
function expensiveSort(items) {
  computeCount++;
  // Simulate expensive operation
  let result = [...items].sort((a, b) => a.value - b.value);
  return result;
}

// Memoized version
function memoizedSort(items, cacheKey) {
  if (!cache[cacheKey]) {
    cache[cacheKey] = expensiveSort(items);
  }
  return cache[cacheKey];
}

let items = [
  { id: 1, name: "Zebra", value: 26 },
  { id: 2, name: "Apple", value: 1 },
  { id: 3, name: "Mango", value: 13 }
];

let filter = "";

function updateFilter(value) {
  filter = value;
  render();
}

function addItem() {
  items.push({ id: Date.now(), name: "Item " + items.length, value: Math.floor(Math.random() * 100) });
  cache = {}; // Invalidate cache
  render();
}

function render() {
  computeCount = 0;
  
  let output = "<h3>useMemo Examples</h3>";
  
  // 1. Expensive computation
  output += "<h4>1. Expensive Computation</h4>";
  
  // Without memo
  let sorted1 = expensiveSort(items);
  let sorted2 = expensiveSort(items); // Computes again!
  
  // With memo
  let sorted3 = memoizedSort(items, "list");
  let sorted4 = memoizedSort(items, "list"); // Uses cache!
  
  output += '<p>Without useMemo: computed <strong>' + 2 + '</strong> times</p>';
  output += '<p>With useMemo: computed <strong>1</strong> time (cached)</p>';
  
  // 2. Filtered list
  output += "<h4>2. Filtered List</h4>";
  output += '<input value="' + filter + '" oninput="updateFilter(this.value)" placeholder="Filter..." style="padding:8px;width:200px" />';
  
  let filtered = items.filter(i => i.name.toLowerCase().includes(filter.toLowerCase()));
  output += '<ul>';
  filtered.forEach(function(item) {
    output += '<li>' + item.name + ' (value: ' + item.value + ')</li>';
  });
  output += '</ul>';
  output += '<button onclick="addItem()" style="padding:8px 16px">Add Random Item</button>';
  
  // 3. Comparison
  output += "<h4>3. useMemo vs useCallback</h4>";
  output += '<table border="1" style="border-collapse:collapse;width:100%">';
  output += '<tr><th style="padding:8px">useMemo</th><th style="padding:8px">useCallback</th></tr>';
  output += '<tr><td style="padding:8px">Memoizes VALUE</td><td style="padding:8px">Memoizes FUNCTION</td></tr>';
  output += '<tr><td style="padding:8px">For expensive calculations</td><td style="padding:8px">For event handlers</td></tr>';
  output += '<tr><td style="padding:8px">Returns computed result</td><td style="padding:8px">Returns function reference</td></tr>';
  output += '</table>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    'custom-hooks': {
      title: 'Custom Hooks',
      content: `## Custom Hooks

Extract reusable logic into custom hooks.

### Basic Pattern

\`\`\`jsx
// Custom hook - must start with "use"
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

// Usage
function Counter() {
  const { count, increment, decrement, reset } = useCounter(10);
  
  return (
    <>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </>
  );
}
\`\`\`

### useLocalStorage

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
\`\`\`

### useFetch

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        const json = await response.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    
    fetchData();
    return () => { cancelled = true; };
  }, [url]);
  
  return { data, loading, error };
}
\`\`\`

### Hook Composition

\`\`\`jsx
// Compose hooks together
function useAuth() {
  const [user, setUser] = useLocalStorage('user', null);
  const { data, loading } = useFetch('/api/me');
  
  return {
    user: user || data,
    isAuthenticated: !!user,
    loading
  };
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Custom Hooks</h2>
<div id="demo"></div>

<script>
// Custom Hook: useCounter
function useCounter(initial) {
  let state = { count: initial || 0 };
  return {
    count: state.count,
    increment: function() { state.count++; return state.count; },
    decrement: function() { state.count--; return state.count; },
    reset: function() { state.count = initial || 0; return state.count; }
  };
}

// Custom Hook: useToggle
function useToggle(initial) {
  let state = { value: initial || false };
  return {
    value: state.value,
    toggle: function() { state.value = !state.value; return state.value; },
    setTrue: function() { state.value = true; return state.value; },
    setFalse: function() { state.value = false; return state.value; }
  };
}

// Custom Hook: useLocalStorage (simulated)
function useLocalStorage(key, initial) {
  let stored = localStorage.getItem(key);
  let state = { value: stored ? JSON.parse(stored) : initial };
  return {
    value: state.value,
    setValue: function(v) {
      state.value = v;
      localStorage.setItem(key, JSON.stringify(v));
      return state.value;
    }
  };
}

// Demo instances
let counter = useCounter(0);
let toggle = useToggle(false);
let storage = useLocalStorage('demo_name', 'Guest');

function updateCounter(action) {
  counter[action]();
  render();
}

function updateToggle() {
  toggle.toggle();
  render();
}

function updateStorage(value) {
  storage.setValue(value);
  render();
}

function render() {
  let output = "<h3>Custom Hooks</h3>";
  
  // useCounter
  output += "<h4>1. useCounter</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:11px">';
  output += 'const { count, increment, decrement } = useCounter(0);';
  output += '</pre>';
  output += '<p>Count: <strong>' + counter.count + '</strong></p>';
  output += '<button onclick="updateCounter(\\'increment\\')" style="padding:8px 16px;margin:2px">+</button>';
  output += '<button onclick="updateCounter(\\'decrement\\')" style="padding:8px 16px;margin:2px">-</button>';
  output += '<button onclick="updateCounter(\\'reset\\')" style="padding:8px 16px;margin:2px">Reset</button>';
  
  // useToggle
  output += "<h4>2. useToggle</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:11px">';
  output += 'const { value, toggle } = useToggle(false);';
  output += '</pre>';
  output += '<p>Value: <strong>' + (toggle.value ? 'ON' : 'OFF') + '</strong></p>';
  output += '<button onclick="updateToggle()" style="padding:8px 16px;background:' + (toggle.value ? '#28a745' : '#dc3545') + ';color:white;border:none;border-radius:4px">Toggle</button>';
  
  // useLocalStorage
  output += "<h4>3. useLocalStorage</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:11px">';
  output += 'const [name, setName] = useLocalStorage("user", "Guest");';
  output += '</pre>';
  output += '<input value="' + storage.value + '" oninput="updateStorage(this.value)" style="padding:8px" />';
  output += '<p>Stored: <strong>' + storage.value + '</strong> (persists on refresh!)</p>';
  
  // Benefits
  output += "<h4>4. Why Custom Hooks?</h4>";
  output += '<ul>';
  output += '<li>✅ Reusable logic across components</li>';
  output += '<li>✅ Clean, testable code</li>';
  output += '<li>✅ Compose multiple hooks together</li>';
  output += '<li>✅ Share stateful logic without render props</li>';
  output += '</ul>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 8 — ADVANCED PATTERNS
    'forward-ref': {
      title: 'Forward Ref',
      content: `## forwardRef

Pass refs through components to DOM elements.

### The Problem

\`\`\`jsx
// This doesn't work!
function Input(props) {
  return <input {...props} />;
}

function Parent() {
  const inputRef = useRef();
  return <Input ref={inputRef} />; // ❌ ref doesn't reach <input>
}
\`\`\`

### The Solution

\`\`\`jsx
import { forwardRef } from 'react';

const Input = forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});

function Parent() {
  const inputRef = useRef();
  return <Input ref={inputRef} />; // ✅ ref reaches <input>
}
\`\`\`

### With useImperativeHandle

\`\`\`jsx
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; }
  }));
  
  return <input ref={inputRef} {...props} />;
});

// Usage
function Parent() {
  const inputRef = useRef();
  
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}
\`\`\`

### Common Use Cases

- Input components that need focus control
- Modal components with open/close methods
- Component libraries
- Third-party library integration`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>forwardRef</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "<h3>forwardRef Pattern</h3>";
  
  // Problem
  output += "<h4>1. The Problem</h4>";
  output += '<div style="background:#fff5f5;padding:15px;border-radius:4px">';
  output += '<pre style="font-size:12px">';
  output += '// ref prop doesn\\'t pass through!\\n';
  output += 'function Input(props) {\\n';
  output += '  return &lt;input {...props} /&gt;;\\n';
  output += '}\\n\\n';
  output += '&lt;Input ref={myRef} /&gt;  // ❌ Doesn\\'t work!';
  output += '</pre>';
  output += '</div>';
  
  // Solution
  output += "<h4>2. The Solution</h4>";
  output += '<div style="background:#f5fff5;padding:15px;border-radius:4px">';
  output += '<pre style="font-size:12px">';
  output += 'const Input = forwardRef((props, ref) => {\\n';
  output += '  return &lt;input ref={ref} {...props} /&gt;;\\n';
  output += '});\\n\\n';
  output += '&lt;Input ref={myRef} /&gt;  // ✅ Works!';
  output += '</pre>';
  output += '</div>';
  
  // Demo
  output += "<h4>3. Demo</h4>";
  output += '<input id="demoInput" type="text" placeholder="Click buttons below" style="padding:10px;width:200px" />';
  output += '<div style="margin-top:10px">';
  output += '<button onclick="document.getElementById(\\'demoInput\\').focus()" style="padding:8px 16px;margin:2px">Focus</button>';
  output += '<button onclick="document.getElementById(\\'demoInput\\').value = \\'\\'" style="padding:8px 16px;margin:2px">Clear</button>';
  output += '<button onclick="document.getElementById(\\'demoInput\\').select()" style="padding:8px 16px;margin:2px">Select All</button>';
  output += '</div>';
  
  // useImperativeHandle
  output += "<h4>4. useImperativeHandle</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:11px">';
  output += 'useImperativeHandle(ref, () => ({\\n';
  output += '  focus: () => inputRef.current.focus(),\\n';
  output += '  clear: () => inputRef.current.value = ""\\n';
  output += '}));';
  output += '</pre>';
  output += '<p>Expose custom methods instead of entire DOM node!</p>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    hoc: {
      title: 'React HOC',
      content: `## Higher-Order Components (HOC)

A pattern for reusing component logic.

### What is an HOC?

A function that takes a component and returns a new enhanced component.

\`\`\`jsx
// HOC definition
function withLoading(WrappedComponent) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

<UserListWithLoading isLoading={loading} users={users} />
\`\`\`

### Authentication HOC

\`\`\`jsx
function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    
    return <WrappedComponent {...props} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);
\`\`\`

### Data Fetching HOC

\`\`\`jsx
function withData(WrappedComponent, fetchFn) {
  return function WithData(props) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      fetchFn().then(data => {
        setData(data);
        setLoading(false);
      });
    }, []);
    
    if (loading) return <Loading />;
    return <WrappedComponent data={data} {...props} />;
  };
}
\`\`\`

### HOCs vs Hooks

Modern React prefers **hooks** over HOCs:

| HOC | Hooks |
|-----|-------|
| Wrapper components | No wrapper |
| Props namespace pollution | Clean destructuring |
| Hard to trace | Easy to trace |
| Static composition | Dynamic |

**HOCs are still useful for:**
- Reading legacy code
- Some cross-cutting concerns
- Third-party library patterns`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Higher-Order Components</h2>
<div id="demo"></div>

<script>
// Base component
function UserList(props) {
  return '<ul>' + props.users.map(u => '<li>' + u.name + '</li>').join('') + '</ul>';
}

// HOC: withLoading
function withLoading(WrappedComponent) {
  return function WithLoading(props) {
    if (props.isLoading) {
      return '<div style="color:#666">⏳ Loading...</div>';
    }
    return WrappedComponent(props);
  };
}

// HOC: withAuth
function withAuth(WrappedComponent) {
  return function WithAuth(props) {
    if (!props.isAuthenticated) {
      return '<div style="color:#dc3545">🔒 Please login to view</div>';
    }
    return WrappedComponent(props);
  };
}

// Enhanced component
let UserListWithLoading = withLoading(UserList);
let ProtectedUserList = withAuth(withLoading(UserList));

let state = {
  isLoading: false,
  isAuthenticated: true,
  users: [
    { name: "Alice" },
    { name: "Bob" },
    { name: "Charlie" }
  ]
};

function toggleLoading() {
  state.isLoading = !state.isLoading;
  render();
}

function toggleAuth() {
  state.isAuthenticated = !state.isAuthenticated;
  render();
}

function render() {
  let output = "<h3>HOC Pattern</h3>";
  
  // Definition
  output += "<h4>1. HOC Definition</h4>";
  output += '<pre style="background:#f5f5f5;padding:10px;border-radius:4px;font-size:11px">';
  output += 'function withLoading(WrappedComponent) {\\n';
  output += '  return function WithLoading(props) {\\n';
  output += '    if (props.isLoading) return &lt;Spinner /&gt;;\\n';
  output += '    return &lt;WrappedComponent {...props} /&gt;;\\n';
  output += '  };\\n';
  output += '}';
  output += '</pre>';
  
  // Demo
  output += "<h4>2. Demo</h4>";
  output += '<div style="display:flex;gap:10px;margin-bottom:10px">';
  output += '<button onclick="toggleLoading()" style="padding:8px 16px">Toggle Loading: ' + (state.isLoading ? 'ON' : 'OFF') + '</button>';
  output += '<button onclick="toggleAuth()" style="padding:8px 16px">Toggle Auth: ' + (state.isAuthenticated ? 'ON' : 'OFF') + '</button>';
  output += '</div>';
  
  output += '<div style="background:#f9f9f9;padding:15px;border-radius:4px">';
  output += '<strong>ProtectedUserList (withAuth + withLoading):</strong><br>';
  output += ProtectedUserList({ ...state });
  output += '</div>';
  
  // HOC vs Hooks
  output += "<h4>3. HOC vs Hooks</h4>";
  output += '<table border="1" style="border-collapse:collapse;width:100%">';
  output += '<tr><th style="padding:8px">HOC (Legacy)</th><th style="padding:8px">Hooks (Modern)</th></tr>';
  output += '<tr><td style="padding:8px">Wrapper hell</td><td style="padding:8px">Flat structure</td></tr>';
  output += '<tr><td style="padding:8px">Props collision</td><td style="padding:8px">Clean names</td></tr>';
  output += '<tr><td style="padding:8px">Hard to debug</td><td style="padding:8px">Easy to trace</td></tr>';
  output += '</table>';
  output += '<p style="color:#666;font-size:12px">HOCs are still found in legacy code and some libraries.</p>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
    'best-practices': {
      title: 'Best Practices',
      content: `## React Best Practices

Professional patterns for production code.

### Component Organization

\`\`\`
src/
├── components/       # Shared/reusable components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
├── features/         # Feature-based organization
│   ├── auth/
│   ├── dashboard/
│   └── users/
├── hooks/            # Custom hooks
├── utils/            # Helper functions
├── types/            # TypeScript types
└── App.tsx
\`\`\`

### Component Patterns

\`\`\`jsx
// ✅ Single responsibility
function UserCard({ user }) {
  return (
    <Card>
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions user={user} />
    </Card>
  );
}

// ✅ Prop interface first
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
\`\`\`

### State Management

1. **Start with local state**
2. Lift state only when needed
3. Use context for truly global state
4. Consider external library only for complex apps

### Performance Tips

\`\`\`jsx
// ✅ Lazy load routes
const Dashboard = lazy(() => import('./Dashboard'));

// ✅ Memoize expensive components
const ExpensiveList = React.memo(({ items }) => ...);

// ✅ Use keys correctly
{items.map(item => <Item key={item.id} />)}
\`\`\`

### Error Boundaries

\`\`\`jsx
class ErrorBoundary extends Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
\`\`\`

### Security

- Never use dangerouslySetInnerHTML with user input
- Validate all form inputs
- Use HTTPS for API calls
- Store tokens securely`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>React Best Practices</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "<h3>Production Best Practices</h3>";
  
  // 1. File Structure
  output += "<h4>1. Feature-Based Structure</h4>";
  output += '<pre style="background:#f5f5f5;padding:15px;border-radius:4px;font-size:12px">';
  output += 'src/\\n';
  output += '├── components/     # Shared components\\n';
  output += '├── features/       # Feature modules\\n';
  output += '│   ├── auth/\\n';
  output += '│   ├── dashboard/\\n';
  output += '│   └── users/\\n';
  output += '├── hooks/          # Custom hooks\\n';
  output += '├── utils/          # Helpers\\n';
  output += '└── App.tsx';
  output += '</pre>';
  
  // 2. Component patterns
  output += "<h4>2. Component Patterns</h4>";
  output += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  
  output += '<div style="background:#f5fff5;padding:10px;border-radius:4px">';
  output += '<strong>✅ Good</strong>';
  output += '<ul style="font-size:13px;margin:5px 0">';
  output += '<li>Single responsibility</li>';
  output += '<li>Props interface first</li>';
  output += '<li>Extract hooks</li>';
  output += '<li>Composition over inheritance</li>';
  output += '</ul>';
  output += '</div>';
  
  output += '<div style="background:#fff5f5;padding:10px;border-radius:4px">';
  output += '<strong>❌ Avoid</strong>';
  output += '<ul style="font-size:13px;margin:5px 0">';
  output += '<li>Giant components</li>';
  output += '<li>Inline complex logic</li>';
  output += '<li>Props drilling deep</li>';
  output += '<li>Prop mutation</li>';
  output += '</ul>';
  output += '</div>';
  
  output += '</div>';
  
  // 3. Performance
  output += "<h4>3. Performance Checklist</h4>";
  output += '<ul>';
  output += '<li>☑️ Lazy load routes</li>';
  output += '<li>☑️ Memoize expensive components</li>';
  output += '<li>☑️ Use correct keys in lists</li>';
  output += '<li>☑️ Avoid inline function in render</li>';
  output += '<li>☑️ useCallback for callback props</li>';
  output += '</ul>';
  
  // 4. State management
  output += "<h4>4. State Strategy</h4>";
  output += '<div style="background:#e8f4fc;padding:15px;border-radius:4px">';
  output += '<ol style="margin:0;padding-left:20px">';
  output += '<li>Start with <strong>useState</strong></li>';
  output += '<li>Lift state when sharing</li>';
  output += '<li>Use <strong>Context</strong> for global</li>';
  output += '<li>External lib (Redux/Zustand) only if complex</li>';
  output += '</ol>';
  output += '</div>';
  
  // 5. Security
  output += "<h4>5. Security Rules</h4>";
  output += '<ul>';
  output += '<li>⚠️ Never use dangerouslySetInnerHTML with user data</li>';
  output += '<li>🔒 Validate all inputs</li>';
  output += '<li>🌐 Use HTTPS for APIs</li>';
  output += '<li>🔑 Store tokens securely</li>';
  output += '</ul>';
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
  };

  return reactLessons[lessonSlug] || {
    title: 'Coming Soon',
    content: '## This lesson is coming soon!\n\nCheck back later for this content.',
    tryItCode: '<!-- Coming soon -->',
  };
};

// ============================================
// ANGULAR LESSON CONTENT GENERATOR
// ============================================