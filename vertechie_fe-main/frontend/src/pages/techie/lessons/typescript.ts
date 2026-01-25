export const generateTSLessonContent = (lessonSlug: string) => {
  const tsLessons: Record<string, any> = {
    home: {
      title: 'TypeScript Tutorial',
      content: `## TypeScript Tutorial

Welcome to the **TypeScript 0 → Hero Mastery Program**!

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.

## Why TypeScript?

- **Type Safety** - Catch errors before runtime
- **Better Tooling** - IntelliSense, refactoring, navigation
- **Enterprise Standard** - Required by most large companies
- **Future JavaScript** - Use tomorrow's features today

## What You'll Learn

1. **Type System Foundations** - Core types and inference
2. **Data Structures** - Arrays, tuples, objects, enums
3. **Composition** - Interfaces, unions, intersections
4. **Generics** - Reusable, type-safe code
5. **Advanced Types** - Conditional, mapped, literal types
6. **Real-World Integration** - Node.js, React, tooling

## Outcome

By the end, you will:
- Design APIs with bulletproof types
- Refactor large systems safely
- Read framework typings confidently
- Prevent runtime bugs before deployment
- Excel in senior TypeScript interviews

Let's begin your TypeScript mastery journey! 🚀`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Basics</h2>
<p>TypeScript compiles to JavaScript:</p>
<pre id="demo"></pre>

<script>
// This is the compiled JavaScript from TypeScript
// TypeScript: let message: string = "Hello TypeScript!";
// Compiles to JavaScript:
let message = "Hello TypeScript!";
document.getElementById("demo").innerHTML = message;
</script>

</body>
</html>`,
    },
    introduction: {
      title: 'TS Introduction',
      content: `## What is TypeScript?

TypeScript is a **typed superset of JavaScript** that compiles to plain JavaScript.

### The Key Concept

\`\`\`
TypeScript = JavaScript + Static Types
\`\`\`

### Why Enterprises Mandate TypeScript

1. **Compile-Time Error Detection**
   - Catch bugs before they reach production
   - No more "undefined is not a function"

2. **Better Developer Experience**
   - IntelliSense and autocomplete
   - Confident refactoring
   - Self-documenting code

3. **Scalability**
   - Teams can work on large codebases
   - API contracts are enforced

### What TypeScript Actually Is

\`\`\`typescript
// TypeScript adds type annotations
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// This would cause a compile-time error:
// name = 42;  // Error: Type 'number' is not assignable to type 'string'
\`\`\`

### Compile-Time vs Runtime

| Compile-Time (TypeScript) | Runtime (JavaScript) |
|---------------------------|----------------------|
| Type checking             | No type checking     |
| Catches type errors       | Errors crash the app |
| Development time          | Execution time       |

### Where TypeScript Stops

Important: TypeScript types are **erased at runtime**!

\`\`\`typescript
// This TypeScript...
function greet(name: string): string {
  return "Hello, " + name;
}

// ...compiles to this JavaScript (no types!)
function greet(name) {
  return "Hello, " + name;
}
\`\`\`

TypeScript cannot:
- Validate API responses at runtime
- Guarantee types from external sources
- Replace runtime validation for user input

### Key Takeaway

TypeScript reduces production incidents by catching errors during development, but you still need runtime validation for external data.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Introduction</h2>
<div id="demo"></div>

<script>
// This is the compiled JavaScript from TypeScript

// TypeScript version:
// function greet(name: string): string {
//   return "Hello, " + name + "!";
// }

// Compiled JavaScript:
function greet(name) {
  return "Hello, " + name + "!";
}

// TypeScript would catch this error at compile time:
// greet(42);  // Error!

// But valid calls work fine:
document.getElementById("demo").innerHTML = greet("TypeScript");
</script>

</body>
</html>`,
    },
    'get-started': {
      title: 'TS Get Started',
      content: `## Getting Started with TypeScript

### Installing TypeScript

\`\`\`bash
# Install globally
npm install -g typescript

# Or in a project
npm install --save-dev typescript

# Check version
tsc --version
\`\`\`

### Your First TypeScript File

Create a file named \`hello.ts\`:

\`\`\`typescript
// hello.ts
let message: string = "Hello, TypeScript!";
console.log(message);
\`\`\`

### Compiling TypeScript

\`\`\`bash
# Compile to JavaScript
tsc hello.ts

# This creates hello.js
\`\`\`

### The Compile → JS Mental Model

\`\`\`
TypeScript (.ts)  →  tsc compiler  →  JavaScript (.js)
     ↓                    ↓                  ↓
  Your code          Type check           Browser/Node
  with types         & compile            runs this
\`\`\`

### Watch Mode

\`\`\`bash
# Auto-compile on file changes
tsc hello.ts --watch
\`\`\`

### Project Setup

\`\`\`bash
# Initialize a TypeScript project
tsc --init

# This creates tsconfig.json
\`\`\`

### Running TypeScript Directly

\`\`\`bash
# Using ts-node (no manual compile step)
npm install -g ts-node
ts-node hello.ts
\`\`\`

### Quick Start Example

\`\`\`typescript
// Basic types
let name: string = "Alice";
let age: number = 30;
let isStudent: boolean = false;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: string[] = ["Alice", "Bob"];

// Functions
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(5, 3));  // 8
\`\`\`

### Key Commands

| Command | Description |
|---------|-------------|
| \`tsc\` | Compile all files in project |
| \`tsc file.ts\` | Compile specific file |
| \`tsc --watch\` | Watch mode |
| \`tsc --init\` | Create tsconfig.json |`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Get Started</h2>
<div id="demo"></div>

<script>
// Compiled TypeScript to JavaScript

// Original TypeScript:
// let greeting: string = "Welcome to TypeScript!";
// let version: number = 5.3;
// 
// function showInfo(text: string, ver: number): string {
//   return text + " Version: " + ver;
// }

// Compiled JavaScript:
let greeting = "Welcome to TypeScript!";
let version = 5.3;

function showInfo(text, ver) {
  return text + " Version: " + ver;
}

document.getElementById("demo").innerHTML = showInfo(greeting, version);
</script>

</body>
</html>`,
    },
    configuration: {
      title: 'TS Configuration',
      content: `## TypeScript Configuration

**This is where most courses fail.** Understanding \`tsconfig.json\` is critical.

### Creating tsconfig.json

\`\`\`bash
tsc --init
\`\`\`

### Essential tsconfig.json

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "sourceMap": true,
    "resolveJsonModule": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
\`\`\`

### Strict Mode (Non-Negotiable)

\`strict: true\` enables all strict type-checking options:

| Option | What It Does |
|--------|--------------|
| \`strictNullChecks\` | null/undefined handled explicitly |
| \`noImplicitAny\` | No implicit any types |
| \`strictFunctionTypes\` | Strict function parameter checking |
| \`strictBindCallApply\` | Strict bind/call/apply |
| \`strictPropertyInitialization\` | Class properties must be initialized |

### Target Options

\`\`\`json
{
  "target": "ES5"      // IE11 compatible
  "target": "ES2015"   // Modern browsers
  "target": "ES2020"   // Node 14+
  "target": "ESNext"   // Latest features
}
\`\`\`

### Module Options

\`\`\`json
{
  "module": "commonjs"  // Node.js (require/exports)
  "module": "ES2020"    // ES Modules (import/export)
  "module": "NodeNext"  // Node.js with ESM support
}
\`\`\`

### Key Takeaway

Always use \`strict: true\`. It's the difference between "TypeScript-flavored JavaScript" and actual type safety.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Configuration</h2>
<pre id="demo"></pre>

<script>
// With strict mode, TypeScript catches many errors

// Without strict mode, this would be allowed:
// let value;  // implicitly 'any'
// value.doSomething();  // runtime error!

// With strict mode (noImplicitAny):
// let value;  // Error: Variable 'value' implicitly has 'any' type

// Proper TypeScript:
let value = "Hello";  // inferred as string
let output = "Configuration Examples:\\n\\n";
output += "Target: ES2020\\n";
output += "Module: commonjs\\n";
output += "Strict: true (always!)\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'simple-types': {
      title: 'TS Simple Types',
      content: `## TypeScript Simple Types

The foundation of TypeScript's type system.

### The Three Primitives

\`\`\`typescript
// String
let firstName: string = "Alice";
let greeting: string = \`Hello, \${firstName}\`;

// Number (integers and floats)
let age: number = 30;
let price: number = 19.99;
let hex: number = 0xf00d;

// Boolean
let isActive: boolean = true;
let hasPermission: boolean = false;
\`\`\`

### The Dangerous \`any\`

\`\`\`typescript
// any disables type checking - AVOID!
let dangerous: any = "hello";
dangerous = 42;           // No error
dangerous = { x: 1 };     // No error
dangerous.foo.bar.baz;    // No error, but RUNTIME CRASH!

// Why any is dangerous:
// - Defeats the purpose of TypeScript
// - Hides bugs until runtime
// - Makes refactoring unsafe
\`\`\`

### The Powerful \`unknown\`

\`\`\`typescript
// unknown is the type-safe counterpart of any
let value: unknown = "hello";

// Cannot use directly - must check type first!
// value.toUpperCase();  // Error!

// Type narrowing required
if (typeof value === "string") {
  console.log(value.toUpperCase());  // OK!
}

// unknown is safe because it forces you to validate
\`\`\`

### any vs unknown

| Feature | any | unknown |
|---------|-----|---------|
| Accepts any value | ✅ | ✅ |
| Can use without check | ✅ | ❌ |
| Type-safe | ❌ | ✅ |
| Recommended | ❌ | ✅ |

### Type Inference

TypeScript can infer types from values:

\`\`\`typescript
// Explicit typing
let explicit: string = "hello";

// Implicit typing (inferred)
let inferred = "hello";  // TypeScript knows it's string

// Both are equivalent!
\`\`\`

### When to Use Each

\`\`\`typescript
// Use string for text
let name: string = "Alice";

// Use number for any numeric value
let count: number = 42;

// Use boolean for true/false
let isValid: boolean = true;

// Use unknown for values from external sources
let userInput: unknown = JSON.parse(data);

// NEVER use any (unless you really have to)
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Simple Types</h2>
<pre id="demo"></pre>

<script>
// Compiled TypeScript showing type usage

// TypeScript:
// let name: string = "Alice";
// let age: number = 30;
// let isActive: boolean = true;

// JavaScript (types erased):
let name = "Alice";
let age = 30;
let isActive = true;

let output = "Simple Types Demo:\\n\\n";
output += "name: " + name + " (string)\\n";
output += "age: " + age + " (number)\\n";
output += "isActive: " + isActive + " (boolean)\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'explicit-inference': {
      title: 'TS Explicit & Inference',
      content: `## Explicit Types vs Type Inference

Understanding when to write types and when to let TypeScript infer them.

### Type Inference in Action

\`\`\`typescript
// TypeScript infers the type from the value
let message = "Hello";      // inferred: string
let count = 42;             // inferred: number
let items = [1, 2, 3];      // inferred: number[]
let user = { name: "Bob" }; // inferred: { name: string }
\`\`\`

### Explicit Typing

\`\`\`typescript
// You explicitly declare the type
let message: string = "Hello";
let count: number = 42;
let items: number[] = [1, 2, 3];
let user: { name: string } = { name: "Bob" };
\`\`\`

### When to Trust Inference

✅ **Trust inference when:**

\`\`\`typescript
// Variable initialization with clear values
let name = "Alice";           // Obviously string
let numbers = [1, 2, 3];      // Obviously number[]

// Return types of simple functions
const double = (x: number) => x * 2;  // Return: number (inferred)

// Object literals
const config = {
  debug: true,
  port: 3000
};  // Type inferred correctly
\`\`\`

### When to Use Explicit Types

✅ **Use explicit types when:**

\`\`\`typescript
// Function parameters (always!)
function greet(name: string): string {
  return "Hello, " + name;
}

// Empty arrays
let items: string[] = [];  // Without type: never[]

// Variables that might be reassigned
let value: string | number = "hello";
value = 42;  // OK because we declared union

// API responses
interface User {
  id: number;
  name: string;
}
const user: User = await fetchUser();

// Complex objects
const config: ServerConfig = {
  port: 3000,
  host: "localhost"
};
\`\`\`

### The Golden Rules

1. **Always type function parameters**
2. **Let inference handle obvious cases**
3. **Type complex or unclear structures**
4. **Type empty collections**
5. **Type API boundaries**

### Return Type Inference

\`\`\`typescript
// Return type is inferred
function add(a: number, b: number) {
  return a + b;  // Returns number
}

// But explicit is safer for complex functions
function fetchUser(id: number): Promise<User> {
  // Makes the contract clear
  return api.get(\`/users/\${id}\`);
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Type Inference Demo</h2>
<pre id="demo"></pre>

<script>
// TypeScript infers types automatically

// These types are inferred:
let message = "Hello";        // string
let count = 42;               // number
let isActive = true;          // boolean
let numbers = [1, 2, 3];      // number[]

// Function with explicit parameter types
function greet(name) {  // In TS: name: string
  return "Hello, " + name;
}

let output = "Type Inference Examples:\\n\\n";
output += "message: " + typeof message + "\\n";
output += "count: " + typeof count + "\\n";
output += "isActive: " + typeof isActive + "\\n";
output += "numbers: " + (Array.isArray(numbers) ? "array" : typeof numbers) + "\\n";
output += "\\nGreeting: " + greet("TypeScript");

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'special-types': {
      title: 'TS Special Types',
      content: `## TypeScript Special Types

Master these for interviews and real-world TypeScript.

### \`any\` - The Escape Hatch

\`\`\`typescript
// any accepts anything - no type checking
let value: any = "hello";
value = 42;
value = { x: 1 };
value.anything.goes();  // No error, but crashes at runtime!

// When to use any (rarely):
// - Migrating JavaScript code incrementally
// - Working with truly dynamic data
// - Third-party libraries without types
\`\`\`

### \`unknown\` - The Safe Alternative

\`\`\`typescript
// unknown requires type checking before use
let value: unknown = getUserInput();

// Error: Cannot use unknown directly
// console.log(value.toUpperCase());

// Must narrow the type first
if (typeof value === "string") {
  console.log(value.toUpperCase());  // OK!
}

// Use unknown for:
// - API responses before validation
// - User input
// - Any external data
\`\`\`

### \`never\` - The Impossible Type

\`\`\`typescript
// never represents values that never occur

// Functions that never return
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// Exhaustiveness checking
type Shape = "circle" | "square";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return Math.PI * 10 * 10;
    case "square":
      return 10 * 10;
    default:
      // If we add new shape and forget to handle it,
      // TypeScript will error here!
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
\`\`\`

### \`void\` - No Return Value

\`\`\`typescript
// void means function doesn't return anything
function logMessage(message: string): void {
  console.log(message);
  // No return statement
}

// void vs undefined
function returnsVoid(): void {}
function returnsUndefined(): undefined {
  return undefined;
}
\`\`\`

### Quick Reference

| Type | Meaning | Use Case |
|------|---------|----------|
| \`any\` | Disables type checking | Migration, escape hatch |
| \`unknown\` | Unknown type, must check | External data |
| \`never\` | Never occurs | Exhaustive checks, errors |
| \`void\` | No return value | Side-effect functions |

### Interview Questions

**Q: What's the difference between any and unknown?**
A: \`any\` disables type checking, \`unknown\` requires narrowing before use.

**Q: When would you use never?**
A: Exhaustiveness checking and functions that never return.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Special Types Demo</h2>
<pre id="demo"></pre>

<script>
// Demonstrating TypeScript special types

let output = "Special Types in TypeScript:\\n\\n";

// unknown requires type checking
function processValue(value) {
  if (typeof value === "string") {
    return "String: " + value.toUpperCase();
  } else if (typeof value === "number") {
    return "Number: " + value * 2;
  }
  return "Unknown type";
}

output += "unknown example:\\n";
output += processValue("hello") + "\\n";
output += processValue(21) + "\\n\\n";

// void function
function logAndReturn(msg) {
  console.log(msg);
  // Returns undefined (void)
}

output += "void function: logAndReturn returns " + logAndReturn("test") + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'null': {
      title: 'TS Null & Undefined',
      content: `## Null and Undefined in TypeScript

One of TypeScript's most powerful features: \`strictNullChecks\`.

### The Problem Without Strict Null Checks

\`\`\`typescript
// Without strictNullChecks, this compiles fine:
let name: string = null;  // Allowed!
name.toUpperCase();       // Runtime crash!
\`\`\`

### With strictNullChecks (Recommended)

\`\`\`typescript
// With strictNullChecks: true in tsconfig.json

let name: string = null;  // Error! Type 'null' is not assignable

// Must explicitly allow null
let name: string | null = null;  // OK

// Now you must check before using
if (name !== null) {
  console.log(name.toUpperCase());  // Safe!
}
\`\`\`

### Optional Properties

\`\`\`typescript
interface User {
  name: string;
  email?: string;  // Optional = string | undefined
}

function sendEmail(user: User) {
  // user.email might be undefined
  if (user.email) {
    sendTo(user.email);  // Safe!
  }
}
\`\`\`

### Optional Chaining

\`\`\`typescript
const user: User | null = getUser();

// Old way (verbose)
if (user && user.address && user.address.city) {
  console.log(user.address.city);
}

// Optional chaining
console.log(user?.address?.city);  // undefined if any is null
\`\`\`

### Nullish Coalescing

\`\`\`typescript
// ?? returns right side only if left is null/undefined
let name = user.name ?? "Anonymous";

// Different from || which also triggers on "", 0, false
let count = data.count ?? 0;   // Only null/undefined → 0
let count = data.count || 0;   // Also "", 0, false → 0
\`\`\`

### Non-Null Assertion (Use Carefully!)

\`\`\`typescript
let element = document.getElementById("app");
// element is HTMLElement | null

// Non-null assertion (you're telling TS "trust me")
element!.innerHTML = "Hello";  // Risky!

// Better: check first
if (element) {
  element.innerHTML = "Hello";  // Safe
}
\`\`\`

### Defensive Programming Patterns

\`\`\`typescript
// Default values
function greet(name: string | null | undefined) {
  const safeName = name ?? "Guest";
  return \`Hello, \${safeName}\`;
}

// Early return
function processUser(user: User | null) {
  if (!user) {
    return;  // Exit early
  }
  // user is definitely User here
  console.log(user.name);
}

// Type narrowing
function getLength(value: string | null): number {
  if (value === null) {
    return 0;
  }
  return value.length;  // value is string here
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Null Safety Demo</h2>
<pre id="demo"></pre>

<script>
// Null-safe patterns in TypeScript

// Optional chaining
let user = { name: "Alice", address: { city: "NYC" } };
let city = user?.address?.city ?? "Unknown";

// Nullish coalescing
let value = null;
let result = value ?? "default";

// Safe function
function greet(name) {
  let safeName = name ?? "Guest";
  return "Hello, " + safeName + "!";
}

let output = "Null Safety Examples:\\n\\n";
output += "City: " + city + "\\n";
output += "Result: " + result + "\\n";
output += "Greet null: " + greet(null) + "\\n";
output += "Greet name: " + greet("TypeScript") + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 3 - Data Structures
    arrays: {
      title: 'TS Arrays',
      content: `## TypeScript Arrays

Typed arrays are the foundation of data handling in TypeScript.

### Basic Array Types

\`\`\`typescript
// Two syntaxes for array types
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Both are equivalent, number[] is more common
\`\`\`

### Array Type Inference

\`\`\`typescript
// TypeScript infers the type
let items = [1, 2, 3];        // number[]
let mixed = [1, "hello"];     // (string | number)[]

// Empty arrays need explicit type
let empty: string[] = [];     // Without type: never[]
\`\`\`

### Readonly Arrays

\`\`\`typescript
// Immutable arrays
const numbers: readonly number[] = [1, 2, 3];
// numbers.push(4);  // Error! Property 'push' does not exist

// Alternative syntax
const items: ReadonlyArray<string> = ["a", "b"];
\`\`\`

### Array Methods with Types

\`\`\`typescript
const numbers: number[] = [1, 2, 3, 4, 5];

// map preserves type
const doubled = numbers.map(n => n * 2);  // number[]

// filter preserves type
const even = numbers.filter(n => n % 2 === 0);  // number[]

// find returns element or undefined
const found = numbers.find(n => n > 3);  // number | undefined

// reduce needs explicit accumulator type sometimes
const sum = numbers.reduce((acc, n) => acc + n, 0);  // number
\`\`\`

### Multi-dimensional Arrays

\`\`\`typescript
// 2D array
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];

// 3D array
let cube: number[][][] = [[[1]]];
\`\`\`

### Array Generic Syntax

\`\`\`typescript
// Useful for complex element types
let users: Array<{ name: string; age: number }> = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 }
];
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Arrays</h2>
<pre id="demo"></pre>

<script>
// TypeScript arrays in action

let numbers = [1, 2, 3, 4, 5];
let names = ["Alice", "Bob", "Charlie"];

// Array methods
let doubled = numbers.map(n => n * 2);
let even = numbers.filter(n => n % 2 === 0);
let sum = numbers.reduce((acc, n) => acc + n, 0);

let output = "Array Examples:\\n\\n";
output += "Original: " + numbers.join(", ") + "\\n";
output += "Doubled: " + doubled.join(", ") + "\\n";
output += "Even: " + even.join(", ") + "\\n";
output += "Sum: " + sum + "\\n";
output += "Names: " + names.join(", ") + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    tuples: {
      title: 'TS Tuples',
      content: `## TypeScript Tuples

Fixed-length arrays with specific types at each position.

### Basic Tuples

\`\`\`typescript
// Tuple: fixed length, typed positions
let person: [string, number] = ["Alice", 30];

// Access by index
let name: string = person[0];  // "Alice"
let age: number = person[1];   // 30

// Type error if wrong type
// person[0] = 42;  // Error! Type 'number' is not assignable to type 'string'
\`\`\`

### Named Tuples (TypeScript 4.0+)

\`\`\`typescript
// Labels for clarity
type Person = [name: string, age: number, active: boolean];

const user: Person = ["Bob", 25, true];

// Labels are just documentation, access is still by index
console.log(user[0]);  // "Bob"
\`\`\`

### Optional Tuple Elements

\`\`\`typescript
// Optional elements at the end
type Response = [number, string, boolean?];

const success: Response = [200, "OK", true];
const error: Response = [500, "Error"];  // boolean is optional
\`\`\`

### Rest Elements in Tuples

\`\`\`typescript
// First element is string, rest are numbers
type StringAndNumbers = [string, ...number[]];

const data: StringAndNumbers = ["values", 1, 2, 3, 4, 5];
\`\`\`

### Tuple vs Array Decision

| Use Tuple When | Use Array When |
|---------------|----------------|
| Fixed structure | Variable length |
| Different types per position | Same type throughout |
| Position has meaning | Order doesn't matter |
| Like a row in database | Like a list |

### Common Use Cases

\`\`\`typescript
// Function returning multiple values
function getCoordinates(): [number, number] {
  return [10, 20];
}

const [x, y] = getCoordinates();

// React useState pattern
const [count, setCount]: [number, (n: number) => void] = useState(0);

// Key-value pairs
type Entry = [string, number];
const entries: Entry[] = [["a", 1], ["b", 2]];
\`\`\`

### Destructuring Tuples

\`\`\`typescript
const tuple: [string, number, boolean] = ["Alice", 30, true];

const [name, age, isActive] = tuple;
console.log(name);      // "Alice"
console.log(age);       // 30
console.log(isActive);  // true
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Tuples</h2>
<pre id="demo"></pre>

<script>
// Tuple examples

// Person tuple: [name, age]
let person = ["Alice", 30];

// Coordinate tuple: [x, y]
let point = [10, 20];

// Destructuring
let [name, age] = person;
let [x, y] = point;

// Function returning tuple
function divide(a, b) {
  return [Math.floor(a / b), a % b];  // [quotient, remainder]
}

let [quotient, remainder] = divide(17, 5);

let output = "Tuple Examples:\\n\\n";
output += "Person: " + name + ", " + age + "\\n";
output += "Point: (" + x + ", " + y + ")\\n";
output += "17 ÷ 5 = " + quotient + " remainder " + remainder + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'object-types': {
      title: 'TS Object Types',
      content: `## TypeScript Object Types

Structural typing for objects.

### Inline Object Types

\`\`\`typescript
// Define object shape inline
let user: { name: string; age: number } = {
  name: "Alice",
  age: 30
};
\`\`\`

### Structural Typing

TypeScript uses **structural typing** (duck typing):

\`\`\`typescript
interface Point {
  x: number;
  y: number;
}

// This works even without explicit interface
let p = { x: 10, y: 20, z: 30 };  // Has extra property

function printPoint(point: Point) {
  console.log(point.x, point.y);
}

printPoint(p);  // OK! Has required x and y
\`\`\`

### Optional Properties

\`\`\`typescript
interface User {
  name: string;
  email?: string;  // Optional
}

const user1: User = { name: "Alice" };  // OK
const user2: User = { name: "Bob", email: "bob@example.com" };  // OK
\`\`\`

### Readonly Properties

\`\`\`typescript
interface Config {
  readonly apiKey: string;
  readonly baseUrl: string;
}

const config: Config = {
  apiKey: "secret",
  baseUrl: "https://api.example.com"
};

// config.apiKey = "new";  // Error! Cannot assign to 'apiKey'
\`\`\`

### Excess Property Checks

\`\`\`typescript
interface Options {
  width: number;
  height: number;
}

// Error! Object literal with unknown property
// const opts: Options = { width: 100, height: 200, color: "red" };

// Workaround 1: Variable assignment
const extra = { width: 100, height: 200, color: "red" };
const opts: Options = extra;  // OK

// Workaround 2: Index signature
interface FlexibleOptions {
  width: number;
  height: number;
  [key: string]: any;  // Allow extra properties
}
\`\`\`

### Nested Objects

\`\`\`typescript
interface Company {
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  employees: {
    name: string;
    role: string;
  }[];
}
\`\`\`

### Methods in Object Types

\`\`\`typescript
interface Calculator {
  value: number;
  add(n: number): number;
  subtract: (n: number) => number;  // Alternative syntax
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Object Types</h2>
<pre id="demo"></pre>

<script>
// Object type examples

let user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

let company = {
  name: "TechCorp",
  address: {
    city: "San Francisco",
    country: "USA"
  }
};

let output = "Object Examples:\\n\\n";
output += "User: " + user.name + ", " + user.age + "\\n";
output += "Email: " + user.email + "\\n";
output += "Company: " + company.name + "\\n";
output += "Location: " + company.address.city + ", " + company.address.country + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    enums: {
      title: 'TS Enums',
      content: `## TypeScript Enums

Named constants for related values.

### Numeric Enums

\`\`\`typescript
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right    // 3
}

let move: Direction = Direction.Up;
console.log(move);  // 0
\`\`\`

### Custom Numeric Values

\`\`\`typescript
enum StatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500
}

console.log(StatusCode.OK);  // 200
\`\`\`

### String Enums

\`\`\`typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

console.log(Color.Red);  // "RED"
\`\`\`

### Const Enums (Better Performance)

\`\`\`typescript
const enum Direction {
  Up,
  Down,
  Left,
  Right
}

// Compiles to literal values (no runtime enum object)
let move = Direction.Up;  // Compiles to: let move = 0;
\`\`\`

### Why Many Teams Avoid Enums

\`\`\`typescript
// Problem 1: Numeric enums allow invalid values
enum Status { Active, Inactive }
let s: Status = 99;  // No error! 

// Problem 2: Adds runtime code

// Alternative: Union of literals (preferred by many)
type Direction = "up" | "down" | "left" | "right";
let move: Direction = "up";  // Type-safe, no runtime overhead

// Alternative: Const object
const COLORS = {
  Red: "RED",
  Green: "GREEN",
  Blue: "BLUE"
} as const;

type Color = typeof COLORS[keyof typeof COLORS];
\`\`\`

### When to Use Enums

✅ Use enums when:
- You need reverse mapping (number → name)
- Working with external APIs that use numbers
- You want IDE autocomplete

❌ Prefer union types when:
- You want the simplest solution
- You don't need runtime enum object
- Working in strict TypeScript environments

### Enum Best Practices

\`\`\`typescript
// Use string enums for clarity
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR"
}

// Use const enums for performance
const enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Enums</h2>
<pre id="demo"></pre>

<script>
// Simulating enum behavior in JavaScript

// Numeric enum equivalent
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3
};

// String enum equivalent
const Color = {
  Red: "RED",
  Green: "GREEN",
  Blue: "BLUE"
};

let output = "Enum Examples:\\n\\n";
output += "Direction.Up = " + Direction.Up + "\\n";
output += "Direction.Right = " + Direction.Right + "\\n";
output += "Color.Red = " + Color.Red + "\\n";
output += "Color.Blue = " + Color.Blue + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 4 - Composition
    'aliases-interfaces': {
      title: 'TS Aliases & Interfaces',
      content: `## Type Aliases vs Interfaces

Two ways to define types. Understanding when to use each.

### Type Aliases

\`\`\`typescript
// Type alias for primitives
type ID = string | number;
type Callback = (data: string) => void;

// Type alias for objects
type User = {
  name: string;
  age: number;
};

// Type alias for unions
type Status = "pending" | "active" | "completed";
\`\`\`

### Interfaces

\`\`\`typescript
// Interface for objects
interface User {
  name: string;
  age: number;
}

// Interfaces can extend
interface Employee extends User {
  employeeId: string;
  department: string;
}
\`\`\`

### Key Differences

| Feature | type | interface |
|---------|------|-----------|
| Primitives | ✅ | ❌ |
| Unions | ✅ | ❌ |
| Objects | ✅ | ✅ |
| Extends | Intersection (&) | extends |
| Declaration merging | ❌ | ✅ |
| Computed properties | ✅ | ❌ |

### Extension vs Intersection

\`\`\`typescript
// Interface: extends
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

// Type: intersection
type Animal = { name: string };
type Dog = Animal & { breed: string };
\`\`\`

### Declaration Merging (Interface Only)

\`\`\`typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// User now has both name and age!
const user: User = { name: "Alice", age: 30 };
\`\`\`

### Real-World Decision Rules

1. **Use \`interface\`** for public API definitions
2. **Use \`interface\`** when extending third-party types
3. **Use \`type\`** for unions and intersections
4. **Use \`type\`** for primitives and tuples
5. **Be consistent** within your codebase

### Common Patterns

\`\`\`typescript
// Type for React props
type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

// Interface for class implementation
interface Repository<T> {
  find(id: string): Promise<T>;
  save(item: T): Promise<void>;
}

class UserRepository implements Repository<User> {
  async find(id: string) { /* ... */ }
  async save(user: User) { /* ... */ }
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Type Aliases vs Interfaces</h2>
<pre id="demo"></pre>

<script>
// Demonstrating type concepts in JavaScript

// In TypeScript, these would be type definitions:
// type ID = string | number;
// interface User { name: string; age: number; }

// Runtime JavaScript just uses objects
let user = { name: "Alice", age: 30 };
let employee = { ...user, employeeId: "E001", department: "Engineering" };

let output = "Type Aliases & Interfaces Demo:\\n\\n";
output += "User: " + JSON.stringify(user) + "\\n\\n";
output += "Employee (extends User):\\n";
output += JSON.stringify(employee, null, 2);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'union-types': {
      title: 'TS Union Types',
      content: `## TypeScript Union Types

One of TypeScript's most powerful features.

### Basic Unions

\`\`\`typescript
// Variable can be string OR number
let id: string | number;
id = "abc";  // OK
id = 123;    // OK
// id = true;   // Error!

// Function parameter
function printId(id: string | number) {
  console.log("ID:", id);
}
\`\`\`

### Narrowing Union Types

\`\`\`typescript
function printId(id: string | number) {
  // Must narrow before using type-specific methods
  if (typeof id === "string") {
    console.log(id.toUpperCase());  // OK - string method
  } else {
    console.log(id.toFixed(2));     // OK - number method
  }
}
\`\`\`

### Discriminated Unions (Tagged Unions)

\`\`\`typescript
// Each type has a "discriminant" property
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}
\`\`\`

### Exhaustiveness Checking

\`\`\`typescript
function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
    default:
      // If we add a new shape and forget to handle it,
      // TypeScript will error here!
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
\`\`\`

### Literal Type Unions

\`\`\`typescript
type Direction = "north" | "south" | "east" | "west";
type Status = "pending" | "approved" | "rejected";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function move(direction: Direction) {
  console.log("Moving", direction);
}

move("north");  // OK
// move("up");  // Error! Not in union
\`\`\`

### Union with null/undefined

\`\`\`typescript
function getUser(id: string): User | null {
  const user = database.find(id);
  return user ?? null;
}

const user = getUser("123");
if (user) {
  console.log(user.name);  // Narrowed to User
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Union Types Demo</h2>
<pre id="demo"></pre>

<script>
// Demonstrating union type concepts

// Function that handles union types
function formatId(id) {
  if (typeof id === "string") {
    return "String ID: " + id.toUpperCase();
  } else {
    return "Number ID: " + id.toFixed(0);
  }
}

// Discriminated union pattern
function getShapeArea(shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
    case "rectangle":
      return shape.width * shape.height;
  }
}

let circle = { kind: "circle", radius: 5 };
let square = { kind: "square", size: 4 };

let output = "Union Types Examples:\\n\\n";
output += formatId("abc123") + "\\n";
output += formatId(42) + "\\n\\n";
output += "Circle area: " + getShapeArea(circle).toFixed(2) + "\\n";
output += "Square area: " + getShapeArea(square) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    keyof: {
      title: 'TS Keyof',
      content: `## TypeScript keyof Operator

Get union of keys from an object type.

### Basic keyof

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}

// keyof creates union of property names
type UserKeys = keyof User;  // "name" | "age" | "email"
\`\`\`

### Safe Property Access

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };

const name = getProperty(user, "name");  // string
const age = getProperty(user, "age");    // number
// getProperty(user, "invalid");  // Error!
\`\`\`

### Dynamic but Type-Safe Code

\`\`\`typescript
interface Settings {
  theme: "light" | "dark";
  fontSize: number;
  notifications: boolean;
}

function updateSetting<K extends keyof Settings>(
  settings: Settings,
  key: K,
  value: Settings[K]
): Settings {
  return { ...settings, [key]: value };
}

const settings: Settings = {
  theme: "light",
  fontSize: 14,
  notifications: true
};

// Type-safe updates
updateSetting(settings, "theme", "dark");      // OK
updateSetting(settings, "fontSize", 16);       // OK
// updateSetting(settings, "theme", 16);       // Error! string expected
// updateSetting(settings, "invalid", true);   // Error! not a valid key
\`\`\`

### keyof with typeof

\`\`\`typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  debug: false
};

// Get type of config object
type Config = typeof config;

// Get keys of that type
type ConfigKey = keyof typeof config;  // "apiUrl" | "timeout" | "debug"
\`\`\`

### Practical Examples

\`\`\`typescript
// Form validation
interface FormData {
  username: string;
  password: string;
  email: string;
}

type FormErrors = {
  [K in keyof FormData]?: string;
};

const errors: FormErrors = {
  email: "Invalid email format"
};

// Pick specific properties
type UserPreview = Pick<User, "name" | "email">;
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>keyof Operator Demo</h2>
<pre id="demo"></pre>

<script>
// Demonstrating keyof concepts

let user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Safe property accessor
function getProperty(obj, key) {
  return obj[key];
}

// Get all keys
let keys = Object.keys(user);

let output = "keyof Examples:\\n\\n";
output += "User keys: " + keys.join(", ") + "\\n\\n";
output += "Safe access:\\n";
keys.forEach(key => {
  output += "  " + key + ": " + getProperty(user, key) + "\\n";
});

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'index-signatures': {
      title: 'TS Index Signatures',
      content: `## TypeScript Index Signatures

Handle objects with dynamic keys.

### Basic Index Signature

\`\`\`typescript
// Object with any string key
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  hello: "world",
  foo: "bar"
};

dict["newKey"] = "newValue";  // OK
\`\`\`

### Mixed Properties

\`\`\`typescript
interface NamedDictionary {
  name: string;  // Required property
  [key: string]: string;  // Additional dynamic keys
}

const data: NamedDictionary = {
  name: "Config",
  setting1: "value1",
  setting2: "value2"
};
\`\`\`

### Number Index Signature

\`\`\`typescript
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ["a", "b", "c"];
console.log(arr[0]);  // "a"
\`\`\`

### Record Utility Type

\`\`\`typescript
// Cleaner than index signature for many cases
type UserRoles = Record<string, string[]>;

const roles: UserRoles = {
  admin: ["read", "write", "delete"],
  user: ["read"],
  guest: []
};

// With specific keys
type Theme = Record<"light" | "dark", { bg: string; text: string }>;
\`\`\`

### Safe Unknown Structures

\`\`\`typescript
// For API responses with unknown shape
interface APIResponse {
  success: boolean;
  data: {
    [key: string]: unknown;
  };
}

function handleResponse(response: APIResponse) {
  if (response.success) {
    const name = response.data["name"];
    if (typeof name === "string") {
      console.log("Name:", name);
    }
  }
}
\`\`\`

### Readonly Index Signature

\`\`\`typescript
interface FrozenConfig {
  readonly [key: string]: string;
}

const config: FrozenConfig = {
  api: "https://api.example.com"
};

// config["api"] = "new";  // Error! Index signature is readonly
\`\`\`

### Template Literal Index

\`\`\`typescript
// TypeScript 4.4+
type DataProps = {
  [K in \`data-\${string}\`]: string;
};

const props: DataProps = {
  "data-id": "123",
  "data-name": "test"
};
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Index Signatures Demo</h2>
<pre id="demo"></pre>

<script>
// Dictionary pattern

let dictionary = {};
dictionary["hello"] = "world";
dictionary["foo"] = "bar";

// Dynamic key access
function getValue(dict, key) {
  return dict[key] || "not found";
}

// Record-like structure
let userRoles = {
  admin: ["read", "write", "delete"],
  user: ["read"],
  guest: []
};

let output = "Index Signatures Examples:\\n\\n";
output += "Dictionary: " + JSON.stringify(dictionary) + "\\n\\n";
output += "Get 'hello': " + getValue(dictionary, "hello") + "\\n";
output += "Get 'missing': " + getValue(dictionary, "missing") + "\\n\\n";
output += "User Roles:\\n";
for (let role in userRoles) {
  output += "  " + role + ": " + userRoles[role].join(", ") + "\\n";
}

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 5 - Functions & Classes
    functions: {
      title: 'TS Functions',
      content: `## TypeScript Functions

Type-safe function definitions.

### Parameter Types

\`\`\`typescript
// Always type your parameters
function greet(name: string): string {
  return "Hello, " + name;
}

// Arrow function
const add = (a: number, b: number): number => a + b;
\`\`\`

### Optional Parameters

\`\`\`typescript
function greet(name: string, greeting?: string): string {
  return (greeting ?? "Hello") + ", " + name;
}

greet("Alice");           // "Hello, Alice"
greet("Bob", "Welcome");  // "Welcome, Bob"
\`\`\`

### Default Parameters

\`\`\`typescript
function greet(name: string, greeting: string = "Hello"): string {
  return greeting + ", " + name;
}

greet("Alice");        // "Hello, Alice"
greet("Bob", "Hi");    // "Hi, Bob"
\`\`\`

### Rest Parameters

\`\`\`typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3);      // 6
sum(1, 2, 3, 4, 5); // 15
\`\`\`

### Function Overloads

\`\`\`typescript
// Multiple signatures for different use cases
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

format("hello");  // "HELLO"
format(3.14159);  // "3.14"
\`\`\`

### Function Types

\`\`\`typescript
// Type alias for function
type Calculator = (a: number, b: number) => number;

const add: Calculator = (a, b) => a + b;
const multiply: Calculator = (a, b) => a * b;

// Callback types
function process(data: string, callback: (result: string) => void) {
  callback(data.toUpperCase());
}
\`\`\`

### Return Types

\`\`\`typescript
// Explicit return type
function divide(a: number, b: number): number {
  return a / b;
}

// Void for no return
function log(message: string): void {
  console.log(message);
}

// Never for functions that don't return
function fail(message: string): never {
  throw new Error(message);
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Functions</h2>
<pre id="demo"></pre>

<script>
// Function examples

function greet(name, greeting) {
  greeting = greeting || "Hello";
  return greeting + ", " + name;
}

function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

let add = (a, b) => a + b;
let multiply = (a, b) => a * b;

let output = "Function Examples:\\n\\n";
output += "greet('Alice'): " + greet("Alice") + "\\n";
output += "greet('Bob', 'Hi'): " + greet("Bob", "Hi") + "\\n";
output += "sum(1,2,3,4,5): " + sum(1,2,3,4,5) + "\\n";
output += "add(5, 3): " + add(5, 3) + "\\n";
output += "multiply(4, 7): " + multiply(4, 7) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    casting: {
      title: 'TS Casting',
      content: `## TypeScript Casting (Type Assertions)

Tell TypeScript you know better about a type.

### Basic Type Assertions

\`\`\`typescript
// Two syntaxes (both equivalent)
let value: unknown = "hello";

// as syntax (preferred)
let str1 = value as string;

// Angle bracket syntax (doesn't work in JSX)
let str2 = <string>value;
\`\`\`

### When Casting is Necessary

\`\`\`typescript
// DOM elements
const input = document.getElementById("name") as HTMLInputElement;
input.value = "Hello";

// API responses
interface User {
  name: string;
  age: number;
}
const user = JSON.parse(data) as User;
\`\`\`

### When Casting is Lying to the Compiler

\`\`\`typescript
// DANGEROUS: You're telling TypeScript to trust you
const value = "hello" as any as number;
// value is actually a string, but TS thinks it's number!

// This will crash at runtime:
// value.toFixed(2);  // Runtime error!
\`\`\`

### Safe vs Unsafe Assertions

\`\`\`typescript
// SAFE: Narrowing down from unknown
let data: unknown = await fetchData();
if (typeof data === "object" && data !== null) {
  const user = data as { name: string };
  console.log(user.name);
}

// UNSAFE: Forcing incompatible types
const num = "123" as unknown as number;  // BAD!
\`\`\`

### Non-Null Assertion

\`\`\`typescript
// The ! operator asserts value is not null/undefined
function process(value: string | null) {
  // You're telling TS "trust me, it's not null"
  console.log(value!.toUpperCase());  // Risky!
  
  // Better: check first
  if (value) {
    console.log(value.toUpperCase());  // Safe
  }
}
\`\`\`

### const Assertion

\`\`\`typescript
// Without as const
let config = { theme: "dark" };  // { theme: string }

// With as const - literal types, readonly
let config = { theme: "dark" } as const;  // { readonly theme: "dark" }
\`\`\`

### Best Practices

1. **Avoid double assertions** (\`as any as X\`)
2. **Prefer type guards** over assertions
3. **Use assertions for DOM** elements
4. **Validate before asserting** external data
5. **Document why** you need the assertion`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Type Casting Demo</h2>
<pre id="demo"></pre>

<script>
// Type assertion examples

// In TypeScript: let value: unknown = "hello";
let value = "hello";

// Safe assertion after type check
function processValue(val) {
  if (typeof val === "string") {
    return val.toUpperCase();  // Safe
  }
  if (typeof val === "number") {
    return val.toFixed(2);  // Safe
  }
  return "Unknown type";
}

// DOM element casting example
let input = document.createElement("input");
input.type = "text";
input.value = "TypeScript";

let output = "Type Casting Examples:\\n\\n";
output += "processValue('hello'): " + processValue("hello") + "\\n";
output += "processValue(3.14159): " + processValue(3.14159) + "\\n";
output += "Input value: " + input.value + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    classes: {
      title: 'TS Classes',
      content: `## TypeScript Classes

Object-oriented programming with type safety.

### Basic Class

\`\`\`typescript
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return \`Hello, I'm \${this.name}\`;
  }
}

const person = new Person("Alice", 30);
\`\`\`

### Access Modifiers

\`\`\`typescript
class User {
  public name: string;       // Accessible everywhere (default)
  private password: string;  // Only inside class
  protected id: number;      // Inside class and subclasses

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
    this.id = Math.random();
  }
}

const user = new User("Alice", "secret");
console.log(user.name);      // OK
// console.log(user.password);  // Error!
\`\`\`

### Readonly Properties

\`\`\`typescript
class Config {
  readonly apiUrl: string;
  readonly version: number;

  constructor(url: string, version: number) {
    this.apiUrl = url;
    this.version = version;
  }
}

const config = new Config("https://api.com", 1);
// config.apiUrl = "new";  // Error! Cannot assign to readonly
\`\`\`

### Parameter Properties (Shorthand)

\`\`\`typescript
// Shorthand constructor
class User {
  constructor(
    public name: string,
    private email: string,
    readonly id: number
  ) {}
}

// Equivalent to defining properties and assigning in constructor
\`\`\`

### Abstract Classes

\`\`\`typescript
abstract class Shape {
  abstract getArea(): number;  // Must be implemented
  
  describe(): string {
    return \`Area: \${this.getArea()}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

// const shape = new Shape();  // Error! Cannot instantiate abstract
const circle = new Circle(5);
\`\`\`

### Implements vs Extends

\`\`\`typescript
// Interface for contract
interface Printable {
  print(): void;
}

// implements: fulfill a contract
class Document implements Printable {
  print(): void {
    console.log("Printing...");
  }
}

// extends: inherit from parent class
class Employee extends Person {
  department: string;
  
  constructor(name: string, age: number, dept: string) {
    super(name, age);  // Call parent constructor
    this.department = dept;
  }
}
\`\`\`

### Static Members

\`\`\`typescript
class Counter {
  static count: number = 0;
  
  static increment() {
    Counter.count++;
  }
}

Counter.increment();
console.log(Counter.count);  // 1
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Classes</h2>
<pre id="demo"></pre>

<script>
// Class examples

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return "Hello, I'm " + this.name;
  }
}

class Employee extends Person {
  constructor(name, age, department) {
    super(name, age);
    this.department = department;
  }
  
  greet() {
    return super.greet() + " from " + this.department;
  }
}

let person = new Person("Alice", 30);
let employee = new Employee("Bob", 25, "Engineering");

let output = "Class Examples:\\n\\n";
output += "Person: " + person.greet() + "\\n";
output += "Employee: " + employee.greet() + "\\n";
output += "\\nPerson age: " + person.age + "\\n";
output += "Employee dept: " + employee.department + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 6 - Generics
    'basic-generics': {
      title: 'TS Basic Generics',
      content: `## TypeScript Generics

Write reusable, type-safe code.

### The Problem Without Generics

\`\`\`typescript
// Without generics - lose type information
function identity(value: any): any {
  return value;
}

let result = identity("hello");  // result is any 😢
\`\`\`

### Generic Functions

\`\`\`typescript
// With generics - preserve type information
function identity<T>(value: T): T {
  return value;
}

let str = identity("hello");   // str is string
let num = identity(42);        // num is number
let obj = identity({ x: 1 });  // obj is { x: number }
\`\`\`

### Generic Interfaces

\`\`\`typescript
interface Box<T> {
  value: T;
  getValue(): T;
}

const stringBox: Box<string> = {
  value: "hello",
  getValue() { return this.value; }
};

const numberBox: Box<number> = {
  value: 42,
  getValue() { return this.value; }
};
\`\`\`

### Generic Classes

\`\`\`typescript
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
  
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop());  // 2

const stringStack = new Stack<string>();
stringStack.push("hello");
\`\`\`

### Generic Constraints

\`\`\`typescript
// Constrain T to have a length property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): T {
  console.log(value.length);
  return value;
}

logLength("hello");     // OK - string has length
logLength([1, 2, 3]);   // OK - array has length
// logLength(123);      // Error! number has no length
\`\`\`

### Multiple Type Parameters

\`\`\`typescript
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const p1 = pair("name", "Alice");  // [string, string]
const p2 = pair(1, true);          // [number, boolean]
\`\`\`

### Default Type Parameters

\`\`\`typescript
interface Response<T = any> {
  data: T;
  status: number;
}

let r1: Response = { data: "anything", status: 200 };
let r2: Response<User> = { data: { name: "Alice" }, status: 200 };
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Generics</h2>
<pre id="demo"></pre>

<script>
// Generic-like patterns in JavaScript

// Generic identity function
function identity(value) {
  return value;
}

// Generic Stack class
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}

let stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);

let output = "Generics Examples:\\n\\n";
output += "identity('hello'): " + identity("hello") + "\\n";
output += "identity(42): " + identity(42) + "\\n\\n";
output += "Stack operations:\\n";
output += "  push(1), push(2), push(3)\\n";
output += "  pop(): " + stack.pop() + "\\n";
output += "  peek(): " + stack.peek() + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'utility-types': {
      title: 'TS Utility Types',
      content: `## TypeScript Utility Types

Built-in types for common transformations. **Used everywhere in enterprise code.**

### Partial<T>

Make all properties optional:

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age: number;
}

// All properties optional
type PartialUser = Partial<User>;
// { name?: string; email?: string; age?: number }

function updateUser(user: User, updates: Partial<User>) {
  return { ...user, ...updates };
}
\`\`\`

### Required<T>

Make all properties required:

\`\`\`typescript
interface Config {
  debug?: boolean;
  verbose?: boolean;
}

type RequiredConfig = Required<Config>;
// { debug: boolean; verbose: boolean }
\`\`\`

### Pick<T, K>

Select specific properties:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Pick<User, "id" | "name">;
// { id: number; name: string }
\`\`\`

### Omit<T, K>

Remove specific properties:

\`\`\`typescript
type SafeUser = Omit<User, "password">;
// { id: number; name: string; email: string }
\`\`\`

### Record<K, T>

Create object type with specific keys:

\`\`\`typescript
type Roles = "admin" | "user" | "guest";
type Permissions = Record<Roles, string[]>;

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};
\`\`\`

### Readonly<T>

Make all properties readonly:

\`\`\`typescript
interface Config {
  apiUrl: string;
  timeout: number;
}

const config: Readonly<Config> = {
  apiUrl: "https://api.com",
  timeout: 5000
};

// config.apiUrl = "new";  // Error!
\`\`\`

### Extract & Exclude

\`\`\`typescript
type All = "a" | "b" | "c" | "d";

type OnlyAB = Extract<All, "a" | "b">;  // "a" | "b"
type NotAB = Exclude<All, "a" | "b">;   // "c" | "d"
\`\`\`

### ReturnType<T>

Get function return type:

\`\`\`typescript
function getUser() {
  return { name: "Alice", age: 30 };
}

type User = ReturnType<typeof getUser>;
// { name: string; age: number }
\`\`\`

### Practical Examples

\`\`\`typescript
// API update endpoint
type UpdatePayload<T> = Partial<Omit<T, "id" | "createdAt">>;

// Form state
type FormState<T> = {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
};
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Utility Types Demo</h2>
<pre id="demo"></pre>

<script>
// Utility type concepts in action

// Full user object
let user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  password: "secret"
};

// Pick-like: only public fields
function getPublicUser(user) {
  return { id: user.id, name: user.name };
}

// Omit-like: remove sensitive data
function getSafeUser(user) {
  let { password, ...safe } = user;
  return safe;
}

// Partial-like: update with some fields
function updateUser(user, updates) {
  return { ...user, ...updates };
}

let output = "Utility Types Examples:\\n\\n";
output += "Original: " + JSON.stringify(user) + "\\n\\n";
output += "Pick (public): " + JSON.stringify(getPublicUser(user)) + "\\n";
output += "Omit (safe): " + JSON.stringify(getSafeUser(user)) + "\\n";
output += "Partial update: " + JSON.stringify(updateUser(user, {name: "Bob"})) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 7 - Advanced Types
    'advanced-types': {
      title: 'TS Advanced Types',
      content: `## TypeScript Advanced Types

Elite-level type manipulation.

### Intersection Types

\`\`\`typescript
// Combine multiple types
interface Person {
  name: string;
  age: number;
}

interface Employee {
  employeeId: string;
  department: string;
}

type FullEmployee = Person & Employee;

const employee: FullEmployee = {
  name: "Alice",
  age: 30,
  employeeId: "E001",
  department: "Engineering"
};
\`\`\`

### Union Narrowing

\`\`\`typescript
function processValue(value: string | number | boolean) {
  // TypeScript narrows type in each branch
  if (typeof value === "string") {
    return value.toUpperCase();  // string methods
  }
  if (typeof value === "number") {
    return value.toFixed(2);     // number methods
  }
  return value ? "Yes" : "No";   // boolean
}
\`\`\`

### Recursive Types

\`\`\`typescript
// Tree structure
interface TreeNode {
  value: string;
  children?: TreeNode[];
}

const tree: TreeNode = {
  value: "root",
  children: [
    { value: "child1" },
    { 
      value: "child2",
      children: [{ value: "grandchild" }]
    }
  ]
};

// JSON type
type JSONValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JSONValue[] 
  | { [key: string]: JSONValue };
\`\`\`

### Discriminated Unions

\`\`\`typescript
type Result<T, E> = 
  | { success: true; data: T }
  | { success: false; error: E };

function handleResult<T>(result: Result<T, Error>) {
  if (result.success) {
    console.log(result.data);  // TypeScript knows data exists
  } else {
    console.error(result.error);  // TypeScript knows error exists
  }
}
\`\`\`

### Type Predicates

\`\`\`typescript
interface Cat { meow(): void; }
interface Dog { bark(): void; }

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function makeSound(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow();  // TypeScript knows it's Cat
  } else {
    animal.bark();  // TypeScript knows it's Dog
  }
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Advanced Types Demo</h2>
<pre id="demo"></pre>

<script>
// Advanced type patterns

// Intersection-like: combining objects
function merge(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

let person = { name: "Alice", age: 30 };
let employee = { employeeId: "E001", department: "Eng" };
let fullEmployee = merge(person, employee);

// Result type pattern
function divide(a, b) {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

let result1 = divide(10, 2);
let result2 = divide(10, 0);

let output = "Advanced Types Demo:\\n\\n";
output += "Merged: " + JSON.stringify(fullEmployee) + "\\n\\n";
output += "Result pattern:\\n";
output += "  10/2: " + JSON.stringify(result1) + "\\n";
output += "  10/0: " + JSON.stringify(result2) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'type-guards': {
      title: 'TS Type Guards',
      content: `## TypeScript Type Guards

Narrow types safely at runtime.

### typeof Guard

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // value is string here
    return value.toUpperCase();
  }
  // value is number here
  return value * 2;
}
\`\`\`

### instanceof Guard

\`\`\`typescript
class Dog { bark() { console.log("Woof!"); } }
class Cat { meow() { console.log("Meow!"); } }

function speak(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}
\`\`\`

### Custom Type Guards

\`\`\`typescript
interface Fish { swim(): void; }
interface Bird { fly(): void; }

// Type predicate: animal is Fish
function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim();  // TypeScript knows it's Fish
  } else {
    animal.fly();   // TypeScript knows it's Bird
  }
}
\`\`\`

### in Operator

\`\`\`typescript
interface A { propA: string; }
interface B { propB: number; }

function handle(obj: A | B) {
  if ("propA" in obj) {
    console.log(obj.propA);  // obj is A
  } else {
    console.log(obj.propB);  // obj is B
  }
}
\`\`\`

### Assertion Functions

\`\`\`typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error("Expected string!");
  }
}

function process(value: unknown) {
  assertIsString(value);
  // value is string after this point
  console.log(value.toUpperCase());
}
\`\`\`

### Truthiness Narrowing

\`\`\`typescript
function printLength(str: string | null | undefined) {
  if (str) {
    // str is string (not null/undefined/empty)
    console.log(str.length);
  }
}
\`\`\`

### Discriminated Union Guard

\`\`\`typescript
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.size ** 2;
  }
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Type Guards Demo</h2>
<pre id="demo"></pre>

<script>
// Type guard patterns

function processValue(value) {
  // typeof guard
  if (typeof value === "string") {
    return "String: " + value.toUpperCase();
  }
  if (typeof value === "number") {
    return "Number: " + value.toFixed(2);
  }
  if (typeof value === "boolean") {
    return "Boolean: " + (value ? "true" : "false");
  }
  if (Array.isArray(value)) {
    return "Array: [" + value.join(", ") + "]";
  }
  return "Other: " + typeof value;
}

let output = "Type Guards Examples:\\n\\n";
output += processValue("hello") + "\\n";
output += processValue(42.5) + "\\n";
output += processValue(true) + "\\n";
output += processValue([1, 2, 3]) + "\\n";
output += processValue({x: 1}) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'conditional-types': {
      title: 'TS Conditional Types',
      content: `## TypeScript Conditional Types

Compile-time type logic.

### Basic Syntax

\`\`\`typescript
// T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
\`\`\`

### Practical Example

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>;  // string
type B = NonNullable<number | undefined>;  // number
\`\`\`

### The infer Keyword

\`\`\`typescript
// Extract return type of function
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet() { return "hello"; }
type Greeting = GetReturnType<typeof greet>;  // string

// Extract array element type
type ArrayElement<T> = T extends (infer E)[] ? E : never;
type Elem = ArrayElement<string[]>;  // string
\`\`\`

### Distributive Conditional Types

\`\`\`typescript
type ToArray<T> = T extends any ? T[] : never;

// Distributes over union
type Result = ToArray<string | number>;  // string[] | number[]
\`\`\`

### Extract and Exclude

\`\`\`typescript
// Built-in conditional types
type Extract<T, U> = T extends U ? T : never;
type Exclude<T, U> = T extends U ? never : T;

type T1 = Extract<"a" | "b" | "c", "a" | "b">;  // "a" | "b"
type T2 = Exclude<"a" | "b" | "c", "a">;        // "b" | "c"
\`\`\`

### Real-World Examples

\`\`\`typescript
// API response typing
type APIResponse<T> = T extends "user" 
  ? { name: string; email: string }
  : T extends "post"
  ? { title: string; content: string }
  : never;

type UserResponse = APIResponse<"user">;
// { name: string; email: string }

// Promise unwrapping
type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;
type Result = Awaited<Promise<Promise<string>>>;  // string
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Conditional Types Demo</h2>
<pre id="demo"></pre>

<script>
// Runtime conditional logic (TypeScript does this at compile time)

function getTypeName(value) {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function processBasedOnType(value) {
  let type = getTypeName(value);
  switch (type) {
    case "string": return "String: " + value.toUpperCase();
    case "number": return "Number: " + value * 2;
    case "boolean": return "Boolean: " + !value;
    case "array": return "Array length: " + value.length;
    default: return "Type: " + type;
  }
}

let output = "Conditional Types Concepts:\\n\\n";
output += processBasedOnType("hello") + "\\n";
output += processBasedOnType(21) + "\\n";
output += processBasedOnType(false) + "\\n";
output += processBasedOnType([1,2,3]) + "\\n";
output += processBasedOnType(null) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'mapped-types': {
      title: 'TS Mapped Types',
      content: `## TypeScript Mapped Types

Transform types programmatically.

### Basic Mapped Type

\`\`\`typescript
// Transform each property
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

interface User {
  name: string;
  age: number;
}

type ReadonlyUser = Readonly<User>;
// { readonly name: string; readonly age: number }
\`\`\`

### Adding/Removing Modifiers

\`\`\`typescript
// Remove readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Remove optional
type Required<T> = {
  [K in keyof T]-?: T[K];
};
\`\`\`

### Key Remapping

\`\`\`typescript
// Prefix all keys
type Prefixed<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

interface User {
  name: string;
  age: number;
}

type UserGetters = Prefixed<User>;
// { getName: () => string; getAge: () => number }
\`\`\`

### Filter Properties

\`\`\`typescript
// Only keep string properties
type StringProperties<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
}

type OnlyStrings = StringProperties<Mixed>;
// { name: string; email: string }
\`\`\`

### Template Literal in Mapped Types

\`\`\`typescript
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
};

type Setters<T> = {
  [K in keyof T as \`set\${Capitalize<string & K>}\`]: (val: T[K]) => void
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }
\`\`\`

### Practical Examples

\`\`\`typescript
// Form errors type
type FormErrors<T> = {
  [K in keyof T]?: string;
};

// API update payload
type UpdatePayload<T> = Partial<Pick<T, {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]>>;
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Mapped Types Demo</h2>
<pre id="demo"></pre>

<script>
// Demonstrating mapped type concepts

let user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Create readonly version
function makeReadonly(obj) {
  return Object.freeze({ ...obj });
}

// Create getters
function createGetters(obj) {
  let getters = {};
  for (let key in obj) {
    getters["get" + key.charAt(0).toUpperCase() + key.slice(1)] = 
      () => obj[key];
  }
  return getters;
}

let frozenUser = makeReadonly(user);
let userGetters = createGetters(user);

let output = "Mapped Types Concepts:\\n\\n";
output += "Original: " + JSON.stringify(user) + "\\n\\n";
output += "Readonly (frozen): " + Object.isFrozen(frozenUser) + "\\n\\n";
output += "Getters created:\\n";
for (let key in userGetters) {
  output += "  " + key + "() = " + userGetters[key]() + "\\n";
}

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'type-inference': {
      title: 'TS Type Inference',
      content: `## Deep Type Inference

Understanding how TypeScript infers types.

### Contextual Typing

\`\`\`typescript
// TypeScript infers parameter types from context
const numbers = [1, 2, 3];

// n is inferred as number from array type
numbers.forEach(n => console.log(n.toFixed(2)));

// Event handlers
document.addEventListener("click", (e) => {
  // e is inferred as MouseEvent
  console.log(e.clientX, e.clientY);
});
\`\`\`

### Best Common Type

\`\`\`typescript
// TypeScript finds the best common type
let arr = [1, "hello", true];
// Type: (string | number | boolean)[]

// More specific when possible
let numbers = [1, 2, 3];  // number[]
\`\`\`

### Inference Limitations

\`\`\`typescript
// Sometimes inference needs help
const data = [];  // any[] - can't infer
const data: string[] = [];  // Better

// Object methods may need explicit types
const obj = {
  data: [] as string[],  // Without: any[]
  getFirst() {
    return this.data[0];  // string | undefined
  }
};
\`\`\`

### Controlling Inference

\`\`\`typescript
// as const for literal types
const config = {
  theme: "dark",
  size: 14
} as const;
// Type: { readonly theme: "dark"; readonly size: 14 }

// Satisfies for type checking without widening
const palette = {
  red: "#ff0000",
  green: "#00ff00"
} satisfies Record<string, string>;
// Keeps literal types but checks structure
\`\`\`

### Return Type Inference

\`\`\`typescript
// Inferred return type
function add(a: number, b: number) {
  return a + b;  // Returns number
}

// Explicit for complex functions
function fetchUser(id: string): Promise<User | null> {
  // Makes contract clear
  return api.get(\`/users/\${id}\`);
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Type Inference Demo</h2>
<pre id="demo"></pre>

<script>
// TypeScript infers types from values

let str = "hello";        // string
let num = 42;             // number
let arr = [1, 2, 3];      // number[]
let mixed = [1, "two"];   // (string | number)[]

// Contextual typing in callbacks
let doubled = arr.map(n => n * 2);

let output = "Type Inference Examples:\\n\\n";
output += "Inferred types:\\n";
output += "  'hello' → " + typeof str + "\\n";
output += "  42 → " + typeof num + "\\n";
output += "  [1,2,3] → array of " + typeof arr[0] + "\\n";
output += "  [1,'two'] → mixed array\\n\\n";
output += "Contextual typing:\\n";
output += "  arr.map(n => n * 2) = [" + doubled.join(", ") + "]\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'literal-types': {
      title: 'TS Literal Types',
      content: `## TypeScript Literal Types

Exact values as types.

### String Literals

\`\`\`typescript
// Only these specific strings allowed
type Direction = "north" | "south" | "east" | "west";
type Theme = "light" | "dark";

let dir: Direction = "north";  // OK
// dir = "up";  // Error! Not in union
\`\`\`

### Numeric Literals

\`\`\`typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpSuccess = 200 | 201 | 204;

let roll: DiceRoll = 4;  // OK
// roll = 7;  // Error!
\`\`\`

### Boolean Literals

\`\`\`typescript
type True = true;
type False = false;

// Useful in conditional types
type IsString<T> = T extends string ? true : false;
\`\`\`

### Template Literal Types

\`\`\`typescript
// TypeScript 4.1+
type EventName = \`on\${Capitalize<string>}\`;
// Matches: "onClick", "onChange", "onSubmit", etc.

type CSSProperty = \`--\${string}\`;
// Matches: "--color", "--spacing", etc.

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = \`/api/\${string}\`;
type Request = \`\${HttpMethod} \${Endpoint}\`;
// "GET /api/users", "POST /api/data", etc.
\`\`\`

### as const

\`\`\`typescript
// Without as const
const config = { theme: "dark" };
// Type: { theme: string }

// With as const
const config = { theme: "dark" } as const;
// Type: { readonly theme: "dark" }

// Array literals
const COLORS = ["red", "green", "blue"] as const;
type Color = typeof COLORS[number];  // "red" | "green" | "blue"
\`\`\`

### Literal Inference

\`\`\`typescript
// let widens to general type
let x = "hello";  // string

// const keeps literal type
const y = "hello";  // "hello"

// Force literal type with annotation
let z: "hello" = "hello";
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Literal Types Demo</h2>
<pre id="demo"></pre>

<script>
// Literal type concepts

// Simulating literal types with validation
const DIRECTIONS = ["north", "south", "east", "west"];
const THEMES = ["light", "dark"];

function isValidDirection(dir) {
  return DIRECTIONS.includes(dir);
}

function setTheme(theme) {
  if (!THEMES.includes(theme)) {
    throw new Error("Invalid theme: " + theme);
  }
  return "Theme set to: " + theme;
}

let output = "Literal Types Examples:\\n\\n";
output += "Valid directions: " + DIRECTIONS.join(", ") + "\\n";
output += "Valid themes: " + THEMES.join(", ") + "\\n\\n";
output += "isValidDirection('north'): " + isValidDirection("north") + "\\n";
output += "isValidDirection('up'): " + isValidDirection("up") + "\\n\\n";
output += setTheme("dark") + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 8 - Architecture
    namespaces: {
      title: 'TS Namespaces',
      content: `## TypeScript Namespaces

Legacy pattern for organizing code.

### Basic Namespace

\`\`\`typescript
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }

  export class EmailValidator implements StringValidator {
    isValid(s: string): boolean {
      return s.includes("@");
    }
  }
}

const validator = new Validation.EmailValidator();
\`\`\`

### Nested Namespaces

\`\`\`typescript
namespace App {
  export namespace Utils {
    export function formatDate(date: Date): string {
      return date.toISOString();
    }
  }
}

App.Utils.formatDate(new Date());
\`\`\`

### When NOT to Use Namespaces

❌ **Don't use namespaces when:**

- Using ES modules (import/export)
- Building modern applications
- Working with bundlers (webpack, rollup)

✅ **Use namespaces only for:**

- Legacy code maintenance
- Augmenting global scope
- Declaration files

### Modern Alternative: ES Modules

\`\`\`typescript
// validation.ts
export interface StringValidator {
  isValid(s: string): boolean;
}

export class EmailValidator implements StringValidator {
  isValid(s: string) {
    return s.includes("@");
  }
}

// main.ts
import { EmailValidator } from "./validation";
const validator = new EmailValidator();
\`\`\`

### Key Takeaway

Use ES modules for new code. Namespaces are primarily for legacy compatibility.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Namespaces Demo</h2>
<pre id="demo"></pre>

<script>
// Namespace-like pattern in JavaScript

let Validation = {
  EmailValidator: class {
    isValid(s) {
      return s.includes("@");
    }
  },
  PhoneValidator: class {
    isValid(s) {
      return /^\\d{10}$/.test(s);
    }
  }
};

let emailValidator = new Validation.EmailValidator();
let phoneValidator = new Validation.PhoneValidator();

let output = "Namespace Pattern Demo:\\n\\n";
output += "Email Validation:\\n";
output += "  'test@email.com': " + emailValidator.isValid("test@email.com") + "\\n";
output += "  'invalid': " + emailValidator.isValid("invalid") + "\\n\\n";
output += "Phone Validation:\\n";
output += "  '1234567890': " + phoneValidator.isValid("1234567890") + "\\n";
output += "  '123': " + phoneValidator.isValid("123") + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'declaration-merging': {
      title: 'TS Declaration Merging',
      content: `## Declaration Merging

Extend existing types and interfaces.

### Interface Merging

\`\`\`typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// User now has both properties!
const user: User = {
  name: "Alice",
  age: 30
};
\`\`\`

### Module Augmentation

\`\`\`typescript
// Extend third-party library types
import { AxiosRequestConfig } from "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    customOption?: string;
  }
}

// Now customOption is available
axios.get("/api", { customOption: "value" });
\`\`\`

### Global Augmentation

\`\`\`typescript
// Add to global scope
declare global {
  interface Window {
    myApp: {
      version: string;
      init(): void;
    };
  }
}

window.myApp = {
  version: "1.0.0",
  init() { console.log("Initialized"); }
};
\`\`\`

### Extending Third-Party Libraries

\`\`\`typescript
// extend-express.d.ts
import "express";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

// Now in your code:
app.get("/", (req, res) => {
  console.log(req.user?.id);  // No error!
});
\`\`\`

### Merging Rules

- Interfaces: merge properties
- Namespaces: merge exports
- Classes: cannot merge (use extension)
- Functions: use overloads

### When to Use

- Extending library types
- Adding global variables
- Progressive type definitions
- Plugin systems`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Declaration Merging Demo</h2>
<pre id="demo"></pre>

<script>
// Simulating declaration merging concept

// Base "interface"
let UserSchema = {
  properties: ["name"]
};

// "Merge" more properties
UserSchema.properties.push("age");
UserSchema.properties.push("email");

// Build object following merged schema
function createUser(data) {
  let user = {};
  UserSchema.properties.forEach(prop => {
    user[prop] = data[prop];
  });
  return user;
}

let user = createUser({
  name: "Alice",
  age: 30,
  email: "alice@example.com"
});

let output = "Declaration Merging Concept:\\n\\n";
output += "Schema properties: " + UserSchema.properties.join(", ") + "\\n\\n";
output += "Created user:\\n" + JSON.stringify(user, null, 2);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'definitely-typed': {
      title: 'TS Definitely Typed',
      content: `## Definitely Typed (@types/*)

Type definitions for JavaScript libraries.

### What is Definitely Typed?

A repository of TypeScript type definitions for JavaScript packages.

### Installing Types

\`\`\`bash
# Types for lodash
npm install --save-dev @types/lodash

# Types for React
npm install --save-dev @types/react @types/react-dom

# Types for Node.js
npm install --save-dev @types/node

# Types for Express
npm install --save-dev @types/express
\`\`\`

### How It Works

\`\`\`typescript
// Without types
import _ from "lodash";  // Error: no types

// After installing @types/lodash
import _ from "lodash";  // OK! Full IntelliSense
_.chunk([1, 2, 3, 4], 2);  // Autocomplete works
\`\`\`

### Ambient Declarations

\`\`\`typescript
// .d.ts files declare types without implementation

// global.d.ts
declare const API_URL: string;
declare function analytics(event: string): void;

// Now usable without import
console.log(API_URL);
analytics("page_view");
\`\`\`

### Fixing Broken Typings

\`\`\`typescript
// When library types are wrong or incomplete

// 1. Module augmentation
declare module "some-library" {
  export function missingFunction(): void;
}

// 2. Override specific types
declare module "broken-lib" {
  interface SomeInterface {
    correctProperty: string;  // Override
  }
}

// 3. Create your own .d.ts
// types/custom-lib.d.ts
declare module "custom-lib" {
  export function doSomething(x: string): number;
}
\`\`\`

### TypeScript Configuration

\`\`\`json
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"],
    "types": ["node", "jest"]
  }
}
\`\`\`

### When Types Don't Exist

\`\`\`typescript
// Quick fix: declare as any
declare module "untyped-library";

// Better: create basic types
declare module "untyped-library" {
  export function init(config: object): void;
  export const version: string;
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Definitely Typed Demo</h2>
<pre id="demo"></pre>

<script>
// Demonstrating type definition concepts

// Simulating typed library usage
let lodash = {
  chunk: function(arr, size) {
    let result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  },
  flatten: function(arr) {
    return arr.reduce((flat, item) => 
      flat.concat(Array.isArray(item) ? item : [item]), []);
  }
};

let numbers = [1, 2, 3, 4, 5, 6];
let chunked = lodash.chunk(numbers, 2);
let flattened = lodash.flatten(chunked);

let output = "@types/* Concept Demo:\\n\\n";
output += "Original: [" + numbers.join(", ") + "]\\n";
output += "chunk(arr, 2): " + JSON.stringify(chunked) + "\\n";
output += "flatten(chunked): [" + flattened.join(", ") + "]\\n\\n";
output += "With @types/lodash, all methods get:\\n";
output += "  ✓ Type checking\\n";
output += "  ✓ Autocomplete\\n";
output += "  ✓ Documentation\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    decorators: {
      title: 'TS Decorators',
      content: `## TypeScript Decorators

Metadata and behavior modification for classes.

### Enabling Decorators

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
\`\`\`

### Class Decorators

\`\`\`typescript
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
\`\`\`

### Method Decorators

\`\`\`typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    const result = original.apply(this, args);
    console.log(\`Result:\`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3);  // Logs: Calling add with [2, 3], Result: 5
\`\`\`

### Property Decorators

\`\`\`typescript
function required(target: any, key: string) {
  let value: any;
  
  Object.defineProperty(target, key, {
    get: () => value,
    set: (newValue) => {
      if (newValue === undefined || newValue === null) {
        throw new Error(\`\${key} is required\`);
      }
      value = newValue;
    }
  });
}

class User {
  @required
  name!: string;
}
\`\`\`

### Parameter Decorators

\`\`\`typescript
function validate(target: any, key: string, index: number) {
  console.log(\`Parameter \${index} of \${key} needs validation\`);
}

class API {
  getUser(@validate id: string) {
    return { id };
  }
}
\`\`\`

### Framework Usage (NestJS-style)

\`\`\`typescript
@Controller("/users")
class UserController {
  @Get("/:id")
  @UseGuards(AuthGuard)
  getUser(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Post("/")
  @HttpCode(201)
  createUser(@Body() data: CreateUserDto) {
    return this.userService.create(data);
  }
}
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Decorators Demo</h2>
<pre id="demo"></pre>

<script>
// Decorator pattern in JavaScript

// Method decorator factory
function log(target, key, descriptor) {
  let original = descriptor.value;
  descriptor.value = function(...args) {
    console.log("Calling " + key + " with:", args);
    let result = original.apply(this, args);
    console.log("Result:", result);
    return result;
  };
  return descriptor;
}

// Manual decorator application
let Calculator = {
  add: function(a, b) { return a + b; },
  multiply: function(a, b) { return a * b; }
};

// Apply logging
let origAdd = Calculator.add;
Calculator.add = function(...args) {
  console.log("add called with:", args);
  return origAdd.apply(this, args);
};

let output = "Decorator Pattern Demo:\\n\\n";
output += "Calculator.add(5, 3) = " + Calculator.add(5, 3) + "\\n";
output += "Calculator.multiply(4, 7) = " + Calculator.multiply(4, 7) + "\\n\\n";
output += "With @log decorator, all calls are logged!\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 9 - Async & Errors
    'async-programming': {
      title: 'TS Async Programming',
      content: `## Typed Async Programming

Type-safe asynchronous code.

### Typed Promises

\`\`\`typescript
// Promise with explicit type
const fetchNumber: Promise<number> = new Promise((resolve) => {
  setTimeout(() => resolve(42), 1000);
});

// Function returning Promise
function fetchUser(id: string): Promise<User> {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json());
}
\`\`\`

### Async/Await Return Types

\`\`\`typescript
// Async function always returns Promise
async function getUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// TypeScript infers Promise<User>
async function getUserInferred(id: string) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json() as User;
}
\`\`\`

### Error Handling

\`\`\`typescript
async function fetchData(): Promise<Data> {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
}
\`\`\`

### Parallel Async Flows

\`\`\`typescript
// Promise.all with types
async function fetchAllData(): Promise<[User, Posts]> {
  const [user, posts] = await Promise.all([
    fetchUser("123"),
    fetchPosts("123")
  ]);
  return [user, posts];
}

// Promise.race
const timeout = new Promise<never>((_, reject) => {
  setTimeout(() => reject(new Error("Timeout")), 5000);
});

const result = await Promise.race([fetchData(), timeout]);
\`\`\`

### Typed Fetch Wrapper

\`\`\`typescript
async function typedFetch<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  return response.json() as T;
}

// Usage
const user = await typedFetch<User>("/api/user");
const posts = await typedFetch<Post[]>("/api/posts");
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>Async TypeScript Demo</h2>
<pre id="demo"></pre>

<script>
// Async/await examples

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchUser(id) {
  await delay(100);  // Simulate network
  return { id: id, name: "User " + id };
}

async function fetchPosts(userId) {
  await delay(100);
  return [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" }
  ];
}

// Parallel fetch
async function loadData() {
  let start = Date.now();
  
  let [user, posts] = await Promise.all([
    fetchUser("123"),
    fetchPosts("123")
  ]);
  
  let elapsed = Date.now() - start;
  
  return {
    user,
    posts,
    elapsed
  };
}

loadData().then(data => {
  let output = "Async Programming Demo:\\n\\n";
  output += "User: " + JSON.stringify(data.user) + "\\n";
  output += "Posts: " + JSON.stringify(data.posts) + "\\n";
  output += "Time (parallel): " + data.elapsed + "ms\\n";
  document.getElementById("demo").innerHTML = output;
});
</script>

</body>
</html>`,
    },
    'error-handling': {
      title: 'TS Error Handling',
      content: `## Typed Error Handling

Safer error handling patterns.

### The Problem with try/catch

\`\`\`typescript
try {
  doSomething();
} catch (error) {
  // error is 'unknown' in TypeScript 4.4+
  console.log(error.message);  // Error!
}

// Proper handling
try {
  doSomething();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);  // OK
  }
}
\`\`\`

### Custom Error Classes

\`\`\`typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(\`\${resource} with id \${id} not found\`);
    this.name = "NotFoundError";
  }
}

// Usage
throw new ValidationError("Invalid email", "email", "INVALID_FORMAT");
\`\`\`

### Result Pattern (No Throw)

\`\`\`typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

const result = divide(10, 2);
if (result.success) {
  console.log(result.data);  // 5
} else {
  console.error(result.error);
}
\`\`\`

### Typed Async Errors

\`\`\`typescript
async function fetchUser(id: string): Promise<Result<User, APIError>> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      return { 
        success: false, 
        error: { code: response.status, message: "Fetch failed" }
      };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (e) {
    return { 
      success: false, 
      error: { code: 0, message: "Network error" }
    };
  }
}
\`\`\`

### Benefits of Result Pattern

1. No unexpected throws
2. Explicit error handling required
3. Full type safety for errors
4. Composable error chains`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Error Handling Demo</h2>
<pre id="demo"></pre>

<script>
// Result pattern for error handling

function divide(a, b) {
  if (b === 0) {
    return { success: false, error: "Division by zero" };
  }
  return { success: true, data: a / b };
}

function parseNumber(str) {
  let num = parseFloat(str);
  if (isNaN(num)) {
    return { success: false, error: "Invalid number: " + str };
  }
  return { success: true, data: num };
}

function safeCalculate(aStr, bStr) {
  let a = parseNumber(aStr);
  if (!a.success) return a;
  
  let b = parseNumber(bStr);
  if (!b.success) return b;
  
  return divide(a.data, b.data);
}

let output = "Result Pattern Error Handling:\\n\\n";

let tests = [
  ["10", "2"],
  ["10", "0"],
  ["abc", "2"],
  ["10", "xyz"]
];

tests.forEach(([a, b]) => {
  let result = safeCalculate(a, b);
  if (result.success) {
    output += a + " / " + b + " = " + result.data + "\\n";
  } else {
    output += a + " / " + b + " → Error: " + result.error + "\\n";
  }
});

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    // PHASE 10 - Integration
    'with-nodejs': {
      title: 'TS with Node.js',
      content: `## TypeScript with Node.js

Building typed backend applications.

### Setup

\`\`\`bash
npm init -y
npm install typescript @types/node ts-node --save-dev
npx tsc --init
\`\`\`

### tsconfig.json for Node

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
\`\`\`

### Express with TypeScript

\`\`\`typescript
import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

interface User {
  id: string;
  name: string;
  email: string;
}

// Typed route handler
app.get("/users/:id", (req: Request, res: Response) => {
  const user: User = {
    id: req.params.id,
    name: "Alice",
    email: "alice@example.com"
  };
  res.json(user);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
\`\`\`

### Typed Middleware

\`\`\`typescript
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

const authMiddleware = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = { id: "123", role: "admin" };
  next();
};
\`\`\`

### Environment Variables

\`\`\`typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      PORT: string;
      DATABASE_URL: string;
    }
  }
}
export {};

// Usage
const port = parseInt(process.env.PORT, 10);  // Typed!
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript + Node.js</h2>
<pre id="demo"></pre>

<script>
// Simulating Express-like patterns

// Route handler type
function createApp() {
  let routes = [];
  
  return {
    get(path, handler) {
      routes.push({ method: "GET", path, handler });
    },
    post(path, handler) {
      routes.push({ method: "POST", path, handler });
    },
    handle(method, path, params) {
      let route = routes.find(r => 
        r.method === method && r.path === path
      );
      if (route) {
        return route.handler({ params });
      }
      return { error: "Not found" };
    }
  };
}

let app = createApp();

// Define routes
app.get("/users/:id", (req) => ({
  id: req.params.id,
  name: "Alice",
  email: "alice@example.com"
}));

// Simulate requests
let result = app.handle("GET", "/users/:id", { id: "123" });

let output = "Express-like Pattern:\\n\\n";
output += "GET /users/123:\\n";
output += JSON.stringify(result, null, 2);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'with-react': {
      title: 'TS with React',
      content: `## TypeScript with React

Type-safe React components.

### Typed Props

\`\`\`typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  disabled = false,
  variant = "primary" 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={variant}
    >
      {label}
    </button>
  );
};
\`\`\`

### Typed State

\`\`\`typescript
interface User {
  id: string;
  name: string;
}

const [user, setUser] = useState<User | null>(null);
const [count, setCount] = useState(0);  // Inferred: number
const [items, setItems] = useState<string[]>([]);
\`\`\`

### Typed Hooks

\`\`\`typescript
// Custom hook with types
function useToggle(initial: boolean): [boolean, () => void] {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// Generic hook
function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  });
  
  const setAndStore = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };
  
  return [value, setAndStore];
}
\`\`\`

### Event Handlers

\`\`\`typescript
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.name);
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // form logic
};
\`\`\`

### Children Props

\`\`\`typescript
interface CardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, title }) => (
  <div className="card">
    {title && <h2>{title}</h2>}
    {children}
  </div>
);
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript + React Patterns</h2>
<pre id="demo"></pre>

<script>
// React-like component patterns

// Simulating typed props
function Button(props) {
  let label = props.label;
  let disabled = props.disabled || false;
  let variant = props.variant || "primary";
  
  return {
    type: "button",
    props: { label, disabled, variant }
  };
}

// Simulating useState
function useState(initial) {
  let state = initial;
  let setState = (newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
    return state;
  };
  return [state, setState];
}

// Component usage
let button = Button({
  label: "Click me",
  onClick: () => console.log("Clicked"),
  variant: "primary"
});

let [count, setCount] = useState(0);

let output = "React + TypeScript Patterns:\\n\\n";
output += "Button component:\\n";
output += JSON.stringify(button.props, null, 2) + "\\n\\n";
output += "useState hook:\\n";
output += "  Initial count: " + count + "\\n";
output += "  After setCount(5): " + setCount(5) + "\\n";
output += "  After setCount(n => n + 1): " + setCount(n => n + 1) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    tooling: {
      title: 'TS Tooling',
      content: `## TypeScript Tooling

Essential tools for professional TypeScript development.

### ESLint + TypeScript

\`\`\`bash
# Install ESLint with TypeScript support
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
\`\`\`

\`\`\`javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-unused-vars': 'error'
  }
};
\`\`\`

### Prettier

\`\`\`bash
npm install --save-dev prettier
\`\`\`

\`\`\`json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
\`\`\`

### ts-node

Run TypeScript directly without compilation:

\`\`\`bash
# Install
npm install --save-dev ts-node

# Run TypeScript file
npx ts-node src/index.ts

# With ESM support
npx ts-node --esm src/index.ts
\`\`\`

### tsx (Modern Alternative)

\`\`\`bash
# Faster alternative to ts-node
npm install --save-dev tsx

# Run TypeScript
npx tsx src/index.ts

# Watch mode
npx tsx watch src/index.ts
\`\`\`

### Build Pipelines

\`\`\`json
// package.json scripts
{
  "scripts": {
    "build": "tsc",
    "build:watch": "tsc --watch",
    "dev": "tsx watch src/index.ts",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write src/**/*.ts",
    "typecheck": "tsc --noEmit",
    "test": "jest"
  }
}
\`\`\`

### IDE Configuration

**VS Code settings.json:**
\`\`\`json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
\`\`\`

### Type Checking in CI

\`\`\`yaml
# GitHub Actions
name: TypeScript Check
on: [push, pull_request]
jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Tooling</h2>
<pre id="demo"></pre>

<script>
// Essential TypeScript tooling commands

let tools = {
  "ESLint": "npm install --save-dev @typescript-eslint/parser",
  "Prettier": "npm install --save-dev prettier",
  "ts-node": "npx ts-node src/index.ts",
  "tsx": "npx tsx src/index.ts",
  "Build": "npx tsc",
  "Type Check": "npx tsc --noEmit"
};

let output = "TypeScript Tooling Commands:\\n\\n";

for (let tool in tools) {
  output += tool + ":\\n  " + tools[tool] + "\\n\\n";
}

output += "Recommended package.json scripts:\\n";
output += '  "build": "tsc"\\n';
output += '  "dev": "tsx watch src/index.ts"\\n';
output += '  "lint": "eslint src --ext .ts"\\n';
output += '  "typecheck": "tsc --noEmit"\\n';

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'in-js-projects': {
      title: 'TS in JS Projects',
      content: `## TypeScript in JavaScript Projects

Incremental TypeScript adoption without full migration.

### allowJs Option

Enable TypeScript to process JavaScript files:

\`\`\`json
// tsconfig.json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,  // Optional: type-check JS files
    "outDir": "./dist",
    "strict": false   // Start relaxed, tighten later
  },
  "include": ["src/**/*"]
}
\`\`\`

### JSDoc Types

Add types to JavaScript using JSDoc comments:

\`\`\`javascript
// utils.js

/**
 * @param {string} name - The user's name
 * @param {number} age - The user's age
 * @returns {{ name: string, age: number }}
 */
function createUser(name, age) {
  return { name, age };
}

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {number} price
 */

/**
 * @param {Product[]} products
 * @returns {number}
 */
function getTotalPrice(products) {
  return products.reduce((sum, p) => sum + p.price, 0);
}

/** @type {Product} */
const laptop = {
  id: "1",
  name: "MacBook",
  price: 1999
};
\`\`\`

### Type Imports in JavaScript

\`\`\`javascript
// Import types for JSDoc
/** @typedef {import('./types').User} User */

/**
 * @param {User} user
 */
function processUser(user) {
  console.log(user.name);
}
\`\`\`

### Incremental Adoption Strategy

1. **Phase 1: Setup**
   \`\`\`bash
   npm install --save-dev typescript
   npx tsc --init
   \`\`\`

2. **Phase 2: Enable allowJs**
   - Add \`allowJs: true\` to tsconfig
   - TypeScript now processes .js files

3. **Phase 3: Add JSDoc Types**
   - Start with critical files
   - Add @param, @returns, @typedef

4. **Phase 4: Enable checkJs**
   - TypeScript reports errors in .js files
   - Fix issues gradually

5. **Phase 5: Convert to .ts**
   - Rename .js → .ts one file at a time
   - Start with leaf files (no dependencies)

### @ts-check Directive

Enable type-checking for individual JavaScript files:

\`\`\`javascript
// @ts-check

// TypeScript now checks this file!
let name = "Alice";
name = 42;  // Error: Type 'number' is not assignable to type 'string'
\`\`\`

### Ignoring Errors

\`\`\`javascript
// @ts-ignore - Ignore next line
const x = untypedFunction();

// @ts-expect-error - Expect an error (fails if no error)
const y = definitelyWrong();
\`\`\`

### Benefits of Gradual Adoption

- No big-bang migration
- Team learns TypeScript incrementally
- Production code stays stable
- Easy rollback if needed`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TS in JS Projects</h2>
<pre id="demo"></pre>

<script>
// JSDoc type annotations in JavaScript

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 */

/**
 * Create a new user
 * @param {string} name - User's name
 * @param {number} age - User's age
 * @returns {User}
 */
function createUser(name, age) {
  return { name, age };
}

/**
 * @param {User[]} users
 * @returns {number}
 */
function getAverageAge(users) {
  if (users.length === 0) return 0;
  let total = users.reduce((sum, u) => sum + u.age, 0);
  return total / users.length;
}

let users = [
  createUser("Alice", 30),
  createUser("Bob", 25),
  createUser("Charlie", 35)
];

let output = "JSDoc Types in JavaScript:\\n\\n";
output += "Users created with JSDoc types:\\n";
users.forEach(u => {
  output += "  " + u.name + ": " + u.age + " years\\n";
});
output += "\\nAverage age: " + getAverageAge(users).toFixed(1) + "\\n";
output += "\\nWith @ts-check, TypeScript validates this JS file!";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    migration: {
      title: 'TS Migration',
      content: `## JavaScript to TypeScript Migration

Step-by-step strategy for large repositories.

### Pre-Migration Checklist

- [ ] Team trained on TypeScript basics
- [ ] Build system supports TypeScript
- [ ] Test coverage is adequate
- [ ] CI/CD pipeline ready
- [ ] IDE configured (VS Code recommended)

### Migration Strategy

#### Step 1: Setup TypeScript

\`\`\`bash
npm install --save-dev typescript @types/node
npx tsc --init
\`\`\`

\`\`\`json
// tsconfig.json - Start permissive
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "allowJs": true,
    "checkJs": false,
    "outDir": "./dist",
    "strict": false,
    "noImplicitAny": false,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
\`\`\`

#### Step 2: Rename Files (Leaf First)

Start with files that have no dependencies:

\`\`\`
src/
├── utils/
│   ├── helpers.js     → helpers.ts (START HERE)
│   └── constants.js   → constants.ts
├── services/
│   └── api.js         → api.ts (AFTER utils)
└── index.js           → index.ts (LAST)
\`\`\`

#### Step 3: Add Types Incrementally

\`\`\`typescript
// Before (JavaScript)
function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`).then(r => r.json());
}

// After (TypeScript)
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}
\`\`\`

#### Step 4: Enable Strict Options Gradually

\`\`\`json
// Week 1
{ "noImplicitAny": true }

// Week 2
{ "strictNullChecks": true }

// Week 3
{ "strictFunctionTypes": true }

// Finally
{ "strict": true }
\`\`\`

### High-Risk Areas

1. **Dynamic Object Access**
   \`\`\`typescript
   // Before
   obj[dynamicKey]
   
   // After
   (obj as Record<string, unknown>)[dynamicKey]
   \`\`\`

2. **Implicit Any in Callbacks**
   \`\`\`typescript
   // Before
   arr.map(item => item.name)
   
   // After
   arr.map((item: User) => item.name)
   \`\`\`

3. **Mixed null/undefined**
   \`\`\`typescript
   // Add explicit checks
   if (value !== null && value !== undefined) {
     // use value
   }
   \`\`\`

### Refactoring Tips

- Use \`// @ts-expect-error\` temporarily
- Create shared type files early
- Document "any" usages for later fixing
- Migrate tests alongside source files
- Keep PRs small and focused

### Success Metrics

- Percentage of .ts files
- Number of \`any\` types remaining
- TypeScript strict mode enabled
- Build errors at zero
- Team velocity maintained`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TS Migration Strategy</h2>
<pre id="demo"></pre>

<script>
// Migration progression example

let migrationSteps = [
  { step: 1, action: "Install TypeScript", cmd: "npm install typescript" },
  { step: 2, action: "Create tsconfig.json", cmd: "npx tsc --init" },
  { step: 3, action: "Enable allowJs", cmd: 'Add "allowJs": true' },
  { step: 4, action: "Rename leaf files", cmd: "utils.js → utils.ts" },
  { step: 5, action: "Add basic types", cmd: "function(x: string)" },
  { step: 6, action: "Enable noImplicitAny", cmd: '"noImplicitAny": true' },
  { step: 7, action: "Enable strictNullChecks", cmd: '"strictNullChecks": true' },
  { step: 8, action: "Enable strict mode", cmd: '"strict": true' }
];

let strictOptions = [
  "noImplicitAny",
  "strictNullChecks", 
  "strictFunctionTypes",
  "strictBindCallApply",
  "strictPropertyInitialization",
  "noImplicitThis",
  "alwaysStrict"
];

let output = "JS → TS Migration Steps:\\n\\n";

migrationSteps.forEach(s => {
  output += s.step + ". " + s.action + "\\n   " + s.cmd + "\\n\\n";
});

output += "Strict Mode Options:\\n";
strictOptions.forEach(opt => {
  output += "  ✓ " + opt + "\\n";
});

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'best-practices': {
      title: 'TS Best Practices',
      content: `## TypeScript Best Practices

Professional patterns for enterprise code.

### 1. Prefer \`unknown\` over \`any\`

\`\`\`typescript
// ❌ Bad
function process(data: any) {
  data.anything();  // No error, runtime crash
}

// ✅ Good
function process(data: unknown) {
  if (typeof data === "string") {
    data.toUpperCase();  // Safe
  }
}
\`\`\`

### 2. Use Strict Mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true  // Non-negotiable
  }
}
\`\`\`

### 3. Type API Boundaries

\`\`\`typescript
// External data should always be typed
interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

async function fetchUser(id: string): Promise<APIResponse<User>> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}
\`\`\`

### 4. Don't Over-Type

\`\`\`typescript
// ❌ Unnecessary
const name: string = "Alice";  // Inferred

// ✅ Let inference work
const name = "Alice";

// But DO type function parameters
function greet(name: string) {}  // Required
\`\`\`

### 5. DTO vs Domain Models

\`\`\`typescript
// Data Transfer Object (API shape)
interface UserDTO {
  user_id: string;
  first_name: string;
  last_name: string;
}

// Domain Model (app shape)
interface User {
  id: string;
  fullName: string;
}

// Mapper
function toUser(dto: UserDTO): User {
  return {
    id: dto.user_id,
    fullName: \`\${dto.first_name} \${dto.last_name}\`
  };
}
\`\`\`

### 6. Use Type Guards

\`\`\`typescript
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj
  );
}
\`\`\`

### 7. Const Assertions for Configs

\`\`\`typescript
const ROUTES = {
  HOME: "/",
  USERS: "/users",
  SETTINGS: "/settings"
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];
\`\`\`

### 8. Discriminated Unions for State

\`\`\`typescript
type LoadingState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
\`\`\`\`,
      tryItCode: \`<!DOCTYPE html>
<html>
<body>

<h2>TypeScript Best Practices</h2>
<pre id="demo"></pre>

<script>
// Best practices demonstrated

// 1. Type guards
function isUser(obj) {
  return obj && typeof obj === "object" && "id" in obj && "name" in obj;
}

// 2. DTO to Domain mapping
function toUser(dto) {
  return {
    id: dto.user_id,
    fullName: dto.first_name + " " + dto.last_name
  };
}

// 3. Const assertions (simulated)
const ROUTES = Object.freeze({
  HOME: "/",
  USERS: "/users",
  SETTINGS: "/settings"
});

// 4. Discriminated union state
function handleState(state) {
  switch (state.status) {
    case "idle": return "Ready to load";
    case "loading": return "Loading...";
    case "success": return "Data: " + JSON.stringify(state.data);
    case "error": return "Error: " + state.error;
  }
}

let dto = { user_id: "123", first_name: "John", last_name: "Doe" };
let user = toUser(dto);

let output = "Best Practices Demo:\\n\\n";
output += "1. Type guard:\\n   isUser(user): " + isUser(user) + "\\n\\n";
output += "2. DTO mapping:\\n   " + JSON.stringify(user) + "\\n\\n";
output += "3. Const routes:\\n   " + JSON.stringify(ROUTES) + "\\n\\n";
output += "4. State handling:\\n";
output += "   idle: " + handleState({status: "idle"}) + "\\n";
output += "   success: " + handleState({status: "success", data: {x:1}}) + "\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    '5-updates': {
      title: 'TS 5 Updates',
      content: `## TypeScript 5 Updates

Latest features and improvements.

### const Type Parameters (TS 5.0)

\`\`\`typescript
// Infer literal types automatically
function names<const T extends readonly string[]>(names: T): T {
  return names;
}

const result = names(["Alice", "Bob"]);
// Type: readonly ["Alice", "Bob"] instead of string[]
\`\`\`

### Decorators (Standard)

\`\`\`typescript
// TC39 standard decorators (not experimental)
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  return function (...args: any[]) {
    console.log(\`Calling \${String(context.name)}\`);
    return originalMethod.call(this, ...args);
  };
}

class Example {
  @logged
  greet(name: string) {
    return \`Hello, \${name}\`;
  }
}
\`\`\`

### satisfies Operator

\`\`\`typescript
// Type-check without widening
const palette = {
  red: "#ff0000",
  green: "#00ff00"
} satisfies Record<string, string>;

// palette.red is still "#ff0000", not string
palette.red.toUpperCase();  // Works!
\`\`\`

### Better Enum Improvements

\`\`\`typescript
// All enums are union types in TS 5
enum Color { Red, Green, Blue }

// Color is now: Color.Red | Color.Green | Color.Blue
\`\`\`

### Performance Improvements

- 10-25% faster builds
- Smaller package size
- Better memory usage
- Faster IDE response

### Breaking Changes Awareness

\`\`\`typescript
// 1. lib.d.ts changes - some DOM types updated
// 2. Stricter inference in some cases
// 3. Decorator changes from experimental to standard
\`\`\`

### Migration Tips

1. Update \`typescript\` to ^5.0.0
2. Check for deprecated APIs
3. Test decorators if using them
4. Review lib.d.ts type changes
5. Enable new strict features gradually`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>TypeScript 5 Features</h2>
<pre id="demo"></pre>

<script>
// TypeScript 5 feature concepts

// satisfies-like pattern
function createPalette(colors) {
  // Validate structure
  for (let key in colors) {
    if (typeof colors[key] !== 'string') {
      throw new Error('Invalid color value');
    }
  }
  return colors;
}

let palette = createPalette({
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff"
});

// const inference (simulated)
function asConst(arr) {
  return Object.freeze([...arr]);
}

let names = asConst(["Alice", "Bob", "Charlie"]);

let output = "TypeScript 5 Features:\\n\\n";
output += "1. satisfies pattern:\\n";
output += "   Palette validated: " + JSON.stringify(palette) + "\\n\\n";
output += "2. const inference:\\n";
output += "   Frozen array: " + JSON.stringify(names) + "\\n";
output += "   Is frozen: " + Object.isFrozen(names) + "\\n\\n";
output += "3. Performance: 10-25% faster builds\\n";
output += "4. Better enum handling\\n";
output += "5. Standard decorators support\\n";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
  };

  return tsLessons[lessonSlug] || {
    title: 'Lesson',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    tryItCode: '<!-- Code example coming soon -->',
  };
};

// ============================================
// REACT LESSON CONTENT GENERATOR
// ============================================
