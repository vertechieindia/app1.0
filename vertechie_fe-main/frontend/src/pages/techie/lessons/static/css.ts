import type { LessonContentPayload } from '../lessonContentTypes';

export const lessons: Record<string, LessonContentPayload> = {
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
};
