export const generateAngularLessonContent = (lessonSlug: string) => {
  const angularLessons: Record<string, { title: string; content: string; tryItCode: string }> = {
    // PHASE 0 — FOUNDATION
    home: {
      title: 'Angular HOME',
      content: `# Welcome to Angular

Angular is the enterprise-grade framework for building scalable web applications.

### What You'll Learn

- **Enterprise Architecture**: Design scalable module boundaries
- **TypeScript Mastery**: Leverage types for maintainable code
- **Dependency Injection**: Professional service patterns
- **Reactive Programming**: RxJS and Observables
- **State Management**: From services to NgRx
- **Performance**: Change detection optimization
- **Security**: XSS protection and secure APIs

### Why Angular?

- Used by Google, Microsoft, Forbes, and major enterprises
- Opinionated framework = consistent codebases
- Built-in tools: CLI, testing, routing, forms
- Long-term support (LTS) for production stability
- Excellent for large teams and long-lived projects

### Course Structure

1. **Foundation** — CLI, project structure, first app
2. **Core Building Blocks** — Components, templates, directives
3. **Forms** — Template-driven and reactive forms
4. **Routing** — Navigation, guards, lazy loading
5. **Services & DI** — Dependency injection patterns
6. **Lifecycle & UI** — Hooks, pipes, styling
7. **Performance** — Change detection, signals
8. **Advanced** — Dynamic components, state management
9. **Quality** — Testing, security, SSR
10. **Enterprise** — Case studies and best practices

### Prerequisites

- HTML, CSS fundamentals
- TypeScript (strongly recommended)
- JavaScript ES6+ features
- Command line basics

Let's build enterprise-grade Angular applications! 🅰️
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Welcome to Angular!</h2>
<div id="demo"></div>

<script>
// Angular is a TypeScript framework
// This example shows Angular concepts in plain JS

let angularInfo = {
  name: "Angular",
  creator: "Google",
  type: "Enterprise Framework",
  language: "TypeScript",
  released: 2016,
  version: "17+"
};

let features = [
  "Component-Based Architecture",
  "Dependency Injection",
  "RxJS Observables",
  "TypeScript Support",
  "CLI Tools",
  "Two-Way Data Binding"
];

let output = "<h3>Angular Overview</h3>";
output += "<p><strong>Name:</strong> " + angularInfo.name + "</p>";
output += "<p><strong>Created by:</strong> " + angularInfo.creator + "</p>";
output += "<p><strong>Type:</strong> " + angularInfo.type + "</p>";
output += "<p><strong>Language:</strong> " + angularInfo.language + "</p>";
output += "<p><strong>Released:</strong> " + angularInfo.released + "</p>";

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
      title: 'Angular Intro',
      content: `# Why Angular Exists

Angular is Google's enterprise framework for building web applications at scale.

### Angular vs React vs Vue

| Aspect | Angular | React | Vue |
|--------|---------|-------|-----|
| Type | Full Framework | Library | Progressive Framework |
| Language | TypeScript | JavaScript | JavaScript |
| Learning Curve | Steeper | Moderate | Gentle |
| Structure | Opinionated | Flexible | Balanced |
| Best For | Enterprise | Startups | All sizes |
| DI | Built-in | None | None |
| CLI | Powerful | Create-React-App | Vue CLI |

### Opinionated Framework vs Library

**Framework (Angular)**:
- Provides complete solution
- Enforces patterns
- Consistent codebase
- Less decision fatigue

**Library (React)**:
- Minimal core
- Choose your tools
- Flexible but fragmented
- More decisions needed

### Angular's Enterprise Strengths

1. **Structure**: Modules, services, components organized
2. **Testability**: DI makes mocking trivial
3. **Scalability**: Built for large teams
4. **Long-Term Support**: Predictable upgrade path
5. **Tooling**: CLI handles complexity

### Why Angular Lives Long in Production

- **Consistency**: Same patterns across projects
- **Hiring**: Standard skills transfer
- **Maintenance**: Clear architecture
- **Google Backing**: Regular updates
- **Enterprise Trust**: Used by banks, healthcare

### When to Choose Angular

✅ Large enterprise applications
✅ Teams with TypeScript experience
✅ Long-term maintainable projects
✅ Complex forms and workflows
✅ Strict coding standards required

### When NOT to Choose Angular

❌ Small, simple websites
❌ Quick prototypes
❌ Teams avoiding TypeScript
❌ Micro-frontends (consider alternatives)
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular vs Other Frameworks</h2>
<div id="demo"></div>

<script>
// Comparing framework philosophies

let frameworks = {
  angular: {
    type: "Full Framework",
    philosophy: "Batteries included",
    structure: "Highly opinionated",
    bestFor: "Enterprise applications",
    learningCurve: "Steep but rewarding"
  },
  react: {
    type: "UI Library",
    philosophy: "Minimal core, add what you need",
    structure: "Flexible",
    bestFor: "SPAs and dynamic UIs",
    learningCurve: "Moderate"
  },
  vue: {
    type: "Progressive Framework",
    philosophy: "Incrementally adoptable",
    structure: "Balanced",
    bestFor: "All project sizes",
    learningCurve: "Gentle"
  }
};

let output = "<h3>Framework Comparison</h3>";

for (let name in frameworks) {
  let fw = frameworks[name];
  output += "<div style='border:1px solid #ddd;padding:15px;margin:10px 0;border-radius:8px'>";
  output += "<h4 style='color:#DD0031'>" + name.charAt(0).toUpperCase() + name.slice(1) + "</h4>";
  output += "<p><strong>Type:</strong> " + fw.type + "</p>";
  output += "<p><strong>Philosophy:</strong> " + fw.philosophy + "</p>";
  output += "<p><strong>Best For:</strong> " + fw.bestFor + "</p>";
  output += "</div>";
}

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },

    'get-started': {
      title: 'Angular Get Started',
      content: `# Getting Started with Angular

Set up your development environment and create your first Angular project.

### Prerequisites

1. **Node.js** (LTS version 18+)
2. **npm** (comes with Node.js)
3. **Code editor** (VS Code recommended)

### Install Angular CLI

\`\`\`bash
npm install -g @angular/cli
\`\`\`

Verify installation:

\`\`\`bash
ng version
\`\`\`

### Create New Project

\`\`\`bash
ng new my-app
cd my-app
ng serve
\`\`\`

Open http://localhost:4200

### Workspace Structure

\`\`\`
my-app/
├── src/
│   ├── app/                  # Application code
│   │   ├── app.component.ts  # Root component
│   │   ├── app.module.ts     # Root module
│   │   └── app.routes.ts     # Routing config
│   ├── assets/               # Static assets
│   ├── environments/         # Environment configs
│   ├── index.html            # Main HTML page
│   ├── main.ts               # Entry point
│   └── styles.css            # Global styles
├── angular.json              # CLI configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md
\`\`\`

### Essential CLI Commands

| Command | Purpose |
|---------|---------|
| \`ng new\` | Create new project |
| \`ng serve\` | Start dev server |
| \`ng generate\` | Generate code |
| \`ng build\` | Build for production |
| \`ng test\` | Run unit tests |
| \`ng lint\` | Lint code |

### Generate Components

\`\`\`bash
ng generate component header
ng g c features/dashboard  # Shorthand
\`\`\`

### Versioning & LTS

Angular follows semantic versioning:
- Major releases every 6 months
- LTS support for 18 months
- Predictable upgrade path

Check https://angular.dev for latest version.
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular CLI Commands</h2>
<div id="demo"></div>

<script>
// Angular CLI commands reference

let cliCommands = [
  { command: "ng new my-app", description: "Create new Angular project" },
  { command: "ng serve", description: "Start development server" },
  { command: "ng serve --open", description: "Serve and open browser" },
  { command: "ng generate component name", description: "Generate component" },
  { command: "ng g c name", description: "Generate component (shorthand)" },
  { command: "ng generate service name", description: "Generate service" },
  { command: "ng generate module name", description: "Generate module" },
  { command: "ng build", description: "Build for development" },
  { command: "ng build --configuration=production", description: "Production build" },
  { command: "ng test", description: "Run unit tests" },
  { command: "ng e2e", description: "Run end-to-end tests" },
  { command: "ng lint", description: "Lint TypeScript code" },
  { command: "ng update", description: "Update Angular packages" }
];

let output = "<h3>CLI Reference</h3>";
output += "<table border='1' style='border-collapse:collapse;width:100%'>";
output += "<tr style='background:#DD0031;color:white'><th style='padding:10px'>Command</th><th style='padding:10px'>Description</th></tr>";

cliCommands.forEach(function(cmd) {
  output += "<tr>";
  output += "<td style='padding:8px;font-family:monospace;background:#f5f5f5'>" + cmd.command + "</td>";
  output += "<td style='padding:8px'>" + cmd.description + "</td>";
  output += "</tr>";
});

output += "</table>";

output += "<h4 style='margin-top:20px'>Project Structure</h4>";
output += "<pre style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px'>";
output += "my-app/\\n";
output += "├── src/\\n";
output += "│   ├── app/              (Your code)\\n";
output += "│   ├── assets/           (Static files)\\n";
output += "│   └── main.ts           (Entry point)\\n";
output += "├── angular.json          (CLI config)\\n";
output += "└── package.json          (Dependencies)";
output += "</pre>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },

    'first-app': {
      title: 'Angular First App',
      content: `# Your First Angular Application

Understanding the Angular bootstrapping process.

### The Bootstrap Flow

\`\`\`
main.ts → AppModule → AppComponent → index.html
\`\`\`

### main.ts — Entry Point

\`\`\`typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
\`\`\`

### AppModule — Root Module

\`\`\`typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
\`\`\`

### AppComponent — Root Component

\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <h1>{{ title }}</h1>
    <p>Welcome to Angular!</p>
  \`,
  styles: [\`h1 { color: #DD0031; }\`]
})
export class AppComponent {
  title = 'My First App';
}
\`\`\`

### index.html — Host Page

\`\`\`html
<!doctype html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <app-root></app-root>  <!-- Angular inserts here -->
</body>
</html>
\`\`\`

### Standalone Components (Modern Angular)

Angular 14+ supports standalone components without modules:

\`\`\`typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: \`<h1>{{ title }}</h1>\`
})
export class AppComponent {
  title = 'Standalone App';
}
\`\`\`

### Compilation Pipeline

1. **TypeScript** → JavaScript
2. **Templates** → Render functions
3. **Styles** → Scoped CSS
4. **Bundling** → Optimized chunks
5. **Tree-shaking** → Remove unused code
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Bootstrap Flow</h2>
<div id="demo"></div>

<script>
// Simulating Angular's bootstrap process

// Step 1: Entry Point (main.ts)
let bootstrap = {
  step1: {
    name: "main.ts",
    action: "Platform bootstrap",
    code: "platformBrowserDynamic().bootstrapModule(AppModule)"
  },
  step2: {
    name: "AppModule",
    action: "Root module initialization",
    code: "@NgModule({ bootstrap: [AppComponent] })"
  },
  step3: {
    name: "AppComponent",
    action: "Root component rendering",
    code: "@Component({ selector: 'app-root' })"
  },
  step4: {
    name: "index.html",
    action: "DOM insertion",
    code: "<app-root></app-root>"
  }
};

let output = "<h3>Bootstrap Sequence</h3>";
output += "<div style='display:flex;flex-direction:column;gap:10px'>";

let stepNum = 1;
for (let key in bootstrap) {
  let step = bootstrap[key];
  output += "<div style='border-left:4px solid #DD0031;padding:15px;background:#fff5f7'>";
  output += "<strong style='color:#DD0031'>Step " + stepNum + ": " + step.name + "</strong>";
  output += "<p style='margin:5px 0'>" + step.action + "</p>";
  output += "<code style='background:#1e1e1e;color:#9cdcfe;padding:5px 10px;display:block;border-radius:4px'>" + step.code + "</code>";
  output += "</div>";
  stepNum++;
}

output += "</div>";

output += "<h4 style='margin-top:20px'>Result</h4>";
output += "<div style='border:2px dashed #DD0031;padding:20px;text-align:center'>";
output += "<h1 style='color:#DD0031'>My First App</h1>";
output += "<p>Welcome to Angular!</p>";
output += "</div>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },

    // PHASE 2 — CORE BUILDING BLOCKS
    templates: {
      title: 'Angular Templates',
      content: `# Angular Templates

Templates are the view layer of Angular components.

### Template Syntax Overview

| Syntax | Purpose | Example |
|--------|---------|---------|
| \`{{ }}\` | Interpolation | \`{{ title }}\` |
| \`[property]\` | Property binding | \`[src]="imageUrl"\` |
| \`(event)\` | Event binding | \`(click)="onClick()"\` |
| \`[(ngModel)]\` | Two-way binding | \`[(ngModel)]="name"\` |

### Interpolation

Display component data in templates:

\`\`\`html
<h1>{{ title }}</h1>
<p>{{ user.name }}</p>
<span>{{ 2 + 2 }}</span>
<div>{{ getFullName() }}</div>
\`\`\`

### Property Binding

Bind element properties to component values:

\`\`\`html
<!-- Attribute binding -->
<img [src]="imageUrl" [alt]="imageAlt">

<!-- Class binding -->
<div [class.active]="isActive"></div>

<!-- Style binding -->
<p [style.color]="textColor"></p>

<!-- Disabled state -->
<button [disabled]="isLoading">Submit</button>
\`\`\`

### Event Binding

React to user interactions:

\`\`\`html
<button (click)="onClick()">Click Me</button>
<input (input)="onInput($event)">
<form (submit)="onSubmit($event)">
\`\`\`

### Two-Way Binding

Combine property and event binding:

\`\`\`html
<!-- Requires FormsModule -->
<input [(ngModel)]="username">

<!-- Equivalent to: -->
<input [ngModel]="username" (ngModelChange)="username = $event">
\`\`\`

### Template Reference Variables

Get direct access to elements:

\`\`\`html
<input #nameInput>
<button (click)="greet(nameInput.value)">Greet</button>
\`\`\`

### Safe Navigation Operator

Handle null/undefined safely:

\`\`\`html
<p>{{ user?.address?.city }}</p>
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Template Syntax</h2>
<div id="demo"></div>

<script>
// Simulating Angular template concepts

let component = {
  title: "Welcome to Angular",
  user: { name: "John", email: "john@example.com" },
  imageUrl: "https://angular.io/assets/images/logos/angular/angular.svg",
  isActive: true,
  textColor: "#DD0031",
  count: 0
};

function render() {
  let output = "<h3>Template Examples</h3>";
  
  // Interpolation
  output += "<div style='background:#f5f5f5;padding:15px;margin:10px 0;border-radius:8px'>";
  output += "<h4>Interpolation {{ }}</h4>";
  output += "<p>Title: <strong>" + component.title + "</strong></p>";
  output += "<p>User: " + component.user.name + "</p>";
  output += "<p>Math: {{ 2 + 2 }} = " + (2 + 2) + "</p>";
  output += "</div>";
  
  // Property Binding
  output += "<div style='background:#fff5f7;padding:15px;margin:10px 0;border-radius:8px'>";
  output += "<h4>Property Binding [property]</h4>";
  output += "<img src='" + component.imageUrl + "' alt='Angular' style='height:50px'>";
  output += "<p style='color:" + component.textColor + "'>Text with bound color</p>";
  output += "</div>";
  
  // Event Binding
  output += "<div style='background:#f0fff0;padding:15px;margin:10px 0;border-radius:8px'>";
  output += "<h4>Event Binding (event)</h4>";
  output += "<p>Count: <span id='count'>" + component.count + "</span></p>";
  output += "<button onclick='increment()' style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Click Me</button>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function increment() {
  component.count++;
  document.getElementById("count").textContent = component.count;
}

render();
</script>

</body>
</html>`,
    },

    components: {
      title: 'Angular Components',
      content: `# Angular Components

Components are the building blocks of Angular applications.

### Component Anatomy

\`\`\`typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-card',      // HTML tag name
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  // Properties
  name = 'John Doe';
  isActive = true;
  
  // Methods
  toggleActive() {
    this.isActive = !this.isActive;
  }
}
\`\`\`

### Component Metadata

| Property | Purpose |
|----------|---------|
| \`selector\` | HTML tag to use |
| \`template\` | Inline HTML |
| \`templateUrl\` | External HTML file |
| \`styles\` | Inline CSS array |
| \`styleUrls\` | External CSS files |
| \`standalone\` | No module needed |
| \`imports\` | Dependencies (standalone) |

### Template vs Logic Separation

**Component Class** (Logic):
- Business logic
- State management
- Event handlers
- API calls

**Template** (View):
- HTML structure
- Data display
- User interactions
- Styling

### Component Responsibility Boundaries

Follow Single Responsibility Principle:

\`\`\`
✅ UserCardComponent — Display user info
✅ UserListComponent — List of users
✅ UserFormComponent — Edit user

❌ UserEverythingComponent — Does too much
\`\`\`

### Standalone Components (Modern)

\`\`\`typescript
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: \`
    <nav>
      <a routerLink="/">Home</a>
    </nav>
  \`
})
export class HeaderComponent { }
\`\`\`

### Generate Components

\`\`\`bash
ng generate component user-card
ng g c features/dashboard --standalone
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Component Structure</h2>
<div id="demo"></div>

<script>
// Simulating Angular component concepts

// Component Class
class UserCardComponent {
  constructor(name, email, role) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = true;
  }
  
  toggleActive() {
    this.isActive = !this.isActive;
    return this.isActive;
  }
  
  getDisplayRole() {
    return this.role.charAt(0).toUpperCase() + this.role.slice(1);
  }
}

// Create component instances
let users = [
  new UserCardComponent("Alice Johnson", "alice@example.com", "admin"),
  new UserCardComponent("Bob Smith", "bob@example.com", "developer"),
  new UserCardComponent("Carol White", "carol@example.com", "designer")
];

function render() {
  let output = "<h3>User Cards</h3>";
  output += "<div style='display:flex;flex-wrap:wrap;gap:15px'>";
  
  users.forEach(function(user, index) {
    let statusColor = user.isActive ? "#4caf50" : "#f44336";
    let statusText = user.isActive ? "Active" : "Inactive";
    
    output += "<div id='card-" + index + "' style='border:1px solid #ddd;padding:20px;border-radius:8px;width:200px;background:white;box-shadow:0 2px 4px rgba(0,0,0,0.1)'>";
    output += "<h4 style='margin:0;color:#DD0031'>" + user.name + "</h4>";
    output += "<p style='color:#666;font-size:14px;margin:8px 0'>" + user.email + "</p>";
    output += "<p style='margin:8px 0'><span style='background:#e3f2fd;padding:4px 8px;border-radius:4px;font-size:12px'>" + user.getDisplayRole() + "</span></p>";
    output += "<p style='margin:8px 0'><span id='status-" + index + "' style='color:" + statusColor + "'>● " + statusText + "</span></p>";
    output += "<button onclick='toggleUser(" + index + ")' style='padding:8px 16px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Toggle</button>";
    output += "</div>";
  });
  
  output += "</div>";
  document.getElementById("demo").innerHTML = output;
}

function toggleUser(index) {
  let isActive = users[index].toggleActive();
  let statusEl = document.getElementById("status-" + index);
  if (isActive) {
    statusEl.innerHTML = "<span style='color:#4caf50'>● Active</span>";
  } else {
    statusEl.innerHTML = "<span style='color:#f44336'>● Inactive</span>";
  }
}

render();
</script>

</body>
</html>`,
    },

    'data-binding': {
      title: 'Angular Data Binding',
      content: `# Angular Data Binding

Data binding connects component logic to the template.

### Types of Data Binding

1. **One-Way (Component → View)**
   - Interpolation: \`{{ value }}\`
   - Property: \`[property]="value"\`

2. **One-Way (View → Component)**
   - Event: \`(event)="handler()"\`

3. **Two-Way (Both directions)**
   - NgModel: \`[(ngModel)]="value"\`

### One-Way Binding Examples

\`\`\`typescript
@Component({
  template: \`
    <!-- Interpolation -->
    <h1>{{ title }}</h1>
    
    <!-- Property binding -->
    <img [src]="imageUrl">
    <button [disabled]="isLoading">Submit</button>
    
    <!-- Class binding -->
    <div [class.active]="isActive"></div>
    
    <!-- Style binding -->
    <p [style.color]="textColor">Styled text</p>
  \`
})
export class MyComponent {
  title = 'Hello Angular';
  imageUrl = 'image.jpg';
  isLoading = false;
  isActive = true;
  textColor = 'blue';
}
\`\`\`

### Two-Way Binding with NgModel

\`\`\`typescript
// In module: import { FormsModule } from '@angular/forms';

@Component({
  template: \`
    <input [(ngModel)]="username">
    <p>Hello, {{ username }}!</p>
  \`
})
export class FormComponent {
  username = '';
}
\`\`\`

### When NOT to Use NgModel

- Complex forms → Use Reactive Forms
- Performance-critical → Use one-way + events
- Custom components → Implement ControlValueAccessor

### Change Propagation Model

\`\`\`
Component Property Changes
         ↓
    Zone.js Detects
         ↓
  Change Detection Runs
         ↓
    View Updates
\`\`\`

### Best Practices

1. Prefer one-way binding for simplicity
2. Use \`[property]\` over \`attr.property\`
3. Avoid complex expressions in templates
4. Move logic to component methods
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Data Binding</h2>
<div id="demo"></div>

<script>
// Simulating Angular data binding

let state = {
  title: "Data Binding Demo",
  username: "",
  isActive: true,
  textColor: "#DD0031",
  count: 0
};

function render() {
  let output = "<h3>" + state.title + "</h3>";
  
  // Two-Way Binding Simulation
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Two-Way Binding [(ngModel)]</h4>";
  output += "<input id='nameInput' type='text' value='" + state.username + "' oninput='updateName(this.value)' placeholder='Enter your name' style='padding:10px;font-size:16px;width:200px;border:2px solid #DD0031;border-radius:4px'>";
  output += "<p>Hello, <strong id='nameDisplay'>" + (state.username || "Guest") + "</strong>!</p>";
  output += "</div>";
  
  // Property Binding
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Property Binding [property]</h4>";
  output += "<p style='color:" + state.textColor + "'>[style.color] = '" + state.textColor + "'</p>";
  output += "<button " + (state.count >= 5 ? "disabled" : "") + " onclick='incrementCount()' style='padding:10px 20px;background:" + (state.count >= 5 ? "#ccc" : "#DD0031") + ";color:white;border:none;border-radius:4px'>[disabled]='count >= 5'</button>";
  output += "<p>Count: <span id='countDisplay'>" + state.count + "</span>/5</p>";
  output += "</div>";
  
  // Class Binding
  output += "<div style='background:#f0fff0;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Class Binding [class.active]</h4>";
  output += "<div id='statusBox' style='padding:20px;border-radius:8px;text-align:center;" + (state.isActive ? "background:#4caf50;color:white" : "background:#f44336;color:white") + "'>";
  output += state.isActive ? "Active" : "Inactive";
  output += "</div>";
  output += "<button onclick='toggleActive()' style='margin-top:10px;padding:10px 20px;border:none;border-radius:4px;cursor:pointer'>Toggle Status</button>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function updateName(value) {
  state.username = value;
  document.getElementById("nameDisplay").textContent = value || "Guest";
}

function incrementCount() {
  if (state.count < 5) {
    state.count++;
    document.getElementById("countDisplay").textContent = state.count;
    if (state.count >= 5) {
      render(); // Re-render to disable button
    }
  }
}

function toggleActive() {
  state.isActive = !state.isActive;
  render();
}

render();
</script>

</body>
</html>`,
    },

    directives: {
      title: 'Angular Directives',
      content: `# Angular Directives

Directives extend HTML with custom behavior.

### Types of Directives

1. **Structural Directives** — Change DOM structure
2. **Attribute Directives** — Change element appearance
3. **Component Directives** — Components are directives with templates

### Structural Directives

Use \`*\` prefix (sugar syntax for ng-template):

\`\`\`html
<!-- *ngIf - Conditional rendering -->
<div *ngIf="isLoggedIn">Welcome, {{ user.name }}!</div>
<div *ngIf="isLoggedIn; else loginTemplate">Dashboard</div>
<ng-template #loginTemplate>Please log in</ng-template>

<!-- *ngFor - Loop rendering -->
<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackById">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>

<!-- *ngSwitch - Multiple conditions -->
<div [ngSwitch]="status">
  <p *ngSwitchCase="'active'">User is active</p>
  <p *ngSwitchCase="'pending'">Awaiting approval</p>
  <p *ngSwitchDefault>Unknown status</p>
</div>
\`\`\`

### Attribute Directives

\`\`\`html
<!-- ngClass - Multiple classes -->
<div [ngClass]="{'active': isActive, 'disabled': isDisabled}">

<!-- ngStyle - Multiple styles -->
<div [ngStyle]="{'color': textColor, 'font-size': fontSize + 'px'}">
\`\`\`

### Custom Directive (SME Skill)

\`\`\`typescript
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}
  
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('#ffeb3b');
  }
  
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
  
  private highlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
\`\`\`

Usage:

\`\`\`html
<p appHighlight>Hover over me!</p>
\`\`\`

### Modern Control Flow (Angular 17+)

\`\`\`html
@if (isLoggedIn) {
  <dashboard />
} @else {
  <login />
}

@for (item of items; track item.id) {
  <item-card [data]="item" />
}
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Directives</h2>
<div id="demo"></div>

<script>
// Simulating Angular directives

let state = {
  isLoggedIn: true,
  user: { name: "John Doe" },
  items: [
    { id: 1, name: "Angular Basics", completed: true },
    { id: 2, name: "Components", completed: true },
    { id: 3, name: "Directives", completed: false },
    { id: 4, name: "Services", completed: false }
  ],
  status: "active"
};

function render() {
  let output = "";
  
  // *ngIf simulation
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>*ngIf — Conditional Rendering</h4>";
  output += "<button onclick='toggleLogin()' style='padding:10px 20px;margin-bottom:15px;border:none;border-radius:4px;cursor:pointer;background:#DD0031;color:white'>Toggle Login</button>";
  if (state.isLoggedIn) {
    output += "<div style='background:#e8f5e9;padding:15px;border-radius:4px'>Welcome, <strong>" + state.user.name + "</strong>!</div>";
  } else {
    output += "<div style='background:#ffebee;padding:15px;border-radius:4px'>Please log in to continue</div>";
  }
  output += "</div>";
  
  // *ngFor simulation
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>*ngFor — List Rendering</h4>";
  output += "<ul style='list-style:none;padding:0'>";
  state.items.forEach(function(item, index) {
    let bgColor = item.completed ? "#e8f5e9" : "#fff";
    let icon = item.completed ? "✅" : "⏳";
    output += "<li style='padding:12px;margin:5px 0;background:" + bgColor + ";border-radius:4px;display:flex;align-items:center'>";
    output += "<span style='margin-right:10px'>" + icon + "</span>";
    output += "<span style='margin-right:10px;color:#666'>" + (index + 1) + ".</span>";
    output += "<span>" + item.name + "</span>";
    output += "<button onclick='toggleItem(" + index + ")' style='margin-left:auto;padding:5px 10px;border:none;border-radius:4px;cursor:pointer'>Toggle</button>";
    output += "</li>";
  });
  output += "</ul>";
  output += "</div>";
  
  // *ngSwitch simulation
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>*ngSwitch — Multiple Conditions</h4>";
  output += "<select onchange='changeStatus(this.value)' style='padding:10px;margin-bottom:15px;border-radius:4px'>";
  output += "<option value='active'" + (state.status === 'active' ? " selected" : "") + ">Active</option>";
  output += "<option value='pending'" + (state.status === 'pending' ? " selected" : "") + ">Pending</option>";
  output += "<option value='inactive'" + (state.status === 'inactive' ? " selected" : "") + ">Inactive</option>";
  output += "</select>";
  
  let statusMessage = "";
  let statusColor = "";
  if (state.status === 'active') {
    statusMessage = "✅ User is active and verified";
    statusColor = "#4caf50";
  } else if (state.status === 'pending') {
    statusMessage = "⏳ Awaiting approval";
    statusColor = "#ff9800";
  } else {
    statusMessage = "❌ Account is inactive";
    statusColor = "#f44336";
  }
  output += "<div style='padding:15px;background:white;border-left:4px solid " + statusColor + ";border-radius:4px'>" + statusMessage + "</div>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function toggleLogin() {
  state.isLoggedIn = !state.isLoggedIn;
  render();
}

function toggleItem(index) {
  state.items[index].completed = !state.items[index].completed;
  render();
}

function changeStatus(value) {
  state.status = value;
  render();
}

render();
</script>

</body>
</html>`,
    },

    events: {
      title: 'Angular Events',
      content: `# Angular Events

Handle user interactions in Angular applications.

### DOM Events

\`\`\`html
<!-- Click events -->
<button (click)="onClick()">Click Me</button>
<button (click)="onClick($event)">With Event Object</button>

<!-- Keyboard events -->
<input (keyup)="onKeyUp($event)">
<input (keyup.enter)="onEnter()">
<input (keydown.escape)="onEscape()">

<!-- Form events -->
<input (input)="onInput($event)">
<input (change)="onChange()">
<input (focus)="onFocus()">
<input (blur)="onBlur()">

<!-- Mouse events -->
<div (mouseenter)="onHover()">
<div (mouseleave)="onLeave()">
<div (mousemove)="onMove($event)">
\`\`\`

### Event Object

\`\`\`typescript
@Component({
  template: \`
    <input (keyup)="onKeyUp($event)">
    <button (click)="onClick($event)">Click</button>
  \`
})
export class EventComponent {
  onKeyUp(event: KeyboardEvent) {
    console.log('Key:', event.key);
    console.log('Target:', event.target);
  }
  
  onClick(event: MouseEvent) {
    console.log('X:', event.clientX);
    console.log('Y:', event.clientY);
  }
}
\`\`\`

### Custom Events with EventEmitter

\`\`\`typescript
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="increment()">+</button>
    <span>{{ count }}</span>
  \`
})
export class CounterComponent {
  count = 0;
  
  @Output() countChanged = new EventEmitter<number>();
  
  increment() {
    this.count++;
    this.countChanged.emit(this.count);
  }
}
\`\`\`

Parent usage:

\`\`\`html
<app-counter (countChanged)="onCountChange($event)"></app-counter>
\`\`\`

### Event Emitters vs Outputs

- Both are for component communication
- \`@Output()\` is the decorator
- \`EventEmitter\` is the type
- Child emits, parent listens
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Events</h2>
<div id="demo"></div>
<div id="log" style="margin-top:20px;padding:15px;background:#1e1e1e;color:#9cdcfe;border-radius:8px;font-family:monospace;max-height:200px;overflow-y:auto"></div>

<script>
let logs = [];

function addLog(message) {
  let time = new Date().toLocaleTimeString();
  logs.unshift("[" + time + "] " + message);
  if (logs.length > 10) logs.pop();
  renderLogs();
}

function renderLogs() {
  let logOutput = logs.join("<br>");
  document.getElementById("log").innerHTML = logOutput || "Events will appear here...";
}

function render() {
  let output = "";
  
  // Click Events
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>(click) — Click Events</h4>";
  output += "<button onclick='handleClick()' style='padding:10px 20px;margin:5px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Simple Click</button>";
  output += "<button onclick='handleClickWithEvent(event)' style='padding:10px 20px;margin:5px;background:#3f51b5;color:white;border:none;border-radius:4px;cursor:pointer'>With $event</button>";
  output += "</div>";
  
  // Keyboard Events
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>(keyup) — Keyboard Events</h4>";
  output += "<input id='keyInput' type='text' onkeyup='handleKeyUp(event)' placeholder='Type something...' style='padding:10px;font-size:16px;width:250px;border:2px solid #DD0031;border-radius:4px'>";
  output += "<p style='font-size:14px;color:#666'>Try pressing Enter or Escape</p>";
  output += "</div>";
  
  // Mouse Events
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>(mouseenter/mouseleave) — Mouse Events</h4>";
  output += "<div id='hoverBox' onmouseenter='handleMouseEnter()' onmouseleave='handleMouseLeave()' style='padding:30px;background:#fff;border:2px dashed #2196f3;border-radius:8px;text-align:center;transition:all 0.3s'>";
  output += "Hover over me!";
  output += "</div>";
  output += "</div>";
  
  // Custom Event (EventEmitter simulation)
  output += "<div style='background:#f0fff0;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>@Output() EventEmitter</h4>";
  output += "<p>Counter: <strong id='counterValue'>0</strong></p>";
  output += "<button onclick='handleIncrement()' style='padding:10px 20px;margin:5px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer'>Increment (+)</button>";
  output += "<button onclick='handleDecrement()' style='padding:10px 20px;margin:5px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>Decrement (-)</button>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
  renderLogs();
}

let counter = 0;

function handleClick() {
  addLog("(click) Button clicked!");
}

function handleClickWithEvent(event) {
  addLog("(click) Clicked at X:" + event.clientX + ", Y:" + event.clientY);
}

function handleKeyUp(event) {
  if (event.key === 'Enter') {
    addLog("(keyup.enter) Enter pressed! Value: " + event.target.value);
    event.target.value = "";
  } else if (event.key === 'Escape') {
    addLog("(keyup.escape) Escape pressed, clearing input");
    event.target.value = "";
  } else {
    addLog("(keyup) Key pressed: " + event.key);
  }
}

function handleMouseEnter() {
  document.getElementById("hoverBox").style.background = "#DD0031";
  document.getElementById("hoverBox").style.color = "white";
  addLog("(mouseenter) Mouse entered the box");
}

function handleMouseLeave() {
  document.getElementById("hoverBox").style.background = "#fff";
  document.getElementById("hoverBox").style.color = "black";
  addLog("(mouseleave) Mouse left the box");
}

function handleIncrement() {
  counter++;
  document.getElementById("counterValue").textContent = counter;
  addLog("(countChanged) EventEmitter: count is now " + counter);
}

function handleDecrement() {
  counter--;
  document.getElementById("counterValue").textContent = counter;
  addLog("(countChanged) EventEmitter: count is now " + counter);
}

render();
</script>

</body>
</html>`,
    },

    conditionals: {
      title: 'Angular Conditionals & Lists',
      content: `# Conditional & List Rendering

Efficiently render dynamic content in Angular.

### Conditional Rendering Strategies

**Simple Condition:**
\`\`\`html
<div *ngIf="isVisible">Visible content</div>
\`\`\`

**With Else:**
\`\`\`html
<div *ngIf="isLoggedIn; else loginTemplate">
  Welcome, {{ user.name }}!
</div>
<ng-template #loginTemplate>
  <button>Log In</button>
</ng-template>
\`\`\`

**With Then/Else:**
\`\`\`html
<div *ngIf="loading; then loadingTemplate; else contentTemplate"></div>
<ng-template #loadingTemplate>Loading...</ng-template>
<ng-template #contentTemplate>{{ data }}</ng-template>
\`\`\`

### List Rendering with TrackBy

**Basic Loop:**
\`\`\`html
<ul>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>
\`\`\`

**With Index and TrackBy:**
\`\`\`html
<ul>
  <li *ngFor="let item of items; let i = index; trackBy: trackById">
    {{ i + 1 }}. {{ item.name }}
  </li>
</ul>
\`\`\`

\`\`\`typescript
trackById(index: number, item: Item): number {
  return item.id;
}
\`\`\`

### Why TrackBy Matters (Performance)

**Without TrackBy:**
- Angular destroys and recreates ALL DOM elements
- Even if only one item changed

**With TrackBy:**
- Angular tracks items by unique ID
- Only changed items are updated
- Huge performance gain for large lists

### DOM Churn Prevention

\`\`\`typescript
// ❌ Bad: Creates new array reference
this.items = this.items.filter(x => x.active);

// ✅ Good: Mutate in place or use trackBy
const filtered = this.items.filter(x => x.active);
this.items = [...filtered];

// Component:
trackById(index: number, item: Item) {
  return item.id; // Stable identity
}
\`\`\`

### Modern Control Flow (Angular 17+)

\`\`\`html
@if (isLoggedIn) {
  <p>Welcome!</p>
} @else {
  <p>Please log in</p>
}

@for (item of items; track item.id) {
  <app-item [data]="item" />
} @empty {
  <p>No items found</p>
}
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Conditionals & Lists</h2>
<div id="demo"></div>

<script>
let state = {
  isLoggedIn: false,
  loading: false,
  items: [
    { id: 1, name: "Learn Angular", priority: "high", completed: false },
    { id: 2, name: "Build Components", priority: "high", completed: true },
    { id: 3, name: "Master RxJS", priority: "medium", completed: false },
    { id: 4, name: "Deploy App", priority: "low", completed: false }
  ],
  filter: "all"
};

let renderCount = 0;

function render() {
  renderCount++;
  let output = "";
  
  // *ngIf with else
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>*ngIf with else template</h4>";
  output += "<button onclick='toggleLogin()' style='padding:10px 20px;margin-bottom:15px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Toggle Login State</button>";
  
  if (state.isLoggedIn) {
    output += "<div style='padding:15px;background:#e8f5e9;border-radius:4px'>👤 Welcome back, User!</div>";
  } else {
    output += "<div style='padding:15px;background:#fff3e0;border-radius:4px'>🔐 Please <strong>Log In</strong> to continue</div>";
  }
  output += "</div>";
  
  // *ngFor with trackBy
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>*ngFor with trackBy (Render #" + renderCount + ")</h4>";
  
  // Filter buttons
  output += "<div style='margin-bottom:15px'>";
  output += "<button onclick='setFilter(\"all\")' style='padding:8px 16px;margin-right:5px;background:" + (state.filter === 'all' ? '#DD0031' : '#ddd') + ";color:" + (state.filter === 'all' ? 'white' : 'black') + ";border:none;border-radius:4px;cursor:pointer'>All</button>";
  output += "<button onclick='setFilter(\"active\")' style='padding:8px 16px;margin-right:5px;background:" + (state.filter === 'active' ? '#DD0031' : '#ddd') + ";color:" + (state.filter === 'active' ? 'white' : 'black') + ";border:none;border-radius:4px;cursor:pointer'>Active</button>";
  output += "<button onclick='setFilter(\"completed\")' style='padding:8px 16px;background:" + (state.filter === 'completed' ? '#DD0031' : '#ddd') + ";color:" + (state.filter === 'completed' ? 'white' : 'black') + ";border:none;border-radius:4px;cursor:pointer'>Completed</button>";
  output += "</div>";
  
  // Filtered items
  let filtered = state.items.filter(function(item) {
    if (state.filter === 'all') return true;
    if (state.filter === 'active') return !item.completed;
    if (state.filter === 'completed') return item.completed;
  });
  
  output += "<ul style='list-style:none;padding:0'>";
  filtered.forEach(function(item, index) {
    let priorityColor = item.priority === 'high' ? '#f44336' : (item.priority === 'medium' ? '#ff9800' : '#4caf50');
    let bgColor = item.completed ? '#f5f5f5' : '#fff';
    let textStyle = item.completed ? 'text-decoration:line-through;color:#999' : '';
    
    output += "<li data-id='" + item.id + "' style='padding:15px;margin:8px 0;background:" + bgColor + ";border-radius:8px;border-left:4px solid " + priorityColor + ";display:flex;align-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)'>";
    output += "<span style='margin-right:10px;color:#666'>#" + item.id + "</span>";
    output += "<span style='flex:1;" + textStyle + "'>" + item.name + "</span>";
    output += "<span style='padding:4px 8px;background:" + priorityColor + ";color:white;border-radius:4px;font-size:12px;margin-right:10px'>" + item.priority + "</span>";
    output += "<button onclick='toggleItem(" + item.id + ")' style='padding:5px 10px;border:none;border-radius:4px;cursor:pointer'>" + (item.completed ? "Undo" : "Done") + "</button>";
    output += "</li>";
  });
  output += "</ul>";
  
  output += "<p style='color:#666;font-size:12px'>TrackBy: item.id ensures efficient DOM updates</p>";
  output += "</div>";
  
  // Add item
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Add New Item</h4>";
  output += "<input id='newItem' type='text' placeholder='New task name' style='padding:10px;width:200px;border:1px solid #ddd;border-radius:4px'>";
  output += "<button onclick='addItem()' style='padding:10px 20px;margin-left:10px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>Add</button>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function toggleLogin() {
  state.isLoggedIn = !state.isLoggedIn;
  render();
}

function setFilter(filter) {
  state.filter = filter;
  render();
}

function toggleItem(id) {
  let item = state.items.find(function(i) { return i.id === id; });
  if (item) item.completed = !item.completed;
  render();
}

function addItem() {
  let input = document.getElementById("newItem");
  if (input.value.trim()) {
    let newId = Math.max.apply(null, state.items.map(function(i) { return i.id; })) + 1;
    state.items.push({
      id: newId,
      name: input.value.trim(),
      priority: "medium",
      completed: false
    });
    input.value = "";
    render();
  }
}

render();
</script>

</body>
</html>`,
    },

    // Continue with Phase 3-11 lessons...
    'forms-intro': {
      title: 'Angular Forms Intro',
      content: `# Angular Forms

Forms are critical for enterprise applications.

### Template-Driven vs Reactive Forms

| Aspect | Template-Driven | Reactive |
|--------|-----------------|----------|
| Logic Location | Template | Component |
| Model | Implicit | Explicit |
| Validation | Directives | Functions |
| Testing | Harder | Easier |
| Dynamic Forms | Difficult | Easy |
| Best For | Simple forms | Complex forms |

### Why Enterprises Choose Reactive Forms

1. **Explicit Model**: Form structure in TypeScript
2. **Type Safety**: Full TypeScript support
3. **Testability**: Easy unit testing
4. **Dynamic**: Add/remove fields at runtime
5. **Validation**: Programmatic control

### Template-Driven Form

\`\`\`typescript
// Module: import { FormsModule } from '@angular/forms';

@Component({
  template: \`
    <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)">
      <input name="email" ngModel required email>
      <button [disabled]="userForm.invalid">Submit</button>
    </form>
  \`
})
export class UserFormComponent {
  onSubmit(form: NgForm) {
    console.log(form.value);
  }
}
\`\`\`

### Reactive Form

\`\`\`typescript
// Module: import { ReactiveFormsModule } from '@angular/forms';

@Component({
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email">
      <button [disabled]="form.invalid">Submit</button>
    </form>
  \`
})
export class UserFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  onSubmit() {
    console.log(this.form.value);
  }
}
\`\`\`

### When to Use Which

**Template-Driven:**
- Login forms
- Simple contact forms
- Quick prototypes

**Reactive:**
- Multi-step wizards
- Dynamic field arrays
- Complex validation
- Enterprise applications
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Forms Comparison</h2>
<div id="demo"></div>

<script>
// Simulating different form approaches

function render() {
  let output = "";
  
  // Template-Driven Simulation
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Template-Driven Form</h4>";
  output += "<p style='color:#666;font-size:14px'>Simple forms with ngModel</p>";
  output += "<form id='templateForm' onsubmit='handleTemplateSubmit(event)'>";
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px'>Email</label>";
  output += "<input id='td-email' type='email' required style='padding:10px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px'>Password</label>";
  output += "<input id='td-password' type='password' required minlength='6' style='padding:10px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "<button type='submit' style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Login</button>";
  output += "</form>";
  output += "</div>";
  
  // Reactive Form Simulation
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>Reactive Form</h4>";
  output += "<p style='color:#666;font-size:14px'>Complex forms with FormGroup/FormControl</p>";
  output += "<form id='reactiveForm' onsubmit='handleReactiveSubmit(event)'>";
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px'>First Name <span id='fn-error' style='color:red;font-size:12px'></span></label>";
  output += "<input id='rf-firstName' type='text' oninput='validateReactive()' style='padding:10px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px'>Last Name <span id='ln-error' style='color:red;font-size:12px'></span></label>";
  output += "<input id='rf-lastName' type='text' oninput='validateReactive()' style='padding:10px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px'>Email <span id='email-error' style='color:red;font-size:12px'></span></label>";
  output += "<input id='rf-email' type='email' oninput='validateReactive()' style='padding:10px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "<button id='rf-submit' type='submit' disabled style='padding:10px 20px;background:#ccc;color:white;border:none;border-radius:4px'>Register</button>";
  output += "<p id='form-status' style='margin-top:10px;font-size:12px;color:#666'></p>";
  output += "</form>";
  output += "</div>";
  
  // Comparison Table
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin:15px 0'>";
  output += "<h4>When to Use Each</h4>";
  output += "<table style='width:100%;border-collapse:collapse'>";
  output += "<tr style='background:#DD0031;color:white'><th style='padding:10px;text-align:left'>Use Case</th><th style='padding:10px;text-align:left'>Recommendation</th></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>Login form</td><td style='padding:10px;border-bottom:1px solid #ddd'>Template-Driven</td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>Registration with validation</td><td style='padding:10px;border-bottom:1px solid #ddd'>Reactive</td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>Multi-step wizard</td><td style='padding:10px;border-bottom:1px solid #ddd'>Reactive</td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>Dynamic field arrays</td><td style='padding:10px;border-bottom:1px solid #ddd'>Reactive</td></tr>";
  output += "<tr><td style='padding:10px'>Unit testing</td><td style='padding:10px'>Reactive</td></tr>";
  output += "</table>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function handleTemplateSubmit(event) {
  event.preventDefault();
  let email = document.getElementById("td-email").value;
  let password = document.getElementById("td-password").value;
  alert("Template-Driven Submit:\\nEmail: " + email + "\\nPassword: " + password.replace(/./g, '*'));
}

function validateReactive() {
  let firstName = document.getElementById("rf-firstName").value;
  let lastName = document.getElementById("rf-lastName").value;
  let email = document.getElementById("rf-email").value;
  
  let fnValid = firstName.length >= 2;
  let lnValid = lastName.length >= 2;
  let emailValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  
  document.getElementById("fn-error").textContent = !firstName ? "" : (!fnValid ? "Min 2 chars" : "");
  document.getElementById("ln-error").textContent = !lastName ? "" : (!lnValid ? "Min 2 chars" : "");
  document.getElementById("email-error").textContent = !email ? "" : (!emailValid ? "Invalid email" : "");
  
  let allValid = fnValid && lnValid && emailValid;
  let btn = document.getElementById("rf-submit");
  btn.disabled = !allValid;
  btn.style.background = allValid ? "#DD0031" : "#ccc";
  btn.style.cursor = allValid ? "pointer" : "not-allowed";
  
  document.getElementById("form-status").textContent = 
    "Form Status: " + (allValid ? "✅ Valid" : "❌ Invalid (" + (3 - (fnValid?1:0) - (lnValid?1:0) - (emailValid?1:0)) + " errors)");
}

function handleReactiveSubmit(event) {
  event.preventDefault();
  let firstName = document.getElementById("rf-firstName").value;
  let lastName = document.getElementById("rf-lastName").value;
  let email = document.getElementById("rf-email").value;
  alert("Reactive Form Submit:\\n" + JSON.stringify({firstName, lastName, email}, null, 2));
}

render();
</script>

</body>
</html>`,
    },

    'reactive-forms': {
      title: 'Angular Reactive Forms',
      content: `# Reactive Forms Deep Dive

Master Angular's powerful reactive forms for enterprise applications.

### FormGroup, FormControl, FormArray

\`\`\`typescript
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

// FormGroup - Container for controls
const form = new FormGroup({
  // FormControl - Single input
  firstName: new FormControl('', Validators.required),
  lastName: new FormControl(''),
  
  // Nested FormGroup
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl(''),
    zip: new FormControl('')
  }),
  
  // FormArray - Dynamic list
  phones: new FormArray([
    new FormControl('')
  ])
});
\`\`\`

### Accessing Values

\`\`\`typescript
// Get single value
const firstName = form.get('firstName')?.value;

// Get nested value
const city = form.get('address.city')?.value;

// Get entire form value
const formData = form.value;

// Get raw value (includes disabled)
const rawData = form.getRawValue();
\`\`\`

### FormArray Operations

\`\`\`typescript
get phones(): FormArray {
  return this.form.get('phones') as FormArray;
}

addPhone() {
  this.phones.push(new FormControl(''));
}

removePhone(index: number) {
  this.phones.removeAt(index);
}
\`\`\`

### Template Integration

\`\`\`html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="firstName">
  
  <div formGroupName="address">
    <input formControlName="street">
    <input formControlName="city">
  </div>
  
  <div formArrayName="phones">
    <div *ngFor="let phone of phones.controls; let i = index">
      <input [formControlName]="i">
      <button (click)="removePhone(i)">Remove</button>
    </div>
    <button (click)="addPhone()">Add Phone</button>
  </div>
  
  <button [disabled]="form.invalid">Submit</button>
</form>
\`\`\`

### FormBuilder Shorthand

\`\`\`typescript
constructor(private fb: FormBuilder) {}

form = this.fb.group({
  firstName: ['', Validators.required],
  lastName: [''],
  address: this.fb.group({
    street: [''],
    city: ['']
  }),
  phones: this.fb.array([''])
});
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Reactive Forms</h2>
<div id="demo"></div>

<script>
// Simulating Reactive Forms

let form = {
  firstName: { value: "", valid: false, touched: false },
  lastName: { value: "", valid: true, touched: false },
  email: { value: "", valid: false, touched: false },
  address: {
    street: { value: "", valid: true, touched: false },
    city: { value: "", valid: true, touched: false },
    zip: { value: "", valid: true, touched: false }
  },
  phones: [{ value: "" }]
};

function getFormValue() {
  return {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    address: {
      street: form.address.street.value,
      city: form.address.city.value,
      zip: form.address.zip.value
    },
    phones: form.phones.map(function(p) { return p.value; })
  };
}

function isFormValid() {
  return form.firstName.value.length >= 2 && 
         /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email.value);
}

function render() {
  let output = "";
  
  output += "<form id='reactiveForm' onsubmit='handleSubmit(event)' style='max-width:500px'>";
  
  // FormControl: firstName
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>First Name *</label>";
  output += "<input id='firstName' value='" + form.firstName.value + "' oninput='updateField(\"firstName\", this.value)' onblur='touchField(\"firstName\")' style='padding:10px;width:100%;box-sizing:border-box;border:2px solid " + (form.firstName.touched && !form.firstName.valid ? "#f44336" : "#ddd") + ";border-radius:4px'>";
  if (form.firstName.touched && !form.firstName.valid) {
    output += "<span style='color:#f44336;font-size:12px'>First name is required (min 2 chars)</span>";
  }
  output += "</div>";
  
  // FormControl: lastName
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Last Name</label>";
  output += "<input id='lastName' value='" + form.lastName.value + "' oninput='updateField(\"lastName\", this.value)' style='padding:10px;width:100%;box-sizing:border-box;border:2px solid #ddd;border-radius:4px'>";
  output += "</div>";
  
  // FormControl: email
  output += "<div style='margin-bottom:15px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Email *</label>";
  output += "<input id='email' type='email' value='" + form.email.value + "' oninput='updateField(\"email\", this.value)' onblur='touchField(\"email\")' style='padding:10px;width:100%;box-sizing:border-box;border:2px solid " + (form.email.touched && !form.email.valid ? "#f44336" : "#ddd") + ";border-radius:4px'>";
  if (form.email.touched && !form.email.valid) {
    output += "<span style='color:#f44336;font-size:12px'>Valid email is required</span>";
  }
  output += "</div>";
  
  // FormGroup: address
  output += "<div style='background:#f5f5f5;padding:15px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>Address (FormGroup)</h4>";
  output += "<input id='street' value='" + form.address.street.value + "' oninput='updateNested(\"street\", this.value)' placeholder='Street' style='padding:10px;width:100%;box-sizing:border-box;margin-bottom:10px;border:1px solid #ddd;border-radius:4px'>";
  output += "<div style='display:flex;gap:10px'>";
  output += "<input id='city' value='" + form.address.city.value + "' oninput='updateNested(\"city\", this.value)' placeholder='City' style='padding:10px;flex:2;border:1px solid #ddd;border-radius:4px'>";
  output += "<input id='zip' value='" + form.address.zip.value + "' oninput='updateNested(\"zip\", this.value)' placeholder='ZIP' style='padding:10px;flex:1;border:1px solid #ddd;border-radius:4px'>";
  output += "</div>";
  output += "</div>";
  
  // FormArray: phones
  output += "<div style='background:#fff5f7;padding:15px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>Phone Numbers (FormArray)</h4>";
  form.phones.forEach(function(phone, index) {
    output += "<div style='display:flex;gap:10px;margin-bottom:10px'>";
    output += "<input value='" + phone.value + "' oninput='updatePhone(" + index + ", this.value)' placeholder='Phone " + (index + 1) + "' style='padding:10px;flex:1;border:1px solid #ddd;border-radius:4px'>";
    if (form.phones.length > 1) {
      output += "<button type='button' onclick='removePhone(" + index + ")' style='padding:10px 15px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>✕</button>";
    }
    output += "</div>";
  });
  output += "<button type='button' onclick='addPhone()' style='padding:10px 15px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>+ Add Phone</button>";
  output += "</div>";
  
  // Submit
  let valid = isFormValid();
  output += "<button type='submit' " + (!valid ? "disabled" : "") + " style='padding:12px 24px;background:" + (valid ? "#DD0031" : "#ccc") + ";color:white;border:none;border-radius:4px;cursor:" + (valid ? "pointer" : "not-allowed") + ";font-size:16px'>Submit Form</button>";
  
  output += "</form>";
  
  // Form Value Display
  output += "<div style='margin-top:20px;padding:15px;background:#1e1e1e;color:#9cdcfe;border-radius:8px;font-family:monospace;font-size:12px'>";
  output += "<strong style='color:#4ec9b0'>form.value:</strong><br>";
  output += JSON.stringify(getFormValue(), null, 2).replace(/\\n/g, "<br>").replace(/ /g, "&nbsp;");
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function updateField(field, value) {
  form[field].value = value;
  if (field === "firstName") form[field].valid = value.length >= 2;
  if (field === "email") form[field].valid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
  render();
}

function touchField(field) {
  form[field].touched = true;
  render();
}

function updateNested(field, value) {
  form.address[field].value = value;
  render();
}

function updatePhone(index, value) {
  form.phones[index].value = value;
  render();
}

function addPhone() {
  form.phones.push({ value: "" });
  render();
}

function removePhone(index) {
  form.phones.splice(index, 1);
  render();
}

function handleSubmit(event) {
  event.preventDefault();
  if (isFormValid()) {
    alert("Form Submitted!\\n\\n" + JSON.stringify(getFormValue(), null, 2));
  }
}

render();
</script>

</body>
</html>`,
    },

    'form-validation': {
      title: 'Angular Form Validation',
      content: `# Angular Form Validation

Comprehensive validation for enterprise forms.

### Built-in Validators

\`\`\`typescript
import { Validators } from '@angular/forms';

const form = new FormGroup({
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ]),
  age: new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(100)
  ]),
  username: new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(20),
    Validators.pattern(/^[a-zA-Z0-9_]+$/)
  ])
});
\`\`\`

### Cross-Field Validation

\`\`\`typescript
function passwordMatchValidator(group: FormGroup): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  
  return password === confirm ? null : { passwordMismatch: true };
}

const form = new FormGroup({
  password: new FormControl('', Validators.required),
  confirmPassword: new FormControl('', Validators.required)
}, { validators: passwordMatchValidator });
\`\`\`

### Async Validators

\`\`\`typescript
function usernameExistsValidator(
  userService: UserService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return userService.checkUsername(control.value).pipe(
      map(exists => exists ? { usernameTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

const username = new FormControl('', 
  [Validators.required], 
  [usernameExistsValidator(this.userService)]
);
\`\`\`

### Display Validation Errors

\`\`\`html
<input formControlName="email">
<div *ngIf="form.get('email')?.errors as errors">
  <span *ngIf="errors['required']">Email is required</span>
  <span *ngIf="errors['email']">Invalid email format</span>
</div>
\`\`\`

### Validation States

| State | Description |
|-------|-------------|
| \`valid\` | Passes all validators |
| \`invalid\` | Fails one or more |
| \`pending\` | Async validator running |
| \`touched\` | User has focused and left |
| \`dirty\` | Value has been changed |
| \`pristine\` | Value unchanged |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Form Validation</h2>
<div id="demo"></div>

<script>
let formState = {
  email: { value: "", touched: false },
  password: { value: "", touched: false },
  confirmPassword: { value: "", touched: false },
  username: { value: "", touched: false, pending: false, asyncError: null }
};

// Simulated taken usernames
let takenUsernames = ["admin", "user", "test", "john", "angular"];

function validateEmail(email) {
  let errors = [];
  if (!email) errors.push("Email is required");
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) errors.push("Invalid email format");
  return errors;
}

function validatePassword(password) {
  let errors = [];
  if (!password) errors.push("Password is required");
  else {
    if (password.length < 8) errors.push("Minimum 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("Must contain uppercase");
    if (!/[0-9]/.test(password)) errors.push("Must contain number");
  }
  return errors;
}

function validatePasswordMatch() {
  if (formState.password.value && formState.confirmPassword.value) {
    if (formState.password.value !== formState.confirmPassword.value) {
      return ["Passwords do not match"];
    }
  }
  return [];
}

function validateUsername(username) {
  let errors = [];
  if (!username) errors.push("Username is required");
  else {
    if (username.length < 3) errors.push("Minimum 3 characters");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) errors.push("Only letters, numbers, underscore");
  }
  return errors;
}

function render() {
  let emailErrors = formState.email.touched ? validateEmail(formState.email.value) : [];
  let passwordErrors = formState.password.touched ? validatePassword(formState.password.value) : [];
  let confirmErrors = formState.confirmPassword.touched ? validatePasswordMatch() : [];
  let usernameErrors = formState.username.touched ? validateUsername(formState.username.value) : [];
  
  if (formState.username.asyncError && formState.username.touched) {
    usernameErrors.push(formState.username.asyncError);
  }
  
  let allValid = emailErrors.length === 0 && passwordErrors.length === 0 && 
                 confirmErrors.length === 0 && usernameErrors.length === 0 &&
                 formState.email.value && formState.password.value && 
                 formState.confirmPassword.value && formState.username.value &&
                 !formState.username.pending && !formState.username.asyncError;
  
  let output = "<form style='max-width:400px'>";
  
  // Email with validation
  output += "<div style='margin-bottom:20px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Email</label>";
  output += "<input value='" + formState.email.value + "' oninput='update(\"email\", this.value)' onblur='touch(\"email\")' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (emailErrors.length ? "#f44336" : (formState.email.touched && formState.email.value ? "#4caf50" : "#ddd")) + ";border-radius:4px'>";
  if (emailErrors.length) {
    output += "<div style='margin-top:5px'>";
    emailErrors.forEach(function(err) {
      output += "<div style='color:#f44336;font-size:12px'>❌ " + err + "</div>";
    });
    output += "</div>";
  } else if (formState.email.touched && formState.email.value) {
    output += "<div style='color:#4caf50;font-size:12px'>✅ Valid email</div>";
  }
  output += "</div>";
  
  // Password with strength indicator
  output += "<div style='margin-bottom:20px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Password</label>";
  output += "<input type='password' value='" + formState.password.value + "' oninput='update(\"password\", this.value)' onblur='touch(\"password\")' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (passwordErrors.length ? "#f44336" : (formState.password.touched && passwordErrors.length === 0 && formState.password.value ? "#4caf50" : "#ddd")) + ";border-radius:4px'>";
  if (formState.password.touched) {
    let requirements = [
      { label: "8+ characters", met: formState.password.value.length >= 8 },
      { label: "Uppercase letter", met: /[A-Z]/.test(formState.password.value) },
      { label: "Number", met: /[0-9]/.test(formState.password.value) }
    ];
    output += "<div style='margin-top:8px'>";
    requirements.forEach(function(req) {
      output += "<span style='display:inline-block;margin-right:10px;font-size:12px;color:" + (req.met ? "#4caf50" : "#999") + "'>" + (req.met ? "✅" : "○") + " " + req.label + "</span>";
    });
    output += "</div>";
  }
  output += "</div>";
  
  // Confirm Password (cross-field validation)
  output += "<div style='margin-bottom:20px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Confirm Password</label>";
  output += "<input type='password' value='" + formState.confirmPassword.value + "' oninput='update(\"confirmPassword\", this.value)' onblur='touch(\"confirmPassword\")' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (confirmErrors.length ? "#f44336" : (formState.confirmPassword.touched && confirmErrors.length === 0 && formState.confirmPassword.value ? "#4caf50" : "#ddd")) + ";border-radius:4px'>";
  if (confirmErrors.length) {
    output += "<div style='color:#f44336;font-size:12px'>❌ " + confirmErrors[0] + "</div>";
  } else if (formState.confirmPassword.touched && formState.confirmPassword.value) {
    output += "<div style='color:#4caf50;font-size:12px'>✅ Passwords match</div>";
  }
  output += "</div>";
  
  // Username with async validation
  output += "<div style='margin-bottom:20px'>";
  output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>Username</label>";
  output += "<input value='" + formState.username.value + "' oninput='update(\"username\", this.value)' onblur='touch(\"username\")' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (usernameErrors.length ? "#f44336" : (formState.username.pending ? "#ff9800" : (formState.username.touched && formState.username.value && !formState.username.asyncError ? "#4caf50" : "#ddd"))) + ";border-radius:4px'>";
  if (formState.username.pending) {
    output += "<div style='color:#ff9800;font-size:12px'>⏳ Checking availability...</div>";
  } else if (usernameErrors.length) {
    output += "<div style='margin-top:5px'>";
    usernameErrors.forEach(function(err) {
      output += "<div style='color:#f44336;font-size:12px'>❌ " + err + "</div>";
    });
    output += "</div>";
  } else if (formState.username.touched && formState.username.value) {
    output += "<div style='color:#4caf50;font-size:12px'>✅ Username available</div>";
  }
  output += "<div style='font-size:11px;color:#999;margin-top:5px'>Try: admin, user, test (taken)</div>";
  output += "</div>";
  
  output += "<button type='submit' " + (!allValid ? "disabled" : "") + " style='padding:15px 30px;width:100%;background:" + (allValid ? "#DD0031" : "#ccc") + ";color:white;border:none;border-radius:4px;font-size:16px;cursor:" + (allValid ? "pointer" : "not-allowed") + "'>Create Account</button>";
  
  output += "</form>";
  
  document.getElementById("demo").innerHTML = output;
}

function update(field, value) {
  formState[field].value = value;
  if (field === "username" && value.length >= 3) {
    // Simulate async validation
    formState.username.pending = true;
    formState.username.asyncError = null;
    render();
    setTimeout(function() {
      formState.username.pending = false;
      if (takenUsernames.includes(value.toLowerCase())) {
        formState.username.asyncError = "Username is already taken";
      } else {
        formState.username.asyncError = null;
      }
      render();
    }, 800);
  } else if (field === "username") {
    formState.username.asyncError = null;
  }
  render();
}

function touch(field) {
  formState[field].touched = true;
  render();
}

render();
</script>

</body>
</html>`,
    },

    'dynamic-forms': {
      title: 'Angular Dynamic Forms',
      content: `# Dynamic Forms in Angular

Build forms from configuration for maximum flexibility.

### Why Dynamic Forms?

- Form structure from API/database
- User-configurable forms
- Reduce repetitive code
- A/B testing form layouts

### Form Field Configuration

\`\`\`typescript
interface FormFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  options?: { value: string; label: string }[];
  validators?: ValidatorFn[];
}

const formConfig: FormFieldConfig[] = [
  { key: 'firstName', label: 'First Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'role', label: 'Role', type: 'select', options: [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ]}
];
\`\`\`

### Generate FormGroup from Config

\`\`\`typescript
function createFormGroup(config: FormFieldConfig[]): FormGroup {
  const group: { [key: string]: FormControl } = {};
  
  config.forEach(field => {
    const validators = field.required ? [Validators.required] : [];
    if (field.validators) validators.push(...field.validators);
    
    group[field.key] = new FormControl('', validators);
  });
  
  return new FormGroup(group);
}
\`\`\`

### Dynamic Template

\`\`\`html
<form [formGroup]="form">
  <div *ngFor="let field of formConfig">
    <label>{{ field.label }}</label>
    
    <ng-container [ngSwitch]="field.type">
      <input *ngSwitchCase="'text'" 
             [formControlName]="field.key">
      
      <input *ngSwitchCase="'email'" 
             type="email" 
             [formControlName]="field.key">
      
      <select *ngSwitchCase="'select'" 
              [formControlName]="field.key">
        <option *ngFor="let opt of field.options" 
                [value]="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </ng-container>
  </div>
</form>
\`\`\`

### Use Cases

1. **CMS Form Builder**: Users design their own forms
2. **Survey Systems**: Dynamic questionnaires
3. **Admin Panels**: CRUD forms from models
4. **Wizards**: Multi-step with conditional fields
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Dynamic Forms</h2>
<div id="demo"></div>

<script>
// Form configuration (could come from API)
let formConfig = [
  { key: "firstName", label: "First Name", type: "text", required: true },
  { key: "lastName", label: "Last Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "age", label: "Age", type: "number", required: false },
  { key: "role", label: "Role", type: "select", required: true, options: [
    { value: "", label: "Select Role" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" }
  ]},
  { key: "newsletter", label: "Subscribe to Newsletter", type: "checkbox", required: false }
];

let formValues = {};
formConfig.forEach(function(field) {
  formValues[field.key] = field.type === "checkbox" ? false : "";
});

function validate(field, value) {
  if (field.required) {
    if (field.type === "checkbox") return true;
    return value !== "" && value !== null && value !== undefined;
  }
  return true;
}

function isFormValid() {
  return formConfig.every(function(field) {
    return validate(field, formValues[field.key]);
  });
}

function render() {
  let output = "";
  
  // Config Display
  output += "<div style='background:#e3f2fd;padding:15px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>📝 Form Configuration (from API)</h4>";
  output += "<pre style='background:#1e1e1e;color:#9cdcfe;padding:10px;border-radius:4px;font-size:11px;overflow-x:auto'>" + JSON.stringify(formConfig.slice(0, 2), null, 2) + "\\n// ... " + (formConfig.length - 2) + " more fields</pre>";
  output += "</div>";
  
  // Dynamic Form
  output += "<form id='dynamicForm' style='background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd'>";
  output += "<h4 style='margin-top:0'>Generated Form</h4>";
  
  formConfig.forEach(function(field, index) {
    let isValid = validate(field, formValues[field.key]);
    let hasValue = formValues[field.key] !== "" && formValues[field.key] !== false;
    
    output += "<div style='margin-bottom:15px'>";
    
    if (field.type === "checkbox") {
      output += "<label style='display:flex;align-items:center;cursor:pointer'>";
      output += "<input type='checkbox' " + (formValues[field.key] ? "checked" : "") + " onchange='updateValue(\"" + field.key + "\", this.checked)' style='margin-right:10px;width:18px;height:18px'>";
      output += field.label;
      output += "</label>";
    } else {
      output += "<label style='display:block;margin-bottom:5px;font-weight:bold'>" + field.label + (field.required ? " *" : "") + "</label>";
      
      if (field.type === "select") {
        output += "<select onchange='updateValue(\"" + field.key + "\", this.value)' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (!isValid && hasValue ? "#f44336" : "#ddd") + ";border-radius:4px'>";
        field.options.forEach(function(opt) {
          output += "<option value='" + opt.value + "'" + (formValues[field.key] === opt.value ? " selected" : "") + ">" + opt.label + "</option>";
        });
        output += "</select>";
      } else {
        output += "<input type='" + field.type + "' value='" + formValues[field.key] + "' oninput='updateValue(\"" + field.key + "\", this.value)' style='padding:12px;width:100%;box-sizing:border-box;border:2px solid " + (!isValid && hasValue ? "#f44336" : "#ddd") + ";border-radius:4px'>";
      }
    }
    output += "</div>";
  });
  
  let valid = isFormValid();
  output += "<button type='button' onclick='submitForm()' " + (!valid ? "disabled" : "") + " style='padding:12px 24px;width:100%;background:" + (valid ? "#DD0031" : "#ccc") + ";color:white;border:none;border-radius:4px;font-size:16px;cursor:" + (valid ? "pointer" : "not-allowed") + "'>Submit</button>";
  output += "</form>";
  
  // Form Value Preview
  output += "<div style='margin-top:20px;padding:15px;background:#1e1e1e;color:#9cdcfe;border-radius:8px'>";
  output += "<strong style='color:#4ec9b0'>form.value:</strong><br>";
  output += "<pre style='margin:0'>" + JSON.stringify(formValues, null, 2) + "</pre>";
  output += "</div>";
  
  // Add Field Button
  output += "<button onclick='addField()' style='margin-top:15px;padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>+ Add Custom Field</button>";
  
  document.getElementById("demo").innerHTML = output;
}

function updateValue(key, value) {
  formValues[key] = value;
  render();
}

function addField() {
  let fieldName = prompt("Enter field name:");
  if (fieldName) {
    let key = fieldName.toLowerCase().replace(/\\s+/g, "_");
    formConfig.push({
      key: key,
      label: fieldName,
      type: "text",
      required: false
    });
    formValues[key] = "";
    render();
  }
}

function submitForm() {
  if (isFormValid()) {
    alert("Form Submitted!\\n\\n" + JSON.stringify(formValues, null, 2));
  }
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 4 — ROUTING & NAVIGATION
    'router-core': {
      title: 'Angular Router Core',
      content: `# Angular Router

Navigate between views in your Angular application.

### Route Configuration

\`\`\`typescript
import { Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: '**', component: NotFoundComponent }
];
\`\`\`

### RouterOutlet

The placeholder where routed components render:

\`\`\`html
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/about">About</a>
  <a [routerLink]="['/users', userId]">User</a>
</nav>

<router-outlet></router-outlet>
\`\`\`

### RouterLinkActive

Highlight active links:

\`\`\`html
<a routerLink="/" 
   routerLinkActive="active"
   [routerLinkActiveOptions]="{ exact: true }">
  Home
</a>
\`\`\`

### Navigation Lifecycle

1. **NavigationStart**: Navigation begins
2. **RoutesRecognized**: Routes matched
3. **GuardsCheckStart**: Guards running
4. **ResolveStart**: Resolvers running
5. **NavigationEnd**: Navigation complete

\`\`\`typescript
constructor(private router: Router) {
  router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      console.log('Navigation complete:', event.url);
    }
  });
}
\`\`\`

### Programmatic Navigation

\`\`\`typescript
// Navigate to path
this.router.navigate(['/users', userId]);

// With query params
this.router.navigate(['/search'], { 
  queryParams: { q: 'angular' } 
});

// Replace history
this.router.navigate(['/home'], { replaceUrl: true });
\`\`\`

### Reading Route Parameters

\`\`\`typescript
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {}

ngOnInit() {
  // Snapshot (one-time)
  const id = this.route.snapshot.paramMap.get('id');
  
  // Observable (reactive)
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
  });
}
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Router Simulation</h2>
<div id="app"></div>

<script>
// Simulating Angular Router

let currentRoute = "/";
let routes = {
  "/": { component: "HomeComponent", title: "Home" },
  "/about": { component: "AboutComponent", title: "About Us" },
  "/users": { component: "UsersComponent", title: "Users" },
  "/users/1": { component: "UserDetailComponent", title: "User 1", params: { id: "1" } },
  "/users/2": { component: "UserDetailComponent", title: "User 2", params: { id: "2" } },
  "/contact": { component: "ContactComponent", title: "Contact" }
};

let navigationHistory = [];

function render() {
  let output = "";
  
  // Navigation Bar
  output += "<nav style='background:#DD0031;padding:15px;border-radius:8px 8px 0 0'>";
  output += "<div style='display:flex;gap:20px'>";
  
  let navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/users", label: "Users" },
    { path: "/contact", label: "Contact" }
  ];
  
  navLinks.forEach(function(link) {
    let isActive = currentRoute === link.path || (link.path !== "/" && currentRoute.startsWith(link.path));
    output += "<a href='#' onclick='navigate(\"" + link.path + "\"); return false;' style='color:" + (isActive ? "#fff" : "rgba(255,255,255,0.7)") + ";text-decoration:none;font-weight:" + (isActive ? "bold" : "normal") + ";padding:5px 10px;background:" + (isActive ? "rgba(255,255,255,0.2)" : "transparent") + ";border-radius:4px'>" + link.label + "</a>";
  });
  
  output += "</div>";
  output += "</nav>";
  
  // Router Outlet
  output += "<div style='border:1px solid #ddd;border-top:none;padding:20px;min-height:300px;background:#fff;border-radius:0 0 8px 8px'>";
  output += "<p style='color:#666;font-size:12px;margin-bottom:15px'>📍 Current Route: <code style='background:#f5f5f5;padding:2px 8px;border-radius:4px'>" + currentRoute + "</code></p>";
  
  let route = routes[currentRoute];
  if (route) {
    output += "<h3 style='color:#DD0031'>" + route.title + "</h3>";
    output += renderComponent(route);
  } else {
    output += "<h3 style='color:#f44336'>404 - Page Not Found</h3>";
    output += "<p>The route <code>" + currentRoute + "</code> does not exist.</p>";
    output += "<button onclick='navigate(\"/\")' style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Go Home</button>";
  }
  
  output += "</div>";
  
  // Navigation Events Log
  output += "<div style='margin-top:20px;background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>Navigation Events</h4>";
  output += "<div style='color:#9cdcfe;font-family:monospace;font-size:12px;max-height:150px;overflow-y:auto'>";
  navigationHistory.slice(-5).forEach(function(event) {
    output += "<div style='padding:5px 0;border-bottom:1px solid #333'>";
    output += "<span style='color:#ce9178'>" + event.type + "</span>: " + event.url;
    output += "</div>";
  });
  output += "</div>";
  output += "</div>";
  
  document.getElementById("app").innerHTML = output;
}

function renderComponent(route) {
  let output = "";
  
  switch (route.component) {
    case "HomeComponent":
      output += "<p>Welcome to the Angular Router demo!</p>";
      output += "<div style='display:flex;gap:15px;margin-top:15px'>";
      output += "<div onclick='navigate(\"/about\")' style='padding:20px;background:#f5f5f5;border-radius:8px;cursor:pointer;flex:1;text-align:center'><strong>About Us</strong><br><small>Learn more</small></div>";
      output += "<div onclick='navigate(\"/users\")' style='padding:20px;background:#f5f5f5;border-radius:8px;cursor:pointer;flex:1;text-align:center'><strong>Users</strong><br><small>View all</small></div>";
      output += "</div>";
      break;
      
    case "AboutComponent":
      output += "<p>This is the About page.</p>";
      output += "<p>Angular Router provides powerful navigation capabilities for SPAs.</p>";
      break;
      
    case "UsersComponent":
      output += "<p>User List:</p>";
      output += "<ul style='list-style:none;padding:0'>";
      output += "<li style='padding:10px;background:#f5f5f5;margin:5px 0;border-radius:4px;cursor:pointer' onclick='navigate(\"/users/1\")'>👤 User 1 - John Doe</li>";
      output += "<li style='padding:10px;background:#f5f5f5;margin:5px 0;border-radius:4px;cursor:pointer' onclick='navigate(\"/users/2\")'>👤 User 2 - Jane Smith</li>";
      output += "</ul>";
      break;
      
    case "UserDetailComponent":
      let userId = route.params.id;
      output += "<p>Viewing details for User #" + userId + "</p>";
      output += "<div style='background:#f5f5f5;padding:15px;border-radius:8px'>";
      output += "<p><strong>Route Parameter:</strong> id = " + userId + "</p>";
      output += "<code>this.route.snapshot.paramMap.get('id')</code>";
      output += "</div>";
      output += "<button onclick='navigate(\"/users\")' style='margin-top:15px;padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>← Back to Users</button>";
      break;
      
    case "ContactComponent":
      output += "<p>Contact us at: contact@angular.io</p>";
      break;
  }
  
  return output;
}

function navigate(path) {
  navigationHistory.push({ type: "NavigationStart", url: path });
  navigationHistory.push({ type: "RoutesRecognized", url: path });
  currentRoute = path;
  navigationHistory.push({ type: "NavigationEnd", url: path });
  render();
}

render();
</script>

</body>
</html>`,
    },

    // More routing, services, lifecycle lessons...
    'route-params': {
      title: 'Route Parameters',
      content: `# Route Parameters

Pass data through URLs in Angular.

### Path Parameters

Define dynamic segments in routes:

\`\`\`typescript
const routes: Routes = [
  { path: 'users/:id', component: UserComponent },
  { path: 'products/:category/:id', component: ProductComponent }
];
\`\`\`

### Reading Path Parameters

\`\`\`typescript
import { ActivatedRoute } from '@angular/router';

export class UserComponent implements OnInit {
  userId: string;
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Snapshot (one-time read)
    this.userId = this.route.snapshot.paramMap.get('id');
    
    // Observable (reacts to changes)
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.loadUser(this.userId);
    });
  }
}
\`\`\`

### Query Parameters

\`\`\`html
<a [routerLink]="['/search']" 
   [queryParams]="{ q: 'angular', page: 1 }">
  Search
</a>
\`\`\`

\`\`\`typescript
// Reading query params
this.route.queryParamMap.subscribe(params => {
  const query = params.get('q');
  const page = params.get('page');
});
\`\`\`

### Fragment

\`\`\`html
<a routerLink="/docs" fragment="installation">
  Installation
</a>
<!-- Results in: /docs#installation -->
\`\`\`

### Preserving Parameters

\`\`\`typescript
this.router.navigate(['/new-path'], {
  queryParamsHandling: 'preserve', // or 'merge'
  preserveFragment: true
});
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Route Parameters</h2>
<div id="demo"></div>

<script>
let currentPath = "/products";
let pathParams = {};
let queryParams = {};
let fragment = "";

function parseUrl(url) {
  // Parse path params, query params, and fragment
  let [pathAndQuery, frag] = url.split("#");
  fragment = frag || "";
  
  let [path, query] = pathAndQuery.split("?");
  currentPath = path;
  
  // Parse query params
  queryParams = {};
  if (query) {
    query.split("&").forEach(function(pair) {
      let [key, value] = pair.split("=");
      queryParams[key] = decodeURIComponent(value);
    });
  }
  
  // Parse path params (simulated)
  pathParams = {};
  let pathParts = path.split("/").filter(Boolean);
  if (pathParts[0] === "products" && pathParts[1]) {
    pathParams.category = pathParts[1];
    if (pathParts[2]) {
      pathParams.id = pathParts[2];
    }
  }
  if (pathParts[0] === "users" && pathParts[1]) {
    pathParams.id = pathParts[1];
  }
}

function render() {
  let output = "";
  
  // URL Input
  output += "<div style='background:#f5f5f5;padding:15px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>Navigate to URL</h4>";
  output += "<div style='display:flex;gap:10px'>";
  output += "<input id='urlInput' value='" + buildUrl() + "' style='flex:1;padding:12px;border:2px solid #DD0031;border-radius:4px;font-family:monospace'>";
  output += "<button onclick='goToUrl()' style='padding:12px 24px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Go</button>";
  output += "</div>";
  output += "</div>";
  
  // Quick Links
  output += "<div style='background:#fff5f7;padding:15px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>Quick Links</h4>";
  output += "<div style='display:flex;flex-wrap:wrap;gap:10px'>";
  let links = [
    { url: "/products", label: "Products" },
    { url: "/products/electronics", label: "Electronics Category" },
    { url: "/products/electronics/123", label: "Product #123" },
    { url: "/users/456", label: "User #456" },
    { url: "/search?q=angular&page=1&sort=date", label: "Search with Query" },
    { url: "/docs#installation", label: "Docs with Fragment" }
  ];
  links.forEach(function(link) {
    output += "<button onclick='navigateTo(\"" + link.url + "\")' style='padding:8px 15px;background:#fff;border:1px solid #DD0031;color:#DD0031;border-radius:4px;cursor:pointer'>" + link.label + "</button>";
  });
  output += "</div>";
  output += "</div>";
  
  // Parsed Parameters
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px'>";
  
  // Path Params
  output += "<div style='background:#e3f2fd;padding:15px;border-radius:8px'>";
  output += "<h4 style='margin-top:0'>📍 Path Parameters</h4>";
  output += "<pre style='background:#1e1e1e;color:#9cdcfe;padding:10px;border-radius:4px;font-size:12px'>";
  output += "route.snapshot.paramMap:\\n";
  output += JSON.stringify(pathParams, null, 2);
  output += "</pre>";
  if (Object.keys(pathParams).length) {
    output += "<div style='margin-top:10px'>";
    for (let key in pathParams) {
      output += "<p style='margin:5px 0'><code>params.get('" + key + "')</code> = <strong>" + pathParams[key] + "</strong></p>";
    }
    output += "</div>";
  }
  output += "</div>";
  
  // Query Params
  output += "<div style='background:#f0fff0;padding:15px;border-radius:8px'>";
  output += "<h4 style='margin-top:0'>🔍 Query Parameters</h4>";
  output += "<pre style='background:#1e1e1e;color:#9cdcfe;padding:10px;border-radius:4px;font-size:12px'>";
  output += "route.queryParamMap:\\n";
  output += JSON.stringify(queryParams, null, 2);
  output += "</pre>";
  if (Object.keys(queryParams).length) {
    output += "<div style='margin-top:10px'>";
    for (let key in queryParams) {
      output += "<p style='margin:5px 0'><code>queryParams.get('" + key + "')</code> = <strong>" + queryParams[key] + "</strong></p>";
    }
    output += "</div>";
  }
  output += "</div>";
  
  output += "</div>";
  
  // Fragment
  if (fragment) {
    output += "<div style='background:#fff3e0;padding:15px;border-radius:8px;margin-top:20px'>";
    output += "<h4 style='margin-top:0'># Fragment</h4>";
    output += "<p><code>route.fragment</code> = <strong>" + fragment + "</strong></p>";
    output += "</div>";
  }
  
  document.getElementById("demo").innerHTML = output;
}

function buildUrl() {
  let url = currentPath;
  if (Object.keys(queryParams).length) {
    url += "?" + Object.entries(queryParams).map(function([k, v]) {
      return k + "=" + encodeURIComponent(v);
    }).join("&");
  }
  if (fragment) {
    url += "#" + fragment;
  }
  return url;
}

function navigateTo(url) {
  parseUrl(url);
  render();
}

function goToUrl() {
  let url = document.getElementById("urlInput").value;
  parseUrl(url);
  render();
}

parseUrl("/products");
render();
</script>

</body>
</html>`,
    },

    // PHASE 4 continued - Lazy Loading, Guards, Resolvers
    'lazy-loading': {
      title: 'Angular Lazy Loading',
      content: `# Lazy Loading Modules

Load feature modules on demand for better performance.

### Why Lazy Loading?

- Smaller initial bundle
- Faster first paint
- Load features when needed
- Better user experience

### Lazy Route Configuration

\`\`\`typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module')
      .then(m => m.AdminModule)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(c => c.DashboardComponent)
  }
];
\`\`\`

### Feature Module Setup

\`\`\`typescript
// admin.module.ts
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AdminHomeComponent },
      { path: 'users', component: AdminUsersComponent }
    ])
  ],
  declarations: [AdminHomeComponent, AdminUsersComponent]
})
export class AdminModule { }
\`\`\`

### Preloading Strategies

\`\`\`typescript
// Preload all lazy modules
RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules
});

// Custom preloading
@Injectable()
export class SelectivePreload implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>) {
    return route.data?.['preload'] ? load() : of(null);
  }
}
\`\`\`

### Bundle Analysis

Check lazy chunks with:

\`\`\`bash
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Lazy Loading</h2>
<div id="demo"></div>

<script>
// Simulating lazy loading

let loadedModules = new Set(["main"]);
let currentRoute = "/";
let loadingModule = null;

let routes = {
  "/": { module: "main", component: "HomeComponent", title: "Home" },
  "/admin": { module: "admin", component: "AdminHomeComponent", title: "Admin Dashboard" },
  "/admin/users": { module: "admin", component: "AdminUsersComponent", title: "Manage Users" },
  "/dashboard": { module: "dashboard", component: "DashboardComponent", title: "Dashboard" },
  "/reports": { module: "reports", component: "ReportsComponent", title: "Reports" }
};

let moduleSizes = {
  "main": 150,
  "admin": 85,
  "dashboard": 45,
  "reports": 120
};

function render() {
  let output = "";
  
  // Bundle Visualization
  output += "<div style='background:#1e1e1e;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>📦 Bundle Status</h4>";
  output += "<div style='display:flex;gap:15px;flex-wrap:wrap'>";
  
  for (let mod in moduleSizes) {
    let isLoaded = loadedModules.has(mod);
    let isLoading = loadingModule === mod;
    
    output += "<div style='padding:15px;background:" + (isLoaded ? "#4caf50" : (isLoading ? "#ff9800" : "#333")) + ";border-radius:8px;text-align:center;min-width:80px'>";
    output += "<div style='color:white;font-weight:bold'>" + mod + "</div>";
    output += "<div style='color:rgba(255,255,255,0.7);font-size:12px'>" + moduleSizes[mod] + " KB</div>";
    output += "<div style='color:rgba(255,255,255,0.7);font-size:11px;margin-top:5px'>";
    output += isLoaded ? "✅ Loaded" : (isLoading ? "⏳ Loading..." : "💤 Not loaded");
    output += "</div>";
    output += "</div>";
  }
  
  output += "</div>";
  
  // Loaded size
  let loadedSize = 0;
  loadedModules.forEach(function(mod) {
    loadedSize += moduleSizes[mod];
  });
  let totalSize = Object.values(moduleSizes).reduce(function(a, b) { return a + b; }, 0);
  
  output += "<p style='color:#9cdcfe;margin-top:15px'>Initial Bundle: <strong style='color:#4caf50'>" + loadedSize + " KB</strong> / " + totalSize + " KB total</p>";
  output += "</div>";
  
  // Navigation
  output += "<nav style='background:#DD0031;padding:15px;border-radius:8px 8px 0 0'>";
  output += "<div style='display:flex;gap:15px'>";
  
  Object.keys(routes).forEach(function(path) {
    let isActive = currentRoute === path;
    let route = routes[path];
    let isLazy = route.module !== "main";
    
    output += "<a href='#' onclick='navigate(\"" + path + "\"); return false;' style='color:" + (isActive ? "#fff" : "rgba(255,255,255,0.7)") + ";text-decoration:none;padding:5px 10px;background:" + (isActive ? "rgba(255,255,255,0.2)" : "transparent") + ";border-radius:4px'>";
    output += route.title;
    if (isLazy && !loadedModules.has(route.module)) {
      output += " <span style='font-size:10px;background:rgba(255,255,255,0.3);padding:2px 5px;border-radius:3px'>LAZY</span>";
    }
    output += "</a>";
  });
  
  output += "</div>";
  output += "</nav>";
  
  // Content
  output += "<div style='border:1px solid #ddd;border-top:none;padding:20px;min-height:200px;background:#fff;border-radius:0 0 8px 8px'>";
  
  if (loadingModule) {
    output += "<div style='text-align:center;padding:50px'>";
    output += "<div style='font-size:40px;margin-bottom:10px'>⏳</div>";
    output += "<p>Loading <strong>" + loadingModule + "</strong> module...</p>";
    output += "</div>";
  } else {
    let route = routes[currentRoute];
    if (route) {
      output += "<h3 style='color:#DD0031'>" + route.title + "</h3>";
      output += "<p>Component: <code>" + route.component + "</code></p>";
      output += "<p>Module: <code>" + route.module + "</code></p>";
    }
  }
  
  output += "</div>";
  
  // Code example
  output += "<div style='margin-top:20px;background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>Route Configuration</h4>";
  output += "<pre style='color:#9cdcfe;font-size:12px;margin:0'>";
  output += "{\n";
  output += "  path: 'admin',\n";
  output += "  loadChildren: () => import('./admin/admin.module')\n";
  output += "    .then(m => m.AdminModule)\n";
  output += "}";
  output += "</pre>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function navigate(path) {
  let route = routes[path];
  if (!route) return;
  
  if (!loadedModules.has(route.module)) {
    // Simulate lazy loading
    loadingModule = route.module;
    render();
    
    setTimeout(function() {
      loadedModules.add(route.module);
      loadingModule = null;
      currentRoute = path;
      render();
    }, 1000);
  } else {
    currentRoute = path;
    render();
  }
}

render();
</script>

</body>
</html>`,
    },

    'guards': {
      title: 'Angular Guards',
      content: `# Route Guards

Protect routes with authentication and authorization.

### Types of Guards

| Guard | Purpose |
|-------|---------|
| \`CanActivate\` | Can route be activated? |
| \`CanDeactivate\` | Can leave current route? |
| \`CanLoad\` | Can lazy module load? |
| \`CanActivateChild\` | Can child routes activate? |
| \`Resolve\` | Pre-fetch data before activation |

### Auth Guard Example

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Redirect to login with return URL
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
\`\`\`

### Role-Based Guard

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    const userRoles = this.authService.getUserRoles();
    
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
\`\`\`

### Route Configuration

\`\`\`typescript
const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'superadmin'] }
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module'),
    canLoad: [AuthGuard]
  }
];
\`\`\`

### Functional Guards (Modern)

\`\`\`typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return authService.isLoggedIn() 
    || router.createUrlTree(['/login']);
};
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Route Guards</h2>
<div id="demo"></div>

<script>
let auth = {
  isLoggedIn: false,
  user: null,
  roles: []
};

let routes = {
  "/": { public: true, title: "Home" },
  "/login": { public: true, title: "Login" },
  "/dashboard": { public: false, title: "Dashboard", roles: ["user", "admin"] },
  "/admin": { public: false, title: "Admin Panel", roles: ["admin"] },
  "/settings": { public: false, title: "Settings", roles: ["user", "admin"] }
};

let currentRoute = "/";
let guardLog = [];

function log(message, type) {
  guardLog.unshift({ message, type, time: new Date().toLocaleTimeString() });
  if (guardLog.length > 8) guardLog.pop();
}

function canActivate(route) {
  let config = routes[route];
  
  if (config.public) {
    log("✅ Public route - access granted", "success");
    return true;
  }
  
  if (!auth.isLoggedIn) {
    log("❌ AuthGuard: User not logged in", "error");
    return false;
  }
  
  if (config.roles && config.roles.length) {
    let hasRole = config.roles.some(function(role) {
      return auth.roles.includes(role);
    });
    
    if (!hasRole) {
      log("❌ RoleGuard: Missing required role (" + config.roles.join(" or ") + ")", "error");
      return false;
    }
    
    log("✅ RoleGuard: Access granted (role: " + auth.roles.join(", ") + ")", "success");
  }
  
  return true;
}

function render() {
  let output = "";
  
  // Auth Status
  output += "<div style='background:" + (auth.isLoggedIn ? "#e8f5e9" : "#ffebee") + ";padding:15px;border-radius:8px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center'>";
  output += "<div>";
  output += "<strong>Auth Status:</strong> " + (auth.isLoggedIn ? "🔓 Logged In" : "🔒 Logged Out");
  if (auth.user) {
    output += "<br><span style='color:#666'>User: " + auth.user + " | Roles: " + auth.roles.join(", ") + "</span>";
  }
  output += "</div>";
  output += "<div>";
  if (auth.isLoggedIn) {
    output += "<button onclick='logout()' style='padding:8px 16px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>Logout</button>";
  } else {
    output += "<button onclick='loginAs(\"user\")' style='padding:8px 16px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer;margin-right:10px'>Login as User</button>";
    output += "<button onclick='loginAs(\"admin\")' style='padding:8px 16px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Login as Admin</button>";
  }
  output += "</div>";
  output += "</div>";
  
  // Navigation
  output += "<nav style='background:#333;padding:15px;border-radius:8px 8px 0 0'>";
  output += "<div style='display:flex;gap:15px'>";
  
  Object.keys(routes).forEach(function(path) {
    let config = routes[path];
    let isActive = currentRoute === path;
    let isProtected = !config.public;
    let canAccess = canActivateCheck(path);
    
    output += "<a href='#' onclick='navigate(\"" + path + "\"); return false;' style='color:" + (canAccess ? (isActive ? "#fff" : "rgba(255,255,255,0.7)") : "#f44336") + ";text-decoration:none;padding:5px 10px;background:" + (isActive ? "rgba(255,255,255,0.2)" : "transparent") + ";border-radius:4px'>";
    output += config.title;
    if (isProtected) {
      output += " <span style='font-size:10px'>🔒</span>";
    }
    output += "</a>";
  });
  
  output += "</div>";
  output += "</nav>";
  
  // Content
  output += "<div style='border:1px solid #ddd;border-top:none;padding:20px;min-height:150px;background:#fff;border-radius:0 0 8px 8px'>";
  
  let config = routes[currentRoute];
  if (currentRoute === "/login") {
    output += "<h3>Login Page</h3>";
    output += "<p>Choose a role to login:</p>";
    output += "<button onclick='loginAs(\"user\")' style='padding:10px 20px;margin-right:10px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>Login as User</button>";
    output += "<button onclick='loginAs(\"admin\")' style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Login as Admin</button>";
  } else {
    output += "<h3 style='color:#DD0031'>" + config.title + "</h3>";
    output += "<p>Welcome to " + config.title + "!</p>";
    if (config.roles) {
      output += "<p style='color:#666'>Required roles: " + config.roles.join(", ") + "</p>";
    }
  }
  
  output += "</div>";
  
  // Guard Log
  output += "<div style='margin-top:20px;background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>🛡️ Guard Log</h4>";
  output += "<div style='font-family:monospace;font-size:12px;max-height:200px;overflow-y:auto'>";
  guardLog.forEach(function(entry) {
    let color = entry.type === "success" ? "#4caf50" : "#f44336";
    output += "<div style='padding:5px 0;border-bottom:1px solid #333;color:" + color + "'>";
    output += "<span style='color:#666'>[" + entry.time + "]</span> " + entry.message;
    output += "</div>";
  });
  if (!guardLog.length) {
    output += "<div style='color:#666'>Navigate to see guard logs...</div>";
  }
  output += "</div>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function canActivateCheck(route) {
  let config = routes[route];
  if (config.public) return true;
  if (!auth.isLoggedIn) return false;
  if (config.roles && config.roles.length) {
    return config.roles.some(function(role) {
      return auth.roles.includes(role);
    });
  }
  return true;
}

function navigate(path) {
  log("🔍 NavigationStart: " + path, "info");
  
  if (canActivate(path)) {
    currentRoute = path;
  } else {
    log("↩️ Redirecting to /login", "error");
    currentRoute = "/login";
  }
  
  render();
}

function loginAs(role) {
  auth.isLoggedIn = true;
  auth.user = role === "admin" ? "Admin User" : "Regular User";
  auth.roles = role === "admin" ? ["user", "admin"] : ["user"];
  log("🔓 Logged in as " + role, "success");
  navigate("/dashboard");
}

function logout() {
  auth.isLoggedIn = false;
  auth.user = null;
  auth.roles = [];
  log("🔒 Logged out", "info");
  navigate("/");
}

render();
</script>

</body>
</html>`,
    },

    'resolvers': {
      title: 'Angular Resolvers',
      content: `# Route Resolvers

Pre-fetch data before route activation.

### Why Resolvers?

- Load data before component renders
- Prevent loading spinners in components
- Handle errors in one place
- Better UX for data-dependent views

### Basic Resolver

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const userId = route.paramMap.get('id');
    return this.userService.getUser(userId);
  }
}
\`\`\`

### Route Configuration

\`\`\`typescript
const routes: Routes = [
  {
    path: 'users/:id',
    component: UserDetailComponent,
    resolve: {
      user: UserResolver
    }
  }
];
\`\`\`

### Access Resolved Data

\`\`\`typescript
export class UserDetailComponent implements OnInit {
  user: User;
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    // Snapshot
    this.user = this.route.snapshot.data['user'];
    
    // Or Observable
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
  }
}
\`\`\`

### Functional Resolver (Modern)

\`\`\`typescript
export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id');
  return userService.getUser(userId);
};

// Usage
{
  path: 'users/:id',
  resolve: { user: userResolver }
}
\`\`\`

### Error Handling

\`\`\`typescript
resolve(route: ActivatedRouteSnapshot): Observable<User> {
  return this.userService.getUser(route.paramMap.get('id')).pipe(
    catchError(error => {
      this.router.navigate(['/error']);
      return EMPTY;
    })
  );
}
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Resolvers</h2>
<div id="demo"></div>

<script>
// Simulated database
let database = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "Manager" }
  ],
  posts: [
    { id: 1, title: "Angular Resolvers Guide", author: "John", views: 1200 },
    { id: 2, title: "RxJS Patterns", author: "Jane", views: 850 },
    { id: 3, title: "Enterprise Architecture", author: "Bob", views: 2100 }
  ]
};

let currentRoute = "/users";
let resolvedData = null;
let isResolving = false;
let resolverLog = [];

function log(message) {
  resolverLog.unshift({ message, time: new Date().toLocaleTimeString() });
  if (resolverLog.length > 6) resolverLog.pop();
}

// Simulate async data fetching
function fetchUser(id) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      let user = database.users.find(function(u) { return u.id === parseInt(id); });
      if (user) {
        resolve(user);
      } else {
        reject("User not found");
      }
    }, 800);
  });
}

function fetchPost(id) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      let post = database.posts.find(function(p) { return p.id === parseInt(id); });
      if (post) {
        resolve(post);
      } else {
        reject("Post not found");
      }
    }, 600);
  });
}

function render() {
  let output = "";
  
  // Navigation
  output += "<nav style='background:#DD0031;padding:15px;border-radius:8px 8px 0 0'>";
  output += "<div style='display:flex;gap:15px;flex-wrap:wrap'>";
  
  let navItems = [
    { path: "/users", label: "Users List" },
    { path: "/users/1", label: "User #1" },
    { path: "/users/2", label: "User #2" },
    { path: "/posts/1", label: "Post #1" },
    { path: "/users/999", label: "User #999 (Error)" }
  ];
  
  navItems.forEach(function(item) {
    let isActive = currentRoute === item.path;
    output += "<a href='#' onclick='navigate(\"" + item.path + "\"); return false;' style='color:" + (isActive ? "#fff" : "rgba(255,255,255,0.7)") + ";text-decoration:none;padding:5px 10px;background:" + (isActive ? "rgba(255,255,255,0.2)" : "transparent") + ";border-radius:4px'>" + item.label + "</a>";
  });
  
  output += "</div>";
  output += "</nav>";
  
  // Content
  output += "<div style='border:1px solid #ddd;border-top:none;padding:20px;min-height:200px;background:#fff;border-radius:0 0 8px 8px'>";
  
  if (isResolving) {
    output += "<div style='text-align:center;padding:40px'>";
    output += "<div style='font-size:40px;margin-bottom:15px'>⏳</div>";
    output += "<p>Resolver is fetching data...</p>";
    output += "<div style='width:200px;height:4px;background:#eee;border-radius:2px;margin:15px auto'>";
    output += "<div style='width:60%;height:100%;background:#DD0031;border-radius:2px;animation:pulse 1s infinite'></div>";
    output += "</div>";
    output += "</div>";
  } else if (resolvedData && resolvedData.error) {
    output += "<div style='text-align:center;padding:40px;color:#f44336'>";
    output += "<div style='font-size:40px;margin-bottom:15px'>❌</div>";
    output += "<h3>Error</h3>";
    output += "<p>" + resolvedData.error + "</p>";
    output += "<button onclick='navigate(\"/users\")' style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>Go Back</button>";
    output += "</div>";
  } else if (resolvedData) {
    output += "<div style='background:#e8f5e9;padding:15px;border-radius:8px;margin-bottom:15px'>";
    output += "<strong>✅ Data resolved before component rendered</strong>";
    output += "</div>";
    
    if (resolvedData.type === "user") {
      output += "<h3 style='color:#DD0031'>User Details</h3>";
      output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
      output += "<p><strong>ID:</strong> " + resolvedData.data.id + "</p>";
      output += "<p><strong>Name:</strong> " + resolvedData.data.name + "</p>";
      output += "<p><strong>Email:</strong> " + resolvedData.data.email + "</p>";
      output += "<p><strong>Role:</strong> " + resolvedData.data.role + "</p>";
      output += "</div>";
    } else if (resolvedData.type === "post") {
      output += "<h3 style='color:#DD0031'>Post Details</h3>";
      output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
      output += "<p><strong>Title:</strong> " + resolvedData.data.title + "</p>";
      output += "<p><strong>Author:</strong> " + resolvedData.data.author + "</p>";
      output += "<p><strong>Views:</strong> " + resolvedData.data.views + "</p>";
      output += "</div>";
    } else if (resolvedData.type === "list") {
      output += "<h3 style='color:#DD0031'>Users</h3>";
      output += "<ul style='list-style:none;padding:0'>";
      database.users.forEach(function(user) {
        output += "<li onclick='navigate(\"/users/" + user.id + "\")' style='padding:15px;background:#f5f5f5;margin:8px 0;border-radius:8px;cursor:pointer;display:flex;align-items:center'>";
        output += "<span style='font-size:24px;margin-right:15px'>👤</span>";
        output += "<div><strong>" + user.name + "</strong><br><span style='color:#666'>" + user.email + "</span></div>";
        output += "</li>";
      });
      output += "</ul>";
    }
    
    output += "<div style='margin-top:15px;padding:15px;background:#e3f2fd;border-radius:8px'>";
    output += "<strong>Component Access:</strong>";
    output += "<pre style='margin:10px 0 0 0;font-size:12px'>this.route.snapshot.data['user']</pre>";
    output += "</div>";
  }
  
  output += "</div>";
  
  // Resolver Log
  output += "<div style='margin-top:20px;background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>📡 Resolver Log</h4>";
  output += "<div style='font-family:monospace;font-size:12px'>";
  resolverLog.forEach(function(entry) {
    output += "<div style='padding:5px 0;border-bottom:1px solid #333;color:#9cdcfe'>";
    output += "<span style='color:#666'>[" + entry.time + "]</span> " + entry.message;
    output += "</div>";
  });
  if (!resolverLog.length) {
    output += "<div style='color:#666'>Navigate to see resolver activity...</div>";
  }
  output += "</div>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function navigate(path) {
  currentRoute = path;
  isResolving = true;
  resolvedData = null;
  render();
  
  log("🔍 Route: " + path);
  
  // Parse route and resolve data
  let parts = path.split("/").filter(Boolean);
  
  if (parts[0] === "users" && parts[1]) {
    log("⏳ UserResolver.resolve({ id: " + parts[1] + " })");
    
    fetchUser(parts[1]).then(function(user) {
      log("✅ Resolved user: " + user.name);
      isResolving = false;
      resolvedData = { type: "user", data: user };
      render();
    }).catch(function(error) {
      log("❌ Resolver error: " + error);
      isResolving = false;
      resolvedData = { error: error };
      render();
    });
  } else if (parts[0] === "posts" && parts[1]) {
    log("⏳ PostResolver.resolve({ id: " + parts[1] + " })");
    
    fetchPost(parts[1]).then(function(post) {
      log("✅ Resolved post: " + post.title);
      isResolving = false;
      resolvedData = { type: "post", data: post };
      render();
    }).catch(function(error) {
      log("❌ Resolver error: " + error);
      isResolving = false;
      resolvedData = { error: error };
      render();
    });
  } else if (parts[0] === "users") {
    log("📋 No resolver needed for list view");
    isResolving = false;
    resolvedData = { type: "list" };
    render();
  } else {
    isResolving = false;
    resolvedData = { type: "list" };
    render();
  }
}

navigate("/users");
</script>

</body>
</html>`,
    },

    // PHASE 5 — SERVICES & DATA FLOW
    'services-di': {
      title: 'Angular Services & DI',
      content: `# Services & Dependency Injection

Angular's powerful DI system for clean architecture.

### What is a Service?

A class with a focused purpose:
- API calls
- State management
- Shared logic
- Cross-component communication

### Creating a Service

\`\`\`typescript
@Injectable({
  providedIn: 'root' // Singleton
})
export class UserService {
  private users: User[] = [];
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  addUser(user: User): void {
    this.users.push(user);
  }
}
\`\`\`

### Provider Hierarchy

| Level | Scope | Usage |
|-------|-------|-------|
| \`root\` | App-wide singleton | Most services |
| Module | Module singleton | Feature isolation |
| Component | Instance per component | Stateful components |

### Injecting Services

\`\`\`typescript
// Constructor injection
@Component({...})
export class UserComponent {
  constructor(private userService: UserService) {}
}

// inject() function (modern)
@Component({...})
export class UserComponent {
  private userService = inject(UserService);
}
\`\`\`

### Singleton vs Scoped Services

\`\`\`typescript
// Singleton (shared state)
@Injectable({ providedIn: 'root' })
export class AuthService { }

// New instance per component
@Component({
  providers: [FormStateService]
})
export class FormComponent { }
\`\`\`

### Service Design Patterns

1. **Stateless**: Pure functions, no state
2. **Stateful**: Manages shared state
3. **Facade**: Simplifies complex APIs
4. **Repository**: Data access abstraction
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular Services & DI</h2>
<div id="demo"></div>

<script>
// Simulating Angular's DI system

// Services (Singletons)
let services = {
  authService: {
    name: "AuthService",
    scope: "root",
    instance: null,
    state: { isLoggedIn: false, user: null }
  },
  userService: {
    name: "UserService",
    scope: "root",
    instance: null,
    users: [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" }
    ]
  },
  logService: {
    name: "LogService",
    scope: "root",
    instance: null,
    logs: []
  }
};

// Component instances with their injected services
let components = [
  { name: "AppComponent", injected: ["authService", "logService"] },
  { name: "UserListComponent", injected: ["userService", "logService"] },
  { name: "HeaderComponent", injected: ["authService"] }
];

function render() {
  let output = "";
  
  // Services Registry
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>📦 Services Registry (Injector)</h4>";
  output += "<div style='display:flex;gap:15px;flex-wrap:wrap'>";
  
  for (let key in services) {
    let service = services[key];
    output += "<div style='background:white;padding:15px;border-radius:8px;border:2px solid #2196f3;min-width:150px'>";
    output += "<strong style='color:#2196f3'>" + service.name + "</strong>";
    output += "<div style='font-size:12px;color:#666;margin-top:5px'>Scope: " + service.scope + "</div>";
    output += "<div style='font-size:12px;color:#666'>Instance: " + (service.instance ? "✅ Created" : "💤 Lazy") + "</div>";
    output += "</div>";
  }
  
  output += "</div>";
  output += "</div>";
  
  // Components with DI
  output += "<div style='background:#fff5f7;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>🧩 Components with Injected Services</h4>";
  
  components.forEach(function(comp) {
    output += "<div style='background:white;padding:15px;border-radius:8px;margin:10px 0;border-left:4px solid #DD0031'>";
    output += "<strong>" + comp.name + "</strong>";
    output += "<div style='margin-top:10px;display:flex;gap:10px;flex-wrap:wrap'>";
    comp.injected.forEach(function(svc) {
      output += "<span style='padding:5px 10px;background:#e3f2fd;border-radius:4px;font-size:12px'>💉 " + services[svc].name + "</span>";
    });
    output += "</div>";
    output += "</div>";
  });
  
  output += "</div>";
  
  // Interactive Demo
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>🎮 Interactive Demo</h4>";
  
  // AuthService Demo
  output += "<div style='background:white;padding:15px;border-radius:8px;margin-bottom:15px'>";
  output += "<strong>AuthService</strong> (Shared across components)";
  output += "<div style='margin-top:10px'>";
  output += "<span style='color:" + (services.authService.state.isLoggedIn ? "#4caf50" : "#f44336") + "'>Status: " + (services.authService.state.isLoggedIn ? "Logged In" : "Logged Out") + "</span>";
  if (services.authService.state.user) {
    output += " | User: " + services.authService.state.user;
  }
  output += "</div>";
  output += "<button onclick='toggleAuth()' style='margin-top:10px;padding:8px 16px;background:#DD0031;color:white;border:none;border-radius:4px;cursor:pointer'>" + (services.authService.state.isLoggedIn ? "Logout" : "Login") + "</button>";
  output += "</div>";
  
  // UserService Demo
  output += "<div style='background:white;padding:15px;border-radius:8px;margin-bottom:15px'>";
  output += "<strong>UserService</strong> (Data access)";
  output += "<ul style='margin:10px 0;padding-left:20px'>";
  services.userService.users.forEach(function(user) {
    output += "<li>" + user.name + "</li>";
  });
  output += "</ul>";
  output += "<button onclick='addUser()' style='padding:8px 16px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>Add User</button>";
  output += "</div>";
  
  // LogService Demo
  output += "<div style='background:white;padding:15px;border-radius:8px'>";
  output += "<strong>LogService</strong> (Cross-cutting concern)";
  output += "<div style='margin-top:10px;background:#1e1e1e;padding:10px;border-radius:4px;max-height:100px;overflow-y:auto'>";
  if (services.logService.logs.length === 0) {
    output += "<span style='color:#666'>No logs yet...</span>";
  }
  services.logService.logs.slice(-5).forEach(function(log) {
    output += "<div style='color:#9cdcfe;font-size:12px;font-family:monospace'>" + log + "</div>";
  });
  output += "</div>";
  output += "</div>";
  
  output += "</div>";
  
  // Code Example
  output += "<div style='background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>Service Definition</h4>";
  output += "<pre style='color:#9cdcfe;font-size:12px;margin:0'>";
  output += "@Injectable({ providedIn: 'root' })\\n";
  output += "export class UserService {\\n";
  output += "  constructor(private http: HttpClient) {}\\n\\n";
  output += "  getUsers(): Observable<User[]> {\\n";
  output += "    return this.http.get<User[]>('/api/users');\\n";
  output += "  }\\n";
  output += "}";
  output += "</pre>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function toggleAuth() {
  services.authService.instance = true;
  services.authService.state.isLoggedIn = !services.authService.state.isLoggedIn;
  services.authService.state.user = services.authService.state.isLoggedIn ? "Admin" : null;
  
  services.logService.instance = true;
  services.logService.logs.push("[" + new Date().toLocaleTimeString() + "] AuthService: " + (services.authService.state.isLoggedIn ? "User logged in" : "User logged out"));
  
  render();
}

function addUser() {
  services.userService.instance = true;
  let newId = services.userService.users.length + 1;
  services.userService.users.push({ id: newId, name: "User " + newId });
  
  services.logService.instance = true;
  services.logService.logs.push("[" + new Date().toLocaleTimeString() + "] UserService: Added User " + newId);
  
  render();
}

render();
</script>

</body>
</html>`,
    },

    // Add remaining lessons...
    'http-client': {
      title: 'Angular HTTP Client',
      content: `# Angular HTTP Client

Make API requests with Angular's HttpClient.

### Setup

\`\`\`typescript
// app.config.ts (standalone)
import { provideHttpClient } from '@angular/common/http';

export const appConfig = {
  providers: [provideHttpClient()]
};
\`\`\`

### Basic Requests

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}
  
  // GET
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
  
  // POST
  createUser(user: User): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
  
  // PUT
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(\`/api/users/\${id}\`, user);
  }
  
  // DELETE
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`/api/users/\${id}\`);
  }
}
\`\`\`

### Request Options

\`\`\`typescript
this.http.get<User[]>('/api/users', {
  headers: new HttpHeaders({
    'Authorization': 'Bearer token'
  }),
  params: new HttpParams()
    .set('page', '1')
    .set('limit', '10'),
  observe: 'response' // Full response
});
\`\`\`

### Error Handling

\`\`\`typescript
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    retry(3),
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse) {
  console.error('API Error:', error);
  return throwError(() => new Error('Something went wrong'));
}
\`\`\`

### Observables

HTTP calls return Observables:
- Subscribe to execute
- Can be cancelled
- Support operators (map, filter, etc.)
- Hot vs Cold (HTTP is cold)
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Angular HTTP Client</h2>
<div id="demo"></div>

<script>
// Simulating HTTP Client and API

let mockDatabase = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" }
  ]
};

let requestLog = [];

function simulateHttp(method, url, body) {
  return new Promise(function(resolve, reject) {
    let startTime = Date.now();
    
    // Log request
    requestLog.unshift({
      method: method,
      url: url,
      status: "pending",
      time: new Date().toLocaleTimeString()
    });
    render();
    
    // Simulate network delay
    setTimeout(function() {
      let response;
      let status = 200;
      
      if (url === "/api/users" && method === "GET") {
        response = { data: mockDatabase.users };
      } else if (url === "/api/users" && method === "POST") {
        let newUser = { ...body, id: mockDatabase.users.length + 1 };
        mockDatabase.users.push(newUser);
        response = { data: newUser };
        status = 201;
      } else if (url.match(/\\/api\\/users\\/\\d+/) && method === "DELETE") {
        let id = parseInt(url.split("/").pop());
        mockDatabase.users = mockDatabase.users.filter(function(u) { return u.id !== id; });
        response = { data: null };
        status = 204;
      } else {
        status = 404;
        response = { error: "Not found" };
      }
      
      // Update log
      requestLog[0].status = status;
      requestLog[0].duration = Date.now() - startTime;
      
      if (status >= 400) {
        reject(response);
      } else {
        resolve(response);
      }
      
      render();
    }, 500 + Math.random() * 500);
  });
}

function render() {
  let output = "";
  
  // Request Controls
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>🌐 HTTP Requests</h4>";
  output += "<div style='display:flex;gap:10px;flex-wrap:wrap'>";
  output += "<button onclick='fetchUsers()' style='padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:4px;cursor:pointer'>GET /api/users</button>";
  output += "<button onclick='createUser()' style='padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:4px;cursor:pointer'>POST /api/users</button>";
  output += "<button onclick='deleteUser()' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>DELETE /api/users/1</button>";
  output += "</div>";
  output += "</div>";
  
  // Data Display
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px'>";
  
  // Users List
  output += "<div style='background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd'>";
  output += "<h4 style='margin-top:0'>📋 Users (from API)</h4>";
  if (mockDatabase.users.length === 0) {
    output += "<p style='color:#666'>No users found</p>";
  }
  output += "<ul style='list-style:none;padding:0;margin:0'>";
  mockDatabase.users.forEach(function(user) {
    output += "<li style='padding:10px;background:#f5f5f5;margin:5px 0;border-radius:4px;display:flex;justify-content:space-between'>";
    output += "<span>" + user.name + "</span>";
    output += "<span style='color:#666;font-size:12px'>#" + user.id + "</span>";
    output += "</li>";
  });
  output += "</ul>";
  output += "</div>";
  
  // Request Log
  output += "<div style='background:#1e1e1e;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#4ec9b0'>📡 Request Log</h4>";
  output += "<div style='max-height:200px;overflow-y:auto'>";
  requestLog.slice(0, 6).forEach(function(req) {
    let statusColor = req.status === "pending" ? "#ff9800" : (req.status < 400 ? "#4caf50" : "#f44336");
    output += "<div style='padding:8px;border-bottom:1px solid #333;font-family:monospace;font-size:12px'>";
    output += "<span style='color:#ce9178'>" + req.method + "</span> ";
    output += "<span style='color:#9cdcfe'>" + req.url + "</span> ";
    output += "<span style='color:" + statusColor + "'>[" + req.status + "]</span>";
    if (req.duration) {
      output += " <span style='color:#666'>" + req.duration + "ms</span>";
    }
    output += "</div>";
  });
  if (requestLog.length === 0) {
    output += "<div style='color:#666'>Make a request to see logs...</div>";
  }
  output += "</div>";
  output += "</div>";
  
  output += "</div>";
  
  // Code Example
  output += "<div style='background:#1e1e1e;padding:15px;border-radius:8px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>HTTP Client Usage</h4>";
  output += "<pre style='color:#9cdcfe;font-size:12px;margin:0'>";
  output += "// GET request\\n";
  output += "this.http.get<User[]>('/api/users').subscribe({\\n";
  output += "  next: (users) => this.users = users,\\n";
  output += "  error: (err) => console.error(err)\\n";
  output += "});\\n\\n";
  output += "// POST request\\n";
  output += "this.http.post<User>('/api/users', newUser).subscribe();";
  output += "</pre>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function fetchUsers() {
  simulateHttp("GET", "/api/users", null).then(function(res) {
    console.log("Users fetched:", res.data);
  }).catch(function(err) {
    console.error("Error:", err);
  });
}

function createUser() {
  let newUser = {
    name: "User " + (mockDatabase.users.length + 1),
    email: "user" + (mockDatabase.users.length + 1) + "@example.com"
  };
  simulateHttp("POST", "/api/users", newUser).then(function(res) {
    console.log("User created:", res.data);
  });
}

function deleteUser() {
  if (mockDatabase.users.length > 0) {
    let id = mockDatabase.users[0].id;
    simulateHttp("DELETE", "/api/users/" + id, null).then(function() {
      console.log("User deleted");
    });
  }
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 5 continued — Interceptors & Error Handling
    'interceptors': {
      title: 'Angular Interceptors',
      content: `# Angular Interceptors 🚦

Think of interceptors like **security guards at a building entrance**. Everyone who comes in or goes out passes through them!

### What Are Interceptors?

Imagine you're sending letters (HTTP requests) to your friend:
- An interceptor is like a **mail sorter** who checks every letter
- They can add stamps (tokens), check addresses, or even return letters that look suspicious!

### Why Use Interceptors?

| Use Case | Real-World Example |
|----------|-------------------|
| **Add Auth Token** | Like showing your ID card at every door |
| **Log Requests** | Like a security camera recording who comes and goes |
| **Handle Errors** | Like a receptionist who helps when something goes wrong |
| **Transform Data** | Like a translator who converts languages |

### Creating an Interceptor

\`\`\`typescript
// auth.interceptor.ts
// This is like hiring a security guard!

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the secret password (token) from storage
  const token = localStorage.getItem('auth_token');
  
  // If we have a token, add it to every request
  // Like showing your ID badge at every door!
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', \`Bearer \${token}\`)
    });
    return next(clonedRequest);
  }
  
  // No token? Just let the request through
  return next(req);
};
\`\`\`

### Register in App Config

\`\`\`typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])  // Add our guard!
    )
  ]
};
\`\`\`

### Logging Interceptor (For Debugging)

\`\`\`typescript
// Like a diary that writes down everything!
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('📤 Request going out:', req.url);
  const startTime = Date.now();
  
  return next(req).pipe(
    tap({
      next: (response) => {
        const duration = Date.now() - startTime;
        console.log(\`📥 Response received in \${duration}ms\`);
      },
      error: (error) => {
        console.log('❌ Oops! Something went wrong:', error.message);
      }
    })
  );
};
\`\`\`

### Key Points to Remember 🎯

1. **Order Matters**: Interceptors run in order, like a line of security checkpoints
2. **Clone Requests**: Always clone before modifying (requests are immutable)
3. **Use for Cross-Cutting Concerns**: Things that apply to ALL requests
4. **Keep Them Simple**: Each interceptor should do ONE thing well

### Think of It Like This 💭

Interceptors are like a **factory assembly line**:
- Each station (interceptor) does a specific job
- The product (request) passes through each station
- At the end, you get a finished product ready to send!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚦 HTTP Interceptors Demo</h2>
<div id="demo"></div>

<script>
// Simulate interceptor chain
let interceptors = [];
let logs = [];

// Auth Interceptor - adds token
function authInterceptor(request) {
  logs.push("🔐 Auth Interceptor: Adding token...");
  return {
    ...request,
    headers: { ...request.headers, 'Authorization': 'Bearer abc123' }
  };
}

// Logging Interceptor - tracks requests
function loggingInterceptor(request) {
  logs.push("📝 Logging: " + request.method + " " + request.url);
  return request;
}

// Cache Interceptor - checks cache first
function cacheInterceptor(request) {
  logs.push("💾 Cache: Checking if cached...");
  return request;
}

// Add interceptors
interceptors.push(authInterceptor);
interceptors.push(loggingInterceptor);
interceptors.push(cacheInterceptor);

// Simulate a request going through interceptors
function makeRequest(url) {
  logs = [];
  let request = { url: url, method: 'GET', headers: {} };
  
  logs.push("<b>📤 Starting request to: " + url + "</b>");
  logs.push("");
  
  // Pass through each interceptor
  interceptors.forEach(function(interceptor, index) {
    logs.push("⏩ Interceptor " + (index + 1) + ":");
    request = interceptor(request);
  });
  
  logs.push("");
  logs.push("<b>✅ Final request ready!</b>");
  logs.push("Headers: " + JSON.stringify(request.headers));
  
  return logs;
}

// Display demo
function render() {
  let output = "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h3>🔧 Registered Interceptors</h3>";
  output += "<ol>";
  output += "<li>🔐 <b>Auth Interceptor</b> - Adds authentication token</li>";
  output += "<li>📝 <b>Logging Interceptor</b> - Logs all requests</li>";
  output += "<li>💾 <b>Cache Interceptor</b> - Checks cache first</li>";
  output += "</ol></div>";
  
  output += "<button onclick='simulateRequest()' style='padding:12px 24px;background:#DD0031;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px;margin-bottom:20px'>🚀 Make API Request</button>";
  
  output += "<div id='result' style='background:#1e1e1e;color:#9cdcfe;padding:20px;border-radius:8px;font-family:monospace;min-height:200px'>";
  output += "<p style='color:#888'>Click the button to see interceptors in action!</p>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

function simulateRequest() {
  let logs = makeRequest("/api/users");
  let resultHtml = logs.map(function(log) {
    return "<div style='margin:5px 0'>" + log + "</div>";
  }).join("");
  document.getElementById("result").innerHTML = resultHtml;
}

render();
</script>

</body>
</html>`,
    },

    'error-handling': {
      title: 'Error Handling',
      content: `# Error Handling in Angular 🚨

Think of error handling like having a **safety net when you're learning to ride a bike**. Even if you fall, you won't get hurt!

### Why Handle Errors?

Imagine you're playing a video game:
- Sometimes the game **freezes** (server error)
- Sometimes your **internet goes out** (network error)
- Sometimes you type the **wrong password** (user error)

Good error handling means the game tells you what happened instead of just crashing!

### Types of Errors

| Error Type | Example | What to Do |
|------------|---------|------------|
| **400 Bad Request** | Sent wrong data | Tell user what's wrong |
| **401 Unauthorized** | Not logged in | Redirect to login |
| **403 Forbidden** | No permission | Show "access denied" |
| **404 Not Found** | Page doesn't exist | Show "not found" page |
| **500 Server Error** | Server broke | "Try again later" |

### Basic Error Handling

\`\`\`typescript
// Like catching a ball - if you miss, you still handle it!
this.http.get('/api/users').subscribe({
  next: (data) => {
    console.log('Yay! Got the data:', data);
  },
  error: (error) => {
    console.log('Oops! Something went wrong:', error);
    // Show a friendly message to the user
    this.showErrorMessage('Sorry, we could not load the users.');
  }
});
\`\`\`

### Error Handling Interceptor

\`\`\`typescript
// This catches ALL errors, like a superhero protecting everyone!
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      // Figure out what went wrong
      if (error.status === 401) {
        // Not logged in? Go to login page!
        router.navigate(['/login']);
      } else if (error.status === 404) {
        // Page not found
        console.log('That page does not exist!');
      } else if (error.status >= 500) {
        // Server problem
        console.log('The server is having a bad day. Try again later!');
      }
      
      // Pass the error along
      return throwError(() => error);
    })
  );
};
\`\`\`

### Retry Strategy

\`\`\`typescript
// Sometimes things work if you try again!
// Like when your internet is slow
this.http.get('/api/data').pipe(
  retry(3),  // Try 3 times before giving up
  catchError(error => {
    console.log('Tried 3 times, still broken!');
    return of(null);  // Return empty instead of crashing
  })
);
\`\`\`

### User-Friendly Error Messages

Instead of showing scary error codes, show friendly messages:

| Error | Bad Message ❌ | Good Message ✅ |
|-------|---------------|----------------|
| 401 | "Error 401: Unauthorized" | "Please log in to continue" |
| 404 | "Error 404: Not Found" | "We couldn't find that page" |
| 500 | "Internal Server Error" | "Something went wrong. We're fixing it!" |

### Remember! 🎯

1. **Always catch errors** - Don't let your app crash
2. **Show friendly messages** - Users aren't developers
3. **Log errors** - So you can fix them later
4. **Retry when appropriate** - Networks can be flaky
5. **Have a fallback plan** - Show cached data or a nice error page
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚨 Error Handling Demo</h2>
<div id="demo"></div>

<script>
let errorLog = [];

// Simulate different API responses
function simulateAPI(endpoint) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      if (endpoint === '/api/users') {
        resolve({ data: ['Alice', 'Bob', 'Charlie'] });
      } else if (endpoint === '/api/secret') {
        reject({ status: 401, message: 'Unauthorized' });
      } else if (endpoint === '/api/missing') {
        reject({ status: 404, message: 'Not Found' });
      } else if (endpoint === '/api/broken') {
        reject({ status: 500, message: 'Server Error' });
      }
    }, 500);
  });
}

// Handle errors nicely
function handleError(error) {
  let friendlyMessage = "";
  let emoji = "❌";
  
  switch(error.status) {
    case 401:
      friendlyMessage = "Please log in to continue 🔐";
      emoji = "🔒";
      break;
    case 404:
      friendlyMessage = "We couldn't find that page 🔍";
      emoji = "🤷";
      break;
    case 500:
      friendlyMessage = "Something went wrong. We're fixing it! 🔧";
      emoji = "⚠️";
      break;
    default:
      friendlyMessage = "An unexpected error occurred";
  }
  
  return { emoji: emoji, message: friendlyMessage, code: error.status };
}

// Make request with error handling
async function makeRequest(endpoint, displayName) {
  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<p>⏳ Loading...</p>";
  
  try {
    let response = await simulateAPI(endpoint);
    resultDiv.innerHTML = "<div style='color:#4caf50;padding:15px;background:#e8f5e9;border-radius:8px'>" +
      "<h4>✅ Success!</h4>" +
      "<p>Data: " + JSON.stringify(response.data) + "</p></div>";
  } catch(error) {
    let handled = handleError(error);
    resultDiv.innerHTML = "<div style='padding:15px;background:#ffebee;border-radius:8px'>" +
      "<h4>" + handled.emoji + " Error " + handled.code + "</h4>" +
      "<p>" + handled.message + "</p>" +
      "<small style='color:#888'>Technical: " + error.message + "</small></div>";
  }
}

function render() {
  let output = "<div style='margin-bottom:20px'>";
  output += "<p>Click buttons to see how we handle different responses:</p>";
  output += "</div>";
  
  output += "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px'>";
  output += "<button onclick='makeRequest(\"/api/users\", \"Users\")' style='padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>✅ Success Request</button>";
  output += "<button onclick='makeRequest(\"/api/secret\", \"Secret\")' style='padding:10px 20px;background:#ff9800;color:white;border:none;border-radius:6px;cursor:pointer'>🔒 401 Unauthorized</button>";
  output += "<button onclick='makeRequest(\"/api/missing\", \"Missing\")' style='padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>🔍 404 Not Found</button>";
  output += "<button onclick='makeRequest(\"/api/broken\", \"Broken\")' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer'>⚠️ 500 Server Error</button>";
  output += "</div>";
  
  output += "<div id='result' style='background:#f5f5f5;padding:20px;border-radius:8px;min-height:100px'>";
  output += "<p style='color:#888'>Click a button to make a request!</p>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'lifecycle-hooks': {
      title: 'Angular Lifecycle Hooks',
      content: `# Angular Lifecycle Hooks 🔄

Think of lifecycle hooks like **stages of growing a plant** 🌱:
1. Plant the seed (create)
2. Water it (initialize)
3. Watch it grow (update)
4. Trim dead leaves (cleanup)
5. Eventually remove (destroy)

### What Are Lifecycle Hooks?

Hooks are special moments in a component's life when Angular says:
> "Hey! Something is happening! Do you want to do something now?"

It's like getting notifications at important moments!

### The Main Lifecycle Hooks

| Hook | When It Runs | Real-World Example |
|------|--------------|-------------------|
| **ngOnInit** | After component is created | "I'm born! Let me get my data!" |
| **ngOnChanges** | When @Input values change | "Mom gave me a new toy!" |
| **ngAfterViewInit** | After view is ready | "The room is decorated, let me look around!" |
| **ngOnDestroy** | Before component dies | "Goodbye! Let me clean up my toys first." |

### ngOnInit - The Most Common Hook 🌟

\`\`\`typescript
// This runs ONCE when the component starts
// Perfect for loading data!

@Component({...})
export class UserProfileComponent implements OnInit {
  user: User;
  
  ngOnInit() {
    console.log('Component is ready! Loading user data...');
    this.loadUserData();  // Get data from server
  }
  
  loadUserData() {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }
}
\`\`\`

### ngOnChanges - When Inputs Change 🔄

\`\`\`typescript
// This runs when a parent sends new data
// Like getting a new present!

@Component({...})
export class GreetingComponent implements OnChanges {
  @Input() name: string;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      console.log('Name changed from', 
        changes['name'].previousValue, 
        'to', 
        changes['name'].currentValue
      );
    }
  }
}
\`\`\`

### ngOnDestroy - Cleanup Time! 🧹

\`\`\`typescript
// This runs before the component is removed
// Like cleaning your room before going on vacation!

@Component({...})
export class ChatComponent implements OnDestroy {
  private subscription: Subscription;
  
  ngOnInit() {
    // Start listening to messages
    this.subscription = this.chatService.messages$.subscribe();
  }
  
  ngOnDestroy() {
    // Stop listening - very important!
    // Otherwise we have "memory leaks" (messy room)
    this.subscription.unsubscribe();
    console.log('Cleaned up! Goodbye!');
  }
}
\`\`\`

### The Complete Lifecycle Order

1. 🏗️ **constructor** - Component is built
2. 📥 **ngOnChanges** - First time inputs arrive
3. 🎬 **ngOnInit** - Component is ready to start
4. ✅ **ngDoCheck** - Every change detection
5. 📺 **ngAfterViewInit** - View is ready
6. 🔄 **ngOnChanges** - Inputs change again (repeats)
7. 🧹 **ngOnDestroy** - Time to clean up and go

### Quick Tips 🎯

1. **Use ngOnInit** for loading data (not constructor)
2. **Use ngOnDestroy** to clean up subscriptions
3. **Use ngOnChanges** when you need to react to @Input changes
4. **Keep hooks simple** - don't put too much code in them
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔄 Lifecycle Hooks Demo</h2>
<div id="demo"></div>

<script>
let lifecycleLog = [];
let componentCount = 0;

class SimulatedComponent {
  constructor(name) {
    this.name = name;
    this.logs = [];
    this.addLog("🏗️ constructor", "Component built");
  }
  
  addLog(hook, message) {
    this.logs.push({ hook: hook, message: message, time: new Date().toLocaleTimeString() });
  }
  
  ngOnChanges(changes) {
    this.addLog("📥 ngOnChanges", "Input changed: " + JSON.stringify(changes));
  }
  
  ngOnInit() {
    this.addLog("🎬 ngOnInit", "Component initialized - Loading data...");
  }
  
  ngAfterViewInit() {
    this.addLog("📺 ngAfterViewInit", "View is ready!");
  }
  
  ngOnDestroy() {
    this.addLog("🧹 ngOnDestroy", "Cleaning up... Goodbye!");
  }
}

let currentComponent = null;

function createComponent() {
  componentCount++;
  currentComponent = new SimulatedComponent("UserProfile_" + componentCount);
  
  // Simulate lifecycle
  setTimeout(function() { 
    currentComponent.ngOnChanges({ name: "Alice" }); 
    renderLogs();
  }, 300);
  
  setTimeout(function() { 
    currentComponent.ngOnInit(); 
    renderLogs();
  }, 600);
  
  setTimeout(function() { 
    currentComponent.ngAfterViewInit(); 
    renderLogs();
  }, 900);
  
  renderLogs();
}

function updateComponent() {
  if (currentComponent) {
    currentComponent.ngOnChanges({ name: "Bob (changed)" });
    renderLogs();
  }
}

function destroyComponent() {
  if (currentComponent) {
    currentComponent.ngOnDestroy();
    renderLogs();
    setTimeout(function() {
      currentComponent = null;
      renderLogs();
    }, 500);
  }
}

function renderLogs() {
  let output = "<div style='margin-bottom:20px'>";
  output += "<p>Watch the lifecycle hooks in action!</p>";
  output += "</div>";
  
  output += "<div style='display:flex;gap:10px;margin-bottom:20px'>";
  output += "<button onclick='createComponent()' style='padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>🎬 Create Component</button>";
  output += "<button onclick='updateComponent()' style='padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>🔄 Update Input</button>";
  output += "<button onclick='destroyComponent()' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer'>🧹 Destroy Component</button>";
  output += "</div>";
  
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:20px;border-radius:8px;min-height:200px;font-family:monospace'>";
  
  if (currentComponent) {
    output += "<div style='color:#4ec9b0;margin-bottom:10px'>📦 Component: " + currentComponent.name + "</div>";
    currentComponent.logs.forEach(function(log) {
      let color = log.hook.includes("Destroy") ? "#f44336" : log.hook.includes("Init") ? "#4caf50" : "#dcdcaa";
      output += "<div style='margin:8px 0;padding:8px;background:#2d2d2d;border-radius:4px'>";
      output += "<span style='color:" + color + "'>" + log.hook + "</span>";
      output += " <span style='color:#888'>| " + log.message + "</span>";
      output += "</div>";
    });
  } else {
    output += "<p style='color:#888'>No component. Click 'Create Component' to start!</p>";
  }
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

renderLogs();
</script>

</body>
</html>`,
    },

    // PHASE 6 — Pipes, Styling
    'pipes': {
      title: 'Angular Pipes',
      content: `# Angular Pipes 🔧

Think of pipes like **magic translators** that transform data before you see it!

### What Are Pipes?

Imagine you have a number like \`1234567.89\`
- Without a pipe: 1234567.89 (hard to read!)
- With a pipe: $1,234,567.89 (much better!)

Pipes **transform** data into a nice format!

### Built-in Pipes (Free Magic! ✨)

| Pipe | What It Does | Example |
|------|--------------|---------|
| **date** | Formats dates nicely | Jan 15, 2024 |
| **uppercase** | MAKES TEXT LOUD | HELLO WORLD |
| **lowercase** | makes text quiet | hello world |
| **currency** | Adds money symbols | $1,234.56 |
| **number** | Formats numbers | 1,234.567 |
| **percent** | Makes percentages | 75% |
| **json** | Shows objects nicely | {"name": "Bob"} |

### Using Pipes in Templates

\`\`\`html
<!-- The pipe symbol | is the magic wand! -->

<!-- Date pipe -->
<p>Today is {{ today | date:'fullDate' }}</p>
<!-- Output: Today is Monday, January 15, 2024 -->

<!-- Currency pipe -->
<p>Price: {{ 99.99 | currency:'USD' }}</p>
<!-- Output: Price: $99.99 -->

<!-- Uppercase pipe -->
<p>{{ 'hello world' | uppercase }}</p>
<!-- Output: HELLO WORLD -->

<!-- Chain pipes together! -->
<p>{{ birthday | date:'shortDate' | uppercase }}</p>
<!-- Output: 1/15/24 (but uppercase) -->
\`\`\`

### Create Your Own Pipe! 🎨

\`\`\`typescript
// A pipe that adds emojis based on mood!
@Pipe({ name: 'moodEmoji' })
export class MoodEmojiPipe implements PipeTransform {
  transform(mood: string): string {
    switch(mood.toLowerCase()) {
      case 'happy': return mood + ' 😊';
      case 'sad': return mood + ' 😢';
      case 'excited': return mood + ' 🎉';
      case 'sleepy': return mood + ' 😴';
      default: return mood + ' 🙂';
    }
  }
}

// Use it in template:
// <p>{{ 'happy' | moodEmoji }}</p>
// Output: happy 😊
\`\`\`

### Pure vs Impure Pipes

**Pure Pipes** (Default) - Only update when input changes
- Like a vending machine: same input = same output
- Fast and efficient!

**Impure Pipes** - Update on every change detection
- Like checking your watch every second
- Use carefully - can be slow!

### Remember! 🎯

1. Pipes are for **displaying** data, not changing it
2. Built-in pipes handle 90% of cases
3. Keep custom pipes **simple** and **pure**
4. Chain pipes with multiple \`|\` symbols
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔧 Angular Pipes Demo</h2>
<div id="demo"></div>

<script>
// Simulate Angular pipes

function datePipe(date, format) {
  let d = new Date(date);
  let options = {};
  
  switch(format) {
    case 'short': return d.toLocaleDateString();
    case 'full': return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    case 'time': return d.toLocaleTimeString();
    default: return d.toDateString();
  }
}

function currencyPipe(amount, currency) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
}

function percentPipe(value) {
  return (value * 100).toFixed(0) + '%';
}

function uppercasePipe(text) {
  return text.toUpperCase();
}

function lowercasePipe(text) {
  return text.toLowerCase();
}

function moodEmojiPipe(mood) {
  let emojis = { happy: '😊', sad: '😢', excited: '🎉', sleepy: '😴', angry: '😠' };
  return mood + ' ' + (emojis[mood.toLowerCase()] || '🙂');
}

function render() {
  let now = new Date();
  let price = 1234.56;
  let discount = 0.25;
  
  let output = "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
  
  // Date pipes
  output += "<h3>📅 Date Pipe</h3>";
  output += "<table style='width:100%;border-collapse:collapse;margin-bottom:20px'>";
  output += "<tr style='background:#DD0031;color:white'><th style='padding:10px;text-align:left'>Original</th><th>Pipe</th><th>Result</th></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>" + now.toISOString() + "</td><td>date:'short'</td><td><b>" + datePipe(now, 'short') + "</b></td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>" + now.toISOString() + "</td><td>date:'full'</td><td><b>" + datePipe(now, 'full') + "</b></td></tr>";
  output += "</table>";
  
  // Currency pipe
  output += "<h3>💰 Currency Pipe</h3>";
  output += "<table style='width:100%;border-collapse:collapse;margin-bottom:20px'>";
  output += "<tr style='background:#4caf50;color:white'><th style='padding:10px;text-align:left'>Number</th><th>Pipe</th><th>Result</th></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>" + price + "</td><td>currency:'USD'</td><td><b>" + currencyPipe(price, 'USD') + "</b></td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'>" + price + "</td><td>currency:'EUR'</td><td><b>" + currencyPipe(price, 'EUR') + "</b></td></tr>";
  output += "</table>";
  
  // Percent pipe
  output += "<h3>📊 Percent Pipe</h3>";
  output += "<p>" + discount + " → <b>" + percentPipe(discount) + "</b></p>";
  
  // Text pipes
  output += "<h3>📝 Text Pipes</h3>";
  output += "<p>'Hello World' | uppercase → <b>" + uppercasePipe('Hello World') + "</b></p>";
  output += "<p>'Hello World' | lowercase → <b>" + lowercasePipe('Hello World') + "</b></p>";
  
  // Custom pipe
  output += "<h3>🎨 Custom Mood Emoji Pipe</h3>";
  ['happy', 'sad', 'excited', 'sleepy'].forEach(function(mood) {
    output += "<span style='display:inline-block;padding:8px 16px;margin:5px;background:white;border-radius:20px;box-shadow:0 2px 4px rgba(0,0,0,0.1)'>" + moodEmojiPipe(mood) + "</span>";
  });
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'styling': {
      title: 'Angular Styling',
      content: `# Angular Styling 🎨

Think of Angular styling like **giving each room in a house its own decoration** - each component can have its own style that doesn't mess up other rooms!

### Why Component Styles Are Special

In regular HTML, if you write:
\`\`\`css
h1 { color: red; }
\`\`\`
EVERY h1 on the WHOLE page turns red!

In Angular, styles stay **inside their component** like magic! 🏠

### Three Ways to Add Styles

**1. Inline Styles in @Component**
\`\`\`typescript
@Component({
  selector: 'app-card',
  template: '<div class="card">Hello!</div>',
  styles: [\`
    .card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
    }
  \`]
})
\`\`\`

**2. External Style File (Recommended)**
\`\`\`typescript
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']  // Styles live here!
})
\`\`\`

**3. Global Styles (styles.css)**
For things that apply everywhere (fonts, colors, reset)

### View Encapsulation (The Magic!)

Angular adds special attributes to keep styles isolated:

| Mode | What It Does |
|------|--------------|
| **Emulated** (Default) | Styles only affect this component |
| **None** | Styles leak everywhere (like regular CSS) |
| **ShadowDom** | Uses browser's Shadow DOM |

\`\`\`typescript
@Component({
  encapsulation: ViewEncapsulation.Emulated  // Default - keeps styles safe!
})
\`\`\`

### Special Selectors

\`\`\`css
/* :host - styles the component itself */
:host {
  display: block;
  border: 1px solid #ddd;
}

/* :host-context - styles based on parent */
:host-context(.dark-theme) {
  background: #333;
  color: white;
}

/* ::ng-deep - ESCAPES encapsulation (use carefully!) */
::ng-deep .third-party-widget {
  color: red;
}
\`\`\`

### CSS Variables for Theming

\`\`\`css
/* In styles.css (global) */
:root {
  --primary-color: #DD0031;
  --text-color: #333;
}

/* In component */
.button {
  background: var(--primary-color);
  color: var(--text-color);
}
\`\`\`

### Remember! 🎯

1. **Component styles are isolated** by default
2. Use **styleUrls** for separate CSS files
3. Use **:host** to style the component element itself
4. Use **CSS variables** for themes
5. Avoid **::ng-deep** when possible
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎨 Angular Styling Demo</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "";
  
  // Show encapsulation example
  output += "<div style='margin-bottom:30px'>";
  output += "<h3>🔒 View Encapsulation</h3>";
  output += "<p>Angular adds special attributes to isolate component styles:</p>";
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:13px'>";
  output += "&lt;div <span style='color:#4ec9b0'>_ngcontent-abc-c42</span>&gt;<br>";
  output += "  &lt;h1 <span style='color:#4ec9b0'>_ngcontent-abc-c42</span>&gt;Title&lt;/h1&gt;<br>";
  output += "&lt;/div&gt;";
  output += "</div>";
  output += "<p style='color:#888;font-size:14px'>The special attribute ensures styles only affect this component!</p>";
  output += "</div>";
  
  // Component examples
  output += "<h3>🏠 Component Style Isolation</h3>";
  output += "<div style='display:flex;gap:20px;flex-wrap:wrap;margin-bottom:30px'>";
  
  // Component A
  output += "<div style='flex:1;min-width:200px;padding:20px;background:#e3f2fd;border-radius:8px;border:2px solid #2196f3'>";
  output += "<h4 style='color:#1976d2;margin-top:0'>📦 Component A</h4>";
  output += "<p style='color:#333'>h1 { color: <span style='color:#2196f3;font-weight:bold'>blue</span>; }</p>";
  output += "<h1 style='color:#2196f3'>I'm Blue!</h1>";
  output += "</div>";
  
  // Component B
  output += "<div style='flex:1;min-width:200px;padding:20px;background:#fce4ec;border-radius:8px;border:2px solid #e91e63'>";
  output += "<h4 style='color:#c2185b;margin-top:0'>📦 Component B</h4>";
  output += "<p style='color:#333'>h1 { color: <span style='color:#e91e63;font-weight:bold'>pink</span>; }</p>";
  output += "<h1 style='color:#e91e63'>I'm Pink!</h1>";
  output += "</div>";
  
  output += "</div>";
  output += "<p style='color:#4caf50'>✅ Each component has its own h1 style - they don't conflict!</p>";
  
  // :host example
  output += "<h3>🎯 :host Selector</h3>";
  output += "<div style='display:inline-block;padding:20px;border:3px dashed #DD0031;border-radius:8px;margin-bottom:20px'>";
  output += "<code style='color:#DD0031'>:host { border: 3px dashed red; }</code><br><br>";
  output += "<span>This styles the component element itself!</span>";
  output += "</div>";
  
  // CSS Variables
  output += "<h3>🎨 CSS Variables for Theming</h3>";
  output += "<div style='display:flex;gap:20px;flex-wrap:wrap'>";
  
  // Light theme
  output += "<div style='flex:1;min-width:150px;padding:20px;background:white;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)'>";
  output += "<h4 style='margin-top:0'>☀️ Light Theme</h4>";
  output += "<button style='padding:10px 20px;background:#DD0031;color:white;border:none;border-radius:4px'>Button</button>";
  output += "<p style='font-size:12px;color:#888;margin-bottom:0'>--primary: #DD0031</p>";
  output += "</div>";
  
  // Dark theme
  output += "<div style='flex:1;min-width:150px;padding:20px;background:#1e1e1e;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:white'>🌙 Dark Theme</h4>";
  output += "<button style='padding:10px 20px;background:#ff5252;color:white;border:none;border-radius:4px'>Button</button>";
  output += "<p style='font-size:12px;color:#888;margin-bottom:0'>--primary: #ff5252</p>";
  output += "</div>";
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'bootstrap': {
      title: 'Angular Bootstrap',
      content: `# Angular Bootstrap 🚀

Think of Angular bootstrap like **starting a car**:
1. Turn the key (run the app)
2. Engine checks everything (Angular initializes)
3. Dashboard lights up (components render)
4. You can drive! (app is ready)

### How Angular Starts

When you run \`ng serve\`, this happens:

1. **index.html** loads
2. **main.ts** runs
3. Angular **bootstraps** your app
4. **Root component** (usually AppComponent) appears
5. **Other components** load as needed

### main.ts - The Starting Point

\`\`\`typescript
// main.ts - This is where it all begins!
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// 🚀 START THE APP!
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
\`\`\`

### Two Ways to Bootstrap

**1. Standalone (Modern - Angular 14+) ✨**
\`\`\`typescript
// Clean and simple!
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
\`\`\`

**2. NgModule (Traditional)**
\`\`\`typescript
// The old way - still works!
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [AppComponent]
})
export class AppModule { }

// In main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
\`\`\`

### App Config (Modern Pattern)

\`\`\`typescript
// app.config.ts - Configure everything here!
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Add more providers here!
  ]
};
\`\`\`

### Environment Configurations

\`\`\`typescript
// environment.ts (Development)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};

// environment.prod.ts (Production)
export const environment = {
  production: true,
  apiUrl: 'https://api.myapp.com'
};
\`\`\`

### Bootstrap Order 📋

1. Browser loads \`index.html\`
2. Browser loads JavaScript bundles
3. Angular starts (platform created)
4. Root component bootstrapped
5. Components initialize (ngOnInit)
6. View rendered
7. App is ready! 🎉

### Remember! 🎯

1. **main.ts** is the entry point
2. Use **Standalone** for new projects
3. **AppComponent** is usually the root
4. Configure providers in **app.config.ts**
5. Use **environments** for different settings
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚀 Angular Bootstrap Demo</h2>
<div id="demo"></div>

<script>
let bootstrapSteps = [];
let currentStep = 0;

function simulateBootstrap() {
  bootstrapSteps = [
    { icon: "📄", label: "index.html loaded", detail: "Browser downloads the initial HTML file" },
    { icon: "📦", label: "main.js loaded", detail: "Angular bundles are downloaded and parsed" },
    { icon: "⚙️", label: "Platform created", detail: "Angular runtime initializes" },
    { icon: "🎯", label: "bootstrapApplication called", detail: "Starting the app with AppComponent" },
    { icon: "🏠", label: "AppComponent created", detail: "Root component constructor runs" },
    { icon: "📥", label: "Providers injected", detail: "Services and dependencies are ready" },
    { icon: "🎬", label: "ngOnInit runs", detail: "Component initialization logic executes" },
    { icon: "🖼️", label: "View rendered", detail: "Template is compiled and displayed" },
    { icon: "✅", label: "App Ready!", detail: "Application is fully bootstrapped" }
  ];
  
  currentStep = 0;
  animateSteps();
}

function animateSteps() {
  if (currentStep <= bootstrapSteps.length) {
    renderProgress();
    currentStep++;
    if (currentStep <= bootstrapSteps.length) {
      setTimeout(animateSteps, 400);
    }
  }
}

function renderProgress() {
  let output = "<div style='margin-bottom:20px'>";
  output += "<button onclick='simulateBootstrap()' style='padding:12px 24px;background:#DD0031;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px'>🚀 Start Bootstrap</button>";
  output += "</div>";
  
  // Code preview
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:13px;margin-bottom:20px'>";
  output += "<span style='color:#c586c0'>import</span> { <span style='color:#4ec9b0'>bootstrapApplication</span> } <span style='color:#c586c0'>from</span> <span style='color:#ce9178'>'@angular/platform-browser'</span>;<br><br>";
  output += "<span style='color:#dcdcaa'>bootstrapApplication</span>(<span style='color:#4ec9b0'>AppComponent</span>, <span style='color:#4ec9b0'>appConfig</span>)<br>";
  output += "  .<span style='color:#dcdcaa'>catch</span>(<span style='color:#9cdcfe'>err</span> => <span style='color:#9cdcfe'>console</span>.<span style='color:#dcdcaa'>error</span>(<span style='color:#9cdcfe'>err</span>));";
  output += "</div>";
  
  // Steps visualization
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0'>Bootstrap Sequence</h3>";
  
  bootstrapSteps.forEach(function(step, index) {
    let isComplete = index < currentStep;
    let isCurrent = index === currentStep - 1;
    
    let bgColor = isComplete ? "#e8f5e9" : "#fff";
    let borderColor = isCurrent ? "#DD0031" : (isComplete ? "#4caf50" : "#ddd");
    let borderWidth = isCurrent ? "2px" : "1px";
    
    output += "<div style='display:flex;align-items:center;padding:12px;margin:8px 0;background:" + bgColor + ";border:" + borderWidth + " solid " + borderColor + ";border-radius:8px;transition:all 0.3s'>";
    output += "<span style='font-size:24px;margin-right:15px'>" + (isComplete ? "✅" : step.icon) + "</span>";
    output += "<div>";
    output += "<div style='font-weight:bold'>" + step.label + "</div>";
    output += "<div style='font-size:12px;color:#666'>" + step.detail + "</div>";
    output += "</div>";
    output += "</div>";
  });
  
  output += "</div>";
  
  if (currentStep === bootstrapSteps.length) {
    output += "<div style='margin-top:20px;padding:20px;background:#e8f5e9;border-radius:8px;text-align:center'>";
    output += "<h3 style='color:#2e7d32;margin:0'>🎉 Application Bootstrapped Successfully!</h3>";
    output += "</div>";
  }
  
  document.getElementById("demo").innerHTML = output;
}

// Initial render
bootstrapSteps = [
  { icon: "📄", label: "index.html loaded", detail: "Browser downloads the initial HTML file" },
  { icon: "📦", label: "main.js loaded", detail: "Angular bundles are downloaded and parsed" },
  { icon: "⚙️", label: "Platform created", detail: "Angular runtime initializes" },
  { icon: "🎯", label: "bootstrapApplication called", detail: "Starting the app with AppComponent" },
  { icon: "🏠", label: "AppComponent created", detail: "Root component constructor runs" },
  { icon: "📥", label: "Providers injected", detail: "Services and dependencies are ready" },
  { icon: "🎬", label: "ngOnInit runs", detail: "Component initialization logic executes" },
  { icon: "🖼️", label: "View rendered", detail: "Template is compiled and displayed" },
  { icon: "✅", label: "App Ready!", detail: "Application is fully bootstrapped" }
];
renderProgress();
</script>

</body>
</html>`,
    },

    'control-flow': {
      title: 'Angular Control Flow',
      content: `# Angular Control Flow 🚦

Think of control flow like **traffic lights** - they tell Angular when to show, hide, or repeat things!

### The New Way (Angular 17+) 🆕

Angular 17 introduced a NEW syntax that's easier to read:

### @if - Show or Hide

\`\`\`html
<!-- New way - looks like code! -->
@if (isLoggedIn) {
  <p>Welcome back!</p>
} @else {
  <p>Please log in</p>
}

<!-- Old way with *ngIf -->
<p *ngIf="isLoggedIn; else loginTemplate">Welcome back!</p>
<ng-template #loginTemplate><p>Please log in</p></ng-template>
\`\`\`

### @for - Loop Through Items

\`\`\`html
<!-- New way - clean and simple! -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found</p>
}

<!-- Old way with *ngFor -->
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>
\`\`\`

### @switch - Multiple Choices

\`\`\`html
@switch (status) {
  @case ('loading') {
    <p>Loading...</p>
  }
  @case ('success') {
    <p>Done! ✅</p>
  }
  @case ('error') {
    <p>Oops! ❌</p>
  }
  @default {
    <p>Unknown status</p>
  }
}
\`\`\`

### Why track Is Important 🎯

When you loop through items, Angular needs to know which is which:

\`\`\`html
<!-- GOOD: Angular knows each item by its ID -->
@for (user of users; track user.id) {
  <user-card [user]="user" />
}

<!-- BAD: Angular has to guess (slower!) -->
@for (user of users; track $index) {
  <user-card [user]="user" />
}
\`\`\`

Think of it like name tags at a party - with IDs, Angular can quickly find who's who!

### Special Variables in @for

| Variable | What It Means |
|----------|---------------|
| \`$index\` | Current position (0, 1, 2...) |
| \`$first\` | Is this the first item? |
| \`$last\` | Is this the last item? |
| \`$even\` | Is position even? (0, 2, 4...) |
| \`$odd\` | Is position odd? (1, 3, 5...) |
| \`$count\` | Total number of items |

\`\`\`html
@for (item of items; track item.id; let i = $index, let isFirst = $first) {
  <div [class.first-item]="isFirst">
    {{ i + 1 }}. {{ item.name }}
  </div>
}
\`\`\`

### Remember! 🎯

1. Use **@if** for showing/hiding
2. Use **@for** for lists (always use track!)
3. Use **@switch** for multiple conditions
4. New syntax is **cleaner and faster**
5. Old directives (*ngIf, *ngFor) still work!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚦 Angular Control Flow Demo</h2>
<div id="demo"></div>

<script>
let isLoggedIn = false;
let items = [
  { id: 1, name: 'Apple', emoji: '🍎' },
  { id: 2, name: 'Banana', emoji: '🍌' },
  { id: 3, name: 'Orange', emoji: '🍊' },
  { id: 4, name: 'Grape', emoji: '🍇' }
];
let status = 'loading';

function toggleLogin() {
  isLoggedIn = !isLoggedIn;
  render();
}

function setStatus(newStatus) {
  status = newStatus;
  render();
}

function addItem() {
  let fruits = [
    { name: 'Watermelon', emoji: '🍉' },
    { name: 'Strawberry', emoji: '🍓' },
    { name: 'Cherry', emoji: '🍒' },
    { name: 'Peach', emoji: '🍑' }
  ];
  let random = fruits[Math.floor(Math.random() * fruits.length)];
  items.push({ id: Date.now(), ...random });
  render();
}

function removeItem() {
  if (items.length > 0) {
    items.pop();
    render();
  }
}

function render() {
  let output = "";
  
  // @if demo
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h3 style='margin-top:0'>@if - Conditional Rendering</h3>";
  output += "<code style='background:#e0e0e0;padding:4px 8px;border-radius:4px'>@if (isLoggedIn) { ... } @else { ... }</code>";
  output += "<div style='margin:15px 0'>";
  output += "<button onclick='toggleLogin()' style='padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>Toggle Login</button>";
  output += "</div>";
  output += "<div style='padding:15px;background:" + (isLoggedIn ? "#e8f5e9" : "#fff3e0") + ";border-radius:8px'>";
  if (isLoggedIn) {
    output += "<span>✅ Welcome back, User! <b>isLoggedIn = true</b></span>";
  } else {
    output += "<span>🔐 Please log in. <b>isLoggedIn = false</b></span>";
  }
  output += "</div></div>";
  
  // @for demo
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h3 style='margin-top:0'>@for - Loop Rendering</h3>";
  output += "<code style='background:#e0e0e0;padding:4px 8px;border-radius:4px'>@for (item of items; track item.id) { ... }</code>";
  output += "<div style='margin:15px 0'>";
  output += "<button onclick='addItem()' style='padding:8px 16px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer;margin-right:10px'>➕ Add</button>";
  output += "<button onclick='removeItem()' style='padding:8px 16px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer'>➖ Remove</button>";
  output += "</div>";
  
  if (items.length === 0) {
    output += "<div style='padding:20px;background:#ffebee;border-radius:8px;text-align:center'>@empty { <b>No items found!</b> }</div>";
  } else {
    output += "<div style='display:flex;flex-wrap:wrap;gap:10px'>";
    items.forEach(function(item, index) {
      let isFirst = index === 0;
      let isLast = index === items.length - 1;
      let isEven = index % 2 === 0;
      let bg = isEven ? "#e3f2fd" : "#fff";
      let border = isFirst ? "2px solid #4caf50" : (isLast ? "2px solid #f44336" : "1px solid #ddd");
      
      output += "<div style='padding:12px 16px;background:" + bg + ";border:" + border + ";border-radius:8px;min-width:100px;text-align:center'>";
      output += "<div style='font-size:24px'>" + item.emoji + "</div>";
      output += "<div>" + item.name + "</div>";
      output += "<div style='font-size:11px;color:#888'>$index: " + index + "</div>";
      if (isFirst) output += "<div style='font-size:10px;color:#4caf50'>$first ✓</div>";
      if (isLast) output += "<div style='font-size:10px;color:#f44336'>$last ✓</div>";
      output += "</div>";
    });
    output += "</div>";
    output += "<div style='margin-top:10px;color:#888;font-size:13px'>$count: " + items.length + "</div>";
  }
  output += "</div>";
  
  // @switch demo
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0'>@switch - Multiple Conditions</h3>";
  output += "<div style='margin:15px 0;display:flex;gap:10px;flex-wrap:wrap'>";
  output += "<button onclick='setStatus(\"loading\")' style='padding:8px 16px;background:" + (status === 'loading' ? '#ff9800' : '#e0e0e0') + ";color:" + (status === 'loading' ? 'white' : 'black') + ";border:none;border-radius:6px;cursor:pointer'>Loading</button>";
  output += "<button onclick='setStatus(\"success\")' style='padding:8px 16px;background:" + (status === 'success' ? '#4caf50' : '#e0e0e0') + ";color:" + (status === 'success' ? 'white' : 'black') + ";border:none;border-radius:6px;cursor:pointer'>Success</button>";
  output += "<button onclick='setStatus(\"error\")' style='padding:8px 16px;background:" + (status === 'error' ? '#f44336' : '#e0e0e0') + ";color:" + (status === 'error' ? 'white' : 'black') + ";border:none;border-radius:6px;cursor:pointer'>Error</button>";
  output += "</div>";
  
  let statusContent = "";
  if (status === 'loading') statusContent = "<div style='padding:20px;background:#fff3e0;border-radius:8px'>⏳ Loading...</div>";
  else if (status === 'success') statusContent = "<div style='padding:20px;background:#e8f5e9;border-radius:8px'>✅ Success!</div>";
  else if (status === 'error') statusContent = "<div style='padding:20px;background:#ffebee;border-radius:8px'>❌ Error occurred</div>";
  
  output += statusContent;
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 8 — Change Detection & Signals
    'change-detection': {
      title: 'Change Detection',
      content: `# Change Detection 🔍

Think of change detection like a **teacher checking homework** - Angular looks at every component to see if anything changed!

### What Is Change Detection?

When something changes in your app (button click, data arrives), Angular needs to know so it can update the screen.

It's like a security camera that watches for any movement! 📹

### How It Works (Zone.js)

Angular uses **Zone.js** to detect changes automatically:

1. You click a button 🖱️
2. Zone.js says "Hey Angular, something happened!"
3. Angular checks ALL components for changes
4. Screen updates with new values

### Default vs OnPush Strategy

| Strategy | How It Works | Speed |
|----------|--------------|-------|
| **Default** | Checks EVERY component | Slower |
| **OnPush** | Only checks when @Input changes | Faster! 🚀 |

### Default Strategy (Automatic)

\`\`\`typescript
// Angular checks this component on EVERY change
// Easy but can be slow with many components
@Component({
  selector: 'app-counter'
})
export class CounterComponent {
  count = 0;
  
  increment() {
    this.count++;  // Angular automatically updates!
  }
}
\`\`\`

### OnPush Strategy (Performance)

\`\`\`typescript
// Angular only checks when @Input changes or events occur
// Like telling the teacher "only check me when I raise my hand!"
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user: User;
  
  // Only updates when 'user' input changes!
}
\`\`\`

### When Does Angular Check?

| Event | Triggers Check |
|-------|---------------|
| Button click | ✅ Yes |
| Input typing | ✅ Yes |
| HTTP response | ✅ Yes |
| setTimeout | ✅ Yes |
| Observable emit | ✅ Yes |

### Manual Change Detection

Sometimes you need to tell Angular "Hey, check now!":

\`\`\`typescript
constructor(private cdr: ChangeDetectorRef) {}

updateData() {
  this.data = newData;
  
  // Tell Angular to check NOW
  this.cdr.detectChanges();
  
  // Or mark for next cycle
  this.cdr.markForCheck();
}
\`\`\`

### Best Practices 🎯

1. **Use OnPush** for most components (faster!)
2. **Use immutable data** - create new objects instead of modifying
3. **Use async pipe** - handles subscriptions automatically
4. **Avoid complex getters** in templates

\`\`\`html
<!-- GOOD: Use async pipe -->
<div *ngFor="let item of items$ | async">
  {{ item.name }}
</div>

<!-- BAD: Complex getter runs on every check -->
<div>{{ getCalculatedValue() }}</div>
\`\`\`

### Think of It Like... 💭

**Default**: Teacher checks EVERYONE's homework every minute
**OnPush**: Teacher only checks when you raise your hand

For big apps, OnPush saves a LOT of time!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔍 Change Detection Demo</h2>
<div id="demo"></div>

<script>
let defaultChecks = 0;
let onPushChecks = 0;
let globalCounter = 0;
let users = [
  { id: 1, name: 'Alice', inputChanged: false },
  { id: 2, name: 'Bob', inputChanged: false },
  { id: 3, name: 'Charlie', inputChanged: false }
];

function simulateDefaultCD() {
  // Default checks ALL components
  globalCounter++;
  defaultChecks += users.length;  // All components checked!
  render();
}

function simulateOnPushCD(userId) {
  // OnPush only checks specific component
  globalCounter++;
  users.forEach(function(u) { u.inputChanged = u.id === userId; });
  onPushChecks += 1;  // Only ONE component checked!
  setTimeout(function() {
    users.forEach(function(u) { u.inputChanged = false; });
    render();
  }, 800);
  render();
}

function render() {
  let output = "";
  
  // Explanation
  output += "<div style='background:#fff3e0;padding:15px;border-radius:8px;margin-bottom:20px'>";
  output += "<p style='margin:0'>🔄 Global Counter: <b>" + globalCounter + "</b> changes detected</p>";
  output += "</div>";
  
  // Side by side comparison
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px'>";
  
  // Default strategy
  output += "<div style='background:#ffebee;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0;color:#c62828'>Default Strategy</h3>";
  output += "<p>Checks ALL components on every change</p>";
  output += "<button onclick='simulateDefaultCD()' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer;width:100%;margin-bottom:15px'>🔄 Trigger Change</button>";
  
  output += "<div style='display:flex;flex-direction:column;gap:10px'>";
  users.forEach(function(user) {
    output += "<div style='padding:10px;background:#fff;border-radius:6px;border:2px solid #f44336;animation:flash 0.3s'>";
    output += "📦 " + user.name + " <span style='color:#f44336'>✓ checked</span>";
    output += "</div>";
  });
  output += "</div>";
  
  output += "<div style='margin-top:15px;padding:10px;background:#ffcdd2;border-radius:6px'>";
  output += "Total checks: <b>" + defaultChecks + "</b>";
  output += "</div></div>";
  
  // OnPush strategy
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0;color:#2e7d32'>OnPush Strategy</h3>";
  output += "<p>Only checks when @Input changes</p>";
  output += "<div style='display:flex;gap:5px;flex-wrap:wrap;margin-bottom:15px'>";
  users.forEach(function(user) {
    output += "<button onclick='simulateOnPushCD(" + user.id + ")' style='padding:8px 12px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer;flex:1;min-width:60px'>Update " + user.name + "</button>";
  });
  output += "</div>";
  
  output += "<div style='display:flex;flex-direction:column;gap:10px'>";
  users.forEach(function(user) {
    let checked = user.inputChanged;
    let borderColor = checked ? "#4caf50" : "#ddd";
    let bg = checked ? "#c8e6c9" : "#fff";
    output += "<div style='padding:10px;background:" + bg + ";border-radius:6px;border:2px solid " + borderColor + ";transition:all 0.3s'>";
    output += "📦 " + user.name + " ";
    if (checked) {
      output += "<span style='color:#4caf50'>✓ checked</span>";
    } else {
      output += "<span style='color:#888'>— skipped</span>";
    }
    output += "</div>";
  });
  output += "</div>";
  
  output += "<div style='margin-top:15px;padding:10px;background:#c8e6c9;border-radius:6px'>";
  output += "Total checks: <b>" + onPushChecks + "</b>";
  output += "</div></div>";
  
  output += "</div>";
  
  // Summary
  output += "<div style='margin-top:20px;padding:20px;background:#e3f2fd;border-radius:8px;text-align:center'>";
  let savings = defaultChecks > 0 ? Math.round((1 - onPushChecks / defaultChecks) * 100) : 0;
  output += "<h3 style='margin:0'>🚀 OnPush saved ~" + savings + "% of checks!</h3>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'signals': {
      title: 'Angular Signals',
      content: `# Angular Signals ⚡

Think of Signals like **magic boxes that tell everyone when their contents change**!

### What Are Signals?

Signals are a NEW way in Angular to handle data that changes. They're like:
- A **mailbox** that notifies you when mail arrives 📬
- A **notification bell** that rings when something updates 🔔

### Why Signals? (The Problem They Solve)

**Before Signals (Old Way)**:
- Angular checks EVERYTHING for changes
- Like searching the whole house for your keys

**With Signals (New Way)**:
- Only updates what actually changed
- Like the keys telling you "I'm on the table!"

### Creating a Signal

\`\`\`typescript
import { signal, computed, effect } from '@angular/core';

// Create a signal (like a magic box!)
const count = signal(0);

// Read the value (open the box)
console.log(count());  // Output: 0

// Update the value (put something new in)
count.set(5);
console.log(count());  // Output: 5

// Update based on current value
count.update(value => value + 1);
console.log(count());  // Output: 6
\`\`\`

### Computed Signals (Auto-Calculate!)

\`\`\`typescript
// These update automatically when their sources change!
const price = signal(100);
const quantity = signal(2);

// This AUTOMATICALLY updates when price or quantity changes!
const total = computed(() => price() * quantity());

console.log(total());  // Output: 200

price.set(150);
console.log(total());  // Output: 300 (auto-updated!)
\`\`\`

It's like a calculator that recalculates automatically! 🧮

### Effects (React to Changes)

\`\`\`typescript
// Do something whenever a signal changes
effect(() => {
  console.log(\`The count is now: \\\${count()}\`);
  // This runs every time count changes!
});

count.set(10);  // Console: "The count is now: 10"
count.set(20);  // Console: "The count is now: 20"
\`\`\`

Like a robot that does something whenever the mailbox gets mail!

### Using Signals in Components

\`\`\`typescript
@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Double: {{ doubleCount() }}</p>
    <button (click)="increment()">+1</button>
  \`
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(n => n + 1);
  }
}
\`\`\`

### Signal Methods

| Method | What It Does | Example |
|--------|--------------|---------|
| \`signal()\` | Create a signal | \`signal(0)\` |
| \`.set()\` | Replace value | \`count.set(10)\` |
| \`.update()\` | Update based on current | \`count.update(n => n+1)\` |
| \`computed()\` | Auto-calculate | \`computed(() => a() + b())\` |
| \`effect()\` | React to changes | \`effect(() => log(count()))\` |

### Signals vs Observables

| Signals | Observables |
|---------|-------------|
| Simpler syntax | More powerful features |
| Synchronous | Async by default |
| Get value with \`()\` | Subscribe to get values |
| Perfect for UI state | Perfect for streams |

### Remember! 🎯

1. Call signals like functions: \`count()\` not \`count\`
2. Use \`set()\` for new values, \`update()\` for transforms
3. \`computed()\` auto-updates when sources change
4. Signals make Angular FASTER and code SIMPLER!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>⚡ Angular Signals Demo</h2>
<div id="demo"></div>

<script>
// Simulate Angular Signals
function createSignal(initialValue) {
  let value = initialValue;
  let subscribers = [];
  
  function signal() {
    return value;
  }
  
  signal.set = function(newValue) {
    value = newValue;
    subscribers.forEach(fn => fn());
  };
  
  signal.update = function(fn) {
    value = fn(value);
    subscribers.forEach(fn => fn());
  };
  
  signal.subscribe = function(fn) {
    subscribers.push(fn);
  };
  
  return signal;
}

function createComputed(fn, deps) {
  let cachedValue = fn();
  
  function computed() {
    return cachedValue;
  }
  
  deps.forEach(function(dep) {
    dep.subscribe(function() {
      cachedValue = fn();
    });
  });
  
  return computed;
}

// Create signals
let count = createSignal(0);
let multiplier = createSignal(2);
let logs = [];

// Computed signals
function getDouble() {
  return count() * multiplier();
}

function getSquare() {
  return count() * count();
}

// Effect
function logChange(action) {
  logs.unshift({
    time: new Date().toLocaleTimeString(),
    action: action,
    count: count(),
    double: count() * multiplier()
  });
  if (logs.length > 5) logs.pop();
}

function increment() {
  count.update(n => n + 1);
  logChange('Increment (+1)');
  render();
}

function decrement() {
  count.update(n => n - 1);
  logChange('Decrement (-1)');
  render();
}

function setTo(value) {
  count.set(value);
  logChange('Set to ' + value);
  render();
}

function changeMultiplier(value) {
  multiplier.set(value);
  logChange('Multiplier → ' + value);
  render();
}

function render() {
  let output = "";
  
  // Signal visualization
  output += "<div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:15px;margin-bottom:20px'>";
  
  // Count signal
  output += "<div style='background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:20px;border-radius:12px;text-align:center'>";
  output += "<div style='font-size:12px;opacity:0.8'>signal</div>";
  output += "<div style='font-size:36px;font-weight:bold'>" + count() + "</div>";
  output += "<div>count()</div>";
  output += "</div>";
  
  // Multiplier signal
  output += "<div style='background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:white;padding:20px;border-radius:12px;text-align:center'>";
  output += "<div style='font-size:12px;opacity:0.8'>signal</div>";
  output += "<div style='font-size:36px;font-weight:bold'>×" + multiplier() + "</div>";
  output += "<div>multiplier()</div>";
  output += "</div>";
  
  // Computed: double
  output += "<div style='background:linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);color:white;padding:20px;border-radius:12px;text-align:center'>";
  output += "<div style='font-size:12px;opacity:0.8'>computed</div>";
  output += "<div style='font-size:36px;font-weight:bold'>" + getDouble() + "</div>";
  output += "<div>count × multiplier</div>";
  output += "</div>";
  
  // Computed: square
  output += "<div style='background:linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);color:white;padding:20px;border-radius:12px;text-align:center'>";
  output += "<div style='font-size:12px;opacity:0.8'>computed</div>";
  output += "<div style='font-size:36px;font-weight:bold'>" + getSquare() + "</div>";
  output += "<div>count²</div>";
  output += "</div>";
  
  output += "</div>";
  
  // Controls
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>🎮 Signal Methods</h4>";
  
  output += "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:15px'>";
  output += "<button onclick='decrement()' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer;font-size:18px'>−</button>";
  output += "<button onclick='increment()' style='padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer;font-size:18px'>+</button>";
  output += "<span style='padding:10px;color:#888'>|</span>";
  output += "<button onclick='setTo(0)' style='padding:10px 15px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>set(0)</button>";
  output += "<button onclick='setTo(10)' style='padding:10px 15px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>set(10)</button>";
  output += "<button onclick='setTo(100)' style='padding:10px 15px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>set(100)</button>";
  output += "</div>";
  
  output += "<div style='display:flex;gap:10px;align-items:center'>";
  output += "<span>Multiplier:</span>";
  [1, 2, 5, 10].forEach(function(m) {
    let active = multiplier() === m;
    output += "<button onclick='changeMultiplier(" + m + ")' style='padding:8px 16px;background:" + (active ? '#9c27b0' : '#e0e0e0') + ";color:" + (active ? 'white' : 'black') + ";border:none;border-radius:6px;cursor:pointer'>×" + m + "</button>";
  });
  output += "</div>";
  output += "</div>";
  
  // Effect logs
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace'>";
  output += "<h4 style='margin-top:0;color:#4ec9b0'>📋 effect() logs</h4>";
  if (logs.length === 0) {
    output += "<p style='color:#888'>Click buttons to see effects...</p>";
  } else {
    logs.forEach(function(log) {
      output += "<div style='padding:8px;margin:5px 0;background:#2d2d2d;border-radius:4px;font-size:12px'>";
      output += "<span style='color:#888'>" + log.time + "</span> ";
      output += "<span style='color:#dcdcaa'>" + log.action + "</span> → ";
      output += "<span style='color:#ce9178'>count=" + log.count + ", computed=" + log.double + "</span>";
      output += "</div>";
    });
  }
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 9 — Dynamic Components, Advanced DI, State Management
    'dynamic-components': {
      title: 'Dynamic Components',
      content: `# Dynamic Components 🎭

Think of dynamic components like a **magic TV** that can show different channels based on what you want to watch!

### What Are Dynamic Components?

Normally, you write components in your template:
\`\`\`html
<app-user-profile></app-user-profile>
\`\`\`

But sometimes you don't know WHICH component to show until the app is running!

**Examples**:
- Show different widgets on a dashboard
- Load plugins from external sources
- Display different forms based on user role

### Creating Components Dynamically

\`\`\`typescript
@Component({
  template: \`
    <div #container></div>
    <button (click)="loadComponent('chart')">Show Chart</button>
    <button (click)="loadComponent('table')">Show Table</button>
  \`
})
export class DashboardComponent {
  @ViewChild('container', { read: ViewContainerRef }) 
  container!: ViewContainerRef;
  
  async loadComponent(type: string) {
    // Clear existing component
    this.container.clear();
    
    // Pick the right component
    let component;
    if (type === 'chart') {
      const { ChartComponent } = await import('./chart.component');
      component = ChartComponent;
    } else {
      const { TableComponent } = await import('./table.component');
      component = TableComponent;
    }
    
    // Create and insert it!
    this.container.createComponent(component);
  }
}
\`\`\`

### Passing Data to Dynamic Components

\`\`\`typescript
loadWidget(type: string, data: any) {
  const componentRef = this.container.createComponent(WidgetComponent);
  
  // Set input properties
  componentRef.instance.title = 'My Widget';
  componentRef.instance.data = data;
  
  // Listen to outputs
  componentRef.instance.onClick.subscribe(event => {
    console.log('Widget clicked!', event);
  });
}
\`\`\`

### NgComponentOutlet (Template Way)

\`\`\`typescript
// In your component
currentComponent = ChartComponent;

// In template - simpler!
<ng-container *ngComponentOutlet="currentComponent"></ng-container>

// Change what's displayed
switchToTable() {
  this.currentComponent = TableComponent;
}
\`\`\`

### Real-World Uses 🌍

| Use Case | Example |
|----------|---------|
| **Dashboard** | User picks which widgets to show |
| **Forms** | Different form based on product type |
| **Plugins** | Third-party features loaded at runtime |
| **Wizards** | Different steps loaded dynamically |
| **Modals** | Various dialog types from one service |

### Remember! 🎯

1. Use \`ViewContainerRef\` to host dynamic components
2. Use \`createComponent()\` to create them
3. Access inputs via \`componentRef.instance\`
4. Clean up with \`container.clear()\`
5. Consider lazy loading for performance
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎭 Dynamic Components Demo</h2>
<div id="demo"></div>

<script>
// Simulate different components
let widgets = {
  chart: {
    name: 'Chart Widget',
    icon: '📊',
    render: function(data) {
      let output = "<div style='background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:20px;border-radius:12px'>";
      output += "<h3 style='margin-top:0'>📊 " + data.title + "</h3>";
      output += "<div style='display:flex;align-items:flex-end;gap:10px;height:100px'>";
      data.values.forEach(function(val, i) {
        let height = (val / Math.max(...data.values)) * 80;
        output += "<div style='width:40px;background:rgba(255,255,255,0.3);border-radius:4px 4px 0 0;height:" + height + "px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:5px'>" + val + "</div>";
      });
      output += "</div></div>";
      return output;
    }
  },
  table: {
    name: 'Table Widget',
    icon: '📋',
    render: function(data) {
      let output = "<div style='background:white;border:1px solid #ddd;border-radius:12px;overflow:hidden'>";
      output += "<div style='background:#f5f5f5;padding:15px;font-weight:bold'>📋 " + data.title + "</div>";
      output += "<table style='width:100%;border-collapse:collapse'>";
      data.rows.forEach(function(row, i) {
        let bg = i % 2 === 0 ? '#fff' : '#f9f9f9';
        output += "<tr style='background:" + bg + "'>";
        row.forEach(function(cell) {
          output += "<td style='padding:12px;border-bottom:1px solid #eee'>" + cell + "</td>";
        });
        output += "</tr>";
      });
      output += "</table></div>";
      return output;
    }
  },
  card: {
    name: 'Card Widget',
    icon: '🎴',
    render: function(data) {
      let output = "<div style='background:linear-gradient(135deg, #f093fb 0%, #f5576c 100%);color:white;padding:20px;border-radius:12px;text-align:center'>";
      output += "<h3 style='margin-top:0'>🎴 " + data.title + "</h3>";
      output += "<div style='font-size:48px;font-weight:bold;margin:20px 0'>" + data.value + "</div>";
      output += "<div style='opacity:0.8'>" + data.subtitle + "</div>";
      output += "</div>";
      return output;
    }
  }
};

let currentWidget = null;
let widgetData = {
  chart: { title: 'Sales Data', values: [30, 45, 60, 35, 80, 55] },
  table: { title: 'Users', rows: [['Alice', 'Admin'], ['Bob', 'User'], ['Charlie', 'Editor']] },
  card: { title: 'Revenue', value: '$45,230', subtitle: '+12% from last month' }
};

function loadWidget(type) {
  currentWidget = type;
  render();
}

function clearWidget() {
  currentWidget = null;
  render();
}

function render() {
  let output = "";
  
  // Controls
  output += "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px'>";
  Object.keys(widgets).forEach(function(type) {
    let w = widgets[type];
    let active = currentWidget === type;
    output += "<button onclick='loadWidget(\"" + type + "\")' style='padding:12px 20px;background:" + (active ? '#DD0031' : '#e0e0e0') + ";color:" + (active ? 'white' : 'black') + ";border:none;border-radius:8px;cursor:pointer;font-size:14px'>" + w.icon + " Load " + w.name + "</button>";
  });
  output += "<button onclick='clearWidget()' style='padding:12px 20px;background:#f5f5f5;color:#666;border:1px solid #ddd;border-radius:8px;cursor:pointer'>🧹 Clear</button>";
  output += "</div>";
  
  // Code preview
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;margin-bottom:20px'>";
  if (currentWidget) {
    output += "<span style='color:#c586c0'>const</span> ref = container.<span style='color:#dcdcaa'>createComponent</span>(<span style='color:#4ec9b0'>" + widgets[currentWidget].name.replace(' ', '') + "</span>);<br>";
    output += "ref.instance.data = <span style='color:#ce9178'>" + JSON.stringify(widgetData[currentWidget]).substring(0, 50) + "...</span>;";
  } else {
    output += "container.<span style='color:#dcdcaa'>clear</span>();  <span style='color:#6a9955'>// No component loaded</span>";
  }
  output += "</div>";
  
  // Container
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:12px;min-height:200px;border:2px dashed #ccc'>";
  output += "<div style='color:#888;font-size:12px;margin-bottom:15px'>📦 #container (ViewContainerRef)</div>";
  
  if (currentWidget && widgets[currentWidget]) {
    output += widgets[currentWidget].render(widgetData[currentWidget]);
  } else {
    output += "<div style='text-align:center;color:#aaa;padding:40px'>";
    output += "<div style='font-size:48px'>🎭</div>";
    output += "<p>Click a button to dynamically load a component!</p>";
    output += "</div>";
  }
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'advanced-di': {
      title: 'Advanced DI',
      content: `# Advanced Dependency Injection 💉

Think of DI like a **restaurant where you order food** - you don't cook it yourself, the kitchen (Angular) brings it to you!

### Quick Recap: What is DI?

\`\`\`typescript
// You "order" a service, Angular delivers it
constructor(private userService: UserService) {
  // UserService is automatically created and given to you!
}
\`\`\`

### Injection Tokens (Custom Orders)

Sometimes you need to inject things that aren't classes:

\`\`\`typescript
// Create a token (like a menu item number)
export const API_URL = new InjectionToken<string>('API_URL');

// Provide a value for it
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' }
]

// Inject it
constructor(@Inject(API_URL) private apiUrl: string) {
  console.log(this.apiUrl);  // 'https://api.example.com'
}
\`\`\`

### Provider Types

| Type | Use When | Example |
|------|----------|---------|
| **useClass** | Want a class instance | \`{ provide: Logger, useClass: FileLogger }\` |
| **useValue** | Have a ready value | \`{ provide: API_URL, useValue: 'http://...' }\` |
| **useFactory** | Need logic to create | \`{ provide: Config, useFactory: () => {...} }\` |
| **useExisting** | Alias for another | \`{ provide: OldService, useExisting: NewService }\` |

### Provider Scope (Where Things Live)

\`\`\`typescript
// 1. ROOT - One for the whole app
@Injectable({ providedIn: 'root' })  // Most common!

// 2. COMPONENT - New one for each component
@Component({
  providers: [CartService]  // Each component gets its own!
})

// 3. MODULE - One per lazy-loaded module
@Injectable({ providedIn: MyFeatureModule })
\`\`\`

### Multi Providers (Multiple Values)

\`\`\`typescript
// Add multiple validators!
providers: [
  { provide: VALIDATORS, useClass: EmailValidator, multi: true },
  { provide: VALIDATORS, useClass: PhoneValidator, multi: true },
  { provide: VALIDATORS, useClass: AgeValidator, multi: true }
]

// Get all of them
constructor(@Inject(VALIDATORS) private validators: Validator[]) {
  // validators is an ARRAY with all three!
}
\`\`\`

### Optional Dependencies

\`\`\`typescript
constructor(
  @Optional() private analytics?: AnalyticsService
) {
  // If AnalyticsService isn't provided, it's undefined
  // App won't crash!
  if (this.analytics) {
    this.analytics.track('page_view');
  }
}
\`\`\`

### Self vs SkipSelf

\`\`\`typescript
// SELF: Only look at MY providers
@Self() private service: MyService

// SKIP_SELF: Look at parent, not me
@SkipSelf() private service: MyService
\`\`\`

### Remember! 🎯

1. Use \`providedIn: 'root'\` for shared services
2. Use component providers for isolated state
3. Use InjectionToken for non-class values
4. Multi providers allow plugins/extensions
5. \`@Optional()\` prevents crashes
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>💉 Advanced DI Demo</h2>
<div id="demo"></div>

<script>
// Simulate Angular's DI System

// Token registry
let providers = {};
let instances = {};

// Injection Token simulation
function InjectionToken(name) {
  return { name: name, id: Math.random().toString(36) };
}

// Create some tokens
let API_URL = InjectionToken('API_URL');
let VALIDATORS = InjectionToken('VALIDATORS');

// Provider functions
function provide(token, config) {
  let key = typeof token === 'string' ? token : token.id;
  
  if (config.multi) {
    if (!providers[key]) providers[key] = [];
    providers[key].push(config);
  } else {
    providers[key] = config;
  }
}

function inject(token) {
  let key = typeof token === 'string' ? token : token.id;
  let config = providers[key];
  
  if (!config) return null;
  
  if (Array.isArray(config)) {
    // Multi provider
    return config.map(function(c) {
      if (c.useClass) return new c.useClass();
      if (c.useValue) return c.useValue;
      if (c.useFactory) return c.useFactory();
      return null;
    });
  }
  
  if (config.useClass) {
    if (!instances[key]) instances[key] = new config.useClass();
    return instances[key];
  }
  if (config.useValue) return config.useValue;
  if (config.useFactory) return config.useFactory();
  
  return null;
}

// Setup providers
provide(API_URL, { useValue: 'https://api.vertechie.com' });

provide(VALIDATORS, { 
  useValue: { name: 'EmailValidator', validate: (v) => v.includes('@') }, 
  multi: true 
});
provide(VALIDATORS, { 
  useValue: { name: 'LengthValidator', validate: (v) => v.length >= 3 }, 
  multi: true 
});
provide(VALIDATORS, { 
  useValue: { name: 'NoSpaceValidator', validate: (v) => !v.includes(' ') }, 
  multi: true 
});

function UserService() {
  this.name = 'UserService';
  this.getUser = function() { return { name: 'Alice', role: 'Admin' }; };
}

provide('UserService', { useClass: UserService });

provide('Config', { 
  useFactory: function() {
    return { 
      version: '1.0.0', 
      env: 'development',
      timestamp: new Date().toLocaleTimeString()
    };
  }
});

function render() {
  let output = "";
  
  // API_URL (useValue)
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>📌 useValue - API_URL Token</h4>";
  output += "<code>{ provide: API_URL, useValue: '...' }</code>";
  output += "<div style='margin-top:10px;padding:10px;background:#fff;border-radius:6px'>";
  output += "<b>Injected value:</b> " + inject(API_URL);
  output += "</div></div>";
  
  // UserService (useClass)
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>🏭 useClass - UserService</h4>";
  output += "<code>{ provide: 'UserService', useClass: UserService }</code>";
  let userService = inject('UserService');
  let user = userService.getUser();
  output += "<div style='margin-top:10px;padding:10px;background:#fff;border-radius:6px'>";
  output += "<b>Service:</b> " + userService.name + "<br>";
  output += "<b>getUser():</b> " + JSON.stringify(user);
  output += "</div></div>";
  
  // Config (useFactory)
  output += "<div style='background:#fff3e0;padding:20px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>⚙️ useFactory - Config</h4>";
  output += "<code>{ provide: 'Config', useFactory: () => {...} }</code>";
  let config = inject('Config');
  output += "<div style='margin-top:10px;padding:10px;background:#fff;border-radius:6px'>";
  output += "<b>Created at runtime:</b><br>";
  output += JSON.stringify(config, null, 2).replace(/\\n/g, '<br>').replace(/ /g, '&nbsp;');
  output += "</div></div>";
  
  // Multi providers
  output += "<div style='background:#fce4ec;padding:20px;border-radius:8px;margin-bottom:15px'>";
  output += "<h4 style='margin-top:0'>📚 multi: true - VALIDATORS</h4>";
  output += "<code>{ provide: VALIDATORS, useValue: {...}, multi: true }</code>";
  let validators = inject(VALIDATORS);
  output += "<div style='margin-top:10px'>";
  output += "<p><b>All validators injected as array:</b></p>";
  validators.forEach(function(v, i) {
    output += "<div style='padding:10px;background:#fff;border-radius:6px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center'>";
    output += "<span>" + (i+1) + ". " + v.name + "</span>";
    let testVal = 'test@email.com';
    let result = v.validate(testVal);
    output += "<span style='color:" + (result ? 'green' : 'red') + "'>" + (result ? '✅' : '❌') + " '" + testVal + "'</span>";
    output += "</div>";
  });
  output += "</div></div>";
  
  // Provider types summary
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0'>📋 Provider Types Summary</h4>";
  output += "<table style='width:100%;border-collapse:collapse'>";
  output += "<tr style='background:#DD0031;color:white'><th style='padding:10px;text-align:left'>Type</th><th>When to Use</th></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'><b>useClass</b></td><td>Create a class instance</td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'><b>useValue</b></td><td>Provide a ready value</td></tr>";
  output += "<tr><td style='padding:10px;border-bottom:1px solid #ddd'><b>useFactory</b></td><td>Need logic to create</td></tr>";
  output += "<tr><td style='padding:10px'><b>useExisting</b></td><td>Alias for another provider</td></tr>";
  output += "</table></div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'state-management': {
      title: 'State Management',
      content: `# State Management 🗄️

Think of state management like a **central library** where everyone goes to borrow and return books (data)!

### What is State?

**State** = The data your app remembers

Examples:
- Is the user logged in? (yes/no)
- Items in shopping cart (array)
- Current page (string)
- Form data (object)

### The Problem: State Spaghetti 🍝

Without proper management:
- Component A changes data
- Component B doesn't know
- Component C shows old data
- Bugs everywhere!

### Solution 1: Service-Based State (Simple)

\`\`\`typescript
// A central place for state
@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSubject.asObservable();
  
  addItem(item: Item) {
    const current = this.itemsSubject.value;
    this.itemsSubject.next([...current, item]);
  }
  
  removeItem(id: number) {
    const current = this.itemsSubject.value;
    this.itemsSubject.next(current.filter(i => i.id !== id));
  }
  
  getTotal() {
    return this.itemsSubject.value.reduce((sum, i) => sum + i.price, 0);
  }
}
\`\`\`

### Solution 2: Signal-Based State (Modern)

\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class CartStore {
  // State as signals
  items = signal<Item[]>([]);
  
  // Computed values
  itemCount = computed(() => this.items().length);
  total = computed(() => 
    this.items().reduce((sum, i) => sum + i.price, 0)
  );
  
  addItem(item: Item) {
    this.items.update(items => [...items, item]);
  }
  
  removeItem(id: number) {
    this.items.update(items => items.filter(i => i.id !== id));
  }
}
\`\`\`

### Solution 3: NgRx (Enterprise Scale)

NgRx is like having a **formal library system** with rules:

| Concept | What It Does | Example |
|---------|--------------|---------|
| **Store** | Central state container | The library |
| **Actions** | Events that happen | "Borrow book", "Return book" |
| **Reducers** | How state changes | Book goes out → count decreases |
| **Selectors** | Get specific data | "Show me all sci-fi books" |
| **Effects** | Side effects | Notify librarian when borrowed |

### When to Use What?

| Approach | When to Use |
|----------|-------------|
| **Component state** | Data used only in one component |
| **Service state** | Shared between a few components |
| **Signals** | Modern Angular, simpler than RxJS |
| **NgRx** | Large apps, complex flows, team projects |

### Best Practices 🎯

1. **Keep state minimal** - Only store what you need
2. **Immutable updates** - Create new objects, don't modify
3. **Single source of truth** - One place for each piece of state
4. **Derive, don't duplicate** - Use computed values
5. **Centralize wisely** - Not everything needs global state
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🗄️ State Management Demo</h2>
<div id="demo"></div>

<script>
// Simulate different state management approaches

// ========== SERVICE-BASED STATE ==========
let cartState = {
  items: [],
  subscribers: []
};

function subscribeToCart(callback) {
  cartState.subscribers.push(callback);
}

function notifySubscribers() {
  cartState.subscribers.forEach(fn => fn(cartState.items));
}

function addToCart(item) {
  cartState.items = [...cartState.items, { ...item, id: Date.now() }];
  logAction('ADD_ITEM', item.name);
  notifySubscribers();
}

function removeFromCart(id) {
  let item = cartState.items.find(i => i.id === id);
  cartState.items = cartState.items.filter(i => i.id !== id);
  logAction('REMOVE_ITEM', item?.name);
  notifySubscribers();
}

function getTotal() {
  return cartState.items.reduce((sum, item) => sum + item.price, 0);
}

// ========== ACTION LOGGING (NgRx style) ==========
let actionLog = [];

function logAction(type, payload) {
  actionLog.unshift({
    time: new Date().toLocaleTimeString(),
    type: type,
    payload: payload
  });
  if (actionLog.length > 8) actionLog.pop();
}

// ========== SAMPLE PRODUCTS ==========
let products = [
  { name: 'Apple', price: 1.50, emoji: '🍎' },
  { name: 'Banana', price: 0.75, emoji: '🍌' },
  { name: 'Orange', price: 2.00, emoji: '🍊' },
  { name: 'Pizza', price: 12.99, emoji: '🍕' }
];

function render() {
  let output = "";
  
  // Products section
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px'>";
  
  // Left: Products
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0'>🛒 Products</h3>";
  output += "<div style='display:grid;gap:10px'>";
  products.forEach(function(product) {
    output += "<div style='background:white;padding:15px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.1)'>";
    output += "<span style='font-size:24px'>" + product.emoji + "</span>";
    output += "<span><b>" + product.name + "</b><br><small>$" + product.price.toFixed(2) + "</small></span>";
    output += "<button onclick='addToCart(" + JSON.stringify(product).replace(/'/g, "\\'") + ")' style='padding:8px 16px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>Add</button>";
    output += "</div>";
  });
  output += "</div></div>";
  
  // Right: Cart (State)
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0'>📦 Cart State</h3>";
  
  if (cartState.items.length === 0) {
    output += "<p style='color:#888;text-align:center;padding:20px'>Cart is empty</p>";
  } else {
    output += "<div style='display:grid;gap:8px;margin-bottom:15px'>";
    cartState.items.forEach(function(item) {
      output += "<div style='background:white;padding:10px;border-radius:6px;display:flex;justify-content:space-between;align-items:center'>";
      output += "<span>" + item.emoji + " " + item.name + " - $" + item.price.toFixed(2) + "</span>";
      output += "<button onclick='removeFromCart(" + item.id + ")' style='padding:4px 10px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>×</button>";
      output += "</div>";
    });
    output += "</div>";
    
    output += "<div style='padding:15px;background:#c8e6c9;border-radius:8px;text-align:right'>";
    output += "<b>Total: $" + getTotal().toFixed(2) + "</b>";
    output += "</div>";
  }
  output += "</div>";
  
  output += "</div>";
  
  // State visualization
  output += "<div style='margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px'>";
  
  // Current state
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:12px'>";
  output += "<h4 style='margin-top:0;color:#4ec9b0'>📊 Current State</h4>";
  output += "<pre style='margin:0;overflow:auto'>" + JSON.stringify({
    items: cartState.items.map(i => ({ name: i.name, price: i.price })),
    itemCount: cartState.items.length,
    total: getTotal()
  }, null, 2) + "</pre>";
  output += "</div>";
  
  // Action log
  output += "<div style='background:#2d2d2d;color:#dcdcaa;padding:15px;border-radius:8px;font-family:monospace;font-size:12px'>";
  output += "<h4 style='margin-top:0;color:#ce9178'>📋 Action Log (NgRx Style)</h4>";
  if (actionLog.length === 0) {
    output += "<p style='color:#888'>No actions yet...</p>";
  } else {
    actionLog.forEach(function(action) {
      let color = action.type.includes('ADD') ? '#4caf50' : '#f44336';
      output += "<div style='padding:6px;margin:4px 0;background:#383838;border-radius:4px'>";
      output += "<span style='color:#888'>" + action.time + "</span> ";
      output += "<span style='color:" + color + "'>" + action.type + "</span>";
      output += " <span style='color:#9cdcfe'>" + action.payload + "</span>";
      output += "</div>";
    });
  }
  output += "</div>";
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

subscribeToCart(render);
render();
</script>

</body>
</html>`,
    },

    // PHASE 11 — Animations
    'animations': {
      title: 'Angular Animations',
      content: `# Angular Animations 🎬

Think of animations like **adding magic to your app** - things slide, fade, and bounce instead of just appearing!

### Why Animations Matter

Without animations:
> Button appears suddenly → User confused 😕

With animations:
> Button slides in smoothly → User delighted! 🎉

### Setting Up Animations

\`\`\`typescript
// 1. Import in your component
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('300ms ease-in')),
      transition('* => void', animate('300ms ease-out'))
    ])
  ]
})
\`\`\`

### Animation Building Blocks

| Concept | What It Does | Example |
|---------|--------------|---------|
| **trigger** | Names the animation | \`trigger('fadeIn', [...])\` |
| **state** | How element looks | \`state('open', style({...}))\` |
| **style** | CSS properties | \`style({ opacity: 1 })\` |
| **transition** | When to animate | \`transition('closed => open')\` |
| **animate** | How long/easing | \`animate('300ms ease-in')\` |

### Simple Fade Animation

\`\`\`typescript
trigger('fade', [
  transition(':enter', [  // When element appears
    style({ opacity: 0 }),
    animate('300ms', style({ opacity: 1 }))
  ]),
  transition(':leave', [  // When element disappears
    animate('300ms', style({ opacity: 0 }))
  ])
])
\`\`\`

### Using in Template

\`\`\`html
<div [@fade]="isVisible">
  This fades in and out!
</div>

<button [@bounce]="'active'">
  I bounce when clicked!
</button>
\`\`\`

### Common Animation Patterns

**Slide In**
\`\`\`typescript
transition(':enter', [
  style({ transform: 'translateX(-100%)' }),
  animate('300ms ease-out', style({ transform: 'translateX(0)' }))
])
\`\`\`

**Scale Up**
\`\`\`typescript
transition(':enter', [
  style({ transform: 'scale(0)' }),
  animate('200ms', style({ transform: 'scale(1)' }))
])
\`\`\`

### Performance Tips 🚀

1. Animate **transform** and **opacity** (GPU accelerated)
2. Avoid animating **width**, **height**, **top**, **left**
3. Use \`will-change\` for complex animations
4. Keep animations short (200-500ms)
`,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes scaleUp { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
.animate-fade { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide { animation: slideIn 0.5s ease-out forwards; }
.animate-scale { animation: scaleUp 0.3s ease-out forwards; }
.animate-bounce { animation: bounce 0.5s ease-in-out; }
</style>
</head>
<body>

<h2>🎬 Angular Animations Demo</h2>
<div id="demo"></div>

<script>
let items = [];
let nextId = 1;

function addItem(animationType) {
  items.push({ id: nextId++, animation: animationType, time: Date.now() });
  render();
}

function removeItem(id) {
  items = items.filter(i => i.id !== id);
  render();
}

function clearAll() {
  items = [];
  render();
}

function render() {
  let output = "";
  
  // Controls
  output += "<div style='display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px'>";
  output += "<button onclick='addItem(\"fade\")' style='padding:10px 20px;background:#9c27b0;color:white;border:none;border-radius:6px;cursor:pointer'>✨ Fade In</button>";
  output += "<button onclick='addItem(\"slide\")' style='padding:10px 20px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>➡️ Slide In</button>";
  output += "<button onclick='addItem(\"scale\")' style='padding:10px 20px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>🔍 Scale Up</button>";
  output += "<button onclick='addItem(\"bounce\")' style='padding:10px 20px;background:#ff9800;color:white;border:none;border-radius:6px;cursor:pointer'>🏀 Bounce</button>";
  output += "<button onclick='clearAll()' style='padding:10px 20px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer'>🗑️ Clear</button>";
  output += "</div>";
  
  // Animation showcase
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;min-height:200px'>";
  output += "<h4 style='margin-top:0'>Animation Playground</h4>";
  output += "<div style='display:flex;flex-wrap:wrap;gap:10px'>";
  
  items.forEach(function(item) {
    let bg = {fade:'#9c27b0',slide:'#2196f3',scale:'#4caf50',bounce:'#ff9800'}[item.animation];
    let animClass = 'animate-' + item.animation;
    output += "<div class='" + animClass + "' key='" + item.id + "' style='padding:15px 20px;background:" + bg + ";color:white;border-radius:8px;display:flex;align-items:center;gap:10px'>";
    output += "<span>" + item.animation.toUpperCase() + " #" + item.id + "</span>";
    output += "<button onclick='removeItem(" + item.id + ")' style='padding:4px 8px;background:rgba(255,255,255,0.3);color:white;border:none;border-radius:4px;cursor:pointer'>×</button>";
    output += "</div>";
  });
  
  if (items.length === 0) {
    output += "<p style='color:#888'>Click buttons above to add animated elements!</p>";
  }
  
  output += "</div></div>";
  
  // Code example
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;margin-top:20px'>";
  output += "<span style='color:#c586c0'>trigger</span>(<span style='color:#ce9178'>'fadeIn'</span>, [<br>";
  output += "  <span style='color:#c586c0'>transition</span>(<span style='color:#ce9178'>':enter'</span>, [<br>";
  output += "    <span style='color:#dcdcaa'>style</span>({ opacity: <span style='color:#b5cea8'>0</span> }),<br>";
  output += "    <span style='color:#dcdcaa'>animate</span>(<span style='color:#ce9178'>'300ms'</span>, <span style='color:#dcdcaa'>style</span>({ opacity: <span style='color:#b5cea8'>1</span> }))<br>";
  output += "  ])<br>";
  output += "])";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'testing': {
      title: 'Angular Testing',
      content: `# Angular Testing 🧪

Think of testing like **checking your homework before turning it in** - you catch mistakes before the teacher (users) sees them!

### Why Test?

- Find bugs BEFORE users do
- Make changes confidently
- Document how code should work
- Sleep better at night! 😴

### Types of Tests

| Type | What It Tests | Speed |
|------|---------------|-------|
| **Unit** | One function/component | ⚡ Fast |
| **Integration** | Components together | 🚶 Medium |
| **E2E** | Whole app flow | 🐢 Slow |

### Unit Testing a Component

\`\`\`typescript
describe('CounterComponent', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should start at 0', () => {
    expect(component.count).toBe(0);
  });
  
  it('should increment when button clicked', () => {
    component.increment();
    expect(component.count).toBe(1);
  });
});
\`\`\`

### Testing Services

\`\`\`typescript
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'Alice' }];
    
    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });
    
    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);
  });
});
\`\`\`

### Testing Template

\`\`\`typescript
it('should display user name', () => {
  component.user = { name: 'Alice' };
  fixture.detectChanges();
  
  const element = fixture.nativeElement.querySelector('.user-name');
  expect(element.textContent).toContain('Alice');
});
\`\`\`

### Mocking Dependencies

\`\`\`typescript
const mockUserService = {
  getUser: jasmine.createSpy().and.returnValue(of({ name: 'Alice' }))
};

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      { provide: UserService, useValue: mockUserService }
    ]
  });
});
\`\`\`

### Testing Best Practices 🎯

1. Test behavior, not implementation
2. Use descriptive test names
3. Keep tests independent
4. Mock external dependencies
5. Aim for meaningful coverage (not 100%)
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🧪 Angular Testing Demo</h2>
<div id="demo"></div>

<script>
let testResults = [];
let testsPassed = 0;
let testsFailed = 0;

// Simple test framework
function describe(name, fn) {
  testResults.push({ type: 'suite', name: name });
  fn();
}

function it(name, fn) {
  try {
    fn();
    testResults.push({ type: 'test', name: name, passed: true });
    testsPassed++;
  } catch(e) {
    testResults.push({ type: 'test', name: name, passed: false, error: e.message });
    testsFailed++;
  }
}

function expect(actual) {
  return {
    toBe: function(expected) {
      if (actual !== expected) {
        throw new Error('Expected ' + expected + ' but got ' + actual);
      }
    },
    toEqual: function(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error('Expected ' + JSON.stringify(expected) + ' but got ' + JSON.stringify(actual));
      }
    },
    toContain: function(expected) {
      if (!actual.includes(expected)) {
        throw new Error('Expected "' + actual + '" to contain "' + expected + '"');
      }
    }
  };
}

// Sample component to test
class CounterComponent {
  constructor() {
    this.count = 0;
  }
  increment() { this.count++; }
  decrement() { this.count--; }
  reset() { this.count = 0; }
}

function runTests() {
  testResults = [];
  testsPassed = 0;
  testsFailed = 0;
  
  describe('CounterComponent', function() {
    let component = new CounterComponent();
    
    it('should start at 0', function() {
      expect(component.count).toBe(0);
    });
    
    it('should increment when increment() called', function() {
      component.increment();
      expect(component.count).toBe(1);
    });
    
    it('should decrement when decrement() called', function() {
      component.decrement();
      expect(component.count).toBe(0);
    });
    
    it('should reset to 0 when reset() called', function() {
      component.increment();
      component.increment();
      component.reset();
      expect(component.count).toBe(0);
    });
  });
  
  describe('Array Methods', function() {
    it('should filter correctly', function() {
      let nums = [1, 2, 3, 4, 5];
      let evens = nums.filter(n => n % 2 === 0);
      expect(evens).toEqual([2, 4]);
    });
    
    it('should map correctly', function() {
      let nums = [1, 2, 3];
      let doubled = nums.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });
  });
  
  describe('String Methods', function() {
    it('should contain substring', function() {
      let greeting = 'Hello World';
      expect(greeting).toContain('World');
    });
    
    it('should fail intentionally', function() {
      expect('Hello').toContain('Goodbye');
    });
  });
  
  render();
}

function render() {
  let output = "";
  
  output += "<button onclick='runTests()' style='padding:12px 24px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px;margin-bottom:20px'>▶️ Run Tests</button>";
  
  if (testResults.length === 0) {
    output += "<div style='background:#f5f5f5;padding:40px;border-radius:8px;text-align:center;color:#888'>";
    output += "<div style='font-size:48px'>🧪</div>";
    output += "<p>Click 'Run Tests' to execute the test suite!</p>";
    output += "</div>";
  } else {
    // Summary
    output += "<div style='display:flex;gap:20px;margin-bottom:20px'>";
    output += "<div style='flex:1;padding:20px;background:#e8f5e9;border-radius:8px;text-align:center'>";
    output += "<div style='font-size:36px;font-weight:bold;color:#4caf50'>" + testsPassed + "</div>";
    output += "<div style='color:#2e7d32'>Passed</div>";
    output += "</div>";
    output += "<div style='flex:1;padding:20px;background:#ffebee;border-radius:8px;text-align:center'>";
    output += "<div style='font-size:36px;font-weight:bold;color:#f44336'>" + testsFailed + "</div>";
    output += "<div style='color:#c62828'>Failed</div>";
    output += "</div>";
    output += "</div>";
    
    // Results
    output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px'>";
    testResults.forEach(function(result) {
      if (result.type === 'suite') {
        output += "<h4 style='margin-top:15px;margin-bottom:10px;color:#333'>📦 " + result.name + "</h4>";
      } else {
        let icon = result.passed ? '✅' : '❌';
        let bg = result.passed ? '#e8f5e9' : '#ffebee';
        let color = result.passed ? '#2e7d32' : '#c62828';
        output += "<div style='padding:12px;margin:5px 0;background:" + bg + ";border-radius:6px;border-left:4px solid " + color + "'>";
        output += icon + " " + result.name;
        if (!result.passed) {
          output += "<br><small style='color:#c62828'>Error: " + result.error + "</small>";
        }
        output += "</div>";
      }
    });
    output += "</div>";
  }
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'compiler': {
      title: 'Angular Compiler',
      content: `# Angular Compiler 🔧

Think of the compiler like a **translator** that converts your TypeScript code into super-fast JavaScript that browsers can understand!

### Why Does Angular Need a Compiler?

Your code:
\`\`\`html
<div *ngFor="let item of items">{{ item.name }}</div>
\`\`\`

Browsers don't understand \`*ngFor\`! The compiler translates it.

### Two Compilation Modes

| Mode | When It Happens | Use For |
|------|-----------------|---------|
| **JIT** (Just-in-Time) | In browser | Development |
| **AOT** (Ahead-of-Time) | Build time | Production ✨ |

### JIT vs AOT

**JIT (Development)**:
1. You run \`ng serve\`
2. Browser downloads TypeScript
3. Compiler runs IN the browser
4. App starts

**AOT (Production)**:
1. You run \`ng build\`
2. Compiler runs on YOUR computer
3. Browser gets pre-compiled JavaScript
4. App starts FAST! 🚀

### Why AOT is Better for Production

| Benefit | Explanation |
|---------|-------------|
| **Faster startup** | No compilation in browser |
| **Smaller bundle** | Compiler not included |
| **Earlier error detection** | Catches template errors at build time |
| **Better security** | Templates pre-processed |

### Build Commands

\`\`\`bash
# Development (JIT)
ng serve

# Production (AOT) - default since Angular 9
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/my-app/stats.json
\`\`\`

### Build Optimizations

Angular applies these automatically:
- **Tree-shaking**: Removes unused code
- **Minification**: Makes code smaller
- **Dead code elimination**: Removes unreachable code
- **Differential loading**: Modern + legacy bundles

### Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Template error | Invalid HTML/binding | Fix template syntax |
| Missing module | Not imported | Add to imports |
| AOT restriction | Dynamic templates | Use static templates |

### Remember! 🎯

1. Use \`ng build\` for production
2. AOT catches errors earlier
3. Check bundle size regularly
4. Enable source maps for debugging
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔧 Angular Compiler Demo</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "";
  
  // JIT vs AOT comparison
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px'>";
  
  // JIT
  output += "<div style='background:#fff3e0;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0;color:#e65100'>🔄 JIT (Just-in-Time)</h3>";
  output += "<p><b>When:</b> Development</p>";
  output += "<div style='background:white;padding:15px;border-radius:6px;margin:10px 0'>";
  output += "<div style='display:flex;flex-direction:column;gap:10px'>";
  output += "<div style='padding:10px;background:#ffecb3;border-radius:4px'>1. 📝 Write code</div>";
  output += "<div style='padding:10px;background:#ffecb3;border-radius:4px'>2. 🌐 Browser downloads</div>";
  output += "<div style='padding:10px;background:#ffe0b2;border-radius:4px'>3. ⚙️ Compiles in browser</div>";
  output += "<div style='padding:10px;background:#ffccbc;border-radius:4px'>4. 🚀 App runs</div>";
  output += "</div></div>";
  output += "<div style='color:#e65100'>⚠️ Slower startup</div>";
  output += "</div>";
  
  // AOT
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0;color:#2e7d32'>⚡ AOT (Ahead-of-Time)</h3>";
  output += "<p><b>When:</b> Production</p>";
  output += "<div style='background:white;padding:15px;border-radius:6px;margin:10px 0'>";
  output += "<div style='display:flex;flex-direction:column;gap:10px'>";
  output += "<div style='padding:10px;background:#c8e6c9;border-radius:4px'>1. 📝 Write code</div>";
  output += "<div style='padding:10px;background:#a5d6a7;border-radius:4px'>2. ⚙️ Compiles during build</div>";
  output += "<div style='padding:10px;background:#81c784;border-radius:4px'>3. 🌐 Browser downloads JS</div>";
  output += "<div style='padding:10px;background:#66bb6a;border-radius:4px'>4. 🚀 App runs FAST!</div>";
  output += "</div></div>";
  output += "<div style='color:#2e7d32'>✅ Fast startup!</div>";
  output += "</div>";
  
  output += "</div>";
  
  // Build optimization
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h3 style='margin-top:0'>📦 Build Optimizations</h3>";
  
  let optimizations = [
    { name: 'Tree-shaking', desc: 'Removes unused code', icon: '🌳' },
    { name: 'Minification', desc: 'Makes code smaller', icon: '📐' },
    { name: 'Dead Code Removal', desc: 'Removes unreachable code', icon: '💀' },
    { name: 'Differential Loading', desc: 'Modern + legacy bundles', icon: '🔀' }
  ];
  
  output += "<div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px'>";
  optimizations.forEach(function(opt) {
    output += "<div style='padding:15px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.1)'>";
    output += "<div style='font-size:24px;margin-bottom:5px'>" + opt.icon + "</div>";
    output += "<div style='font-weight:bold'>" + opt.name + "</div>";
    output += "<div style='font-size:12px;color:#666'>" + opt.desc + "</div>";
    output += "</div>";
  });
  output += "</div></div>";
  
  // Bundle size visualization
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:20px;border-radius:8px'>";
  output += "<h3 style='margin-top:0;color:#4ec9b0'>📊 Bundle Size Comparison</h3>";
  
  let bundles = [
    { name: 'Development (JIT)', size: 2800, color: '#f44336' },
    { name: 'Production (AOT)', size: 450, color: '#4caf50' },
    { name: 'Lazy Loaded Module', size: 85, color: '#2196f3' }
  ];
  
  let maxSize = Math.max(...bundles.map(b => b.size));
  
  bundles.forEach(function(bundle) {
    let width = (bundle.size / maxSize) * 100;
    output += "<div style='margin:15px 0'>";
    output += "<div style='display:flex;justify-content:space-between;margin-bottom:5px'>";
    output += "<span>" + bundle.name + "</span>";
    output += "<span>" + bundle.size + " KB</span>";
    output += "</div>";
    output += "<div style='background:#333;border-radius:4px;height:24px;overflow:hidden'>";
    output += "<div style='background:" + bundle.color + ";height:100%;width:" + width + "%;transition:width 0.5s'></div>";
    output += "</div></div>";
  });
  
  output += "<p style='margin-top:20px;color:#888;font-size:12px'>💡 AOT reduces bundle size by ~80%!</p>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 13 — Security
    'security': {
      title: 'Angular Security',
      content: `# Angular Security 🔐

Think of security like **locks on your house** - they keep bad guys out and protect what's valuable inside!

### Why Security Matters

Without security, hackers can:
- Steal user data 👤
- Take over accounts 💳
- Break your app 💥
- Get you in legal trouble ⚖️

### Common Attack Types

| Attack | What It Does | How Angular Helps |
|--------|--------------|-------------------|
| **XSS** | Injects bad scripts | Auto-sanitization |
| **CSRF** | Tricks users into actions | XSRF token support |
| **Injection** | Puts bad data in forms | Input validation |

### XSS Protection (Built-in!)

Angular automatically protects you:

\`\`\`typescript
// SAFE - Angular escapes this!
<p>{{ userInput }}</p>
// If userInput = "<script>alert('hacked!')</script>"
// Shows as text, not code!

// DANGEROUS - Only when you really need it
<div [innerHTML]="trustedHtml"></div>
// Angular sanitizes this too!
\`\`\`

### Trusting Content (When Needed)

\`\`\`typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

// Only use when you TRUST the source!
getTrustedUrl(url: string) {
  return this.sanitizer.bypassSecurityTrustResourceUrl(url);
}
\`\`\`

### CSRF Protection

\`\`\`typescript
// Angular automatically handles XSRF tokens
// Just configure HttpClient properly
provideHttpClient(
  withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  })
)
\`\`\`

### Authentication Best Practices

\`\`\`typescript
// Store tokens securely
// GOOD: HttpOnly cookies (server handles)
// OK: sessionStorage (cleared on close)
// BAD: localStorage (vulnerable to XSS)

// Use Guards
canActivate() {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/login']);
    return false;
  }
  return true;
}
\`\`\`

### Security Checklist ✅

1. **Never trust user input**
2. **Use Angular's sanitization**
3. **Implement proper auth guards**
4. **Use HTTPS always**
5. **Validate on server too**
6. **Keep Angular updated**
7. **Don't expose secrets in code**
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔐 Angular Security Demo</h2>
<div id="demo"></div>

<script>
let userInput = '';

// Simulate Angular's sanitization
function sanitize(html) {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function updateInput() {
  userInput = document.getElementById('inputField').value;
  render();
}

function setExample(example) {
  let examples = {
    safe: 'Hello, World!',
    xss: '<script>alert("Hacked!")</script>',
    img: '<img src=x onerror="alert(1)">',
    html: '<b>Bold</b> and <i>italic</i>'
  };
  document.getElementById('inputField').value = examples[example];
  userInput = examples[example];
  render();
}

function render() {
  let output = "";
  
  // Input section
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>Try XSS Attacks!</h4>";
  output += "<input id='inputField' type='text' value='" + sanitize(userInput) + "' oninput='updateInput()' style='width:100%;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:16px;box-sizing:border-box' placeholder='Type something...'>";
  
  output += "<div style='margin-top:10px;display:flex;gap:10px;flex-wrap:wrap'>";
  output += "<button onclick='setExample(\"safe\")' style='padding:8px 16px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>✓ Safe Text</button>";
  output += "<button onclick='setExample(\"xss\")' style='padding:8px 16px;background:#f44336;color:white;border:none;border-radius:6px;cursor:pointer'>⚠️ Script Tag</button>";
  output += "<button onclick='setExample(\"img\")' style='padding:8px 16px;background:#ff9800;color:white;border:none;border-radius:6px;cursor:pointer'>⚠️ Img Attack</button>";
  output += "<button onclick='setExample(\"html\")' style='padding:8px 16px;background:#2196f3;color:white;border:none;border-radius:6px;cursor:pointer'>📝 HTML</button>";
  output += "</div></div>";
  
  // Comparison
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px'>";
  
  // Without protection
  output += "<div style='background:#ffebee;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#c62828'>❌ Without Protection</h4>";
  output += "<p style='font-size:12px;color:#666'>dangerouslySetInnerHTML</p>";
  output += "<div style='background:white;padding:15px;border-radius:6px;border:2px solid #f44336'>";
  // Show what would happen without sanitization
  output += "<code style='word-break:break-all;color:#c62828'>" + userInput + "</code>";
  output += "</div>";
  output += "<p style='color:#c62828;font-size:12px;margin-bottom:0'>⚠️ Scripts would execute!</p>";
  output += "</div>";
  
  // With Angular protection
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#2e7d32'>✅ With Angular Protection</h4>";
  output += "<p style='font-size:12px;color:#666'>{{ userInput }} - Auto-sanitized</p>";
  output += "<div style='background:white;padding:15px;border-radius:6px;border:2px solid #4caf50'>";
  output += "<code style='word-break:break-all'>" + sanitize(userInput) + "</code>";
  output += "</div>";
  output += "<p style='color:#2e7d32;font-size:12px;margin-bottom:0'>✓ Scripts shown as text!</p>";
  output += "</div>";
  
  output += "</div>";
  
  // Security tips
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin-top:20px'>";
  output += "<h4 style='margin-top:0'>🛡️ Angular Security Features</h4>";
  output += "<ul style='margin:0;padding-left:20px'>";
  output += "<li><b>Auto-Sanitization</b> - HTML/JS escaped by default</li>";
  output += "<li><b>Content Security Policy</b> - Headers support</li>";
  output += "<li><b>XSRF Protection</b> - Built-in token handling</li>";
  output += "<li><b>Safe Navigation</b> - Router guards</li>";
  output += "</ul></div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'ssr': {
      title: 'Angular SSR',
      content: `# Angular SSR (Server-Side Rendering) 🖥️

Think of SSR like **preparing a meal in the kitchen** before serving it, instead of making guests watch you cook!

### What is SSR?

**Without SSR (Client-Side)**:
1. Browser gets empty HTML
2. Downloads JavaScript
3. JS builds the page
4. User finally sees content

**With SSR (Server-Side)**:
1. Server builds full HTML
2. Browser gets complete page
3. User sees content immediately! 🚀
4. JS takes over for interactivity

### Why Use SSR?

| Benefit | Explanation |
|---------|-------------|
| **SEO** | Search engines see your content |
| **Performance** | First paint is faster |
| **Social sharing** | Proper previews on Facebook/Twitter |
| **Accessibility** | Works without JavaScript |

### Setting Up Angular Universal

\`\`\`bash
# Add SSR to your project
ng add @angular/ssr

# This creates:
# - server.ts
# - app.config.server.ts
# - main.server.ts
\`\`\`

### Server Entry Point

\`\`\`typescript
// server.ts - Node.js server
import express from 'express';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './src/main.server';

const app = express();

app.get('*', (req, res) => {
  const engine = new CommonEngine();
  
  engine.render({
    bootstrap,
    url: req.originalUrl,
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
  }).then(html => res.send(html));
});
\`\`\`

### Checking if Server or Browser

\`\`\`typescript
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    // Only runs in browser
    window.addEventListener('scroll', this.onScroll);
  }
  
  if (isPlatformServer(this.platformId)) {
    // Only runs on server
    console.log('Rendering on server!');
  }
}
\`\`\`

### Things to Watch Out For

\`\`\`typescript
// ❌ BAD - window doesn't exist on server
ngOnInit() {
  const width = window.innerWidth;
}

// ✅ GOOD - Check platform first
ngOnInit() {
  if (isPlatformBrowser(this.platformId)) {
    const width = window.innerWidth;
  }
}
\`\`\`

### Remember! 🎯

1. SSR improves SEO and initial load
2. Check platform before using browser APIs
3. Handle state transfer properly
4. Consider hydration for interactivity
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🖥️ Server-Side Rendering Demo</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "";
  
  // Comparison diagram
  output += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px'>";
  
  // Client-side
  output += "<div style='background:#fff3e0;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#e65100'>🌐 Client-Side Rendering</h4>";
  output += "<div style='display:flex;flex-direction:column;gap:8px'>";
  
  let csrSteps = [
    { step: 1, text: 'Browser requests page', time: '0ms', bar: 20 },
    { step: 2, text: 'Gets empty HTML + JS links', time: '100ms', bar: 30 },
    { step: 3, text: 'Downloads JavaScript', time: '300ms', bar: 50 },
    { step: 4, text: 'JS executes & builds DOM', time: '500ms', bar: 70 },
    { step: 5, text: 'User sees content! 👀', time: '800ms', bar: 100 }
  ];
  
  csrSteps.forEach(function(s) {
    output += "<div style='background:white;padding:10px;border-radius:6px'>";
    output += "<div style='display:flex;justify-content:space-between;font-size:12px'>";
    output += "<span>" + s.step + ". " + s.text + "</span>";
    output += "<span style='color:#e65100'>" + s.time + "</span>";
    output += "</div>";
    output += "<div style='background:#ffe0b2;height:8px;border-radius:4px;margin-top:5px'>";
    output += "<div style='background:#ff9800;height:100%;border-radius:4px;width:" + s.bar + "%;transition:width 0.5s'></div>";
    output += "</div></div>";
  });
  output += "</div>";
  output += "<div style='margin-top:15px;color:#e65100'>⏱️ Time to content: <b>800ms</b></div>";
  output += "</div>";
  
  // Server-side
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#2e7d32'>🖥️ Server-Side Rendering</h4>";
  output += "<div style='display:flex;flex-direction:column;gap:8px'>";
  
  let ssrSteps = [
    { step: 1, text: 'Browser requests page', time: '0ms', bar: 20 },
    { step: 2, text: 'Server renders HTML', time: '50ms', bar: 40 },
    { step: 3, text: 'Browser gets full HTML', time: '150ms', bar: 60 },
    { step: 4, text: 'User sees content! 👀', time: '200ms', bar: 100 }
  ];
  
  ssrSteps.forEach(function(s) {
    output += "<div style='background:white;padding:10px;border-radius:6px'>";
    output += "<div style='display:flex;justify-content:space-between;font-size:12px'>";
    output += "<span>" + s.step + ". " + s.text + "</span>";
    output += "<span style='color:#2e7d32'>" + s.time + "</span>";
    output += "</div>";
    output += "<div style='background:#c8e6c9;height:8px;border-radius:4px;margin-top:5px'>";
    output += "<div style='background:#4caf50;height:100%;border-radius:4px;width:" + s.bar + "%;transition:width 0.5s'></div>";
    output += "</div></div>";
  });
  output += "</div>";
  output += "<div style='margin-top:15px;color:#2e7d32'>⏱️ Time to content: <b>200ms</b> (4x faster!)</div>";
  output += "</div>";
  
  output += "</div>";
  
  // Platform check code
  output += "<div style='background:#1e1e1e;color:#9cdcfe;padding:15px;border-radius:8px;font-family:monospace;font-size:12px;margin-bottom:20px'>";
  output += "<span style='color:#6a9955'>// Check if running on server or browser</span><br><br>";
  output += "<span style='color:#c586c0'>if</span> (<span style='color:#dcdcaa'>isPlatformBrowser</span>(<span style='color:#9cdcfe'>platformId</span>)) {<br>";
  output += "  <span style='color:#6a9955'>// Safe to use window, document</span><br>";
  output += "  <span style='color:#9cdcfe'>window</span>.<span style='color:#dcdcaa'>addEventListener</span>(<span style='color:#ce9178'>'scroll'</span>, ...);<br>";
  output += "}<br><br>";
  output += "<span style='color:#c586c0'>if</span> (<span style='color:#dcdcaa'>isPlatformServer</span>(<span style='color:#9cdcfe'>platformId</span>)) {<br>";
  output += "  <span style='color:#6a9955'>// Running on Node.js</span><br>";
  output += "}";
  output += "</div>";
  
  // Benefits
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0'>🎯 SSR Benefits</h4>";
  output += "<div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(150px, 1fr));gap:10px'>";
  
  let benefits = [
    { icon: '🔍', title: 'SEO', desc: 'Search engines see content' },
    { icon: '⚡', title: 'Speed', desc: 'Faster first paint' },
    { icon: '📱', title: 'Social', desc: 'Good link previews' },
    { icon: '♿', title: 'Accessibility', desc: 'Works without JS' }
  ];
  
  benefits.forEach(function(b) {
    output += "<div style='background:white;padding:15px;border-radius:8px;text-align:center'>";
    output += "<div style='font-size:32px'>" + b.icon + "</div>";
    output += "<div style='font-weight:bold'>" + b.title + "</div>";
    output += "<div style='font-size:12px;color:#666'>" + b.desc + "</div>";
    output += "</div>";
  });
  
  output += "</div></div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'hydration': {
      title: 'Angular Hydration',
      content: `# Angular Hydration 💧

Think of hydration like **bringing a statue to life** - the server creates the shape (HTML), then Angular adds the magic (interactivity)!

### What is Hydration?

After SSR sends HTML to the browser:
1. User sees static content ✓
2. JavaScript downloads
3. Angular "hydrates" the page
4. Buttons start working! 🎉

Without hydration, Angular would:
- Delete all server HTML 🗑️
- Rebuild everything from scratch 🔄
- Cause a flash of content 😵

### How Hydration Works

**Before (Bad)**:
1. Server sends HTML
2. Angular destroys it
3. Angular rebuilds from scratch
4. User sees flicker

**With Hydration (Good)**:
1. Server sends HTML
2. Angular attaches to existing HTML
3. Adds event listeners
4. Smooth transition! ✨

### Enabling Hydration

\`\`\`typescript
// app.config.ts
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration()  // That's it!
  ]
};
\`\`\`

### Skipping Hydration (When Needed)

\`\`\`typescript
// Some components shouldn't hydrate
@Component({
  host: { ngSkipHydration: 'true' }
})
export class ThirdPartyWidgetComponent {}

// Or in template
<third-party-widget ngSkipHydration></third-party-widget>
\`\`\`

### Common Pitfalls

| Problem | Cause | Solution |
|---------|-------|----------|
| Mismatch error | Server/client HTML differs | Ensure same data |
| Missing interactivity | Hydration failed | Check console errors |
| Layout shift | Content changes | Use consistent data |

### Hydration States

\`\`\`
Server HTML → [Static] → JS Loads → [Hydrating] → [Interactive]
    📄              ⏳            💧              ✨
\`\`\`

### Remember! 🎯

1. Always enable \`provideClientHydration()\` with SSR
2. Ensure server and client render the same HTML
3. Use \`ngSkipHydration\` for problematic components
4. Test hydration in production builds
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>💧 Angular Hydration Demo</h2>
<div id="demo"></div>

<script>
let hydrationState = 'server';
let isInteractive = false;

function simulateHydration() {
  hydrationState = 'loading';
  render();
  
  setTimeout(function() {
    hydrationState = 'hydrating';
    render();
  }, 1000);
  
  setTimeout(function() {
    hydrationState = 'interactive';
    isInteractive = true;
    render();
  }, 2000);
}

function resetDemo() {
  hydrationState = 'server';
  isInteractive = false;
  render();
}

function handleClick() {
  if (isInteractive) {
    alert('🎉 Button works! Angular is hydrated!');
  }
}

function render() {
  let output = "";
  
  // State indicator
  output += "<div style='display:flex;gap:10px;margin-bottom:20px'>";
  
  let states = [
    { id: 'server', label: '📄 Server HTML', color: '#9c27b0' },
    { id: 'loading', label: '⏳ JS Loading', color: '#ff9800' },
    { id: 'hydrating', label: '💧 Hydrating', color: '#2196f3' },
    { id: 'interactive', label: '✨ Interactive', color: '#4caf50' }
  ];
  
  states.forEach(function(s) {
    let active = hydrationState === s.id;
    let passed = states.findIndex(x => x.id === hydrationState) >= states.findIndex(x => x.id === s.id);
    output += "<div style='flex:1;padding:15px;background:" + (active ? s.color : (passed ? '#e0e0e0' : '#f5f5f5')) + ";color:" + (active ? 'white' : (passed ? '#333' : '#888')) + ";border-radius:8px;text-align:center;transition:all 0.3s'>";
    output += s.label;
    output += "</div>";
  });
  output += "</div>";
  
  // Simulated page
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>🖥️ Rendered Page</h4>";
  
  output += "<div style='background:white;padding:20px;border-radius:8px;border:2px solid " + (isInteractive ? '#4caf50' : '#ddd') + "'>";
  
  // Header
  output += "<div style='display:flex;justify-content:space-between;align-items:center;padding-bottom:15px;border-bottom:1px solid #eee;margin-bottom:15px'>";
  output += "<span style='font-size:20px;font-weight:bold'>🛒 My Store</span>";
  output += "<nav style='display:flex;gap:15px;color:#666'>Home Products Cart</nav>";
  output += "</div>";
  
  // Content
  output += "<div style='display:grid;grid-template-columns:repeat(3, 1fr);gap:15px;margin-bottom:20px'>";
  for (let i = 1; i <= 3; i++) {
    output += "<div style='background:#f9f9f9;padding:15px;border-radius:8px;text-align:center'>";
    output += "<div style='font-size:40px'>📦</div>";
    output += "<div>Product " + i + "</div>";
    output += "<div style='color:#4caf50;font-weight:bold'>$" + (i * 10) + "</div>";
    output += "</div>";
  }
  output += "</div>";
  
  // Interactive button
  let btnStyle = isInteractive 
    ? 'background:#4caf50;cursor:pointer' 
    : 'background:#ccc;cursor:not-allowed';
  output += "<button onclick='handleClick()' style='padding:15px 30px;" + btnStyle + ";color:white;border:none;border-radius:8px;font-size:16px;width:100%'>";
  output += isInteractive ? '🛒 Add to Cart (Click me!)' : '🛒 Add to Cart (Loading...)';
  output += "</button>";
  
  output += "</div>";
  
  // Status message
  let statusMsg = '';
  let statusColor = '';
  if (hydrationState === 'server') {
    statusMsg = '📄 Static HTML from server - buttons don\\'t work yet';
    statusColor = '#9c27b0';
  } else if (hydrationState === 'loading') {
    statusMsg = '⏳ JavaScript is downloading...';
    statusColor = '#ff9800';
  } else if (hydrationState === 'hydrating') {
    statusMsg = '💧 Angular is hydrating - attaching event listeners...';
    statusColor = '#2196f3';
  } else {
    statusMsg = '✨ Fully interactive! Try clicking the button!';
    statusColor = '#4caf50';
  }
  
  output += "<div style='padding:10px;background:" + statusColor + ";color:white;border-radius:6px;text-align:center'>" + statusMsg + "</div>";
  output += "</div>";
  
  // Controls
  output += "<div style='display:flex;gap:10px'>";
  if (hydrationState === 'server') {
    output += "<button onclick='simulateHydration()' style='flex:1;padding:15px;background:#2196f3;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px'>▶️ Simulate Hydration Process</button>";
  } else {
    output += "<button onclick='resetDemo()' style='flex:1;padding:15px;background:#666;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px'>🔄 Reset Demo</button>";
  }
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // PHASE 16 — Exercises, Quiz, Interview, Certificate
    'exercises': {
      title: 'Angular Exercises',
      content: `# Angular Exercises 🏋️

Practice makes perfect! These exercises will help you become an Angular master.

### Exercise 1: Counter Component (Beginner)

Create a counter that:
- Shows current count
- Has increment (+) button
- Has decrement (-) button
- Has reset button

**Skills**: Components, Event binding, State

### Exercise 2: Todo List (Beginner)

Build a todo app that:
- Adds new todos
- Marks todos complete
- Deletes todos
- Shows count of remaining

**Skills**: Forms, *ngFor, Event handling

### Exercise 3: User Search (Intermediate)

Create a search feature that:
- Fetches users from API
- Filters as you type
- Shows loading state
- Handles errors

**Skills**: HttpClient, RxJS, Pipes

### Exercise 4: Shopping Cart (Intermediate)

Build a cart that:
- Lists products
- Adds items to cart
- Updates quantities
- Shows total price

**Skills**: Services, State, Computed values

### Exercise 5: Auth System (Advanced)

Implement authentication:
- Login form with validation
- Store token securely
- Protected routes
- Auto-logout on expiry

**Skills**: Guards, Interceptors, Forms

### Exercise 6: Dashboard (Advanced)

Create a dashboard with:
- Multiple widget types
- Drag to rearrange
- Save layout preference
- Real-time updates

**Skills**: Dynamic components, State, Storage

### Tips for Success 🎯

1. **Start simple** - Get it working, then improve
2. **Read errors** - They tell you what's wrong
3. **Use DevTools** - Inspect and debug
4. **Check docs** - angular.dev is your friend
5. **Practice daily** - 30 minutes beats 3 hours once
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🏋️ Angular Exercises</h2>
<div id="demo"></div>

<script>
let currentExercise = 0;
let count = 0;
let todos = [];
let todoInput = '';

function setExercise(num) {
  currentExercise = num;
  render();
}

// Counter exercise functions
function increment() { count++; render(); }
function decrement() { count--; render(); }
function reset() { count = 0; render(); }

// Todo exercise functions
function addTodo() {
  if (todoInput.trim()) {
    todos.push({ id: Date.now(), text: todoInput, done: false });
    todoInput = '';
    render();
  }
}
function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? {...t, done: !t.done} : t);
  render();
}
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  render();
}
function updateInput(val) {
  todoInput = val;
}

function render() {
  let output = "";
  
  // Exercise selector
  output += "<div style='display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap'>";
  let exercises = [
    { num: 1, name: 'Counter', icon: '🔢', level: 'Beginner' },
    { num: 2, name: 'Todo List', icon: '✅', level: 'Beginner' },
    { num: 3, name: 'User Search', icon: '🔍', level: 'Intermediate' },
    { num: 4, name: 'Shopping Cart', icon: '🛒', level: 'Intermediate' }
  ];
  
  exercises.forEach(function(ex) {
    let active = currentExercise === ex.num;
    output += "<button onclick='setExercise(" + ex.num + ")' style='padding:10px 15px;background:" + (active ? '#DD0031' : '#f5f5f5') + ";color:" + (active ? 'white' : '#333') + ";border:none;border-radius:8px;cursor:pointer'>";
    output += ex.icon + " " + ex.name;
    output += "</button>";
  });
  output += "</div>";
  
  // Exercise content
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;min-height:300px'>";
  
  if (currentExercise === 0) {
    output += "<div style='text-align:center;padding:40px;color:#888'>";
    output += "<div style='font-size:48px'>🏋️</div>";
    output += "<h3>Select an exercise to begin!</h3>";
    output += "<p>Practice your Angular skills with hands-on challenges.</p>";
    output += "</div>";
  } else if (currentExercise === 1) {
    // Counter exercise
    output += "<h3 style='margin-top:0'>🔢 Exercise 1: Counter Component</h3>";
    output += "<p>Your challenge: Implement a counter with increment, decrement, and reset!</p>";
    
    output += "<div style='background:white;padding:30px;border-radius:8px;text-align:center;margin:20px 0'>";
    output += "<div style='font-size:64px;font-weight:bold;color:#DD0031;margin-bottom:20px'>" + count + "</div>";
    output += "<div style='display:flex;gap:10px;justify-content:center'>";
    output += "<button onclick='decrement()' style='padding:15px 25px;background:#f44336;color:white;border:none;border-radius:8px;font-size:20px;cursor:pointer'>−</button>";
    output += "<button onclick='reset()' style='padding:15px 25px;background:#9e9e9e;color:white;border:none;border-radius:8px;font-size:16px;cursor:pointer'>Reset</button>";
    output += "<button onclick='increment()' style='padding:15px 25px;background:#4caf50;color:white;border:none;border-radius:8px;font-size:20px;cursor:pointer'>+</button>";
    output += "</div></div>";
    
    output += "<div style='background:#e8f5e9;padding:15px;border-radius:8px'>";
    output += "<b>✅ Skills practiced:</b> Components, State, Event binding";
    output += "</div>";
    
  } else if (currentExercise === 2) {
    // Todo exercise
    output += "<h3 style='margin-top:0'>✅ Exercise 2: Todo List</h3>";
    output += "<p>Your challenge: Build a fully functional todo list!</p>";
    
    output += "<div style='background:white;padding:20px;border-radius:8px;margin:20px 0'>";
    output += "<div style='display:flex;gap:10px;margin-bottom:20px'>";
    output += "<input id='todoInput' type='text' value='" + todoInput + "' onkeyup='if(event.key===\"Enter\")addTodo();updateInput(this.value)' placeholder='Add a todo...' style='flex:1;padding:12px;border:1px solid #ddd;border-radius:6px;font-size:16px'>";
    output += "<button onclick='addTodo()' style='padding:12px 24px;background:#4caf50;color:white;border:none;border-radius:6px;cursor:pointer'>Add</button>";
    output += "</div>";
    
    if (todos.length === 0) {
      output += "<p style='text-align:center;color:#888'>No todos yet. Add one above!</p>";
    } else {
      todos.forEach(function(todo) {
        output += "<div style='display:flex;align-items:center;gap:10px;padding:12px;background:#f9f9f9;border-radius:6px;margin-bottom:8px'>";
        output += "<input type='checkbox' " + (todo.done ? 'checked' : '') + " onchange='toggleTodo(" + todo.id + ")' style='width:20px;height:20px;cursor:pointer'>";
        output += "<span style='flex:1;text-decoration:" + (todo.done ? 'line-through' : 'none') + ";color:" + (todo.done ? '#888' : '#333') + "'>" + todo.text + "</span>";
        output += "<button onclick='deleteTodo(" + todo.id + ")' style='padding:5px 10px;background:#f44336;color:white;border:none;border-radius:4px;cursor:pointer'>×</button>";
        output += "</div>";
      });
    }
    
    let remaining = todos.filter(t => !t.done).length;
    output += "<div style='margin-top:15px;color:#666;font-size:14px'>" + remaining + " items remaining</div>";
    output += "</div>";
    
    output += "<div style='background:#e8f5e9;padding:15px;border-radius:8px'>";
    output += "<b>✅ Skills practiced:</b> Forms, *ngFor, Event handling, State";
    output += "</div>";
    
  } else if (currentExercise === 3) {
    output += "<h3 style='margin-top:0'>🔍 Exercise 3: User Search</h3>";
    output += "<p>Challenge: Fetch users from API, filter by name, handle loading/errors.</p>";
    output += "<div style='background:white;padding:20px;border-radius:8px'>";
    output += "<p style='color:#666'>This exercise requires HttpClient and RxJS.</p>";
    output += "<p>Key concepts to practice:</p>";
    output += "<ul><li>HttpClient.get()</li><li>debounceTime for search</li><li>Loading states</li><li>Error handling</li></ul>";
    output += "</div>";
    
  } else if (currentExercise === 4) {
    output += "<h3 style='margin-top:0'>🛒 Exercise 4: Shopping Cart</h3>";
    output += "<p>Challenge: Build a cart with add/remove, quantities, and totals.</p>";
    output += "<div style='background:white;padding:20px;border-radius:8px'>";
    output += "<p style='color:#666'>This exercise requires Services and State management.</p>";
    output += "<p>Key concepts to practice:</p>";
    output += "<ul><li>CartService with BehaviorSubject</li><li>Computed totals</li><li>Quantity updates</li><li>State persistence</li></ul>";
    output += "</div>";
  }
  
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'quiz': {
      title: 'Angular Quiz',
      content: `# Angular Quiz 🧠

Test your Angular knowledge with these questions!

### How This Works

- Answer questions to test understanding
- Learn from explanations
- Track your progress
- Identify areas to improve

### Topics Covered

1. **Components** - How they work
2. **Data Binding** - Different types
3. **Directives** - Structural & attribute
4. **Services & DI** - Dependency injection
5. **Routing** - Navigation patterns
6. **Forms** - Template vs Reactive
7. **Change Detection** - OnPush strategy
8. **Lifecycle Hooks** - When they run
9. **Signals** - Modern reactivity
10. **Testing** - Unit test patterns

### Sample Questions

**Q1: What does OnPush change detection do?**
- A) Checks all components always
- B) Only checks when @Input changes ✓
- C) Disables change detection
- D) Runs change detection twice

**Q2: Which lifecycle hook runs first?**
- A) ngOnInit
- B) ngAfterViewInit
- C) constructor ✓
- D) ngOnChanges

**Q3: How do you read a signal's value?**
- A) signal.value
- B) signal.get()
- C) signal() ✓
- D) signal.$

### Tips for the Quiz 🎯

1. **Read carefully** - Details matter
2. **Eliminate wrong answers** - Narrow down
3. **Think of real code** - Imagine examples
4. **Learn from mistakes** - Wrong answers teach too
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🧠 Angular Quiz</h2>
<div id="demo"></div>

<script>
let questions = [
  {
    q: "What is the correct way to read a signal's value?",
    options: ['signal.value', 'signal.get()', 'signal()', 'signal.$'],
    correct: 2,
    explanation: "Signals are called as functions: mySignal()"
  },
  {
    q: "Which change detection strategy is more performant?",
    options: ['Default', 'OnPush', 'OnChange', 'Manual'],
    correct: 1,
    explanation: "OnPush only checks when inputs change, making it faster."
  },
  {
    q: "What does *ngFor do?",
    options: ['Hides elements', 'Loops through items', 'Checks conditions', 'Animates'],
    correct: 1,
    explanation: "*ngFor repeats an element for each item in an array."
  },
  {
    q: "Which hook runs when @Input values change?",
    options: ['ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngAfterViewInit'],
    correct: 1,
    explanation: "ngOnChanges runs whenever @Input properties change."
  },
  {
    q: "What does provideHttpClient() do?",
    options: ['Creates HTTP server', 'Enables HTTP requests', 'Blocks HTTP', 'Logs HTTP'],
    correct: 1,
    explanation: "provideHttpClient() enables the HttpClient service for API calls."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedAnswer = -1;

function selectAnswer(index) {
  if (answered) return;
  selectedAnswer = index;
  answered = true;
  if (index === questions[currentQuestion].correct) {
    score++;
  }
  render();
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    answered = false;
    selectedAnswer = -1;
    render();
  }
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  selectedAnswer = -1;
  render();
}

function render() {
  let output = "";
  
  // Progress
  output += "<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:20px'>";
  output += "<span>Question " + (currentQuestion + 1) + " of " + questions.length + "</span>";
  output += "<span style='background:#e3f2fd;padding:8px 16px;border-radius:20px'>Score: " + score + "/" + questions.length + "</span>";
  output += "</div>";
  
  // Progress bar
  output += "<div style='background:#e0e0e0;height:8px;border-radius:4px;margin-bottom:20px'>";
  output += "<div style='background:#DD0031;height:100%;border-radius:4px;width:" + ((currentQuestion + 1) / questions.length * 100) + "%;transition:width 0.3s'></div>";
  output += "</div>";
  
  let q = questions[currentQuestion];
  
  // Question
  output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h3 style='margin-top:0'>" + q.q + "</h3>";
  
  output += "<div style='display:flex;flex-direction:column;gap:10px'>";
  q.options.forEach(function(opt, i) {
    let isSelected = selectedAnswer === i;
    let isCorrect = q.correct === i;
    let bg = '#fff';
    let border = '#ddd';
    let color = '#333';
    
    if (answered) {
      if (isCorrect) {
        bg = '#e8f5e9';
        border = '#4caf50';
        color = '#2e7d32';
      } else if (isSelected) {
        bg = '#ffebee';
        border = '#f44336';
        color = '#c62828';
      }
    } else if (isSelected) {
      bg = '#e3f2fd';
      border = '#2196f3';
    }
    
    output += "<button onclick='selectAnswer(" + i + ")' style='padding:15px;background:" + bg + ";border:2px solid " + border + ";border-radius:8px;text-align:left;cursor:" + (answered ? 'default' : 'pointer') + ";color:" + color + ";font-size:16px'>";
    output += "<span style='font-weight:bold;margin-right:10px'>" + String.fromCharCode(65 + i) + "</span>" + opt;
    if (answered && isCorrect) output += " ✓";
    if (answered && isSelected && !isCorrect) output += " ✗";
    output += "</button>";
  });
  output += "</div>";
  
  // Explanation
  if (answered) {
    output += "<div style='margin-top:15px;padding:15px;background:#e3f2fd;border-radius:8px'>";
    output += "<b>💡 Explanation:</b> " + q.explanation;
    output += "</div>";
  }
  
  output += "</div>";
  
  // Navigation
  if (answered) {
    if (currentQuestion < questions.length - 1) {
      output += "<button onclick='nextQuestion()' style='padding:15px 30px;background:#DD0031;color:white;border:none;border-radius:8px;cursor:pointer;font-size:16px'>Next Question →</button>";
    } else {
      output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;text-align:center'>";
      output += "<h3 style='color:#2e7d32;margin-top:0'>🎉 Quiz Complete!</h3>";
      output += "<p style='font-size:24px;margin:10px 0'>You scored <b>" + score + "</b> out of <b>" + questions.length + "</b></p>";
      output += "<p>" + (score === questions.length ? "Perfect! 🌟" : score >= questions.length * 0.7 ? "Great job! 👍" : "Keep practicing! 💪") + "</p>";
      output += "<button onclick='restartQuiz()' style='padding:12px 24px;background:#4caf50;color:white;border:none;border-radius:8px;cursor:pointer'>Try Again</button>";
      output += "</div>";
    }
  }
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'interview-prep': {
      title: 'Angular Interview Prep',
      content: `# Angular Interview Prep 🎤

Get ready to ace your Angular interview!

### Common Interview Questions

#### 1. What is Angular?
"Angular is a TypeScript-based framework for building web applications. It's developed by Google and provides features like components, dependency injection, routing, forms, and HTTP client out of the box."

#### 2. Components vs Directives?
- **Components** have templates, are building blocks of UI
- **Directives** add behavior to existing elements
- Components ARE directives (with templates)

#### 3. Explain Dependency Injection
"DI is a design pattern where dependencies are provided to a class rather than created inside it. Angular's DI system manages creating and injecting services, making code testable and modular."

#### 4. OnPush Change Detection?
"OnPush is a performance optimization. Components only check for changes when:
- @Input reference changes
- An event fires in the component
- Async pipe emits
- Manual trigger with ChangeDetectorRef"

#### 5. Signals vs Observables?
| Signals | Observables |
|---------|-------------|
| Synchronous | Async |
| Simple syntax | More features |
| Always have value | May not emit |
| Great for state | Great for streams |

### Behavioral Questions

#### "Tell me about a challenging Angular project"
- Describe the problem clearly
- Explain your approach
- Share the outcome
- Mention what you learned

#### "How do you stay updated with Angular?"
- Official Angular blog
- Angular YouTube channel
- Community events/meetups
- Open source contributions

### Technical Challenges

Be ready to:
- Build a component from scratch
- Debug change detection issues
- Implement a service with DI
- Create reactive forms
- Explain routing concepts

### Tips for Success 🎯

1. **Practice explaining** - Say it out loud
2. **Build real projects** - Theory isn't enough
3. **Know the basics cold** - Components, DI, routing
4. **Admit what you don't know** - It's okay!
5. **Ask questions** - Show curiosity
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎤 Interview Prep</h2>
<div id="demo"></div>

<script>
let currentTopic = 'basics';

let topics = {
  basics: {
    title: 'Angular Basics',
    questions: [
      { q: 'What is Angular?', a: 'A TypeScript-based framework by Google for building web applications with features like components, DI, routing, forms, and HTTP client.' },
      { q: 'What are Components?', a: 'Building blocks of Angular apps. They have a TypeScript class, HTML template, and optional CSS. They control a view.' },
      { q: 'What is a Module?', a: 'A container for components, directives, pipes, and services. AppModule is the root. Modules help organize code.' }
    ]
  },
  di: {
    title: 'Dependency Injection',
    questions: [
      { q: 'What is DI?', a: 'A design pattern where dependencies are injected rather than created. Makes code testable, modular, and maintainable.' },
      { q: 'What is providedIn: root?', a: 'Creates a singleton service available throughout the app. Angular tree-shakes unused services.' },
      { q: 'Explain InjectionToken', a: 'Used to inject non-class values like config objects or strings. Create with new InjectionToken().' }
    ]
  },
  performance: {
    title: 'Performance',
    questions: [
      { q: 'What is OnPush?', a: 'A change detection strategy that only checks when inputs change, events fire, or async pipe emits. Much faster!' },
      { q: 'What are Signals?', a: 'Modern reactive primitives in Angular 16+. Provide fine-grained reactivity and simpler syntax than RxJS for UI state.' },
      { q: 'How to optimize bundle size?', a: 'Lazy loading, tree shaking, AOT compilation, removing unused imports, using lightweight alternatives.' }
    ]
  }
};

function setTopic(topic) {
  currentTopic = topic;
  render();
}

function render() {
  let output = "";
  
  // Topic selector
  output += "<div style='display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap'>";
  Object.keys(topics).forEach(function(key) {
    let active = currentTopic === key;
    output += "<button onclick='setTopic(\"" + key + "\")' style='padding:10px 20px;background:" + (active ? '#DD0031' : '#f5f5f5') + ";color:" + (active ? 'white' : '#333') + ";border:none;border-radius:8px;cursor:pointer'>" + topics[key].title + "</button>";
  });
  output += "</div>";
  
  let topic = topics[currentTopic];
  
  output += "<h3 style='margin-top:0'>📚 " + topic.title + "</h3>";
  
  // Questions
  topic.questions.forEach(function(qa, i) {
    output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;margin-bottom:15px'>";
    output += "<div style='font-weight:bold;color:#DD0031;margin-bottom:10px'>Q" + (i+1) + ": " + qa.q + "</div>";
    output += "<div style='background:white;padding:15px;border-radius:6px;border-left:4px solid #4caf50'>";
    output += "<b>Answer:</b> " + qa.a;
    output += "</div></div>";
  });
  
  // Interview tips
  output += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;margin-top:20px'>";
  output += "<h4 style='margin-top:0'>🎯 Quick Tips</h4>";
  output += "<ul style='margin:0;padding-left:20px'>";
  output += "<li>Speak clearly and explain your thought process</li>";
  output += "<li>Use real examples from your experience</li>";
  output += "<li>It's okay to say 'I don't know' - show willingness to learn</li>";
  output += "<li>Ask clarifying questions before answering</li>";
  output += "</ul></div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    'certificate': {
      title: 'Angular Certificate',
      content: `# Angular Certificate 🏆

Congratulations on completing the Angular course!

### What You've Learned

✅ **Phase 0-1**: Angular fundamentals, CLI, project setup
✅ **Phase 2**: Components, templates, data binding, directives
✅ **Phase 3**: Template-driven and reactive forms
✅ **Phase 4**: Routing, guards, lazy loading
✅ **Phase 5**: Services, DI, HTTP client, interceptors
✅ **Phase 6**: Lifecycle hooks, pipes, styling
✅ **Phase 7-8**: Change detection, signals, performance
✅ **Phase 9**: Dynamic components, advanced DI, state
✅ **Phase 10-11**: Animations, testing, compiler
✅ **Phase 12-13**: Security, SSR, hydration
✅ **Enterprise**: Case studies, best practices

### Skills Validated

| Skill | Level |
|-------|-------|
| Components & Templates | Expert |
| Forms & Validation | Expert |
| Routing & Navigation | Expert |
| Services & DI | Expert |
| HTTP & API Integration | Expert |
| State Management | Advanced |
| Performance Optimization | Advanced |
| Testing | Proficient |
| Security | Proficient |

### Next Steps

1. **Build projects** - Apply what you learned
2. **Contribute to open source** - Angular packages
3. **Stay updated** - Follow Angular releases
4. **Share knowledge** - Teach others
5. **Get certified** - Google Angular certification

### Resources

- 📚 [Angular Documentation](https://angular.dev)
- 🎥 [Angular YouTube](https://youtube.com/@Angular)
- 💬 [Angular Discord](https://discord.gg/angular)
- 🐙 [Angular GitHub](https://github.com/angular/angular)

### You're Now an Angular SME! 🎉

You can:
- Architect scalable Angular applications
- Optimize performance and bundle size
- Implement enterprise patterns
- Lead Angular projects confidently
- Pass Angular interviews!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🏆 Your Angular Certificate</h2>
<div id="demo"></div>

<script>
function render() {
  let output = "";
  
  // Certificate
  output += "<div style='background:linear-gradient(135deg, #1a237e 0%, #DD0031 100%);padding:40px;border-radius:16px;color:white;text-align:center;margin-bottom:20px'>";
  
  output += "<div style='background:white;margin:0 auto;padding:40px;border-radius:12px;max-width:500px;color:#333'>";
  
  // Logo
  output += "<div style='font-size:48px;margin-bottom:10px'>🅰️</div>";
  output += "<div style='font-size:12px;color:#888;text-transform:uppercase;letter-spacing:2px'>Certificate of Completion</div>";
  
  // Title
  output += "<h1 style='color:#DD0031;margin:20px 0'>Angular Mastery</h1>";
  output += "<div style='font-size:18px;margin-bottom:20px'>0 → Hero → SME Program</div>";
  
  // Recipient
  output += "<div style='padding:20px;background:#f5f5f5;border-radius:8px;margin:20px 0'>";
  output += "<div style='font-size:14px;color:#888'>This certifies that</div>";
  output += "<div style='font-size:24px;font-weight:bold;color:#1a237e;margin:10px 0'>VerTechie Learner</div>";
  output += "<div style='font-size:14px;color:#888'>has successfully completed the course</div>";
  output += "</div>";
  
  // Skills
  output += "<div style='display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:20px 0'>";
  let skills = ['Components', 'Routing', 'Forms', 'Services', 'RxJS', 'Signals', 'Testing', 'SSR'];
  skills.forEach(function(skill) {
    output += "<span style='padding:6px 12px;background:#e3f2fd;color:#1565c0;border-radius:20px;font-size:12px'>" + skill + "</span>";
  });
  output += "</div>";
  
  // Date
  output += "<div style='margin-top:20px;color:#888;font-size:14px'>";
  output += "Issued: " + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  output += "</div>";
  
  // Signature
  output += "<div style='margin-top:20px;padding-top:20px;border-top:1px solid #ddd'>";
  output += "<div style='font-family:cursive;font-size:24px;color:#DD0031'>VerTechie Academy</div>";
  output += "</div>";
  
  output += "</div></div>";
  
  // Stats
  output += "<div style='display:grid;grid-template-columns:repeat(4, 1fr);gap:15px;margin-bottom:20px'>";
  let stats = [
    { icon: '📚', label: 'Lessons', value: '85' },
    { icon: '⏱️', label: 'Hours', value: '45' },
    { icon: '✅', label: 'Exercises', value: '50+' },
    { icon: '🧠', label: 'Quizzes', value: '16' }
  ];
  stats.forEach(function(stat) {
    output += "<div style='background:#f5f5f5;padding:20px;border-radius:8px;text-align:center'>";
    output += "<div style='font-size:32px'>" + stat.icon + "</div>";
    output += "<div style='font-size:24px;font-weight:bold;color:#DD0031'>" + stat.value + "</div>";
    output += "<div style='font-size:14px;color:#666'>" + stat.label + "</div>";
    output += "</div>";
  });
  output += "</div>";
  
  // Share buttons
  output += "<div style='text-align:center'>";
  output += "<p style='color:#666'>Share your achievement!</p>";
  output += "<div style='display:flex;gap:10px;justify-content:center'>";
  output += "<button style='padding:12px 24px;background:#0077b5;color:white;border:none;border-radius:8px;cursor:pointer'>LinkedIn</button>";
  output += "<button style='padding:12px 24px;background:#1da1f2;color:white;border:none;border-radius:8px;cursor:pointer'>Twitter</button>";
  output += "<button style='padding:12px 24px;background:#4caf50;color:white;border:none;border-radius:8px;cursor:pointer'>Download PDF</button>";
  output += "</div></div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },

    // Enterprise Case Studies lesson
    'case-studies': {
      title: 'Enterprise Case Studies',
      content: `# Angular Enterprise Case Studies

Real-world examples of Angular at scale.

---

## Case Study 1: Claims Management System
### Insurance / Healthcare

**Business Context**: National insurance provider's Claims Platform

**Users**: Claims agents, Supervisors, Auditors, External partners

**Technical Challenges**:
- Complex multi-step forms
- Heavy role-based access control
- Large datasets with pagination
- Strict audit compliance
- Performance issues in legacy AngularJS

**Angular Solution**:
\`\`\`
/app
├── core/         (Singleton services)
├── shared/       (UI library)
├── claims/       (Feature module)
├── payments/     (Lazy loaded)
├── audit/        (Lazy loaded)
└── auth/         (Guards, interceptors)
\`\`\`

**Key Features Used**:
- Reactive Forms with FormArray
- AuthGuard + RoleGuard
- HTTP Interceptors for JWT
- Custom pipes for data masking
- OnPush change detection

**Results**:
- ⬇️ 45% reduction in page load time
- ⬇️ 60% fewer production UI bugs
- ⬆️ 30% agent productivity
- Passed HIPAA & SOC audits

---

## Case Study 2: Banking Admin Dashboard
### Finance / Risk

**Business Context**: Real-time monitoring dashboard for Tier-1 bank

**Features**: Transactions, Fraud alerts, Risk thresholds

**Challenges**:
- Real-time data updates
- Avoiding excessive re-renders
- Strict performance SLAs
- Multiple microservices integration

**Angular Solution**:
- Standalone components
- Service-based state management
- RxJS streams for live data
- Signals for UI reactivity
- Dynamic widget components

**Results**:
- ⬆️ Real-time latency < 300ms
- ⬇️ 40% CPU usage
- Zero downtime releases

---

## Case Study 3: Airline Operations Control
### Logistics / Aviation

**Mission Critical**: Flight schedules, Crew assignments, Disruptions

**Challenges**:
- Massive datasets (1000s of flights)
- Frequent UI updates
- Complex conditional rendering
- Offline tolerance

**Angular Solution**:
- Domain-driven modules
- Local caching strategy
- TrackBy optimization
- Angular Animations
- Resolver-based routing

**Results**:
- Near-zero screen freeze
- Faster disruption resolution
- Operator confidence increased

---

## Case Study 4: Government Grants System
### Public Sector

**Context**: 10+ year lifecycle application

**Requirements**:
- Frequent regulatory changes
- Multiple user roles
- Accessibility compliance
- High testability

**Angular Solution**:
- Strict CLI governance
- Versioned feature modules
- Strong TypeScript typing
- SSR for accessibility
- AOT builds

**Results**:
- Passed multiple audits
- Minimal regression during upgrades
- Predictable maintenance cost

---

## Case Study 5: Multi-Tenant SaaS Portal

**Challenges**:
- Tenant isolation
- Feature toggles
- Dynamic configuration
- White-label theming

**Angular Solution**:
- Tenant-aware services
- Injection tokens
- Route resolvers
- Runtime theming
- Signals for tenant state

**Results**:
- Faster tenant onboarding
- Reduced code duplication
- Product scalability improved
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Enterprise Angular Architecture</h2>
<div id="demo"></div>

<script>
// Case Study: Claims Management Architecture

let architecture = {
  core: {
    name: "Core Module",
    description: "Singleton services, guards, interceptors",
    items: ["AuthService", "LogService", "AuthGuard", "HttpInterceptor"]
  },
  shared: {
    name: "Shared Module",
    description: "Reusable UI components",
    items: ["ButtonComponent", "ModalComponent", "DataTableComponent", "FormFieldComponent"]
  },
  features: [
    { name: "Claims", lazy: true, routes: ["/claims", "/claims/:id"] },
    { name: "Payments", lazy: true, routes: ["/payments"] },
    { name: "Audit", lazy: true, routes: ["/audit"] },
    { name: "Auth", lazy: false, routes: ["/login", "/logout"] }
  ]
};

let metrics = [
  { label: "Page Load Time", before: "4.2s", after: "2.3s", improvement: "-45%" },
  { label: "Production Bugs", before: "23/month", after: "9/month", improvement: "-60%" },
  { label: "Agent Productivity", before: "Base", after: "+30%", improvement: "+30%" },
  { label: "Bundle Size", before: "2.8MB", after: "1.1MB", improvement: "-61%" }
];

function render() {
  let output = "";
  
  // Architecture Diagram
  output += "<div style='background:#1e1e1e;padding:20px;border-radius:8px;margin-bottom:20px'>";
  output += "<h4 style='color:#4ec9b0;margin-top:0'>🏗️ Enterprise Module Architecture</h4>";
  
  output += "<div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:15px;margin-top:15px'>";
  
  // Core Module
  output += "<div style='background:#2d2d2d;padding:15px;border-radius:8px;border:2px solid #DD0031'>";
  output += "<h5 style='color:#DD0031;margin:0 0 10px 0'>📦 " + architecture.core.name + "</h5>";
  output += "<p style='color:#888;font-size:12px;margin:0 0 10px 0'>" + architecture.core.description + "</p>";
  architecture.core.items.forEach(function(item) {
    output += "<div style='padding:5px 10px;background:#333;border-radius:4px;margin:5px 0;color:#9cdcfe;font-size:12px'>" + item + "</div>";
  });
  output += "</div>";
  
  // Shared Module
  output += "<div style='background:#2d2d2d;padding:15px;border-radius:8px;border:2px solid #4caf50'>";
  output += "<h5 style='color:#4caf50;margin:0 0 10px 0'>📦 " + architecture.shared.name + "</h5>";
  output += "<p style='color:#888;font-size:12px;margin:0 0 10px 0'>" + architecture.shared.description + "</p>";
  architecture.shared.items.forEach(function(item) {
    output += "<div style='padding:5px 10px;background:#333;border-radius:4px;margin:5px 0;color:#9cdcfe;font-size:12px'>" + item + "</div>";
  });
  output += "</div>";
  
  // Feature Modules
  architecture.features.forEach(function(feature) {
    let color = feature.lazy ? "#2196f3" : "#ff9800";
    output += "<div style='background:#2d2d2d;padding:15px;border-radius:8px;border:2px solid " + color + "'>";
    output += "<h5 style='color:" + color + ";margin:0 0 10px 0'>📦 " + feature.name + "Module";
    if (feature.lazy) output += " <span style='font-size:10px;background:" + color + ";color:white;padding:2px 6px;border-radius:3px'>LAZY</span>";
    output += "</h5>";
    output += "<div style='color:#888;font-size:12px'>";
    feature.routes.forEach(function(route) {
      output += "<div style='padding:3px 0'>→ " + route + "</div>";
    });
    output += "</div>";
    output += "</div>";
  });
  
  output += "</div>";
  output += "</div>";
  
  // Metrics
  output += "<div style='background:#fff;padding:20px;border-radius:8px;border:1px solid #ddd;margin-bottom:20px'>";
  output += "<h4 style='margin-top:0'>📊 Performance Improvements</h4>";
  output += "<table style='width:100%;border-collapse:collapse'>";
  output += "<tr style='background:#DD0031;color:white'><th style='padding:10px;text-align:left'>Metric</th><th style='padding:10px'>Before</th><th style='padding:10px'>After</th><th style='padding:10px'>Change</th></tr>";
  
  metrics.forEach(function(metric) {
    let isPositive = metric.improvement.startsWith("-") || metric.improvement.startsWith("+3");
    output += "<tr>";
    output += "<td style='padding:12px;border-bottom:1px solid #eee'>" + metric.label + "</td>";
    output += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center;color:#666'>" + metric.before + "</td>";
    output += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center'>" + metric.after + "</td>";
    output += "<td style='padding:12px;border-bottom:1px solid #eee;text-align:center;color:" + (isPositive ? "#4caf50" : "#f44336") + ";font-weight:bold'>" + metric.improvement + "</td>";
    output += "</tr>";
  });
  
  output += "</table>";
  output += "</div>";
  
  // Key Takeaways
  output += "<div style='background:#e8f5e9;padding:20px;border-radius:8px'>";
  output += "<h4 style='margin-top:0;color:#2e7d32'>✅ Enterprise Angular Patterns</h4>";
  output += "<ul style='margin:0;padding-left:20px'>";
  output += "<li>Feature-based module organization</li>";
  output += "<li>Lazy loading for performance</li>";
  output += "<li>Core module for singletons</li>";
  output += "<li>Shared module for UI components</li>";
  output += "<li>Guards for security</li>";
  output += "<li>Interceptors for cross-cutting concerns</li>";
  output += "<li>OnPush change detection</li>";
  output += "<li>TrackBy for list performance</li>";
  output += "</ul>";
  output += "</div>";
  
  document.getElementById("demo").innerHTML = output;
}

render();
</script>

</body>
</html>`,
    },
  };

  return angularLessons[lessonSlug] || {
    title: 'Coming Soon',
    content: '## This lesson is coming soon!\n\nCheck back later for this content.',
    tryItCode: '<!-- Coming soon -->',
  };
};

// Comprehensive Python lesson content generator