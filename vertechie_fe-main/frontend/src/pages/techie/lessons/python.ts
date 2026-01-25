export const generatePythonLessonContent = (lessonSlug: string) => {
  const pythonLessons: Record<string, any> = {
    // TRACK 0 — STRATEGIC FOUNDATION
    'home': {
      title: 'Python HOME',
      content: `# Welcome to Python Mastery 🐍

Think of Python like a **super smart robot friend** that understands almost plain English and can do amazing things!

## Why Learn Python?

Python is like the **Swiss Army knife** of programming - it can do EVERYTHING:

| What Python Does | Real Examples |
|-----------------|---------------|
| 🌐 **Web Apps** | Instagram, Pinterest, Spotify |
| 🤖 **AI/ML** | ChatGPT, Tesla Autopilot |
| 📊 **Data Science** | Netflix recommendations |
| 🎮 **Games** | Parts of Civilization IV |
| 🔬 **Science** | NASA, CERN research |
| 🏢 **Enterprise** | Google, Dropbox, Reddit |

## Python's Superpowers

### 1. Easy to Read
\`\`\`python
# Python reads almost like English!
if age >= 18:
    print("You can vote!")
else:
    print("Not yet!")
\`\`\`

### 2. Huge Community
- 8.2+ million developers
- 400,000+ packages on PyPI
- Answers for every question on Stack Overflow

### 3. Versatile
- Same language for scripts and enterprise systems
- Works on Windows, Mac, Linux
- From Raspberry Pi to supercomputers

## What You'll Learn

By the end of this course, you'll be able to:
- ✅ Write clean, professional Python code
- ✅ Build production-ready systems
- ✅ Work with databases confidently
- ✅ Create ML pipelines
- ✅ Pass senior Python interviews
- ✅ Mentor teams and review code

## Course Structure

| Track | Focus | Level |
|-------|-------|-------|
| 0 | Strategic Foundation | Entry |
| 1 | Core Python | Beginner |
| 2 | OOP & Files | Professional |
| 3 | Data Engineering | Data Engineer |
| 4 | Databases & Backend | Backend Dev |
| 5 | DSA | Interview Ready |
| 6 | Machine Learning | ML Engineer |
| 7 | Enterprise | Senior/Lead |
| 8-9 | Reference & Cert | SME |

Let's begin your Python journey! 🚀
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🐍 Python Philosophy</h2>
<div id="demo"></div>

<script>
// Python's Zen - guiding principles
const zen = [
  "Beautiful is better than ugly",
  "Simple is better than complex",
  "Complex is better than complicated",
  "Readability counts",
  "Explicit is better than implicit",
  "Errors should never pass silently",
  "In the face of ambiguity, refuse to guess"
];

let html = "<h3>The Zen of Python:</h3><ul>";
zen.forEach((line, i) => {
  html += "<li>" + line + "</li>";
});
html += "</ul>";
html += "<p><em>These principles make Python special!</em></p>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'intro': {
      title: 'Python Introduction',
      content: `# Why Python Wins in Enterprises 🏆

Think of Python like a **universal translator** - it speaks to computers in a way that's easy for humans to understand AND powerful enough for the biggest companies in the world!

## Python's Enterprise Dominance

### Who Uses Python?
| Company | How They Use Python |
|---------|-------------------|
| **Google** | YouTube, Search algorithms |
| **Netflix** | Recommendation engine |
| **Instagram** | Backend (Django) |
| **Spotify** | Data analysis, Backend |
| **Dropbox** | Desktop client |
| **NASA** | Scientific computing |
| **Banks** | Risk analysis, Trading |

## Why Python Wins

### 1. Developer Productivity 📈
\`\`\`python
# Python: 3 lines
def greet(name):
    return f"Hello, {name}!"
\`\`\`

\`\`\`java
// Java: 8 lines for the same thing!
public class Greeting {
    public static String greet(String name) {
        return "Hello, " + name + "!";
    }
}
\`\`\`

**Result**: 2-10x faster development time

### 2. Massive Ecosystem 📚
- **400,000+** packages on PyPI
- Libraries for EVERYTHING:
  - Web: Django, Flask, FastAPI
  - Data: Pandas, NumPy, SciPy
  - ML: TensorFlow, PyTorch, scikit-learn
  - Automation: Ansible, Fabric

### 3. Talent Availability 👥
- Most taught language in universities
- 8.2M+ Python developers globally
- Easy to hire, easy to train

### 4. Integration Power 🔗
Python talks to everything:
- C/C++ libraries
- Java (Jython)
- .NET (IronPython)
- Databases (any!)
- APIs (REST, GraphQL)

## Enterprise Success Stories

### Instagram's Journey
- Started with Django in 2010
- Now handles 2 billion+ users
- Still Python! (with optimizations)

### Dropbox's Choice
- 99% Python codebase
- Migrated FROM Python 2 to Python 3
- Invested in custom Python interpreter

### JPMorgan's Adoption
- 35 million lines of Python
- Replaced legacy systems
- Risk analysis and trading

## The "Slow Python" Myth 🚀

"But Python is slow!"

**Reality**:
- CPU-bound code: Yes, pure Python is slower
- Real-world apps: Speed rarely matters because...
  - Network I/O is the bottleneck
  - Database is the bottleneck
  - NumPy/Pandas use C under the hood

\`\`\`python
# This "slow" Python...
import numpy as np
result = np.dot(matrix_a, matrix_b)

# ...actually runs C code underneath!
# As fast as native C!
\`\`\`

## When NOT to Use Python

Be honest about limitations:
| Scenario | Better Choice |
|----------|---------------|
| Mobile apps | Swift, Kotlin |
| Game engines | C++, C# |
| Browser code | JavaScript |
| Embedded systems | C, Rust |
| Real-time systems | C++, Rust |

## Key Takeaway 💡

Python isn't the fastest language, but it's often the **fastest to production**.

Time to market > raw performance in most business cases.
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🏆 Python Enterprise Stats</h2>
<div id="demo"></div>

<script>
const stats = {
  companies: [
    { name: "Google", pythonUse: "YouTube, ML/AI" },
    { name: "Netflix", pythonUse: "Recommendations" },
    { name: "Instagram", pythonUse: "Django Backend" },
    { name: "Spotify", pythonUse: "Data Pipelines" }
  ],
  pypiPackages: 400000,
  developers: "8.2M+",
  rankings: "Top 3 language globally"
};

let html = "<h3>Companies Using Python:</h3>";
html += "<table border='1' style='border-collapse: collapse; width: 100%;'>";
html += "<tr><th>Company</th><th>Python Use Case</th></tr>";

stats.companies.forEach(company => {
  html += "<tr><td><b>" + company.name + "</b></td><td>" + company.pythonUse + "</td></tr>";
});
html += "</table>";

html += "<br><h3>By The Numbers:</h3>";
html += "<ul>";
html += "<li><b>" + stats.pypiPackages.toLocaleString() + "+</b> packages on PyPI</li>";
html += "<li><b>" + stats.developers + "</b> developers worldwide</li>";
html += "<li><b>" + stats.rankings + "</b></li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'vs-others': {
      title: 'Python vs Other Languages',
      content: `# Python vs Java vs C++ vs JavaScript ⚔️

Think of programming languages like different **vehicles** - each is best for different journeys!

## The Big Comparison

| Aspect | Python 🐍 | Java ☕ | C++ ⚡ | JavaScript 🌐 |
|--------|----------|---------|--------|---------------|
| **Speed** | Moderate | Fast | Fastest | Moderate |
| **Learning** | Easy | Medium | Hard | Medium |
| **Typing** | Dynamic | Static | Static | Dynamic |
| **Memory** | Managed | Managed | Manual | Managed |
| **Use Case** | All-around | Enterprise | Systems | Web |

## Code Comparison: Same Task

**Task**: Print numbers 1-5

### Python 🐍
\`\`\`python
for i in range(1, 6):
    print(i)
\`\`\`
**Lines: 2** | Clean and readable!

### Java ☕
\`\`\`java
public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }
    }
}
\`\`\`
**Lines: 7** | More ceremony

### C++ ⚡
\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    for (int i = 1; i <= 5; i++) {
        cout << i << endl;
    }
    return 0;
}
\`\`\`
**Lines: 9** | Most verbose

### JavaScript 🌐
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
\`\`\`
**Lines: 3** | Similar to Python

## Speed Comparison ⏱️

| Task | Python | Java | C++ |
|------|--------|------|-----|
| Simple loop | 1x | 50x | 100x |
| NumPy math | 100x | 100x | 100x |
| Real webapp | ~same | ~same | ~same |

**Why?** In real apps, the database/network is the bottleneck, not the language!

## When to Choose Each

### Choose Python When 🐍
- ✅ Rapid prototyping
- ✅ Data science / ML
- ✅ Automation / scripting
- ✅ Web backends (Django, FastAPI)
- ✅ Glue code between systems
- ✅ Teaching / learning

### Choose Java When ☕
- ✅ Large enterprise systems
- ✅ Android apps (though Kotlin now)
- ✅ High-throughput backends
- ✅ Strict type safety required
- ✅ Long-term maintenance critical

### Choose C++ When ⚡
- ✅ Game engines
- ✅ Operating systems
- ✅ Embedded systems
- ✅ Real-time requirements
- ✅ Memory-critical applications

### Choose JavaScript When 🌐
- ✅ Web frontends (only choice!)
- ✅ Full-stack web (Node.js)
- ✅ Mobile (React Native)
- ✅ Electron desktop apps

## The Trade-offs

### Python's Strengths
1. **Productivity**: Write more with less
2. **Readability**: Easy to maintain
3. **Libraries**: Best ecosystem for data/ML
4. **Flexibility**: Quick iterations

### Python's Weaknesses
1. **Raw speed**: Slower than compiled languages
2. **Mobile**: Not suitable for native apps
3. **Threading**: GIL limits true parallelism
4. **Type safety**: Errors at runtime

## Real-World Decision

**Scenario**: Building a startup

| Stage | Best Choice | Why |
|-------|-------------|-----|
| MVP | Python | Fastest to market |
| Scale | Python + optimizations | Still works! |
| Specific perf issues | Rewrite hot paths in C | 1% of code |

**Instagram** followed this exact path and serves 2 billion users!

## Key Insight 💡

> "Premature optimization is the root of all evil" - Donald Knuth

Start with Python. Optimize only when you PROVE it's needed.
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>⚔️ Language Comparison</h2>
<div id="demo"></div>

<script>
const languages = [
  { 
    name: "Python",
    emoji: "🐍",
    pros: ["Easy to learn", "Huge ecosystem", "Great for AI/ML"],
    cons: ["Slower execution", "GIL limitation"],
    bestFor: "Data Science, ML, Scripting"
  },
  { 
    name: "Java",
    emoji: "☕",
    pros: ["Type safety", "Performance", "Enterprise proven"],
    cons: ["Verbose", "Slower development"],
    bestFor: "Large Enterprise Systems"
  },
  { 
    name: "C++",
    emoji: "⚡",
    pros: ["Fastest", "Low-level control"],
    cons: ["Complex", "Memory management"],
    bestFor: "Games, Systems, Embedded"
  },
  { 
    name: "JavaScript",
    emoji: "🌐",
    pros: ["Web monopoly", "Full-stack"],
    cons: ["Type issues", "Callback complexity"],
    bestFor: "Web Development"
  }
];

let html = "";
languages.forEach(lang => {
  html += "<div style='border: 1px solid #ccc; padding: 10px; margin: 10px 0; border-radius: 8px;'>";
  html += "<h3>" + lang.emoji + " " + lang.name + "</h3>";
  html += "<p><b>Best for:</b> " + lang.bestFor + "</p>";
  html += "<p style='color: green;'>✅ " + lang.pros.join(" | ") + "</p>";
  html += "<p style='color: orange;'>⚠️ " + lang.cons.join(" | ") + "</p>";
  html += "</div>";
});

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'execution': {
      title: 'Python Execution Model',
      content: `# How Python Actually Runs 🔧

Think of Python like a **translator at the UN** - it takes your code and converts it into something the computer understands, one step at a time!

## The Python Execution Pipeline

\`\`\`
Your Code (.py)
    ↓
[Lexer] → Tokens
    ↓
[Parser] → AST (Abstract Syntax Tree)
    ↓
[Compiler] → Bytecode (.pyc)
    ↓
[Python VM] → Execution
\`\`\`

## What is CPython? 🐍

CPython is the **default** Python implementation - written in C!

When you install Python from python.org, you get CPython.

### Other Python Implementations
| Implementation | Written In | Purpose |
|----------------|-----------|---------|
| **CPython** | C | Default, reference |
| **PyPy** | Python | JIT, 5-10x faster |
| **Jython** | Java | JVM integration |
| **IronPython** | C# | .NET integration |
| **MicroPython** | C | Microcontrollers |

## Interpreted vs Compiled

### Compiled Languages (C, C++, Rust)
\`\`\`
Source Code → Compiler → Machine Code → Run
                         (one time)
\`\`\`
**Pros**: Fast execution
**Cons**: Platform-specific, longer compile

### Interpreted Languages (Old BASIC)
\`\`\`
Source Code → Interpreter → Run line by line
                (every time)
\`\`\`
**Pros**: Flexible
**Cons**: Slow execution

### Python (Hybrid!)
\`\`\`
Source Code → Compiler → Bytecode → VM → Run
              (once)     (.pyc)    (every time)
\`\`\`

**Python IS compiled** - just to bytecode, not machine code!

## Understanding Bytecode

\`\`\`python
# Your code
def add(a, b):
    return a + b
\`\`\`

\`\`\`python
# See the bytecode!
import dis
dis.dis(add)

# Output:
#   LOAD_FAST    0 (a)
#   LOAD_FAST    1 (b)
#   BINARY_ADD
#   RETURN_VALUE
\`\`\`

## The __pycache__ Folder

Ever noticed \`__pycache__\` appearing?

\`\`\`
myproject/
├── main.py
├── utils.py
└── __pycache__/
    └── utils.cpython-311.pyc  ← Cached bytecode!
\`\`\`

Python caches bytecode to speed up subsequent runs.

## The GIL (Global Interpreter Lock) 🔒

The GIL is Python's most controversial feature:

\`\`\`
Thread 1: "I want to run!"
Thread 2: "I want to run!"
Thread 3: "I want to run!"

GIL: "ONE AT A TIME!"
\`\`\`

### Why the GIL Exists
- CPython's memory management isn't thread-safe
- GIL makes it simpler and safer
- Single-threaded code is actually faster with GIL

### GIL Impact

| Workload | GIL Impact |
|----------|------------|
| CPU-bound, multi-thread | ❌ Bad - use multiprocessing |
| I/O-bound, multi-thread | ✅ Fine - GIL released during I/O |
| Single-threaded | ✅ Fine - no impact |

### Workarounds
\`\`\`python
# For CPU-bound parallel work:
from multiprocessing import Pool

# Each process has its own GIL!
with Pool(4) as p:
    results = p.map(cpu_intensive_func, data)
\`\`\`

## Python 3.13: Free-Threading! 🎉

Coming soon: Optional GIL-free Python!
\`\`\`bash
# Experimental in Python 3.13
python3.13t your_script.py  # 't' for thread-safe
\`\`\`

## Performance Tips 💡

### 1. Use C Extensions
\`\`\`python
# NumPy runs in C - bypasses Python overhead
import numpy as np
result = np.dot(huge_matrix, another_matrix)  # Fast!
\`\`\`

### 2. Use PyPy for CPU-bound code
\`\`\`bash
# 5-10x faster for pure Python
pypy your_script.py
\`\`\`

### 3. Profile First!
\`\`\`python
import cProfile
cProfile.run('your_function()')
# Find the REAL bottleneck before optimizing
\`\`\`

## Key Takeaways 🎯

1. Python compiles to **bytecode**, not machine code
2. CPython is the reference implementation
3. The GIL limits CPU parallelism (use multiprocessing)
4. I/O-bound code works fine with threads
5. NumPy/Pandas bypass Python's speed limits
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔧 Python Execution Pipeline</h2>
<div id="demo"></div>

<script>
// Simulate Python execution stages
const stages = [
  { name: "Source Code", symbol: "📄", desc: "Your .py file" },
  { name: "Lexer", symbol: "🔤", desc: "Breaks into tokens" },
  { name: "Parser", symbol: "🌳", desc: "Creates AST" },
  { name: "Compiler", symbol: "⚙️", desc: "Generates bytecode" },
  { name: "Python VM", symbol: "🖥️", desc: "Executes bytecode" }
];

let html = "<h3>Execution Pipeline:</h3>";
html += "<div style='text-align: center;'>";

stages.forEach((stage, i) => {
  html += "<div style='display: inline-block; margin: 10px; padding: 15px; border: 2px solid #3776AB; border-radius: 8px; background: #f0f6ff;'>";
  html += "<div style='font-size: 24px;'>" + stage.symbol + "</div>";
  html += "<div><b>" + stage.name + "</b></div>";
  html += "<div style='font-size: 12px; color: #666;'>" + stage.desc + "</div>";
  html += "</div>";
  
  if (i < stages.length - 1) {
    html += "<span style='font-size: 24px;'>→</span>";
  }
});

html += "</div>";

html += "<br><h3>Python Implementations:</h3>";
html += "<ul>";
html += "<li><b>CPython</b> - Default (C)</li>";
html += "<li><b>PyPy</b> - JIT compiled (5-10x faster)</li>";
html += "<li><b>Jython</b> - JVM integration</li>";
html += "<li><b>MicroPython</b> - Microcontrollers</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // TRACK 1 — CORE PYTHON
    'get-started': {
      title: 'Python Get Started',
      content: `# Getting Started with Python 🚀

Think of installing Python like setting up your **workshop** - you need the right tools before you can build amazing things!

## Installing Python

### Windows 💻
1. Go to [python.org](https://python.org)
2. Download Python 3.11+ (latest stable)
3. **IMPORTANT**: Check "Add Python to PATH" ✅
4. Click "Install Now"

### macOS 🍎
\`\`\`bash
# Using Homebrew (recommended)
brew install python

# Verify installation
python3 --version
\`\`\`

### Linux 🐧
\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip

# Fedora
sudo dnf install python3 python3-pip
\`\`\`

## Verify Installation

Open terminal/command prompt:
\`\`\`bash
python3 --version
# Python 3.11.5

pip3 --version
# pip 23.2.1
\`\`\`

## Your First Python Program!

Create a file called \`hello.py\`:
\`\`\`python
print("Hello, World!")
print("Welcome to Python! 🐍")
\`\`\`

Run it:
\`\`\`bash
python3 hello.py
# Output:
# Hello, World!
# Welcome to Python! 🐍
\`\`\`

## The Python REPL

REPL = Read, Evaluate, Print, Loop

Start it by typing \`python3\`:
\`\`\`python
>>> 2 + 2
4
>>> "Hello" + " World"
'Hello World'
>>> print("Python is fun!")
Python is fun!
>>> exit()  # To quit
\`\`\`

## Recommended Tools

### Code Editors
| Editor | Best For |
|--------|----------|
| **VS Code** | Most popular, free, great extensions |
| **PyCharm** | Full IDE, professional features |
| **Jupyter** | Data science, notebooks |
| **Vim/Neovim** | Terminal lovers |

### VS Code Setup
1. Install VS Code
2. Install "Python" extension by Microsoft
3. Install "Pylance" for better intellisense
4. Optional: "Python Indent", "autoDocstring"

## Python File Extensions

| Extension | Purpose |
|-----------|---------|
| \`.py\` | Python script |
| \`.pyw\` | Python script (no console window) |
| \`.pyc\` | Compiled bytecode |
| \`.pyd\` | Python DLL (Windows) |
| \`.pyi\` | Type stub file |
| \`.ipynb\` | Jupyter notebook |

## Hello World Explained

\`\`\`python
print("Hello, World!")
#  ↑       ↑
#  |       └── String argument
#  └── Built-in function
\`\`\`

- \`print()\` - Displays output
- \`"Hello, World!"\` - A string (text in quotes)
- No semicolons needed! ✨
- Indentation matters in Python!

## Quick Tips 💡

1. **Use Python 3**, not Python 2 (Python 2 is dead!)
2. **Consistent naming**: Use \`python3\` and \`pip3\`
3. **Virtual environments**: Always use them (coming soon!)
4. **Official docs**: docs.python.org is excellent

## Practice Exercise

Create \`calculator.py\`:
\`\`\`python
# Simple calculator
num1 = 10
num2 = 5

print("Addition:", num1 + num2)
print("Subtraction:", num1 - num2)
print("Multiplication:", num1 * num2)
print("Division:", num1 / num2)
\`\`\`

Run it and see the results!
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚀 Python Get Started</h2>
<div id="demo"></div>

<script>
// Simulating Python code execution
function runPython() {
  const output = [];
  
  // Simulated Python print statements
  output.push("Hello, World!");
  output.push("Welcome to Python! 🐍");
  output.push("");
  output.push("=== Calculator Demo ===");
  
  const num1 = 10;
  const num2 = 5;
  
  output.push("num1 = " + num1);
  output.push("num2 = " + num2);
  output.push("Addition: " + (num1 + num2));
  output.push("Subtraction: " + (num1 - num2));
  output.push("Multiplication: " + (num1 * num2));
  output.push("Division: " + (num1 / num2));
  
  return output;
}

const results = runPython();
let html = "<pre style='background: #1a1a2e; color: #0f0; padding: 20px; border-radius: 8px;'>";
html += "<code>";
results.forEach(line => {
  html += line + "\\n";
});
html += "</code></pre>";

html += "<p><b>Congratulations!</b> You've run your first Python code! 🎉</p>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'syntax': {
      title: 'Python Syntax',
      content: `# Python Syntax 📝

Think of Python syntax like **grammar rules** - they tell Python how to understand your code!

## Python's Golden Rule: Indentation

Python uses **indentation** (spaces) to define code blocks:

\`\`\`python
# ✅ Correct - consistent indentation
if True:
    print("This is indented")
    print("Same level")

# ❌ Wrong - inconsistent indentation
if True:
    print("This works")
  print("This causes an error!")  # IndentationError!
\`\`\`

### Indentation Rules
- Use **4 spaces** (recommended) or tabs (be consistent!)
- Never mix tabs and spaces
- All code in a block must have the same indentation

## Statements and Lines

### One Statement Per Line
\`\`\`python
name = "Alice"
age = 25
print(name)
\`\`\`

### Multiple Statements (Not Recommended)
\`\`\`python
name = "Alice"; age = 25  # Works, but avoid!
\`\`\`

### Line Continuation
\`\`\`python
# Long line with backslash
total = 1 + 2 + 3 + \\
        4 + 5 + 6

# Better: Use parentheses
total = (1 + 2 + 3 +
         4 + 5 + 6)

# Collections naturally continue
my_list = [
    "apple",
    "banana",
    "cherry"
]
\`\`\`

## Case Sensitivity

Python is case-sensitive!

\`\`\`python
Name = "Alice"
name = "Bob"
NAME = "Charlie"

# These are THREE different variables!
print(Name)   # Alice
print(name)   # Bob
print(NAME)   # Charlie
\`\`\`

## Python Keywords

These words are reserved - you can't use them as variable names:

\`\`\`python
import keyword
print(keyword.kwlist)

# False, True, None, and, as, assert, async, await,
# break, class, continue, def, del, elif, else,
# except, finally, for, from, global, if, import,
# in, is, lambda, nonlocal, not, or, pass, raise,
# return, try, while, with, yield
\`\`\`

## Naming Conventions

\`\`\`python
# Variables and functions: snake_case
user_name = "Alice"
def calculate_total():
    pass

# Classes: PascalCase
class UserAccount:
    pass

# Constants: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
PI = 3.14159

# Private: leading underscore
_internal_value = 42

# "Very private": double underscore
__secret = "hidden"
\`\`\`

## Code Blocks

Code blocks are defined by indentation after \`:\`

\`\`\`python
# If statement
if condition:
    do_something()
    do_more()

# For loop
for item in items:
    process(item)

# Function
def greet(name):
    message = f"Hello, {name}!"
    return message

# Class
class Person:
    def __init__(self, name):
        self.name = name
\`\`\`

## Blank Lines

- 2 blank lines before top-level definitions
- 1 blank line between methods

\`\`\`python
import os


def function_one():
    pass


def function_two():
    pass


class MyClass:
    
    def method_one(self):
        pass
    
    def method_two(self):
        pass
\`\`\`

## String Quotes

Both work - be consistent!

\`\`\`python
single = 'Hello'
double = "Hello"
triple_single = '''Multi
line'''
triple_double = """Multi
line"""

# Use the other type to include quotes
message = "She said 'Hello!'"
message = 'He said "Hi!"'
\`\`\`

## Quick Syntax Rules 📋

| Rule | Example |
|------|---------|
| Indentation | 4 spaces per level |
| Line length | 79 characters max (PEP 8) |
| Imports | Top of file |
| Spaces after , | Yes: \`(a, b, c)\` |
| Spaces around = | Yes: \`x = 1\` |
| No semicolons | Just newlines! |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📝 Python Syntax Demo</h2>
<div id="demo"></div>

<script>
// Demonstrating Python syntax concepts

const pythonExamples = {
  indentation: {
    title: "Indentation Matters!",
    correct: \`if age >= 18:
    print("Adult")
    print("Can vote")\`,
    wrong: \`if age >= 18:
    print("Adult")
  print("Wrong indent!")  # Error!\`
  },
  
  naming: {
    title: "Naming Conventions",
    examples: [
      { type: "Variables", style: "snake_case", example: "user_name" },
      { type: "Functions", style: "snake_case", example: "calculate_total()" },
      { type: "Classes", style: "PascalCase", example: "UserAccount" },
      { type: "Constants", style: "UPPER_CASE", example: "MAX_SIZE" }
    ]
  }
};

let html = "<h3>" + pythonExamples.indentation.title + "</h3>";
html += "<div style='display: flex; gap: 20px;'>";

html += "<div style='flex: 1; background: #d4edda; padding: 10px; border-radius: 8px;'>";
html += "<b>✅ Correct:</b><pre>" + pythonExamples.indentation.correct + "</pre></div>";

html += "<div style='flex: 1; background: #f8d7da; padding: 10px; border-radius: 8px;'>";
html += "<b>❌ Wrong:</b><pre>" + pythonExamples.indentation.wrong + "</pre></div>";

html += "</div>";

html += "<h3>" + pythonExamples.naming.title + "</h3>";
html += "<table border='1' style='border-collapse: collapse; width: 100%;'>";
html += "<tr><th>Type</th><th>Convention</th><th>Example</th></tr>";
pythonExamples.naming.examples.forEach(item => {
  html += "<tr><td>" + item.type + "</td><td>" + item.style + "</td><td><code>" + item.example + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'output': {
      title: 'Python Output',
      content: `# Python Output 🖨️

Think of \`print()\` like a **megaphone** - it announces your messages to the world!

## Basic Print

\`\`\`python
print("Hello, World!")
# Output: Hello, World!

print("Line 1")
print("Line 2")
# Output:
# Line 1
# Line 2
\`\`\`

## Print Multiple Values

\`\`\`python
name = "Alice"
age = 25

# Comma-separated (adds space automatically)
print("Name:", name, "Age:", age)
# Output: Name: Alice Age: 25

# Multiple arguments
print(1, 2, 3, 4, 5)
# Output: 1 2 3 4 5
\`\`\`

## The sep Parameter

Control what goes between values:

\`\`\`python
print("a", "b", "c")
# Output: a b c

print("a", "b", "c", sep="-")
# Output: a-b-c

print("a", "b", "c", sep="")
# Output: abc

print(2024, 1, 15, sep="/")
# Output: 2024/1/15
\`\`\`

## The end Parameter

Control what goes at the end:

\`\`\`python
print("Hello", end=" ")
print("World")
# Output: Hello World (same line!)

# Progress bar simulation
print("Loading", end="")
print(".", end="")
print(".", end="")
print(".", end="")
print(" Done!")
# Output: Loading... Done!
\`\`\`

## F-Strings (Best Practice!) 🌟

\`\`\`python
name = "Alice"
age = 25
score = 95.5

# F-string (Python 3.6+)
print(f"Hello, {name}!")
# Output: Hello, Alice!

print(f"{name} is {age} years old")
# Output: Alice is 25 years old

# Expressions inside
print(f"Next year: {age + 1}")
# Output: Next year: 26

# Formatting numbers
print(f"Score: {score:.1f}%")
# Output: Score: 95.5%

print(f"Price: \${49.99:,.2f}")
# Output: Price: \$49.99
\`\`\`

## Format Specifications

\`\`\`python
# Width and alignment
print(f"{'left':<10}")   # Left align
print(f"{'center':^10}") # Center
print(f"{'right':>10}")  # Right align

# Numbers
num = 42
print(f"{num:05d}")      # 00042 (zero-padded)
print(f"{num:+d}")       # +42 (show sign)

# Floats
pi = 3.14159
print(f"{pi:.2f}")       # 3.14
print(f"{pi:10.2f}")     # "      3.14"

# Percentages
ratio = 0.85
print(f"{ratio:.1%}")    # 85.0%

# Large numbers
big = 1234567
print(f"{big:,}")        # 1,234,567
\`\`\`

## Old Formatting (Know It, Don't Use It)

\`\`\`python
# %-formatting (C-style, old)
print("Hello, %s!" % name)

# .format() method (Python 2.6+)
print("Hello, {}!".format(name))

# F-strings (Python 3.6+) ✅ USE THIS
print(f"Hello, {name}!")
\`\`\`

## Printing Special Characters

\`\`\`python
# Newline
print("Line 1\\nLine 2")
# Output:
# Line 1
# Line 2

# Tab
print("Column1\\tColumn2")
# Output: Column1    Column2

# Backslash
print("C:\\\\Users\\\\name")
# Output: C:\\Users\\name

# Raw string (no escaping)
print(r"C:\\Users\\name")
# Output: C:\\Users\\name
\`\`\`

## Print to File

\`\`\`python
with open("output.txt", "w") as f:
    print("Hello, File!", file=f)
\`\`\`

## Debugging with Print

\`\`\`python
# Debug variable values
x = 42
print(f"{x=}")  # Python 3.8+
# Output: x=42

# With expression
print(f"{x * 2=}")
# Output: x * 2=84
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🖨️ Python Output Demo</h2>
<div id="demo"></div>

<script>
// Simulating Python print functions

const examples = [
  {
    title: "Basic Print",
    code: 'print("Hello, World!")',
    output: "Hello, World!"
  },
  {
    title: "Multiple Values",
    code: 'print("Name:", "Alice", "Age:", 25)',
    output: "Name: Alice Age: 25"
  },
  {
    title: "sep Parameter",
    code: 'print(2024, 1, 15, sep="/")',
    output: "2024/1/15"
  },
  {
    title: "F-String",
    code: 'name = "Bob"\\nprint(f"Hello, {name}!")',
    output: "Hello, Bob!"
  },
  {
    title: "Number Formatting",
    code: 'pi = 3.14159\\nprint(f"{pi:.2f}")',
    output: "3.14"
  },
  {
    title: "Large Numbers",
    code: 'big = 1234567\\nprint(f"{big:,}")',
    output: "1,234,567"
  }
];

let html = "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px; text-align: left;'>Example</th>";
html += "<th style='padding: 10px; text-align: left;'>Code</th>";
html += "<th style='padding: 10px; text-align: left;'>Output</th>";
html += "</tr>";

examples.forEach((ex, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><b>" + ex.title + "</b></td>";
  html += "<td style='padding: 10px;'><code style='background: #e9ecef; padding: 2px 6px;'>" + ex.code.replace(/\\n/g, "<br>") + "</code></td>";
  html += "<td style='padding: 10px; font-family: monospace;'>" + ex.output + "</td>";
  html += "</tr>";
});

html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'comments': {
      title: 'Python Comments',
      content: `# Python Comments 💬

Think of comments like **sticky notes** in your code - they explain what's happening without affecting how the code runs!

## Single-Line Comments

Use \`#\` for single-line comments:

\`\`\`python
# This is a comment
print("Hello!")  # This is also a comment

# Calculate the total price
# including tax and shipping
total = price * 1.08 + shipping
\`\`\`

## Multi-Line Comments

Python doesn't have official multi-line comments, but we use:

### Triple Quotes (Common Practice)
\`\`\`python
"""
This is a multi-line comment.
It can span multiple lines.
Used for longer explanations.
"""

'''
Single quotes work too.
Same purpose.
'''
\`\`\`

### Multiple # (Also Valid)
\`\`\`python
# This is line 1 of the comment
# This is line 2 of the comment
# This is line 3 of the comment
\`\`\`

## Docstrings 📚

Special comments that document functions, classes, and modules:

\`\`\`python
def calculate_area(radius):
    """
    Calculate the area of a circle.
    
    Args:
        radius: The radius of the circle (float or int)
    
    Returns:
        The area of the circle (float)
    
    Example:
        >>> calculate_area(5)
        78.53981633974483
    """
    import math
    return math.pi * radius ** 2
\`\`\`

Access docstrings:
\`\`\`python
print(calculate_area.__doc__)
help(calculate_area)
\`\`\`

## Good vs Bad Comments

### ❌ Bad Comments
\`\`\`python
# Increment x by 1
x = x + 1  # Obvious - don't comment this!

# Loop through list
for item in list:  # We can see that!
    pass
\`\`\`

### ✅ Good Comments
\`\`\`python
# Use exponential backoff to prevent API rate limiting
retry_delay = 2 ** attempt

# HACK: Temporary fix until API v2 is released
# TODO: Remove after migration (ticket #1234)
result = legacy_api_call()

# Business rule: Orders over $100 get free shipping
if order_total > 100:
    shipping = 0
\`\`\`

## Special Comment Tags

\`\`\`python
# TODO: Implement caching
# FIXME: This breaks with negative numbers
# HACK: Workaround for library bug
# NOTE: Requires Python 3.8+
# XXX: Needs attention
# OPTIMIZE: Consider memoization
\`\`\`

## Comment Best Practices 🎯

| Do | Don't |
|-----|-------|
| Explain WHY, not WHAT | State the obvious |
| Keep comments updated | Let them get stale |
| Use docstrings for APIs | Skip documentation |
| Be concise | Write novels |

## Self-Documenting Code

The best comment is no comment - write clear code!

\`\`\`python
# ❌ Needs comment
# Calculate tax
t = p * 0.08

# ✅ Self-documenting
tax_rate = 0.08
tax_amount = price * tax_rate
\`\`\`

\`\`\`python
# ❌ What does this mean?
if d > 30:
    pass

# ✅ Clear without comment
if days_since_last_login > 30:
    send_reminder_email()
\`\`\`

## Type Hints as Documentation

\`\`\`python
# Modern Python uses type hints
def greet(name: str, times: int = 1) -> str:
    return (f"Hello, {name}! " * times).strip()

# Now we know:
# - name must be a string
# - times is optional, defaults to 1
# - Returns a string
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>💬 Python Comments Demo</h2>
<div id="demo"></div>

<script>
const commentTypes = [
  {
    type: "Single-line",
    syntax: "#",
    example: "# This is a comment\\nprint('Hello')  # Inline comment"
  },
  {
    type: "Multi-line",
    syntax: '"""..."""',
    example: '"""\\nThis is a\\nmulti-line comment\\n"""'
  },
  {
    type: "Docstring",
    syntax: '"""At function start"""',
    example: 'def greet(name):\\n    """Return greeting."""\\n    return f"Hi, {name}"'
  }
];

const specialTags = [
  { tag: "TODO:", meaning: "Feature to implement" },
  { tag: "FIXME:", meaning: "Bug to fix" },
  { tag: "HACK:", meaning: "Temporary workaround" },
  { tag: "NOTE:", meaning: "Important information" },
  { tag: "XXX:", meaning: "Needs attention" }
];

let html = "<h3>Comment Types</h3>";
html += "<div style='display: flex; gap: 15px; flex-wrap: wrap;'>";

commentTypes.forEach(ct => {
  html += "<div style='flex: 1; min-width: 200px; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3776AB;'>";
  html += "<h4>" + ct.type + "</h4>";
  html += "<code style='color: #666;'>" + ct.syntax + "</code>";
  html += "<pre style='background: #1a1a2e; color: #0f0; padding: 10px; border-radius: 4px; font-size: 12px;'>" + ct.example + "</pre>";
  html += "</div>";
});

html += "</div>";

html += "<h3>Special Comment Tags</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'><th style='padding: 8px;'>Tag</th><th style='padding: 8px;'>Purpose</th></tr>";
specialTags.forEach((tag, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 8px;'><code style='color: #e83e8c;'>" + tag.tag + "</code></td>";
  html += "<td style='padding: 8px;'>" + tag.meaning + "</td>";
  html += "</tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'input': {
      title: 'Python User Input',
      content: `# Python User Input ⌨️

Think of \`input()\` like asking someone a **question** - Python waits for their answer!

## Basic Input

\`\`\`python
name = input("What is your name? ")
print(f"Hello, {name}!")

# When you run this:
# What is your name? Alice
# Hello, Alice!
\`\`\`

## Important: Input Returns a String!

\`\`\`python
age = input("Enter your age: ")
print(type(age))  # <class 'str'>

# This won't work as expected!
# next_year = age + 1  # TypeError!

# Convert to int first
age = int(input("Enter your age: "))
next_year = age + 1  # Works!
\`\`\`

## Type Conversion

\`\`\`python
# Integer input
age = int(input("Age: "))

# Float input
price = float(input("Price: "))

# Boolean (custom)
answer = input("Continue? (y/n): ")
continue_flag = answer.lower() == 'y'
\`\`\`

## Input Validation

\`\`\`python
# Basic validation
while True:
    try:
        age = int(input("Enter your age: "))
        if 0 <= age <= 150:
            break
        print("Please enter a valid age (0-150)")
    except ValueError:
        print("Please enter a number!")

print(f"Your age is {age}")
\`\`\`

## Multiple Inputs

### One at a Time
\`\`\`python
name = input("Name: ")
age = int(input("Age: "))
city = input("City: ")
\`\`\`

### Space-Separated
\`\`\`python
# User enters: Alice 25 NYC
data = input("Enter name, age, city: ")
name, age, city = data.split()
age = int(age)

# Or using unpacking
x, y = map(int, input("Enter x y: ").split())
\`\`\`

### Multiple Values at Once
\`\`\`python
# Get list of numbers
numbers = input("Enter numbers (space-separated): ")
num_list = [int(x) for x in numbers.split()]
print(f"Sum: {sum(num_list)}")
\`\`\`

## Password Input

\`\`\`python
import getpass

# Password is hidden while typing
password = getpass.getpass("Enter password: ")
\`\`\`

## Command Line Arguments

\`\`\`python
import sys

# python script.py arg1 arg2
print(sys.argv)  # ['script.py', 'arg1', 'arg2']

# Better way: argparse
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--name", required=True)
args = parser.parse_args()
print(f"Hello, {args.name}!")
\`\`\`

## Real-World Example: Calculator

\`\`\`python
def calculator():
    print("Simple Calculator")
    print("================")
    
    while True:
        try:
            num1 = float(input("First number: "))
            operator = input("Operator (+, -, *, /): ")
            num2 = float(input("Second number: "))
            
            if operator == '+':
                result = num1 + num2
            elif operator == '-':
                result = num1 - num2
            elif operator == '*':
                result = num1 * num2
            elif operator == '/':
                if num2 == 0:
                    print("Cannot divide by zero!")
                    continue
                result = num1 / num2
            else:
                print("Invalid operator!")
                continue
            
            print(f"Result: {result}")
            
            again = input("Calculate again? (y/n): ")
            if again.lower() != 'y':
                break
                
        except ValueError:
            print("Please enter valid numbers!")

calculator()
\`\`\`

## Input Best Practices 🎯

1. **Always validate** user input
2. **Handle exceptions** (try/except)
3. **Provide clear prompts** with expected format
4. **Use getpass** for sensitive data
5. **Use argparse** for command-line tools
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>⌨️ Python Input Demo</h2>
<div id="demo"></div>

<script>
// Simulate Python input examples

const examples = [
  {
    title: "Basic String Input",
    prompt: "What is your name?",
    input: "Alice",
    code: 'name = input("What is your name? ")',
    output: "Hello, Alice!"
  },
  {
    title: "Integer Input (with conversion)",
    prompt: "Enter your age:",
    input: "25",
    code: 'age = int(input("Enter your age: "))',
    output: "Next year you'll be 26!"
  },
  {
    title: "Multiple Values",
    prompt: "Enter two numbers:",
    input: "10 20",
    code: 'x, y = map(int, input().split())',
    output: "Sum: 30"
  }
];

let html = "<h3>Input Examples</h3>";

examples.forEach(ex => {
  html += "<div style='background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3776AB;'>";
  html += "<h4>" + ex.title + "</h4>";
  html += "<pre style='background: #1a1a2e; color: #0f0; padding: 10px; border-radius: 4px;'>";
  html += ">>> " + ex.code + "\\n";
  html += ex.prompt + " <span style='color: #ff0;'>" + ex.input + "</span>\\n";
  html += ">>> print(result)\\n";
  html += ex.output + "</pre>";
  html += "</div>";
});

html += "<h3>Input Validation Pattern</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "while True:\\n";
html += "    try:\\n";
html += "        age = int(input('Age: '))\\n";
html += "        if 0 <= age <= 150:\\n";
html += "            break\\n";
html += "        print('Invalid age')\\n";
html += "    except ValueError:\\n";
html += "        print('Enter a number!')</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'venv': {
      title: 'Python Virtual Environments',
      content: `# Python Virtual Environments 🏠

Think of a virtual environment like having a **separate toolbox for each project** - each project gets its own tools without conflicting with others!

## Why Virtual Environments? (Non-Negotiable!)

### The Problem
\`\`\`
Project A needs: Django 4.0
Project B needs: Django 3.2
System Python: Can only have ONE version!
\`\`\`

### The Solution: Virtual Environments!
\`\`\`
Project A → venv with Django 4.0
Project B → venv with Django 3.2
No conflicts! ✅
\`\`\`

## Creating a Virtual Environment

\`\`\`bash
# Navigate to your project
cd my_project

# Create virtual environment
python3 -m venv venv

# Your folder now has:
# my_project/
#   └── venv/
#       ├── bin/ (or Scripts/ on Windows)
#       ├── include/
#       ├── lib/
#       └── pyvenv.cfg
\`\`\`

## Activating the Environment

### macOS/Linux
\`\`\`bash
source venv/bin/activate

# Your prompt changes:
# (venv) $
\`\`\`

### Windows
\`\`\`bash
venv\\Scripts\\activate

# Your prompt changes:
# (venv) C:\\>
\`\`\`

## Installing Packages

\`\`\`bash
# With venv activated:
pip install django
pip install requests pandas numpy

# Check installed packages
pip list

# Check specific package
pip show django
\`\`\`

## Freezing Dependencies

\`\`\`bash
# Save current packages to file
pip freeze > requirements.txt

# Your requirements.txt:
# Django==4.2.7
# requests==2.31.0
# pandas==2.1.3
# numpy==1.26.2
\`\`\`

## Installing from requirements.txt

\`\`\`bash
# On a new machine or fresh venv:
pip install -r requirements.txt
\`\`\`

## Deactivating

\`\`\`bash
deactivate

# Prompt returns to normal:
# $
\`\`\`

## Best Practices 🎯

### 1. Project Structure
\`\`\`
my_project/
├── venv/           # Virtual environment (git ignored!)
├── src/            # Your source code
├── tests/          # Test files
├── requirements.txt
├── requirements-dev.txt  # Dev dependencies
├── .gitignore
└── README.md
\`\`\`

### 2. .gitignore
\`\`\`
# Always ignore venv!
venv/
.venv/
env/
ENV/

# Other Python ignores
__pycache__/
*.pyc
*.pyo
.Python
build/
dist/
*.egg-info/
\`\`\`

### 3. Version Pinning

\`\`\`bash
# Bad: No version (can break later)
requests

# Good: Exact version
requests==2.31.0

# OK: Compatible version
requests>=2.31.0,<3.0.0
\`\`\`

### 4. Separate Dev Dependencies

\`\`\`bash
# requirements.txt (production)
django==4.2.7
gunicorn==21.2.0

# requirements-dev.txt
-r requirements.txt  # Include production deps
pytest==7.4.3
black==23.11.0
flake8==6.1.0
\`\`\`

## Modern Alternatives

### Poetry (Recommended for new projects)
\`\`\`bash
pip install poetry
poetry new my_project
poetry add django
poetry install
\`\`\`

### pipenv
\`\`\`bash
pip install pipenv
pipenv install django
pipenv shell
\`\`\`

## Quick Reference 📋

| Command | Purpose |
|---------|---------|
| \`python3 -m venv venv\` | Create venv |
| \`source venv/bin/activate\` | Activate (Mac/Linux) |
| \`venv\\Scripts\\activate\` | Activate (Windows) |
| \`pip install package\` | Install package |
| \`pip freeze > requirements.txt\` | Save dependencies |
| \`pip install -r requirements.txt\` | Install from file |
| \`deactivate\` | Exit venv |

## Enterprise Standard Workflow

\`\`\`bash
# 1. Clone project
git clone repo-url
cd my_project

# 2. Create venv
python3 -m venv venv

# 3. Activate
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Work on project
# ...

# 6. Add new dependency
pip install new_package
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add new_package dependency"
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🏠 Virtual Environments Demo</h2>
<div id="demo"></div>

<script>
const workflow = [
  { step: 1, command: "python3 -m venv venv", desc: "Create virtual environment" },
  { step: 2, command: "source venv/bin/activate", desc: "Activate environment" },
  { step: 3, command: "pip install django", desc: "Install packages" },
  { step: 4, command: "pip freeze > requirements.txt", desc: "Save dependencies" },
  { step: 5, command: "deactivate", desc: "Exit when done" }
];

const benefits = [
  "✅ No conflicts between projects",
  "✅ Easy to reproduce on any machine",
  "✅ Clean system Python",
  "✅ Version control friendly",
  "✅ Team collaboration made easy"
];

let html = "<h3>Virtual Environment Workflow</h3>";
html += "<div style='background: #1a1a2e; color: #0f0; padding: 20px; border-radius: 8px; font-family: monospace;'>";

workflow.forEach(w => {
  html += "<div style='margin: 10px 0; padding: 10px; background: #2a2a4e; border-radius: 4px;'>";
  html += "<span style='color: #ff0;'>Step " + w.step + ":</span> ";
  html += "<code style='color: #0ff;'>$ " + w.command + "</code>";
  html += "<br><small style='color: #888;'>" + w.desc + "</small>";
  html += "</div>";
});

html += "</div>";

html += "<h3>Why Use Virtual Environments?</h3>";
html += "<ul style='background: #e8f5e9; padding: 20px 40px; border-radius: 8px;'>";
benefits.forEach(b => {
  html += "<li style='margin: 5px 0;'>" + b + "</li>";
});
html += "</ul>";

html += "<h3>Project Structure</h3>";
html += "<pre style='background: #f8f9fa; padding: 15px; border-radius: 8px;'>";
html += "my_project/\\n";
html += "├── venv/              <span style='color: #888;'># ← Git ignored!</span>\\n";
html += "├── src/\\n";
html += "├── tests/\\n";
html += "├── requirements.txt   <span style='color: #888;'># ← Commit this!</span>\\n";
html += "└── README.md</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Variables & Data Types
    'variables': {
      title: 'Python Variables',
      content: `# Python Variables 📦

Think of variables like **labeled boxes** - you put something in and give it a name so you can find it later!

## Creating Variables

\`\`\`python
# No declaration needed - just assign!
name = "Alice"
age = 25
price = 19.99
is_active = True

# Python figures out the type automatically
print(type(name))      # <class 'str'>
print(type(age))       # <class 'int'>
print(type(price))     # <class 'float'>
print(type(is_active)) # <class 'bool'>
\`\`\`

## Variable Naming Rules

\`\`\`python
# ✅ Valid names
name = "Alice"
_private = "secret"
user_name = "bob"
userName = "bob"    # Works but not Pythonic
name2 = "Charlie"
MAX_SIZE = 100

# ❌ Invalid names
2name = "error"     # Can't start with number
my-name = "error"   # No hyphens
my name = "error"   # No spaces
class = "error"     # Reserved keyword
\`\`\`

## Multiple Assignment

\`\`\`python
# Assign same value
a = b = c = 0
print(a, b, c)  # 0 0 0

# Assign different values
x, y, z = 1, 2, 3
print(x, y, z)  # 1 2 3

# Swap values (Python magic!)
a, b = 1, 2
a, b = b, a
print(a, b)  # 2 1

# Unpack list
first, second, third = [1, 2, 3]
\`\`\`

## Variable Scope

\`\`\`python
# Global variable
counter = 0

def increment():
    global counter  # Must declare to modify global
    counter += 1

def show_local():
    counter = 100   # This is a LOCAL variable
    print(counter)  # 100

show_local()
print(counter)  # Still 0 (global unchanged)

increment()
print(counter)  # Now 1
\`\`\`

## Dynamic Typing

\`\`\`python
# Variable can change type
x = 10          # int
print(type(x))  # <class 'int'>

x = "hello"     # now str
print(type(x))  # <class 'str'>

x = [1, 2, 3]   # now list
print(type(x))  # <class 'list'>
\`\`\`

## Type Annotations (Best Practice)

\`\`\`python
# Python 3.5+ type hints
name: str = "Alice"
age: int = 25
price: float = 19.99
is_active: bool = True

# Function with types
def greet(name: str) -> str:
    return f"Hello, {name}!"

# Optional values
from typing import Optional
username: Optional[str] = None
\`\`\`

## Constants (by Convention)

\`\`\`python
# Python has no true constants
# Use UPPER_CASE by convention
PI = 3.14159
MAX_CONNECTIONS = 100
API_KEY = "secret123"

# Can still change (but don't!)
PI = 3  # Works, but BAD PRACTICE
\`\`\`

## Checking Variables

\`\`\`python
x = 10

# Check type
print(type(x))        # <class 'int'>
print(isinstance(x, int))  # True

# Check identity
y = x
print(id(x))          # Memory address
print(x is y)         # True (same object)

# Check if exists
print('x' in dir())   # True
\`\`\`

## Best Practices 🎯

| Convention | Use Case |
|------------|----------|
| \`snake_case\` | Variables, functions |
| \`PascalCase\` | Classes |
| \`UPPER_CASE\` | Constants |
| \`_prefix\` | Private/internal |
| \`__dunder__\` | Python special methods |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📦 Python Variables Demo</h2>
<div id="demo"></div>

<script>
// Demonstrating Python variable concepts

const concepts = [
  {
    title: "Creating Variables",
    code: 'name = "Alice"\\nage = 25\\nprice = 19.99',
    explanation: "No type declaration needed!"
  },
  {
    title: "Multiple Assignment",
    code: 'x, y, z = 1, 2, 3\\na = b = c = 0',
    explanation: "Assign multiple values at once"
  },
  {
    title: "Swap Values",
    code: 'a, b = 1, 2\\na, b = b, a\\n# Now a=2, b=1',
    explanation: "Python's elegant swap!"
  },
  {
    title: "Type Hints",
    code: 'name: str = "Alice"\\nage: int = 25',
    explanation: "Modern Python best practice"
  }
];

let html = "";

concepts.forEach(c => {
  html += "<div style='background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #3776AB;'>";
  html += "<h4>" + c.title + "</h4>";
  html += "<pre style='background: #1a1a2e; color: #0f0; padding: 10px; border-radius: 4px;'>" + c.code + "</pre>";
  html += "<p style='color: #666; margin: 5px 0;'>" + c.explanation + "</p>";
  html += "</div>";
});

html += "<h3>Naming Conventions</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 8px;'>Convention</th><th style='padding: 8px;'>Use For</th><th style='padding: 8px;'>Example</th></tr>";
[
  ["snake_case", "Variables, Functions", "user_name"],
  ["PascalCase", "Classes", "UserAccount"],
  ["UPPER_CASE", "Constants", "MAX_SIZE"],
  ["_prefix", "Private", "_internal_var"]
].forEach((row, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 8px;'><code>" + row[0] + "</code></td>";
  html += "<td style='padding: 8px;'>" + row[1] + "</td>";
  html += "<td style='padding: 8px;'><code>" + row[2] + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Data Types
    'datatypes': {
      title: 'Python Data Types',
      content: `# Python Data Types 🎨

Think of data types like **different containers** - each one is designed to hold a specific kind of thing!

## Built-in Data Types

| Category | Types |
|----------|-------|
| **Text** | \`str\` |
| **Numeric** | \`int\`, \`float\`, \`complex\` |
| **Sequence** | \`list\`, \`tuple\`, \`range\` |
| **Mapping** | \`dict\` |
| **Set** | \`set\`, \`frozenset\` |
| **Boolean** | \`bool\` |
| **Binary** | \`bytes\`, \`bytearray\`, \`memoryview\` |
| **None** | \`NoneType\` |

## Examples of Each Type

\`\`\`python
# Text
name = "Alice"                    # str

# Numeric
age = 25                          # int
price = 19.99                     # float
z = 3 + 4j                        # complex

# Sequence
colors = ["red", "green"]         # list
point = (10, 20)                  # tuple
numbers = range(5)                # range

# Mapping
person = {"name": "Bob", "age": 30}  # dict

# Set
unique = {1, 2, 3}                # set
frozen = frozenset({1, 2, 3})     # frozenset

# Boolean
is_active = True                  # bool

# None
result = None                     # NoneType
\`\`\`

## Checking Types

\`\`\`python
x = 42
print(type(x))          # <class 'int'>
print(isinstance(x, int))  # True
print(isinstance(x, (int, float)))  # True (check multiple)
\`\`\`

## Mutable vs Immutable (Critical!)

| Mutable (Can Change) | Immutable (Can't Change) |
|---------------------|-------------------------|
| list | int, float |
| dict | str |
| set | tuple |
| bytearray | frozenset |

\`\`\`python
# Immutable - creates new object
name = "Alice"
name = name + " Smith"  # New string created

# Mutable - modifies in place
items = [1, 2, 3]
items.append(4)  # Same list modified
\`\`\`

## Why This Matters

\`\`\`python
# Immutable is safe for dict keys
d = {(1, 2): "point"}  # ✅ tuple works

# Mutable fails as dict key
d = {[1, 2]: "list"}   # ❌ TypeError!

# Function side effects
def bad_function(items=[]):  # ❌ Danger!
    items.append(1)
    return items

print(bad_function())  # [1]
print(bad_function())  # [1, 1] - Unexpected!

def good_function(items=None):  # ✅ Safe
    if items is None:
        items = []
    items.append(1)
    return items
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎨 Python Data Types</h2>
<div id="demo"></div>

<script>
const types = [
  { name: "str", category: "Text", example: '"Hello"', mutable: false },
  { name: "int", category: "Numeric", example: "42", mutable: false },
  { name: "float", category: "Numeric", example: "3.14", mutable: false },
  { name: "list", category: "Sequence", example: "[1, 2, 3]", mutable: true },
  { name: "tuple", category: "Sequence", example: "(1, 2, 3)", mutable: false },
  { name: "dict", category: "Mapping", example: '{"a": 1}', mutable: true },
  { name: "set", category: "Set", example: "{1, 2, 3}", mutable: true },
  { name: "bool", category: "Boolean", example: "True", mutable: false },
  { name: "None", category: "None", example: "None", mutable: false }
];

let html = "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Type</th>";
html += "<th style='padding: 10px;'>Category</th>";
html += "<th style='padding: 10px;'>Example</th>";
html += "<th style='padding: 10px;'>Mutable?</th></tr>";

types.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + t.name + "</code></td>";
  html += "<td style='padding: 10px;'>" + t.category + "</td>";
  html += "<td style='padding: 10px;'><code>" + t.example + "</code></td>";
  html += "<td style='padding: 10px;'>" + (t.mutable ? "✏️ Yes" : "🔒 No") + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'numbers': {
      title: 'Python Numbers',
      content: `# Python Numbers 🔢

Think of Python numbers like your **calculator** - but way more powerful!

## Number Types

\`\`\`python
# Integer (whole numbers)
age = 25
population = 7_900_000_000  # Underscores for readability!
negative = -42

# Float (decimals)
price = 19.99
pi = 3.14159
scientific = 1.5e10  # 1.5 × 10^10

# Complex (real + imaginary)
z = 3 + 4j
print(z.real)  # 3.0
print(z.imag)  # 4.0
\`\`\`

## Arithmetic Operations

\`\`\`python
a, b = 10, 3

print(a + b)   # 13 (addition)
print(a - b)   # 7 (subtraction)
print(a * b)   # 30 (multiplication)
print(a / b)   # 3.333... (division - always float!)
print(a // b)  # 3 (floor division)
print(a % b)   # 1 (modulo/remainder)
print(a ** b)  # 1000 (power)
\`\`\`

## Special Functions

\`\`\`python
import math

# Rounding
print(round(3.7))       # 4
print(round(3.14159, 2)) # 3.14
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4

# Absolute value
print(abs(-42))         # 42

# Power and roots
print(pow(2, 3))        # 8
print(math.sqrt(16))    # 4.0

# Min/Max
print(min(1, 5, 3))     # 1
print(max(1, 5, 3))     # 5
\`\`\`

## Number Systems

\`\`\`python
# Different bases
decimal = 42        # Base 10
binary = 0b101010   # Base 2
octal = 0o52        # Base 8
hexa = 0x2A         # Base 16

# All equal 42!
print(decimal, binary, octal, hexa)
# 42 42 42 42

# Convert to string
print(bin(42))   # '0b101010'
print(oct(42))   # '0o52'
print(hex(42))   # '0x2a'
\`\`\`

## Float Precision Warning! ⚠️

\`\`\`python
# Float math can be imprecise!
print(0.1 + 0.2)  # 0.30000000000000004

# For money, use Decimal
from decimal import Decimal
price = Decimal('19.99')
tax = Decimal('0.08')
total = price * (1 + tax)
print(total)  # 21.5892 (exact!)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔢 Python Numbers Demo</h2>
<div id="demo"></div>

<script>
const a = 10, b = 3;

const operations = [
  { op: "Addition", expr: "10 + 3", result: a + b },
  { op: "Subtraction", expr: "10 - 3", result: a - b },
  { op: "Multiplication", expr: "10 * 3", result: a * b },
  { op: "Division", expr: "10 / 3", result: (a / b).toFixed(4) },
  { op: "Floor Division", expr: "10 // 3", result: Math.floor(a / b) },
  { op: "Modulo", expr: "10 % 3", result: a % b },
  { op: "Power", expr: "10 ** 3", result: Math.pow(a, b) }
];

let html = "<h3>Arithmetic Operations (a=10, b=3)</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Operation</th>";
html += "<th style='padding: 10px;'>Expression</th>";
html += "<th style='padding: 10px;'>Result</th></tr>";

operations.forEach((op, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'>" + op.op + "</td>";
  html += "<td style='padding: 10px;'><code>" + op.expr + "</code></td>";
  html += "<td style='padding: 10px; font-weight: bold;'>" + op.result + "</td></tr>";
});
html += "</table>";

html += "<h3>⚠️ Float Precision Warning</h3>";
html += "<div style='background: #fff3cd; padding: 15px; border-radius: 8px;'>";
html += "<code>0.1 + 0.2 = " + (0.1 + 0.2) + "</code>";
html += "<p>Use <code>Decimal</code> for financial calculations!</p></div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'strings': {
      title: 'Python Strings',
      content: `# Python Strings 📝

Think of strings like **beads on a necklace** - each character has a position!

## Creating Strings

\`\`\`python
single = 'Hello'
double = "Hello"
triple = '''Multi
line
string'''
raw = r"C:\\Users\\name"  # No escaping
\`\`\`

## String Indexing

\`\`\`python
text = "Python"
#       012345
#      -6-5-4-3-2-1

print(text[0])   # 'P'
print(text[-1])  # 'n'
print(text[1:4]) # 'yth'
print(text[:3])  # 'Pyt'
print(text[3:])  # 'hon'
print(text[::-1]) # 'nohtyP' (reverse!)
\`\`\`

## Common String Methods

\`\`\`python
text = "  Hello, World!  "

# Case
print(text.upper())      # "  HELLO, WORLD!  "
print(text.lower())      # "  hello, world!  "
print(text.title())      # "  Hello, World!  "

# Trimming
print(text.strip())      # "Hello, World!"
print(text.lstrip())     # "Hello, World!  "
print(text.rstrip())     # "  Hello, World!"

# Finding
print(text.find("World"))   # 9
print(text.count("l"))      # 3
print("Hello" in text)      # True

# Replacing
print(text.replace("World", "Python"))

# Splitting & Joining
words = "a,b,c".split(",")  # ['a', 'b', 'c']
joined = "-".join(words)    # "a-b-c"
\`\`\`

## F-Strings (Best Practice!)

\`\`\`python
name = "Alice"
age = 25

# Modern way
print(f"Name: {name}, Age: {age}")
print(f"Next year: {age + 1}")
print(f"{name.upper()!r}")  # repr

# Formatting
pi = 3.14159
print(f"{pi:.2f}")      # 3.14
print(f"{1000000:,}")   # 1,000,000
print(f"{0.85:.1%}")    # 85.0%
\`\`\`

## String Validation

\`\`\`python
print("123".isdigit())     # True
print("abc".isalpha())     # True
print("abc123".isalnum())  # True
print("ABC".isupper())     # True
print("  ".isspace())      # True
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📝 Python Strings Demo</h2>
<div id="demo"></div>

<script>
const text = "Python";

const indexExamples = [
  { expr: 'text[0]', result: text[0] },
  { expr: 'text[-1]', result: text[text.length-1] },
  { expr: 'text[1:4]', result: text.slice(1, 4) },
  { expr: 'text[:3]', result: text.slice(0, 3) },
  { expr: 'text[::-1]', result: text.split('').reverse().join('') }
];

let html = "<h3>String Indexing: '" + text + "'</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Expression</th>";
html += "<th style='padding: 10px;'>Result</th></tr>";

indexExamples.forEach((ex, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + ex.expr + "</code></td>";
  html += "<td style='padding: 10px;'><b>'" + ex.result + "'</b></td></tr>";
});
html += "</table>";

html += "<h3>String Methods</h3>";
html += "<div style='display: flex; gap: 10px; flex-wrap: wrap;'>";
const methods = ["upper()", "lower()", "strip()", "split()", "replace()"];
methods.forEach(m => {
  html += "<span style='background: #e8f5e9; padding: 5px 10px; border-radius: 15px;'>" + m + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Casting
    'casting': {
      title: 'Python Casting',
      content: `# Python Casting 🔄

Think of casting like **changing costumes** - the same actor (data) puts on different outfits (types)!

## What is Casting?

Casting means converting one data type to another.

\`\`\`python
x = "123"      # This is a string
y = int(x)     # Now it's an integer!
print(type(y)) # <class 'int'>
\`\`\`

## Integer Casting: int()

\`\`\`python
# From float
x = int(3.14)    # 3 (truncates, doesn't round!)
x = int(3.99)    # 3 (still truncates!)

# From string
x = int("42")    # 42
x = int("3.14")  # ❌ Error! Can't convert float string

# From boolean
x = int(True)    # 1
x = int(False)   # 0
\`\`\`

## Float Casting: float()

\`\`\`python
# From integer
x = float(5)       # 5.0

# From string
x = float("3.14")  # 3.14
x = float("42")    # 42.0

# From boolean
x = float(True)    # 1.0
\`\`\`

## String Casting: str()

\`\`\`python
# From any type
x = str(42)        # "42"
x = str(3.14)      # "3.14"
x = str(True)      # "True"
x = str([1,2,3])   # "[1, 2, 3]"
x = str(None)      # "None"
\`\`\`

## Boolean Casting: bool()

\`\`\`python
# Truthy values → True
bool(1)        # True
bool("hello")  # True
bool([1, 2])   # True

# Falsy values → False
bool(0)        # False
bool("")       # False
bool([])       # False
bool(None)     # False
\`\`\`

## List/Tuple/Set Casting

\`\`\`python
# String to list
list("hello")    # ['h', 'e', 'l', 'l', 'o']

# Tuple to list
list((1, 2, 3))  # [1, 2, 3]

# List to tuple
tuple([1, 2, 3]) # (1, 2, 3)

# List to set (removes duplicates!)
set([1, 1, 2, 2, 3])  # {1, 2, 3}
\`\`\`

## Common Casting Errors

\`\`\`python
# ValueError: invalid literal
int("hello")     # ❌ Can't convert text to int

# ValueError: float string to int
int("3.14")      # ❌ Use int(float("3.14"))

# Works!
int(float("3.14"))  # ✅ 3
\`\`\`

## Best Practices 🎯

\`\`\`python
# Always validate before casting
user_input = "42"

if user_input.isdigit():
    number = int(user_input)
else:
    print("Not a valid number!")

# Or use try-except
try:
    number = int(user_input)
except ValueError:
    print("Invalid number!")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔄 Python Casting Demo</h2>
<div id="demo"></div>

<script>
const examples = [
  { from: '"123"', to: 'int("123")', result: 123, type: "int" },
  { from: '3.99', to: 'int(3.99)', result: 3, type: "int (truncates!)" },
  { from: '42', to: 'float(42)', result: 42.0, type: "float" },
  { from: '3.14', to: 'str(3.14)', result: '"3.14"', type: "str" },
  { from: '""', to: 'bool("")', result: false, type: "bool (falsy)" },
  { from: '"hello"', to: 'bool("hello")', result: true, type: "bool (truthy)" }
];

let html = "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Original</th>";
html += "<th style='padding: 10px;'>Casting</th>";
html += "<th style='padding: 10px;'>Result</th>";
html += "<th style='padding: 10px;'>Type</th></tr>";

examples.forEach((ex, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + ex.from + "</code></td>";
  html += "<td style='padding: 10px;'><code>" + ex.to + "</code></td>";
  html += "<td style='padding: 10px;'><b>" + ex.result + "</b></td>";
  html += "<td style='padding: 10px;'>" + ex.type + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Booleans
    'booleans': {
      title: 'Python Booleans',
      content: `# Python Booleans ✅❌

Think of booleans like **light switches** - they're either ON (True) or OFF (False)!

## Boolean Values

Python has two boolean values:

\`\`\`python
is_sunny = True
is_raining = False

print(type(True))   # <class 'bool'>
print(type(False))  # <class 'bool'>
\`\`\`

## Comparison Operations Return Booleans

\`\`\`python
print(10 > 5)    # True
print(10 < 5)    # False
print(10 == 10)  # True
print(10 != 5)   # True
print(5 >= 5)    # True
print(5 <= 4)    # False
\`\`\`

## Truthy and Falsy Values

### Falsy Values (Evaluate to False)
\`\`\`python
bool(False)    # False
bool(None)     # False
bool(0)        # False
bool(0.0)      # False
bool("")       # False (empty string)
bool([])       # False (empty list)
bool({})       # False (empty dict)
bool(())       # False (empty tuple)
bool(set())    # False (empty set)
\`\`\`

### Truthy Values (Evaluate to True)
\`\`\`python
bool(True)     # True
bool(1)        # True (any non-zero number)
bool(-1)       # True
bool(3.14)     # True
bool("hello")  # True (any non-empty string)
bool([1, 2])   # True (any non-empty list)
bool({"a": 1}) # True
\`\`\`

## Logical Operators

\`\`\`python
# and - Both must be True
print(True and True)   # True
print(True and False)  # False

# or - At least one True
print(True or False)   # True
print(False or False)  # False

# not - Reverses the value
print(not True)        # False
print(not False)       # True
\`\`\`

## Practical Examples

\`\`\`python
age = 25
has_license = True

# Check if can drive
can_drive = age >= 18 and has_license
print(can_drive)  # True

# Check if list is empty
items = []
if not items:
    print("List is empty!")

# Short-circuit evaluation
username = ""
name = username or "Anonymous"
print(name)  # "Anonymous"
\`\`\`

## The bool() Function

\`\`\`python
# Convert to boolean
print(bool("Hello"))  # True
print(bool(0))        # False

# Useful for checking
if bool(user_input):
    process(user_input)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>✅❌ Python Booleans Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Truthy vs Falsy</h3>";

const falsy = ['False', 'None', '0', '""', '[]', '{}'];
const truthy = ['True', '1', '-1', '"hello"', '[1,2]', '{"a":1}'];

html += "<div style='display: flex; gap: 20px;'>";

html += "<div style='flex: 1; background: #ffebee; padding: 15px; border-radius: 8px;'>";
html += "<h4 style='color: #c62828;'>❌ Falsy Values</h4>";
falsy.forEach(v => {
  html += "<div style='padding: 5px;'><code>" + v + "</code> → False</div>";
});
html += "</div>";

html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<h4 style='color: #2e7d32;'>✅ Truthy Values</h4>";
truthy.forEach(v => {
  html += "<div style='padding: 5px;'><code>" + v + "</code> → True</div>";
});
html += "</div>";

html += "</div>";

html += "<h3>Logical Operators</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Expression</th><th style='padding: 10px;'>Result</th></tr>";
[
  ["True and True", true],
  ["True and False", false],
  ["True or False", true],
  ["not True", false]
].forEach((row, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + row[0] + "</code></td>";
  html += "<td style='padding: 10px;'><b>" + row[1] + "</b></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // None
    'none': {
      title: 'Python None',
      content: `# Python None ∅

Think of None like an **empty box** - it exists, but there's nothing inside!

## What is None?

None represents the **absence of a value**. It's Python's way of saying "nothing here!"

\`\`\`python
result = None
print(result)       # None
print(type(result)) # <class 'NoneType'>
\`\`\`

## None vs Other "Empty" Values

\`\`\`python
# None is NOT the same as:
None != 0       # True (None is not zero)
None != ""      # True (None is not empty string)
None != []      # True (None is not empty list)
None != False   # True (None is not False)

# But None IS falsy:
if not None:
    print("None is falsy!")  # This prints!
\`\`\`

## Common Uses of None

### 1. Default Return Value
\`\`\`python
def greet(name):
    print(f"Hello, {name}!")
    # No return statement

result = greet("Alice")  # Prints: Hello, Alice!
print(result)            # None (implicit return)
\`\`\`

### 2. Default Parameter
\`\`\`python
def process(data=None):
    if data is None:
        data = []  # Create new list
    data.append("item")
    return data

# Safe! Each call gets fresh list
print(process())  # ['item']
print(process())  # ['item']
\`\`\`

### 3. Placeholder
\`\`\`python
# Will be set later
user = None
config = None

# After initialization
user = get_user()
config = load_config()
\`\`\`

## Checking for None

\`\`\`python
value = None

# ✅ Best way: use 'is'
if value is None:
    print("Value is None")

# ✅ Check for NOT None
if value is not None:
    print("Value has something")

# ❌ Avoid: == works but 'is' is better
if value == None:  # Works but not Pythonic
    pass
\`\`\`

## Why Use 'is' for None?

\`\`\`python
# There's only ONE None object in Python
a = None
b = None
print(a is b)  # True (same object!)

# 'is' checks identity, '==' checks equality
# For None, identity is more appropriate
\`\`\`

## None in Functions

\`\`\`python
def find_user(user_id):
    users = {1: "Alice", 2: "Bob"}
    return users.get(user_id)  # Returns None if not found

user = find_user(999)
if user is None:
    print("User not found!")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>∅ Python None Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>None Comparisons</h3>";

const comparisons = [
  { expr: "None == 0", result: false, note: "None is not zero" },
  { expr: 'None == ""', result: false, note: "None is not empty string" },
  { expr: "None == []", result: false, note: "None is not empty list" },
  { expr: "None == False", result: false, note: "None is not False" },
  { expr: "bool(None)", result: false, note: "But None IS falsy!" }
];

html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Expression</th>";
html += "<th style='padding: 10px;'>Result</th>";
html += "<th style='padding: 10px;'>Note</th></tr>";

comparisons.forEach((c, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + c.expr + "</code></td>";
  html += "<td style='padding: 10px;'><b>" + c.result + "</b></td>";
  html += "<td style='padding: 10px;'>" + c.note + "</td></tr>";
});
html += "</table>";

html += "<h3>Checking for None</h3>";
html += "<div style='background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<p><b>✅ Best:</b> <code>if value is None:</code></p>";
html += "<p><b>✅ Also good:</b> <code>if value is not None:</code></p>";
html += "<p><b>❌ Avoid:</b> <code>if value == None:</code></p>";
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Operators
    'operators': {
      title: 'Python Operators',
      content: `# Python Operators ➕➖✖️➗

Think of operators like **tools in a toolbox** - each one does a specific job with your data!

## Arithmetic Operators

\`\`\`python
a, b = 10, 3

print(a + b)   # 13 (Addition)
print(a - b)   # 7  (Subtraction)
print(a * b)   # 30 (Multiplication)
print(a / b)   # 3.333... (Division)
print(a // b)  # 3  (Floor Division)
print(a % b)   # 1  (Modulo/Remainder)
print(a ** b)  # 1000 (Exponentiation)
\`\`\`

## Comparison Operators

\`\`\`python
x, y = 5, 10

print(x == y)  # False (Equal)
print(x != y)  # True  (Not Equal)
print(x > y)   # False (Greater Than)
print(x < y)   # True  (Less Than)
print(x >= y)  # False (Greater or Equal)
print(x <= y)  # True  (Less or Equal)
\`\`\`

## Logical Operators

\`\`\`python
a, b = True, False

print(a and b)  # False (Both must be True)
print(a or b)   # True  (At least one True)
print(not a)    # False (Reverses value)
\`\`\`

## Assignment Operators

\`\`\`python
x = 10      # Assign
x += 5      # x = x + 5 → 15
x -= 3      # x = x - 3 → 12
x *= 2      # x = x * 2 → 24
x /= 4      # x = x / 4 → 6.0
x //= 2     # x = x // 2 → 3.0
x %= 2      # x = x % 2 → 1.0
x **= 3     # x = x ** 3 → 1.0
\`\`\`

## Identity Operators

\`\`\`python
a = [1, 2, 3]
b = [1, 2, 3]
c = a

print(a is c)      # True (same object)
print(a is b)      # False (different objects)
print(a is not b)  # True
print(a == b)      # True (same values)
\`\`\`

## Membership Operators

\`\`\`python
fruits = ["apple", "banana", "cherry"]

print("apple" in fruits)      # True
print("mango" in fruits)      # False
print("mango" not in fruits)  # True

# Works with strings too
print("ell" in "hello")       # True
\`\`\`

## Bitwise Operators

\`\`\`python
a, b = 5, 3  # 5 = 101, 3 = 011 in binary

print(a & b)   # 1  (AND: 001)
print(a | b)   # 7  (OR: 111)
print(a ^ b)   # 6  (XOR: 110)
print(~a)      # -6 (NOT)
print(a << 1)  # 10 (Left shift)
print(a >> 1)  # 2  (Right shift)
\`\`\`

## Operator Precedence

\`\`\`python
# PEMDAS-like: Parentheses, Exponents, Multiply/Divide, Add/Subtract
result = 2 + 3 * 4     # 14 (not 20!)
result = (2 + 3) * 4   # 20 (parentheses first)
result = 2 ** 3 ** 2   # 512 (right to left for **)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>➕➖✖️➗ Python Operators Demo</h2>
<div id="demo"></div>

<script>
const a = 10, b = 3;

const arithmetic = [
  { op: "+", name: "Addition", result: a + b },
  { op: "-", name: "Subtraction", result: a - b },
  { op: "*", name: "Multiplication", result: a * b },
  { op: "/", name: "Division", result: (a / b).toFixed(2) },
  { op: "//", name: "Floor Division", result: Math.floor(a / b) },
  { op: "%", name: "Modulo", result: a % b },
  { op: "**", name: "Exponentiation", result: Math.pow(a, b) }
];

let html = "<h3>Arithmetic Operators (a=10, b=3)</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Operator</th>";
html += "<th style='padding: 10px;'>Name</th>";
html += "<th style='padding: 10px;'>a " + "op" + " b</th>";
html += "<th style='padding: 10px;'>Result</th></tr>";

arithmetic.forEach((op, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px; text-align: center;'><b>" + op.op + "</b></td>";
  html += "<td style='padding: 10px;'>" + op.name + "</td>";
  html += "<td style='padding: 10px;'><code>10 " + op.op + " 3</code></td>";
  html += "<td style='padding: 10px; font-weight: bold;'>" + op.result + "</td></tr>";
});
html += "</table>";

html += "<h3>Comparison & Logical</h3>";
html += "<div style='display: flex; gap: 20px;'>";
html += "<div style='flex: 1; background: #e3f2fd; padding: 15px; border-radius: 8px;'>";
html += "<b>Comparison:</b> ==, !=, >, <, >=, <=</div>";
html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<b>Logical:</b> and, or, not</div>";
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Data Structures - Tuples
    'tuples': {
      title: 'Python Tuples',
      content: `# Python Tuples 📦

Think of tuples like **sealed packages** - once you pack them, you can't change what's inside!

## Creating Tuples

\`\`\`python
# With parentheses
colors = ("red", "green", "blue")

# Without parentheses (tuple packing)
point = 10, 20, 30

# Single element (need comma!)
single = ("hello",)  # ✅ Tuple
not_tuple = ("hello") # ❌ Just a string!

# From list
my_tuple = tuple([1, 2, 3])
\`\`\`

## Tuples are Immutable!

\`\`\`python
colors = ("red", "green", "blue")

# ❌ Cannot modify!
colors[0] = "yellow"  # TypeError!
colors.append("yellow")  # AttributeError!

# ✅ Create new tuple instead
colors = ("yellow",) + colors[1:]
\`\`\`

## Accessing Elements

\`\`\`python
point = (10, 20, 30)

print(point[0])    # 10
print(point[-1])   # 30
print(point[1:3])  # (20, 30)
\`\`\`

## Tuple Unpacking

\`\`\`python
# Basic unpacking
point = (10, 20, 30)
x, y, z = point
print(x, y, z)  # 10 20 30

# Swap values elegantly
a, b = 1, 2
a, b = b, a  # Now a=2, b=1

# Extended unpacking
first, *rest = (1, 2, 3, 4, 5)
print(first)  # 1
print(rest)   # [2, 3, 4, 5]
\`\`\`

## Why Use Tuples?

### 1. Dictionary Keys
\`\`\`python
# Tuples can be dict keys (immutable)
locations = {
    (40.7, -74.0): "New York",
    (51.5, -0.1): "London"
}

# Lists cannot!
# {[40.7, -74.0]: "NYC"}  # TypeError!
\`\`\`

### 2. Function Returns
\`\`\`python
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers)

low, high, total = get_stats([1, 2, 3, 4, 5])
\`\`\`

### 3. Performance
\`\`\`python
# Tuples are faster than lists
# Use when data won't change
DAYS = ("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
\`\`\`

## Tuple Methods

\`\`\`python
numbers = (1, 2, 2, 3, 2)

print(numbers.count(2))   # 3 (how many 2s)
print(numbers.index(3))   # 3 (position of 3)
print(len(numbers))       # 5
print(2 in numbers)       # True
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📦 Python Tuples Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Tuple vs List</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Feature</th>";
html += "<th style='padding: 10px;'>Tuple</th>";
html += "<th style='padding: 10px;'>List</th></tr>";

const comparisons = [
  ["Syntax", "(1, 2, 3)", "[1, 2, 3]"],
  ["Mutable?", "❌ No", "✅ Yes"],
  ["Dict Key?", "✅ Yes", "❌ No"],
  ["Performance", "⚡ Faster", "🐢 Slower"],
  ["Use Case", "Fixed data", "Changing data"]
];

comparisons.forEach((row, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  row.forEach(cell => {
    html += "<td style='padding: 10px;'>" + cell + "</td>";
  });
  html += "</tr>";
});
html += "</table>";

html += "<h3>Tuple Unpacking</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "point = (10, 20, 30)\\n";
html += "x, y, z = point\\n";
html += "# x=10, y=20, z=30\\n\\n";
html += "# Swap values:\\n";
html += "a, b = b, a</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Sets
    'sets': {
      title: 'Python Sets',
      content: `# Python Sets 🎯

Think of sets like a **bag of unique items** - no duplicates allowed!

## Creating Sets

\`\`\`python
# With curly braces
fruits = {"apple", "banana", "cherry"}

# Empty set (NOT {}, that's a dict!)
empty = set()

# From list (removes duplicates!)
numbers = set([1, 2, 2, 3, 3, 3])
print(numbers)  # {1, 2, 3}

# From string
chars = set("hello")
print(chars)  # {'h', 'e', 'l', 'o'}
\`\`\`

## Sets Remove Duplicates!

\`\`\`python
# Instant deduplication
emails = ["a@b.com", "c@d.com", "a@b.com", "e@f.com", "c@d.com"]
unique = set(emails)
print(unique)  # {'a@b.com', 'c@d.com', 'e@f.com'}
print(len(unique))  # 3
\`\`\`

## Modifying Sets

\`\`\`python
fruits = {"apple", "banana"}

# Add single item
fruits.add("cherry")

# Add multiple items
fruits.update(["date", "elderberry"])

# Remove (error if not found)
fruits.remove("apple")

# Discard (no error if not found)
fruits.discard("mango")  # Safe!

# Pop (remove random item)
item = fruits.pop()

# Clear all
fruits.clear()
\`\`\`

## Set Operations (Like Math!)

\`\`\`python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

# Union (all items)
print(a | b)        # {1, 2, 3, 4, 5, 6}
print(a.union(b))   # Same

# Intersection (common items)
print(a & b)            # {3, 4}
print(a.intersection(b)) # Same

# Difference (in a but not b)
print(a - b)            # {1, 2}
print(a.difference(b))  # Same

# Symmetric Difference (in either, not both)
print(a ^ b)                      # {1, 2, 5, 6}
print(a.symmetric_difference(b))  # Same
\`\`\`

## Set Comparisons

\`\`\`python
a = {1, 2, 3}
b = {1, 2, 3, 4, 5}

print(a.issubset(b))    # True (a ⊆ b)
print(b.issuperset(a))  # True (b ⊇ a)
print(a.isdisjoint({4, 5}))  # True (no common)
\`\`\`

## Practical Example

\`\`\`python
# Find users who viewed but didn't buy
viewers = {"alice", "bob", "charlie", "david"}
buyers = {"bob", "david"}

# Who to target with discounts?
potential = viewers - buyers
print(potential)  # {'alice', 'charlie'}
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎯 Python Sets Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Set Operations</h3>";

const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

const operations = [
  { name: "Union (a | b)", symbol: "∪", result: [1,2,3,4,5,6], desc: "All items" },
  { name: "Intersection (a & b)", symbol: "∩", result: [3,4], desc: "Common items" },
  { name: "Difference (a - b)", symbol: "−", result: [1,2], desc: "In a, not b" },
  { name: "Symmetric (a ^ b)", symbol: "△", result: [1,2,5,6], desc: "Either, not both" }
];

html += "<p><b>a = {1, 2, 3, 4}</b> &nbsp; <b>b = {3, 4, 5, 6}</b></p>";

html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Operation</th>";
html += "<th style='padding: 10px;'>Math</th>";
html += "<th style='padding: 10px;'>Result</th></tr>";

operations.forEach((op, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'>" + op.name + "</td>";
  html += "<td style='padding: 10px; font-size: 20px;'>" + op.symbol + "</td>";
  html += "<td style='padding: 10px;'><b>{" + op.result.join(", ") + "}</b></td></tr>";
});
html += "</table>";

html += "<h3>Deduplication Magic ✨</h3>";
html += "<pre style='background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "emails = ['a@b.com', 'c@d.com', 'a@b.com']\\n";
html += "unique = set(emails)\\n";
html += "# Result: {'a@b.com', 'c@d.com'}</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Arrays
    'arrays': {
      title: 'Python Arrays',
      content: `# Python Arrays vs Lists 📊

Think of arrays like **specialized storage containers** - they only hold one type of item!

## Lists vs Arrays

\`\`\`python
# Lists - mixed types, flexible
my_list = [1, "hello", 3.14, True]

# Arrays - same type, more efficient
from array import array
my_array = array('i', [1, 2, 3, 4, 5])  # 'i' = integers only
\`\`\`

## When to Use Which?

| Feature | List | array | NumPy |
|---------|------|-------|-------|
| Mixed types | ✅ | ❌ | ❌ |
| Memory efficient | ❌ | ✅ | ✅ |
| Math operations | ❌ | ❌ | ✅ |
| General use | ✅ | Rare | Data science |

## Python array Module

\`\`\`python
from array import array

# Type codes:
# 'b' = signed char, 'B' = unsigned char
# 'i' = int, 'I' = unsigned int
# 'f' = float, 'd' = double

# Create array of integers
numbers = array('i', [1, 2, 3, 4, 5])

# Operations
numbers.append(6)
numbers.insert(0, 0)
numbers.pop()
numbers.remove(3)

print(numbers)  # array('i', [0, 1, 2, 4, 5])
\`\`\`

## NumPy Arrays (Recommended!)

\`\`\`python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
zeros = np.zeros(5)        # [0, 0, 0, 0, 0]
ones = np.ones(5)          # [1, 1, 1, 1, 1]
range_arr = np.arange(10)  # [0, 1, 2, ..., 9]

# Math operations (vectorized!)
print(arr * 2)      # [2, 4, 6, 8, 10]
print(arr + 10)     # [11, 12, 13, 14, 15]
print(arr ** 2)     # [1, 4, 9, 16, 25]

# Aggregations
print(arr.sum())    # 15
print(arr.mean())   # 3.0
print(arr.max())    # 5
\`\`\`

## Performance Comparison

\`\`\`python
import numpy as np
import time

# Python list
py_list = list(range(1000000))
start = time.time()
result = [x * 2 for x in py_list]
print(f"List: {time.time() - start:.4f}s")

# NumPy array
np_arr = np.array(py_list)
start = time.time()
result = np_arr * 2
print(f"NumPy: {time.time() - start:.4f}s")

# NumPy is 50-100x faster!
\`\`\`

## Key Takeaway

For most cases:
- Use **lists** for general data
- Use **NumPy arrays** for numerical work
- Rarely need the \`array\` module
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📊 Python Arrays Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Lists vs Arrays Comparison</h3>";

html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Feature</th>";
html += "<th style='padding: 10px;'>List</th>";
html += "<th style='padding: 10px;'>array</th>";
html += "<th style='padding: 10px;'>NumPy</th></tr>";

const features = [
  ["Mixed types", "✅", "❌", "❌"],
  ["Memory efficient", "❌", "✅", "✅"],
  ["Math operations", "❌", "❌", "✅"],
  ["Speed", "🐢", "🚶", "🚀"],
  ["Use case", "General", "Rare", "Data Science"]
];

features.forEach((row, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  row.forEach(cell => {
    html += "<td style='padding: 10px; text-align: center;'>" + cell + "</td>";
  });
  html += "</tr>";
});
html += "</table>";

html += "<h3>NumPy Vectorization Magic ✨</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "import numpy as np\\n\\n";
html += "arr = np.array([1, 2, 3, 4, 5])\\n";
html += "print(arr * 2)   # [2, 4, 6, 8, 10]\\n";
html += "print(arr ** 2)  # [1, 4, 9, 16, 25]\\n";
html += "print(arr.sum()) # 15</pre>";

html += "<p style='background: #fff3cd; padding: 10px; border-radius: 8px;'>";
html += "💡 <b>Tip:</b> Use NumPy for numerical work - it's 50-100x faster!</p>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Iterators
    'iterators': {
      title: 'Python Iterators',
      content: `# Python Iterators 🔄

Think of iterators like a **bookmark** - it remembers where you are and gives you the next item!

## What is an Iterator?

An iterator is an object that:
1. Has a \`__iter__()\` method (returns itself)
2. Has a \`__next__()\` method (returns next value)

\`\`\`python
# Lists are iterable, not iterators
my_list = [1, 2, 3]

# Get an iterator from the list
my_iter = iter(my_list)

# Get next values
print(next(my_iter))  # 1
print(next(my_iter))  # 2
print(next(my_iter))  # 3
print(next(my_iter))  # StopIteration error!
\`\`\`

## Iterable vs Iterator

\`\`\`python
# Iterable: Has __iter__() method
# Examples: list, tuple, dict, set, string

# Iterator: Has both __iter__() and __next__()
# Created from iterables using iter()

my_list = [1, 2, 3]    # Iterable
my_iter = iter(my_list) # Iterator
\`\`\`

## For Loop Under the Hood

\`\`\`python
# This for loop:
for item in [1, 2, 3]:
    print(item)

# Is actually doing this:
iterator = iter([1, 2, 3])
while True:
    try:
        item = next(iterator)
        print(item)
    except StopIteration:
        break
\`\`\`

## Creating Custom Iterators

\`\`\`python
class Countdown:
    def __init__(self, start):
        self.start = start
    
    def __iter__(self):
        return self
    
    def __next__(self):
        if self.start <= 0:
            raise StopIteration
        self.start -= 1
        return self.start + 1

# Usage
for num in Countdown(5):
    print(num)  # 5, 4, 3, 2, 1
\`\`\`

## Generator Functions (Easier!)

\`\`\`python
# Generators are simpler iterators
def countdown(start):
    while start > 0:
        yield start  # yield instead of return
        start -= 1

for num in countdown(5):
    print(num)  # 5, 4, 3, 2, 1

# Generator expressions
squares = (x**2 for x in range(5))
print(list(squares))  # [0, 1, 4, 9, 16]
\`\`\`

## Built-in Iterator Functions

\`\`\`python
# enumerate - add index
for i, val in enumerate(['a', 'b', 'c']):
    print(i, val)  # 0 a, 1 b, 2 c

# zip - combine iterables
names = ['Alice', 'Bob']
ages = [25, 30]
for name, age in zip(names, ages):
    print(name, age)

# map - apply function
nums = [1, 2, 3]
squares = map(lambda x: x**2, nums)
print(list(squares))  # [1, 4, 9]

# filter - keep matching items
evens = filter(lambda x: x % 2 == 0, [1,2,3,4,5])
print(list(evens))  # [2, 4]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔄 Python Iterators Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Iterator Protocol</h3>";

html += "<div style='display: flex; gap: 20px;'>";
html += "<div style='flex: 1; background: #e3f2fd; padding: 15px; border-radius: 8px;'>";
html += "<h4>Iterable</h4>";
html += "<p>Has <code>__iter__()</code> method</p>";
html += "<p>Examples: list, tuple, dict, str</p>";
html += "</div>";

html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<h4>Iterator</h4>";
html += "<p>Has <code>__iter__()</code> AND <code>__next__()</code></p>";
html += "<p>Created with <code>iter()</code></p>";
html += "</div>";
html += "</div>";

html += "<h3>How For Loop Works</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "my_list = [1, 2, 3]\\n";
html += "iterator = iter(my_list)\\n\\n";
html += "next(iterator)  # → 1\\n";
html += "next(iterator)  # → 2\\n";
html += "next(iterator)  # → 3\\n";
html += "next(iterator)  # → StopIteration!</pre>";

html += "<h3>Generator (Easy Iterator!)</h3>";
html += "<pre style='background: #fff3e0; padding: 15px; border-radius: 8px;'>";
html += "def countdown(n):\\n";
html += "    while n > 0:\\n";
html += "        yield n  # Magic word!\\n";
html += "        n -= 1\\n\\n";
html += "for num in countdown(3):\\n";
html += "    print(num)  # 3, 2, 1</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Range
    'range': {
      title: 'Python Range',
      content: `# Python Range 🔢

Think of range() like a **number generator** - it creates sequences of numbers on demand!

## Basic Range

\`\`\`python
# range(stop) - 0 to stop-1
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(start, stop) - start to stop-1
for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

# range(start, stop, step)
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8
\`\`\`

## Negative Step (Countdown!)

\`\`\`python
# Count down
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1

# Reverse range
for i in range(10, 0, -2):
    print(i)  # 10, 8, 6, 4, 2
\`\`\`

## Range is Memory Efficient!

\`\`\`python
# Range doesn't store all numbers in memory
r = range(1000000000)  # Instant! No memory used

# It generates numbers on demand
print(r[0])        # 0
print(r[999999])   # 999999
print(len(r))      # 1000000000

# Convert to list (careful - uses memory!)
small = list(range(10))  # [0, 1, 2, ..., 9]
\`\`\`

## Range Features

\`\`\`python
r = range(0, 10, 2)  # 0, 2, 4, 6, 8

# Length
print(len(r))  # 5

# Membership test
print(4 in r)   # True
print(3 in r)   # False

# Indexing
print(r[0])     # 0
print(r[-1])    # 8
print(r[2:4])   # range(4, 8, 2)

# Comparison
print(range(5) == range(0, 5))  # True
\`\`\`

## Common Patterns

\`\`\`python
# Iterate with index
items = ['a', 'b', 'c']
for i in range(len(items)):
    print(i, items[i])
# Better: use enumerate!
for i, item in enumerate(items):
    print(i, item)

# Repeat N times
for _ in range(3):
    print("Hello!")  # Prints 3 times

# Create number lists
evens = list(range(0, 20, 2))
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
\`\`\`

## Range vs List

\`\`\`python
# Range: memory efficient, immutable
r = range(1000000)
print(sys.getsizeof(r))  # ~48 bytes!

# List: uses memory, mutable
l = list(range(1000000))
print(sys.getsizeof(l))  # ~8 MB!
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔢 Python Range Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Range Patterns</h3>";

const patterns = [
  { code: "range(5)", result: [0,1,2,3,4], desc: "0 to 4" },
  { code: "range(2, 6)", result: [2,3,4,5], desc: "2 to 5" },
  { code: "range(0, 10, 2)", result: [0,2,4,6,8], desc: "Even numbers" },
  { code: "range(5, 0, -1)", result: [5,4,3,2,1], desc: "Countdown" }
];

html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Code</th>";
html += "<th style='padding: 10px;'>Output</th>";
html += "<th style='padding: 10px;'>Description</th></tr>";

patterns.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + p.code + "</code></td>";
  html += "<td style='padding: 10px;'>[" + p.result.join(", ") + "]</td>";
  html += "<td style='padding: 10px;'>" + p.desc + "</td></tr>";
});
html += "</table>";

html += "<h3>Memory Efficiency 💾</h3>";
html += "<div style='display: flex; gap: 20px;'>";
html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<h4>range(1000000)</h4>";
html += "<p>~48 bytes 🎉</p>";
html += "<p>Numbers generated on demand</p>";
html += "</div>";
html += "<div style='flex: 1; background: #ffebee; padding: 15px; border-radius: 8px;'>";
html += "<h4>list(range(1000000))</h4>";
html += "<p>~8 MB 😱</p>";
html += "<p>All numbers stored in memory</p>";
html += "</div>";
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Match (modern Python)
    'match': {
      title: 'Python Match',
      content: `# Python Match (Pattern Matching) 🎯

Think of match like a **smart switch** - it finds the right pattern and takes action!

## Basic Match (Python 3.10+)

\`\`\`python
def http_status(status):
    match status:
        case 200:
            return "OK"
        case 404:
            return "Not Found"
        case 500:
            return "Server Error"
        case _:
            return "Unknown"

print(http_status(200))  # OK
print(http_status(999))  # Unknown
\`\`\`

## Match with Patterns

\`\`\`python
def describe(value):
    match value:
        case 0:
            return "Zero"
        case int():
            return f"Integer: {value}"
        case float():
            return f"Float: {value}"
        case str():
            return f"String: {value}"
        case _:
            return "Something else"

print(describe(42))      # Integer: 42
print(describe(3.14))    # Float: 3.14
print(describe("hello")) # String: hello
\`\`\`

## Match with Tuples

\`\`\`python
def describe_point(point):
    match point:
        case (0, 0):
            return "Origin"
        case (0, y):
            return f"On Y-axis at {y}"
        case (x, 0):
            return f"On X-axis at {x}"
        case (x, y):
            return f"Point at ({x}, {y})"
        case _:
            return "Not a point"

print(describe_point((0, 0)))   # Origin
print(describe_point((5, 0)))   # On X-axis at 5
print(describe_point((3, 4)))   # Point at (3, 4)
\`\`\`

## Match with Guards

\`\`\`python
def categorize_age(age):
    match age:
        case n if n < 0:
            return "Invalid"
        case n if n < 13:
            return "Child"
        case n if n < 20:
            return "Teen"
        case n if n < 60:
            return "Adult"
        case _:
            return "Senior"

print(categorize_age(8))   # Child
print(categorize_age(25))  # Adult
\`\`\`

## Match with OR Patterns

\`\`\`python
def weekend_or_weekday(day):
    match day.lower():
        case "saturday" | "sunday":
            return "Weekend! 🎉"
        case "monday" | "tuesday" | "wednesday" | "thursday" | "friday":
            return "Weekday 😅"
        case _:
            return "Invalid day"

print(weekend_or_weekday("Saturday"))  # Weekend! 🎉
\`\`\`

## Match with Dictionaries

\`\`\`python
def process_action(action):
    match action:
        case {"type": "click", "x": x, "y": y}:
            return f"Click at ({x}, {y})"
        case {"type": "scroll", "direction": dir}:
            return f"Scroll {dir}"
        case {"type": "keypress", "key": key}:
            return f"Pressed {key}"
        case _:
            return "Unknown action"

print(process_action({"type": "click", "x": 100, "y": 200}))
# Click at (100, 200)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎯 Python Match Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Match vs If-Else</h3>";

html += "<div style='display: flex; gap: 20px;'>";

html += "<div style='flex: 1; background: #e3f2fd; padding: 15px; border-radius: 8px;'>";
html += "<h4>Old Way (if-elif)</h4>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 10px; border-radius: 4px; font-size: 12px;'>";
html += "if status == 200:\\n";
html += "    return 'OK'\\n";
html += "elif status == 404:\\n";
html += "    return 'Not Found'\\n";
html += "else:\\n";
html += "    return 'Unknown'</pre>";
html += "</div>";

html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<h4>New Way (match)</h4>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 10px; border-radius: 4px; font-size: 12px;'>";
html += "match status:\\n";
html += "    case 200:\\n";
html += "        return 'OK'\\n";
html += "    case 404:\\n";
html += "        return 'Not Found'\\n";
html += "    case _:\\n";
html += "        return 'Unknown'</pre>";
html += "</div>";

html += "</div>";

html += "<h3>Pattern Examples</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Pattern</th>";
html += "<th style='padding: 10px;'>Matches</th></tr>";

const patterns = [
  ["case 42:", "Exact value 42"],
  ["case int():", "Any integer"],
  ["case (x, y):", "Any 2-tuple"],
  ["case [x, *rest]:", "List with first + rest"],
  ["case {'name': n}:", "Dict with 'name' key"],
  ["case _ :", "Anything (wildcard)"]
];

patterns.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + p[0] + "</code></td>";
  html += "<td style='padding: 10px;'>" + p[1] + "</td></tr>";
});
html += "</table>";

html += "<p style='background: #fff3cd; padding: 10px; border-radius: 8px;'>";
html += "⚠️ <b>Note:</b> match requires Python 3.10+</p>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // While Loops
    'while': {
      title: 'Python While Loops',
      content: `# Python While Loops 🔁

Think of while loops like a **record player** - it keeps spinning until you tell it to stop!

## Basic While Loop

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1  # Don't forget this!
# Output: 0, 1, 2, 3, 4
\`\`\`

## While with Condition

\`\`\`python
# Keep asking until valid input
while True:
    answer = input("Enter 'yes' or 'no': ")
    if answer in ['yes', 'no']:
        break
    print("Invalid input, try again!")

print(f"You said: {answer}")
\`\`\`

## Break and Continue

\`\`\`python
# break - exit loop immediately
i = 0
while i < 10:
    if i == 5:
        break  # Exit at 5
    print(i)
    i += 1
# Output: 0, 1, 2, 3, 4

# continue - skip to next iteration
i = 0
while i < 5:
    i += 1
    if i == 3:
        continue  # Skip 3
    print(i)
# Output: 1, 2, 4, 5
\`\`\`

## While-Else

\`\`\`python
# else runs if loop completes normally (no break)
count = 0
while count < 3:
    print(count)
    count += 1
else:
    print("Loop completed!")
# Output: 0, 1, 2, Loop completed!

# With break - else doesn't run
count = 0
while count < 10:
    if count == 5:
        break
    count += 1
else:
    print("This won't print!")
\`\`\`

## Common Patterns

\`\`\`python
# Countdown
n = 5
while n > 0:
    print(n)
    n -= 1
print("Liftoff! 🚀")

# Process until empty
items = ["a", "b", "c"]
while items:
    item = items.pop()
    print(f"Processing: {item}")

# Read until sentinel
numbers = []
while True:
    num = input("Enter number (or 'done'): ")
    if num == 'done':
        break
    numbers.append(int(num))
\`\`\`

## ⚠️ Infinite Loop Warning!

\`\`\`python
# ❌ Infinite loop - forgot to update condition!
while True:
    print("Forever!")  # Ctrl+C to stop!

# ❌ Condition never becomes False
x = 10
while x > 0:
    print(x)
    # Forgot x -= 1!

# ✅ Always ensure loop will end
x = 10
while x > 0:
    print(x)
    x -= 1  # This makes it end!
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔁 Python While Loops Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>While Loop Execution</h3>";

// Simulate while loop
let count = 0;
let iterations = [];
while (count < 5) {
  iterations.push({ step: count + 1, value: count, condition: count + " < 5 → true" });
  count++;
}
iterations.push({ step: count + 1, value: count, condition: count + " < 5 → false (stop)" });

html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Step</th>";
html += "<th style='padding: 10px;'>count</th>";
html += "<th style='padding: 10px;'>Condition</th></tr>";

iterations.forEach((iter, i) => {
  const bg = i === iterations.length - 1 ? "#ffebee" : (i % 2 === 0 ? "#f8f9fa" : "white");
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'>" + iter.step + "</td>";
  html += "<td style='padding: 10px;'><b>" + iter.value + "</b></td>";
  html += "<td style='padding: 10px;'>" + iter.condition + "</td></tr>";
});
html += "</table>";

html += "<h3>Control Statements</h3>";
html += "<div style='display: flex; gap: 20px;'>";

html += "<div style='flex: 1; background: #ffebee; padding: 15px; border-radius: 8px;'>";
html += "<h4>break</h4>";
html += "<p>Exit loop immediately</p>";
html += "<code>if x == 5: break</code>";
html += "</div>";

html += "<div style='flex: 1; background: #fff3e0; padding: 15px; border-radius: 8px;'>";
html += "<h4>continue</h4>";
html += "<p>Skip to next iteration</p>";
html += "<code>if x == 3: continue</code>";
html += "</div>";

html += "<div style='flex: 1; background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<h4>else</h4>";
html += "<p>Runs if no break</p>";
html += "<code>while x: ... else: ...</code>";
html += "</div>";

html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Control Flow
    'if-else': {
      title: 'Python If...Else',
      content: `# Python If...Else 🚦

Think of if-else like **traffic lights** - they tell your code which way to go!

## Basic If Statement

\`\`\`python
age = 18

if age >= 18:
    print("You can vote!")
\`\`\`

## If-Else

\`\`\`python
age = 16

if age >= 18:
    print("Adult")
else:
    print("Minor")
\`\`\`

## If-Elif-Else

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Grade: {grade}")
\`\`\`

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal |
| \`!=\` | Not equal |
| \`>\` | Greater than |
| \`<\` | Less than |
| \`>=\` | Greater or equal |
| \`<=\` | Less or equal |

## Logical Operators

\`\`\`python
x = 15

# and - both must be True
if x > 10 and x < 20:
    print("x is between 10 and 20")

# or - at least one True
if x < 5 or x > 10:
    print("x is out of 5-10 range")

# not - reverse
if not x == 10:
    print("x is not 10")
\`\`\`

## Shorthand (Ternary)

\`\`\`python
age = 20
status = "adult" if age >= 18 else "minor"

# Same as:
if age >= 18:
    status = "adult"
else:
    status = "minor"
\`\`\`

## Truthiness

\`\`\`python
# Falsy values (evaluate to False)
if not 0:       print("0 is falsy")
if not "":      print("Empty string is falsy")
if not []:      print("Empty list is falsy")
if not None:    print("None is falsy")

# Everything else is truthy
if [1, 2, 3]:   print("Non-empty list is truthy")
if "hello":     print("Non-empty string is truthy")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🚦 Python If...Else Demo</h2>
<div id="demo"></div>

<script>
function getGrade(score) {
  if (score >= 90) return "A";
  else if (score >= 80) return "B";
  else if (score >= 70) return "C";
  else if (score >= 60) return "D";
  else return "F";
}

const scores = [95, 85, 75, 65, 55];
let html = "<h3>Grade Calculator</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Score</th>";
html += "<th style='padding: 10px;'>Grade</th></tr>";

scores.forEach((score, i) => {
  const grade = getGrade(score);
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'>" + score + "</td>";
  html += "<td style='padding: 10px; font-size: 24px;'>" + grade + "</td></tr>";
});
html += "</table>";

html += "<h3>Logical Operators</h3>";
html += "<div style='background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<code>x > 10 <b>and</b> x < 20</code> - Both must be True<br>";
html += "<code>x < 5 <b>or</b> x > 10</code> - At least one True<br>";
html += "<code><b>not</b> x == 10</code> - Reverses the condition</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'for': {
      title: 'Python For Loops',
      content: `# Python For Loops 🔄

Think of for loops like going through a **playlist** - one song at a time!

## Basic For Loop

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
# apple
# banana
# cherry
\`\`\`

## Range Function

\`\`\`python
# 0 to 4
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# 2 to 5
for i in range(2, 6):
    print(i)  # 2, 3, 4, 5

# Step by 2
for i in range(0, 10, 2):
    print(i)  # 0, 2, 4, 6, 8

# Countdown
for i in range(5, 0, -1):
    print(i)  # 5, 4, 3, 2, 1
\`\`\`

## Enumerate (Get Index + Value)

\`\`\`python
fruits = ["apple", "banana", "cherry"]

for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")
# 0: apple
# 1: banana
# 2: cherry

# Start from 1
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}. {fruit}")
\`\`\`

## Loop Through Dictionary

\`\`\`python
person = {"name": "Alice", "age": 25}

# Keys
for key in person:
    print(key)

# Values
for value in person.values():
    print(value)

# Both
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Loop Control

\`\`\`python
# break - exit loop
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue - skip iteration
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4

# else - runs if no break
for i in range(3):
    print(i)
else:
    print("Done!")  # Runs!
\`\`\`

## List Comprehension

\`\`\`python
# Traditional
squares = []
for x in range(5):
    squares.append(x ** 2)

# Pythonic!
squares = [x ** 2 for x in range(5)]
# [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🔄 Python For Loops Demo</h2>
<div id="demo"></div>

<script>
let html = "<h3>Loop Examples</h3>";

// Basic loop
html += "<div style='background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>Basic For Loop:</b><br>";
const fruits = ["apple", "banana", "cherry"];
fruits.forEach(f => {
  html += "→ " + f + "<br>";
});
html += "</div>";

// Range
html += "<div style='background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>range(5):</b> ";
for (let i = 0; i < 5; i++) {
  html += i + " ";
}
html += "</div>";

// Enumerate
html += "<div style='background: #e8f5e9; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>enumerate(fruits):</b><br>";
fruits.forEach((f, i) => {
  html += i + ": " + f + "<br>";
});
html += "</div>";

// List comprehension
html += "<div style='background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>List Comprehension:</b><br>";
html += "<code>[x ** 2 for x in range(5)]</code><br>";
html += "Result: [";
for (let i = 0; i < 5; i++) {
  html += (i * i);
  if (i < 4) html += ", ";
}
html += "]</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Functions
    'functions': {
      title: 'Python Functions',
      content: `# Python Functions 🎯

Think of functions like **recipes** - write once, use many times!

## Basic Function

\`\`\`python
def greet(name):
    """Return a greeting message."""
    return f"Hello, {name}!"

# Call the function
message = greet("Alice")
print(message)  # Hello, Alice!
\`\`\`

## Parameters and Arguments

\`\`\`python
# Default parameter
def greet(name="World"):
    return f"Hello, {name}!"

print(greet())        # Hello, World!
print(greet("Alice")) # Hello, Alice!

# Multiple parameters
def add(a, b):
    return a + b

# Keyword arguments
def info(name, age, city):
    return f"{name}, {age}, from {city}"

print(info(name="Alice", age=25, city="NYC"))
print(info(age=25, name="Alice", city="NYC"))  # Order doesn't matter!
\`\`\`

## *args and **kwargs

\`\`\`python
# Variable positional arguments
def add_all(*args):
    return sum(args)

print(add_all(1, 2, 3, 4))  # 10

# Variable keyword arguments
def show_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

show_info(name="Alice", age=25, city="NYC")

# Combined
def func(a, b, *args, **kwargs):
    print(a, b, args, kwargs)
\`\`\`

## Return Values

\`\`\`python
# Single return
def square(x):
    return x ** 2

# Multiple returns
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([1, 5, 3, 9, 2])
print(low, high)  # 1 9

# No return = None
def say_hi():
    print("Hi!")

result = say_hi()  # Prints "Hi!"
print(result)      # None
\`\`\`

## Lambda Functions

\`\`\`python
# Anonymous functions
square = lambda x: x ** 2
print(square(5))  # 25

# Useful with map, filter
numbers = [1, 2, 3, 4]
squared = list(map(lambda x: x**2, numbers))
evens = list(filter(lambda x: x%2==0, numbers))
\`\`\`

## Scope

\`\`\`python
x = "global"

def func():
    x = "local"  # New local variable
    print(x)     # local

func()
print(x)  # global (unchanged)

# To modify global:
def modify_global():
    global x
    x = "modified"
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🎯 Python Functions Demo</h2>
<div id="demo"></div>

<script>
// Simulating Python functions

function greet(name = "World") {
  return "Hello, " + name + "!";
}

function addAll(...args) {
  return args.reduce((a, b) => a + b, 0);
}

function minMax(numbers) {
  return [Math.min(...numbers), Math.max(...numbers)];
}

let html = "<h3>Function Examples</h3>";

// Greet function
html += "<div style='background: #e8f5e9; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<code>greet()</code> → " + greet() + "<br>";
html += "<code>greet('Alice')</code> → " + greet('Alice');
html += "</div>";

// addAll
html += "<div style='background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<code>add_all(1, 2, 3, 4)</code> → " + addAll(1, 2, 3, 4);
html += "</div>";

// minMax
const nums = [1, 5, 3, 9, 2];
const [low, high] = minMax(nums);
html += "<div style='background: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<code>min_max([1, 5, 3, 9, 2])</code> → (" + low + ", " + high + ")";
html += "</div>";

// Lambda
html += "<div style='background: #fce4ec; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>Lambda:</b> <code>lambda x: x ** 2</code><br>";
html += "square(5) → " + (5 ** 2);
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // OOP
    'classes': {
      title: 'Python Classes & Objects',
      content: `# Python Classes & Objects 🏗️

Think of a class like a **blueprint** for a house - you define it once, then build many houses from it!

## Basic Class

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def info(self):
        return f"{self.name} is {self.age} years old"

# Create objects (instances)
buddy = Dog("Buddy", 3)
max = Dog("Max", 5)

print(buddy.bark())  # Buddy says Woof!
print(max.info())    # Max is 5 years old
\`\`\`

## The __init__ Method

\`\`\`python
class Person:
    def __init__(self, name, age=0):
        # self = the instance being created
        self.name = name      # Instance attribute
        self.age = age
        self.id = id(self)    # Can use other functions

alice = Person("Alice", 25)
bob = Person("Bob")  # age defaults to 0
\`\`\`

## Class vs Instance Attributes

\`\`\`python
class Counter:
    count = 0  # Class attribute (shared)
    
    def __init__(self, name):
        self.name = name  # Instance attribute
        Counter.count += 1

c1 = Counter("first")
c2 = Counter("second")
print(Counter.count)  # 2
\`\`\`

## Methods

\`\`\`python
class MyClass:
    class_var = "shared"
    
    def __init__(self, value):
        self.value = value
    
    # Instance method
    def instance_method(self):
        return f"Instance: {self.value}"
    
    # Class method
    @classmethod
    def class_method(cls):
        return f"Class var: {cls.class_var}"
    
    # Static method
    @staticmethod
    def static_method():
        return "I'm static!"
\`\`\`

## Special Methods (Dunder)

\`\`\`python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages
    
    def __str__(self):
        return f"{self.title}"
    
    def __repr__(self):
        return f"Book('{self.title}', {self.pages})"
    
    def __len__(self):
        return self.pages
    
    def __eq__(self, other):
        return self.title == other.title

book = Book("Python 101", 300)
print(book)       # Python 101 (__str__)
print(repr(book)) # Book('Python 101', 300)
print(len(book))  # 300
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🏗️ Python Classes Demo</h2>
<div id="demo"></div>

<script>
// Simulating Python class

class Dog {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  bark() {
    return this.name + " says Woof!";
  }
  
  info() {
    return this.name + " is " + this.age + " years old";
  }
}

const buddy = new Dog("Buddy", 3);
const max = new Dog("Max", 5);

let html = "<h3>Class: Dog</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "class Dog:\\n";
html += "    def __init__(self, name, age):\\n";
html += "        self.name = name\\n";
html += "        self.age = age\\n";
html += "    \\n";
html += "    def bark(self):\\n";
html += "        return f'{self.name} says Woof!'</pre>";

html += "<h3>Objects Created</h3>";
html += "<div style='display: flex; gap: 20px;'>";

[buddy, max].forEach(dog => {
  html += "<div style='background: #e8f5e9; padding: 20px; border-radius: 8px; flex: 1;'>";
  html += "<h4>🐕 " + dog.name + "</h4>";
  html += "<p>" + dog.info() + "</p>";
  html += "<p><b>" + dog.bark() + "</b></p>";
  html += "</div>";
});

html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'init': {
      title: 'Python __init__',
      content: `# Python __init__ 🏗️

Think of __init__ as the **birth certificate** of an object - it sets up everything when an object is born!

## What is __init__?

\`\`\`python
class Person:
    def __init__(self, name, age):
        # This runs when you create an object
        self.name = name  # Store name
        self.age = age    # Store age
        print(f"New person created: {name}")

# Creating objects triggers __init__
alice = Person("Alice", 25)  # Prints: New person created: Alice
bob = Person("Bob", 30)      # Prints: New person created: Bob
\`\`\`

## Default Values

\`\`\`python
class Dog:
    def __init__(self, name, breed="Unknown"):
        self.name = name
        self.breed = breed
        self.tricks = []  # Empty list for each dog

dog1 = Dog("Buddy")           # breed = "Unknown"
dog2 = Dog("Max", "Labrador") # breed = "Labrador"
\`\`\`

## Setting Up Object State

\`\`\`python
class BankAccount:
    def __init__(self, owner, initial_balance=0):
        self.owner = owner
        self.balance = initial_balance
        self.transactions = []
        self.account_number = self._generate_number()
        self.created_at = datetime.now()
    
    def _generate_number(self):
        return f"ACC-{random.randint(10000, 99999)}"

account = BankAccount("Alice", 1000)
print(account.account_number)  # ACC-12345
\`\`\`

## Validation in __init__

\`\`\`python
class Age:
    def __init__(self, value):
        if value < 0:
            raise ValueError("Age cannot be negative")
        if value > 150:
            raise ValueError("Age seems unrealistic")
        self.value = value

age = Age(25)   # Works
age = Age(-5)   # ValueError!
\`\`\`

## Key Points

- __init__ is called automatically when creating objects
- First parameter is always \`self\`
- Set up all instance attributes here
- Can have default parameter values
- Can validate input
- Returns nothing (implicitly None)
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🏗️ Python __init__ Demo</h2>
<div id="demo"></div>
<script>
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.createdAt = new Date();
  }
  greet() {
    return "Hello, I'm " + this.name + "!";
  }
}

const alice = new Person("Alice", 25);
const bob = new Person("Bob", 30);

let html = "<h3>Objects Created</h3>";
[alice, bob].forEach(p => {
  html += "<div style='background:#e8f5e9;padding:15px;margin:10px 0;border-radius:8px;'>";
  html += "<b>" + p.name + "</b> (age " + p.age + ")<br>";
  html += p.greet();
  html += "</div>";
});

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'self': {
      title: 'Python self',
      content: `# Python self 🪞

Think of \`self\` as a **mirror** - it lets the object see and work with itself!

## What is self?

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # self = this object
    
    def bark(self):
        # self lets us access our own name
        return f"{self.name} says Woof!"

buddy = Dog("Buddy")
print(buddy.bark())  # Buddy says Woof!
\`\`\`

## Why Do We Need self?

\`\`\`python
class Counter:
    def __init__(self):
        self.count = 0
    
    def increment(self):
        self.count += 1  # Access OUR count
        return self.count

# Two separate counters
c1 = Counter()
c2 = Counter()

c1.increment()  # c1.count = 1
c1.increment()  # c1.count = 2
c2.increment()  # c2.count = 1 (separate!)
\`\`\`

## self is Automatic

\`\`\`python
class Person:
    def greet(self, other_name):
        return f"Hi {other_name}, I'm {self.name}"

alice = Person()
alice.name = "Alice"

# Python passes 'alice' as 'self' automatically
alice.greet("Bob")  # Hi Bob, I'm Alice
# Same as: Person.greet(alice, "Bob")
\`\`\`

## Method Chaining with self

\`\`\`python
class Builder:
    def __init__(self):
        self.parts = []
    
    def add(self, part):
        self.parts.append(part)
        return self  # Return self for chaining!
    
    def build(self):
        return " ".join(self.parts)

result = Builder().add("Hello").add("World").build()
print(result)  # Hello World
\`\`\`

## Key Points

- \`self\` = the current instance
- Always first parameter in instance methods
- Python passes it automatically
- Can be named differently (but don't!)
- Not a keyword, just a convention
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🪞 Python self Demo</h2>
<div id="demo"></div>
<script>
class Counter {
  constructor() { this.count = 0; }
  increment() { this.count++; return this; }
  decrement() { this.count--; return this; }
  getCount() { return this.count; }
}

const c1 = new Counter();
const c2 = new Counter();

c1.increment().increment().increment();
c2.increment();

let html = "<h3>Two Separate Counters</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;flex:1;text-align:center;'>";
html += "<h4>Counter 1</h4><p style='font-size:48px;'>" + c1.getCount() + "</p></div>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;flex:1;text-align:center;'>";
html += "<h4>Counter 2</h4><p style='font-size:48px;'>" + c2.getCount() + "</p></div>";
html += "</div>";
html += "<p style='margin-top:20px;'>Each counter tracks its own count using <code>self</code>!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'properties': {
      title: 'Python Properties',
      content: `# Python Properties 🏠

Think of properties as **smart mailboxes** - they can check what goes in and out!

## Basic Property

\`\`\`python
class Circle:
    def __init__(self, radius):
        self._radius = radius  # "private" with _
    
    @property
    def radius(self):
        """Get the radius"""
        return self._radius
    
    @radius.setter
    def radius(self, value):
        """Set the radius with validation"""
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

circle = Circle(5)
print(circle.radius)  # 5 (uses getter)
circle.radius = 10    # Uses setter
circle.radius = -1    # ValueError!
\`\`\`

## Computed Properties

\`\`\`python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    @property
    def area(self):
        """Computed from width and height"""
        return self.width * self.height
    
    @property
    def perimeter(self):
        return 2 * (self.width + self.height)

rect = Rectangle(4, 3)
print(rect.area)       # 12
print(rect.perimeter)  # 14
\`\`\`

## Read-Only Properties

\`\`\`python
class Person:
    def __init__(self, first, last):
        self.first = first
        self.last = last
    
    @property
    def full_name(self):
        return f"{self.first} {self.last}"
    
    # No setter = read-only!

person = Person("Alice", "Smith")
print(person.full_name)    # Alice Smith
person.full_name = "Bob"   # AttributeError!
\`\`\`

## Delete Property

\`\`\`python
class Data:
    def __init__(self, value):
        self._value = value
    
    @property
    def value(self):
        return self._value
    
    @value.deleter
    def value(self):
        print("Deleting value...")
        del self._value

d = Data(42)
del d.value  # Prints: Deleting value...
\`\`\`

## Why Use Properties?

1. **Validation** - Check values before setting
2. **Computed values** - Calculate on the fly
3. **Encapsulation** - Control access
4. **Compatibility** - Change implementation without changing interface
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🏠 Python Properties Demo</h2>
<div id="demo"></div>
<script>
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get width() { return this._width; }
  set width(v) { if (v > 0) this._width = v; }
  get height() { return this._height; }
  set height(v) { if (v > 0) this._height = v; }
  get area() { return this._width * this._height; }
  get perimeter() { return 2 * (this._width + this._height); }
}

const rect = new Rectangle(4, 3);

let html = "<h3>Rectangle Properties</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<p><b>Width:</b> " + rect.width + "</p>";
html += "<p><b>Height:</b> " + rect.height + "</p>";
html += "<p><b>Area:</b> " + rect.area + " (computed)</p>";
html += "<p><b>Perimeter:</b> " + rect.perimeter + " (computed)</p>";
html += "</div>";

rect.width = 10;
html += "<h3>After Setting width = 10</h3>";
html += "<p><b>Area:</b> " + rect.area + " (auto-updates!)</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'inheritance': {
      title: 'Python Inheritance',
      content: `# Python Inheritance 👨‍👩‍👧

Think of inheritance like **family traits** - children inherit features from parents but can also have their own!

## Basic Inheritance

\`\`\`python
# Parent class
class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "Some sound"

# Child class
class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())  # Buddy says Woof!
print(cat.speak())  # Whiskers says Meow!
\`\`\`

## The super() Function

\`\`\`python
class Animal:
    def __init__(self, name, age):
        self.name = name
        self.age = age

class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age)  # Call parent
        self.breed = breed  # Add new attribute

dog = Dog("Buddy", 3, "Golden Retriever")
print(dog.name, dog.age, dog.breed)
\`\`\`

## Multiple Inheritance

\`\`\`python
class Flyable:
    def fly(self):
        return "Flying!"

class Swimmable:
    def swim(self):
        return "Swimming!"

class Duck(Flyable, Swimmable):
    def quack(self):
        return "Quack!"

duck = Duck()
print(duck.fly())   # Flying!
print(duck.swim())  # Swimming!
print(duck.quack()) # Quack!
\`\`\`

## Method Resolution Order (MRO)

\`\`\`python
class A:
    def method(self):
        return "A"

class B(A):
    def method(self):
        return "B"

class C(A):
    def method(self):
        return "C"

class D(B, C):
    pass

d = D()
print(d.method())  # "B"
print(D.__mro__)   # (D, B, C, A, object)
\`\`\`

## isinstance and issubclass

\`\`\`python
dog = Dog("Buddy", 3, "Lab")

print(isinstance(dog, Dog))     # True
print(isinstance(dog, Animal))  # True
print(issubclass(Dog, Animal))  # True
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>👨‍👩‍👧 Python Inheritance Demo</h2>
<div id="demo"></div>

<script>
// Simulating inheritance

class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() { return "Some sound"; }
}

class Dog extends Animal {
  speak() { return this.name + " says Woof!"; }
}

class Cat extends Animal {
  speak() { return this.name + " says Meow!"; }
}

const dog = new Dog("Buddy");
const cat = new Cat("Whiskers");

let html = "<h3>Inheritance Hierarchy</h3>";
html += "<div style='text-align: center;'>";
html += "<div style='display: inline-block; background: #3776AB; color: white; padding: 15px 30px; border-radius: 8px;'>Animal</div>";
html += "<br><span style='font-size: 24px;'>↙️  ↘️</span><br>";
html += "<div style='display: inline-flex; gap: 20px;'>";
html += "<div style='background: #f8d7da; padding: 15px 30px; border-radius: 8px;'>Dog 🐕</div>";
html += "<div style='background: #d4edda; padding: 15px 30px; border-radius: 8px;'>Cat 🐱</div>";
html += "</div></div>";

html += "<h3>Method Override</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Object</th>";
html += "<th style='padding: 10px;'>.speak() Output</th></tr>";

html += "<tr><td style='padding: 10px;'>dog = Dog('Buddy')</td>";
html += "<td style='padding: 10px;'><b>" + dog.speak() + "</b></td></tr>";

html += "<tr style='background: #f8f9fa;'><td style='padding: 10px;'>cat = Cat('Whiskers')</td>";
html += "<td style='padding: 10px;'><b>" + cat.speak() + "</b></td></tr>";

html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'polymorphism': {
      title: 'Python Polymorphism',
      content: `# Python Polymorphism 🎭

Think of polymorphism as **shape-shifting** - same name, different behaviors!

## What is Polymorphism?

"Poly" = many, "morph" = form. Same method name, different behaviors.

\`\`\`python
class Dog:
    def speak(self):
        return "Woof!"

class Cat:
    def speak(self):
        return "Meow!"

class Duck:
    def speak(self):
        return "Quack!"

# Same method, different behavior
animals = [Dog(), Cat(), Duck()]
for animal in animals:
    print(animal.speak())
# Woof! Meow! Quack!
\`\`\`

## Duck Typing

"If it walks like a duck and quacks like a duck..."

\`\`\`python
class Car:
    def move(self):
        return "Driving on road"

class Boat:
    def move(self):
        return "Sailing on water"

class Plane:
    def move(self):
        return "Flying in sky"

def travel(vehicle):
    # Works with ANY object that has move()
    print(vehicle.move())

travel(Car())   # Driving on road
travel(Boat())  # Sailing on water
travel(Plane()) # Flying in sky
\`\`\`

## Function Polymorphism

\`\`\`python
# len() works on many types
print(len("hello"))      # 5 (string)
print(len([1, 2, 3]))    # 3 (list)
print(len({"a": 1}))     # 1 (dict)

# + operator
print(2 + 3)             # 5 (numbers)
print("Hello " + "World") # Hello World (strings)
print([1, 2] + [3, 4])   # [1, 2, 3, 4] (lists)
\`\`\`

## Method Overriding

\`\`\`python
class Shape:
    def area(self):
        return 0

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):  # Override parent
        return self.width * self.height

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius
    
    def area(self):  # Override parent
        return 3.14159 * self.radius ** 2

shapes = [Rectangle(4, 5), Circle(3)]
for shape in shapes:
    print(shape.area())  # 20, 28.27...
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎭 Python Polymorphism Demo</h2>
<div id="demo"></div>
<script>
class Shape {
  area() { return 0; }
  name() { return "Shape"; }
}
class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
  name() { return "Rectangle"; }
}
class Circle extends Shape {
  constructor(r) { super(); this.r = r; }
  area() { return Math.PI * this.r ** 2; }
  name() { return "Circle"; }
}

const shapes = [new Rectangle(4, 5), new Circle(3)];

let html = "<h3>Same Method, Different Results</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Shape</th><th>.area()</th></tr>";

shapes.forEach((s, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + s.name() + "</td>";
  html += "<td style='padding:10px;'><b>" + s.area().toFixed(2) + "</b></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'encapsulation': {
      title: 'Python Encapsulation',
      content: `# Python Encapsulation 🔒

Think of encapsulation as a **safe** - protecting valuable data from unauthorized access!

## Naming Conventions

\`\`\`python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner        # Public
        self._balance = balance   # Protected (convention)
        self.__pin = "1234"       # Private (name mangling)
\`\`\`

## Public Members

\`\`\`python
class Person:
    def __init__(self, name):
        self.name = name  # Anyone can access

person = Person("Alice")
print(person.name)  # Alice
person.name = "Bob" # Can modify freely
\`\`\`

## Protected Members (_single underscore)

\`\`\`python
class Account:
    def __init__(self, balance):
        self._balance = balance  # "Please don't touch"
    
    def deposit(self, amount):
        self._balance += amount
    
    def get_balance(self):
        return self._balance

acc = Account(1000)
print(acc._balance)  # Works, but discouraged
\`\`\`

## Private Members (__double underscore)

\`\`\`python
class BankAccount:
    def __init__(self):
        self.__balance = 0  # Truly private
        self.__pin = "1234"
    
    def deposit(self, amount, pin):
        if pin == self.__pin:
            self.__balance += amount
        else:
            raise ValueError("Invalid PIN")
    
    def get_balance(self, pin):
        if pin == self.__pin:
            return self.__balance
        raise ValueError("Invalid PIN")

acc = BankAccount()
# acc.__balance  # AttributeError!
# acc.__pin      # AttributeError!

# Still accessible via name mangling (but don't!)
# acc._BankAccount__balance
\`\`\`

## Getters and Setters

\`\`\`python
class Temperature:
    def __init__(self, celsius):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero!")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return self._celsius * 9/5 + 32

temp = Temperature(25)
print(temp.celsius)     # 25
print(temp.fahrenheit)  # 77
temp.celsius = -300     # ValueError!
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔒 Python Encapsulation Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Naming Convention Levels</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Prefix</th><th>Access</th><th>Meaning</th></tr>";

const levels = [
  { prefix: "name", access: "Public", meaning: "Anyone can use" },
  { prefix: "_name", access: "Protected", meaning: "Internal use (convention)" },
  { prefix: "__name", access: "Private", meaning: "Name mangled, hard to access" }
];

levels.forEach((l, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + l.prefix + "</code></td>";
  html += "<td style='padding:10px;'>" + l.access + "</td>";
  html += "<td style='padding:10px;'>" + l.meaning + "</td></tr>";
});
html += "</table>";

html += "<h3>Best Practice: Use Properties</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "@property\\n";
html += "def balance(self):\\n";
html += "    return self._balance\\n\\n";
html += "@balance.setter\\n";
html += "def balance(self, value):\\n";
html += "    if value >= 0:\\n";
html += "        self._balance = value</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'decorators': {
      title: 'Python Decorators',
      content: `# Python Decorators 🎀

Think of decorators as **gift wrapping** - they add features to functions without changing them!

## Basic Decorator

\`\`\`python
def my_decorator(func):
    def wrapper():
        print("Before the function")
        func()
        print("After the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()
# Before the function
# Hello!
# After the function
\`\`\`

## Real-World Example: Timer

\`\`\`python
import time

def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end-start:.2f}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)

slow_function()  # slow_function took 1.00s
\`\`\`

## Decorator with Arguments

\`\`\`python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Hello, Alice!
# Hello, Alice!
# Hello, Alice!
\`\`\`

## Built-in Decorators

\`\`\`python
class MyClass:
    class_var = "shared"
    
    def __init__(self, value):
        self.value = value
    
    @property
    def doubled(self):
        return self.value * 2
    
    @staticmethod
    def utility():
        return "I don't need self"
    
    @classmethod
    def create_default(cls):
        return cls(0)
\`\`\`

## Stacking Decorators

\`\`\`python
@decorator1
@decorator2
@decorator3
def my_function():
    pass

# Same as:
my_function = decorator1(decorator2(decorator3(my_function)))
\`\`\`

## functools.wraps

\`\`\`python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # Preserves function metadata
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎀 Python Decorators Demo</h2>
<div id="demo"></div>
<script>
// Decorator simulation
function timer(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(fn.name + " took " + (end - start).toFixed(2) + "ms");
    return result;
  };
}

function slowSum(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
}

const timedSum = timer(slowSum);

let html = "<h3>Common Decorators</h3>";
const decorators = [
  { name: "@property", use: "Create getter/setter" },
  { name: "@staticmethod", use: "Method without self" },
  { name: "@classmethod", use: "Method with cls" },
  { name: "@functools.lru_cache", use: "Cache results" },
  { name: "@dataclass", use: "Auto __init__, __repr__" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Decorator</th><th>Purpose</th></tr>";

decorators.forEach((d, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + d.name + "</code></td>";
  html += "<td style='padding:10px;'>" + d.use + "</td></tr>";
});
html += "</table>";

html += "<h3>Timer Decorator Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "@timer\\n";
html += "def slow_function():\\n";
html += "    time.sleep(1)\\n\\n";
html += "slow_function()\\n";
html += "# Output: slow_function took 1.00s</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // File Handling
    'file-read': {
      title: 'Python Read Files',
      content: `# Python Read Files 📖

Think of reading files like **opening a book** - you can read it page by page!

## Open and Read

\`\`\`python
# Basic read
f = open("myfile.txt", "r")
content = f.read()
print(content)
f.close()

# Better: with statement (auto-closes!)
with open("myfile.txt", "r") as f:
    content = f.read()
    print(content)
# File automatically closed here
\`\`\`

## Reading Methods

\`\`\`python
with open("myfile.txt", "r") as f:
    # Read entire file
    content = f.read()
    
    # Read one line
    line = f.readline()
    
    # Read all lines as list
    lines = f.readlines()
    
    # Read specific characters
    chunk = f.read(100)  # First 100 chars
\`\`\`

## Reading Line by Line

\`\`\`python
# Memory efficient for large files
with open("large_file.txt", "r") as f:
    for line in f:
        print(line.strip())  # Remove newline
\`\`\`

## Reading Different Encodings

\`\`\`python
# UTF-8 (default on most systems)
with open("file.txt", "r", encoding="utf-8") as f:
    content = f.read()

# Other encodings
with open("file.txt", "r", encoding="latin-1") as f:
    content = f.read()
\`\`\`

## File Modes

| Mode | Description |
|------|-------------|
| "r" | Read (default) |
| "w" | Write (overwrites) |
| "a" | Append |
| "x" | Create (fails if exists) |
| "b" | Binary mode |
| "+" | Read and write |

## Check if File Exists

\`\`\`python
import os

if os.path.exists("myfile.txt"):
    with open("myfile.txt", "r") as f:
        print(f.read())
else:
    print("File not found!")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📖 Python File Reading Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Reading Methods</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Method</th><th>Returns</th><th>Use Case</th></tr>";

const methods = [
  { method: "read()", returns: "Entire file as string", use: "Small files" },
  { method: "read(n)", returns: "First n characters", use: "Streaming" },
  { method: "readline()", returns: "One line", use: "Line by line" },
  { method: "readlines()", returns: "List of all lines", use: "Process all lines" },
  { method: "for line in f:", returns: "Iterator", use: "Large files" }
];

methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + m.method + "</code></td>";
  html += "<td style='padding:10px;'>" + m.returns + "</td>";
  html += "<td style='padding:10px;'>" + m.use + "</td></tr>";
});
html += "</table>";

html += "<h3>Best Practice</h3>";
html += "<pre style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "# Always use 'with' statement!\\n";
html += "with open('file.txt', 'r') as f:\\n";
html += "    content = f.read()\\n";
html += "# File auto-closes here</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'file-write': {
      title: 'Python Write Files',
      content: `# Python Write Files ✍️

Think of writing files like **writing in a notebook** - you can add or replace content!

## Write Mode (Overwrites!)

\`\`\`python
# This REPLACES the entire file!
with open("myfile.txt", "w") as f:
    f.write("Hello, World!")
\`\`\`

## Append Mode (Adds)

\`\`\`python
# This ADDS to the end
with open("myfile.txt", "a") as f:
    f.write("\\nNew line added!")
\`\`\`

## Write Multiple Lines

\`\`\`python
lines = ["Line 1", "Line 2", "Line 3"]

with open("myfile.txt", "w") as f:
    for line in lines:
        f.write(line + "\\n")

# Or use writelines
with open("myfile.txt", "w") as f:
    f.writelines(line + "\\n" for line in lines)
\`\`\`

## Write Binary

\`\`\`python
# Writing bytes
data = b"Binary data here"
with open("binary.dat", "wb") as f:
    f.write(data)

# Copy an image
with open("source.jpg", "rb") as src:
    with open("copy.jpg", "wb") as dst:
        dst.write(src.read())
\`\`\`

## Write JSON

\`\`\`python
import json

data = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "coding"]
}

with open("data.json", "w") as f:
    json.dump(data, f, indent=2)
\`\`\`

## Write CSV

\`\`\`python
import csv

data = [
    ["Name", "Age", "City"],
    ["Alice", 25, "NYC"],
    ["Bob", 30, "LA"]
]

with open("data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(data)
\`\`\`

## Safety: Create If Not Exists

\`\`\`python
import os

if not os.path.exists("newfile.txt"):
    with open("newfile.txt", "x") as f:
        f.write("Created!")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>✍️ Python File Writing Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Write Modes Comparison</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#ffebee;padding:20px;border-radius:8px;'>";
html += "<h4>\"w\" Mode ⚠️</h4>";
html += "<p><b>OVERWRITES</b> entire file</p>";
html += "<code>open('f.txt', 'w')</code>";
html += "</div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<h4>\"a\" Mode ✅</h4>";
html += "<p><b>APPENDS</b> to end</p>";
html += "<code>open('f.txt', 'a')</code>";
html += "</div>";

html += "<div style='flex:1;background:#e3f2fd;padding:20px;border-radius:8px;'>";
html += "<h4>\"x\" Mode 🔒</h4>";
html += "<p><b>CREATE</b> new only</p>";
html += "<code>open('f.txt', 'x')</code>";
html += "</div>";

html += "</div>";

html += "<h3>Common Patterns</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "# Write text\\n";
html += "with open('file.txt', 'w') as f:\\n";
html += "    f.write('Hello!')\\n\\n";
html += "# Write JSON\\n";
html += "import json\\n";
html += "with open('data.json', 'w') as f:\\n";
html += "    json.dump(data, f, indent=2)</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'file-create': {
      title: 'Python Create/Delete Files',
      content: `# Python Create & Delete Files 📁

Think of this as **file management** - organizing your digital filing cabinet!

## Create File

\`\`\`python
# Method 1: write mode creates if not exists
with open("newfile.txt", "w") as f:
    f.write("New content")

# Method 2: exclusive creation (fails if exists)
try:
    with open("newfile.txt", "x") as f:
        f.write("New content")
except FileExistsError:
    print("File already exists!")
\`\`\`

## Create Empty File

\`\`\`python
from pathlib import Path

# Touch - create empty file
Path("empty.txt").touch()
\`\`\`

## Delete File

\`\`\`python
import os

# Check before delete
if os.path.exists("myfile.txt"):
    os.remove("myfile.txt")
    print("File deleted!")
else:
    print("File not found!")

# Or use pathlib
from pathlib import Path
Path("myfile.txt").unlink(missing_ok=True)
\`\`\`

## Create Directory

\`\`\`python
import os

# Create single directory
os.mkdir("new_folder")

# Create nested directories
os.makedirs("path/to/new/folder", exist_ok=True)
\`\`\`

## Delete Directory

\`\`\`python
import os
import shutil

# Delete empty directory
os.rmdir("empty_folder")

# Delete directory with contents (be careful!)
shutil.rmtree("folder_with_stuff")
\`\`\`

## Rename/Move

\`\`\`python
import os

# Rename file
os.rename("old_name.txt", "new_name.txt")

# Move file
shutil.move("file.txt", "new_folder/file.txt")
\`\`\`

## Copy File

\`\`\`python
import shutil

# Copy file
shutil.copy("source.txt", "destination.txt")

# Copy with metadata
shutil.copy2("source.txt", "destination.txt")

# Copy entire directory
shutil.copytree("source_folder", "dest_folder")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📁 Python File Operations Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Common File Operations</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Operation</th><th>Code</th></tr>";

const ops = [
  { op: "Create file", code: "open('f.txt', 'w').close()" },
  { op: "Delete file", code: "os.remove('f.txt')" },
  { op: "Rename", code: "os.rename('old.txt', 'new.txt')" },
  { op: "Copy", code: "shutil.copy('a.txt', 'b.txt')" },
  { op: "Create folder", code: "os.makedirs('path', exist_ok=True)" },
  { op: "Delete folder", code: "shutil.rmtree('folder')" },
  { op: "Move", code: "shutil.move('a.txt', 'folder/')" }
];

ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + o.op + "</td>";
  html += "<td style='padding:10px;'><code>" + o.code + "</code></td></tr>";
});
html += "</table>";

html += "<p style='background:#fff3e0;padding:15px;border-radius:8px;margin-top:20px;'>";
html += "⚠️ <b>Warning:</b> <code>shutil.rmtree()</code> deletes everything permanently!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'context-managers': {
      title: 'Python Context Managers',
      content: `# Python Context Managers 🚪

Think of context managers as **automatic doors** - they open, you walk through, they close behind you!

## The 'with' Statement

\`\`\`python
# Without context manager (risky!)
f = open("file.txt", "r")
content = f.read()
f.close()  # What if error before close?

# With context manager (safe!)
with open("file.txt", "r") as f:
    content = f.read()
# File auto-closes, even if error!
\`\`\`

## How It Works

\`\`\`python
# Context managers have __enter__ and __exit__
class MyContextManager:
    def __enter__(self):
        print("Entering...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting...")
        return False  # Don't suppress exceptions

with MyContextManager() as cm:
    print("Inside")
# Output:
# Entering...
# Inside
# Exiting...
\`\`\`

## Creating with @contextmanager

\`\`\`python
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    yield  # Code inside 'with' runs here
    end = time.time()
    print(f"Elapsed: {end - start:.2f}s")

with timer():
    # Do slow work
    time.sleep(1)
# Output: Elapsed: 1.00s
\`\`\`

## Multiple Context Managers

\`\`\`python
# Multiple resources
with open("source.txt") as src, open("dest.txt", "w") as dst:
    dst.write(src.read())

# Or use parentheses (Python 3.9+)
with (
    open("file1.txt") as f1,
    open("file2.txt") as f2,
):
    pass
\`\`\`

## Common Context Managers

\`\`\`python
# Database connection
with db.connect() as conn:
    conn.execute("SELECT * FROM users")

# Lock (threading)
with threading.Lock():
    # Thread-safe code
    pass

# Suppress exceptions
from contextlib import suppress
with suppress(FileNotFoundError):
    os.remove("maybe_missing.txt")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚪 Python Context Managers Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>How 'with' Works</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<ol>";
html += "<li>Call <code>__enter__()</code> → Get resource</li>";
html += "<li>Execute your code inside 'with'</li>";
html += "<li>Call <code>__exit__()</code> → Cleanup (always!)</li>";
html += "</ol></div>";

html += "<h3>Common Use Cases</h3>";
const cases = [
  { resource: "Files", code: "with open('f.txt') as f:" },
  { resource: "Database", code: "with db.connect() as conn:" },
  { resource: "Locks", code: "with threading.Lock():" },
  { resource: "Timer", code: "with Timer() as t:" },
  { resource: "Temp file", code: "with tempfile.NamedTemporaryFile() as f:" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Resource</th><th>Usage</th></tr>";
cases.forEach((c, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + c.resource + "</td>";
  html += "<td style='padding:10px;'><code>" + c.code + "</code></td></tr>";
});
html += "</table>";

html += "<p style='background:#e3f2fd;padding:15px;border-radius:8px;margin-top:20px;'>";
html += "✅ <b>Key benefit:</b> Resources are ALWAYS cleaned up, even if exceptions occur!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Lists
    'lists': {
      title: 'Python Lists',
      content: `# Python Lists 📋

Think of lists like **shopping lists** - you can add, remove, and rearrange items!

## Creating Lists

\`\`\`python
# Empty list
empty = []

# List with values
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]  # Mixed types OK!

# From other iterables
from_string = list("hello")  # ['h', 'e', 'l', 'l', 'o']
from_range = list(range(5))  # [0, 1, 2, 3, 4]
\`\`\`

## Accessing Elements

\`\`\`python
fruits = ["apple", "banana", "cherry", "date"]

print(fruits[0])    # apple (first)
print(fruits[-1])   # date (last)
print(fruits[1:3])  # ['banana', 'cherry']
print(fruits[:2])   # ['apple', 'banana']
print(fruits[2:])   # ['cherry', 'date']
\`\`\`

## Modifying Lists

\`\`\`python
fruits = ["apple", "banana"]

# Add
fruits.append("cherry")      # End: ['apple', 'banana', 'cherry']
fruits.insert(1, "blueberry") # At index: ['apple', 'blueberry', ...]
fruits.extend(["date", "fig"]) # Multiple

# Remove
fruits.remove("banana")      # By value
popped = fruits.pop()        # Last item
popped = fruits.pop(0)       # At index
del fruits[0]                # By index
fruits.clear()               # All items

# Modify
fruits[0] = "apricot"        # Replace
\`\`\`

## List Operations

\`\`\`python
a = [1, 2, 3]
b = [4, 5, 6]

# Concatenate
c = a + b  # [1, 2, 3, 4, 5, 6]

# Repeat
d = a * 3  # [1, 2, 3, 1, 2, 3, 1, 2, 3]

# Length
print(len(a))  # 3

# Check membership
print(2 in a)  # True

# Count
nums = [1, 1, 2, 2, 2, 3]
print(nums.count(2))  # 3

# Sort
nums.sort()           # In place
sorted_nums = sorted(nums)  # New list
nums.reverse()        # Reverse in place
\`\`\`

## List Comprehension

\`\`\`python
# Traditional
squares = []
for x in range(5):
    squares.append(x ** 2)

# Comprehension (Pythonic!)
squares = [x ** 2 for x in range(5)]
# [0, 1, 4, 9, 16]

# With condition
evens = [x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]

# Nested
matrix = [[j for j in range(3)] for i in range(3)]
# [[0, 1, 2], [0, 1, 2], [0, 1, 2]]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📋 Python Lists Demo</h2>
<div id="demo"></div>

<script>
let fruits = ["apple", "banana", "cherry"];

let html = "<h3>List: " + JSON.stringify(fruits) + "</h3>";

// Indexing
html += "<div style='background: #e8f5e9; padding: 15px; margin: 10px 0; border-radius: 8px;'>";
html += "<b>Indexing:</b><br>";
html += "<code>fruits[0]</code> → '" + fruits[0] + "'<br>";
html += "<code>fruits[-1]</code> → '" + fruits[fruits.length - 1] + "'<br>";
html += "<code>fruits[1:3]</code> → " + JSON.stringify(fruits.slice(1, 3));
html += "</div>";

// Methods
const methods = [
  { method: "append('date')", effect: "Adds to end" },
  { method: "insert(1, 'blueberry')", effect: "Adds at index" },
  { method: "remove('banana')", effect: "Removes by value" },
  { method: "pop()", effect: "Removes & returns last" },
  { method: "sort()", effect: "Sorts in place" },
  { method: "reverse()", effect: "Reverses in place" }
];

html += "<h3>Common Methods</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Method</th><th style='padding: 10px;'>Effect</th></tr>";

methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + m.method + "</code></td>";
  html += "<td style='padding: 10px;'>" + m.effect + "</td></tr>";
});
html += "</table>";

// Comprehension
html += "<h3>List Comprehension ✨</h3>";
html += "<div style='background: #fff3e0; padding: 15px; border-radius: 8px;'>";
html += "<code>[x ** 2 for x in range(5)]</code><br>";
const squares = [];
for (let i = 0; i < 5; i++) squares.push(i * i);
html += "Result: " + JSON.stringify(squares) + "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    'dictionaries': {
      title: 'Python Dictionaries',
      content: `# Python Dictionaries 📚

Think of dictionaries like a **real dictionary** - look up a word (key) to find its definition (value)!

## Creating Dictionaries

\`\`\`python
# Empty
empty = {}

# With values
person = {
    "name": "Alice",
    "age": 25,
    "city": "NYC"
}

# From keys
keys = ["a", "b", "c"]
d = dict.fromkeys(keys, 0)  # {'a': 0, 'b': 0, 'c': 0}

# From pairs
pairs = [("a", 1), ("b", 2)]
d = dict(pairs)  # {'a': 1, 'b': 2}
\`\`\`

## Accessing Values

\`\`\`python
person = {"name": "Alice", "age": 25}

# Direct access (raises KeyError if missing)
print(person["name"])  # Alice

# Safe access with .get()
print(person.get("name"))        # Alice
print(person.get("salary"))      # None
print(person.get("salary", 0))   # 0 (default)

# Check if key exists
if "name" in person:
    print("Name exists!")
\`\`\`

## Modifying Dictionaries

\`\`\`python
person = {"name": "Alice"}

# Add/Update
person["age"] = 25          # Add new key
person["name"] = "Bob"      # Update existing
person.update({"city": "NYC", "age": 26})

# Remove
del person["age"]           # By key
popped = person.pop("city") # Returns value
person.popitem()            # Last item
person.clear()              # All items
\`\`\`

## Iterating

\`\`\`python
person = {"name": "Alice", "age": 25, "city": "NYC"}

# Keys (default)
for key in person:
    print(key)

# Values
for value in person.values():
    print(value)

# Both (most common)
for key, value in person.items():
    print(f"{key}: {value}")
\`\`\`

## Dictionary Comprehension

\`\`\`python
# Create from list
names = ["alice", "bob", "charlie"]
name_lengths = {name: len(name) for name in names}
# {'alice': 5, 'bob': 3, 'charlie': 7}

# With condition
nums = range(5)
squares = {x: x**2 for x in nums if x % 2 == 0}
# {0: 0, 2: 4, 4: 16}

# Swap keys/values
original = {"a": 1, "b": 2}
swapped = {v: k for k, v in original.items()}
# {1: 'a', 2: 'b'}
\`\`\`

## Nested Dictionaries

\`\`\`python
users = {
    "user1": {"name": "Alice", "age": 25},
    "user2": {"name": "Bob", "age": 30}
}

print(users["user1"]["name"])  # Alice

# Safely access nested
from collections import defaultdict
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📚 Python Dictionaries Demo</h2>
<div id="demo"></div>

<script>
const person = {
  name: "Alice",
  age: 25,
  city: "NYC"
};

let html = "<h3>Dictionary: person</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += JSON.stringify(person, null, 2);
html += "</pre>";

// Accessing
html += "<h3>Accessing Values</h3>";
html += "<div style='background: #e8f5e9; padding: 15px; border-radius: 8px;'>";
html += "<code>person['name']</code> → '" + person.name + "'<br>";
html += "<code>person.get('salary', 0)</code> → 0 (default)<br>";
html += "<code>'age' in person</code> → true</div>";

// Iteration
html += "<h3>Iterating with .items()</h3>";
html += "<div style='background: #e3f2fd; padding: 15px; border-radius: 8px;'>";
for (const [key, value] of Object.entries(person)) {
  html += key + ": " + value + "<br>";
}
html += "</div>";

// Comprehension
html += "<h3>Dict Comprehension</h3>";
html += "<div style='background: #fff3e0; padding: 15px; border-radius: 8px;'>";
html += "<code>{x: x**2 for x in range(5)}</code><br>";
const squares = {};
for (let i = 0; i < 5; i++) squares[i] = i * i;
html += "Result: " + JSON.stringify(squares) + "</div>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // More lessons continue...
    'try-except': {
      title: 'Python Try...Except',
      content: `# Python Error Handling 🛡️

Think of try-except like a **safety net** - it catches errors before they crash your program!

## Basic Try-Except

\`\`\`python
try:
    result = 10 / 0
except:
    print("An error occurred!")
\`\`\`

## Catching Specific Errors

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 10 / number
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
\`\`\`

## Try-Except-Else-Finally

\`\`\`python
try:
    file = open("data.txt")
    data = file.read()
except FileNotFoundError:
    print("File not found!")
else:
    print("File read successfully!")
    print(data)
finally:
    print("Cleanup done!")  # Always runs!
\`\`\`

## Raising Exceptions

\`\`\`python
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    if age > 150:
        raise ValueError("Age seems too high!")
    return age

try:
    validate_age(-5)
except ValueError as e:
    print(f"Invalid: {e}")
\`\`\`

## Common Exception Types

| Exception | When It Occurs |
|-----------|----------------|
| \`ValueError\` | Wrong value type |
| \`TypeError\` | Wrong operation for type |
| \`KeyError\` | Dict key not found |
| \`IndexError\` | List index out of range |
| \`FileNotFoundError\` | File doesn't exist |
| \`ZeroDivisionError\` | Division by zero |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>🛡️ Error Handling Demo</h2>
<div id="demo"></div>

<script>
const examples = [
  { 
    code: "10 / 0", 
    error: "ZeroDivisionError",
    message: "division by zero"
  },
  { 
    code: 'int("hello")', 
    error: "ValueError",
    message: "invalid literal for int()"
  },
  { 
    code: "my_list[100]", 
    error: "IndexError",
    message: "list index out of range"
  },
  { 
    code: 'my_dict["missing"]', 
    error: "KeyError",
    message: "'missing'"
  }
];

let html = "<h3>Common Python Errors</h3>";
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #c0392b; color: white;'>";
html += "<th style='padding: 10px;'>Code</th>";
html += "<th style='padding: 10px;'>Exception</th>";
html += "<th style='padding: 10px;'>Message</th></tr>";

examples.forEach((ex, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'><code>" + ex.code + "</code></td>";
  html += "<td style='padding: 10px; color: #c0392b;'><b>" + ex.error + "</b></td>";
  html += "<td style='padding: 10px;'>" + ex.message + "</td></tr>";
});
html += "</table>";

html += "<h3>Try-Except Pattern</h3>";
html += "<pre style='background: #1a1a2e; color: #0f0; padding: 15px; border-radius: 8px;'>";
html += "try:\\n";
html += "    result = risky_operation()\\n";
html += "except SomeError:\\n";
html += "    handle_error()\\n";
html += "else:\\n";
html += "    success_path()\\n";
html += "finally:\\n";
html += "    cleanup()  # Always runs!</pre>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },

    // Functions Track
    'arguments': {
      title: 'Python Arguments & Returns',
      content: `# Python Arguments & Returns 📦

Think of arguments like **ingredients for a recipe** - you pass them in, and get a delicious result back!

## Positional Arguments

\`\`\`python
def greet(name, greeting):
    return f"{greeting}, {name}!"

# Must be in order
print(greet("Alice", "Hello"))  # Hello, Alice!
\`\`\`

## Keyword Arguments

\`\`\`python
def greet(name, greeting):
    return f"{greeting}, {name}!"

# Can be in any order
print(greet(greeting="Hi", name="Bob"))  # Hi, Bob!
\`\`\`

## Default Arguments

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet("Alice", "Hi"))     # Hi, Alice!
\`\`\`

## *args - Variable Positional

\`\`\`python
def add_all(*numbers):
    """Add any number of values"""
    return sum(numbers)

print(add_all(1, 2))           # 3
print(add_all(1, 2, 3, 4, 5))  # 15
\`\`\`

## **kwargs - Variable Keyword

\`\`\`python
def print_info(**kwargs):
    """Accept any keyword arguments"""
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=25, city="NYC")
\`\`\`

## Combined Parameters

\`\`\`python
def func(a, b, *args, default="x", **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"default={default}")
    print(f"kwargs={kwargs}")

func(1, 2, 3, 4, default="y", extra="value")
\`\`\`

## Multiple Return Values

\`\`\`python
def get_stats(numbers):
    """Return multiple values as tuple"""
    return min(numbers), max(numbers), sum(numbers)

low, high, total = get_stats([1, 5, 3, 9, 2])
print(f"Min: {low}, Max: {high}, Sum: {total}")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>📦 Python Arguments Demo</h2>
<div id="demo"></div>
<script>
function addAll(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

function getStats(numbers) {
  return [Math.min(...numbers), Math.max(...numbers), numbers.reduce((a,b) => a+b, 0)];
}

let html = "<h3>*args Example</h3>";
html += "<code>add_all(1, 2, 3, 4, 5)</code> → " + addAll(1, 2, 3, 4, 5);

html += "<h3>Multiple Returns</h3>";
const [low, high, total] = getStats([1, 5, 3, 9, 2]);
html += "<code>get_stats([1, 5, 3, 9, 2])</code><br>";
html += "Min: " + low + ", Max: " + high + ", Sum: " + total;

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'lambda': {
      title: 'Python Lambda',
      content: `# Python Lambda 🎯

Think of lambda as a **mini function** you create on the spot - no name needed!

## Basic Lambda

\`\`\`python
# Regular function
def square(x):
    return x ** 2

# Lambda equivalent
square = lambda x: x ** 2

print(square(5))  # 25
\`\`\`

## Lambda with Multiple Arguments

\`\`\`python
add = lambda a, b: a + b
print(add(3, 5))  # 8

full_name = lambda first, last: f"{first} {last}"
print(full_name("Alice", "Smith"))  # Alice Smith
\`\`\`

## Lambda with map()

\`\`\`python
numbers = [1, 2, 3, 4, 5]

# Square all numbers
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Convert to strings
strings = list(map(lambda x: str(x), numbers))
\`\`\`

## Lambda with filter()

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Keep only even numbers
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # [2, 4, 6, 8, 10]

# Keep numbers > 5
big = list(filter(lambda x: x > 5, numbers))
print(big)  # [6, 7, 8, 9, 10]
\`\`\`

## Lambda with sorted()

\`\`\`python
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]

# Sort by grade
by_grade = sorted(students, key=lambda s: s["grade"])

# Sort by name
by_name = sorted(students, key=lambda s: s["name"])
\`\`\`

## When NOT to Use Lambda

\`\`\`python
# ❌ Too complex for lambda
process = lambda x: x**2 if x > 0 else abs(x) * 2

# ✅ Use regular function instead
def process(x):
    if x > 0:
        return x ** 2
    else:
        return abs(x) * 2
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>🎯 Python Lambda Demo</h2>
<div id="demo"></div>
<script>
const numbers = [1, 2, 3, 4, 5];

let html = "<h3>map with lambda</h3>";
const squared = numbers.map(x => x ** 2);
html += "<code>map(lambda x: x ** 2, [1,2,3,4,5])</code><br>";
html += "Result: [" + squared.join(", ") + "]";

html += "<h3>filter with lambda</h3>";
const evens = numbers.filter(x => x % 2 === 0);
html += "<code>filter(lambda x: x % 2 == 0, [1,2,3,4,5])</code><br>";
html += "Result: [" + evens.join(", ") + "]";

html += "<h3>sorted with lambda</h3>";
const items = [{name: "Bob", age: 30}, {name: "Alice", age: 25}];
const sorted = [...items].sort((a, b) => a.age - b.age);
html += "<code>sorted(items, key=lambda x: x['age'])</code><br>";
html += "Result: " + sorted.map(x => x.name + "(" + x.age + ")").join(", ");

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'modules': {
      title: 'Python Modules',
      content: `# Python Modules 📦

Think of modules like **LEGO sets** - pre-built pieces you can snap together!

## What is a Module?

A module is simply a Python file with functions, classes, and variables.

\`\`\`python
# mymodule.py
def greet(name):
    return f"Hello, {name}!"

PI = 3.14159
\`\`\`

## Importing Modules

\`\`\`python
# Import entire module
import mymodule
print(mymodule.greet("Alice"))
print(mymodule.PI)

# Import with alias
import mymodule as mm
print(mm.greet("Bob"))

# Import specific items
from mymodule import greet, PI
print(greet("Charlie"))

# Import everything (not recommended)
from mymodule import *
\`\`\`

## Built-in Modules

\`\`\`python
import math
print(math.sqrt(16))   # 4.0
print(math.pi)         # 3.14159...

import random
print(random.randint(1, 10))
print(random.choice(["a", "b", "c"]))

import datetime
print(datetime.datetime.now())

import os
print(os.getcwd())
print(os.listdir())
\`\`\`

## The dir() Function

\`\`\`python
import math

# List all names in module
print(dir(math))
# ['acos', 'asin', 'atan', 'ceil', 'cos', ...]
\`\`\`

## __name__ and __main__

\`\`\`python
# mymodule.py
def main():
    print("Running as main program")

# Only runs when executed directly
if __name__ == "__main__":
    main()
\`\`\`

## Creating Packages

\`\`\`
mypackage/
├── __init__.py
├── module1.py
└── module2.py
\`\`\`

\`\`\`python
from mypackage import module1
from mypackage.module2 import some_function
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>📦 Python Modules Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Common Built-in Modules</h3>";

const modules = [
  { name: "math", funcs: "sqrt, pi, sin, cos, floor, ceil" },
  { name: "random", funcs: "randint, choice, shuffle" },
  { name: "datetime", funcs: "datetime, date, time, timedelta" },
  { name: "os", funcs: "getcwd, listdir, path, mkdir" },
  { name: "json", funcs: "loads, dumps, load, dump" },
  { name: "re", funcs: "match, search, findall, sub" }
];

html += "<table style='width:100%; border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;'>Module</th>";
html += "<th style='padding:10px;'>Key Functions</th></tr>";

modules.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + m.name + "</code></td>";
  html += "<td style='padding:10px;'>" + m.funcs + "</td></tr>";
});
html += "</table>";

html += "<h3>Import Examples</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "import math\\n";
html += "from random import randint\\n";
html += "import datetime as dt\\n";
html += "from os.path import join, exists</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'pip': {
      title: 'Python PIP',
      content: `# Python PIP 📥

Think of PIP as an **app store** for Python - download and install any package!

## What is PIP?

PIP = **P**ackage **I**nstaller for **P**ython

\`\`\`bash
# Check PIP version
pip --version
pip3 --version
\`\`\`

## Installing Packages

\`\`\`bash
# Install a package
pip install requests

# Install specific version
pip install requests==2.28.0

# Install minimum version
pip install requests>=2.25.0

# Install multiple packages
pip install requests flask pandas
\`\`\`

## Managing Packages

\`\`\`bash
# List installed packages
pip list

# Show package info
pip show requests

# Uninstall package
pip uninstall requests

# Upgrade package
pip install --upgrade requests
\`\`\`

## Requirements File

\`\`\`bash
# Create requirements.txt
pip freeze > requirements.txt

# Install from requirements.txt
pip install -r requirements.txt
\`\`\`

\`\`\`txt
# requirements.txt
requests==2.28.0
flask>=2.0.0
pandas
numpy
\`\`\`

## Virtual Environments (Best Practice!)

\`\`\`bash
# Create virtual environment
python -m venv myenv

# Activate (Windows)
myenv\\Scripts\\activate

# Activate (Mac/Linux)
source myenv/bin/activate

# Install packages (isolated!)
pip install requests

# Deactivate
deactivate
\`\`\`

## Popular Packages

| Package | Purpose |
|---------|---------|
| requests | HTTP requests |
| flask | Web framework |
| django | Full-stack web |
| pandas | Data analysis |
| numpy | Numerical computing |
| matplotlib | Plotting |
| scikit-learn | Machine learning |
| pytest | Testing |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>📥 Python PIP Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Essential PIP Commands</h3>";

const commands = [
  { cmd: "pip install <package>", desc: "Install a package" },
  { cmd: "pip uninstall <package>", desc: "Remove a package" },
  { cmd: "pip list", desc: "List all packages" },
  { cmd: "pip freeze > requirements.txt", desc: "Export packages" },
  { cmd: "pip install -r requirements.txt", desc: "Install from file" },
  { cmd: "pip install --upgrade <package>", desc: "Upgrade package" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;'>Command</th>";
html += "<th style='padding:10px;'>Description</th></tr>";

commands.forEach((c, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + c.cmd + "</code></td>";
  html += "<td style='padding:10px;'>" + c.desc + "</td></tr>";
});
html += "</table>";

html += "<h3>Top 10 Packages</h3>";
const packages = ["requests", "numpy", "pandas", "flask", "django", "pytest", "matplotlib", "scikit-learn", "tensorflow", "beautifulsoup4"];
html += "<div style='display:flex;flex-wrap:wrap;gap:10px;'>";
packages.forEach(p => {
  html += "<span style='background:#e8f5e9;padding:8px 15px;border-radius:20px;'>" + p + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'json': {
      title: 'Python JSON',
      content: `# Python JSON 📄

Think of JSON as a **universal language** - everyone (every programming language) understands it!

## What is JSON?

JSON = **J**ava**S**cript **O**bject **N**otation

\`\`\`json
{
  "name": "Alice",
  "age": 25,
  "hobbies": ["reading", "coding"],
  "active": true
}
\`\`\`

## Python to JSON

\`\`\`python
import json

# Python dictionary
person = {
    "name": "Alice",
    "age": 25,
    "hobbies": ["reading", "coding"]
}

# Convert to JSON string
json_string = json.dumps(person)
print(json_string)
# {"name": "Alice", "age": 25, "hobbies": ["reading", "coding"]}

# Pretty print
pretty = json.dumps(person, indent=2)
print(pretty)
\`\`\`

## JSON to Python

\`\`\`python
import json

json_string = '{"name": "Alice", "age": 25}'

# Convert to Python dict
data = json.loads(json_string)
print(data["name"])  # Alice
print(type(data))    # <class 'dict'>
\`\`\`

## Reading/Writing JSON Files

\`\`\`python
import json

# Write to file
with open("data.json", "w") as f:
    json.dump(person, f, indent=2)

# Read from file
with open("data.json", "r") as f:
    loaded = json.load(f)
\`\`\`

## Type Conversion

| Python | JSON |
|--------|------|
| dict | object |
| list | array |
| str | string |
| int, float | number |
| True | true |
| False | false |
| None | null |

## Custom Objects

\`\`\`python
import json
from datetime import datetime

class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

# Custom encoder
def encode_person(obj):
    if isinstance(obj, Person):
        return {"name": obj.name, "age": obj.age}
    raise TypeError(f"Cannot serialize {type(obj)}")

person = Person("Alice", 25)
json_str = json.dumps(person, default=encode_person)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>📄 Python JSON Demo</h2>
<div id="demo"></div>
<script>
const person = {
  name: "Alice",
  age: 25,
  hobbies: ["reading", "coding"],
  active: true
};

let html = "<h3>Python Dict → JSON String</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += JSON.stringify(person, null, 2) + "</pre>";

html += "<h3>Type Conversion Table</h3>";
const types = [
  { python: "dict", json: "object {}" },
  { python: "list", json: "array []" },
  { python: "str", json: "string" },
  { python: "int/float", json: "number" },
  { python: "True/False", json: "true/false" },
  { python: "None", json: "null" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;'>Python</th><th style='padding:10px;'>JSON</th></tr>";
types.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + t.python + "</td>";
  html += "<td style='padding:10px;'>" + t.json + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'regex': {
      title: 'Python RegEx',
      content: `# Python Regular Expressions 🔍

Think of RegEx as a **super-powered search** that can find patterns, not just exact text!

## Import the re Module

\`\`\`python
import re
\`\`\`

## Basic Functions

\`\`\`python
import re

text = "The rain in Spain"

# search - find first match
match = re.search("rain", text)
if match:
    print(match.group())  # rain
    print(match.start())  # 4

# findall - find all matches
matches = re.findall("a.n", text)
print(matches)  # ['ain', 'ain']

# sub - replace
new_text = re.sub("rain", "snow", text)
print(new_text)  # The snow in Spain
\`\`\`

## Special Characters

| Pattern | Meaning |
|---------|---------|
| \\d | Any digit (0-9) |
| \\w | Any word character |
| \\s | Any whitespace |
| . | Any character |
| ^ | Start of string |
| $ | End of string |

## Quantifiers

\`\`\`python
import re

# + = one or more
re.findall("\\d+", "I have 25 apples")  # ['25']

# * = zero or more
re.findall("ab*", "a ab abb")  # ['a', 'ab', 'abb']

# ? = zero or one
re.findall("colou?r", "color colour")  # ['color', 'colour']

# {n} = exactly n times
re.findall("\\d{3}", "123 4567")  # ['123', '456']
\`\`\`

## Groups

\`\`\`python
import re

# Capture groups with ()
text = "My email is alice@gmail.com"
match = re.search(r"(\\w+)@(\\w+)\\.(\\w+)", text)
if match:
    print(match.group(0))  # alice@gmail.com
    print(match.group(1))  # alice
    print(match.group(2))  # gmail
\`\`\`

## Common Patterns

\`\`\`python
# Email
email = r"[\\w.-]+@[\\w.-]+\\.\\w+"

# Phone
phone = r"\\d{3}-\\d{3}-\\d{4}"

# URL
url = r"https?://[\\w.-]+\\.\\w+"
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>🔍 Python RegEx Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>RegEx Pattern Reference</h3>";

const patterns = [
  { pattern: "\\\\d", meaning: "Any digit (0-9)", example: "\\\\d+ matches '123'" },
  { pattern: "\\\\w", meaning: "Any word character", example: "\\\\w+ matches 'hello'" },
  { pattern: "\\\\s", meaning: "Any whitespace", example: "\\\\s+ matches spaces" },
  { pattern: ".", meaning: "Any character", example: "a.b matches 'axb'" },
  { pattern: "^", meaning: "Start of string", example: "^Hello" },
  { pattern: "$", meaning: "End of string", example: "world$" },
  { pattern: "+", meaning: "One or more", example: "\\\\d+ matches '123'" },
  { pattern: "*", meaning: "Zero or more", example: "ab* matches 'a', 'ab', 'abb'" },
  { pattern: "?", meaning: "Zero or one", example: "colou?r matches both" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Pattern</th><th>Meaning</th><th>Example</th></tr>";

patterns.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:8px;'><code>" + p.pattern + "</code></td>";
  html += "<td style='padding:8px;'>" + p.meaning + "</td>";
  html += "<td style='padding:8px;'><code>" + p.example + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'dates': {
      title: 'Python Dates & Math',
      content: `# Python Dates & Math ⏰

Think of datetime as your **time machine** - work with any date or time!

## datetime Module

\`\`\`python
from datetime import datetime, date, time, timedelta

# Current date/time
now = datetime.now()
print(now)  # 2024-01-15 14:30:45.123456

# Today's date
today = date.today()
print(today)  # 2024-01-15

# Create specific date
my_date = datetime(2024, 12, 25, 10, 30)
print(my_date)  # 2024-12-25 10:30:00
\`\`\`

## Accessing Components

\`\`\`python
now = datetime.now()

print(now.year)      # 2024
print(now.month)     # 1
print(now.day)       # 15
print(now.hour)      # 14
print(now.minute)    # 30
print(now.weekday()) # 0 = Monday
\`\`\`

## Formatting Dates

\`\`\`python
now = datetime.now()

# strftime - datetime to string
formatted = now.strftime("%Y-%m-%d %H:%M")
print(formatted)  # 2024-01-15 14:30

# Common format codes
# %Y = Year (2024)
# %m = Month (01-12)
# %d = Day (01-31)
# %H = Hour (00-23)
# %M = Minute (00-59)
# %A = Weekday name
\`\`\`

## Parsing Strings

\`\`\`python
# strptime - string to datetime
date_string = "2024-12-25"
parsed = datetime.strptime(date_string, "%Y-%m-%d")
print(parsed)  # 2024-12-25 00:00:00
\`\`\`

## Date Arithmetic

\`\`\`python
from datetime import timedelta

now = datetime.now()

# Add days
future = now + timedelta(days=30)

# Subtract hours
past = now - timedelta(hours=5)

# Difference between dates
date1 = datetime(2024, 1, 1)
date2 = datetime(2024, 12, 31)
diff = date2 - date1
print(diff.days)  # 365
\`\`\`

## Math Module

\`\`\`python
import math

print(math.pi)      # 3.14159...
print(math.e)       # 2.71828...
print(math.sqrt(16))  # 4.0
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4
print(math.pow(2, 3))   # 8.0
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>⏰ Python Date & Math Demo</h2>
<div id="demo"></div>
<script>
const now = new Date();

let html = "<h3>Current Date/Time</h3>";
html += "<p>" + now.toLocaleString() + "</p>";

html += "<h3>Date Components</h3>";
html += "<table style='border-collapse:collapse;'>";
html += "<tr><td style='padding:5px;'>Year:</td><td>" + now.getFullYear() + "</td></tr>";
html += "<tr><td style='padding:5px;'>Month:</td><td>" + (now.getMonth() + 1) + "</td></tr>";
html += "<tr><td style='padding:5px;'>Day:</td><td>" + now.getDate() + "</td></tr>";
html += "<tr><td style='padding:5px;'>Hour:</td><td>" + now.getHours() + "</td></tr>";
html += "<tr><td style='padding:5px;'>Minute:</td><td>" + now.getMinutes() + "</td></tr>";
html += "</table>";

html += "<h3>Format Codes</h3>";
const codes = [
  { code: "%Y", meaning: "Year (2024)" },
  { code: "%m", meaning: "Month (01-12)" },
  { code: "%d", meaning: "Day (01-31)" },
  { code: "%H", meaning: "Hour 24h (00-23)" },
  { code: "%M", meaning: "Minute (00-59)" },
  { code: "%A", meaning: "Weekday name" }
];
html += "<table style='border-collapse:collapse;'>";
codes.forEach(c => {
  html += "<tr><td style='padding:5px;'><code>" + c.code + "</code></td>";
  html += "<td style='padding:5px;'>" + c.meaning + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    'formatting': {
      title: 'Python String Formatting',
      content: `# Python String Formatting 🎨

Think of string formatting like **Mad Libs** - fill in the blanks with values!

## f-Strings (Best Way! Python 3.6+)

\`\`\`python
name = "Alice"
age = 25

# Basic
message = f"Hello, {name}!"
print(message)  # Hello, Alice!

# Expressions
print(f"Next year: {age + 1}")  # Next year: 26

# Methods
print(f"Name: {name.upper()}")  # Name: ALICE
\`\`\`

## f-String Formatting

\`\`\`python
# Numbers
price = 49.99
print(f"Price: {price:.2f}")  # Price: 49.99

# Width and alignment
print(f"|{name:10}|")   # |Alice     |
print(f"|{name:>10}|")  # |     Alice|
print(f"|{name:^10}|")  # |  Alice   |

# Thousands separator
big = 1000000
print(f"{big:,}")  # 1,000,000

# Percentage
ratio = 0.856
print(f"{ratio:.1%}")  # 85.6%
\`\`\`

## .format() Method

\`\`\`python
# Positional
msg = "Hello, {}!".format("Alice")

# Named
msg = "Hello, {name}!".format(name="Alice")

# Numbered
msg = "{0} and {1}".format("Alice", "Bob")

# Formatting
msg = "Price: {:.2f}".format(49.99)
\`\`\`

## % Operator (Old Style)

\`\`\`python
name = "Alice"
age = 25

# %s for strings
msg = "Hello, %s!" % name

# %d for integers
msg = "Age: %d" % age

# Multiple values
msg = "%s is %d" % (name, age)

# %f for floats
msg = "Price: %.2f" % 49.99
\`\`\`

## Format Specifiers

| Specifier | Meaning | Example |
|-----------|---------|---------|
| :d | Integer | {42:d} → 42 |
| :f | Float | {3.14:.2f} → 3.14 |
| :s | String | {name:s} |
| :, | Thousands | {1000:,} → 1,000 |
| :% | Percentage | {0.5:.0%} → 50% |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>🎨 Python String Formatting Demo</h2>
<div id="demo"></div>
<script>
const name = "Alice";
const age = 25;
const price = 49.99;
const bigNum = 1000000;
const ratio = 0.856;

let html = "<h3>f-String Examples</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;'>Code</th><th style='padding:10px;'>Output</th></tr>";

const examples = [
  { code: 'f"Hello, {name}!"', output: "Hello, " + name + "!" },
  { code: 'f"Next year: {age + 1}"', output: "Next year: " + (age + 1) },
  { code: 'f"Price: {price:.2f}"', output: "Price: " + price.toFixed(2) },
  { code: 'f"{bigNum:,}"', output: bigNum.toLocaleString() },
  { code: 'f"{ratio:.1%}"', output: (ratio * 100).toFixed(1) + "%" },
  { code: 'f"|{name:^10}|"', output: "|  Alice   |" }
];

examples.forEach((e, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + e.code + "</code></td>";
  html += "<td style='padding:10px;'><b>" + e.output + "</b></td></tr>";
});
html += "</table>";

html += "<p style='background:#e8f5e9;padding:15px;border-radius:8px;margin-top:20px;'>";
html += "💡 <b>Tip:</b> Always use f-strings in Python 3.6+ - they're the fastest and most readable!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body>
</html>`,
    },

    // Libraries
    'builtin-modules': {
      title: 'Python Built-in Modules',
      content: `# Python Built-in Modules 📚

Python comes with **batteries included** - powerful modules ready to use!

## os Module

\`\`\`python
import os

# Current directory
print(os.getcwd())

# List files
print(os.listdir())

# Create/remove directories
os.mkdir("new_folder")
os.makedirs("nested/folder", exist_ok=True)
os.rmdir("empty_folder")

# Path operations
print(os.path.exists("file.txt"))
print(os.path.join("folder", "file.txt"))
\`\`\`

## sys Module

\`\`\`python
import sys

# Python version
print(sys.version)

# Command line arguments
print(sys.argv)

# Exit program
sys.exit(0)

# Module search path
print(sys.path)
\`\`\`

## collections Module

\`\`\`python
from collections import Counter, defaultdict, deque

# Counter
c = Counter("hello")  # {'l': 2, 'h': 1, 'e': 1, 'o': 1}

# defaultdict
d = defaultdict(list)
d["key"].append("value")

# deque (double-ended queue)
dq = deque([1, 2, 3])
dq.appendleft(0)
\`\`\`

## itertools Module

\`\`\`python
import itertools

# Combinations
list(itertools.combinations([1,2,3], 2))
# [(1,2), (1,3), (2,3)]

# Permutations
list(itertools.permutations([1,2], 2))
# [(1,2), (2,1)]

# Infinite counter
counter = itertools.count(start=1)
\`\`\`

## pathlib Module

\`\`\`python
from pathlib import Path

p = Path("folder/file.txt")
print(p.name)      # file.txt
print(p.stem)      # file
print(p.suffix)    # .txt
print(p.parent)    # folder
p.mkdir(parents=True, exist_ok=True)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📚 Python Built-in Modules Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Essential Modules</h3>";
const modules = [
  { name: "os", purpose: "File system operations" },
  { name: "sys", purpose: "System-specific functions" },
  { name: "datetime", purpose: "Date/time handling" },
  { name: "json", purpose: "JSON encode/decode" },
  { name: "re", purpose: "Regular expressions" },
  { name: "collections", purpose: "Special containers" },
  { name: "itertools", purpose: "Iterator functions" },
  { name: "functools", purpose: "Higher-order functions" },
  { name: "pathlib", purpose: "Object-oriented paths" },
  { name: "math", purpose: "Mathematical functions" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Module</th><th>Purpose</th></tr>";
modules.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + m.name + "</code></td>";
  html += "<td style='padding:10px;'>" + m.purpose + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'random': {
      title: 'Python Random',
      content: `# Python Random 🎲

Generate random numbers and make random choices!

## Basic Random Numbers

\`\`\`python
import random

# Random float [0.0, 1.0)
print(random.random())  # 0.7431...

# Random integer [a, b] (inclusive)
print(random.randint(1, 10))  # 7

# Random float [a, b]
print(random.uniform(1.0, 10.0))  # 5.34...
\`\`\`

## Random Choices

\`\`\`python
import random

# Pick one
items = ["apple", "banana", "cherry"]
print(random.choice(items))  # banana

# Pick multiple (with replacement)
print(random.choices(items, k=3))  # ['apple', 'cherry', 'apple']

# Pick multiple (without replacement)
print(random.sample(items, k=2))  # ['cherry', 'banana']
\`\`\`

## Shuffle and Seed

\`\`\`python
import random

# Shuffle in place
deck = list(range(1, 53))
random.shuffle(deck)
print(deck[:5])  # [23, 7, 41, 3, 15]

# Set seed for reproducibility
random.seed(42)
print(random.randint(1, 100))  # Always 82
\`\`\`

## Weighted Choices

\`\`\`python
import random

# Choose with weights
options = ["rare", "common", "epic"]
weights = [10, 80, 10]  # 10%, 80%, 10%

result = random.choices(options, weights=weights, k=1)
print(result)
\`\`\`

## Random Ranges

\`\`\`python
import random

# Random from range
print(random.randrange(0, 100, 5))  # 45 (0, 5, 10, ... 95)

# Random float in normal distribution
print(random.gauss(0, 1))  # Around 0, std dev 1
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎲 Python Random Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Random Functions</h3>";

// Simulate random results
const results = {
  "random.random()": Math.random().toFixed(4),
  "random.randint(1, 10)": Math.floor(Math.random() * 10) + 1,
  "random.choice(['a','b','c'])": ["a", "b", "c"][Math.floor(Math.random() * 3)],
  "random.uniform(1, 10)": (Math.random() * 9 + 1).toFixed(4)
};

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Function</th><th>Result</th></tr>";
Object.entries(results).forEach(([fn, result], i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + fn + "</code></td>";
  html += "<td style='padding:10px;'><b>" + result + "</b></td></tr>";
});
html += "</table>";

// Dice roll simulator
html += "<h3>Dice Roll Simulator 🎲</h3>";
const dice = [];
for (let i = 0; i < 5; i++) dice.push(Math.floor(Math.random() * 6) + 1);
html += "<div style='display:flex;gap:10px;'>";
dice.forEach(d => {
  html += "<div style='width:50px;height:50px;background:#3776AB;color:white;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:24px;'>" + d + "</div>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'math': {
      title: 'Python Math',
      content: `# Python Math Module 🔢

Mathematical functions for serious calculations!

## Constants

\`\`\`python
import math

print(math.pi)   # 3.141592653589793
print(math.e)    # 2.718281828459045
print(math.inf)  # Infinity
print(math.nan)  # Not a Number
\`\`\`

## Basic Functions

\`\`\`python
import math

# Square root
print(math.sqrt(16))  # 4.0

# Power
print(math.pow(2, 3))  # 8.0

# Absolute value
print(abs(-5))  # 5

# Floor and ceiling
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4
\`\`\`

## Rounding

\`\`\`python
import math

# Round to nearest
print(round(3.5))  # 4
print(round(2.5))  # 2 (banker's rounding)

# Truncate (remove decimals)
print(math.trunc(3.7))  # 3
print(math.trunc(-3.7)) # -3
\`\`\`

## Trigonometry

\`\`\`python
import math

# Convert degrees to radians
angle = math.radians(90)

# Trig functions (use radians)
print(math.sin(angle))   # 1.0
print(math.cos(angle))   # ~0
print(math.tan(math.radians(45)))  # 1.0

# Inverse trig
print(math.degrees(math.asin(1)))  # 90
\`\`\`

## Logarithms

\`\`\`python
import math

# Natural log (base e)
print(math.log(math.e))   # 1.0

# Log base 10
print(math.log10(100))    # 2.0

# Log base 2
print(math.log2(8))       # 3.0

# Custom base
print(math.log(8, 2))     # 3.0
\`\`\`

## Factorial and Combinations

\`\`\`python
import math

print(math.factorial(5))  # 120 (5!)
print(math.comb(5, 2))    # 10 (5 choose 2)
print(math.perm(5, 2))    # 20 (permutations)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔢 Python Math Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Math Constants</h3>";
html += "<p>π = " + Math.PI.toFixed(10) + "</p>";
html += "<p>e = " + Math.E.toFixed(10) + "</p>";

html += "<h3>Common Functions</h3>";
const functions = [
  { fn: "sqrt(16)", result: Math.sqrt(16) },
  { fn: "pow(2, 8)", result: Math.pow(2, 8) },
  { fn: "floor(3.7)", result: Math.floor(3.7) },
  { fn: "ceil(3.2)", result: Math.ceil(3.2) },
  { fn: "sin(π/2)", result: Math.sin(Math.PI/2).toFixed(4) },
  { fn: "cos(0)", result: Math.cos(0) },
  { fn: "log10(100)", result: Math.log10(100) },
  { fn: "log2(8)", result: Math.log2(8) }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Function</th><th>Result</th></tr>";
functions.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>math." + f.fn + "</code></td>";
  html += "<td style='padding:10px;'><b>" + f.result + "</b></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'statistics': {
      title: 'Python Statistics',
      content: `# Python Statistics Module 📊

Analyze data like a pro!

## Central Tendency

\`\`\`python
import statistics

data = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10]

# Mean (average)
print(statistics.mean(data))  # 5.45...

# Median (middle value)
print(statistics.median(data))  # 5

# Mode (most common)
print(statistics.mode(data))  # 5
\`\`\`

## Spread

\`\`\`python
import statistics

data = [2, 4, 6, 8, 10]

# Variance
print(statistics.variance(data))  # 10

# Standard deviation
print(statistics.stdev(data))  # 3.16...

# Population versions (when you have ALL data)
print(statistics.pvariance(data))
print(statistics.pstdev(data))
\`\`\`

## Quantiles

\`\`\`python
import statistics

data = list(range(1, 101))

# Quantiles (split into n equal groups)
quartiles = statistics.quantiles(data, n=4)
print(quartiles)  # [25.75, 50.5, 75.25]

# Median (same as 2nd quartile)
print(statistics.median(data))  # 50.5
\`\`\`

## Correlation

\`\`\`python
import statistics

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 5]

# Correlation coefficient (-1 to 1)
print(statistics.correlation(x, y))  # 0.77...

# Linear regression
slope, intercept = statistics.linear_regression(x, y)
print(f"y = {slope}x + {intercept}")
\`\`\`

## Harmonic and Geometric Means

\`\`\`python
import statistics

data = [1, 2, 4, 8]

# Harmonic mean (good for rates)
print(statistics.harmonic_mean(data))  # 2.13...

# Geometric mean (good for growth rates)
print(statistics.geometric_mean(data))  # 2.82...
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Python Statistics Demo</h2>
<div id="demo"></div>
<script>
const data = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9, 10];

// Calculate statistics
const mean = data.reduce((a, b) => a + b) / data.length;
const sorted = [...data].sort((a, b) => a - b);
const median = sorted[Math.floor(sorted.length / 2)];
const mode = 5; // Most common

let html = "<h3>Data: [" + data.join(", ") + "]</h3>";

html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Mean</h4><p style='font-size:32px;'>" + mean.toFixed(2) + "</p></div>";

html += "<div style='flex:1;background:#e3f2fd;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Median</h4><p style='font-size:32px;'>" + median + "</p></div>";

html += "<div style='flex:1;background:#fff3e0;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Mode</h4><p style='font-size:32px;'>" + mode + "</p></div>";
html += "</div>";

html += "<h3>Common Functions</h3>";
const fns = [
  { fn: "mean()", desc: "Average of values" },
  { fn: "median()", desc: "Middle value" },
  { fn: "mode()", desc: "Most common value" },
  { fn: "stdev()", desc: "Standard deviation" },
  { fn: "variance()", desc: "Variance" },
  { fn: "quantiles()", desc: "Split into groups" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
fns.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>statistics." + f.fn + "</code></td>";
  html += "<td style='padding:10px;'>" + f.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'requests': {
      title: 'Python Requests',
      content: `# Python Requests 🌐

Make HTTP requests easily - the backbone of API interactions!

## Installation

\`\`\`bash
pip install requests
\`\`\`

## GET Request

\`\`\`python
import requests

# Basic GET
response = requests.get("https://api.github.com")
print(response.status_code)  # 200
print(response.json())  # Parse JSON response

# With parameters
params = {"q": "python", "page": 1}
response = requests.get(
    "https://api.github.com/search/repos",
    params=params
)
\`\`\`

## POST Request

\`\`\`python
import requests

# Send JSON data
data = {"name": "Alice", "email": "alice@example.com"}
response = requests.post(
    "https://api.example.com/users",
    json=data
)
print(response.status_code)  # 201
print(response.json())
\`\`\`

## Headers and Authentication

\`\`\`python
import requests

# Custom headers
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

response = requests.get(
    "https://api.example.com/me",
    headers=headers
)

# Basic auth
response = requests.get(
    "https://api.example.com/secure",
    auth=("username", "password")
)
\`\`\`

## Response Object

\`\`\`python
import requests

r = requests.get("https://api.github.com")

print(r.status_code)  # 200
print(r.headers)      # Response headers
print(r.text)         # Raw text
print(r.json())       # Parsed JSON
print(r.content)      # Raw bytes
print(r.url)          # Final URL
\`\`\`

## Error Handling

\`\`\`python
import requests

try:
    r = requests.get("https://api.example.com", timeout=5)
    r.raise_for_status()  # Raise exception for 4xx/5xx
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e}")
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🌐 Python Requests Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>HTTP Methods</h3>";
const methods = [
  { method: "GET", code: "requests.get(url)", use: "Fetch data" },
  { method: "POST", code: "requests.post(url, json=data)", use: "Create data" },
  { method: "PUT", code: "requests.put(url, json=data)", use: "Update data" },
  { method: "DELETE", code: "requests.delete(url)", use: "Delete data" },
  { method: "PATCH", code: "requests.patch(url, json=data)", use: "Partial update" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Method</th><th>Code</th><th>Use Case</th></tr>";
methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + m.method + "</b></td>";
  html += "<td style='padding:10px;'><code>" + m.code + "</code></td>";
  html += "<td style='padding:10px;'>" + m.use + "</td></tr>";
});
html += "</table>";

html += "<h3>Response Properties</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "r = requests.get(url)\\n\\n";
html += "r.status_code  # 200, 404, 500...\\n";
html += "r.json()       # Parsed JSON\\n";
html += "r.text         # Raw text\\n";
html += "r.headers      # Response headers\\n";
html += "r.ok           # True if 2xx</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // NumPy
    'numpy-intro': {
      title: 'NumPy Introduction',
      content: `# NumPy Introduction 🔢

NumPy is the **foundation of scientific Python** - 50-100x faster than lists!

## What is NumPy?

\`\`\`python
import numpy as np

# NumPy array vs Python list
py_list = [1, 2, 3, 4, 5]
np_array = np.array([1, 2, 3, 4, 5])

# NumPy is MUCH faster for math
np_array * 2  # [2, 4, 6, 8, 10] - instant!
\`\`\`

## Why NumPy?

1. **Speed** - Written in C, vectorized operations
2. **Memory** - Efficient storage
3. **Broadcasting** - Smart operations on different shapes
4. **Foundation** - Pandas, SciPy, scikit-learn all use NumPy

## Creating Arrays

\`\`\`python
import numpy as np

# From list
arr = np.array([1, 2, 3])

# Zeros and ones
zeros = np.zeros(5)        # [0, 0, 0, 0, 0]
ones = np.ones((3, 3))     # 3x3 matrix of 1s

# Range
range_arr = np.arange(0, 10, 2)  # [0, 2, 4, 6, 8]

# Linspace (evenly spaced)
lin = np.linspace(0, 1, 5)  # [0, 0.25, 0.5, 0.75, 1]

# Random
rand = np.random.rand(3, 3)     # 3x3 random [0, 1)
randn = np.random.randn(3, 3)   # Normal distribution
\`\`\`

## Array Properties

\`\`\`python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)   # (2, 3) - 2 rows, 3 cols
print(arr.ndim)    # 2 - dimensions
print(arr.size)    # 6 - total elements
print(arr.dtype)   # int64 - data type
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔢 NumPy Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>NumPy vs Python List Speed</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#ffebee;padding:20px;border-radius:8px;'>";
html += "<h4>Python List ❌</h4>";
html += "<pre>result = []\\nfor x in list:\\n    result.append(x * 2)</pre>";
html += "<p>Slow for large data</p></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<h4>NumPy Array ✅</h4>";
html += "<pre>result = arr * 2</pre>";
html += "<p>50-100x faster!</p></div>";

html += "</div>";

html += "<h3>Array Creation Functions</h3>";
const fns = [
  { fn: "np.array([1,2,3])", result: "[1, 2, 3]" },
  { fn: "np.zeros(3)", result: "[0, 0, 0]" },
  { fn: "np.ones(3)", result: "[1, 1, 1]" },
  { fn: "np.arange(0, 5)", result: "[0, 1, 2, 3, 4]" },
  { fn: "np.linspace(0, 1, 3)", result: "[0, 0.5, 1]" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Function</th><th>Result</th></tr>";
fns.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + f.fn + "</code></td>";
  html += "<td style='padding:10px;'>" + f.result + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'numpy-arrays': {
      title: 'NumPy Arrays',
      content: `# NumPy Arrays 📊

Master the ndarray - NumPy's core data structure!

## Array Operations

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])

# Element-wise operations
print(arr + 10)   # [11, 12, 13, 14, 15]
print(arr * 2)    # [2, 4, 6, 8, 10]
print(arr ** 2)   # [1, 4, 9, 16, 25]
print(np.sqrt(arr))  # [1, 1.41, 1.73, 2, 2.24]

# Array with array
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)  # [5, 7, 9]
print(a * b)  # [4, 10, 18]
\`\`\`

## Indexing and Slicing

\`\`\`python
arr = np.array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

print(arr[3])      # 3
print(arr[2:5])    # [2, 3, 4]
print(arr[:3])     # [0, 1, 2]
print(arr[-3:])    # [7, 8, 9]
print(arr[::2])    # [0, 2, 4, 6, 8] (every 2nd)

# 2D array
arr2d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print(arr2d[0, 1])     # 2
print(arr2d[:2, :2])   # [[1, 2], [4, 5]]
\`\`\`

## Boolean Indexing

\`\`\`python
arr = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

# Create mask
mask = arr > 5
print(mask)  # [False, False, ..., True, True, ...]

# Apply mask
print(arr[mask])  # [6, 7, 8, 9, 10]

# Direct filtering
print(arr[arr % 2 == 0])  # [2, 4, 6, 8, 10]
\`\`\`

## Reshaping

\`\`\`python
arr = np.arange(12)

# Reshape to 2D
reshaped = arr.reshape(3, 4)  # 3 rows, 4 cols
reshaped = arr.reshape(4, -1)  # 4 rows, auto cols

# Flatten back to 1D
flat = reshaped.flatten()

# Transpose
transposed = reshaped.T  # Swap rows and cols
\`\`\`

## Common Operations

\`\`\`python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.sum())      # 21
print(arr.mean())     # 3.5
print(arr.std())      # 1.70...
print(arr.min())      # 1
print(arr.max())      # 6

# Along axis
print(arr.sum(axis=0))  # [5, 7, 9] (column sums)
print(arr.sum(axis=1))  # [6, 15] (row sums)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 NumPy Arrays Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Array Operations</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "arr = np.array([1, 2, 3, 4, 5])\\n\\n";
html += "arr + 10  → [11, 12, 13, 14, 15]\\n";
html += "arr * 2   → [2, 4, 6, 8, 10]\\n";
html += "arr ** 2  → [1, 4, 9, 16, 25]\\n";
html += "arr > 3   → [False, False, False, True, True]</pre>";

html += "<h3>Aggregation Functions</h3>";
const aggs = [
  { fn: "arr.sum()", desc: "Sum of all elements" },
  { fn: "arr.mean()", desc: "Average" },
  { fn: "arr.std()", desc: "Standard deviation" },
  { fn: "arr.min() / max()", desc: "Min/Max values" },
  { fn: "arr.argmin() / argmax()", desc: "Index of min/max" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
aggs.forEach((a, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + a.fn + "</code></td>";
  html += "<td style='padding:10px;'>" + a.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'vectorization': {
      title: 'NumPy Vectorization',
      content: `# NumPy Vectorization 🚀

Replace slow loops with fast vectorized operations!

## The Problem with Loops

\`\`\`python
# ❌ SLOW: Python loops
def slow_square(data):
    result = []
    for x in data:
        result.append(x ** 2)
    return result

# ✅ FAST: NumPy vectorization
def fast_square(data):
    return data ** 2  # Works on entire array!
\`\`\`

## Speed Comparison

\`\`\`python
import numpy as np
import time

size = 1_000_000
data = list(range(size))
arr = np.array(data)

# Python loop: ~200ms
start = time.time()
result = [x ** 2 for x in data]
print(f"Python: {time.time() - start:.3f}s")

# NumPy vectorized: ~2ms
start = time.time()
result = arr ** 2
print(f"NumPy: {time.time() - start:.3f}s")
# 100x faster!
\`\`\`

## Universal Functions (ufuncs)

\`\`\`python
import numpy as np

arr = np.array([1, 4, 9, 16, 25])

# Math ufuncs
np.sqrt(arr)    # [1, 2, 3, 4, 5]
np.exp(arr)     # Exponential
np.log(arr)     # Natural log
np.sin(arr)     # Sine

# Comparison ufuncs
np.greater(arr, 10)  # [False, False, False, True, True]
np.maximum(arr, 10)  # [10, 10, 10, 16, 25]
\`\`\`

## Vectorized Conditionals

\`\`\`python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])

# Instead of if-else loops:
result = np.where(arr > 3, arr * 2, arr)
# [1, 2, 3, 8, 10]

# Multiple conditions
result = np.select(
    [arr < 2, arr < 4],
    ["small", "medium"],
    default="large"
)
# ['small', 'medium', 'medium', 'large', 'large']
\`\`\`

## Custom Vectorized Functions

\`\`\`python
import numpy as np

# Create vectorized version of any function
def my_func(x):
    if x < 0:
        return 0
    return x ** 2

vectorized = np.vectorize(my_func)
arr = np.array([-2, -1, 0, 1, 2])
print(vectorized(arr))  # [0, 0, 0, 1, 4]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚀 NumPy Vectorization Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Speed Comparison</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#ffebee;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Python Loop 🐢</h4>";
html += "<p style='font-size:32px;'>~200ms</p>";
html += "<code>[x**2 for x in data]</code></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>NumPy Vectorized 🚀</h4>";
html += "<p style='font-size:32px;'>~2ms</p>";
html += "<code>arr ** 2</code></div>";

html += "</div>";
html += "<p style='text-align:center;margin-top:20px;'><b>100x faster!</b></p>";

html += "<h3>Common Vectorized Operations</h3>";
const ops = [
  { loop: "for x: result.append(x+1)", vec: "arr + 1" },
  { loop: "for x: result.append(x**2)", vec: "arr ** 2" },
  { loop: "for x: result.append(sqrt(x))", vec: "np.sqrt(arr)" },
  { loop: "for x: if x>0 then x else 0", vec: "np.where(arr>0, arr, 0)" },
  { loop: "for x: result.append(max(x, 10))", vec: "np.maximum(arr, 10)" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Loop (Slow)</th><th>Vectorized (Fast)</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + o.loop + "</code></td>";
  html += "<td style='padding:10px;'><code>" + o.vec + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'broadcasting': {
      title: 'NumPy Broadcasting',
      content: `# NumPy Broadcasting 📡

Operations on arrays with different shapes - NumPy figures it out!

## Basic Broadcasting

\`\`\`python
import numpy as np

# Scalar broadcasts to all elements
arr = np.array([1, 2, 3])
print(arr + 10)  # [11, 12, 13]

# 1D broadcasts across rows
matrix = np.array([[1, 2, 3],
                   [4, 5, 6]])
row = np.array([10, 20, 30])
print(matrix + row)
# [[11, 22, 33],
#  [14, 25, 36]]
\`\`\`

## Broadcasting Rules

\`\`\`
1. Compare shapes right-to-left
2. Dimensions must be equal OR one must be 1
3. If dimension is 1, stretch to match

(3, 4) + (4,)   → works! (4,) stretches to (3, 4)
(3, 4) + (3, 1) → works! (3, 1) stretches to (3, 4)
(3, 4) + (2, 4) → ERROR! 3 ≠ 2 and neither is 1
\`\`\`

## Examples

\`\`\`python
import numpy as np

# Add column to each column
matrix = np.ones((3, 3))
column = np.array([[1], [2], [3]])  # Shape (3, 1)
print(matrix + column)
# [[2, 2, 2],
#  [3, 3, 3],
#  [4, 4, 4]]

# Outer product
a = np.array([1, 2, 3])
b = np.array([10, 20])
print(a.reshape(-1, 1) * b)
# [[10, 20],
#  [20, 40],
#  [30, 60]]
\`\`\`

## Practical Use Cases

\`\`\`python
import numpy as np

# Normalize data (subtract mean, divide by std)
data = np.random.randn(100, 5)  # 100 samples, 5 features
means = data.mean(axis=0)        # Shape (5,)
stds = data.std(axis=0)          # Shape (5,)
normalized = (data - means) / stds  # Broadcasting!

# Distance calculation
points = np.array([[0, 0], [1, 1], [2, 2]])  # 3 points
center = np.array([1, 1])                     # 1 point
distances = np.sqrt(((points - center) ** 2).sum(axis=1))
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📡 NumPy Broadcasting Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Broadcasting in Action</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<pre>";
html += "matrix = [[1, 2, 3],    row = [10, 20, 30]\\n";
html += "         [4, 5, 6]]\\n\\n";
html += "matrix + row =\\n";
html += "         [[11, 22, 33],\\n";
html += "          [14, 25, 36]]</pre>";
html += "</div>";

html += "<h3>Broadcasting Rules</h3>";
const rules = [
  { shapes: "(3, 4) + (4,)", result: "✅ Works", reason: "(4,) stretches to (3,4)" },
  { shapes: "(3, 4) + (3, 1)", result: "✅ Works", reason: "(3,1) stretches to (3,4)" },
  { shapes: "(3, 4) + (1, 4)", result: "✅ Works", reason: "(1,4) stretches to (3,4)" },
  { shapes: "(3, 4) + (2, 4)", result: "❌ Error", reason: "3 ≠ 2 and neither is 1" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Shapes</th><th>Result</th><th>Reason</th></tr>";
rules.forEach((r, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + r.shapes + "</code></td>";
  html += "<td style='padding:10px;'>" + r.result + "</td>";
  html += "<td style='padding:10px;'>" + r.reason + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Pandas - abbreviated for space
    'pandas-intro': {
      title: 'Pandas Introduction',
      content: `# Pandas Introduction 🐼

Pandas is **THE library** for data analysis in Python!

## What is Pandas?

- Built on NumPy
- DataFrame = 2D table (like Excel)
- Series = 1D column

## Creating DataFrames

\`\`\`python
import pandas as pd

# From dictionary
df = pd.DataFrame({
    "name": ["Alice", "Bob", "Charlie"],
    "age": [25, 30, 35],
    "city": ["NYC", "LA", "Chicago"]
})

# From CSV
df = pd.read_csv("data.csv")

# From Excel
df = pd.read_excel("data.xlsx")
\`\`\`

## Basic Operations

\`\`\`python
# View data
df.head()       # First 5 rows
df.tail()       # Last 5 rows
df.info()       # Column info
df.describe()   # Statistics

# Select columns
df["name"]           # Single column (Series)
df[["name", "age"]]  # Multiple columns (DataFrame)

# Select rows
df.iloc[0]      # First row by index
df.loc[0:2]     # Rows 0-2 by label
\`\`\`

## Key Features

1. **Data loading** - CSV, Excel, SQL, JSON
2. **Cleaning** - Handle missing data
3. **Filtering** - Select rows/columns
4. **Grouping** - Aggregate data
5. **Joining** - Merge datasets
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🐼 Pandas Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>DataFrame Example</h3>";
html += "<table style='width:100%;border-collapse:collapse;border:1px solid #ddd;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;'>name</th>";
html += "<th style='padding:10px;'>age</th>";
html += "<th style='padding:10px;'>city</th></tr>";

const data = [
  { name: "Alice", age: 25, city: "NYC" },
  { name: "Bob", age: 30, city: "LA" },
  { name: "Charlie", age: 35, city: "Chicago" }
];

data.forEach((row, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;border:1px solid #ddd;'>" + row.name + "</td>";
  html += "<td style='padding:10px;border:1px solid #ddd;'>" + row.age + "</td>";
  html += "<td style='padding:10px;border:1px solid #ddd;'>" + row.city + "</td></tr>";
});
html += "</table>";

html += "<h3>Common Methods</h3>";
const methods = [
  "df.head() → First 5 rows",
  "df.tail() → Last 5 rows",
  "df.info() → Column info",
  "df.describe() → Statistics",
  "df['column'] → Select column"
];
html += "<ul>";
methods.forEach(m => html += "<li><code>" + m + "</code></li>");
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Pandas continued
    'pandas-indexing': {
      title: 'Pandas Indexing',
      content: `# Pandas Indexing 🎯

Master selecting data like a pro - loc, iloc, and more!

## loc vs iloc

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NYC', 'LA', 'Chicago']
}, index=['a', 'b', 'c'])

# loc - Label-based (uses index labels)
df.loc['a']           # Row with label 'a'
df.loc['a':'b']       # Rows 'a' to 'b' (inclusive!)
df.loc['a', 'name']   # Single cell

# iloc - Integer-based (uses position)
df.iloc[0]            # First row
df.iloc[0:2]          # First 2 rows (exclusive!)
df.iloc[0, 0]         # First cell
\`\`\`

## Selecting Columns

\`\`\`python
# Single column (returns Series)
df['name']
df.name  # Shorthand (not recommended)

# Multiple columns (returns DataFrame)
df[['name', 'age']]

# loc/iloc for columns
df.loc[:, 'name']           # All rows, 'name' column
df.iloc[:, 0]               # All rows, first column
df.loc[:, 'name':'age']     # Columns from 'name' to 'age'
\`\`\`

## Boolean Indexing

\`\`\`python
# Filter rows
df[df['age'] > 25]          # Age > 25
df[df['city'] == 'NYC']     # City is NYC

# Multiple conditions
df[(df['age'] > 25) & (df['city'] == 'LA')]
df[(df['age'] < 30) | (df['city'] == 'Chicago')]

# isin for multiple values
df[df['city'].isin(['NYC', 'LA'])]

# String methods
df[df['name'].str.startswith('A')]
df[df['name'].str.contains('li')]
\`\`\`

## Setting Values

\`\`\`python
# Set single value
df.loc['a', 'age'] = 26

# Set entire column
df['new_col'] = 0

# Set with condition
df.loc[df['age'] > 30, 'category'] = 'Senior'

# Set multiple values
df.loc['a', ['age', 'city']] = [27, 'Boston']
\`\`\`

## at and iat (Fast Single Value)

\`\`\`python
# Fast single value access
df.at['a', 'name']    # Label-based
df.iat[0, 0]          # Integer-based

# Faster than loc/iloc for single values!
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎯 Pandas Indexing Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>loc vs iloc</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Method</th><th>Uses</th><th>Slicing</th></tr>";

const methods = [
  { method: "loc", uses: "Labels/Names", slicing: "Inclusive [a:b]" },
  { method: "iloc", uses: "Integer positions", slicing: "Exclusive [0:2]" },
  { method: "at", uses: "Single label value", slicing: "N/A (fastest)" },
  { method: "iat", uses: "Single integer value", slicing: "N/A (fastest)" }
];

methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>df." + m.method + "</code></td>";
  html += "<td style='padding:10px;'>" + m.uses + "</td>";
  html += "<td style='padding:10px;'>" + m.slicing + "</td></tr>";
});
html += "</table>";

html += "<h3>Examples</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "df.loc['a']           # Row by label\\n";
html += "df.iloc[0]            # Row by position\\n";
html += "df.loc[:, 'name']     # Column by label\\n";
html += "df[df['age'] > 25]    # Boolean filter</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'pandas-filtering': {
      title: 'Pandas Filtering',
      content: `# Pandas Filtering 🔍

Filter your data to find exactly what you need!

## Basic Filtering

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'age': [25, 30, 35, 28],
    'dept': ['Sales', 'IT', 'IT', 'Sales'],
    'salary': [50000, 60000, 70000, 55000]
})

# Single condition
df[df['age'] > 30]
df[df['dept'] == 'IT']
df[df['salary'] >= 55000]
\`\`\`

## Multiple Conditions

\`\`\`python
# AND condition (&)
df[(df['age'] > 25) & (df['dept'] == 'IT')]

# OR condition (|)
df[(df['dept'] == 'Sales') | (df['salary'] > 65000)]

# NOT condition (~)
df[~(df['dept'] == 'IT')]
\`\`\`

## isin() for Multiple Values

\`\`\`python
# Check if in list
df[df['dept'].isin(['IT', 'HR'])]
df[df['age'].isin([25, 30, 35])]

# Exclude values
df[~df['dept'].isin(['IT'])]
\`\`\`

## String Filtering

\`\`\`python
# Contains
df[df['name'].str.contains('li')]

# Starts/ends with
df[df['name'].str.startswith('A')]
df[df['name'].str.endswith('e')]

# Case insensitive
df[df['name'].str.lower().str.contains('alice')]

# Regex
df[df['name'].str.match(r'^[A-C]')]
\`\`\`

## query() Method

\`\`\`python
# More readable syntax
df.query('age > 25')
df.query('dept == "IT" and salary > 60000')
df.query('name.str.contains("li")', engine='python')

# With variables
min_age = 25
df.query('age > @min_age')
\`\`\`

## between() for Ranges

\`\`\`python
# Value in range
df[df['age'].between(25, 30)]
df[df['salary'].between(50000, 60000)]
\`\`\`

## Null Filtering

\`\`\`python
# Find nulls
df[df['name'].isna()]
df[df['name'].isnull()]

# Find non-nulls
df[df['name'].notna()]
df[df['name'].notnull()]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔍 Pandas Filtering Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Filter Operators</h3>";
const ops = [
  { op: "&", name: "AND", example: "(df['a'] > 5) & (df['b'] < 10)" },
  { op: "|", name: "OR", example: "(df['a'] > 5) | (df['b'] < 10)" },
  { op: "~", name: "NOT", example: "~(df['a'] > 5)" },
  { op: ".isin()", name: "IN LIST", example: "df['a'].isin([1, 2, 3])" },
  { op: ".between()", name: "RANGE", example: "df['a'].between(5, 10)" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Operator</th><th>Name</th><th>Example</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + o.op + "</code></td>";
  html += "<td style='padding:10px;'>" + o.name + "</td>";
  html += "<td style='padding:10px;'><code>" + o.example + "</code></td></tr>";
});
html += "</table>";

html += "<h3>String Methods</h3>";
html += "<ul>";
html += "<li><code>.str.contains('text')</code> - Contains substring</li>";
html += "<li><code>.str.startswith('A')</code> - Starts with</li>";
html += "<li><code>.str.endswith('z')</code> - Ends with</li>";
html += "<li><code>.str.match(r'regex')</code> - Regex match</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'pandas-groupby': {
      title: 'Pandas GroupBy',
      content: `# Pandas GroupBy 📊

Split, apply, combine - the power of aggregation!

## Basic GroupBy

\`\`\`python
import pandas as pd

df = pd.DataFrame({
    'dept': ['Sales', 'IT', 'IT', 'Sales', 'HR'],
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'salary': [50000, 60000, 70000, 55000, 45000],
    'years': [2, 5, 3, 4, 1]
})

# Group by single column
grouped = df.groupby('dept')

# Aggregate
grouped['salary'].mean()     # Average salary per dept
grouped['salary'].sum()      # Total salary per dept
grouped['salary'].count()    # Count per dept
\`\`\`

## Multiple Aggregations

\`\`\`python
# agg() for multiple functions
df.groupby('dept')['salary'].agg(['mean', 'min', 'max', 'count'])

# Different functions for different columns
df.groupby('dept').agg({
    'salary': ['mean', 'sum'],
    'years': 'max'
})

# Custom names
df.groupby('dept').agg(
    avg_salary=('salary', 'mean'),
    total_salary=('salary', 'sum'),
    employees=('name', 'count')
)
\`\`\`

## Group by Multiple Columns

\`\`\`python
df.groupby(['dept', 'years'])['salary'].mean()

# Reset index to get DataFrame
df.groupby(['dept', 'years'])['salary'].mean().reset_index()
\`\`\`

## Transform (Keep Same Shape)

\`\`\`python
# Add column with group mean
df['dept_avg'] = df.groupby('dept')['salary'].transform('mean')

# Normalize within groups
df['salary_pct'] = df.groupby('dept')['salary'].transform(
    lambda x: x / x.sum()
)
\`\`\`

## Filter Groups

\`\`\`python
# Keep only groups with mean > 55000
df.groupby('dept').filter(lambda x: x['salary'].mean() > 55000)
\`\`\`

## Apply Custom Functions

\`\`\`python
def top_earner(group):
    return group.loc[group['salary'].idxmax()]

df.groupby('dept').apply(top_earner)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Pandas GroupBy Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>GroupBy Flow</h3>";
html += "<div style='display:flex;align-items:center;gap:20px;justify-content:center;'>";
html += "<div style='background:#e3f2fd;padding:20px;border-radius:8px;text-align:center;'>";
html += "<b>Split</b><br>Group by key</div>";
html += "<span style='font-size:24px;'>→</span>";
html += "<div style='background:#fff3e0;padding:20px;border-radius:8px;text-align:center;'>";
html += "<b>Apply</b><br>Calculate stats</div>";
html += "<span style='font-size:24px;'>→</span>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;'>";
html += "<b>Combine</b><br>Merge results</div>";
html += "</div>";

html += "<h3>Common Aggregations</h3>";
const aggs = [
  { method: "mean()", desc: "Average" },
  { method: "sum()", desc: "Total" },
  { method: "count()", desc: "Count" },
  { method: "min() / max()", desc: "Min/Max" },
  { method: "first() / last()", desc: "First/Last value" },
  { method: "std()", desc: "Standard deviation" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
aggs.forEach((a, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>." + a.method + "</code></td>";
  html += "<td style='padding:10px;'>" + a.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'pandas-joins': {
      title: 'Pandas Joins',
      content: `# Pandas Joins & Merging 🔗

Combine DataFrames like a database pro!

## merge() - SQL-style Joins

\`\`\`python
import pandas as pd

employees = pd.DataFrame({
    'id': [1, 2, 3],
    'name': ['Alice', 'Bob', 'Charlie'],
    'dept_id': [10, 20, 10]
})

departments = pd.DataFrame({
    'dept_id': [10, 20, 30],
    'dept_name': ['Sales', 'IT', 'HR']
})

# Inner join (default)
merged = pd.merge(employees, departments, on='dept_id')

# Left join
merged = pd.merge(employees, departments, on='dept_id', how='left')

# Right join
merged = pd.merge(employees, departments, on='dept_id', how='right')

# Outer join
merged = pd.merge(employees, departments, on='dept_id', how='outer')
\`\`\`

## Different Column Names

\`\`\`python
# When columns have different names
pd.merge(
    employees, 
    departments,
    left_on='dept_id',
    right_on='id'
)
\`\`\`

## Multiple Keys

\`\`\`python
pd.merge(df1, df2, on=['key1', 'key2'])
\`\`\`

## concat() - Stack DataFrames

\`\`\`python
# Stack vertically (rows)
df_combined = pd.concat([df1, df2])

# Stack horizontally (columns)
df_combined = pd.concat([df1, df2], axis=1)

# Reset index
df_combined = pd.concat([df1, df2], ignore_index=True)
\`\`\`

## join() - Index-based

\`\`\`python
# Join on index
df1.join(df2)
df1.join(df2, how='outer')

# Join on key column
df1.set_index('id').join(df2.set_index('dept_id'))
\`\`\`

## Join Types Visual

\`\`\`
Inner: Only matching rows
Left:  All from left + matching from right
Right: Matching from left + all from right
Outer: All from both
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔗 Pandas Joins Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Join Types</h3>";
html += "<div style='display:grid;grid-template-columns:1fr 1fr;gap:15px;'>";

const joins = [
  { type: "inner", desc: "Only matching rows", color: "#e8f5e9" },
  { type: "left", desc: "All left + matching right", color: "#e3f2fd" },
  { type: "right", desc: "Matching left + all right", color: "#fff3e0" },
  { type: "outer", desc: "All from both tables", color: "#fce4ec" }
];

joins.forEach(j => {
  html += "<div style='background:" + j.color + ";padding:15px;border-radius:8px;'>";
  html += "<h4 style='margin:0;'>" + j.type.toUpperCase() + "</h4>";
  html += "<p style='margin:5px 0 0 0;'>" + j.desc + "</p></div>";
});
html += "</div>";

html += "<h3>Quick Reference</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "# Merge (SQL-style)\\n";
html += "pd.merge(df1, df2, on='key', how='left')\\n\\n";
html += "# Concat (stack)\\n";
html += "pd.concat([df1, df2])  # Vertical\\n";
html += "pd.concat([df1, df2], axis=1)  # Horizontal\\n\\n";
html += "# Join (on index)\\n";
html += "df1.join(df2)</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'pandas-cleaning': {
      title: 'Pandas Data Cleaning',
      content: `# Pandas Data Cleaning 🧹

Real data is messy - here's how to fix it!

## Handling Missing Data

\`\`\`python
import pandas as pd
import numpy as np

df = pd.DataFrame({
    'name': ['Alice', 'Bob', None, 'Diana'],
    'age': [25, np.nan, 35, 28],
    'city': ['NYC', 'LA', 'Chicago', None]
})

# Find missing values
df.isna()           # Boolean mask
df.isna().sum()     # Count per column

# Drop rows with any null
df.dropna()

# Drop rows where specific column is null
df.dropna(subset=['name'])

# Fill missing values
df.fillna(0)                      # Fill with 0
df.fillna('Unknown')              # Fill with string
df['age'].fillna(df['age'].mean()) # Fill with mean
df.fillna(method='ffill')         # Forward fill
df.fillna(method='bfill')         # Backward fill
\`\`\`

## Removing Duplicates

\`\`\`python
# Check for duplicates
df.duplicated()             # Boolean mask
df.duplicated().sum()       # Count

# Remove duplicates
df.drop_duplicates()                    # All columns
df.drop_duplicates(subset=['name'])     # Specific columns
df.drop_duplicates(keep='last')         # Keep last occurrence
\`\`\`

## Data Type Conversion

\`\`\`python
# Check types
df.dtypes

# Convert types
df['age'] = df['age'].astype(int)
df['date'] = pd.to_datetime(df['date'])
df['category'] = df['category'].astype('category')

# Convert with errors='coerce' (invalid → NaN)
df['age'] = pd.to_numeric(df['age'], errors='coerce')
\`\`\`

## String Cleaning

\`\`\`python
# Strip whitespace
df['name'] = df['name'].str.strip()

# Lowercase/uppercase
df['name'] = df['name'].str.lower()
df['name'] = df['name'].str.upper()
df['name'] = df['name'].str.title()

# Replace text
df['name'] = df['name'].str.replace('old', 'new')
\`\`\`

## Renaming

\`\`\`python
# Rename columns
df.rename(columns={'old_name': 'new_name'})
df.columns = ['col1', 'col2', 'col3']

# Rename index
df.rename(index={0: 'first'})
\`\`\`

## Apply Custom Cleaning

\`\`\`python
# Apply function to column
df['age'] = df['age'].apply(lambda x: x if x > 0 else None)

# Apply to entire DataFrame
df = df.apply(lambda col: col.fillna(col.mode()[0]))
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🧹 Pandas Data Cleaning Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Handling Missing Values</h3>";
const methods = [
  { method: "df.isna()", desc: "Find nulls (boolean)" },
  { method: "df.dropna()", desc: "Remove rows with nulls" },
  { method: "df.fillna(0)", desc: "Replace nulls with value" },
  { method: "df.fillna(method='ffill')", desc: "Forward fill" },
  { method: "df['col'].interpolate()", desc: "Interpolate values" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Method</th><th>Description</th></tr>";
methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + m.method + "</code></td>";
  html += "<td style='padding:10px;'>" + m.desc + "</td></tr>";
});
html += "</table>";

html += "<h3>Data Cleaning Pipeline</h3>";
html += "<pre style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "def clean_data(df):\\n";
html += "    df = df.drop_duplicates()\\n";
html += "    df = df.dropna(subset=['id'])\\n";
html += "    df['name'] = df['name'].str.strip().str.title()\\n";
html += "    df['age'] = pd.to_numeric(df['age'], errors='coerce')\\n";
html += "    df['age'] = df['age'].fillna(df['age'].median())\\n";
html += "    return df</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Visualization
    'matplotlib-intro': {
      title: 'Matplotlib Introduction',
      content: `# Matplotlib Introduction 📊

Create beautiful visualizations with Python's most popular plotting library!

## Basic Setup

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Simple line plot
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]

plt.plot(x, y)
plt.xlabel('X axis')
plt.ylabel('Y axis')
plt.title('My First Plot')
plt.show()
\`\`\`

## Figure and Axes

\`\`\`python
# Create figure and axis
fig, ax = plt.subplots()

ax.plot(x, y)
ax.set_xlabel('X axis')
ax.set_ylabel('Y axis')
ax.set_title('Using Axes')

plt.show()
\`\`\`

## Styling Lines

\`\`\`python
plt.plot(x, y, 'r--')   # Red dashed
plt.plot(x, y, 'b-o')   # Blue solid with circles
plt.plot(x, y, 'g^')    # Green triangles

# More options
plt.plot(x, y, 
         color='blue',
         linestyle='--',
         linewidth=2,
         marker='o',
         markersize=8,
         label='My Data')
plt.legend()
\`\`\`

## Multiple Lines

\`\`\`python
plt.plot(x, y1, label='Line 1')
plt.plot(x, y2, label='Line 2')
plt.legend()
plt.show()
\`\`\`

## Saving Figures

\`\`\`python
plt.savefig('plot.png', dpi=300, bbox_inches='tight')
plt.savefig('plot.pdf')
plt.savefig('plot.svg')
\`\`\`

## Common Customizations

\`\`\`python
plt.figure(figsize=(10, 6))  # Size in inches
plt.grid(True)                # Add grid
plt.xlim(0, 10)               # X axis limits
plt.ylim(0, 100)              # Y axis limits
plt.xticks([0, 5, 10])        # X tick positions
plt.tight_layout()            # Adjust spacing
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Matplotlib Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Line Style Shortcuts</h3>";
const styles = [
  { code: "'r-'", desc: "Red solid line" },
  { code: "'b--'", desc: "Blue dashed line" },
  { code: "'g:'", desc: "Green dotted line" },
  { code: "'k-.'", desc: "Black dash-dot" },
  { code: "'ro'", desc: "Red circles" },
  { code: "'bs'", desc: "Blue squares" },
  { code: "'g^'", desc: "Green triangles" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Code</th><th>Description</th></tr>";
styles.forEach((s, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + s.code + "</code></td>";
  html += "<td style='padding:10px;'>" + s.desc + "</td></tr>";
});
html += "</table>";

html += "<h3>Essential Plot Types</h3>";
html += "<div style='display:grid;grid-template-columns:repeat(4,1fr);gap:10px;'>";
const types = ["Line", "Bar", "Scatter", "Histogram", "Pie", "Box", "Heatmap", "Area"];
types.forEach(t => {
  html += "<div style='background:#e8f5e9;padding:10px;border-radius:8px;text-align:center;'>" + t + "</div>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'chart-types': {
      title: 'Chart Types',
      content: `# Chart Types 📈

Choose the right chart for your data!

## Line Chart

\`\`\`python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [10, 25, 15, 30, 20]

plt.plot(x, y, marker='o')
plt.title('Line Chart')
plt.show()
\`\`\`

## Bar Chart

\`\`\`python
categories = ['A', 'B', 'C', 'D']
values = [25, 40, 30, 55]

plt.bar(categories, values, color='skyblue')
plt.title('Bar Chart')

# Horizontal bars
plt.barh(categories, values)
\`\`\`

## Scatter Plot

\`\`\`python
x = np.random.rand(50)
y = np.random.rand(50)
sizes = np.random.rand(50) * 500
colors = np.random.rand(50)

plt.scatter(x, y, s=sizes, c=colors, alpha=0.5)
plt.colorbar()
plt.title('Scatter Plot')
\`\`\`

## Histogram

\`\`\`python
data = np.random.randn(1000)

plt.hist(data, bins=30, edgecolor='black')
plt.title('Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
\`\`\`

## Pie Chart

\`\`\`python
sizes = [35, 25, 20, 20]
labels = ['A', 'B', 'C', 'D']
explode = [0.1, 0, 0, 0]  # Explode first slice

plt.pie(sizes, labels=labels, explode=explode, 
        autopct='%1.1f%%', startangle=90)
plt.title('Pie Chart')
\`\`\`

## Box Plot

\`\`\`python
data = [np.random.randn(100) for _ in range(4)]
plt.boxplot(data, labels=['A', 'B', 'C', 'D'])
plt.title('Box Plot')
\`\`\`

## When to Use What

| Chart | Use When |
|-------|----------|
| Line | Trends over time |
| Bar | Comparing categories |
| Scatter | Relationships between variables |
| Histogram | Distribution of values |
| Pie | Parts of a whole |
| Box | Statistical distribution |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📈 Chart Types Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Chart Selection Guide</h3>";
const charts = [
  { type: "Line", when: "Trends over time", icon: "📈" },
  { type: "Bar", when: "Compare categories", icon: "📊" },
  { type: "Scatter", when: "Variable relationships", icon: "⚬" },
  { type: "Histogram", when: "Data distribution", icon: "📶" },
  { type: "Pie", when: "Parts of whole", icon: "🥧" },
  { type: "Box", when: "Statistical summary", icon: "📦" },
  { type: "Heatmap", when: "2D value density", icon: "🔥" },
  { type: "Area", when: "Cumulative trends", icon: "📐" }
];

html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:10px;'>";
charts.forEach(c => {
  html += "<div style='background:#f8f9fa;padding:15px;border-radius:8px;'>";
  html += "<b>" + c.icon + " " + c.type + "</b><br>";
  html += "<small>" + c.when + "</small></div>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // DSA basics
    'dsa-lists': {
      title: 'DSA: Lists & Arrays',
      content: `# Lists & Arrays in DSA 📋

The foundation of all data structures!

## Python List as Array

\`\`\`python
# List is dynamic array
arr = [1, 2, 3, 4, 5]

# Access: O(1)
print(arr[0])    # 1
print(arr[-1])   # 5

# Append: O(1) amortized
arr.append(6)

# Insert: O(n) - shifts elements
arr.insert(0, 0)

# Delete: O(n) - shifts elements
arr.pop(0)      # Remove first
arr.remove(3)   # Remove value 3
\`\`\`

## Time Complexities

| Operation | Time |
|-----------|------|
| Access by index | O(1) |
| Append | O(1) |
| Insert at position | O(n) |
| Delete by index | O(n) |
| Search (unsorted) | O(n) |
| Search (sorted) | O(log n) |

## Common Patterns

\`\`\`python
# Two pointers
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1
    return None

# Sliding window
def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, window_sum)
    return max_sum
\`\`\`

## Array vs List

\`\`\`python
import array

# array module - typed, more efficient
arr = array.array('i', [1, 2, 3, 4])  # 'i' = integer

# NumPy array - best for numerical
import numpy as np
arr = np.array([1, 2, 3, 4])
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📋 Lists & Arrays Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Time Complexity</h3>";
const ops = [
  { op: "Access arr[i]", time: "O(1)", note: "Instant!" },
  { op: "Append", time: "O(1)", note: "Usually fast" },
  { op: "Insert at i", time: "O(n)", note: "Shifts elements" },
  { op: "Delete at i", time: "O(n)", note: "Shifts elements" },
  { op: "Search", time: "O(n)", note: "Linear scan" },
  { op: "Binary Search", time: "O(log n)", note: "Sorted only" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Operation</th><th>Time</th><th>Note</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + o.op + "</td>";
  html += "<td style='padding:10px;'><code>" + o.time + "</code></td>";
  html += "<td style='padding:10px;'>" + o.note + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-stacks': {
      title: 'DSA: Stacks',
      content: `# Stacks 📚

LIFO - Last In, First Out. Like a stack of plates!

## Stack Operations

\`\`\`python
# Using list as stack
stack = []

# Push - add to top
stack.append(1)
stack.append(2)
stack.append(3)  # [1, 2, 3]

# Pop - remove from top
top = stack.pop()  # 3, stack = [1, 2]

# Peek - view top without removing
top = stack[-1]    # 2

# Is empty?
is_empty = len(stack) == 0
\`\`\`

## Stack Class

\`\`\`python
class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("Stack is empty")
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
\`\`\`

## Classic Problems

\`\`\`python
# Valid Parentheses
def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in '({[':
            stack.append(char)
        elif char in ')}]':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    
    return len(stack) == 0

print(is_valid("()[]{}"))  # True
print(is_valid("([)]"))    # False
\`\`\`

## Time Complexity

| Operation | Time |
|-----------|------|
| Push | O(1) |
| Pop | O(1) |
| Peek | O(1) |
| Search | O(n) |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📚 Stack Demo</h2>
<div id="demo"></div>
<script>
class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
stack.push(3);

let html = "<h3>Stack Operations</h3>";
html += "<div style='display:flex;gap:20px;align-items:flex-end;'>";

// Visual stack
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<div style='display:flex;flex-direction:column-reverse;'>";
[1, 2, 3].forEach((n, i) => {
  const top = i === 2 ? " ← TOP" : "";
  html += "<div style='background:#3776AB;color:white;padding:10px 30px;margin:2px;text-align:center;'>" + n + top + "</div>";
});
html += "</div></div>";

// Operations
html += "<div>";
html += "<p><code>stack.push(1)</code></p>";
html += "<p><code>stack.push(2)</code></p>";
html += "<p><code>stack.push(3)</code></p>";
html += "<p><code>stack.pop()</code> → 3</p>";
html += "<p><code>stack.peek()</code> → 2</p>";
html += "</div></div>";

html += "<p style='margin-top:20px;background:#fff3e0;padding:15px;border-radius:8px;'>";
html += "💡 <b>LIFO:</b> Last In, First Out - like a stack of plates!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-queues': {
      title: 'DSA: Queues',
      content: `# Queues 🎫

FIFO - First In, First Out. Like a line at a store!

## Queue Operations

\`\`\`python
from collections import deque

# Using deque as queue (efficient!)
queue = deque()

# Enqueue - add to back
queue.append(1)
queue.append(2)
queue.append(3)  # deque([1, 2, 3])

# Dequeue - remove from front
front = queue.popleft()  # 1, queue = deque([2, 3])

# Peek front
front = queue[0]  # 2

# Is empty?
is_empty = len(queue) == 0
\`\`\`

## Queue Class

\`\`\`python
from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()
        raise IndexError("Queue is empty")
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)
\`\`\`

## Priority Queue

\`\`\`python
import heapq

# Min heap (smallest first)
pq = []
heapq.heappush(pq, 3)
heapq.heappush(pq, 1)
heapq.heappush(pq, 2)

smallest = heapq.heappop(pq)  # 1

# Max heap (negate values)
heapq.heappush(pq, -5)  # Store -5
largest = -heapq.heappop(pq)  # Get 5
\`\`\`

## Time Complexity

| Operation | deque | list |
|-----------|-------|------|
| Enqueue (back) | O(1) | O(1) |
| Dequeue (front) | O(1) | O(n) ❌ |
| Peek | O(1) | O(1) |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎫 Queue Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Queue Operations</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<div style='display:flex;align-items:center;gap:10px;'>";
html += "<span>FRONT →</span>";
[1, 2, 3].forEach((n, i) => {
  html += "<div style='background:#3776AB;color:white;padding:15px 25px;border-radius:4px;'>" + n + "</div>";
});
html += "<span>← BACK</span>";
html += "</div></div>";

html += "<h3>deque vs list for Queues</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<h4>✅ deque</h4>";
html += "<p>O(1) for both ends</p>";
html += "<code>from collections import deque</code></div>";
html += "<div style='flex:1;background:#ffebee;padding:15px;border-radius:8px;'>";
html += "<h4>❌ list</h4>";
html += "<p>O(n) for pop(0)</p>";
html += "<p>Don't use for queues!</p></div>";
html += "</div>";

html += "<p style='margin-top:20px;background:#fff3e0;padding:15px;border-radius:8px;'>";
html += "💡 <b>FIFO:</b> First In, First Out - like waiting in line!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // ML Statistics
    'ml-mean': {
      title: 'Mean, Median, Mode',
      content: `# Mean, Median, Mode 📊

The three M's of central tendency - find the "center" of your data!

## Mean (Average)

\`\`\`python
import numpy as np
import statistics

data = [2, 4, 6, 8, 10]

# NumPy
mean = np.mean(data)  # 6.0

# Statistics module
mean = statistics.mean(data)  # 6

# Manual
mean = sum(data) / len(data)  # 6.0
\`\`\`

## Median (Middle Value)

\`\`\`python
data = [1, 3, 5, 7, 9]
median = np.median(data)  # 5

# Even number of elements: average of middle two
data = [1, 3, 5, 7]
median = np.median(data)  # 4.0 = (3+5)/2
\`\`\`

## Mode (Most Common)

\`\`\`python
from statistics import mode, multimode

data = [1, 2, 2, 3, 3, 3, 4]

mode_val = mode(data)  # 3 (appears most)

# Multiple modes
data = [1, 1, 2, 2, 3]
modes = multimode(data)  # [1, 2]
\`\`\`

## When to Use What

| Measure | Use When | Sensitive To |
|---------|----------|--------------|
| Mean | Symmetric data | Outliers ⚠️ |
| Median | Skewed data | Not sensitive |
| Mode | Categorical data | N/A |

## Example: Salaries

\`\`\`python
salaries = [50000, 55000, 60000, 65000, 500000]  # CEO!

print(np.mean(salaries))    # 146,000 (misleading!)
print(np.median(salaries))  # 60,000 (more representative)
\`\`\`

## Practical Tips

- **Mean**: Use for normally distributed data
- **Median**: Use when you have outliers
- **Mode**: Use for categorical/frequency data
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Mean, Median, Mode Demo</h2>
<div id="demo"></div>
<script>
const data = [2, 4, 6, 6, 8, 10];

// Calculate
const mean = data.reduce((a, b) => a + b) / data.length;
const sorted = [...data].sort((a, b) => a - b);
const median = (sorted[2] + sorted[3]) / 2;
const mode = 6;

let html = "<h3>Data: [" + data.join(", ") + "]</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#e3f2fd;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Mean</h4><p style='font-size:36px;'>" + mean.toFixed(1) + "</p>";
html += "<small>Sum ÷ Count</small></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Median</h4><p style='font-size:36px;'>" + median.toFixed(1) + "</p>";
html += "<small>Middle value</small></div>";

html += "<div style='flex:1;background:#fff3e0;padding:20px;border-radius:8px;text-align:center;'>";
html += "<h4>Mode</h4><p style='font-size:36px;'>" + mode + "</p>";
html += "<small>Most frequent</small></div>";

html += "</div>";

html += "<h3 style='margin-top:20px;'>Outlier Example</h3>";
html += "<p>Salaries: [50K, 55K, 60K, 65K, <b>500K</b>]</p>";
html += "<p>Mean: <b>146K</b> 😵 (CEO skews it!)</p>";
html += "<p>Median: <b>60K</b> ✅ (more representative)</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // More DSA
    'dsa-linked': {
      title: 'DSA: Linked Lists',
      content: `# Linked Lists 🔗

Nodes connected by pointers - dynamic and flexible!

## Node Structure

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
\`\`\`

## Basic Operations

\`\`\`python
class LinkedList:
    def __init__(self):
        self.head = None
    
    def append(self, data):
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        current = self.head
        while current.next:
            current = current.next
        current.next = new_node
    
    def prepend(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, data):
        if not self.head:
            return
        if self.head.data == data:
            self.head = self.head.next
            return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next
    
    def display(self):
        elements = []
        current = self.head
        while current:
            elements.append(current.data)
            current = current.next
        return elements
\`\`\`

## Time Complexity

| Operation | Time |
|-----------|------|
| Access | O(n) |
| Prepend | O(1) |
| Append | O(n) |
| Insert | O(n) |
| Delete | O(n) |
| Search | O(n) |

## Array vs Linked List

| Feature | Array | Linked List |
|---------|-------|-------------|
| Access | O(1) ✅ | O(n) |
| Insert at start | O(n) | O(1) ✅ |
| Memory | Contiguous | Scattered |
| Cache | Friendly ✅ | Not friendly |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔗 Linked List Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Linked List Structure</h3>";
html += "<div style='display:flex;align-items:center;gap:10px;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<span>HEAD →</span>";
[10, 20, 30].forEach((n, i) => {
  html += "<div style='display:flex;align-items:center;'>";
  html += "<div style='background:#3776AB;color:white;padding:15px;border-radius:4px;'>";
  html += n + "</div>";
  if (i < 2) html += "<span style='margin:0 5px;'>→</span>";
});
html += "<span>→ NULL</span></div>";

html += "<h3>Array vs Linked List</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e3f2fd;padding:15px;border-radius:8px;'>";
html += "<h4>Array</h4>";
html += "<p>✅ Fast access O(1)</p>";
html += "<p>❌ Slow insert at start</p>";
html += "<p>✅ Cache friendly</p></div>";
html += "<div style='flex:1;background:#fff3e0;padding:15px;border-radius:8px;'>";
html += "<h4>Linked List</h4>";
html += "<p>❌ Slow access O(n)</p>";
html += "<p>✅ Fast insert at start</p>";
html += "<p>✅ Dynamic size</p></div></div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-hash': {
      title: 'DSA: Hash Tables',
      content: `# Hash Tables 🗄️

Key-value storage with O(1) average access!

## Python Dictionary = Hash Table

\`\`\`python
# Dictionary is a hash table
hash_table = {}

# Insert: O(1)
hash_table['name'] = 'Alice'
hash_table['age'] = 25

# Lookup: O(1)
print(hash_table['name'])  # Alice

# Delete: O(1)
del hash_table['age']

# Check existence: O(1)
if 'name' in hash_table:
    print("Found!")
\`\`\`

## How Hashing Works

\`\`\`python
# 1. Key → Hash function → Index
# 2. Store value at that index

def simple_hash(key, size):
    return hash(key) % size

# Example
size = 10
key = "hello"
index = simple_hash(key, size)  # Maybe 7
\`\`\`

## Handling Collisions

\`\`\`python
# Two keys → same index (collision!)

# Method 1: Chaining (linked list at each index)
table = [[] for _ in range(10)]

def insert_chain(key, value):
    index = hash(key) % 10
    table[index].append((key, value))

# Method 2: Open Addressing (find next empty)
def insert_open(key, value, table):
    index = hash(key) % len(table)
    while table[index] is not None:
        index = (index + 1) % len(table)
    table[index] = (key, value)
\`\`\`

## Time Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

## Common Uses

- Caching
- Counting frequencies
- Finding duplicates
- Two-sum problems
- Database indexing
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🗄️ Hash Table Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>How Hashing Works</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<div style='display:flex;align-items:center;gap:20px;justify-content:center;'>";
html += "<div style='background:#3776AB;color:white;padding:15px;border-radius:8px;'>'name'</div>";
html += "<span>→ hash() →</span>";
html += "<div style='background:#ff9800;color:white;padding:15px;border-radius:8px;'>7</div>";
html += "<span>→ store at →</span>";
html += "<div style='background:#4caf50;color:white;padding:15px;border-radius:8px;'>table[7]</div>";
html += "</div></div>";

html += "<h3>O(1) Operations</h3>";
const ops = [
  { op: "dict['key'] = value", desc: "Insert/Update" },
  { op: "value = dict['key']", desc: "Lookup" },
  { op: "del dict['key']", desc: "Delete" },
  { op: "'key' in dict", desc: "Existence check" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + o.op + "</code></td>";
  html += "<td style='padding:10px;'>" + o.desc + "</td>";
  html += "<td style='padding:10px;'><b>O(1)</b></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-trees': {
      title: 'DSA: Binary Trees',
      content: `# Binary Trees 🌳

Hierarchical data structure with parent-child relationships!

## Tree Node

\`\`\`python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
\`\`\`

## Tree Traversals

\`\`\`python
# Inorder: Left → Root → Right
def inorder(node):
    if node:
        inorder(node.left)
        print(node.value)
        inorder(node.right)

# Preorder: Root → Left → Right
def preorder(node):
    if node:
        print(node.value)
        preorder(node.left)
        preorder(node.right)

# Postorder: Left → Right → Root
def postorder(node):
    if node:
        postorder(node.left)
        postorder(node.right)
        print(node.value)

# Level Order (BFS)
from collections import deque

def level_order(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result
\`\`\`

## Common Properties

\`\`\`python
# Height of tree
def height(node):
    if not node:
        return 0
    return 1 + max(height(node.left), height(node.right))

# Count nodes
def count_nodes(node):
    if not node:
        return 0
    return 1 + count_nodes(node.left) + count_nodes(node.right)

# Is balanced?
def is_balanced(node):
    if not node:
        return True
    left_h = height(node.left)
    right_h = height(node.right)
    return abs(left_h - right_h) <= 1 and \\
           is_balanced(node.left) and \\
           is_balanced(node.right)
\`\`\`

## Tree Types

| Type | Property |
|------|----------|
| Binary | Max 2 children |
| BST | Left < Root < Right |
| Complete | All levels full except last |
| Perfect | All levels completely full |
| Balanced | Height difference ≤ 1 |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🌳 Binary Tree Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Tree Structure</h3>";
html += "<div style='text-align:center;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<div style='margin-bottom:10px;'>";
html += "<span style='background:#3776AB;color:white;padding:10px 20px;border-radius:50%;'>10</span></div>";
html += "<div style='margin-bottom:10px;'>↙️ ↘️</div>";
html += "<div style='display:flex;justify-content:center;gap:60px;'>";
html += "<span style='background:#4caf50;color:white;padding:10px 20px;border-radius:50%;'>5</span>";
html += "<span style='background:#4caf50;color:white;padding:10px 20px;border-radius:50%;'>15</span></div>";
html += "</div>";

html += "<h3>Traversal Orders</h3>";
const traversals = [
  { name: "Inorder", order: "Left → Root → Right", result: "5, 10, 15" },
  { name: "Preorder", order: "Root → Left → Right", result: "10, 5, 15" },
  { name: "Postorder", order: "Left → Right → Root", result: "5, 15, 10" },
  { name: "Level", order: "Level by level", result: "10, 5, 15" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Traversal</th><th>Order</th><th>Result</th></tr>";
traversals.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + t.name + "</b></td>";
  html += "<td style='padding:10px;'>" + t.order + "</td>";
  html += "<td style='padding:10px;'>" + t.result + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-graphs': {
      title: 'DSA: Graph Traversal',
      content: `# Graph Traversal 🕸️

Navigate through connected nodes!

## Graph Representation

\`\`\`python
# Adjacency List (most common)
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
\`\`\`

## BFS - Breadth First Search

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            result.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    queue.append(neighbor)
    
    return result

# Use: Shortest path (unweighted)
print(bfs(graph, 'A'))  # ['A', 'B', 'C', 'D', 'E', 'F']
\`\`\`

## DFS - Depth First Search

\`\`\`python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    print(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Iterative version
def dfs_iterative(graph, start):
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            result.append(node)
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result
\`\`\`

## BFS vs DFS

| Aspect | BFS | DFS |
|--------|-----|-----|
| Data Structure | Queue | Stack |
| Memory | More (level) | Less |
| Shortest Path | Yes (unweighted) | No |
| Use Case | Level order, shortest path | Cycles, paths, connectivity |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🕸️ Graph Traversal Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>BFS vs DFS</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#e3f2fd;padding:20px;border-radius:8px;'>";
html += "<h4>BFS (Queue)</h4>";
html += "<p>Explores <b>level by level</b></p>";
html += "<p>✅ Shortest path</p>";
html += "<p>❌ More memory</p>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:10px;border-radius:4px;'>A → B,C → D,E,F</pre></div>";

html += "<div style='flex:1;background:#fff3e0;padding:20px;border-radius:8px;'>";
html += "<h4>DFS (Stack)</h4>";
html += "<p>Explores <b>deep first</b></p>";
html += "<p>❌ Not shortest path</p>";
html += "<p>✅ Less memory</p>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:10px;border-radius:4px;'>A → B → D → E → F → C</pre></div>";

html += "</div>";

html += "<h3>Time Complexity: O(V + E)</h3>";
html += "<p>V = vertices (nodes), E = edges (connections)</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'search-algorithms': {
      title: 'Search Algorithms',
      content: `# Search Algorithms 🔍

Find elements efficiently!

## Linear Search - O(n)

\`\`\`python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Works on any array
arr = [3, 1, 4, 1, 5, 9, 2, 6]
print(linear_search(arr, 5))  # 4
\`\`\`

## Binary Search - O(log n)

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# MUST be sorted!
arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(binary_search(arr, 5))  # 4
\`\`\`

## Binary Search Variations

\`\`\`python
# Find first occurrence
def find_first(arr, target):
    left, right = 0, len(arr) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            result = mid
            right = mid - 1  # Keep searching left
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return result

# Find insertion point
import bisect
arr = [1, 3, 5, 7]
pos = bisect.bisect_left(arr, 4)  # 2
\`\`\`

## Comparison

| Algorithm | Time | Space | Requires |
|-----------|------|-------|----------|
| Linear | O(n) | O(1) | Nothing |
| Binary | O(log n) | O(1) | Sorted |
| Hash | O(1) | O(n) | Hash table |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔍 Search Algorithms Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Linear vs Binary Search</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#ffebee;padding:20px;border-radius:8px;'>";
html += "<h4>Linear O(n)</h4>";
html += "<p>Check every element</p>";
html += "<p>1000 elements → 1000 checks max</p>";
html += "<p>Works on unsorted arrays</p></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<h4>Binary O(log n)</h4>";
html += "<p>Divide and conquer</p>";
html += "<p>1000 elements → 10 checks max</p>";
html += "<p>Requires sorted array</p></div>";

html += "</div>";

html += "<h3>Binary Search Steps</h3>";
html += "<div style='background:#f8f9fa;padding:15px;border-radius:8px;'>";
html += "<p>Array: [1, 2, 3, 4, <b>5</b>, 6, 7, 8, 9], Target: 5</p>";
html += "<ol>";
html += "<li>Mid = 5, Found! ✅</li>";
html += "</ol>";
html += "<p>Array: [1, 2, 3, 4, 5, 6, 7, 8, 9], Target: 2</p>";
html += "<ol>";
html += "<li>Mid = 5, 2 < 5 → go left</li>";
html += "<li>Mid = 2, Found! ✅</li>";
html += "</ol></div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'sort-basic': {
      title: 'Basic Sorting',
      content: `# Basic Sorting Algorithms 📊

Simple but important algorithms to understand!

## Bubble Sort - O(n²)

\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Bubbles largest to end each pass
\`\`\`

## Selection Sort - O(n²)

\`\`\`python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Selects minimum and places at start
\`\`\`

## Insertion Sort - O(n²)

\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

# Good for nearly sorted arrays!
\`\`\`

## Comparison

| Algorithm | Best | Average | Worst | Space |
|-----------|------|---------|-------|-------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) |
| Selection | O(n²) | O(n²) | O(n²) | O(1) |
| Insertion | O(n) | O(n²) | O(n²) | O(1) |

## When to Use

- **Bubble**: Teaching purposes only
- **Selection**: When memory writes are expensive
- **Insertion**: Small or nearly sorted arrays
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Basic Sorting Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Sorting Algorithms Comparison</h3>";
const algos = [
  { name: "Bubble Sort", time: "O(n²)", best: "O(n)", idea: "Swap adjacent pairs" },
  { name: "Selection Sort", time: "O(n²)", best: "O(n²)", idea: "Find min, place at start" },
  { name: "Insertion Sort", time: "O(n²)", best: "O(n)", idea: "Insert into sorted portion" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Algorithm</th><th>Average</th><th>Best</th><th>Idea</th></tr>";
algos.forEach((a, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + a.name + "</b></td>";
  html += "<td style='padding:10px;'>" + a.time + "</td>";
  html += "<td style='padding:10px;'>" + a.best + "</td>";
  html += "<td style='padding:10px;'>" + a.idea + "</td></tr>";
});
html += "</table>";

html += "<p style='background:#fff3e0;padding:15px;border-radius:8px;margin-top:20px;'>";
html += "💡 <b>Tip:</b> These are O(n²) - use Merge/Quick sort for large data!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'sort-advanced': {
      title: 'Advanced Sorting',
      content: `# Advanced Sorting 🚀

Efficient algorithms used in production!

## Merge Sort - O(n log n)

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result
\`\`\`

## Quick Sort - O(n log n) average

\`\`\`python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

## Python's Built-in Sort

\`\`\`python
# Timsort - hybrid of merge and insertion
arr = [3, 1, 4, 1, 5, 9]

arr.sort()              # In-place
sorted_arr = sorted(arr) # Returns new list

# Custom key
arr.sort(key=lambda x: -x)  # Descending
arr.sort(key=len)           # By length
\`\`\`

## Comparison

| Algorithm | Average | Worst | Space | Stable |
|-----------|---------|-------|-------|--------|
| Merge | O(n log n) | O(n log n) | O(n) | Yes |
| Quick | O(n log n) | O(n²) | O(log n) | No |
| Tim | O(n log n) | O(n log n) | O(n) | Yes |

## When to Use

- **Merge**: When stability matters, linked lists
- **Quick**: General purpose, in-place
- **Timsort**: Use Python's built-in!
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚀 Advanced Sorting Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Divide and Conquer</h3>";
html += "<div style='display:flex;gap:20px;'>";

html += "<div style='flex:1;background:#e3f2fd;padding:20px;border-radius:8px;'>";
html += "<h4>Merge Sort</h4>";
html += "<ol style='margin:0;padding-left:20px;'>";
html += "<li>Divide array in half</li>";
html += "<li>Sort each half (recursively)</li>";
html += "<li>Merge sorted halves</li>";
html += "</ol>";
html += "<p>✅ Always O(n log n)</p>";
html += "<p>✅ Stable sort</p></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<h4>Quick Sort</h4>";
html += "<ol style='margin:0;padding-left:20px;'>";
html += "<li>Choose pivot</li>";
html += "<li>Partition around pivot</li>";
html += "<li>Sort partitions (recursively)</li>";
html += "</ol>";
html += "<p>✅ Fast in practice</p>";
html += "<p>⚠️ O(n²) worst case</p></div>";

html += "</div>";

html += "<h3 style='margin-top:20px;'>Just Use Python's sort()!</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "arr.sort()              # In-place\\n";
html += "sorted(arr)             # Returns new list\\n";
html += "sorted(arr, reverse=True)  # Descending\\n";
html += "sorted(arr, key=len)    # By length</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // ML
    'ml-std': {
      title: 'Standard Deviation',
      content: `# Standard Deviation 📏

Measure how spread out your data is!

## What is Standard Deviation?

- **Low std**: Data points close to mean
- **High std**: Data points spread out

\`\`\`python
import numpy as np
import statistics

data = [2, 4, 6, 8, 10]

# NumPy (population)
std = np.std(data)  # 2.83

# Statistics (sample)
std = statistics.stdev(data)  # 3.16

# Population vs Sample
pop_std = np.std(data, ddof=0)   # Population
sample_std = np.std(data, ddof=1) # Sample
\`\`\`

## Formula

\`\`\`
Standard Deviation = √(Σ(x - mean)² / n)

1. Find mean
2. Subtract mean from each value
3. Square each difference
4. Find average of squares (variance)
5. Take square root
\`\`\`

## Manual Calculation

\`\`\`python
import math

data = [2, 4, 6, 8, 10]

# 1. Mean
mean = sum(data) / len(data)  # 6

# 2-3. Squared differences
sq_diff = [(x - mean) ** 2 for x in data]
# [16, 4, 0, 4, 16]

# 4. Variance
variance = sum(sq_diff) / len(data)  # 8

# 5. Standard deviation
std = math.sqrt(variance)  # 2.83
\`\`\`

## Interpretation

| Std Dev | Meaning |
|---------|---------|
| 0 | All values identical |
| Small | Data clustered near mean |
| Large | Data widely spread |

## 68-95-99.7 Rule (Normal Distribution)

- 68% within 1 std dev
- 95% within 2 std devs
- 99.7% within 3 std devs
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📏 Standard Deviation Demo</h2>
<div id="demo"></div>
<script>
const data = [2, 4, 6, 8, 10];
const mean = data.reduce((a, b) => a + b) / data.length;
const variance = data.reduce((sum, x) => sum + (x - mean) ** 2, 0) / data.length;
const std = Math.sqrt(variance);

let html = "<h3>Data: [" + data.join(", ") + "]</h3>";
html += "<p>Mean: " + mean + "</p>";
html += "<p>Variance: " + variance + "</p>";
html += "<p><b>Standard Deviation: " + std.toFixed(2) + "</b></p>";

html += "<h3>68-95-99.7 Rule</h3>";
html += "<div style='background:linear-gradient(90deg, #e3f2fd 0%, #3776AB 50%, #e3f2fd 100%);padding:20px;border-radius:8px;text-align:center;color:white;'>";
html += "<p>68% within ±1σ</p>";
html += "<p>95% within ±2σ</p>";
html += "<p>99.7% within ±3σ</p></div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-percentiles': {
      title: 'Percentiles',
      content: `# Percentiles 📊

Understand where values fall in your data distribution!

## What are Percentiles?

- **25th percentile (Q1)**: 25% of data below
- **50th percentile (Q2)**: Median
- **75th percentile (Q3)**: 75% of data below

\`\`\`python
import numpy as np

data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Single percentile
p50 = np.percentile(data, 50)  # 5.5 (median)
p25 = np.percentile(data, 25)  # 3.25
p75 = np.percentile(data, 75)  # 7.75

# Multiple percentiles
percentiles = np.percentile(data, [25, 50, 75])
\`\`\`

## Quartiles

\`\`\`python
import numpy as np

data = list(range(1, 101))

Q1 = np.percentile(data, 25)   # 25.75
Q2 = np.percentile(data, 50)   # 50.5 (median)
Q3 = np.percentile(data, 75)   # 75.25

# Interquartile Range (IQR)
IQR = Q3 - Q1  # 49.5
\`\`\`

## Detecting Outliers

\`\`\`python
def find_outliers(data):
    Q1 = np.percentile(data, 25)
    Q3 = np.percentile(data, 75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = [x for x in data if x < lower_bound or x > upper_bound]
    return outliers

data = [1, 2, 3, 4, 5, 100]  # 100 is outlier
print(find_outliers(data))   # [100]
\`\`\`

## Percentile Rank

\`\`\`python
from scipy import stats

data = [10, 20, 30, 40, 50]

# What percentile is 35?
rank = stats.percentileofscore(data, 35)  # 60.0
# 35 is higher than 60% of data
\`\`\`

## Use Cases

- Test scores (90th percentile = top 10%)
- Income distribution
- Response time (99th percentile latency)
- Growth charts (child height/weight)
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Percentiles Demo</h2>
<div id="demo"></div>
<script>
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(idx);
  const upper = Math.ceil(idx);
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - idx) + sorted[upper] * (idx - lower);
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const q1 = percentile(data, 25);
const q2 = percentile(data, 50);
const q3 = percentile(data, 75);

let html = "<h3>Quartiles</h3>";
html += "<div style='display:flex;gap:20px;'>";
["Q1 (25%)", "Q2 (50%)", "Q3 (75%)"].forEach((label, i) => {
  const val = [q1, q2, q3][i];
  const colors = ["#e3f2fd", "#e8f5e9", "#fff3e0"];
  html += "<div style='flex:1;background:" + colors[i] + ";padding:20px;border-radius:8px;text-align:center;'>";
  html += "<h4>" + label + "</h4><p style='font-size:32px;'>" + val.toFixed(2) + "</p></div>";
});
html += "</div>";

html += "<h3>IQR (Interquartile Range)</h3>";
html += "<p>IQR = Q3 - Q1 = " + (q3 - q1).toFixed(2) + "</p>";
html += "<p>Used to detect outliers!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Enterprise
    'exceptions': {
      title: 'Exception Handling',
      content: `# Exception Handling 🛡️

Handle errors gracefully in production!

## Basic Try-Except

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

## Multiple Exceptions

\`\`\`python
try:
    value = int(input("Enter number: "))
    result = 10 / value
except ValueError:
    print("Invalid number!")
except ZeroDivisionError:
    print("Cannot divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
\`\`\`

## Try-Except-Else-Finally

\`\`\`python
try:
    file = open("data.txt", "r")
    data = file.read()
except FileNotFoundError:
    print("File not found!")
else:
    # Runs if NO exception
    print("File read successfully!")
finally:
    # ALWAYS runs
    if 'file' in locals():
        file.close()
\`\`\`

## Raising Exceptions

\`\`\`python
def validate_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative")
    if age > 150:
        raise ValueError("Age seems unrealistic")
    return age

try:
    validate_age(-5)
except ValueError as e:
    print(e)  # Age cannot be negative
\`\`\`

## Custom Exceptions

\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(
            f"Cannot withdraw {amount}. Balance: {balance}"
        )

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return balance - amount
\`\`\`

## Common Exceptions

| Exception | Cause |
|-----------|-------|
| ValueError | Wrong value type |
| TypeError | Wrong operation for type |
| KeyError | Dict key not found |
| IndexError | List index out of range |
| FileNotFoundError | File doesn't exist |
| AttributeError | Object has no attribute |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🛡️ Exception Handling Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Try-Except Flow</h3>";
html += "<pre style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "try:\\n";
html += "    # Code that might fail\\n";
html += "except SpecificError:\\n";
html += "    # Handle specific error\\n";
html += "except Exception as e:\\n";
html += "    # Handle any error\\n";
html += "else:\\n";
html += "    # Runs if NO error\\n";
html += "finally:\\n";
html += "    # ALWAYS runs (cleanup)</pre>";

html += "<h3>Common Exceptions</h3>";
const exceptions = [
  { exc: "ValueError", cause: "Wrong value type" },
  { exc: "TypeError", cause: "Wrong type operation" },
  { exc: "KeyError", cause: "Dict key missing" },
  { exc: "IndexError", cause: "List index out of range" },
  { exc: "FileNotFoundError", cause: "File doesn't exist" },
  { exc: "ZeroDivisionError", cause: "Division by zero" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
exceptions.forEach((e, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + e.exc + "</code></td>";
  html += "<td style='padding:10px;'>" + e.cause + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'logging': {
      title: 'Python Logging',
      content: `# Python Logging 📝

Professional logging for production systems!

## Basic Logging

\`\`\`python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Log messages
logging.debug("Debug message")
logging.info("Info message")
logging.warning("Warning message")
logging.error("Error message")
logging.critical("Critical message")
\`\`\`

## Log Levels

| Level | Value | Use Case |
|-------|-------|----------|
| DEBUG | 10 | Development details |
| INFO | 20 | Normal operations |
| WARNING | 30 | Something unexpected |
| ERROR | 40 | Serious problem |
| CRITICAL | 50 | System failure |

## Log to File

\`\`\`python
logging.basicConfig(
    filename='app.log',
    filemode='a',  # Append mode
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
\`\`\`

## Logger Objects

\`\`\`python
import logging

# Create named logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# Console handler
console = logging.StreamHandler()
console.setLevel(logging.INFO)

# File handler
file = logging.FileHandler('app.log')
file.setLevel(logging.DEBUG)

# Formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
console.setFormatter(formatter)
file.setFormatter(formatter)

# Add handlers
logger.addHandler(console)
logger.addHandler(file)

logger.info("Application started")
\`\`\`

## Log with Context

\`\`\`python
user_id = 12345
logger.info(f"User {user_id} logged in")

# Exception logging
try:
    1 / 0
except Exception:
    logger.exception("Error occurred!")
    # Includes full traceback
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📝 Python Logging Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Log Levels</h3>";
const levels = [
  { level: "DEBUG", value: 10, color: "#e0e0e0", use: "Development" },
  { level: "INFO", value: 20, color: "#e8f5e9", use: "Normal operations" },
  { level: "WARNING", value: 30, color: "#fff3e0", use: "Unexpected" },
  { level: "ERROR", value: 40, color: "#ffebee", use: "Serious problem" },
  { level: "CRITICAL", value: 50, color: "#ffcdd2", use: "System failure" }
];

html += "<div style='display:flex;flex-direction:column;gap:5px;'>";
levels.forEach(l => {
  html += "<div style='background:" + l.color + ";padding:10px;border-radius:4px;display:flex;justify-content:space-between;'>";
  html += "<span><b>" + l.level + "</b> (" + l.value + ")</span>";
  html += "<span>" + l.use + "</span></div>";
});
html += "</div>";

html += "<h3>Basic Setup</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "import logging\\n\\n";
html += "logging.basicConfig(\\n";
html += "    level=logging.INFO,\\n";
html += "    format='%(asctime)s - %(levelname)s - %(message)s'\\n";
html += ")\\n\\n";
html += "logging.info('Application started')</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Reference
    'ref-builtins': {
      title: 'Built-in Functions',
      content: `# Python Built-in Functions 📚

All functions available without importing!

## Common Functions

\`\`\`python
# Length
len([1, 2, 3])  # 3
len("hello")   # 5

# Type
type(42)       # <class 'int'>
type([])       # <class 'list'>

# Range
range(5)       # 0, 1, 2, 3, 4
range(2, 5)    # 2, 3, 4
range(0, 10, 2) # 0, 2, 4, 6, 8

# Print
print("Hello", "World", sep=", ")  # Hello, World
print("End", end="\\n\\n")
\`\`\`

## Conversion Functions

\`\`\`python
int("42")      # 42
float("3.14")  # 3.14
str(42)        # "42"
bool(1)        # True
list("abc")    # ['a', 'b', 'c']
tuple([1,2,3]) # (1, 2, 3)
set([1,1,2])   # {1, 2}
dict(a=1, b=2) # {'a': 1, 'b': 2}
\`\`\`

## Math Functions

\`\`\`python
abs(-5)        # 5
round(3.7)     # 4
round(3.14159, 2) # 3.14
min(1, 2, 3)   # 1
max(1, 2, 3)   # 3
sum([1, 2, 3]) # 6
pow(2, 3)      # 8
divmod(17, 5)  # (3, 2) - quotient, remainder
\`\`\`

## Iteration Functions

\`\`\`python
# enumerate - add index
for i, val in enumerate(['a', 'b', 'c']):
    print(i, val)

# zip - combine
for a, b in zip([1, 2], ['a', 'b']):
    print(a, b)

# map - apply function
list(map(str.upper, ['a', 'b']))  # ['A', 'B']

# filter - keep matching
list(filter(lambda x: x > 0, [-1, 0, 1, 2]))  # [1, 2]

# sorted - return sorted
sorted([3, 1, 2])  # [1, 2, 3]
sorted([3, 1, 2], reverse=True)  # [3, 2, 1]

# reversed - reverse iterator
list(reversed([1, 2, 3]))  # [3, 2, 1]

# all/any
all([True, True, False])  # False
any([True, False, False]) # True
\`\`\`

## Object Functions

\`\`\`python
id(obj)        # Object's unique ID
hash("key")    # Hash value
callable(func) # Is it callable?
isinstance(5, int)  # True
issubclass(bool, int) # True
getattr(obj, 'attr') # Get attribute
setattr(obj, 'attr', value)
hasattr(obj, 'attr') # Has attribute?
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📚 Built-in Functions Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Essential Built-ins</h3>";
const funcs = [
  { fn: "len()", desc: "Get length" },
  { fn: "type()", desc: "Get type" },
  { fn: "range()", desc: "Generate sequence" },
  { fn: "print()", desc: "Output to console" },
  { fn: "input()", desc: "Get user input" },
  { fn: "int/float/str()", desc: "Type conversion" },
  { fn: "list/tuple/set/dict()", desc: "Collection conversion" },
  { fn: "min/max/sum()", desc: "Aggregation" },
  { fn: "enumerate()", desc: "Add index to iteration" },
  { fn: "zip()", desc: "Combine iterables" },
  { fn: "map/filter()", desc: "Transform/filter data" },
  { fn: "sorted()", desc: "Sort iterable" }
];

html += "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:10px;'>";
funcs.forEach(f => {
  html += "<div style='background:#f8f9fa;padding:10px;border-radius:8px;'>";
  html += "<code>" + f.fn + "</code><br>";
  html += "<small>" + f.desc + "</small></div>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Practice
    'examples': {
      title: 'Python Examples',
      content: `# Python Examples 💡

Real-world code patterns and examples!

## Fibonacci Sequence

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

print([fibonacci(i) for i in range(10)])
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`

## Factorial

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Or iterative
import math
math.factorial(5)  # 120
\`\`\`

## Prime Checker

\`\`\`python
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

primes = [n for n in range(2, 50) if is_prime(n)]
\`\`\`

## Palindrome Checker

\`\`\`python
def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]

print(is_palindrome("A man a plan a canal Panama"))  # True
\`\`\`

## FizzBuzz

\`\`\`python
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
\`\`\`

## Word Frequency Counter

\`\`\`python
from collections import Counter

text = "hello world hello python world"
words = text.split()
freq = Counter(words)
print(freq.most_common(2))
# [('hello', 2), ('world', 2)]
\`\`\`

## File Word Count

\`\`\`python
def count_words(filename):
    with open(filename, 'r') as f:
        text = f.read()
    words = text.split()
    lines = text.splitlines()
    return {
        'words': len(words),
        'lines': len(lines),
        'chars': len(text)
    }
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>💡 Python Examples Demo</h2>
<div id="demo"></div>
<script>
// Fibonacci
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

// Prime
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// Palindrome
function isPalindrome(s) {
  s = s.toLowerCase().replace(/\\s/g, '');
  return s === s.split('').reverse().join('');
}

let html = "<h3>Fibonacci Sequence</h3>";
const fib = [];
for (let i = 0; i < 10; i++) fib.push(fibonacci(i));
html += "<p>[" + fib.join(", ") + "]</p>";

html += "<h3>Primes < 50</h3>";
const primes = [];
for (let i = 2; i < 50; i++) if (isPrime(i)) primes.push(i);
html += "<p>[" + primes.join(", ") + "]</p>";

html += "<h3>Palindrome Check</h3>";
html += "<p>'A man a plan a canal Panama' → " + isPalindrome("A man a plan a canal Panama") + "</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'exercises': {
      title: 'Python Exercises',
      content: `# Python Exercises 🏋️

Practice makes perfect!

## Beginner

### 1. Sum of List
\`\`\`python
def sum_list(numbers):
    # Return sum of all numbers
    pass

# Test
assert sum_list([1, 2, 3, 4, 5]) == 15
\`\`\`

### 2. Find Maximum
\`\`\`python
def find_max(numbers):
    # Return largest number (don't use max())
    pass

# Test
assert find_max([3, 1, 4, 1, 5, 9]) == 9
\`\`\`

### 3. Count Vowels
\`\`\`python
def count_vowels(s):
    # Count a, e, i, o, u in string
    pass

# Test
assert count_vowels("hello world") == 3
\`\`\`

## Intermediate

### 4. Two Sum
\`\`\`python
def two_sum(nums, target):
    # Return indices of two numbers that add to target
    pass

# Test
assert two_sum([2, 7, 11, 15], 9) == [0, 1]
\`\`\`

### 5. Reverse Words
\`\`\`python
def reverse_words(s):
    # Reverse word order (not letters)
    pass

# Test
assert reverse_words("hello world") == "world hello"
\`\`\`

### 6. Anagram Check
\`\`\`python
def is_anagram(s1, s2):
    # Check if s1 and s2 are anagrams
    pass

# Test
assert is_anagram("listen", "silent") == True
\`\`\`

## Advanced

### 7. Flatten Nested List
\`\`\`python
def flatten(nested):
    # Flatten [[1, 2], [3, [4, 5]]] → [1, 2, 3, 4, 5]
    pass
\`\`\`

### 8. Group Anagrams
\`\`\`python
def group_anagrams(words):
    # Group words that are anagrams
    pass

# Test
# ["eat", "tea", "ate", "tan", "nat"]
# → [["eat", "tea", "ate"], ["tan", "nat"]]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🏋️ Python Exercises</h2>
<div id="demo"></div>
<script>
let html = "<h3>Try These Exercises!</h3>";
const exercises = [
  { level: "Beginner", problems: ["Sum of List", "Find Maximum", "Count Vowels", "Reverse String"] },
  { level: "Intermediate", problems: ["Two Sum", "Reverse Words", "Anagram Check", "Palindrome Number"] },
  { level: "Advanced", problems: ["Flatten Nested List", "Group Anagrams", "LRU Cache", "Binary Search Tree"] }
];

exercises.forEach(e => {
  const colors = { Beginner: "#e8f5e9", Intermediate: "#fff3e0", Advanced: "#ffebee" };
  html += "<div style='background:" + colors[e.level] + ";padding:15px;margin:10px 0;border-radius:8px;'>";
  html += "<h4>" + e.level + "</h4>";
  html += "<ul style='margin:0;'>";
  e.problems.forEach(p => html += "<li>" + p + "</li>");
  html += "</ul></div>";
});

html += "<p style='margin-top:20px;'>";
html += "💡 <b>Tip:</b> Write the solution, then test with the assert statements!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'interview': {
      title: 'Python Interview Q&A',
      content: `# Python Interview Questions 🎯

Common questions and answers!

## Q1: Difference between list and tuple?

**Answer:**
- **List**: Mutable, [], can change after creation
- **Tuple**: Immutable, (), fixed after creation
- Tuples are faster and can be dict keys

## Q2: What is *args and **kwargs?

**Answer:**
- **\*args**: Variable positional arguments (tuple)
- **\*\*kwargs**: Variable keyword arguments (dict)

\`\`\`python
def func(*args, **kwargs):
    print(args)    # (1, 2, 3)
    print(kwargs)  # {'a': 1, 'b': 2}

func(1, 2, 3, a=1, b=2)
\`\`\`

## Q3: What is a decorator?

**Answer:** A function that wraps another function to extend its behavior without modifying it.

\`\`\`python
def timer(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start}s")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(1)
\`\`\`

## Q4: What is GIL?

**Answer:** Global Interpreter Lock - only one thread executes Python bytecode at a time. Use multiprocessing for CPU-bound tasks.

## Q5: List comprehension vs generator?

**Answer:**
- **List**: Creates full list in memory \`[x**2 for x in range(1000000)]\`
- **Generator**: Creates values on demand \`(x**2 for x in range(1000000))\`
- Generator is memory efficient

## Q6: Deep copy vs shallow copy?

\`\`\`python
import copy

original = [[1, 2], [3, 4]]

shallow = copy.copy(original)      # Copies outer list
deep = copy.deepcopy(original)     # Copies everything

original[0][0] = 99
print(shallow[0][0])  # 99 (affected!)
print(deep[0][0])     # 1 (independent)
\`\`\`

## Q7: What is __init__?

**Answer:** Constructor method that initializes object attributes when an instance is created.
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎯 Python Interview Q&A</h2>
<div id="demo"></div>
<script>
const qa = [
  { q: "list vs tuple?", a: "List mutable, tuple immutable" },
  { q: "*args vs **kwargs?", a: "*args=tuple, **kwargs=dict" },
  { q: "What is GIL?", a: "Global Interpreter Lock" },
  { q: "Deep vs shallow copy?", a: "Deep=full copy, shallow=references" },
  { q: "What is __init__?", a: "Constructor method" },
  { q: "What is self?", a: "Reference to current instance" },
  { q: "Generator vs list?", a: "Generator=lazy, memory efficient" },
  { q: "What is decorator?", a: "Function that wraps another" }
];

let html = "<h3>Quick Q&A</h3>";
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th style='padding:10px;text-align:left;'>Question</th>";
html += "<th style='padding:10px;text-align:left;'>Key Answer</th></tr>";

qa.forEach((item, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + item.q + "</td>";
  html += "<td style='padding:10px;'>" + item.a + "</td></tr>";
});
html += "</table>";

html += "<p style='background:#e8f5e9;padding:15px;border-radius:8px;margin-top:20px;'>";
html += "💡 <b>Tip:</b> Practice explaining these concepts out loud!</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'bootcamp': {
      title: 'Python Bootcamp',
      content: `# Python Bootcamp 🚀

Intensive capstone project to solidify your skills!

## Project: Build a CLI Task Manager

Create a command-line todo application with:

### Features
1. Add tasks
2. List all tasks
3. Mark task complete
4. Delete task
5. Save to JSON file
6. Load from JSON file

### Starter Code

\`\`\`python
import json
import sys
from datetime import datetime

class TaskManager:
    def __init__(self, filename="tasks.json"):
        self.filename = filename
        self.tasks = self.load()
    
    def load(self):
        try:
            with open(self.filename, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []
    
    def save(self):
        with open(self.filename, 'w') as f:
            json.dump(self.tasks, f, indent=2)
    
    def add(self, title):
        task = {
            'id': len(self.tasks) + 1,
            'title': title,
            'completed': False,
            'created': datetime.now().isoformat()
        }
        self.tasks.append(task)
        self.save()
        print(f"Added: {title}")
    
    def list_tasks(self):
        for task in self.tasks:
            status = "✓" if task['completed'] else "○"
            print(f"{status} [{task['id']}] {task['title']}")
    
    def complete(self, task_id):
        for task in self.tasks:
            if task['id'] == task_id:
                task['completed'] = True
                self.save()
                print(f"Completed: {task['title']}")
                return
        print("Task not found")
    
    def delete(self, task_id):
        self.tasks = [t for t in self.tasks if t['id'] != task_id]
        self.save()
        print(f"Deleted task {task_id}")

# Usage
if __name__ == "__main__":
    tm = TaskManager()
    
    if len(sys.argv) < 2:
        tm.list_tasks()
    elif sys.argv[1] == "add":
        tm.add(" ".join(sys.argv[2:]))
    elif sys.argv[1] == "done":
        tm.complete(int(sys.argv[2]))
    elif sys.argv[1] == "delete":
        tm.delete(int(sys.argv[2]))
\`\`\`

### Run Commands
\`\`\`bash
python tasks.py add "Learn Python"
python tasks.py add "Build project"
python tasks.py              # List all
python tasks.py done 1       # Complete task 1
python tasks.py delete 2     # Delete task 2
\`\`\`

## Challenge Extensions

1. Add due dates
2. Add priorities
3. Add categories/tags
4. Add search functionality
5. Add recurring tasks
6. Export to CSV
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚀 Python Bootcamp</h2>
<div id="demo"></div>
<script>
let html = "<h3>Capstone Project: Task Manager</h3>";

html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<h4>Core Features</h4>";
html += "<ul>";
html += "<li>✅ Add tasks</li>";
html += "<li>✅ List all tasks</li>";
html += "<li>✅ Mark complete</li>";
html += "<li>✅ Delete tasks</li>";
html += "<li>✅ Save/Load JSON</li>";
html += "</ul></div>";

html += "<h3>Challenge Extensions</h3>";
html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:10px;'>";
const challenges = ["Due dates", "Priorities", "Categories", "Search", "Recurring tasks", "CSV export"];
challenges.forEach(c => {
  html += "<div style='background:#fff3e0;padding:10px;border-radius:8px;'>🎯 " + c + "</div>";
});
html += "</div>";

html += "<h3 style='margin-top:20px;'>Skills Applied</h3>";
html += "<p>Classes, File I/O, JSON, CLI args, DateTime, List operations</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // More Visualization
    'subplots': {
      title: 'Subplots & Layouts',
      content: `# Subplots & Layouts 📐

Create multiple plots in one figure!

## Basic Subplots

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Create 2x2 grid
fig, axes = plt.subplots(2, 2, figsize=(10, 8))

# Plot in each subplot
axes[0, 0].plot([1, 2, 3], [1, 2, 3])
axes[0, 0].set_title('Plot 1')

axes[0, 1].scatter([1, 2, 3], [3, 1, 2])
axes[0, 1].set_title('Plot 2')

axes[1, 0].bar(['A', 'B', 'C'], [3, 7, 5])
axes[1, 0].set_title('Plot 3')

axes[1, 1].hist(np.random.randn(100))
axes[1, 1].set_title('Plot 4')

plt.tight_layout()
plt.show()
\`\`\`

## Sharing Axes

\`\`\`python
fig, axes = plt.subplots(2, 2, sharex=True, sharey=True)
# All subplots share the same x and y axis scales
\`\`\`

## Different Sizes with GridSpec

\`\`\`python
import matplotlib.gridspec as gridspec

fig = plt.figure(figsize=(12, 8))
gs = gridspec.GridSpec(2, 3)

ax1 = fig.add_subplot(gs[0, :])  # Top row, all columns
ax2 = fig.add_subplot(gs[1, 0])  # Bottom left
ax3 = fig.add_subplot(gs[1, 1:]) # Bottom right (2 columns)
\`\`\`

## Figure-level Titles

\`\`\`python
fig, axes = plt.subplots(2, 2)
fig.suptitle('Main Title', fontsize=16)
plt.tight_layout()
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📐 Subplots Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Subplot Grid Patterns</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "fig, axes = plt.subplots(2, 2)\\n\\n";
html += "axes[0, 0].plot(...)  # Top left\\n";
html += "axes[0, 1].plot(...)  # Top right\\n";
html += "axes[1, 0].plot(...)  # Bottom left\\n";
html += "axes[1, 1].plot(...)  # Bottom right</pre>";

html += "<h3>Common Patterns</h3>";
const patterns = [
  { code: "plt.subplots(1, 2)", desc: "2 plots side by side" },
  { code: "plt.subplots(2, 1)", desc: "2 plots stacked" },
  { code: "plt.subplots(2, 2)", desc: "2x2 grid" },
  { code: "plt.subplots(3, 3)", desc: "3x3 grid" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
patterns.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + p.code + "</code></td>";
  html += "<td style='padding:10px;'>" + p.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'enterprise-visuals': {
      title: 'Enterprise Reporting',
      content: `# Enterprise Reporting 📊

Production-ready charts for business!

## Professional Styling

\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

# Use a professional style
plt.style.use('seaborn-whitegrid')

# Create figure with specific size for reports
fig, ax = plt.subplots(figsize=(10, 6), dpi=100)

# Plot with professional colors
colors = ['#2ecc71', '#3498db', '#e74c3c', '#9b59b6']
ax.bar(['Q1', 'Q2', 'Q3', 'Q4'], [25, 32, 28, 35], color=colors)

# Add title and labels with proper formatting
ax.set_title('Quarterly Revenue 2024', fontsize=16, fontweight='bold')
ax.set_ylabel('Revenue (Million $)', fontsize=12)

# Add data labels
for i, v in enumerate([25, 32, 28, 35]):
    ax.text(i, v + 0.5, f'\${v}M', ha='center', fontsize=10)

# Clean up
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

plt.tight_layout()
plt.savefig('report.png', dpi=300, bbox_inches='tight')
\`\`\`

## Export Formats

\`\`\`python
# High-quality PNG for presentations
plt.savefig('chart.png', dpi=300, bbox_inches='tight')

# Vector format for printing
plt.savefig('chart.pdf', format='pdf')
plt.savefig('chart.svg', format='svg')

# Transparent background
plt.savefig('chart.png', transparent=True)
\`\`\`

## Adding Annotations

\`\`\`python
ax.annotate('Peak', xy=(2, 35), xytext=(3, 40),
            arrowprops=dict(arrowstyle='->', color='red'),
            fontsize=12)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Enterprise Reporting Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Export Formats</h3>";
const formats = [
  { format: "PNG (dpi=300)", use: "Presentations, web" },
  { format: "PDF", use: "Print, reports" },
  { format: "SVG", use: "Scalable web graphics" },
  { format: "EPS", use: "LaTeX documents" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Format</th><th>Best For</th></tr>";
formats.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + f.format + "</td>";
  html += "<td style='padding:10px;'>" + f.use + "</td></tr>";
});
html += "</table>";

html += "<h3>Pro Tips</h3>";
html += "<ul>";
html += "<li>Use <code>dpi=300</code> for print quality</li>";
html += "<li>Use <code>bbox_inches='tight'</code> to remove whitespace</li>";
html += "<li>Use <code>plt.style.use()</code> for consistent styling</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // MySQL
    'mysql-intro': {
      title: 'MySQL Introduction',
      content: `# MySQL + Python 🐬

Connect Python to MySQL databases!

## Install Connector

\`\`\`bash
pip install mysql-connector-python
\`\`\`

## Connect to Database

\`\`\`python
import mysql.connector

# Create connection
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="mydb"
)

# Create cursor
cursor = conn.cursor()

# Execute query
cursor.execute("SELECT * FROM users")

# Fetch results
results = cursor.fetchall()
for row in results:
    print(row)

# Close connection
cursor.close()
conn.close()
\`\`\`

## Using Context Manager

\`\`\`python
import mysql.connector
from contextlib import contextmanager

@contextmanager
def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="mydb"
    )
    try:
        yield conn
    finally:
        conn.close()

# Usage
with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    results = cursor.fetchall()
\`\`\`

## Connection Parameters

| Parameter | Description |
|-----------|-------------|
| host | Server address |
| user | Username |
| password | Password |
| database | Database name |
| port | Port (default 3306) |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🐬 MySQL Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Connection Flow</h3>";
html += "<div style='display:flex;align-items:center;gap:15px;'>";
const steps = ["Connect", "Cursor", "Execute", "Fetch", "Close"];
steps.forEach((s, i) => {
  html += "<div style='background:#3776AB;color:white;padding:10px 20px;border-radius:8px;'>" + s + "</div>";
  if (i < steps.length - 1) html += "<span>→</span>";
});
html += "</div>";

html += "<h3>Basic Pattern</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "import mysql.connector\\n\\n";
html += "conn = mysql.connector.connect(...)\\n";
html += "cursor = conn.cursor()\\n";
html += "cursor.execute('SELECT * FROM users')\\n";
html += "results = cursor.fetchall()\\n";
html += "conn.close()</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'mysql-crud': {
      title: 'MySQL CRUD',
      content: `# MySQL CRUD Operations 📝

Create, Read, Update, Delete!

## CREATE - Insert Data

\`\`\`python
cursor = conn.cursor()

# Insert one row
sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
values = ("Alice", "alice@email.com")
cursor.execute(sql, values)
conn.commit()

# Insert many rows
sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
values = [
    ("Bob", "bob@email.com"),
    ("Charlie", "charlie@email.com")
]
cursor.executemany(sql, values)
conn.commit()

print(f"Inserted {cursor.rowcount} rows")
\`\`\`

## READ - Select Data

\`\`\`python
# Select all
cursor.execute("SELECT * FROM users")
results = cursor.fetchall()

# Select with condition
cursor.execute("SELECT * FROM users WHERE age > %s", (25,))
results = cursor.fetchall()

# Fetch methods
cursor.fetchone()   # One row
cursor.fetchmany(5) # 5 rows
cursor.fetchall()   # All rows
\`\`\`

## UPDATE - Modify Data

\`\`\`python
sql = "UPDATE users SET email = %s WHERE name = %s"
values = ("newemail@email.com", "Alice")
cursor.execute(sql, values)
conn.commit()

print(f"Updated {cursor.rowcount} rows")
\`\`\`

## DELETE - Remove Data

\`\`\`python
sql = "DELETE FROM users WHERE name = %s"
values = ("Alice",)
cursor.execute(sql, values)
conn.commit()

print(f"Deleted {cursor.rowcount} rows")
\`\`\`

## Always Use Parameterized Queries!

\`\`\`python
# ❌ NEVER do this (SQL injection risk!)
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# ✅ Always use parameters
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📝 MySQL CRUD Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>CRUD Operations</h3>";
const ops = [
  { op: "CREATE", sql: "INSERT INTO users (name) VALUES (%s)", color: "#4caf50" },
  { op: "READ", sql: "SELECT * FROM users WHERE id = %s", color: "#2196f3" },
  { op: "UPDATE", sql: "UPDATE users SET name = %s WHERE id = %s", color: "#ff9800" },
  { op: "DELETE", sql: "DELETE FROM users WHERE id = %s", color: "#f44336" }
];

html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:15px;'>";
ops.forEach(o => {
  html += "<div style='background:" + o.color + ";color:white;padding:15px;border-radius:8px;'>";
  html += "<h4 style='margin:0;'>" + o.op + "</h4>";
  html += "<code style='font-size:11px;'>" + o.sql + "</code></div>";
});
html += "</div>";

html += "<h3 style='margin-top:20px;'>⚠️ Security Warning</h3>";
html += "<p style='background:#ffebee;padding:15px;border-radius:8px;'>";
html += "<b>NEVER</b> use f-strings or string concatenation with SQL!<br>";
html += "Always use <code>%s</code> parameters to prevent SQL injection.</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // MongoDB
    'mongo-intro': {
      title: 'MongoDB Introduction',
      content: `# MongoDB + Python 🍃

Connect Python to MongoDB!

## Install PyMongo

\`\`\`bash
pip install pymongo
\`\`\`

## Connect to MongoDB

\`\`\`python
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")

# Access database
db = client["mydb"]

# Access collection
collection = db["users"]
\`\`\`

## MongoDB Concepts

| SQL | MongoDB |
|-----|---------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |

## Insert Document

\`\`\`python
# Insert one
user = {"name": "Alice", "age": 25, "city": "NYC"}
result = collection.insert_one(user)
print(f"Inserted ID: {result.inserted_id}")

# Insert many
users = [
    {"name": "Bob", "age": 30},
    {"name": "Charlie", "age": 35}
]
result = collection.insert_many(users)
\`\`\`

## Find Documents

\`\`\`python
# Find one
user = collection.find_one({"name": "Alice"})

# Find all
for user in collection.find():
    print(user)

# Find with filter
for user in collection.find({"age": {"$gt": 25}}):
    print(user)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🍃 MongoDB Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>SQL vs MongoDB Terms</h3>";
const terms = [
  { sql: "Database", mongo: "Database" },
  { sql: "Table", mongo: "Collection" },
  { sql: "Row", mongo: "Document" },
  { sql: "Column", mongo: "Field" },
  { sql: "Index", mongo: "Index" },
  { sql: "JOIN", mongo: "$lookup" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>SQL</th><th>MongoDB</th></tr>";
terms.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + t.sql + "</td>";
  html += "<td style='padding:10px;'>" + t.mongo + "</td></tr>";
});
html += "</table>";

html += "<h3>Document Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "{\\n";
html += '  "_id": ObjectId("..."),\\n';
html += '  "name": "Alice",\\n';
html += '  "age": 25,\\n';
html += '  "hobbies": ["reading", "coding"]\\n';
html += "}</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'mongo-crud': {
      title: 'MongoDB CRUD',
      content: `# MongoDB CRUD Operations 📝

Create, Read, Update, Delete with PyMongo!

## CREATE - Insert

\`\`\`python
# Insert one
doc = {"name": "Alice", "age": 25}
result = collection.insert_one(doc)
print(result.inserted_id)

# Insert many
docs = [{"name": "Bob"}, {"name": "Charlie"}]
result = collection.insert_many(docs)
print(result.inserted_ids)
\`\`\`

## READ - Find

\`\`\`python
# Find one
user = collection.find_one({"name": "Alice"})

# Find all
for doc in collection.find():
    print(doc)

# Find with filter
collection.find({"age": {"$gt": 25}})   # age > 25
collection.find({"age": {"$gte": 25}})  # age >= 25
collection.find({"age": {"$in": [25, 30]}})

# Projection (select fields)
collection.find({}, {"name": 1, "age": 1})

# Sort and limit
collection.find().sort("age", -1).limit(10)
\`\`\`

## UPDATE

\`\`\`python
# Update one
collection.update_one(
    {"name": "Alice"},
    {"$set": {"age": 26}}
)

# Update many
collection.update_many(
    {"city": "NYC"},
    {"$set": {"country": "USA"}}
)

# Increment
collection.update_one(
    {"name": "Alice"},
    {"$inc": {"age": 1}}
)
\`\`\`

## DELETE

\`\`\`python
# Delete one
collection.delete_one({"name": "Alice"})

# Delete many
collection.delete_many({"age": {"$lt": 18}})

# Delete all
collection.delete_many({})
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📝 MongoDB CRUD Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Query Operators</h3>";
const ops = [
  { op: "$gt", desc: "Greater than" },
  { op: "$gte", desc: "Greater than or equal" },
  { op: "$lt", desc: "Less than" },
  { op: "$lte", desc: "Less than or equal" },
  { op: "$in", desc: "In array" },
  { op: "$ne", desc: "Not equal" },
  { op: "$exists", desc: "Field exists" },
  { op: "$regex", desc: "Pattern match" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#4caf50;color:white;'>";
html += "<th>Operator</th><th>Description</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + o.op + "</code></td>";
  html += "<td style='padding:10px;'>" + o.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Django
    'django-intro': {
      title: 'Django Introduction',
      content: `# Django Framework 🎸

The web framework for perfectionists with deadlines!

## What is Django?

- Full-stack Python web framework
- "Batteries included" - everything you need
- MVT architecture (Model-View-Template)
- Admin interface out of the box
- ORM for database operations

## Install Django

\`\`\`bash
pip install django
\`\`\`

## Create Project

\`\`\`bash
django-admin startproject myproject
cd myproject
python manage.py runserver
\`\`\`

## Project Structure

\`\`\`
myproject/
├── manage.py           # CLI tool
├── myproject/
│   ├── __init__.py
│   ├── settings.py     # Configuration
│   ├── urls.py         # URL routing
│   ├── asgi.py
│   └── wsgi.py
\`\`\`

## Create App

\`\`\`bash
python manage.py startapp myapp
\`\`\`

## MVT Pattern

| Component | Purpose |
|-----------|---------|
| Model | Database structure |
| View | Business logic |
| Template | HTML presentation |

## First View

\`\`\`python
# myapp/views.py
from django.http import HttpResponse

def hello(request):
    return HttpResponse("Hello, Django!")

# myproject/urls.py
from myapp.views import hello

urlpatterns = [
    path('hello/', hello),
]
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎸 Django Introduction Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Django MVT Pattern</h3>";
html += "<div style='display:flex;justify-content:center;gap:30px;margin:20px 0;'>";
const mvt = [
  { name: "Model", desc: "Data & Database", color: "#4caf50" },
  { name: "View", desc: "Logic & Processing", color: "#2196f3" },
  { name: "Template", desc: "HTML & Display", color: "#ff9800" }
];
mvt.forEach(m => {
  html += "<div style='background:" + m.color + ";color:white;padding:20px;border-radius:8px;text-align:center;'>";
  html += "<h4>" + m.name + "</h4>";
  html += "<p>" + m.desc + "</p></div>";
});
html += "</div>";

html += "<h3>Quick Start Commands</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "pip install django\\n";
html += "django-admin startproject mysite\\n";
html += "cd mysite\\n";
html += "python manage.py runserver</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'django-models': {
      title: 'Django Models',
      content: `# Django Models 🗄️

Define your database with Python classes!

## Basic Model

\`\`\`python
# models.py
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    age = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
\`\`\`

## Field Types

\`\`\`python
# Common fields
CharField(max_length=255)   # Short text
TextField()                  # Long text
IntegerField()              # Integer
FloatField()                # Decimal
BooleanField(default=False)
DateField()
DateTimeField()
EmailField()
URLField()
FileField(upload_to='files/')
ImageField(upload_to='images/')
\`\`\`

## Relationships

\`\`\`python
class Author(models.Model):
    name = models.CharField(max_length=100)

class Book(models.Model):
    title = models.CharField(max_length=200)
    # ForeignKey = Many-to-One
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    
class Tag(models.Model):
    name = models.CharField(max_length=50)
    # ManyToMany
    books = models.ManyToManyField(Book)
\`\`\`

## Migrations

\`\`\`bash
python manage.py makemigrations
python manage.py migrate
\`\`\`

## Querying

\`\`\`python
# Create
user = User.objects.create(name="Alice", email="a@b.com")

# Read
users = User.objects.all()
user = User.objects.get(id=1)
users = User.objects.filter(age__gte=25)

# Update
User.objects.filter(id=1).update(name="Bob")

# Delete
User.objects.filter(id=1).delete()
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🗄️ Django Models Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Common Field Types</h3>";
const fields = [
  { type: "CharField", use: "Short text (max 255)" },
  { type: "TextField", use: "Long text" },
  { type: "IntegerField", use: "Numbers" },
  { type: "BooleanField", use: "True/False" },
  { type: "DateTimeField", use: "Date + Time" },
  { type: "ForeignKey", use: "Many-to-One relation" },
  { type: "ManyToManyField", use: "Many-to-Many" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#092e20;color:white;'>";
html += "<th>Field Type</th><th>Use Case</th></tr>";
fields.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + f.type + "</code></td>";
  html += "<td style='padding:10px;'>" + f.use + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // ML Advanced
    'ml-poly': {
      title: 'Polynomial Regression',
      content: `# Polynomial Regression 📈

Fit curves, not just lines!

## When to Use

Linear regression fits a line, but what if your data is curved?

\`\`\`python
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Original data
X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([1, 4, 9, 16, 25])  # y = x²

# Create polynomial features (degree 2)
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)
# X_poly now has: [1, x, x²]

# Fit linear regression on polynomial features
model = LinearRegression()
model.fit(X_poly, y)

# Predict
X_new = np.array([[6]])
X_new_poly = poly.transform(X_new)
prediction = model.predict(X_new_poly)  # 36
\`\`\`

## Choosing Degree

\`\`\`python
# Too low = underfitting
# Too high = overfitting

# Use cross-validation to find best degree
from sklearn.model_selection import cross_val_score

for degree in range(1, 10):
    poly = PolynomialFeatures(degree=degree)
    X_poly = poly.fit_transform(X)
    scores = cross_val_score(LinearRegression(), X_poly, y, cv=5)
    print(f"Degree {degree}: {scores.mean():.3f}")
\`\`\`

## Key Points

- Degree 1 = Linear
- Degree 2 = Quadratic (parabola)
- Degree 3 = Cubic
- Higher degrees = more flexibility but risk overfitting
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📈 Polynomial Regression Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Polynomial Degrees</h3>";
html += "<div style='display:grid;grid-template-columns:repeat(3,1fr);gap:15px;'>";
const degrees = [
  { deg: 1, name: "Linear", shape: "Straight line" },
  { deg: 2, name: "Quadratic", shape: "Parabola" },
  { deg: 3, name: "Cubic", shape: "S-curve" }
];
degrees.forEach(d => {
  html += "<div style='background:#e8f5e9;padding:15px;border-radius:8px;text-align:center;'>";
  html += "<h4>Degree " + d.deg + "</h4>";
  html += "<p>" + d.name + "</p>";
  html += "<small>" + d.shape + "</small></div>";
});
html += "</div>";

html += "<h3>Overfitting Warning</h3>";
html += "<p style='background:#fff3e0;padding:15px;border-radius:8px;'>";
html += "⚠️ Higher degree = more flexible but risks <b>overfitting</b>!<br>";
html += "Use cross-validation to find the right degree.</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-logistic': {
      title: 'Logistic Regression',
      content: `# Logistic Regression 📊

Classification, not regression!

## Binary Classification

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

# Data: predict if email is spam
X = [[...features...]]
y = [0, 1, 0, 1, ...]  # 0=not spam, 1=spam

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predict class
predictions = model.predict(X_test)

# Predict probability
probabilities = model.predict_proba(X_test)
\`\`\`

## How It Works

1. Calculates weighted sum of features
2. Passes through sigmoid function
3. Output: probability between 0 and 1
4. Threshold (usually 0.5) determines class

## Evaluation

\`\`\`python
from sklearn.metrics import accuracy_score, classification_report

accuracy = accuracy_score(y_test, predictions)
print(classification_report(y_test, predictions))
\`\`\`

## Multi-class Classification

\`\`\`python
# Works with multiple classes automatically
model = LogisticRegression(multi_class='multinomial')
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Logistic Regression Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Linear vs Logistic</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e3f2fd;padding:15px;border-radius:8px;'>";
html += "<h4>Linear Regression</h4>";
html += "<p>Predicts <b>continuous</b> values</p>";
html += "<p>Output: Any number</p>";
html += "<p>Example: Price, Age</p></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<h4>Logistic Regression</h4>";
html += "<p>Predicts <b>categories</b></p>";
html += "<p>Output: Probability (0-1)</p>";
html += "<p>Example: Spam/Not Spam</p></div>";
html += "</div>";

html += "<h3>Sigmoid Function</h3>";
html += "<p>Converts any number to probability between 0 and 1</p>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "σ(x) = 1 / (1 + e^(-x))\\n\\n";
html += "x = -∞  →  σ(x) = 0\\n";
html += "x = 0   →  σ(x) = 0.5\\n";
html += "x = +∞  →  σ(x) = 1</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-knn': {
      title: 'K-Nearest Neighbors',
      content: `# K-Nearest Neighbors 👥

Predict based on nearest neighbors!

## How KNN Works

1. Choose K (number of neighbors)
2. Find K closest points to new data
3. Majority vote for classification
4. Average for regression

\`\`\`python
from sklearn.neighbors import KNeighborsClassifier

# Create and train
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)

# Predict
predictions = knn.predict(X_test)

# Accuracy
accuracy = knn.score(X_test, y_test)
\`\`\`

## Choosing K

\`\`\`python
# Test different K values
for k in range(1, 21, 2):
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train, y_train)
    score = knn.score(X_test, y_test)
    print(f"K={k}: {score:.3f}")

# K too small = overfitting
# K too large = underfitting
\`\`\`

## Distance Metrics

\`\`\`python
# Euclidean (default)
knn = KNeighborsClassifier(metric='euclidean')

# Manhattan
knn = KNeighborsClassifier(metric='manhattan')

# Minkowski
knn = KNeighborsClassifier(metric='minkowski', p=3)
\`\`\`

## Pros and Cons

| Pros | Cons |
|------|------|
| Simple to understand | Slow on large data |
| No training needed | Sensitive to scale |
| Works for multi-class | Memory intensive |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>👥 KNN Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>How KNN Works</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;'>";
html += "<p>New point: ⭐</p>";
html += "<p>Find K=3 nearest neighbors</p>";
html += "<p>🔵🔵🔴 → Majority is 🔵</p>";
html += "<p>Prediction: 🔵</p></div>";

html += "<h3>Choosing K</h3>";
html += "<ul>";
html += "<li>K too small (1-3): Overfitting, noisy</li>";
html += "<li>K too large: Underfitting, ignores local patterns</li>";
html += "<li>Use odd K for binary classification</li>";
html += "<li>Try sqrt(n) as starting point</li>";
html += "</ul>";

html += "<h3>⚠️ Important: Scale Your Data!</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "from sklearn.preprocessing import StandardScaler\\n\\n";
html += "scaler = StandardScaler()\\n";
html += "X_scaled = scaler.fit_transform(X)</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-trees': {
      title: 'Decision Trees',
      content: `# Decision Trees 🌳

Make decisions by asking questions!

## How It Works

\`\`\`
Is age > 30?
├── Yes: Is income > 50k?
│   ├── Yes: Approve ✅
│   └── No: Deny ❌
└── No: Is employed?
    ├── Yes: Approve ✅
    └── No: Deny ❌
\`\`\`

## Implementation

\`\`\`python
from sklearn.tree import DecisionTreeClassifier

# Create and train
tree = DecisionTreeClassifier(max_depth=5, random_state=42)
tree.fit(X_train, y_train)

# Predict
predictions = tree.predict(X_test)

# Feature importance
importances = tree.feature_importances_
for name, imp in zip(feature_names, importances):
    print(f"{name}: {imp:.3f}")
\`\`\`

## Hyperparameters

\`\`\`python
tree = DecisionTreeClassifier(
    max_depth=5,          # Limit tree depth
    min_samples_split=10, # Min samples to split
    min_samples_leaf=5,   # Min samples in leaf
    max_features='sqrt'   # Features to consider
)
\`\`\`

## Visualize Tree

\`\`\`python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

plt.figure(figsize=(20, 10))
plot_tree(tree, feature_names=feature_names, 
          class_names=class_names, filled=True)
plt.show()
\`\`\`

## Pros and Cons

| Pros | Cons |
|------|------|
| Easy to interpret | Overfits easily |
| No scaling needed | Unstable |
| Handles mixed types | Biased to dominant class |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🌳 Decision Trees Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Decision Tree Example</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;font-family:monospace;'>";
html += "Is age > 30?<br>";
html += "├── Yes: Is income > 50k?<br>";
html += "│   ├── Yes: ✅ Approve<br>";
html += "│   └── No: ❌ Deny<br>";
html += "└── No: Is employed?<br>";
html += "    ├── Yes: ✅ Approve<br>";
html += "    └── No: ❌ Deny</div>";

html += "<h3>Key Parameters</h3>";
const params = [
  { param: "max_depth", desc: "Limit tree depth to prevent overfitting" },
  { param: "min_samples_split", desc: "Minimum samples needed to split" },
  { param: "min_samples_leaf", desc: "Minimum samples in leaf node" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
params.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + p.param + "</code></td>";
  html += "<td style='padding:10px;'>" + p.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-kmeans': {
      title: 'K-Means Clustering',
      content: `# K-Means Clustering 🎯

Group similar data points!

## How It Works

1. Choose K clusters
2. Initialize K random centroids
3. Assign points to nearest centroid
4. Recalculate centroids
5. Repeat until stable

\`\`\`python
from sklearn.cluster import KMeans

# Create and fit
kmeans = KMeans(n_clusters=3, random_state=42)
kmeans.fit(X)

# Get cluster labels
labels = kmeans.labels_

# Get centroids
centroids = kmeans.cluster_centers_

# Predict new data
new_labels = kmeans.predict(X_new)
\`\`\`

## Finding Optimal K (Elbow Method)

\`\`\`python
inertias = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(range(1, 11), inertias, 'bo-')
plt.xlabel('K')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()
# Look for the "elbow" point
\`\`\`

## Silhouette Score

\`\`\`python
from sklearn.metrics import silhouette_score

score = silhouette_score(X, labels)
# Closer to 1 = better clustering
\`\`\`

## Use Cases

- Customer segmentation
- Image compression
- Anomaly detection
- Document clustering
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎯 K-Means Clustering Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>K-Means Algorithm</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<ol>";
html += "<li>Choose K (number of clusters)</li>";
html += "<li>Place K random centroids</li>";
html += "<li>Assign each point to nearest centroid</li>";
html += "<li>Move centroids to cluster center</li>";
html += "<li>Repeat steps 3-4 until stable</li>";
html += "</ol></div>";

html += "<h3>Elbow Method</h3>";
html += "<p>Plot inertia vs K and look for the 'elbow' where adding more clusters doesn't help much.</p>";

html += "<h3>Common Use Cases</h3>";
const uses = ["Customer Segmentation", "Image Compression", "Anomaly Detection", "Document Clustering"];
html += "<div style='display:flex;flex-wrap:wrap;gap:10px;'>";
uses.forEach(u => {
  html += "<span style='background:#3776AB;color:white;padding:8px 15px;border-radius:20px;'>" + u + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Reference
    'ref-string': {
      title: 'String Methods',
      content: `# Python String Methods 📝

Quick reference for string operations!

## Case Methods
\`\`\`python
s = "Hello World"
s.upper()      # "HELLO WORLD"
s.lower()      # "hello world"
s.title()      # "Hello World"
s.capitalize() # "Hello world"
s.swapcase()   # "hELLO wORLD"
\`\`\`

## Search Methods
\`\`\`python
s = "Hello World"
s.find("World")     # 6 (-1 if not found)
s.index("World")    # 6 (error if not found)
s.count("l")        # 3
s.startswith("He")  # True
s.endswith("ld")    # True
"World" in s        # True
\`\`\`

## Modify Methods
\`\`\`python
s = "  Hello World  "
s.strip()           # "Hello World"
s.lstrip()          # "Hello World  "
s.rstrip()          # "  Hello World"
s.replace("o", "0") # "Hell0 W0rld"
\`\`\`

## Split/Join
\`\`\`python
"a,b,c".split(",")  # ["a", "b", "c"]
" ".join(["a", "b"]) # "a b"
"Hello\\nWorld".splitlines() # ["Hello", "World"]
\`\`\`

## Check Methods
\`\`\`python
"123".isdigit()     # True
"abc".isalpha()     # True
"abc123".isalnum()  # True
"   ".isspace()     # True
"Hello".isupper()   # False
\`\`\`

## Format
\`\`\`python
"{} {}".format("Hello", "World")
f"Value: {value}"
"Hello".center(20)
"5".zfill(3)  # "005"
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📝 String Methods Reference</h2>
<div id="demo"></div>
<script>
let html = "<h3>Most Used Methods</h3>";
const methods = [
  { m: ".upper() / .lower()", desc: "Change case" },
  { m: ".strip()", desc: "Remove whitespace" },
  { m: ".split()", desc: "String to list" },
  { m: ".join()", desc: "List to string" },
  { m: ".replace()", desc: "Replace substring" },
  { m: ".find()", desc: "Find index" },
  { m: ".startswith() / .endswith()", desc: "Check prefix/suffix" },
  { m: ".format() / f-string", desc: "String formatting" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Method</th><th>Description</th></tr>";
methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + m.m + "</code></td>";
  html += "<td style='padding:10px;'>" + m.desc + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ref-list': {
      title: 'List Methods',
      content: `# Python List Methods 📋

Quick reference for list operations!

## Add Elements
\`\`\`python
lst = [1, 2, 3]
lst.append(4)        # [1, 2, 3, 4]
lst.insert(0, 0)     # [0, 1, 2, 3, 4]
lst.extend([5, 6])   # [0, 1, 2, 3, 4, 5, 6]
\`\`\`

## Remove Elements
\`\`\`python
lst = [1, 2, 3, 2, 4]
lst.remove(2)        # [1, 3, 2, 4] (first 2)
lst.pop()            # [1, 3, 2] returns 4
lst.pop(0)           # [3, 2] returns 1
lst.clear()          # []
\`\`\`

## Search & Count
\`\`\`python
lst = [1, 2, 3, 2, 4]
lst.index(2)         # 1 (first occurrence)
lst.count(2)         # 2
2 in lst             # True
\`\`\`

## Sort & Reverse
\`\`\`python
lst = [3, 1, 4, 1, 5]
lst.sort()           # [1, 1, 3, 4, 5] in-place
lst.sort(reverse=True) # [5, 4, 3, 1, 1]
lst.reverse()        # Reverses in-place
sorted(lst)          # Returns new sorted list
\`\`\`

## Copy
\`\`\`python
lst = [1, [2, 3]]
lst.copy()           # Shallow copy
import copy
copy.deepcopy(lst)   # Deep copy
\`\`\`

## Other
\`\`\`python
len(lst)             # Length
min(lst), max(lst)   # Min/Max
sum(lst)             # Sum
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📋 List Methods Reference</h2>
<div id="demo"></div>
<script>
let html = "<h3>List Operations</h3>";
const ops = [
  { cat: "Add", methods: "append(), insert(), extend()" },
  { cat: "Remove", methods: "remove(), pop(), clear()" },
  { cat: "Search", methods: "index(), count(), in" },
  { cat: "Order", methods: "sort(), reverse(), sorted()" },
  { cat: "Copy", methods: "copy(), list(), deepcopy()" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Category</th><th>Methods</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + o.cat + "</b></td>";
  html += "<td style='padding:10px;'><code>" + o.methods + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ref-dict': {
      title: 'Dict Methods',
      content: `# Python Dict Methods 📚

Quick reference for dictionary operations!

## Access
\`\`\`python
d = {"a": 1, "b": 2}
d["a"]               # 1 (error if missing)
d.get("a")           # 1 (None if missing)
d.get("c", 0)        # 0 (default if missing)
\`\`\`

## Add/Update
\`\`\`python
d = {"a": 1}
d["b"] = 2           # {"a": 1, "b": 2}
d.update({"c": 3})   # {"a": 1, "b": 2, "c": 3}
d.setdefault("d", 4) # Set if missing
\`\`\`

## Remove
\`\`\`python
d = {"a": 1, "b": 2, "c": 3}
d.pop("a")           # Returns 1, removes "a"
d.popitem()          # Removes last item
del d["b"]           # Remove by key
d.clear()            # Empty dict
\`\`\`

## Iterate
\`\`\`python
d = {"a": 1, "b": 2}
d.keys()             # dict_keys(['a', 'b'])
d.values()           # dict_values([1, 2])
d.items()            # dict_items([('a', 1), ('b', 2)])

for key in d:
    print(key)
for key, value in d.items():
    print(key, value)
\`\`\`

## Copy
\`\`\`python
d.copy()             # Shallow copy
dict(d)              # Another shallow copy
import copy
copy.deepcopy(d)     # Deep copy
\`\`\`

## Other
\`\`\`python
len(d)               # Number of keys
"key" in d           # Check if key exists
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📚 Dict Methods Reference</h2>
<div id="demo"></div>
<script>
let html = "<h3>Dictionary Operations</h3>";
const ops = [
  { cat: "Access", methods: "d['key'], get(), setdefault()" },
  { cat: "Modify", methods: "d['key']=val, update()" },
  { cat: "Remove", methods: "pop(), popitem(), del, clear()" },
  { cat: "Iterate", methods: "keys(), values(), items()" },
  { cat: "Copy", methods: "copy(), dict(), deepcopy()" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Category</th><th>Methods</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + o.cat + "</b></td>";
  html += "<td style='padding:10px;'><code>" + o.methods + "</code></td></tr>";
});
html += "</table>";

html += "<h3>Safe Access Pattern</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "# Don't do this (may error)\\n";
html += "value = d['key']\\n\\n";
html += "# Do this instead\\n";
html += "value = d.get('key', default_value)</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ref-keywords': {
      title: 'Python Keywords',
      content: `# Python Keywords 🔑

Reserved words you cannot use as variable names!

## Control Flow
\`\`\`python
if, elif, else      # Conditionals
for, while          # Loops
break, continue     # Loop control
pass                # Do nothing
\`\`\`

## Boolean
\`\`\`python
True, False         # Boolean values
and, or, not        # Boolean operators
is, is not          # Identity operators
in, not in          # Membership operators
\`\`\`

## Functions/Classes
\`\`\`python
def                 # Define function
return              # Return from function
lambda              # Anonymous function
class               # Define class
\`\`\`

## Exception Handling
\`\`\`python
try, except         # Handle exceptions
finally             # Always execute
raise               # Raise exception
assert              # Debugging assertions
\`\`\`

## Variables
\`\`\`python
global              # Global variable
nonlocal            # Enclosing scope variable
None                # Null value
\`\`\`

## Import
\`\`\`python
import              # Import module
from                # Import from module
as                  # Alias
\`\`\`

## Other
\`\`\`python
with                # Context manager
yield               # Generator
async, await        # Async programming
del                 # Delete
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔑 Python Keywords Reference</h2>
<div id="demo"></div>
<script>
let html = "<h3>All 35 Python Keywords</h3>";
const keywords = [
  "False", "None", "True", "and", "as", "assert", "async",
  "await", "break", "class", "continue", "def", "del", "elif",
  "else", "except", "finally", "for", "from", "global", "if",
  "import", "in", "is", "lambda", "nonlocal", "not", "or",
  "pass", "raise", "return", "try", "while", "with", "yield"
];

html += "<div style='display:flex;flex-wrap:wrap;gap:8px;'>";
keywords.forEach(k => {
  html += "<span style='background:#3776AB;color:white;padding:5px 12px;border-radius:4px;font-family:monospace;'>" + k + "</span>";
});
html += "</div>";

html += "<h3 style='margin-top:20px;'>Check Keywords</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "import keyword\\n\\n";
html += "print(keyword.kwlist)  # All keywords\\n";
html += "keyword.iskeyword('if')  # True</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'quiz': {
      title: 'Python Quiz',
      content: `# Python Quiz 📝

Test your Python knowledge!

## Quiz Instructions

- Answer all questions
- Score 80%+ to pass
- Review incorrect answers

## Sample Questions

### Q1: What is the output?
\`\`\`python
x = [1, 2, 3]
y = x
y.append(4)
print(x)
\`\`\`
A) [1, 2, 3]
B) [1, 2, 3, 4]
C) Error

**Answer: B** - Lists are mutable and y references the same list as x.

### Q2: Which is immutable?
A) List
B) Dictionary
C) Tuple
D) Set

**Answer: C** - Tuples are immutable.

### Q3: What does \`*args\` do?
A) Required arguments
B) Keyword arguments
C) Variable positional arguments
D) Default arguments

**Answer: C**

### Q4: Output of \`bool([])\`?
A) True
B) False
C) Error

**Answer: B** - Empty containers are falsy.

### Q5: How to copy a list?
\`\`\`python
original = [1, 2, 3]
# Which creates a copy?
\`\`\`
A) \`copy = original\`
B) \`copy = original[:]\`
C) Both

**Answer: B** - Assignment creates a reference, slicing creates a copy.

## Take the Full Quiz

Click "Start Quiz" below to begin the comprehensive assessment!
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📝 Python Quiz</h2>
<div id="demo"></div>
<script>
let html = "<h3>Sample Questions</h3>";

const questions = [
  { q: "What is the output of print(type([]))?", a: "<class 'list'>" },
  { q: "Is Python case-sensitive?", a: "Yes" },
  { q: "What does len() return for 'hello'?", a: "5" },
  { q: "Which keyword defines a function?", a: "def" },
  { q: "What is 10 // 3?", a: "3 (floor division)" }
];

html += "<div style='display:flex;flex-direction:column;gap:10px;'>";
questions.forEach((q, i) => {
  html += "<div style='background:#f8f9fa;padding:15px;border-radius:8px;'>";
  html += "<p><b>Q" + (i+1) + ":</b> " + q.q + "</p>";
  html += "<p style='color:#4caf50;'>Answer: " + q.a + "</p></div>";
});
html += "</div>";

html += "<div style='text-align:center;margin-top:20px;'>";
html += "<button style='background:#3776AB;color:white;padding:15px 30px;border:none;border-radius:8px;font-size:18px;cursor:pointer;'>";
html += "Start Full Quiz</button></div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // More ML lessons
    'ml-distribution': {
      title: 'Data Distribution',
      content: `# Data Distribution 📊

Understand how your data is shaped!

## Normal Distribution (Gaussian)

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Generate normal data
data = np.random.normal(loc=0, scale=1, size=1000)
# loc = mean, scale = std deviation

plt.hist(data, bins=30, density=True)
plt.title('Normal Distribution')
plt.show()
\`\`\`

## Key Properties

- Bell-shaped curve
- Symmetric around mean
- 68% within 1 std dev
- 95% within 2 std devs
- 99.7% within 3 std devs

## Check Normality

\`\`\`python
from scipy import stats

# Shapiro-Wilk test
stat, p_value = stats.shapiro(data)
if p_value > 0.05:
    print("Data is normally distributed")
\`\`\`

## Other Distributions

\`\`\`python
# Uniform - equal probability
np.random.uniform(0, 10, 1000)

# Binomial - success/failure
np.random.binomial(n=10, p=0.5, size=1000)

# Poisson - count events
np.random.poisson(lam=5, size=1000)

# Exponential - time between events
np.random.exponential(scale=1, size=1000)
\`\`\`

## Why It Matters

- Many ML algorithms assume normal distribution
- Helps choose the right algorithm
- Guides data preprocessing
- Affects model performance
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📊 Data Distribution Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Common Distributions</h3>";
const dists = [
  { name: "Normal", shape: "Bell curve", use: "Natural phenomena" },
  { name: "Uniform", shape: "Flat", use: "Random selection" },
  { name: "Binomial", shape: "Discrete peaks", use: "Success/failure" },
  { name: "Poisson", shape: "Right-skewed", use: "Count events" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Distribution</th><th>Shape</th><th>Use Case</th></tr>";
dists.forEach((d, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + d.name + "</td>";
  html += "<td style='padding:10px;'>" + d.shape + "</td>";
  html += "<td style='padding:10px;'>" + d.use + "</td></tr>";
});
html += "</table>";

html += "<h3>68-95-99.7 Rule</h3>";
html += "<p>For normal distribution:</p>";
html += "<ul>";
html += "<li>68% of data within ±1σ</li>";
html += "<li>95% of data within ±2σ</li>";
html += "<li>99.7% of data within ±3σ</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-multiple': {
      title: 'Multiple Regression',
      content: `# Multiple Regression 📈

Predict using multiple features!

## Single vs Multiple

\`\`\`python
# Single: y = mx + b
# Multiple: y = b0 + b1*x1 + b2*x2 + ... + bn*xn
\`\`\`

## Implementation

\`\`\`python
from sklearn.linear_model import LinearRegression
import pandas as pd

# Multiple features
df = pd.DataFrame({
    'sqft': [1000, 1500, 2000, 2500],
    'bedrooms': [2, 3, 3, 4],
    'age': [10, 5, 15, 8],
    'price': [200000, 300000, 280000, 400000]
})

X = df[['sqft', 'bedrooms', 'age']]
y = df['price']

# Train model
model = LinearRegression()
model.fit(X, y)

# Coefficients
print("Intercept:", model.intercept_)
print("Coefficients:", model.coef_)
# [price_per_sqft, price_per_bedroom, price_per_year]

# Predict
new_house = [[1800, 3, 12]]
predicted_price = model.predict(new_house)
\`\`\`

## Feature Importance

\`\`\`python
# Standardize to compare coefficients
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model.fit(X_scaled, y)
# Now coefficients are comparable
\`\`\`

## R² Score

\`\`\`python
score = model.score(X, y)
# 0 to 1, higher is better
# Adjusted R² accounts for number of features
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📈 Multiple Regression Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Single vs Multiple</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e3f2fd;padding:15px;border-radius:8px;'>";
html += "<h4>Simple</h4>";
html += "<p>y = mx + b</p>";
html += "<p>One feature predicts y</p></div>";

html += "<div style='flex:1;background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<h4>Multiple</h4>";
html += "<p>y = b₀ + b₁x₁ + b₂x₂ + ...</p>";
html += "<p>Many features predict y</p></div>";
html += "</div>";

html += "<h3>House Price Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "price = 50000 +\\n";
html += "        150 × sqft +\\n";
html += "        10000 × bedrooms +\\n";
html += "        -2000 × age</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-split': {
      title: 'Train/Test Split',
      content: `# Train/Test Split ✂️

Never test on training data!

## Why Split?

- Training data: Model learns patterns
- Test data: Evaluate on unseen data
- Prevents overfitting detection

## Basic Split

\`\`\`python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,      # 20% for testing
    random_state=42     # Reproducibility
)

print(f"Train: {len(X_train)}, Test: {len(X_test)}")
\`\`\`

## Stratified Split (Classification)

\`\`\`python
# Maintains class proportions
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    stratify=y,         # Maintain class balance
    random_state=42
)
\`\`\`

## Train/Validation/Test

\`\`\`python
# First split: train+val vs test
X_temp, X_test, y_temp, y_test = train_test_split(
    X, y, test_size=0.2
)

# Second split: train vs validation
X_train, X_val, y_train, y_val = train_test_split(
    X_temp, y_temp, test_size=0.25  # 25% of 80% = 20%
)

# Result: 60% train, 20% val, 20% test
\`\`\`

## Common Ratios

| Split | Train | Test |
|-------|-------|------|
| 80/20 | 80% | 20% |
| 70/30 | 70% | 30% |
| 90/10 | 90% | 10% |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>✂️ Train/Test Split Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Why Split Data?</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<p>🎓 <b>Training:</b> Model learns from this data</p>";
html += "<p>🧪 <b>Testing:</b> Evaluate on unseen data</p>";
html += "<p>✅ Prevents overfitting!</p></div>";

html += "<h3>Common Split Ratios</h3>";
html += "<div style='display:flex;gap:15px;'>";
["80/20", "70/30", "60/20/20"].forEach(r => {
  html += "<div style='flex:1;background:#3776AB;color:white;padding:15px;text-align:center;border-radius:8px;'>";
  html += "<h4>" + r + "</h4></div>";
});
html += "</div>";

html += "<h3>Code Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "X_train, X_test, y_train, y_test = train_test_split(\\n";
html += "    X, y,\\n";
html += "    test_size=0.2,\\n";
html += "    random_state=42\\n";
html += ")</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-cv': {
      title: 'Cross Validation',
      content: `# Cross Validation 🔄

More robust model evaluation!

## K-Fold Cross Validation

\`\`\`python
from sklearn.model_selection import cross_val_score

# 5-fold CV
scores = cross_val_score(model, X, y, cv=5)
print(f"Scores: {scores}")
print(f"Mean: {scores.mean():.3f} (+/- {scores.std()*2:.3f})")
\`\`\`

## How It Works

1. Split data into K folds
2. Train on K-1 folds, test on 1 fold
3. Repeat K times
4. Average all scores

## K-Fold Implementation

\`\`\`python
from sklearn.model_selection import KFold

kf = KFold(n_splits=5, shuffle=True, random_state=42)

scores = []
for train_idx, test_idx in kf.split(X):
    X_train, X_test = X[train_idx], X[test_idx]
    y_train, y_test = y[train_idx], y[test_idx]
    
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    scores.append(score)
\`\`\`

## Stratified K-Fold (Classification)

\`\`\`python
from sklearn.model_selection import StratifiedKFold

skf = StratifiedKFold(n_splits=5, shuffle=True)
for train_idx, test_idx in skf.split(X, y):
    # Maintains class balance in each fold
    pass
\`\`\`

## Benefits

- Uses all data for training and testing
- More reliable performance estimate
- Reduces variance in evaluation
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔄 Cross Validation Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>K-Fold Cross Validation</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<p>Split data into K folds (e.g., K=5)</p>";
html += "<table style='width:100%;margin-top:10px;'>";
for (let i = 1; i <= 5; i++) {
  html += "<tr>";
  for (let j = 1; j <= 5; j++) {
    const bg = j === i ? "#f44336" : "#4caf50";
    const text = j === i ? "Test" : "Train";
    html += "<td style='background:" + bg + ";color:white;padding:10px;text-align:center;'>" + text + "</td>";
  }
  html += "</tr>";
}
html += "</table>";
html += "<p style='margin-top:10px;'>Each fold gets to be test set once!</p></div>";

html += "<h3>Why Use Cross Validation?</h3>";
html += "<ul>";
html += "<li>More reliable than single train/test split</li>";
html += "<li>Uses all data for training and testing</li>";
html += "<li>Reduces luck factor in evaluation</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-confusion': {
      title: 'Confusion Matrix',
      content: `# Confusion Matrix 🎯

Understanding classification performance!

## What It Shows

\`\`\`
                Predicted
              Neg    Pos
Actual  Neg   TN     FP
        Pos   FN     TP

TN = True Negative (Correct rejection)
TP = True Positive (Correct detection)
FN = False Negative (Missed)
FP = False Positive (False alarm)
\`\`\`

## Implementation

\`\`\`python
from sklearn.metrics import confusion_matrix, classification_report

# Get predictions
y_pred = model.predict(X_test)

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
print(cm)

# Detailed report
print(classification_report(y_test, y_pred))
\`\`\`

## Metrics from Confusion Matrix

\`\`\`python
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Accuracy = (TP + TN) / Total
accuracy = accuracy_score(y_test, y_pred)

# Precision = TP / (TP + FP)
precision = precision_score(y_test, y_pred)

# Recall = TP / (TP + FN)
recall = recall_score(y_test, y_pred)

# F1 = 2 * (Precision * Recall) / (Precision + Recall)
f1 = f1_score(y_test, y_pred)
\`\`\`

## Visualization

\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎯 Confusion Matrix Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Confusion Matrix</h3>";
html += "<table style='width:100%;border-collapse:collapse;max-width:400px;margin:0 auto;'>";
html += "<tr><td></td><td></td><td colspan='2' style='text-align:center;background:#3776AB;color:white;padding:10px;'><b>Predicted</b></td></tr>";
html += "<tr><td></td><td></td><td style='text-align:center;background:#e0e0e0;padding:10px;'>Negative</td><td style='text-align:center;background:#e0e0e0;padding:10px;'>Positive</td></tr>";
html += "<tr><td rowspan='2' style='background:#3776AB;color:white;padding:10px;writing-mode:vertical-rl;'><b>Actual</b></td>";
html += "<td style='background:#e0e0e0;padding:10px;'>Negative</td>";
html += "<td style='background:#c8e6c9;padding:20px;text-align:center;'><b>TN</b><br>True Negative</td>";
html += "<td style='background:#ffcdd2;padding:20px;text-align:center;'><b>FP</b><br>False Positive</td></tr>";
html += "<tr><td style='background:#e0e0e0;padding:10px;'>Positive</td>";
html += "<td style='background:#ffcdd2;padding:20px;text-align:center;'><b>FN</b><br>False Negative</td>";
html += "<td style='background:#c8e6c9;padding:20px;text-align:center;'><b>TP</b><br>True Positive</td></tr>";
html += "</table>";

html += "<h3>Key Metrics</h3>";
const metrics = [
  { m: "Accuracy", f: "(TP+TN)/Total" },
  { m: "Precision", f: "TP/(TP+FP)" },
  { m: "Recall", f: "TP/(TP+FN)" },
  { m: "F1 Score", f: "2×(P×R)/(P+R)" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
metrics.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + m.m + "</b></td>";
  html += "<td style='padding:10px;'><code>" + m.f + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-roc': {
      title: 'AUC-ROC Curve',
      content: `# AUC-ROC Curve 📈

Evaluate classification at all thresholds!

## What is ROC?

- ROC = Receiver Operating Characteristic
- Plots TPR vs FPR at various thresholds
- AUC = Area Under the Curve (0.5 to 1.0)

## Implementation

\`\`\`python
from sklearn.metrics import roc_curve, auc, roc_auc_score
import matplotlib.pyplot as plt

# Get probabilities
y_prob = model.predict_proba(X_test)[:, 1]

# Calculate ROC
fpr, tpr, thresholds = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

# Plot
plt.plot(fpr, tpr, label=f'ROC (AUC = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve')
plt.legend()
plt.show()

# Quick AUC score
auc_score = roc_auc_score(y_test, y_prob)
\`\`\`

## Interpretation

| AUC | Interpretation |
|-----|---------------|
| 1.0 | Perfect |
| 0.9 | Excellent |
| 0.8 | Good |
| 0.7 | Fair |
| 0.5 | Random |

## Key Terms

- **TPR (Sensitivity)**: True Positive Rate = TP/(TP+FN)
- **FPR**: False Positive Rate = FP/(FP+TN)
- Higher AUC = Better model
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📈 AUC-ROC Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>AUC Interpretation</h3>";
const scores = [
  { auc: "0.9-1.0", meaning: "Excellent", color: "#4caf50" },
  { auc: "0.8-0.9", meaning: "Good", color: "#8bc34a" },
  { auc: "0.7-0.8", meaning: "Fair", color: "#ffc107" },
  { auc: "0.6-0.7", meaning: "Poor", color: "#ff9800" },
  { auc: "0.5-0.6", meaning: "Fail (Random)", color: "#f44336" }
];

html += "<div style='display:flex;gap:10px;flex-wrap:wrap;'>";
scores.forEach(s => {
  html += "<div style='background:" + s.color + ";color:white;padding:10px 15px;border-radius:8px;text-align:center;'>";
  html += "<b>" + s.auc + "</b><br><small>" + s.meaning + "</small></div>";
});
html += "</div>";

html += "<h3>Key Terms</h3>";
html += "<ul>";
html += "<li><b>TPR (Sensitivity)</b>: How many positives did we catch?</li>";
html += "<li><b>FPR</b>: How many negatives did we falsely flag?</li>";
html += "<li><b>AUC</b>: Overall model quality (area under curve)</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-grid': {
      title: 'Grid Search',
      content: `# Grid Search 🔍

Find the best hyperparameters!

## What is Grid Search?

- Try all combinations of parameters
- Cross-validate each combination
- Pick the best

## Implementation

\`\`\`python
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVC

# Define parameter grid
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': [1, 0.1, 0.01, 0.001],
    'kernel': ['rbf', 'linear']
}

# Create grid search
grid_search = GridSearchCV(
    estimator=SVC(),
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,  # Use all CPU cores
    verbose=2
)

# Fit (searches all combinations)
grid_search.fit(X_train, y_train)

# Best parameters
print("Best params:", grid_search.best_params_)
print("Best score:", grid_search.best_score_)

# Best model (already fitted)
best_model = grid_search.best_estimator_
\`\`\`

## Randomized Search (Faster)

\`\`\`python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, randint

param_dist = {
    'C': uniform(0.1, 100),
    'gamma': uniform(0.001, 1)
}

random_search = RandomizedSearchCV(
    SVC(), param_dist, 
    n_iter=50,  # Number of random samples
    cv=5
)
\`\`\`

## Tips

- Start with coarse grid, then refine
- Use RandomizedSearch for many parameters
- Consider computation time
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔍 Grid Search Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Grid Search Process</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<ol>";
html += "<li>Define parameter combinations to try</li>";
html += "<li>For each combination, run cross-validation</li>";
html += "<li>Track the best score and parameters</li>";
html += "<li>Return best model</li>";
html += "</ol></div>";

html += "<h3>Example Parameter Grid</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "param_grid = {\\n";
html += "    'C': [0.1, 1, 10, 100],    # 4 values\\n";
html += "    'gamma': [1, 0.1, 0.01],    # 3 values\\n";
html += "    'kernel': ['rbf', 'linear'] # 2 values\\n";
html += "}\\n\\n";
html += "# Total: 4 × 3 × 2 = 24 combinations\\n";
html += "# With 5-fold CV = 120 fits!</pre>";

html += "<h3>Grid vs Random Search</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e3f2fd;padding:15px;border-radius:8px;'>";
html += "<h4>Grid Search</h4>";
html += "<p>✅ Thorough</p>";
html += "<p>❌ Slow with many params</p></div>";
html += "<div style='flex:1;background:#fff3e0;padding:15px;border-radius:8px;'>";
html += "<h4>Random Search</h4>";
html += "<p>✅ Fast</p>";
html += "<p>❌ Might miss optimal</p></div>";
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-hierarchical': {
      title: 'Hierarchical Clustering',
      content: `# Hierarchical Clustering 🌲

Build a tree of clusters!

## How It Works

1. Start with each point as its own cluster
2. Merge two closest clusters
3. Repeat until one cluster remains
4. Cut tree at desired level

## Implementation

\`\`\`python
from sklearn.cluster import AgglomerativeClustering
import scipy.cluster.hierarchy as sch

# Agglomerative clustering
model = AgglomerativeClustering(n_clusters=3)
labels = model.fit_predict(X)

# Create dendrogram
plt.figure(figsize=(10, 7))
dendrogram = sch.dendrogram(
    sch.linkage(X, method='ward')
)
plt.title('Dendrogram')
plt.show()
\`\`\`

## Linkage Methods

| Method | Description |
|--------|-------------|
| ward | Minimize variance |
| complete | Maximum distance |
| average | Average distance |
| single | Minimum distance |

## Choosing Clusters

\`\`\`python
# Look at dendrogram
# Cut where there's a large vertical gap
\`\`\`

## vs K-Means

| K-Means | Hierarchical |
|---------|--------------|
| Faster | Slower |
| Need K upfront | Can decide K later |
| Spherical clusters | Any shape |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🌲 Hierarchical Clustering Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Dendrogram</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;text-align:center;font-family:monospace;'>";
html += "        ┌────┴────┐<br>";
html += "    ┌───┴───┐     │<br>";
html += "  ┌─┴─┐   ┌─┴─┐   │<br>";
html += "  A   B   C   D   E<br>";
html += "<p style='margin-top:10px;'>Cut at different heights for different number of clusters</p></div>";

html += "<h3>Linkage Methods</h3>";
const methods = [
  { m: "ward", d: "Minimize variance (most common)" },
  { m: "complete", d: "Use maximum distance" },
  { m: "average", d: "Use average distance" },
  { m: "single", d: "Use minimum distance" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
methods.forEach((m, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + m.m + "</b></td>";
  html += "<td style='padding:10px;'>" + m.d + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-bagging': {
      title: 'Bagging',
      content: `# Bagging (Bootstrap Aggregation) 🎒

Combine multiple models for better predictions!

## How It Works

1. Create multiple bootstrap samples
2. Train a model on each sample
3. Combine predictions (vote/average)

## Implementation

\`\`\`python
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

# Create bagging classifier
bagging = BaggingClassifier(
    estimator=DecisionTreeClassifier(),
    n_estimators=100,    # Number of trees
    max_samples=0.8,     # Sample size
    bootstrap=True,      # With replacement
    random_state=42,
    n_jobs=-1
)

bagging.fit(X_train, y_train)
accuracy = bagging.score(X_test, y_test)
\`\`\`

## Random Forest = Bagging + Feature Randomness

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
rf.fit(X_train, y_train)

# Feature importance
importances = rf.feature_importances_
\`\`\`

## Benefits

- Reduces overfitting
- More stable predictions
- Handles noise better
- Works with any base model
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎒 Bagging Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Bagging Process</h3>";
html += "<div style='background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<div style='display:flex;justify-content:space-around;'>";
["Sample 1", "Sample 2", "Sample 3"].forEach(s => {
  html += "<div style='background:#3776AB;color:white;padding:10px;border-radius:4px;'>" + s + "</div>";
});
html += "</div>";
html += "<div style='text-align:center;margin:10px 0;'>↓ Train models ↓</div>";
html += "<div style='display:flex;justify-content:space-around;'>";
["Model 1", "Model 2", "Model 3"].forEach(s => {
  html += "<div style='background:#4caf50;color:white;padding:10px;border-radius:4px;'>" + s + "</div>";
});
html += "</div>";
html += "<div style='text-align:center;margin:10px 0;'>↓ Combine (Vote/Average) ↓</div>";
html += "<div style='text-align:center;'>";
html += "<div style='display:inline-block;background:#ff9800;color:white;padding:15px 30px;border-radius:8px;'><b>Final Prediction</b></div>";
html += "</div></div>";

html += "<h3>Benefits</h3>";
html += "<ul>";
html += "<li>Reduces variance (overfitting)</li>";
html += "<li>More stable predictions</li>";
html += "<li>Works with any base model</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'ml-ensemble': {
      title: 'Ensemble Methods',
      content: `# Ensemble Methods 🎭

Combine models for super predictions!

## Types of Ensembles

### 1. Bagging (Parallel)
\`\`\`python
# Random Forest
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100)
\`\`\`

### 2. Boosting (Sequential)
\`\`\`python
# Gradient Boosting
from sklearn.ensemble import GradientBoostingClassifier
gb = GradientBoostingClassifier(n_estimators=100)

# XGBoost
import xgboost as xgb
xgb_model = xgb.XGBClassifier()

# LightGBM
import lightgbm as lgb
lgb_model = lgb.LGBMClassifier()
\`\`\`

### 3. Stacking
\`\`\`python
from sklearn.ensemble import StackingClassifier
from sklearn.linear_model import LogisticRegression

stacking = StackingClassifier(
    estimators=[
        ('rf', RandomForestClassifier()),
        ('gb', GradientBoostingClassifier())
    ],
    final_estimator=LogisticRegression()
)
\`\`\`

### 4. Voting
\`\`\`python
from sklearn.ensemble import VotingClassifier

voting = VotingClassifier(
    estimators=[
        ('rf', RandomForestClassifier()),
        ('svc', SVC(probability=True))
    ],
    voting='soft'  # Use probabilities
)
\`\`\`

## Comparison

| Method | Parallel | Reduces |
|--------|----------|---------|
| Bagging | Yes | Variance |
| Boosting | No | Bias |
| Stacking | Yes | Both |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎭 Ensemble Methods Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Ensemble Types</h3>";
const types = [
  { name: "Bagging", how: "Train in parallel", example: "Random Forest" },
  { name: "Boosting", how: "Train sequentially", example: "XGBoost, LightGBM" },
  { name: "Stacking", how: "Stack model outputs", example: "Meta-learner" },
  { name: "Voting", how: "Vote on predictions", example: "Hard/Soft voting" }
];

html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:15px;'>";
types.forEach(t => {
  html += "<div style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
  html += "<h4>" + t.name + "</h4>";
  html += "<p><b>How:</b> " + t.how + "</p>";
  html += "<p><b>Example:</b> " + t.example + "</p></div>";
});
html += "</div>";

html += "<h3>Popular Libraries</h3>";
html += "<div style='display:flex;gap:15px;'>";
["XGBoost", "LightGBM", "CatBoost"].forEach(lib => {
  html += "<span style='background:#3776AB;color:white;padding:10px 20px;border-radius:20px;'>" + lib + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Enterprise lessons
    'defensive': {
      title: 'Defensive Programming',
      content: `# Defensive Programming 🛡️

Write code that fails fast and clearly!

## Input Validation

\`\`\`python
def process_age(age):
    if not isinstance(age, int):
        raise TypeError("Age must be an integer")
    if age < 0 or age > 150:
        raise ValueError("Age must be between 0 and 150")
    return age

# With type hints
def process_age(age: int) -> int:
    assert 0 <= age <= 150, "Invalid age"
    return age
\`\`\`

## Assertions (Development)

\`\`\`python
def divide(a, b):
    assert b != 0, "Divisor cannot be zero"
    return a / b

# Assertions can be disabled with -O flag
# Use for development checks, not production validation
\`\`\`

## Guard Clauses

\`\`\`python
# Instead of nested ifs
def process_user(user):
    if user is None:
        return None
    if not user.is_active:
        return None
    if user.is_banned:
        return None
    
    # Main logic here
    return user.process()
\`\`\`

## Type Checking

\`\`\`python
from typing import Optional, List

def get_user(user_id: int) -> Optional[dict]:
    if user_id < 0:
        return None
    return {"id": user_id, "name": "User"}

# Runtime type checking with pydantic
from pydantic import BaseModel, validator

class User(BaseModel):
    name: str
    age: int
    
    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🛡️ Defensive Programming Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Defensive Patterns</h3>";
const patterns = [
  { name: "Input Validation", desc: "Check all inputs at boundaries" },
  { name: "Guard Clauses", desc: "Return early for invalid cases" },
  { name: "Assertions", desc: "Check assumptions during development" },
  { name: "Type Hints", desc: "Document and check expected types" },
  { name: "Fail Fast", desc: "Raise errors immediately" }
];

html += "<div style='display:flex;flex-direction:column;gap:10px;'>";
patterns.forEach((p, i) => {
  const bg = i % 2 === 0 ? "#e8f5e9" : "#e3f2fd";
  html += "<div style='background:" + bg + ";padding:15px;border-radius:8px;'>";
  html += "<b>" + p.name + "</b>: " + p.desc + "</div>";
});
html += "</div>";

html += "<h3>Guard Clause Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "def process(user):\\n";
html += "    if user is None: return None\\n";
html += "    if not user.active: return None\\n";
html += "    # Main logic here\\n";
html += "    return user.process()</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'performance': {
      title: 'Performance & Memory',
      content: `# Performance & Memory 🚀

Make your Python code fast!

## Profiling

\`\`\`python
import cProfile
import pstats

# Profile a function
cProfile.run('my_function()', 'output.prof')

# Analyze results
stats = pstats.Stats('output.prof')
stats.sort_stats('cumulative')
stats.print_stats(10)  # Top 10
\`\`\`

## Line Profiler

\`\`\`python
# pip install line_profiler
@profile
def slow_function():
    result = []
    for i in range(10000):
        result.append(i ** 2)
    return result

# Run with: kernprof -l -v script.py
\`\`\`

## Memory Profiling

\`\`\`python
# pip install memory_profiler
from memory_profiler import profile

@profile
def memory_hungry():
    big_list = [i for i in range(1000000)]
    return sum(big_list)
\`\`\`

## Optimization Tips

\`\`\`python
# Use generators instead of lists
sum(x**2 for x in range(1000000))

# Use set for membership testing
my_set = set(big_list)
if item in my_set:  # O(1) vs O(n)

# Use local variables
def fast():
    local_func = expensive_function
    for i in range(1000):
        local_func()  # Faster than global lookup

# Use built-ins (C-optimized)
sum(list)  # Faster than manual loop
\`\`\`

## Measuring Time

\`\`\`python
import time

start = time.perf_counter()
# code here
elapsed = time.perf_counter() - start
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚀 Performance Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Optimization Tips</h3>";
const tips = [
  { tip: "Use generators", why: "Less memory than lists" },
  { tip: "Use sets for lookup", why: "O(1) vs O(n)" },
  { tip: "Use local variables", why: "Faster than global" },
  { tip: "Use built-in functions", why: "C-optimized" },
  { tip: "Avoid repeated calculations", why: "Cache results" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Tip</th><th>Why</th></tr>";
tips.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'>" + t.tip + "</td>";
  html += "<td style='padding:10px;'>" + t.why + "</td></tr>";
});
html += "</table>";

html += "<h3>Profiling Tools</h3>";
html += "<ul>";
html += "<li><code>cProfile</code> - Function-level profiling</li>";
html += "<li><code>line_profiler</code> - Line-by-line timing</li>";
html += "<li><code>memory_profiler</code> - Memory usage</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'config': {
      title: 'Configuration Management',
      content: `# Configuration Management ⚙️

Manage settings like a pro!

## Environment Variables

\`\`\`python
import os

# Get environment variable
database_url = os.getenv('DATABASE_URL')
debug = os.getenv('DEBUG', 'False').lower() == 'true'

# Required variable
api_key = os.environ['API_KEY']  # Raises error if missing
\`\`\`

## .env Files

\`\`\`python
# pip install python-dotenv
from dotenv import load_dotenv

load_dotenv()  # Load from .env file

database_url = os.getenv('DATABASE_URL')
\`\`\`

## Config Class

\`\`\`python
from pydantic import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_key: str
    debug: bool = False
    max_connections: int = 10
    
    class Config:
        env_file = '.env'

settings = Settings()
print(settings.database_url)
\`\`\`

## Config Files

\`\`\`python
# config.yaml
import yaml

with open('config.yaml') as f:
    config = yaml.safe_load(f)

# config.json
import json

with open('config.json') as f:
    config = json.load(f)
\`\`\`

## Best Practices

1. Never commit secrets to git
2. Use .env for local development
3. Use environment variables in production
4. Validate configuration at startup
5. Use type hints for config values
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>⚙️ Configuration Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Configuration Hierarchy</h3>";
html += "<div style='display:flex;flex-direction:column;gap:10px;'>";
const levels = [
  { level: "Environment Variables", priority: "Highest" },
  { level: ".env File", priority: "High" },
  { level: "Config File", priority: "Medium" },
  { level: "Default Values", priority: "Lowest" }
];
levels.forEach((l, i) => {
  const colors = ["#4caf50", "#8bc34a", "#ffc107", "#e0e0e0"];
  html += "<div style='background:" + colors[i] + ";padding:15px;border-radius:8px;display:flex;justify-content:space-between;'>";
  html += "<span>" + l.level + "</span>";
  html += "<span><b>" + l.priority + "</b></span></div>";
});
html += "</div>";

html += "<h3>Best Practices</h3>";
html += "<ul>";
html += "<li>🔒 Never commit secrets to git</li>";
html += "<li>📁 Use .env for local development</li>";
html += "<li>☁️ Use env vars in production</li>";
html += "<li>✅ Validate config at startup</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'packaging': {
      title: 'Python Packaging',
      content: `# Python Packaging 📦

Distribute your Python code!

## Project Structure

\`\`\`
mypackage/
├── pyproject.toml
├── README.md
├── LICENSE
├── src/
│   └── mypackage/
│       ├── __init__.py
│       └── main.py
└── tests/
    └── test_main.py
\`\`\`

## pyproject.toml

\`\`\`toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "mypackage"
version = "0.1.0"
authors = [
    { name="Your Name", email="you@email.com" }
]
description = "A small example package"
requires-python = ">=3.8"
dependencies = [
    "requests>=2.25.0",
    "pandas>=1.3.0"
]

[project.scripts]
mycommand = "mypackage.main:main"
\`\`\`

## Build & Upload

\`\`\`bash
# Install build tools
pip install build twine

# Build package
python -m build

# Upload to PyPI
twine upload dist/*
\`\`\`

## Install from GitHub

\`\`\`bash
pip install git+https://github.com/user/repo.git
\`\`\`

## Virtual Environments

\`\`\`bash
# Create
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\\Scripts\\activate     # Windows

# Install requirements
pip install -r requirements.txt
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>📦 Python Packaging Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Package Structure</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "mypackage/\\n";
html += "├── pyproject.toml  # Config\\n";
html += "├── README.md       # Docs\\n";
html += "├── src/\\n";
html += "│   └── mypackage/\\n";
html += "│       └── __init__.py\\n";
html += "└── tests/</pre>";

html += "<h3>Publishing Steps</h3>";
html += "<ol>";
html += "<li>Create pyproject.toml</li>";
html += "<li>Build: <code>python -m build</code></li>";
html += "<li>Upload: <code>twine upload dist/*</code></li>";
html += "<li>Install: <code>pip install mypackage</code></li>";
html += "</ol>";

html += "<h3>Essential Files</h3>";
const files = [
  { file: "pyproject.toml", purpose: "Package metadata & dependencies" },
  { file: "README.md", purpose: "Documentation" },
  { file: "LICENSE", purpose: "Legal terms" },
  { file: "__init__.py", purpose: "Makes directory a package" }
];
html += "<table style='width:100%;border-collapse:collapse;'>";
files.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + f.file + "</code></td>";
  html += "<td style='padding:10px;'>" + f.purpose + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // More MySQL
    'mysql-joins': {
      title: 'MySQL Joins',
      content: `# MySQL Joins in Python 🔗

Combine data from multiple tables!

## JOIN Types

\`\`\`sql
-- INNER JOIN: Only matching rows
SELECT * FROM users u
INNER JOIN orders o ON u.id = o.user_id

-- LEFT JOIN: All from left + matching
SELECT * FROM users u
LEFT JOIN orders o ON u.id = o.user_id

-- RIGHT JOIN: Matching + all from right
SELECT * FROM users u
RIGHT JOIN orders o ON u.id = o.user_id
\`\`\`

## Python Implementation

\`\`\`python
import mysql.connector

conn = mysql.connector.connect(...)
cursor = conn.cursor(dictionary=True)

# Inner join
query = """
SELECT u.name, o.product, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.city = %s
"""
cursor.execute(query, ('NYC',))
results = cursor.fetchall()

for row in results:
    print(f"{row['name']} ordered {row['product']}")
\`\`\`

## Multiple Joins

\`\`\`python
query = """
SELECT u.name, o.product, p.price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id
"""
cursor.execute(query)
\`\`\`

## With Pandas

\`\`\`python
import pandas as pd

df = pd.read_sql(query, conn)
print(df.head())
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔗 MySQL Joins Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>JOIN Types</h3>";
const joins = [
  { type: "INNER JOIN", result: "Only matching rows", color: "#4caf50" },
  { type: "LEFT JOIN", result: "All left + matching right", color: "#2196f3" },
  { type: "RIGHT JOIN", result: "Matching left + all right", color: "#ff9800" },
  { type: "FULL JOIN", result: "All from both tables", color: "#9c27b0" }
];

html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:15px;'>";
joins.forEach(j => {
  html += "<div style='background:" + j.color + ";color:white;padding:15px;border-radius:8px;'>";
  html += "<h4>" + j.type + "</h4>";
  html += "<p>" + j.result + "</p></div>";
});
html += "</div>";

html += "<h3>Example</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "SELECT u.name, o.product\\n";
html += "FROM users u\\n";
html += "INNER JOIN orders o\\n";
html += "ON u.id = o.user_id</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'mysql-transactions': {
      title: 'MySQL Transactions',
      content: `# MySQL Transactions 🔐

Keep your data consistent!

## ACID Properties

- **A**tomicity: All or nothing
- **C**onsistency: Valid state to valid state
- **I**solation: Transactions don't interfere
- **D**urability: Committed = permanent

## Basic Transaction

\`\`\`python
import mysql.connector

conn = mysql.connector.connect(...)
cursor = conn.cursor()

try:
    # Start transaction (automatic in Python)
    
    # Debit from account A
    cursor.execute(
        "UPDATE accounts SET balance = balance - %s WHERE id = %s",
        (100, 1)
    )
    
    # Credit to account B
    cursor.execute(
        "UPDATE accounts SET balance = balance + %s WHERE id = %s",
        (100, 2)
    )
    
    # Commit if both succeed
    conn.commit()
    print("Transfer successful!")
    
except Exception as e:
    # Rollback on error
    conn.rollback()
    print(f"Transfer failed: {e}")
    
finally:
    cursor.close()
    conn.close()
\`\`\`

## Context Manager Pattern

\`\`\`python
from contextlib import contextmanager

@contextmanager
def transaction(conn):
    cursor = conn.cursor()
    try:
        yield cursor
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()

# Usage
with transaction(conn) as cursor:
    cursor.execute(...)
    cursor.execute(...)
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔐 MySQL Transactions Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>ACID Properties</h3>";
const acid = [
  { letter: "A", prop: "Atomicity", desc: "All or nothing" },
  { letter: "C", prop: "Consistency", desc: "Valid state to valid state" },
  { letter: "I", prop: "Isolation", desc: "Transactions don't interfere" },
  { letter: "D", prop: "Durability", desc: "Committed = permanent" }
];

html += "<div style='display:flex;gap:15px;'>";
acid.forEach(a => {
  html += "<div style='flex:1;background:#3776AB;color:white;padding:15px;border-radius:8px;text-align:center;'>";
  html += "<h2 style='margin:0;'>" + a.letter + "</h2>";
  html += "<p style='margin:5px 0;'><b>" + a.prop + "</b></p>";
  html += "<small>" + a.desc + "</small></div>";
});
html += "</div>";

html += "<h3>Transaction Pattern</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "try:\\n";
html += "    cursor.execute(...)  # Operation 1\\n";
html += "    cursor.execute(...)  # Operation 2\\n";
html += "    conn.commit()        # ✅ Save all\\n";
html += "except:\\n";
html += "    conn.rollback()      # ❌ Undo all</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // MongoDB continued
    'mongo-queries': {
      title: 'MongoDB Queries',
      content: `# MongoDB Query Patterns 🔍

Master MongoDB query operations!

## Comparison Operators

\`\`\`python
# Equals
collection.find({"age": 25})

# Greater than
collection.find({"age": {"$gt": 25}})
collection.find({"age": {"$gte": 25}})

# Less than
collection.find({"age": {"$lt": 30}})
collection.find({"age": {"$lte": 30}})

# Not equal
collection.find({"status": {"$ne": "inactive"}})

# In list
collection.find({"city": {"$in": ["NYC", "LA", "Chicago"]}})

# Not in list
collection.find({"city": {"$nin": ["NYC", "LA"]}})
\`\`\`

## Logical Operators

\`\`\`python
# AND (implicit)
collection.find({"age": {"$gt": 25}, "city": "NYC"})

# OR
collection.find({
    "$or": [
        {"age": {"$lt": 25}},
        {"city": "NYC"}
    ]
})

# NOT
collection.find({"age": {"$not": {"$gt": 30}}})
\`\`\`

## Array Queries

\`\`\`python
# Contains element
collection.find({"tags": "python"})

# Contains all
collection.find({"tags": {"$all": ["python", "data"]}})

# Array size
collection.find({"tags": {"$size": 3}})
\`\`\`

## Projection

\`\`\`python
# Include fields
collection.find({}, {"name": 1, "age": 1, "_id": 0})

# Exclude fields
collection.find({}, {"password": 0})
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔍 MongoDB Queries Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Query Operators</h3>";
const ops = [
  { op: "$eq", desc: "Equals", ex: '{"age": {"$eq": 25}}' },
  { op: "$gt / $gte", desc: "Greater than", ex: '{"age": {"$gt": 25}}' },
  { op: "$lt / $lte", desc: "Less than", ex: '{"age": {"$lt": 30}}' },
  { op: "$in", desc: "In array", ex: '{"city": {"$in": [...]}}' },
  { op: "$or", desc: "Logical OR", ex: '{"$or": [{...}, {...}]}' },
  { op: "$regex", desc: "Pattern match", ex: '{"name": {"$regex": "^A"}}' }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#4caf50;color:white;'>";
html += "<th>Operator</th><th>Description</th><th>Example</th></tr>";
ops.forEach((o, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + o.op + "</code></td>";
  html += "<td style='padding:10px;'>" + o.desc + "</td>";
  html += "<td style='padding:10px;font-size:11px;'><code>" + o.ex + "</code></td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'mongo-indexing': {
      title: 'MongoDB Indexing',
      content: `# MongoDB Indexing 🚀

Speed up your queries!

## Why Index?

- Without index: Scan every document (slow!)
- With index: Jump directly to matches (fast!)

## Create Index

\`\`\`python
# Single field index
collection.create_index("email")
collection.create_index([("email", 1)])  # 1 = ascending

# Compound index
collection.create_index([("city", 1), ("age", -1)])

# Unique index
collection.create_index("email", unique=True)

# Text index (for search)
collection.create_index([("description", "text")])
\`\`\`

## List Indexes

\`\`\`python
for index in collection.list_indexes():
    print(index)
\`\`\`

## Query Explanation

\`\`\`python
# See if index is used
result = collection.find({"email": "test@test.com"}).explain()
print(result['executionStats'])
\`\`\`

## Drop Index

\`\`\`python
collection.drop_index("email_1")
collection.drop_indexes()  # Drop all
\`\`\`

## Index Types

| Type | Use Case |
|------|----------|
| Single | One field queries |
| Compound | Multi-field queries |
| Text | Full-text search |
| Geospatial | Location queries |
| TTL | Auto-expire documents |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🚀 MongoDB Indexing Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Index Types</h3>";
const types = [
  { type: "Single Field", use: "One field queries", ex: 'create_index("email")' },
  { type: "Compound", use: "Multi-field queries", ex: 'create_index([("a", 1), ("b", -1)])' },
  { type: "Text", use: "Full-text search", ex: 'create_index([("desc", "text")])' },
  { type: "Unique", use: "Prevent duplicates", ex: 'create_index("email", unique=True)' }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#4caf50;color:white;'>";
html += "<th>Type</th><th>Use Case</th></tr>";
types.forEach((t, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + t.type + "</b></td>";
  html += "<td style='padding:10px;'>" + t.use + "</td></tr>";
});
html += "</table>";

html += "<h3>Performance Impact</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#ffebee;padding:15px;border-radius:8px;'>";
html += "<h4>Without Index</h4>";
html += "<p>Scans ALL documents 🐌</p></div>";
html += "<div style='flex:1;background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<h4>With Index</h4>";
html += "<p>Jumps to matches 🚀</p></div>";
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // Django continued
    'django-views': {
      title: 'Django Views',
      content: `# Django Views 👁️

Handle requests and return responses!

## Function-Based Views

\`\`\`python
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404

def hello(request):
    return HttpResponse("Hello, World!")

def user_list(request):
    users = User.objects.all()
    return render(request, 'users/list.html', {'users': users})

def user_detail(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    return render(request, 'users/detail.html', {'user': user})
\`\`\`

## Class-Based Views

\`\`\`python
from django.views.generic import ListView, DetailView, CreateView

class UserListView(ListView):
    model = User
    template_name = 'users/list.html'
    context_object_name = 'users'

class UserDetailView(DetailView):
    model = User
    template_name = 'users/detail.html'

class UserCreateView(CreateView):
    model = User
    fields = ['name', 'email']
    success_url = '/users/'
\`\`\`

## URL Configuration

\`\`\`python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
]
\`\`\`

## Request Object

\`\`\`python
def my_view(request):
    # Method
    if request.method == 'POST':
        data = request.POST.get('name')
    
    # Query params
    page = request.GET.get('page', 1)
    
    # User
    if request.user.is_authenticated:
        username = request.user.username
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>👁️ Django Views Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>View Types</h3>";
html += "<div style='display:flex;gap:20px;'>";
html += "<div style='flex:1;background:#e3f2fd;padding:15px;border-radius:8px;'>";
html += "<h4>Function-Based (FBV)</h4>";
html += "<p>✅ Simple, explicit</p>";
html += "<p>✅ Full control</p>";
html += "<p>❌ More code</p></div>";
html += "<div style='flex:1;background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<h4>Class-Based (CBV)</h4>";
html += "<p>✅ Less code</p>";
html += "<p>✅ Reusable mixins</p>";
html += "<p>❌ More abstract</p></div>";
html += "</div>";

html += "<h3>Common Generic Views</h3>";
const views = ["ListView", "DetailView", "CreateView", "UpdateView", "DeleteView"];
html += "<div style='display:flex;flex-wrap:wrap;gap:10px;'>";
views.forEach(v => {
  html += "<span style='background:#092e20;color:white;padding:8px 15px;border-radius:20px;'>" + v + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'django-api': {
      title: 'Django REST APIs',
      content: `# Django REST APIs 🔌

Build APIs with Django REST Framework!

## Install

\`\`\`bash
pip install djangorestframework
\`\`\`

## Serializers

\`\`\`python
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']
\`\`\`

## API Views

\`\`\`python
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Function-based
@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

# ViewSet (full CRUD)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
\`\`\`

## URLs

\`\`\`python
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = router.urls
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🔌 Django REST APIs Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>REST API Endpoints</h3>";
const endpoints = [
  { method: "GET", path: "/api/users/", action: "List all" },
  { method: "POST", path: "/api/users/", action: "Create new" },
  { method: "GET", path: "/api/users/1/", action: "Get one" },
  { method: "PUT", path: "/api/users/1/", action: "Update" },
  { method: "DELETE", path: "/api/users/1/", action: "Delete" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#092e20;color:white;'>";
html += "<th>Method</th><th>Endpoint</th><th>Action</th></tr>";
endpoints.forEach((e, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  const methodColor = { GET: "#4caf50", POST: "#2196f3", PUT: "#ff9800", DELETE: "#f44336" };
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><span style='background:" + methodColor[e.method] + ";color:white;padding:2px 8px;border-radius:4px;'>" + e.method + "</span></td>";
  html += "<td style='padding:10px;'><code>" + e.path + "</code></td>";
  html += "<td style='padding:10px;'>" + e.action + "</td></tr>";
});
html += "</table>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'django-admin': {
      title: 'Django Admin',
      content: `# Django Admin 🎛️

Free admin interface for your models!

## Register Model

\`\`\`python
# admin.py
from django.contrib import admin
from .models import User, Post

admin.site.register(User)
admin.site.register(Post)
\`\`\`

## Custom Admin

\`\`\`python
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'email']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Basic Info', {
            'fields': ('name', 'email')
        }),
        ('Status', {
            'fields': ('is_active', 'created_at')
        }),
    )
\`\`\`

## Inline Models

\`\`\`python
class PostInline(admin.TabularInline):
    model = Post
    extra = 1

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    inlines = [PostInline]
\`\`\`

## Custom Actions

\`\`\`python
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    actions = ['make_active', 'make_inactive']
    
    @admin.action(description='Mark selected as active')
    def make_active(self, request, queryset):
        queryset.update(is_active=True)
\`\`\`

## Create Superuser

\`\`\`bash
python manage.py createsuperuser
\`\`\`
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎛️ Django Admin Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Admin Features</h3>";
const features = [
  { feature: "list_display", desc: "Columns to show in list" },
  { feature: "list_filter", desc: "Sidebar filters" },
  { feature: "search_fields", desc: "Search bar fields" },
  { feature: "ordering", desc: "Default sort order" },
  { feature: "readonly_fields", desc: "Non-editable fields" },
  { feature: "fieldsets", desc: "Group fields in sections" },
  { feature: "inlines", desc: "Edit related models inline" },
  { feature: "actions", desc: "Bulk actions" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#092e20;color:white;'>";
html += "<th>Option</th><th>Description</th></tr>";
features.forEach((f, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><code>" + f.feature + "</code></td>";
  html += "<td style='padding:10px;'>" + f.desc + "</td></tr>";
});
html += "</table>";

html += "<h3>Quick Setup</h3>";
html += "<pre style='background:#1a1a2e;color:#0f0;padding:15px;border-radius:8px;'>";
html += "# admin.py\\n";
html += "from django.contrib import admin\\n";
html += "from .models import User\\n\\n";
html += "admin.site.register(User)</pre>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // DSA continued
    'dsa-bst': {
      title: 'Binary Search Trees',
      content: `# Binary Search Trees 🌲

Ordered trees for fast operations!

## BST Property

- Left subtree < Node < Right subtree
- All operations: O(log n) average

## Implementation

\`\`\`python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        if not self.root:
            self.root = TreeNode(value)
        else:
            self._insert(self.root, value)
    
    def _insert(self, node, value):
        if value < node.value:
            if node.left:
                self._insert(node.left, value)
            else:
                node.left = TreeNode(value)
        else:
            if node.right:
                self._insert(node.right, value)
            else:
                node.right = TreeNode(value)
    
    def search(self, value):
        return self._search(self.root, value)
    
    def _search(self, node, value):
        if not node:
            return False
        if value == node.value:
            return True
        elif value < node.value:
            return self._search(node.left, value)
        else:
            return self._search(node.right, value)
\`\`\`

## Time Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(log n) | O(n) |
| Search | O(log n) | O(n) |
| Delete | O(log n) | O(n) |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🌲 BST Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>BST Property</h3>";
html += "<div style='text-align:center;background:#e8f5e9;padding:20px;border-radius:8px;'>";
html += "<p style='margin-bottom:10px;'><b>Left < Node < Right</b></p>";
html += "<span style='background:#3776AB;color:white;padding:10px 20px;border-radius:50%;'>10</span>";
html += "<div style='margin-top:10px;'>↙️ ↘️</div>";
html += "<div style='display:flex;justify-content:center;gap:60px;'>";
html += "<span style='background:#4caf50;color:white;padding:10px 20px;border-radius:50%;'>5</span>";
html += "<span style='background:#4caf50;color:white;padding:10px 20px;border-radius:50%;'>15</span></div>";
html += "<p style='margin-top:10px;'>5 < 10 < 15 ✅</p></div>";

html += "<h3>Operations: O(log n)</h3>";
html += "<ul>";
html += "<li><b>Insert:</b> Follow left/right until empty spot</li>";
html += "<li><b>Search:</b> Follow left/right until found</li>";
html += "<li><b>Delete:</b> Replace with successor/predecessor</li>";
html += "</ul>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'dsa-avl': {
      title: 'AVL Trees',
      content: `# AVL Trees ⚖️

Self-balancing BST!

## Balance Factor

\`\`\`python
balance = height(left) - height(right)
# Must be -1, 0, or 1 for all nodes
\`\`\`

## Rotations

\`\`\`python
# Right Rotation (Left-Left case)
def rotate_right(y):
    x = y.left
    T2 = x.right
    x.right = y
    y.left = T2
    return x

# Left Rotation (Right-Right case)
def rotate_left(x):
    y = x.right
    T2 = y.left
    y.left = x
    x.right = T2
    return y
\`\`\`

## Cases

| Case | Condition | Solution |
|------|-----------|----------|
| Left-Left | Insert in left of left | Right rotate |
| Right-Right | Insert in right of right | Left rotate |
| Left-Right | Insert in right of left | Left then Right |
| Right-Left | Insert in left of right | Right then Left |

## Why AVL?

- BST can become O(n) if unbalanced
- AVL guarantees O(log n)
- Height is always approximately log(n)

## Trade-offs

| Feature | AVL | Red-Black |
|---------|-----|-----------|
| Balance | Stricter | Relaxed |
| Search | Faster | Slower |
| Insert/Delete | More rotations | Fewer rotations |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>⚖️ AVL Trees Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Balance Factor</h3>";
html += "<p style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "<code>balance = height(left) - height(right)</code><br>";
html += "Must be <b>-1, 0, or 1</b> for every node!</p>";

html += "<h3>Rotation Cases</h3>";
const cases = [
  { case: "Left-Left", fix: "Right Rotate" },
  { case: "Right-Right", fix: "Left Rotate" },
  { case: "Left-Right", fix: "Left → Right Rotate" },
  { case: "Right-Left", fix: "Right → Left Rotate" }
];

html += "<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:10px;'>";
cases.forEach(c => {
  html += "<div style='background:#f8f9fa;padding:15px;border-radius:8px;'>";
  html += "<b>" + c.case + "</b><br>";
  html += "Fix: " + c.fix + "</div>";
});
html += "</div>";

html += "<h3>Why AVL?</h3>";
html += "<p>Regular BST can become unbalanced → O(n)<br>";
html += "AVL maintains balance → <b>Always O(log n)</b></p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'sort-special': {
      title: 'Special Sorting',
      content: `# Special Sorting Algorithms 🎯

Non-comparison based sorting!

## Counting Sort - O(n + k)

\`\`\`python
def counting_sort(arr):
    if not arr:
        return arr
    
    max_val = max(arr)
    count = [0] * (max_val + 1)
    
    # Count occurrences
    for num in arr:
        count[num] += 1
    
    # Build sorted array
    result = []
    for i, c in enumerate(count):
        result.extend([i] * c)
    
    return result

# Best for: Small range of integers
\`\`\`

## Radix Sort - O(d * (n + k))

\`\`\`python
def radix_sort(arr):
    if not arr:
        return arr
    
    max_val = max(arr)
    exp = 1
    
    while max_val // exp > 0:
        counting_sort_by_digit(arr, exp)
        exp *= 10
    
    return arr

# Best for: Large integers with similar digit counts
\`\`\`

## Bucket Sort - O(n + k)

\`\`\`python
def bucket_sort(arr):
    if not arr:
        return arr
    
    n = len(arr)
    buckets = [[] for _ in range(n)]
    
    # Distribute into buckets
    for num in arr:
        index = int(num * n)
        buckets[index].append(num)
    
    # Sort each bucket and concatenate
    result = []
    for bucket in buckets:
        result.extend(sorted(bucket))
    
    return result

# Best for: Uniformly distributed floats [0, 1)
\`\`\`

## Comparison

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| Counting | O(n+k) | O(k) | Small integers |
| Radix | O(d(n+k)) | O(n+k) | Large integers |
| Bucket | O(n+k) | O(n) | Uniform floats |
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎯 Special Sorting Demo</h2>
<div id="demo"></div>
<script>
let html = "<h3>Non-Comparison Sorts</h3>";
const sorts = [
  { name: "Counting Sort", time: "O(n + k)", best: "Small range integers" },
  { name: "Radix Sort", time: "O(d × n)", best: "Large integers" },
  { name: "Bucket Sort", time: "O(n + k)", best: "Uniform distribution" }
];

html += "<table style='width:100%;border-collapse:collapse;'>";
html += "<tr style='background:#3776AB;color:white;'>";
html += "<th>Algorithm</th><th>Time</th><th>Best For</th></tr>";
sorts.forEach((s, i) => {
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background:" + bg + ";'>";
  html += "<td style='padding:10px;'><b>" + s.name + "</b></td>";
  html += "<td style='padding:10px;'>" + s.time + "</td>";
  html += "<td style='padding:10px;'>" + s.best + "</td></tr>";
});
html += "</table>";

html += "<h3>Key Insight</h3>";
html += "<p style='background:#e8f5e9;padding:15px;border-radius:8px;'>";
html += "These algorithms don't compare elements!<br>";
html += "They use the <b>values themselves</b> to determine position.<br>";
html += "Can beat O(n log n) for specific data types.</p>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    'certificate': {
      title: 'Python Certificate',
      content: `# Python Certificate 🎓

Congratulations on completing the Python course!

## Your Achievement

You have mastered:

### Core Python
- Variables, data types, operators
- Control flow, loops, functions
- Object-oriented programming
- File handling and exceptions

### Data Science
- NumPy for numerical computing
- Pandas for data analysis
- Matplotlib for visualization

### Databases
- MySQL integration
- MongoDB with PyMongo

### Web Development
- Django framework basics
- REST API development

### Data Structures & Algorithms
- Lists, stacks, queues
- Trees and graphs
- Sorting and searching

### Machine Learning
- Regression and classification
- Model evaluation
- Clustering and ensembles

## Certificate Requirements

✅ Complete all lessons
✅ Pass quizzes with 80%+
✅ Complete the capstone project

## Next Steps

1. Build real projects
2. Contribute to open source
3. Learn advanced topics
4. Get certified officially

## Share Your Achievement!

Download your certificate and share on LinkedIn!
`,
      tryItCode: `<!DOCTYPE html>
<html><body>
<h2>🎓 Python Certificate</h2>
<div id="demo"></div>
<script>
let html = "<div style='background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;padding:40px;border-radius:16px;text-align:center;'>";
html += "<h1 style='margin:0;'>Certificate of Completion</h1>";
html += "<p style='font-size:20px;'>Python 0 → Hero → SME</p>";
html += "<div style='background:white;color:#333;padding:20px;border-radius:8px;margin:20px 0;'>";
html += "<h2 style='margin:0;'>🐍 Python Mastery</h2>";
html += "<p>This certifies that</p>";
html += "<h3 style='color:#667eea;'>Your Name Here</h3>";
html += "<p>has successfully completed the comprehensive<br>Python Programming Course</p>";
html += "<p style='font-size:12px;color:#666;'>Including: Core Python • Data Science • Web Development • ML</p>";
html += "</div>";
html += "<button style='background:white;color:#667eea;border:none;padding:15px 30px;border-radius:8px;font-size:16px;cursor:pointer;'>Download Certificate</button>";
html += "</div>";

html += "<h3 style='margin-top:20px;'>Topics Mastered</h3>";
const topics = ["Core Python", "OOP", "NumPy", "Pandas", "Matplotlib", "MySQL", "MongoDB", "Django", "DSA", "Machine Learning"];
html += "<div style='display:flex;flex-wrap:wrap;gap:10px;'>";
topics.forEach(t => {
  html += "<span style='background:#4caf50;color:white;padding:8px 15px;border-radius:20px;'>✅ " + t + "</span>";
});
html += "</div>";

document.getElementById("demo").innerHTML = html;
</script>
</body></html>`,
    },

    // ML basics
    'ml-linear': {
      title: 'Linear Regression',
      content: `# Linear Regression 📈

Think of linear regression like drawing the **best straight line** through a scatter of points!

## What is Linear Regression?

Linear regression finds the relationship between:
- **X** (input/feature)
- **Y** (output/target)

\`\`\`
Y = mx + b
where:
  m = slope (how steep)
  b = intercept (where line crosses Y-axis)
\`\`\`

## Simple Example

\`\`\`python
import numpy as np
from sklearn.linear_model import LinearRegression

# Data: Study hours → Test scores
X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y = np.array([50, 55, 65, 70, 85])

# Train model
model = LinearRegression()
model.fit(X, y)

# Get coefficients
print(f"Slope: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")

# Predict
hours = 6
predicted = model.predict([[hours]])
print(f"{hours} hours → {predicted[0]:.1f} score")
\`\`\`

## With Real Data

\`\`\`python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Load data
df = pd.read_csv("housing.csv")
X = df[["sqft", "bedrooms"]]
y = df["price"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
predictions = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, predictions))
r2 = r2_score(y_test, predictions)

print(f"RMSE: \${rmse:,.2f}")
print(f"R² Score: {r2:.3f}")
\`\`\`

## Key Metrics

| Metric | Meaning | Goal |
|--------|---------|------|
| **RMSE** | Average error | Lower is better |
| **R²** | Variance explained | Closer to 1 is better |
| **MAE** | Average absolute error | Lower is better |
`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>📈 Linear Regression Demo</h2>
<div id="demo"></div>
<canvas id="chart" width="400" height="300"></canvas>

<script>
// Simple linear regression demo
const studyHours = [1, 2, 3, 4, 5, 6, 7, 8];
const testScores = [52, 58, 65, 70, 78, 82, 88, 95];

// Calculate linear regression
function linearRegression(x, y) {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
}

const { slope, intercept } = linearRegression(studyHours, testScores);

let html = "<h3>Study Hours vs Test Score</h3>";
html += "<p><b>Equation:</b> Score = " + slope.toFixed(2) + " × Hours + " + intercept.toFixed(2) + "</p>";

// Predictions
html += "<table style='width: 100%; border-collapse: collapse;'>";
html += "<tr style='background: #3776AB; color: white;'>";
html += "<th style='padding: 10px;'>Hours</th>";
html += "<th style='padding: 10px;'>Actual</th>";
html += "<th style='padding: 10px;'>Predicted</th></tr>";

studyHours.forEach((h, i) => {
  const predicted = slope * h + intercept;
  const bg = i % 2 === 0 ? "#f8f9fa" : "white";
  html += "<tr style='background: " + bg + ";'>";
  html += "<td style='padding: 10px;'>" + h + "</td>";
  html += "<td style='padding: 10px;'>" + testScores[i] + "</td>";
  html += "<td style='padding: 10px;'>" + predicted.toFixed(1) + "</td></tr>";
});
html += "</table>";

// Predict new value
const newHours = 10;
const prediction = slope * newHours + intercept;
html += "<h3>Prediction</h3>";
html += "<p>" + newHours + " hours of study → <b>" + prediction.toFixed(1) + "</b> predicted score</p>";

document.getElementById("demo").innerHTML = html;
</script>

</body>
</html>`,
    },
  };

  return pythonLessons[lessonSlug] || {
    title: 'Coming Soon',
    content: '## This lesson is coming soon!\n\nWe are preparing comprehensive content for this Python lesson. Check back soon!',
    tryItCode: `<!DOCTYPE html>
<html>
<body>
<h2>🐍 Python Lesson Coming Soon!</h2>
<p>This lesson content is being prepared with kid-friendly explanations and interactive examples.</p>
</body>
</html>`,
  };
};