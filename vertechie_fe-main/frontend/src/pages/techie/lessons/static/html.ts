import type { LessonContentPayload } from '../lessonContentTypes';

/** Inline lessons for HTML track (loaded only with html chunk). */
export const lessons: Record<string, LessonContentPayload> = {
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
};
