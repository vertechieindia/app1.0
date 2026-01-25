export const generateHTMLLessonContent = (lessonSlug: string) => {
  const htmlLessons: Record<string, any> = {
    editors: {
      title: 'HTML Editors',
      content: `
# HTML Editors

Learn HTML using a professional code editor.

## Write HTML Using Notepad or TextEdit

Web pages can be created using simple text editors.

We recommend using a professional code editor to learn HTML:

- **Visual Studio Code** (Recommended) - Free, powerful, and widely used
- **Sublime Text** - Fast and lightweight
- **Atom** - Open source and customizable
- **Notepad++** - Simple and effective for Windows

## Why VS Code?

- Free and open source
- Great syntax highlighting
- Built-in terminal
- Extensions for HTML, CSS, JavaScript
- Live preview support
- IntelliSense (code completion)

## Step 1: Open VS Code

After installing VS Code, open it and create a new file.

## Step 2: Write Some HTML

<pre><code class="html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My First Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;Hello World!&lt;/h1&gt;
    &lt;p&gt;This is my first web page.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

## Step 3: Save the File

Save the file with a **.html** extension (e.g., <code>index.html</code>).

## Step 4: View in Browser

Open the HTML file in your web browser to see the result!
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
    <p>I created this using an HTML editor!</p>
</body>
</html>`,
    },
    basic: {
      title: 'HTML Basic Examples',
      content: `
# HTML Basic Examples

Let's look at some basic HTML examples.

## HTML Documents

All HTML documents must start with a document type declaration:

<pre><code class="html">
&lt;!DOCTYPE html&gt;
</code></pre>

The HTML document itself begins with <code><html></code> and ends with <code></html></code>.

The visible part is between <code><body></code> and <code></body></code>.

## HTML Headings

HTML headings are defined with <code><h1></code> to <code><h6></code> tags:

<pre><code class="html">
&lt;h1&gt;This is heading 1&lt;/h1&gt;
&lt;h2&gt;This is heading 2&lt;/h2&gt;
&lt;h3&gt;This is heading 3&lt;/h3&gt;
</code></pre>

## HTML Paragraphs

HTML paragraphs are defined with the <code><p></code> tag:

<pre><code class="html">
&lt;p&gt;This is a paragraph.&lt;/p&gt;
&lt;p&gt;This is another paragraph.&lt;/p&gt;
</code></pre>

## HTML Links

HTML links are defined with the <code><a></code> tag:

<pre><code class="html">
&lt;a href="https://www.vertechie.com"&gt;Visit VerTechie&lt;/a&gt;
</code></pre>

## HTML Images

HTML images are defined with the <code><img></code> tag:

<pre><code class="html">
&lt;img src="image.jpg" alt="Description" width="300" height="200"&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<h2>My Second Heading</h2>

<p>My first paragraph.</p>
<p>My second paragraph.</p>

<a href="https://www.vertechie.com" target="_blank">Visit VerTechie</a>

<br><br>

<img src="https://via.placeholder.com/300x200" alt="Placeholder Image">

</body>
</html>`,
    },
    attributes: {
      title: 'HTML Attributes',
      content: `
# HTML Attributes

HTML attributes provide additional information about elements.

## Key Points About Attributes

- All HTML elements can have **attributes**
- Attributes provide **additional information** about elements
- Attributes are always specified in the **start tag**
- Attributes usually come in **name/value pairs** like: <code>name="value"</code>

## The href Attribute

The <code><a></code> tag defines a hyperlink. The <code>href</code> attribute specifies the URL:

<pre><code class="html">
&lt;a href="https://www.vertechie.com"&gt;Visit VerTechie&lt;/a&gt;
</code></pre>

## The src Attribute

The <code><img></code> tag embeds an image. The <code>src</code> attribute specifies the path:

<pre><code class="html">
&lt;img src="image.jpg"&gt;
</code></pre>

## The width and height Attributes

The <code><img></code> tag should also have <code>width</code> and <code>height</code> attributes:

<pre><code class="html">
&lt;img src="image.jpg" width="500" height="300"&gt;
</code></pre>

## The alt Attribute

The <code>alt</code> attribute provides alternate text for an image:

<pre><code class="html">
&lt;img src="image.jpg" alt="A beautiful sunset"&gt;
</code></pre>

## The style Attribute

The <code>style</code> attribute adds styles to an element:

<pre><code class="html">
&lt;p style="color:red;"&gt;This is a red paragraph.&lt;/p&gt;
</code></pre>

## The title Attribute

The <code>title</code> attribute provides extra information (shown as a tooltip):

<pre><code class="html">
&lt;p title="I'm a tooltip"&gt;Hover over me!&lt;/p&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>HTML Attributes Example</h2>

<a href="https://www.vertechie.com" title="Go to VerTechie">Visit VerTechie</a>

<br><br>

<img src="https://via.placeholder.com/400x200" alt="Placeholder" width="400" height="200">

<p style="color: blue; font-size: 18px;">This paragraph has inline styles.</p>

<p title="This is a tooltip - hover to see!">Hover over this text to see the tooltip.</p>

</body>
</html>`,
    },
    headings: {
      title: 'HTML Headings',
      content: `
# HTML Headings

HTML headings are titles or subtitles that you want to display on a webpage.

## HTML Headings

Headings are defined with the <code><h1></code> to <code><h6></code> tags.

<code><h1></code> defines the most important heading. <code><h6></code> defines the least important heading.

<pre><code class="html">
&lt;h1&gt;Heading 1&lt;/h1&gt;
&lt;h2&gt;Heading 2&lt;/h2&gt;
&lt;h3&gt;Heading 3&lt;/h3&gt;
&lt;h4&gt;Heading 4&lt;/h4&gt;
&lt;h5&gt;Heading 5&lt;/h5&gt;
&lt;h6&gt;Heading 6&lt;/h6&gt;
</code></pre>

## Headings Are Important

- Search engines use the headings to index the structure and content of your web pages
- Users often skim a page by its headings
- Use <code><h1></code> for main headings, followed by <code><h2></code>, then <code><h3></code>, and so on

## Bigger Headings

Each HTML heading has a default size. However, you can specify the size:

<pre><code class="html">
&lt;h1 style="font-size:60px;"&gt;Heading 1&lt;/h1&gt;
</code></pre>

## Best Practices

- Use only ONE <code><h1></code> per page - the main title
- Don't skip heading levels (don't go from h1 to h3)
- Use headings for structure, not just to make text big
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h1>This is Heading 1 (Main Title)</h1>
<h2>This is Heading 2</h2>
<h3>This is Heading 3</h3>
<h4>This is Heading 4</h4>
<h5>This is Heading 5</h5>
<h6>This is Heading 6</h6>

<hr>

<h1 style="font-size: 50px; color: navy;">Custom Sized Heading</h1>

<h2 style="color: darkgreen;">Colored Heading</h2>

</body>
</html>`,
    },
    paragraphs: {
      title: 'HTML Paragraphs',
      content: `
# HTML Paragraphs

A paragraph always starts on a new line and is usually a block of text.

## HTML Paragraphs

The HTML <code><p></code> element defines a paragraph.

A paragraph always starts on a new line, and browsers automatically add some white space before and after.

<pre><code class="html">
&lt;p&gt;This is a paragraph.&lt;/p&gt;
&lt;p&gt;This is another paragraph.&lt;/p&gt;
</code></pre>

## HTML Display

You cannot be sure how HTML will be displayed.

Large or small screens, and resized windows will create different results.

With HTML, you cannot change the display by adding extra spaces or extra lines.

## HTML Line Breaks

The HTML <code><br></code> element defines a line break.

Use <code><br></code> if you want a line break without starting a new paragraph:

<pre><code class="html">
&lt;p&gt;This is&lt;br&gt;a paragraph&lt;br&gt;with line breaks.&lt;/p&gt;
</code></pre>

## The Poem Problem

This poem will display on a single line:

<pre><code class="html">
&lt;p&gt;
  Roses are red,
  Violets are blue,
  HTML is cool,
  And so are you!
&lt;/p&gt;
</code></pre>

## The pre Element

The <code><pre></code> element preserves both spaces and line breaks:

<pre><code class="html">
&lt;pre&gt;
  Roses are red,
  Violets are blue,
  HTML is cool,
  And so are you!
&lt;/pre&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>HTML Paragraphs</h2>

<p>This is a paragraph. It contains some text that will wrap according to the browser width.</p>

<p>This is another paragraph. Notice the automatic spacing between paragraphs.</p>

<h2>Line Breaks</h2>

<p>This text has a<br>line break<br>in the middle.</p>

<h2>Preformatted Text</h2>

<pre>
  Roses are red,
    Violets are blue,
      HTML is cool,
        And so are you!
</pre>

</body>
</html>`,
    },
    styles: {
      title: 'HTML Styles',
      content: `
# HTML Styles

The HTML <code>style</code> attribute is used to add styles to an element.

## The HTML Style Attribute

Setting the style of an HTML element can be done with the <code>style</code> attribute.

The syntax is:

<pre><code class="html">
&lt;tagname style="property:value;"&gt;
</code></pre>

## Background Color

The CSS <code>background-color</code> property defines the background color:

<pre><code class="html">
&lt;body style="background-color:powderblue;"&gt;
&lt;h1&gt;This is a heading&lt;/h1&gt;
&lt;p&gt;This is a paragraph.&lt;/p&gt;
&lt;/body&gt;
</code></pre>

## Text Color

The CSS <code>color</code> property defines the text color:

<pre><code class="html">
&lt;h1 style="color:blue;"&gt;This is a heading&lt;/h1&gt;
&lt;p style="color:red;"&gt;This is a paragraph.&lt;/p&gt;
</code></pre>

## Fonts

The CSS <code>font-family</code> property defines the font:

<pre><code class="html">
&lt;h1 style="font-family:verdana;"&gt;This is a heading&lt;/h1&gt;
&lt;p style="font-family:courier;"&gt;This is a paragraph.&lt;/p&gt;
</code></pre>

## Text Size

The CSS <code>font-size</code> property defines the text size:

<pre><code class="html">
&lt;h1 style="font-size:300%;"&gt;Big Heading&lt;/h1&gt;
&lt;p style="font-size:160%;"&gt;Big paragraph.&lt;/p&gt;
</code></pre>

## Text Alignment

The CSS <code>text-align</code> property defines the horizontal alignment:

<pre><code class="html">
&lt;h1 style="text-align:center;"&gt;Centered Heading&lt;/h1&gt;
&lt;p style="text-align:center;"&gt;Centered paragraph.&lt;/p&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body style="background-color: #f0f8ff;">

<h1 style="color: navy; text-align: center; font-family: Georgia;">
    Welcome to HTML Styles
</h1>

<p style="color: darkgreen; font-size: 18px; font-family: Arial;">
    This paragraph has green text with Arial font.
</p>

<p style="background-color: yellow; padding: 10px;">
    This paragraph has a yellow background.
</p>

<p style="color: white; background-color: black; padding: 15px; text-align: center;">
    White text on black background, centered!
</p>

</body>
</html>`,
    },
    formatting: {
      title: 'HTML Text Formatting',
      content: `
# HTML Text Formatting

HTML contains several elements for formatting text.

## Formatting Elements

- <code><b></code> - Bold text
- <code><strong></code> - Important text
- <code><i></code> - Italic text
- <code><em></code> - Emphasized text
- <code><mark></code> - Marked/highlighted text
- <code><small></code> - Smaller text
- <code><del></code> - Deleted text
- <code><ins></code> - Inserted text
- <code><sub></code> - Subscript text
- <code><sup></code> - Superscript text

## Bold and Strong

<pre><code class="html">
&lt;b&gt;This text is bold&lt;/b&gt;
&lt;strong&gt;This text is important!&lt;/strong&gt;
</code></pre>

## Italic and Emphasized

<pre><code class="html">
&lt;i&gt;This text is italic&lt;/i&gt;
&lt;em&gt;This text is emphasized&lt;/em&gt;
</code></pre>

## Marked Text

<pre><code class="html">
&lt;p&gt;Do not forget to buy &lt;mark&gt;milk&lt;/mark&gt; today.&lt;/p&gt;
</code></pre>

## Deleted and Inserted

<pre><code class="html">
&lt;p&gt;My favorite color is &lt;del&gt;blue&lt;/del&gt; &lt;ins&gt;red&lt;/ins&gt;.&lt;/p&gt;
</code></pre>

## Subscript and Superscript

<pre><code class="html">
&lt;p&gt;H&lt;sub&gt;2&lt;/sub&gt;O is water.&lt;/p&gt;
&lt;p&gt;2&lt;sup&gt;10&lt;/sup&gt; = 1024&lt;/p&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Text Formatting Examples</h2>

<p><b>Bold text</b> and <strong>Strong text</strong></p>

<p><i>Italic text</i> and <em>Emphasized text</em></p>

<p>This is <mark>highlighted</mark> text.</p>

<p>This is <small>smaller</small> text.</p>

<p>My favorite color is <del>blue</del> <ins>red</ins>.</p>

<p>Chemical formula for water: H<sub>2</sub>O</p>

<p>Mathematical expression: 2<sup>10</sup> = 1024</p>

<p>You can <b><i>combine</i></b> formatting elements!</p>

</body>
</html>`,
    },
    quotations: {
      title: 'HTML Quotations',
      content: `
# HTML Quotations

HTML has elements for quotations and citations.

## Blockquote

The <code><blockquote></code> element defines a section quoted from another source:

<pre><code class="html">
&lt;blockquote cite="http://www.worldwildlife.org"&gt;
    For 50 years, WWF has been protecting the future of nature.
&lt;/blockquote&gt;
</code></pre>

## Short Quotations

The <code><q></code> tag defines a short inline quotation:

<pre><code class="html">
&lt;p&gt;WWF's goal is to: &lt;q&gt;Build a future where people live in harmony with nature.&lt;/q&gt;&lt;/p&gt;
</code></pre>

## Abbreviations

The <code><abbr></code> tag defines an abbreviation or acronym:

<pre><code class="html">
&lt;p&gt;The &lt;abbr title="World Health Organization"&gt;WHO&lt;/abbr&gt; was founded in 1948.&lt;/p&gt;
</code></pre>

## Contact Information

The <code><address></code> tag defines contact information:

<pre><code class="html">
&lt;address&gt;
    Written by John Doe.&lt;br&gt;
    Visit us at: Example.com&lt;br&gt;
    Box 564, Disneyland
&lt;/address&gt;
</code></pre>

## Citations

The <code><cite></code> tag defines the title of a creative work:

<pre><code class="html">
&lt;p&gt;&lt;cite&gt;The Scream&lt;/cite&gt; by Edvard Munch. Painted in 1893.&lt;/p&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Blockquote Example</h2>
<blockquote style="border-left: 4px solid #ccc; padding-left: 16px; margin-left: 0;">
    The only way to do great work is to love what you do.
    - Steve Jobs
</blockquote>

<h2>Short Quote</h2>
<p>Einstein said: <q>Imagination is more important than knowledge.</q></p>

<h2>Abbreviation</h2>
<p>The <abbr title="HyperText Markup Language">HTML</abbr> is essential for web development.</p>

<h2>Contact Information</h2>
<address>
    VerTechie Learning Platform<br>
    123 Tech Street<br>
    Silicon Valley, CA 94000<br>
    Email: hello@vertechie.com
</address>

<h2>Citation</h2>
<p><cite>Clean Code</cite> by Robert C. Martin is a must-read for developers.</p>

</body>
</html>`,
    },
    comments: {
      title: 'HTML Comments',
      content: `
# HTML Comments

Comments are not displayed in the browser, but they can help document your HTML source code.

## HTML Comment Tag

You can add comments to your HTML source by using the following syntax:

<pre><code class="html">
&lt;!-- This is a comment --&gt;
</code></pre>

Notice that there is an exclamation point (!) in the start tag, but not in the end tag.

## Why Use Comments?

Comments are useful for:

- **Documentation**: Explain sections of code
- **Debugging**: Temporarily disable code
- **Collaboration**: Leave notes for other developers
- **Organization**: Mark different sections

## Hide Content

Comments can be used to hide content: <pre><code class="html">
&lt;p&gt;This is visible.&lt;/p&gt;
&lt;!-- &lt;p&gt;This is hidden.&lt;/p&gt; --&gt;
&lt;p&gt;This is also visible.&lt;/p&gt;
</code></pre>

## Multi-line Comments

Comments can span multiple lines:

<pre><code class="html">
&lt;!--
  This is a multi-line comment.
  It can span across several lines.
  Very useful for longer explanations.
--&gt;
</code></pre>

## Conditional Comments

Conditional comments were used for Internet Explorer (now deprecated):

<pre><code class="html">
&lt;!--[if IE 9]&gt;
    Special content for IE9
&lt;![endif]--&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<!-- This is the main heading -->
<h1>Welcome to HTML Comments</h1>

<!-- 
    This paragraph explains comments.
    Comments are invisible to users!
-->
<p>This text is visible in the browser.</p>

<!-- The following paragraph is commented out
<p>This text will NOT be displayed!</p>
-->

<!-- Navigation Section -->
<nav>
    <a href="#home">Home</a> |
    <a href="#about">About</a> |
    <a href="#contact">Contact</a>
</nav>

<!-- TODO: Add more content here -->

<p>View the page source to see the comments!</p>

</body>
</html>`,
    },
    colors: {
      title: 'HTML Colors',
      content: `
# HTML Colors

HTML colors are specified with predefined color names or with RGB, HEX, HSL values.

## Color Names

HTML supports 140 standard color names:

<pre><code class="html">
&lt;h1 style="color:Tomato;"&gt;Tomato&lt;/h1&gt;
&lt;h1 style="color:DodgerBlue;"&gt;DodgerBlue&lt;/h1&gt;
&lt;h1 style="color:MediumSeaGreen;"&gt;MediumSeaGreen&lt;/h1&gt;
</code></pre>

## Background Color

<pre><code class="html">
&lt;p style="background-color:Tomato;"&gt;Tomato Background&lt;/p&gt;
</code></pre>

## RGB Values

RGB values: <code>rgb(red, green, blue)</code>

<pre><code class="html">
&lt;h1 style="color:rgb(255, 99, 71);"&gt;RGB Color&lt;/h1&gt;
</code></pre>

## HEX Values

Hexadecimal: <code>#rrggbb</code>

<pre><code class="html">
&lt;h1 style="color:#ff6347;"&gt;HEX Color&lt;/h1&gt;
</code></pre>

## HSL Values

HSL: <code>hsl(hue, saturation, lightness)</code>

<pre><code class="html">
&lt;h1 style="color:hsl(9, 100%, 64%);"&gt;HSL Color&lt;/h1&gt;
</code></pre>

## RGBA and HSLA

Add alpha channel for transparency:

<pre><code class="html">
&lt;h1 style="color:rgba(255, 99, 71, 0.5);"&gt;50% Transparent&lt;/h1&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Color Names</h2>
<p style="background-color:Tomato; color:white; padding:10px;">Tomato</p>
<p style="background-color:DodgerBlue; color:white; padding:10px;">DodgerBlue</p>
<p style="background-color:MediumSeaGreen; color:white; padding:10px;">MediumSeaGreen</p>

<h2>RGB Colors</h2>
<p style="background-color:rgb(255, 99, 71); color:white; padding:10px;">rgb(255, 99, 71)</p>

<h2>HEX Colors</h2>
<p style="background-color:#ff6347; color:white; padding:10px;">#ff6347</p>

<h2>HSL Colors</h2>
<p style="background-color:hsl(9, 100%, 64%); color:white; padding:10px;">hsl(9, 100%, 64%)</p>

<h2>Transparency (RGBA)</h2>
<div style="background-color:rgba(255, 99, 71, 1); padding:10px; color:white;">100% opacity</div>
<div style="background-color:rgba(255, 99, 71, 0.6); padding:10px; color:white;">60% opacity</div>
<div style="background-color:rgba(255, 99, 71, 0.3); padding:10px;">30% opacity</div>

</body>
</html>`,
    },
    links: {
      title: 'HTML Links',
      content: `
# HTML Links

Links are found in nearly all web pages. Links allow users to navigate between pages.

## HTML Links - Hyperlinks

HTML links are hyperlinks. You can click on a link and jump to another document.

The HTML <code><a></code> tag defines a hyperlink:

<pre><code class="html">
&lt;a href="url"&gt;link text&lt;/a&gt;
</code></pre>

## The href Attribute

The most important attribute of <code><a></code> is <code>href</code>, which indicates the link's destination:

<pre><code class="html">
&lt;a href="https://www.vertechie.com"&gt;Visit VerTechie&lt;/a&gt;
</code></pre>

## The target Attribute

The <code>target</code> attribute specifies where to open the linked document:

- <code>_self</code> - Default. Opens in the same window/tab
- <code>_blank</code> - Opens in a new window/tab
- <code>_parent</code> - Opens in the parent frame
- <code>_top</code> - Opens in the full body of the window

<pre><code class="html">
&lt;a href="https://www.vertechie.com" target="_blank"&gt;Visit VerTechie&lt;/a&gt;
</code></pre>

## Link to Email

Use <code>mailto:</code> inside the href attribute:

<pre><code class="html">
&lt;a href="mailto:someone@example.com"&gt;Send Email&lt;/a&gt;
</code></pre>

## Link to Phone

Use <code>tel:</code> inside the href attribute:

<pre><code class="html">
&lt;a href="tel:+1234567890"&gt;Call Us&lt;/a&gt;
</code></pre>

## Link Styling

By default, links appear as:
- Unvisited: underlined and blue
- Visited: underlined and purple
- Active: underlined and red
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>HTML Links Examples</h2>

<h3>Basic Link</h3>
<a href="https://www.vertechie.com">Visit VerTechie</a>

<h3>Open in New Tab</h3>
<a href="https://www.google.com" target="_blank">Open Google in New Tab</a>

<h3>Link with Title</h3>
<a href="https://www.vertechie.com" title="Go to VerTechie Learning Platform">Hover for Title</a>

<h3>Email Link</h3>
<a href="mailto:hello@vertechie.com">Send us an Email</a>

<h3>Phone Link</h3>
<a href="tel:+1234567890">Call Us: +1 234 567 890</a>

<h3>Styled Link</h3>
<a href="#" style="color: green; text-decoration: none; font-weight: bold;">Custom Styled Link</a>

<h3>Image as Link</h3>
<a href="https://www.vertechie.com">
    <img src="https://via.placeholder.com/150x50?text=Click+Me" alt="Click me">
</a>

</body>
</html>`,
    },
    images: {
      title: 'HTML Images',
      content: `
# HTML Images

Images can improve the design and appearance of a web page.

## HTML Images Syntax

The HTML <code><img></code> tag is used to embed an image in a web page.

The <code><img></code> tag is empty - it contains attributes only and does not have a closing tag.

<pre><code class="html">
&lt;img src="url" alt="alternatetext"&gt;
</code></pre>

## Required Attributes

Two required attributes:

- **src** - Specifies the path to the image
- **alt** - Specifies alternate text for the image

<pre><code class="html">
&lt;img src="flower.jpg" alt="A beautiful flower"&gt;
</code></pre>

## Image Size - Width and Height

Use <code>width</code> and <code>height</code> attributes to specify size:

<pre><code class="html">
&lt;img src="flower.jpg" alt="Flower" width="500" height="300"&gt;
</code></pre>

Or use the <code>style</code> attribute:

<pre><code class="html">
&lt;img src="flower.jpg" alt="Flower" style="width:500px;height:300px;"&gt;
</code></pre>

## Image Floating

Use CSS <code>float</code> to let an image float:

<pre><code class="html">
&lt;img src="flower.jpg" alt="Flower" style="float:right;"&gt;
</code></pre>

## Common Image Formats

- **.jpg/.jpeg** - Good for photographs
- **.png** - Good for graphics with transparency
- **.gif** - Good for animations
- **.svg** - Scalable vector graphics
- **.webp** - Modern format, smaller file size
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>HTML Images Examples</h2>

<h3>Basic Image</h3>
<img src="https://via.placeholder.com/300x200" alt="Placeholder Image">

<h3>Image with Custom Size</h3>
<img src="https://via.placeholder.com/600x400" alt="Large Image" width="300" height="200">

<h3>Floating Image</h3>
<img src="https://via.placeholder.com/150x150" alt="Float Right" style="float:right; margin-left:15px;">
<p>This text will wrap around the floating image. Lorem ipsum dolor sit amet, consectetur adipiscing elit. The image is floating to the right side.</p>
<p style="clear:both;"></p>

<h3>Rounded Image</h3>
<img src="https://via.placeholder.com/150x150" alt="Rounded" style="border-radius:50%;">

<h3>Image with Border</h3>
<img src="https://via.placeholder.com/200x150" alt="Bordered" style="border:5px solid #333;">

</body>
</html>`,
    },
    favicon: {
      title: 'HTML Favicon',
      content: `
# HTML Favicon

A favicon is a small image displayed next to the page title in the browser tab.

## What is a Favicon?

A favicon is a small 16x16 pixel icon used in web browsers to represent a website.

## How to Add a Favicon

You can add a favicon to your website using the <code><link></code> element in the <code><head></code> section:

<pre><code class="html">
&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
    &lt;title&gt;My Page Title&lt;/title&gt;
    &lt;link rel="icon" type="image/x-icon" href="/images/favicon.ico"&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;My Page&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>

## Favicon File Formats

Common favicon formats include:

- **.ico** - Traditional format, works everywhere
- **.png** - Modern browsers support this
- **.svg** - Scalable, modern browsers
- **.gif** - Animated favicons (limited support)

## Modern Favicon Tags

For better browser support, use multiple sizes:

<pre><code class="html">
&lt;link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"&gt;
&lt;link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
</code></pre>

## Creating a Favicon

You can create a favicon using:
- Online favicon generators
- Image editing software like Photoshop or GIMP
- Convert any image to .ico format online
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
    <title>Favicon Example</title>
    <!-- Note: This won't show the favicon in the preview, 
         but shows the correct HTML structure -->
    <link rel="icon" type="image/png" href="https://via.placeholder.com/16x16">
</head>
<body>

<h1>HTML Favicon</h1>

<p>A favicon appears in the browser tab next to your page title.</p>

<h2>How to Add a Favicon</h2>
<pre>
&lt;head&gt;
    &lt;link rel="icon" type="image/x-icon" href="/favicon.ico"&gt;
&lt;/head&gt;
</pre>

<h2>Common Favicon Sizes</h2>
<ul>
    <li>16x16 - Browser tabs</li>
    <li>32x32 - Taskbar shortcut</li>
    <li>48x48 - Desktop shortcut</li>
    <li>180x180 - Apple touch icon</li>
</ul>

</body>
</html>`,
    },
    tables: {
      title: 'HTML Tables',
      content: `
# HTML Tables

HTML tables allow you to arrange data into rows and columns.

## Define an HTML Table

A table in HTML consists of table cells inside rows and columns.

<pre><code class="html">
&lt;table&gt;
  &lt;tr&gt;
    &lt;th&gt;Company&lt;/th&gt;
    &lt;th&gt;Contact&lt;/th&gt;
  &lt;/tr&gt;
  &lt;tr&gt;
    &lt;td&gt;Apple&lt;/td&gt;
    &lt;td&gt;Tim Cook&lt;/td&gt;
  &lt;/tr&gt;
&lt;/table&gt;
</code></pre>

## Table Elements

- <code><table></code> - Defines a table
- <code><tr></code> - Defines a table row
- <code><th></code> - Defines a table header cell
- <code><td></code> - Defines a table data cell
- <code><caption></code> - Defines a table caption
- <code><thead></code> - Groups header content
- <code><tbody></code> - Groups body content
- <code><tfoot></code> - Groups footer content

## Table Borders

Add a border using CSS:

<pre><code class="html">
&lt;style&gt;
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
&lt;/style&gt;
</code></pre>

## Column Span and Row Span

Cells can span multiple columns or rows:

<pre><code class="html">
&lt;td colspan="2"&gt;Spans 2 columns&lt;/td&gt;
&lt;td rowspan="2"&gt;Spans 2 rows&lt;/td&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
th {
  background-color: #4CAF50;
  color: white;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr:hover {
  background-color: #ddd;
}
</style>
</head>
<body>

<h2>Styled HTML Table</h2>

<table>
  <caption>Employee Information</caption>
  <thead>
    <tr>
      <th>Name</th>
      <th>Position</th>
      <th>Office</th>
      <th>Salary</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Developer</td>
      <td>New York</td>
      <td>$85,000</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>Designer</td>
      <td>London</td>
      <td>$75,000</td>
    </tr>
    <tr>
      <td>Mike Johnson</td>
      <td>Manager</td>
      <td colspan="2">San Francisco - $95,000</td>
    </tr>
  </tbody>
</table>

</body>
</html>`,
    },
    lists: {
      title: 'HTML Lists',
      content: `
# HTML Lists

HTML lists allow you to group a set of related items.

## Unordered HTML List

An unordered list uses the <code><ul></code> tag. List items use <code><li></code>:

<pre><code class="html">
&lt;ul&gt;
  &lt;li&gt;Coffee&lt;/li&gt;
  &lt;li&gt;Tea&lt;/li&gt;
  &lt;li&gt;Milk&lt;/li&gt;
&lt;/ul&gt;
</code></pre>

## Ordered HTML List

An ordered list uses the <code><ol></code> tag:

<pre><code class="html">
&lt;ol&gt;
  &lt;li&gt;First item&lt;/li&gt;
  &lt;li&gt;Second item&lt;/li&gt;
  &lt;li&gt;Third item&lt;/li&gt;
&lt;/ol&gt;
</code></pre>

## Description Lists

A description list uses <code><dl></code>, <code><dt></code>, and <code><dd></code>:

<pre><code class="html">
&lt;dl&gt;
  &lt;dt&gt;Coffee&lt;/dt&gt;
  &lt;dd&gt;- hot drink&lt;/dd&gt;
  &lt;dt&gt;Milk&lt;/dt&gt;
  &lt;dd&gt;- cold drink&lt;/dd&gt;
&lt;/dl&gt;
</code></pre>

## List Style Types

Unordered list markers:
- <code>disc</code> (default)
- <code>circle</code>
- <code>square</code>
- <code>none</code>

Ordered list types:
- <code>1</code> - Numbers (default)
- <code>A</code> - Uppercase letters
- <code>a</code> - Lowercase letters
- <code>I</code> - Uppercase Roman numerals
- <code>i</code> - Lowercase Roman numerals

## Nested Lists

Lists can be nested inside each other:

<pre><code class="html">
&lt;ul&gt;
  &lt;li&gt;Coffee&lt;/li&gt;
  &lt;li&gt;Tea
    &lt;ul&gt;
      &lt;li&gt;Black tea&lt;/li&gt;
      &lt;li&gt;Green tea&lt;/li&gt;
    &lt;/ul&gt;
  &lt;/li&gt;
&lt;/ul&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>Unordered List</h2>
<ul>
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>

<h2>Ordered List</h2>
<ol>
  <li>Wake up</li>
  <li>Code</li>
  <li>Sleep</li>
  <li>Repeat</li>
</ol>

<h2>Different List Types</h2>
<ol type="A">
  <li>Apple</li>
  <li>Banana</li>
  <li>Cherry</li>
</ol>

<ol type="I">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>

<h2>Nested List</h2>
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>Python</li>
      <li>Node.js</li>
    </ul>
  </li>
</ul>

<h2>Custom Style List</h2>
<ul style="list-style-type: square;">
  <li>Square bullets</li>
  <li>Look different</li>
</ul>

</body>
</html>`,
    },
    forms: {
      title: 'HTML Forms',
      content: `
# HTML Forms

An HTML form is used to collect user input.

## The <form> Element

The HTML <code><form></code> element defines a form:

<pre><code class="html">
&lt;form action="/submit" method="post"&gt;
  form elements...
&lt;/form&gt;
</code></pre>

## Form Attributes

- **action** - Where to send form data
- **method** - HTTP method (GET or POST)
- **target** - Where to display response
- **autocomplete** - Enable/disable autocomplete

## The <input> Element

The most used form element:

<pre><code class="html">
&lt;input type="text" name="username"&gt;
&lt;input type="password" name="password"&gt;
&lt;input type="submit" value="Submit"&gt;
</code></pre>

## Common Input Types

- <code>text</code> - Single-line text input
- <code>password</code> - Password field (masked)
- <code>email</code> - Email address
- <code>number</code> - Numeric input
- <code>checkbox</code> - Checkbox
- <code>radio</code> - Radio button
- <code>submit</code> - Submit button
- <code>reset</code> - Reset button
- <code>file</code> - File upload
- <code>date</code> - Date picker
- <code>color</code> - Color picker

## The <label> Element

The <code><label></code> element defines a label for form elements:

<pre><code class="html">
&lt;label for="username"&gt;Username:&lt;/label&gt;
&lt;input type="text" id="username" name="username"&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
form {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
label {
  display: block;
  margin-top: 15px;
  font-weight: bold;
}
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
input[type="submit"] {
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
input[type="submit"]:hover {
  background-color: #45a049;
}
</style>
</head>
<body>

<h2>Registration Form</h2>

<form action="/submit" method="post">
  <label for="name">Full Name:</label>
  <input type="text" id="name" name="name" placeholder="Enter your name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" placeholder="Enter your email" required>

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" placeholder="Enter password" required>

  <label>Gender:</label>
  <input type="radio" name="gender" value="male" id="male">
  <label for="male" style="display:inline;">Male</label>
  <input type="radio" name="gender" value="female" id="female">
  <label for="female" style="display:inline;">Female</label>

  <label>
    <input type="checkbox" name="newsletter" value="yes">
    Subscribe to newsletter
  </label>

  <input type="submit" value="Register">
</form>

</body>
</html>`,
    },
    'form-elements': {
      title: 'HTML Form Elements',
      content: `
# HTML Form Elements

HTML forms contain form elements for user input.

## The <input> Element

The most important form element. Can be displayed in many ways:

<pre><code class="html">
&lt;input type="text"&gt;
&lt;input type="checkbox"&gt;
&lt;input type="radio"&gt;
&lt;input type="submit"&gt;
</code></pre>

## The <select> Element

Defines a drop-down list:

<pre><code class="html">
&lt;select name="cars"&gt;
  &lt;option value="volvo"&gt;Volvo&lt;/option&gt;
  &lt;option value="bmw"&gt;BMW&lt;/option&gt;
  &lt;option value="mercedes"&gt;Mercedes&lt;/option&gt;
&lt;/select&gt;
</code></pre>

## The <textarea> Element

Defines a multi-line text input area:

<pre><code class="html">
&lt;textarea name="message" rows="4" cols="50"&gt;
Enter text here...
&lt;/textarea&gt;
</code></pre>

## The <button> Element

Defines a clickable button:

<pre><code class="html">
&lt;button type="button"&gt;Click Me!&lt;/button&gt;
&lt;button type="submit"&gt;Submit&lt;/button&gt;
&lt;button type="reset"&gt;Reset&lt;/button&gt;
</code></pre>

## The <fieldset> and <legend> Elements

Group related form elements:

<pre><code class="html">
&lt;fieldset&gt;
  &lt;legend&gt;Personal Info&lt;/legend&gt;
  &lt;label for="name"&gt;Name:&lt;/label&gt;
  &lt;input type="text" id="name"&gt;
&lt;/fieldset&gt;
</code></pre>

## The <datalist> Element

Provides pre-defined options for an input:

<pre><code class="html">
&lt;input list="browsers"&gt;
&lt;datalist id="browsers"&gt;
  &lt;option value="Chrome"&gt;
  &lt;option value="Firefox"&gt;
  &lt;option value="Safari"&gt;
&lt;/datalist&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
fieldset {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
legend {
  font-weight: bold;
  color: #333;
}
label { display: block; margin: 10px 0 5px; }
input, select, textarea { padding: 8px; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
button { padding: 10px 20px; margin: 5px; cursor: pointer; }
</style>
</head>
<body>

<h2>HTML Form Elements</h2>

<form>
  <fieldset>
    <legend>Personal Information</legend>
    
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" placeholder="Your name">
    
    <label for="country">Country:</label>
    <select id="country" name="country">
      <option value="">Select a country</option>
      <option value="usa">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="india">India</option>
      <option value="germany">Germany</option>
    </select>
    
    <label for="browser">Favorite Browser:</label>
    <input type="text" id="browser" name="browser" list="browsers" placeholder="Type or select">
    <datalist id="browsers">
      <option value="Chrome">
      <option value="Firefox">
      <option value="Safari">
      <option value="Edge">
    </datalist>
  </fieldset>

  <fieldset>
    <legend>Your Message</legend>
    <label for="message">Message:</label>
    <textarea id="message" name="message" rows="4" placeholder="Enter your message here..."></textarea>
  </fieldset>

  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
  <button type="button" onclick="alert('Button clicked!')">Click Me</button>
</form>

</body>
</html>`,
    },
    'input-types': {
      title: 'HTML Input Types',
      content: `
# HTML Input Types

HTML supports various input types for different data.

## Text Input Types

<pre><code class="html">
&lt;input type="text"&gt;      &lt;!-- Single-line text --&gt;
&lt;input type="password"&gt;  &lt;!-- Password (masked) --&gt;
&lt;input type="email"&gt;     &lt;!-- Email address --&gt;
&lt;input type="url"&gt;       &lt;!-- URL --&gt;
&lt;input type="tel"&gt;       &lt;!-- Telephone number --&gt;
&lt;input type="search"&gt;    &lt;!-- Search field --&gt;
</code></pre>

## Number Input Types

<pre><code class="html">
&lt;input type="number" min="1" max="100"&gt;
&lt;input type="range" min="0" max="100"&gt;
</code></pre>

## Date and Time Types

<pre><code class="html">
&lt;input type="date"&gt;           &lt;!-- Date picker --&gt;
&lt;input type="time"&gt;           &lt;!-- Time picker --&gt;
&lt;input type="datetime-local"&gt; &lt;!-- Date and time --&gt;
&lt;input type="month"&gt;          &lt;!-- Month and year --&gt;
&lt;input type="week"&gt;           &lt;!-- Week and year --&gt;
</code></pre>

## Selection Types

<pre><code class="html">
&lt;input type="checkbox"&gt;  &lt;!-- Checkbox --&gt;
&lt;input type="radio"&gt;     &lt;!-- Radio button --&gt;
&lt;input type="color"&gt;     &lt;!-- Color picker --&gt;
&lt;input type="file"&gt;      &lt;!-- File upload --&gt;
</code></pre>

## Button Types

<pre><code class="html">
&lt;input type="submit"&gt;  &lt;!-- Submit form --&gt;
&lt;input type="reset"&gt;   &lt;!-- Reset form --&gt;
&lt;input type="button"&gt;  &lt;!-- Clickable button --&gt;
&lt;input type="image"&gt;   &lt;!-- Image as submit button --&gt;
</code></pre>

## Special Types

<pre><code class="html">
&lt;input type="hidden"&gt;  &lt;!-- Hidden field --&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.input-group { margin: 15px 0; }
label { display: block; font-weight: bold; margin-bottom: 5px; }
input { padding: 8px; margin-bottom: 5px; }
</style>
</head>
<body>

<h2>HTML Input Types Demo</h2>

<form>
  <div class="input-group">
    <label>Text:</label>
    <input type="text" placeholder="Enter text">
  </div>

  <div class="input-group">
    <label>Password:</label>
    <input type="password" placeholder="Enter password">
  </div>

  <div class="input-group">
    <label>Email:</label>
    <input type="email" placeholder="email@example.com">
  </div>

  <div class="input-group">
    <label>Number (1-100):</label>
    <input type="number" min="1" max="100" value="50">
  </div>

  <div class="input-group">
    <label>Range:</label>
    <input type="range" min="0" max="100" value="50">
  </div>

  <div class="input-group">
    <label>Date:</label>
    <input type="date">
  </div>

  <div class="input-group">
    <label>Time:</label>
    <input type="time">
  </div>

  <div class="input-group">
    <label>Color:</label>
    <input type="color" value="#4CAF50">
  </div>

  <div class="input-group">
    <label>File:</label>
    <input type="file">
  </div>

  <div class="input-group">
    <label>Checkbox:</label>
    <input type="checkbox" id="agree">
    <label for="agree" style="display:inline; font-weight:normal;">I agree to terms</label>
  </div>

  <input type="submit" value="Submit Form">
</form>

</body>
</html>`,
    },
    'input-attributes': {
      title: 'HTML Input Attributes',
      content: `
# HTML Input Attributes

HTML input elements have many useful attributes.

## The value Attribute

Specifies the initial value:

<pre><code class="html">
&lt;input type="text" value="John"&gt;
</code></pre>

## The placeholder Attribute

Specifies a hint that describes the expected value:

<pre><code class="html">
&lt;input type="text" placeholder="Enter your name"&gt;
</code></pre>

## The required Attribute

Specifies that the field must be filled out:

<pre><code class="html">
&lt;input type="text" required&gt;
</code></pre>

## The readonly and disabled Attributes

<pre><code class="html">
&lt;input type="text" value="John" readonly&gt;
&lt;input type="text" value="Jane" disabled&gt;
</code></pre>

## Size and Maxlength

<pre><code class="html">
&lt;input type="text" size="30" maxlength="50"&gt;
</code></pre>

## Min and Max

For number and date inputs:

<pre><code class="html">
&lt;input type="number" min="1" max="100"&gt;
&lt;input type="date" min="2020-01-01" max="2025-12-31"&gt;
</code></pre>

## Pattern Attribute

Specifies a regex pattern:

<pre><code class="html">
&lt;input type="text" pattern="[A-Za-z]{3}" title="Three letters"&gt;
</code></pre>

## Autofocus and Autocomplete

<pre><code class="html">
&lt;input type="text" autofocus&gt;
&lt;input type="text" autocomplete="off"&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.form-group { margin: 15px 0; }
label { display: block; font-weight: bold; margin-bottom: 5px; color: #333; }
input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; width: 100%; max-width: 300px; box-sizing: border-box; }
input:focus { border-color: #4CAF50; outline: none; }
input:invalid { border-color: #f44336; }
.hint { font-size: 12px; color: #666; margin-top: 5px; }
</style>
</head>
<body>

<h2>Input Attributes Demo</h2>

<form>
  <div class="form-group">
    <label>With Value:</label>
    <input type="text" value="Pre-filled value">
  </div>

  <div class="form-group">
    <label>With Placeholder:</label>
    <input type="text" placeholder="Type something here...">
  </div>

  <div class="form-group">
    <label>Required Field: *</label>
    <input type="text" required placeholder="This field is required">
    <div class="hint">This field must be filled out</div>
  </div>

  <div class="form-group">
    <label>Readonly:</label>
    <input type="text" value="Cannot edit this" readonly>
  </div>

  <div class="form-group">
    <label>Disabled:</label>
    <input type="text" value="Disabled field" disabled>
  </div>

  <div class="form-group">
    <label>Max Length (10 chars):</label>
    <input type="text" maxlength="10" placeholder="Max 10 characters">
  </div>

  <div class="form-group">
    <label>Pattern (3 letters only):</label>
    <input type="text" pattern="[A-Za-z]{3}" title="Exactly 3 letters" placeholder="ABC">
    <div class="hint">Enter exactly 3 letters</div>
  </div>

  <div class="form-group">
    <label>Number with Min/Max:</label>
    <input type="number" min="1" max="100" value="50">
    <div class="hint">Value between 1 and 100</div>
  </div>

  <input type="submit" value="Submit" style="margin-top:20px; padding:12px 24px; background:#4CAF50; color:white; border:none; cursor:pointer;">
</form>

</body>
</html>`,
    },
    semantics: {
      title: 'HTML Semantics',
      content: `
# HTML Semantic Elements

Semantic elements clearly describe their meaning to both the browser and the developer.

## What are Semantic Elements?

- **Semantic elements**: <code><form></code>, <code><table></code>, <code><article></code> - clearly define content
- **Non-semantic elements**: <code><div></code>, <code><span></code> - tell nothing about content

## Semantic Elements in HTML5

- <code><article></code> - Independent, self-contained content
- <code><aside></code> - Content aside from the main content
- <code><details></code> - Additional details user can view/hide
- <code><figcaption></code> - Caption for a <code><figure></code>
- <code><figure></code> - Self-contained content like images
- <code><footer></code> - Footer for a document or section
- <code><header></code> - Header for a document or section
- <code><main></code> - Main content of a document
- <code><mark></code> - Marked/highlighted text
- <code><nav></code> - Navigation links
- <code><section></code> - Section in a document
- <code><summary></code> - Visible heading for a <code><details></code>
- <code><time></code> - Date/time

## Why Use Semantic HTML?

- **Accessibility**: Screen readers understand content better
- **SEO**: Search engines can index content properly
- **Maintainability**: Easier to read and understand code
- **Styling**: Easier to style with CSS
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; line-height: 1.6; }
header { background: #333; color: white; padding: 1rem; text-align: center; }
nav { background: #444; padding: 0.5rem; }
nav a { color: white; margin: 0 15px; text-decoration: none; }
nav a:hover { text-decoration: underline; }
main { padding: 20px; max-width: 800px; margin: 0 auto; }
article { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; }
aside { background: #e0e0e0; padding: 15px; margin: 20px 0; border-left: 4px solid #333; }
section { margin: 20px 0; }
footer { background: #333; color: white; text-align: center; padding: 1rem; margin-top: 20px; }
</style>
</head>
<body>

<header>
  <h1>Semantic HTML5</h1>
  <p>Building meaningful web pages</p>
</header>

<nav>
  <a href="#home">Home</a>
  <a href="#about">About</a>
  <a href="#services">Services</a>
  <a href="#contact">Contact</a>
</nav>

<main>
  <article>
    <h2>What is Semantic HTML?</h2>
    <p>Semantic HTML uses meaningful tags that describe the content they contain.</p>
    <p>Published on <time datetime="2024-01-15">January 15, 2024</time></p>
  </article>

  <section>
    <h2>Benefits</h2>
    <ul>
      <li>Better accessibility</li>
      <li>Improved SEO</li>
      <li>Cleaner code</li>
    </ul>
  </section>

  <aside>
    <h3>Did you know?</h3>
    <p>Screen readers use semantic elements to help visually impaired users navigate websites!</p>
  </aside>

  <figure>
    <img src="https://via.placeholder.com/400x200" alt="Semantic HTML" style="width:100%;">
    <figcaption>Figure 1: Semantic HTML Structure</figcaption>
  </figure>
</main>

<footer>
  <p>&copy; 2024 VerTechie Learning. All rights reserved.</p>
</footer>

</body>
</html>`,
    },
    layout: {
      title: 'HTML Layout',
      content: `
# HTML Layout Elements

HTML has semantic elements that define different parts of a web page.

## HTML5 Layout Elements

- <code><header></code> - Top section of page/section
- <code><nav></code> - Navigation menu
- <code><main></code> - Main content area
- <code><article></code> - Independent content
- <code><section></code> - Thematic grouping
- <code><aside></code> - Sidebar content
- <code><footer></code> - Bottom section of page/section

## Layout Techniques

### CSS Flexbox

<pre><code class="css">
.container {
  display: flex;
}
</code></pre>

### CSS Grid

<pre><code class="css">
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
</code></pre>

### CSS Float (older method)

<pre><code class="css">
.sidebar {
  float: left;
  width: 25%;
}
</code></pre>

## A Simple Layout Structure

<pre><code class="html">
&lt;header&gt;Header&lt;/header&gt;
&lt;nav&gt;Navigation&lt;/nav&gt;
&lt;main&gt;
  &lt;article&gt;Main Content&lt;/article&gt;
  &lt;aside&gt;Sidebar&lt;/aside&gt;
&lt;/main&gt;
&lt;footer&gt;Footer&lt;/footer&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; }

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  text-align: center;
}

nav {
  background: #333;
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
nav a {
  color: white;
  text-decoration: none;
  padding: 5px 15px;
}
nav a:hover {
  background: #555;
  border-radius: 4px;
}

.container {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

main {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

aside {
  background: #e0e0e0;
  padding: 20px;
  border-radius: 8px;
}

footer {
  background: #333;
  color: white;
  text-align: center;
  padding: 20px;
  margin-top: 20px;
}

article {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
</style>
</head>
<body>

<header>
  <h1>My Website</h1>
  <p>A Modern CSS Grid Layout</p>
</header>

<nav>
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
</nav>

<div class="container">
  <main>
    <article>
      <h2>Welcome!</h2>
      <p>This is a modern HTML layout using CSS Grid. The layout is responsive and organized using semantic HTML5 elements.</p>
    </article>
    <article>
      <h2>Another Article</h2>
      <p>Each article is self-contained and can be styled independently.</p>
    </article>
  </main>

  <aside>
    <h3>Sidebar</h3>
    <p>This is the aside content. Great for navigation, ads, or related links.</p>
    <h4>Quick Links</h4>
    <ul>
      <li>Link 1</li>
      <li>Link 2</li>
      <li>Link 3</li>
    </ul>
  </aside>
</div>

<footer>
  <p>&copy; 2024 VerTechie. All rights reserved.</p>
</footer>

</body>
</html>`,
    },
    responsive: {
      title: 'HTML Responsive',
      content: `
# Responsive Web Design

Responsive web design makes your web page look good on all devices.

## Setting The Viewport

Use the viewport meta tag in your HTML:

<pre><code class="html">
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
</code></pre>

## Responsive Images

Images should never be larger than their container:

<pre><code class="css">
img {
  max-width: 100%;
  height: auto;
}
</code></pre>

## Responsive Text Size

Use viewport width (vw) for responsive text:

<pre><code class="css">
h1 {
  font-size: 5vw;
}
</code></pre>

## Media Queries

Apply different styles for different screen sizes:

<pre><code class="css">
@media screen and (max-width: 768px) {
  .column {
    width: 100%;
  }
}
</code></pre>

## Common Breakpoints

- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Laptop**: 769px - 1024px
- **Desktop**: 1025px - 1200px
- **Large screens**: 1201px and above

## Flexbox for Responsive Layouts

<pre><code class="css">
.container {
  display: flex;
  flex-wrap: wrap;
}
.item {
  flex: 1 1 300px;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Arial, sans-serif; padding: 20px; }

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.responsive-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

h1 {
  font-size: calc(1.5rem + 2vw);
  margin-bottom: 20px;
  color: #333;
}

/* Mobile styles */
@media screen and (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
    text-align: center;
  }
  .card {
    flex: 1 1 100%;
  }
}

.info-box {
  background: #f0f0f0;
  padding: 15px;
  margin: 20px 0;
  border-radius: 8px;
}
</style>
</head>
<body>

<h1>Responsive Design Demo</h1>

<div class="info-box">
  <strong>Resize the window</strong> to see responsive behavior!
</div>

<div class="container">
  <div class="card">
    <h2>📱 Mobile First</h2>
    <p>Design for mobile, then scale up</p>
  </div>
  <div class="card">
    <h2>🖥️ Desktop</h2>
    <p>Looks great on large screens</p>
  </div>
  <div class="card">
    <h2>📊 Flexible</h2>
    <p>Adapts to any screen size</p>
  </div>
</div>

<h2 style="margin: 30px 0 15px;">Responsive Image</h2>
<img src="https://via.placeholder.com/800x400" alt="Responsive" class="responsive-img">

</body>
</html>`,
    },
    head: {
      title: 'HTML Head',
      content: `
# HTML Head Element

The <code><head></code> element contains meta information about the document.

## The HTML <head> Element

The <code><head></code> element is a container for metadata:

<pre><code class="html">
&lt;head&gt;
  &lt;title&gt;Page Title&lt;/title&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
</code></pre>

## The <title> Element

Defines the document title shown in the browser tab:

<pre><code class="html">
&lt;title&gt;My Website - Home Page&lt;/title&gt;
</code></pre>

## The <meta> Element

Specifies metadata about the HTML document:

<pre><code class="html">
&lt;!-- Character encoding --&gt;
&lt;meta charset="UTF-8"&gt;

&lt;!-- Viewport for responsive design --&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;

&lt;!-- Page description for SEO --&gt;
&lt;meta name="description" content="Free web tutorials"&gt;

&lt;!-- Keywords for SEO --&gt;
&lt;meta name="keywords" content="HTML, CSS, JavaScript"&gt;

&lt;!-- Author --&gt;
&lt;meta name="author" content="John Doe"&gt;
</code></pre>

## The <link> Element

Links external resources like stylesheets:

<pre><code class="html">
&lt;link rel="stylesheet" href="styles.css"&gt;
&lt;link rel="icon" href="favicon.ico"&gt;
</code></pre>

## The <style> Element

Defines internal CSS styles:

<pre><code class="html">
&lt;style&gt;
  body { background-color: #f0f0f0; }
&lt;/style&gt;
</code></pre>

## The <script> Element

Links JavaScript files:

<pre><code class="html">
&lt;script src="script.js"&gt;&lt;/script&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Character Encoding -->
  <meta charset="UTF-8">
  
  <!-- Viewport for Responsive Design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="Learn about the HTML head element">
  <meta name="keywords" content="HTML, Head, Meta, SEO">
  <meta name="author" content="VerTechie">
  
  <!-- Open Graph for Social Media -->
  <meta property="og:title" content="HTML Head Element">
  <meta property="og:description" content="Learn about HTML head">
  
  <!-- Page Title -->
  <title>HTML Head Element | VerTechie Tutorial</title>
  
  <!-- Internal Styles -->
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      background: #f5f5f5;
    }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    .code-block {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
    }
    .meta-tag { color: #66d9ef; }
    .attr { color: #a6e22e; }
    .value { color: #e6db74; }
  </style>
</head>
<body>

<h1>The HTML &lt;head&gt; Element</h1>

<p>Look at this page's source code to see all the meta tags in the &lt;head&gt; section!</p>

<h2>What's in the Head?</h2>
<ul>
  <li><strong>&lt;title&gt;</strong> - Page title (shown in browser tab)</li>
  <li><strong>&lt;meta charset&gt;</strong> - Character encoding</li>
  <li><strong>&lt;meta viewport&gt;</strong> - Responsive settings</li>
  <li><strong>&lt;meta description&gt;</strong> - SEO description</li>
  <li><strong>&lt;link&gt;</strong> - External resources</li>
  <li><strong>&lt;style&gt;</strong> - Internal CSS</li>
  <li><strong>&lt;script&gt;</strong> - JavaScript</li>
</ul>

<h2>Example Head Section</h2>
<div class="code-block">
<pre>
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width"&gt;
  &lt;title&gt;My Page&lt;/title&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
</pre>
</div>

</body>
</html>`,
    },
  };

  return htmlLessons[lessonSlug] || {
    title: 'Lesson',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    tryItCode: '<!-- Code example coming soon -->',
  };
};