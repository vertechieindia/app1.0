import { generateHTMLLessonContent } from "./html";
import { generateCSSLessonContent } from "./css";
import { generateJSLessonContent } from "./javascript";
import { generateTSLessonContent } from "./typescript";
import { generateReactLessonContent } from "./react";
import { generateAngularLessonContent } from "./angular";
import { generatePythonLessonContent } from "./python";

export const getLessonContent = (tutorialSlug: string, lessonSlug: string) => {
  const contents: Record<string, Record<string, any>> = {
    html: {
      home: {
        title: 'HTML Tutorial',
        content: `
# Welcome to HTML Tutorial

HTML is the standard markup language for creating Web pages.

## What is HTML?

- HTML stands for **Hyper Text Markup Language**
- HTML is the standard markup language for creating Web pages
- HTML describes the structure of a Web page
- HTML consists of a series of elements
- HTML elements tell the browser how to display the content

## A Simple HTML Document

<pre><code class="html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;Page Title&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>
        `,
        tryItCode: `<!DOCTYPE html>
<html>
<head>
    <title>Page Title</title>
</head>
<body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
</body>
</html>`,
      },
      intro: {
        title: 'HTML Introduction',
        content: `
# HTML Introduction

HTML is the standard markup language for Web pages.

## What You Will Learn

In this tutorial, you will learn:

- How to create and structure web pages
- How to add headings, paragraphs, and lists
- How to add links and images
- How to create forms
- How to use semantic HTML5 elements

## HTML Documents

All HTML documents must start with a document type declaration: <code><!DOCTYPE html></code>

The HTML document itself begins with <code><html></code> and ends with <code></html></code>

The visible part of the HTML document is between <code><body></code> and <code></body></code>
        `,
        tryItCode: `<!DOCTYPE html>
<html>
<body>

<h1>This is a Heading</h1>
<p>This is a paragraph.</p>
<p>This is another paragraph.</p>

</body>
</html>`,
      },
      elements: {
        title: 'HTML Elements',
        content: `
# HTML Elements

An HTML element is defined by a start tag, some content, and an end tag.

## HTML Element Syntax

<pre><code class="">
&lt;tagname&gt;Content goes here...&lt;/tagname&gt;
</code></pre>

## Examples of HTML Elements

| Start tag | Element content | End tag |
|-----------|-----------------|---------|
| <code><h1></code> | My First Heading | <code></h1></code> |
| <code><p></code> | My first paragraph. | <code></p></code> |
| <code><br></code> | none | none |

## Nested HTML Elements

HTML elements can be nested (elements can contain other elements).

<pre><code class="html">
&lt;html&gt;
&lt;body&gt;
    &lt;h1&gt;My First Heading&lt;/h1&gt;
    &lt;p&gt;My first paragraph.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>
        `,
        tryItCode: `<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

<div style="background-color: #f0f0f0; padding: 20px;">
    <h2>Nested Elements</h2>
    <p>This paragraph is inside a div.</p>
</div>

</body>
</html>`,
      },
    },
    css: {
      home: {
        title: 'CSS Tutorial',
        content: `
# CSS Tutorial

CSS is the language we use to style a Web page.

## What is CSS?

- CSS stands for **Cascading Style Sheets**
- CSS describes how HTML elements are to be displayed on screen
- CSS saves a lot of work by controlling layout of multiple pages at once
- External stylesheets are stored in CSS files

## CSS Example

<pre><code class="css">
body {
    background-color: lightblue;
}

h1 {
    color: white;
    text-align: center;
}

p {
    font-family: verdana;
    font-size: 20px;
}
</code></pre>
        `,
        tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body {
    background-color: lightblue;
}

h1 {
    color: white;
    text-align: center;
}

p {
    font-family: verdana;
    font-size: 20px;
}
</style>
</head>
<body>

<h1>My First CSS Example</h1>
<p>This is a paragraph.</p>

</body>
</html>`,
      },
    },
    javascript: {
      home: {
        title: 'JavaScript Tutorial',
        content: `
# JavaScript Tutorial

JavaScript is the programming language of the Web.

## What is JavaScript?

- JavaScript is the world's most popular programming language
- JavaScript is the programming language of the Web
- JavaScript is easy to learn

## JavaScript Example

<pre><code class="javascript">
document.getElementById("demo").innerHTML = "Hello JavaScript!";
</code></pre>

## Why Study JavaScript?

JavaScript is one of the **3 languages** all web developers must learn:

1. **HTML** to define the content of web pages
2. **CSS** to specify the layout of web pages
3. **JavaScript** to program the behavior of web pages
        `,
        tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>My First JavaScript</h2>

<button type="button" onclick="document.getElementById('demo').innerHTML = Date()">
Click me to display Date and Time.
</button>

<p id="demo"></p>

</body>
</html>`,
      },
    },
    python: {
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
    },
  };

  // If lesson content exists, return it
  if (contents[tutorialSlug]?.[lessonSlug]) {
    return contents[tutorialSlug][lessonSlug];
  }

  // Generate dynamic content for HTML lessons that don't have explicit content
  if (tutorialSlug === 'html') {
    return generateHTMLLessonContent(lessonSlug);
  }

  // Generate dynamic content for CSS lessons
  if (tutorialSlug === 'css') {
    return generateCSSLessonContent(lessonSlug);
  }

  // Generate dynamic content for JavaScript lessons
  if (tutorialSlug === 'javascript') {
    return generateJSLessonContent(lessonSlug);
  }

  // Generate dynamic content for TypeScript lessons
  if (tutorialSlug === 'typescript') {
    return generateTSLessonContent(lessonSlug);
  }

  // Generate dynamic content for React lessons
  if (tutorialSlug === 'react') {
    return generateReactLessonContent(lessonSlug);
  }

  // Generate dynamic content for Angular lessons
  if (tutorialSlug === 'angular') {
    return generateAngularLessonContent(lessonSlug);
  }

  // Generate dynamic content for Python lessons
  if (tutorialSlug === 'python') {
    return generatePythonLessonContent(lessonSlug);
  }

  // Default fallback
  return {
    title: 'Lesson',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    tryItCode: '<!-- Code example coming soon -->',
  };
};