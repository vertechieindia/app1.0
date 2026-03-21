import type { LessonContentPayload } from '../lessonContentTypes';

export const lessons: Record<string, LessonContentPayload> = {
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
};
