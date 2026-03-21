import type { LessonContentPayload } from '../lessonContentTypes';

export const lessons: Record<string, LessonContentPayload> = {
  home: {
    title: 'Python Tutorial',
    content: `
# Python Tutorial

Python is a popular programming language.

## What is Python?

- Python is an interpreted, high-level programming language
- Python can be used for web development, data science, AI, and more
- Python has a simple syntax similar to English

## Python Example

<pre><code class="python">
print("Hello, World!")
</code></pre>

## Why Python?

- Python works on different platforms (Windows, Mac, Linux)
- Python has a simple syntax similar to English
- Python has syntax that allows developers to write programs with fewer lines
- Python runs on an interpreter system, meaning code can be executed immediately
    `,
    tryItCode: `# This is a Python comment
print("Hello, World!")

# Variables
name = "VerTechie"
age = 2024

print(f"Welcome to {name}!")
print(f"Year: {age}")

# Simple calculation
x = 5
y = 10
print(f"Sum: {x + y}")
`,
  },
};
