export const generateCSSLessonContent = (lessonSlug: string) => {
  const cssLessons: Record<string, any> = {
    // Core lessons - Colors & Backgrounds
    colors: {
      title: 'CSS Colors',
      content: `
# CSS Colors

CSS colors can be specified in many ways.

## Color Values

<pre><code class="css">
/* Named colors */
color: red;
color: blue;
color: tomato;

/* Hex colors */
color: #ff0000;    /* red */
color: #0000ff;    /* blue */
color: #ff6347;    /* tomato */

/* RGB */
color: rgb(255, 0, 0);
color: rgb(0, 0, 255);

/* RGBA (with transparency) */
color: rgba(255, 0, 0, 0.5);

/* HSL */
color: hsl(0, 100%, 50%);    /* red */

/* HSLA */
color: hsla(0, 100%, 50%, 0.5);
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }
.color-box {
  padding: 20px;
  margin: 10px 0;
  color: white;
  border-radius: 5px;
}
.named { background-color: tomato; }
.hex { background-color: #3498db; }
.rgb { background-color: rgb(46, 204, 113); }
.rgba { background-color: rgba(155, 89, 182, 0.8); }
.hsl { background-color: hsl(48, 100%, 50%); color: black; }
</style>
</head>
<body>

<h1>CSS Color Values</h1>

<div class="color-box named">Named: tomato</div>
<div class="color-box hex">Hex: #3498db</div>
<div class="color-box rgb">RGB: rgb(46, 204, 113)</div>
<div class="color-box rgba">RGBA: rgba(155, 89, 182, 0.8)</div>
<div class="color-box hsl">HSL: hsl(48, 100%, 50%)</div>

</body>
</html>`,
    },
    backgrounds: {
      title: 'CSS Backgrounds',
      content: `
# CSS Backgrounds

Control element backgrounds with CSS.

## Background Properties

<pre><code class="css">
/* Background color */
background-color: lightblue;

/* Background image */
background-image: url('image.jpg');

/* No repeat */
background-repeat: no-repeat;

/* Position */
background-position: center;

/* Size */
background-size: cover;

/* Fixed attachment */
background-attachment: fixed;

/* Shorthand */
background: #f5f5f5 url('bg.jpg') no-repeat center/cover;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.box {
  height: 150px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 10px;
}

.solid { background-color: #3498db; }

.gradient {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.radial {
  background: radial-gradient(circle, #f093fb, #f5576c);
}

.image {
  background: url('https://picsum.photos/400/200') center/cover;
}

.pattern {
  background-color: #1abc9c;
  background-image: 
    linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%);
  background-size: 20px 20px;
}
</style>
</head>
<body>

<h1>CSS Backgrounds</h1>

<div class="box solid">Solid Color</div>
<div class="box gradient">Linear Gradient</div>
<div class="box radial">Radial Gradient</div>
<div class="box image">Background Image</div>
<div class="box pattern">Pattern</div>

</body>
</html>`,
    },
    borders: {
      title: 'CSS Borders',
      content: `
# CSS Borders

Style element borders.

## Border Properties

<pre><code class="css">
/* Individual properties */
border-width: 2px;
border-style: solid;
border-color: black;

/* Shorthand */
border: 2px solid black;

/* Border sides */
border-top: 2px solid red;
border-right: 2px dashed blue;
border-bottom: 2px dotted green;
border-left: 2px double orange;

/* Border radius */
border-radius: 10px;
border-radius: 50%;  /* circle */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.box {
  padding: 20px;
  margin: 15px 0;
  text-align: center;
}

.solid { border: 3px solid #3498db; }
.dashed { border: 3px dashed #e74c3c; }
.dotted { border: 3px dotted #2ecc71; }
.double { border: 5px double #9b59b6; }
.groove { border: 5px groove #f39c12; }
.ridge { border: 5px ridge #1abc9c; }

.mixed {
  border-top: 4px solid #e74c3c;
  border-right: 4px dashed #3498db;
  border-bottom: 4px dotted #2ecc71;
  border-left: 4px double #f39c12;
}

.rounded { border: 3px solid #3498db; border-radius: 15px; }
.pill { border: 3px solid #e74c3c; border-radius: 50px; }
.circle { 
  width: 100px; 
  height: 100px; 
  border: 3px solid #2ecc71; 
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 15px auto;
}
</style>
</head>
<body>

<h1>CSS Borders</h1>

<div class="box solid">solid</div>
<div class="box dashed">dashed</div>
<div class="box dotted">dotted</div>
<div class="box double">double</div>
<div class="box groove">groove</div>
<div class="box mixed">mixed borders</div>

<h2>Border Radius</h2>
<div class="box rounded">Rounded Corners</div>
<div class="box pill">Pill Shape</div>
<div class="circle">Circle</div>

</body>
</html>`,
    },
    margins: {
      title: 'CSS Margins',
      content: `
# CSS Margins

Margins create space outside elements.

## Margin Syntax

<pre><code class="css">
/* Individual sides */
margin-top: 20px;
margin-right: 15px;
margin-bottom: 20px;
margin-left: 15px;

/* Shorthand */
margin: 20px;                    /* all sides */
margin: 20px 15px;               /* top/bottom, left/right */
margin: 10px 15px 20px;          /* top, left/right, bottom */
margin: 10px 15px 20px 25px;     /* top, right, bottom, left */

/* Auto margin (centering) */
margin: 0 auto;

/* Negative margins */
margin-top: -10px;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container {
  background: #f5f5f5;
  padding: 10px;
  margin: 20px 0;
}

.box {
  background: #3498db;
  color: white;
  padding: 15px;
  text-align: center;
}

.m-0 { margin: 0; }
.m-20 { margin: 20px; }
.m-tb { margin: 30px 0; }
.m-lr { margin: 0 50px; }

.centered {
  width: 200px;
  margin: 20px auto;
  background: #e74c3c;
}

.overlap {
  background: #2ecc71;
  margin-top: -20px;
  position: relative;
}
</style>
</head>
<body>

<h1>CSS Margins</h1>

<h2>margin: 0</h2>
<div class="container">
  <div class="box m-0">No margin</div>
</div>

<h2>margin: 20px</h2>
<div class="container">
  <div class="box m-20">20px all sides</div>
</div>

<h2>margin: 30px 0 (top/bottom only)</h2>
<div class="container">
  <div class="box m-tb">Vertical margins</div>
</div>

<h2>margin: 0 auto (centering)</h2>
<div class="container">
  <div class="box centered">Centered</div>
</div>

<h2>Negative margin</h2>
<div class="container">
  <div class="box">First box</div>
  <div class="box overlap">Overlaps above (margin-top: -20px)</div>
</div>

</body>
</html>`,
    },
    padding: {
      title: 'CSS Padding',
      content: `
# CSS Padding

Padding creates space inside elements.

## Padding Syntax

<pre><code class="css">
/* Individual sides */
padding-top: 20px;
padding-right: 15px;
padding-bottom: 20px;
padding-left: 15px;

/* Shorthand */
padding: 20px;                   /* all sides */
padding: 20px 15px;              /* top/bottom, left/right */
padding: 10px 15px 20px;         /* top, left/right, bottom */
padding: 10px 15px 20px 25px;    /* top, right, bottom, left */
</code></pre>

## Padding vs Margin

- **Padding**: Space INSIDE the element
- **Margin**: Space OUTSIDE the element
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.demo {
  background: #3498db;
  color: white;
  margin: 15px 0;
  display: inline-block;
}

.p-0 { padding: 0; }
.p-10 { padding: 10px; }
.p-20 { padding: 20px; }
.p-40 { padding: 40px; }
.p-mixed { padding: 10px 30px 40px 60px; }

.comparison {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.box {
  width: 150px;
  text-align: center;
}

.padding-box {
  background: #e74c3c;
  color: white;
  padding: 30px;
}

.margin-box {
  background: #f5f5f5;
}

.margin-box .inner {
  background: #2ecc71;
  color: white;
  margin: 30px;
  padding: 10px;
}
</style>
</head>
<body>

<h1>CSS Padding</h1>

<h2>Padding Sizes</h2>
<div class="demo p-0">padding: 0</div>
<div class="demo p-10">padding: 10px</div>
<div class="demo p-20">padding: 20px</div>
<div class="demo p-40">padding: 40px</div>

<h2>Mixed Padding (top: 10, right: 30, bottom: 40, left: 60)</h2>
<div class="demo p-mixed">Mixed padding</div>

<h2>Padding vs Margin</h2>
<div class="comparison">
  <div class="box">
    <p>Padding (inside)</p>
    <div class="padding-box">30px padding</div>
  </div>
  <div class="box">
    <p>Margin (outside)</p>
    <div class="margin-box">
      <div class="inner">30px margin</div>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'height-width': {
      title: 'CSS Height and Width',
      content: `
# CSS Height and Width

Control element dimensions.

## Syntax

<pre><code class="css">
/* Fixed size */
width: 200px;
height: 100px;

/* Percentage */
width: 50%;
height: 100%;

/* Viewport units */
width: 100vw;
height: 100vh;

/* Min/Max */
min-width: 100px;
max-width: 800px;
min-height: 50px;
max-height: 500px;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.box {
  background: #3498db;
  color: white;
  margin: 15px 0;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fixed { width: 200px; height: 80px; }
.percent { width: 50%; height: 60px; }
.auto { width: auto; height: auto; }

.min-max {
  min-width: 100px;
  max-width: 400px;
  width: 80%;
  height: 60px;
  background: #e74c3c;
}

.aspect {
  width: 200px;
  aspect-ratio: 16/9;
  background: #2ecc71;
}

h2 { margin-top: 25px; }
</style>
</head>
<body>

<h1>CSS Height and Width</h1>

<h2>Fixed: 200px × 80px</h2>
<div class="box fixed">200px × 80px</div>

<h2>Percentage: 50% width</h2>
<div class="box percent">50% width</div>

<h2>Auto (fits content)</h2>
<div class="box auto">Auto sizing</div>

<h2>Min/Max Width</h2>
<div class="box min-max">min: 100px, max: 400px, width: 80%</div>

<h2>Aspect Ratio: 16/9</h2>
<div class="box aspect">16:9 ratio</div>

</body>
</html>`,
    },
    boxmodel: {
      title: 'CSS Box Model',
      content: `
# CSS Box Model

Every element is a rectangular box.

## Box Model Components

1. **Content** - The actual content
2. **Padding** - Space inside, around content
3. **Border** - Around the padding
4. **Margin** - Space outside, around border

## Box Sizing

<pre><code class="css">
/* Default: content-box */
box-sizing: content-box;
/* Width = content only */

/* Recommended: border-box */
box-sizing: border-box;
/* Width = content + padding + border */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.box-model-demo {
  width: 300px;
  padding: 30px;
  border: 15px solid #3498db;
  margin: 20px;
  background: #ecf0f1;
  position: relative;
}

.content {
  background: #e74c3c;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Labels */
.label {
  position: absolute;
  font-size: 12px;
  color: #666;
}
.l-margin { top: -15px; left: 50%; transform: translateX(-50%); }
.l-border { top: 5px; left: 50%; transform: translateX(-50%); color: white; }
.l-padding { top: 50px; left: 50%; transform: translateX(-50%); }

/* Box sizing comparison */
.comparison {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.size-box {
  width: 200px;
  padding: 20px;
  border: 10px solid #3498db;
  background: #ecf0f1;
  text-align: center;
}

.content-box { box-sizing: content-box; }
.border-box { box-sizing: border-box; }

code { background: #f5f5f5; padding: 2px 6px; }
</style>
</head>
<body>

<h1>CSS Box Model</h1>

<div class="box-model-demo">
  <span class="label l-margin">← margin: 20px →</span>
  <span class="label l-border">← border: 15px →</span>
  <span class="label l-padding">← padding: 30px →</span>
  <div class="content">Content Area</div>
</div>

<h2>box-sizing Comparison</h2>
<p>Both boxes have <code>width: 200px</code>, <code>padding: 20px</code>, <code>border: 10px</code></p>

<div class="comparison">
  <div>
    <h3>content-box (default)</h3>
    <div class="size-box content-box">
      Total width: 260px<br>
      (200 + 40 + 20)
    </div>
  </div>
  <div>
    <h3>border-box</h3>
    <div class="size-box border-box">
      Total width: 200px<br>
      (as specified)
    </div>
  </div>
</div>

</body>
</html>`,
    },
    outline: {
      title: 'CSS Outline',
      content: `
# CSS Outline

Outlines are drawn outside the border.

## Outline vs Border

- **Border**: Part of box model (affects layout)
- **Outline**: Drawn outside (doesn't affect layout)

## Syntax

<pre><code class="css">
outline: 2px solid red;

/* Individual properties */
outline-width: 2px;
outline-style: solid;
outline-color: red;
outline-offset: 5px;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.box {
  padding: 20px;
  margin: 25px 10px;
  background: #f5f5f5;
  display: inline-block;
}

.solid { outline: 3px solid #3498db; }
.dashed { outline: 3px dashed #e74c3c; }
.dotted { outline: 3px dotted #2ecc71; }
.double { outline: 5px double #9b59b6; }

.offset {
  outline: 3px solid #3498db;
  outline-offset: 10px;
}

.focus-demo {
  padding: 15px 30px;
  font-size: 16px;
  border: 2px solid #3498db;
  background: white;
  cursor: pointer;
  margin: 20px 0;
}

.focus-demo:focus {
  outline: 3px solid #e74c3c;
  outline-offset: 3px;
}
</style>
</head>
<body>

<h1>CSS Outline</h1>

<h2>Outline Styles</h2>
<div class="box solid">solid</div>
<div class="box dashed">dashed</div>
<div class="box dotted">dotted</div>
<div class="box double">double</div>

<h2>Outline Offset</h2>
<div class="box offset">10px offset</div>

<h2>Focus Outline (click the button)</h2>
<button class="focus-demo">Focus Me</button>
<p>Outlines are commonly used for keyboard focus indicators.</p>

</body>
</html>`,
    },
    text: {
      title: 'CSS Text',
      content: `
# CSS Text

Style text content.

## Text Properties

<pre><code class="css">
/* Color */
color: blue;

/* Alignment */
text-align: center;
text-align: left;
text-align: right;
text-align: justify;

/* Decoration */
text-decoration: underline;
text-decoration: line-through;
text-decoration: none;

/* Transform */
text-transform: uppercase;
text-transform: lowercase;
text-transform: capitalize;

/* Spacing */
letter-spacing: 2px;
word-spacing: 5px;
line-height: 1.6;

/* Indentation */
text-indent: 50px;

/* Shadow */
text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.demo { margin: 15px 0; padding: 15px; background: #f5f5f5; }

.center { text-align: center; }
.right { text-align: right; }
.justify { text-align: justify; }

.underline { text-decoration: underline; }
.strike { text-decoration: line-through; }
.overline { text-decoration: overline; }

.upper { text-transform: uppercase; }
.lower { text-transform: lowercase; }
.cap { text-transform: capitalize; }

.spacing { letter-spacing: 3px; }
.line-height { line-height: 2; }
.indent { text-indent: 50px; }

.shadow { 
  font-size: 32px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.glow {
  font-size: 32px;
  color: #3498db;
  text-shadow: 0 0 10px #3498db, 0 0 20px #3498db;
}
</style>
</head>
<body>

<h1>CSS Text Styling</h1>

<h2>Text Alignment</h2>
<div class="demo center">text-align: center</div>
<div class="demo right">text-align: right</div>

<h2>Text Decoration</h2>
<div class="demo underline">text-decoration: underline</div>
<div class="demo strike">text-decoration: line-through</div>

<h2>Text Transform</h2>
<div class="demo upper">uppercase text</div>
<div class="demo lower">LOWERCASE TEXT</div>
<div class="demo cap">capitalize each word</div>

<h2>Spacing & Indentation</h2>
<div class="demo spacing">letter-spacing: 3px</div>
<div class="demo indent">This paragraph has a 50px text-indent on the first line only.</div>

<h2>Text Shadow</h2>
<div class="demo shadow">Shadow Effect</div>
<div class="demo glow">Glow Effect</div>

</body>
</html>`,
    },
    fonts: {
      title: 'CSS Fonts',
      content: `
# CSS Fonts

Control typography with CSS.

## Font Properties

<pre><code class="css">
/* Font family */
font-family: Arial, sans-serif;
font-family: 'Times New Roman', serif;
font-family: 'Courier New', monospace;

/* Size */
font-size: 16px;
font-size: 1.2em;
font-size: 1.2rem;

/* Weight */
font-weight: normal;   /* 400 */
font-weight: bold;     /* 700 */
font-weight: 100-900;

/* Style */
font-style: italic;
font-style: normal;

/* Shorthand */
font: italic bold 16px/1.5 Arial, sans-serif;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Playfair+Display&display=swap" rel="stylesheet">
<style>
body { font-family: Arial; padding: 20px; }

.demo { margin: 15px 0; padding: 15px; background: #f5f5f5; }

.serif { font-family: 'Playfair Display', Georgia, serif; font-size: 24px; }
.sans { font-family: 'Roboto', Arial, sans-serif; }
.mono { font-family: 'Courier New', monospace; }

.light { font-weight: 300; }
.normal { font-weight: 400; }
.bold { font-weight: 700; }

.italic { font-style: italic; }

.size-sm { font-size: 14px; }
.size-md { font-size: 18px; }
.size-lg { font-size: 24px; }
.size-xl { font-size: 36px; }

.combined {
  font: italic 700 24px/1.5 'Roboto', sans-serif;
  color: #3498db;
}
</style>
</head>
<body>

<h1>CSS Fonts</h1>

<h2>Font Families</h2>
<div class="demo serif">Serif Font (Playfair Display)</div>
<div class="demo sans">Sans-serif Font (Roboto)</div>
<div class="demo mono">Monospace Font (Courier)</div>

<h2>Font Weights</h2>
<div class="demo sans light">font-weight: 300 (light)</div>
<div class="demo sans normal">font-weight: 400 (normal)</div>
<div class="demo sans bold">font-weight: 700 (bold)</div>

<h2>Font Sizes</h2>
<div class="demo size-sm">14px</div>
<div class="demo size-md">18px</div>
<div class="demo size-lg">24px</div>
<div class="demo size-xl">36px</div>

<h2>Combined (Shorthand)</h2>
<div class="demo combined">font: italic 700 24px/1.5 'Roboto'</div>

</body>
</html>`,
    },
    icons: {
      title: 'CSS Icons',
      content: `
# CSS Icons

Add icons to your web pages.

## Icon Libraries

### Font Awesome

<pre><code class="html">
&lt;link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"&gt;

&lt;i class="fa fa-home"&gt;&lt;/i&gt;
&lt;i class="fas fa-user"&gt;&lt;/i&gt;
&lt;i class="fab fa-github"&gt;&lt;/i&gt;
</code></pre>

### Bootstrap Icons

<pre><code class="html">
&lt;link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css"&gt;

&lt;i class="bi bi-house"&gt;&lt;/i&gt;
</code></pre>

### Material Icons

<pre><code class="html">
&lt;link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"&gt;

&lt;span class="material-icons"&gt;home&lt;/span&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<style>
body { font-family: Arial; padding: 20px; }

.icon-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.icon-box {
  text-align: center;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
  min-width: 100px;
}

.icon-box i, .icon-box span {
  font-size: 32px;
  color: #3498db;
  display: block;
  margin-bottom: 10px;
}

.icon-box p { font-size: 12px; color: #666; margin: 0; }

/* Styling icons */
.styled-icons i {
  font-size: 48px;
  margin: 10px;
  transition: all 0.3s;
}

.styled-icons i:hover {
  transform: scale(1.2);
}

.icon-red { color: #e74c3c !important; }
.icon-green { color: #2ecc71 !important; }
.icon-blue { color: #3498db !important; }
.icon-gold { color: #f1c40f !important; }
</style>
</head>
<body>

<h1>CSS Icons</h1>

<h2>Font Awesome Icons</h2>
<div class="icon-demo">
  <div class="icon-box"><i class="fas fa-home"></i><p>fa-home</p></div>
  <div class="icon-box"><i class="fas fa-user"></i><p>fa-user</p></div>
  <div class="icon-box"><i class="fas fa-heart"></i><p>fa-heart</p></div>
  <div class="icon-box"><i class="fas fa-star"></i><p>fa-star</p></div>
  <div class="icon-box"><i class="fas fa-cog"></i><p>fa-cog</p></div>
</div>

<h2>Material Icons</h2>
<div class="icon-demo">
  <div class="icon-box"><span class="material-icons">home</span><p>home</p></div>
  <div class="icon-box"><span class="material-icons">favorite</span><p>favorite</p></div>
  <div class="icon-box"><span class="material-icons">settings</span><p>settings</p></div>
</div>

<h2>Styled Icons (Hover Me!)</h2>
<div class="styled-icons">
  <i class="fas fa-heart icon-red"></i>
  <i class="fas fa-leaf icon-green"></i>
  <i class="fas fa-cloud icon-blue"></i>
  <i class="fas fa-star icon-gold"></i>
</div>

</body>
</html>`,
    },
    display: {
      title: 'CSS Display',
      content: `
# CSS Display

The display property controls how elements are rendered.

## Display Values

<pre><code class="css">
display: block;        /* Takes full width, stacks vertically */
display: inline;       /* Flows with text, no width/height */
display: inline-block; /* Inline + respects width/height */
display: none;         /* Completely hidden */
display: flex;         /* Flexbox container */
display: grid;         /* Grid container */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container { background: #f5f5f5; padding: 10px; margin: 15px 0; }

/* Block elements */
.block { 
  display: block; 
  background: #3498db; 
  color: white; 
  padding: 10px; 
  margin: 5px 0;
}

/* Inline elements */
.inline { 
  display: inline; 
  background: #e74c3c; 
  color: white; 
  padding: 5px;
}

/* Inline-block elements */
.inline-block { 
  display: inline-block; 
  background: #2ecc71; 
  color: white; 
  padding: 15px 30px;
  margin: 5px;
}

/* None (hidden) */
.hidden { display: none; }

/* Flex */
.flex-container {
  display: flex;
  gap: 10px;
}
.flex-item {
  background: #9b59b6;
  color: white;
  padding: 20px;
  flex: 1;
}
</style>
</head>
<body>

<h1>CSS Display Property</h1>

<h2>display: block</h2>
<div class="container">
  <div class="block">Block 1</div>
  <div class="block">Block 2</div>
  <div class="block">Block 3</div>
</div>

<h2>display: inline</h2>
<div class="container">
  <span class="inline">Inline 1</span>
  <span class="inline">Inline 2</span>
  <span class="inline">Inline 3</span>
</div>

<h2>display: inline-block</h2>
<div class="container">
  <div class="inline-block">Inline-block 1</div>
  <div class="inline-block">Inline-block 2</div>
  <div class="inline-block">Inline-block 3</div>
</div>

<h2>display: flex</h2>
<div class="flex-container">
  <div class="flex-item">Flex 1</div>
  <div class="flex-item">Flex 2</div>
  <div class="flex-item">Flex 3</div>
</div>

</body>
</html>`,
    },
    position: {
      title: 'CSS Position',
      content: `
# CSS Position

Control how elements are positioned.

## Position Values

<pre><code class="css">
position: static;    /* Default, normal flow */
position: relative;  /* Relative to normal position */
position: absolute;  /* Relative to nearest positioned ancestor */
position: fixed;     /* Relative to viewport */
position: sticky;    /* Hybrid of relative and fixed */
</code></pre>

## Offset Properties

<pre><code class="css">
top: 20px;
right: 20px;
bottom: 20px;
left: 20px;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container {
  position: relative;
  background: #f5f5f5;
  height: 200px;
  margin: 20px 0;
  border: 2px dashed #ccc;
}

.box {
  padding: 15px;
  color: white;
  text-align: center;
}

/* Static (default) */
.static { background: #3498db; }

/* Relative */
.relative {
  position: relative;
  top: 20px;
  left: 30px;
  background: #e74c3c;
}

/* Absolute */
.absolute {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #2ecc71;
}

/* Fixed (stays on scroll) */
.fixed {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #9b59b6;
  padding: 15px 25px;
  border-radius: 30px;
  z-index: 100;
}

/* Sticky */
.sticky-container {
  height: 150px;
  overflow-y: scroll;
  background: #f5f5f5;
  padding: 10px;
}

.sticky {
  position: sticky;
  top: 0;
  background: #f39c12;
  color: white;
  padding: 10px;
}
</style>
</head>
<body>

<h1>CSS Position</h1>

<h2>Static (default)</h2>
<div class="container">
  <div class="box static">Static - normal flow</div>
</div>

<h2>Relative (offset from normal position)</h2>
<div class="container">
  <div class="box relative">Relative: top: 20px, left: 30px</div>
</div>

<h2>Absolute (relative to container)</h2>
<div class="container">
  <div class="box absolute">Absolute: top-right</div>
</div>

<h2>Sticky (scroll to see)</h2>
<div class="sticky-container">
  <div class="sticky">I'm sticky!</div>
  <p>Scroll down...</p>
  <p>Keep scrolling...</p>
  <p>More content...</p>
  <p>Even more...</p>
  <p>Almost there...</p>
  <p>The header stays!</p>
</div>

<div class="fixed">Fixed Button</div>

</body>
</html>`,
    },
    'z-index': {
      title: 'CSS Z-index',
      content: `
# CSS Z-index

Control stacking order of positioned elements.

## Rules

- Only works on positioned elements (relative, absolute, fixed, sticky)
- Higher z-index = on top
- Same z-index = order in HTML

<pre><code class="css">
.back { z-index: 1; }
.middle { z-index: 2; }
.front { z-index: 3; }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.stack-demo {
  position: relative;
  height: 250px;
}

.box {
  position: absolute;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  border-radius: 10px;
  transition: z-index 0.3s, transform 0.3s;
  cursor: pointer;
}

.box1 {
  background: #e74c3c;
  top: 20px;
  left: 20px;
  z-index: 1;
}

.box2 {
  background: #3498db;
  top: 60px;
  left: 80px;
  z-index: 2;
}

.box3 {
  background: #2ecc71;
  top: 100px;
  left: 140px;
  z-index: 3;
}

.box:hover {
  z-index: 10;
  transform: scale(1.1);
}

/* Negative z-index */
.behind {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  z-index: -1;
}
</style>
</head>
<body>

<h1>CSS Z-index</h1>
<p>Hover over boxes to bring them to front</p>

<div class="stack-demo">
  <div class="behind">z-index: -1 (behind)</div>
  <div class="box box1">z-index: 1</div>
  <div class="box box2">z-index: 2</div>
  <div class="box box3">z-index: 3</div>
</div>

<h2>Remember</h2>
<ul>
  <li>z-index only works on positioned elements</li>
  <li>Higher number = on top</li>
  <li>Negative values go behind</li>
</ul>

</body>
</html>`,
    },
    overflow: {
      title: 'CSS Overflow',
      content: `
# CSS Overflow

Control what happens when content overflows.

## Overflow Values

<pre><code class="css">
overflow: visible;  /* Default, content shows outside */
overflow: hidden;   /* Content is clipped */
overflow: scroll;   /* Always show scrollbars */
overflow: auto;     /* Scrollbars when needed */

/* Individual axes */
overflow-x: scroll;
overflow-y: hidden;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.box {
  width: 200px;
  height: 120px;
  background: #f5f5f5;
  border: 2px solid #3498db;
  padding: 10px;
}

.visible { overflow: visible; }
.hidden { overflow: hidden; }
.scroll { overflow: scroll; }
.auto { overflow: auto; }

.overflow-x {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}

h3 { margin-top: 0; color: #3498db; font-size: 14px; }
</style>
</head>
<body>

<h1>CSS Overflow</h1>

<div class="container">
  <div class="box visible">
    <h3>overflow: visible</h3>
    <p>This content overflows and is visible outside the box. Default behavior.</p>
  </div>
  
  <div class="box hidden">
    <h3>overflow: hidden</h3>
    <p>This content overflows but is hidden. No scrollbars are shown.</p>
  </div>
  
  <div class="box scroll">
    <h3>overflow: scroll</h3>
    <p>This content overflows with scrollbars always shown even if not needed.</p>
  </div>
  
  <div class="box auto">
    <h3>overflow: auto</h3>
    <p>This content shows scrollbars only when content overflows the container.</p>
  </div>
</div>

<h2>Horizontal Scroll</h2>
<div class="box overflow-x">
  <h3>overflow-x: scroll</h3>
  This is a very long line of text that will cause horizontal scrolling. Keep going...
</div>

</body>
</html>`,
    },
    float: {
      title: 'CSS Float',
      content: `
# CSS Float

Float elements left or right.

## Float Values

<pre><code class="css">
float: left;
float: right;
float: none;

/* Clear floats */
clear: left;
clear: right;
clear: both;
</code></pre>

## Clearfix Hack

<pre><code class="css">
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container {
  background: #f5f5f5;
  padding: 20px;
  margin: 20px 0;
}

/* Clearfix */
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.float-left {
  float: left;
  background: #3498db;
  color: white;
  padding: 20px;
  margin: 0 15px 10px 0;
}

.float-right {
  float: right;
  background: #e74c3c;
  color: white;
  padding: 20px;
  margin: 0 0 10px 15px;
}

/* Image with text wrap */
.article-img {
  float: left;
  width: 150px;
  height: 100px;
  background: #2ecc71;
  margin: 0 15px 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>
</head>
<body>

<h1>CSS Float</h1>

<h2>Float Left</h2>
<div class="container clearfix">
  <div class="float-left">Float Left</div>
  <p>Text wraps around the floated element. Float is commonly used for wrapping text around images.</p>
</div>

<h2>Float Right</h2>
<div class="container clearfix">
  <div class="float-right">Float Right</div>
  <p>Text wraps around the floated element on the left side when the element is floated right.</p>
</div>

<h2>Image with Text Wrap</h2>
<div class="container clearfix">
  <div class="article-img">Image</div>
  <p>This is how you typically use float to wrap text around an image in an article. The text flows naturally around the floated element. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
</div>

</body>
</html>`,
    },
    'inline-block': {
      title: 'CSS Inline-block',
      content: `
# CSS Inline-block

Combines inline flow with block features.

## Comparison

| Feature | Block | Inline | Inline-block |
|---------|-------|--------|--------------|
| Width/Height | ✓ | ✗ | ✓ |
| Padding/Margin | ✓ | Horizontal only | ✓ |
| Line break | ✓ | ✗ | ✗ |

<pre><code class="css">
display: inline-block;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.demo { background: #f5f5f5; padding: 10px; margin: 15px 0; }

.block-item {
  display: block;
  background: #3498db;
  color: white;
  padding: 15px;
  margin: 5px;
  width: 150px;
}

.inline-item {
  display: inline;
  background: #e74c3c;
  color: white;
  padding: 15px;
  margin: 5px;
  /* width/height won't work */
}

.inline-block-item {
  display: inline-block;
  background: #2ecc71;
  color: white;
  padding: 15px;
  margin: 5px;
  width: 120px;
  height: 60px;
  text-align: center;
  vertical-align: middle;
}

/* Practical example: nav menu */
.nav {
  background: #2c3e50;
  padding: 0;
}

.nav a {
  display: inline-block;
  color: white;
  padding: 15px 25px;
  text-decoration: none;
  transition: background 0.3s;
}

.nav a:hover {
  background: #34495e;
}
</style>
</head>
<body>

<h1>CSS Inline-block</h1>

<h2>display: block</h2>
<div class="demo">
  <div class="block-item">Block 1</div>
  <div class="block-item">Block 2</div>
  <div class="block-item">Block 3</div>
</div>

<h2>display: inline</h2>
<div class="demo">
  <span class="inline-item">Inline 1</span>
  <span class="inline-item">Inline 2</span>
  <span class="inline-item">Inline 3</span>
</div>

<h2>display: inline-block</h2>
<div class="demo">
  <div class="inline-block-item">IB 1</div>
  <div class="inline-block-item">IB 2</div>
  <div class="inline-block-item">IB 3</div>
</div>

<h2>Practical Example: Navigation</h2>
<div class="nav">
  <a href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
</div>

</body>
</html>`,
    },
    align: {
      title: 'CSS Align',
      content: `
# CSS Alignment

Center and align elements.

## Horizontal Centering

<pre><code class="css">
/* Block element */
margin: 0 auto;

/* Text */
text-align: center;

/* Flexbox */
justify-content: center;
</code></pre>

## Vertical Centering

<pre><code class="css">
/* Flexbox */
align-items: center;

/* Grid */
place-items: center;

/* Transform */
position: absolute;
top: 50%;
transform: translateY(-50%);
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container {
  background: #f5f5f5;
  height: 150px;
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.box {
  background: #3498db;
  color: white;
  padding: 20px 40px;
}

/* Horizontal: margin auto */
.h-margin {
  margin: 0 auto;
}

/* Horizontal: flexbox */
.h-flex { justify-content: center; }

/* Both: flexbox */
.both-flex {
  justify-content: center;
  align-items: center;
}

/* Both: grid */
.grid-center {
  display: grid;
  place-items: center;
  background: #f5f5f5;
  height: 150px;
  margin: 15px 0;
}

/* Vertical: transform */
.transform-center {
  position: relative;
  background: #f5f5f5;
  height: 150px;
  margin: 15px 0;
}
.transform-center .box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

h2 { margin-top: 25px; }
</style>
</head>
<body>

<h1>CSS Alignment</h1>

<h2>Horizontal: margin: 0 auto</h2>
<div class="container">
  <div class="box h-margin">Centered</div>
</div>

<h2>Horizontal: Flexbox justify-content</h2>
<div class="container h-flex">
  <div class="box">Centered</div>
</div>

<h2>Both: Flexbox</h2>
<div class="container both-flex">
  <div class="box">Centered</div>
</div>

<h2>Both: Grid place-items</h2>
<div class="grid-center">
  <div class="box">Centered</div>
</div>

<h2>Both: Transform</h2>
<div class="transform-center">
  <div class="box">Centered</div>
</div>

</body>
</html>`,
    },
    'max-width': {
      title: 'CSS Max-width',
      content: `
# CSS Max-width

Limit element width for responsive design.

## Syntax

<pre><code class="css">
max-width: 800px;    /* Maximum 800px */
max-width: 100%;     /* Never exceed parent */
max-width: 50vw;     /* 50% of viewport */

/* Common pattern */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; margin: 0; padding: 20px; }

.box {
  background: #3498db;
  color: white;
  padding: 20px;
  margin: 15px 0;
}

/* No max-width */
.full-width {
  width: 100%;
}

/* With max-width */
.limited {
  max-width: 500px;
}

/* Responsive container pattern */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #2ecc71;
}

/* Responsive image */
.responsive-img {
  max-width: 100%;
  height: auto;
  display: block;
}

h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>CSS Max-width</h1>

<h2>No max-width (100% width)</h2>
<div class="box full-width">Takes full width of parent</div>

<h2>max-width: 500px</h2>
<div class="box limited">Limited to 500px maximum</div>

<h2>Responsive Container Pattern</h2>
<div class="container">
  <p>This container has:</p>
  <ul>
    <li>max-width: 800px</li>
    <li>margin: 0 auto (centered)</li>
    <li>padding: 20px (side gutters)</li>
  </ul>
</div>

<h2>Responsive Image</h2>
<img src="https://picsum.photos/800/400" alt="Responsive" class="responsive-img">
<p><code>max-width: 100%</code> makes images responsive</p>

</body>
</html>`,
    },
    combinators: {
      title: 'CSS Combinators',
      content: `
# CSS Combinators

Select elements based on their relationship.

## Combinator Types

<pre><code class="css">
/* Descendant (space) */
div p { }      /* Any p inside div */

/* Child (&gt;) */
div &gt; p { }    /* Direct p children only */

/* Adjacent sibling (+) */
h1 + p { }     /* First p after h1 */

/* General sibling (~) */
h1 ~ p { }     /* All p siblings after h1 */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.container { background: #f5f5f5; padding: 20px; margin: 15px 0; }

/* Descendant selector */
.desc p { color: #3498db; font-weight: bold; }

/* Child selector */
.child > p { color: #e74c3c; font-weight: bold; }

/* Adjacent sibling */
h3 + p { color: #2ecc71; font-weight: bold; }

/* General sibling */
h3 ~ p.general { color: #9b59b6; font-weight: bold; }

code { background: #eee; padding: 2px 6px; border-radius: 3px; }
</style>
</head>
<body>

<h1>CSS Combinators</h1>

<h2>Descendant Selector (space): <code>.desc p</code></h2>
<div class="container desc">
  <p>Direct paragraph (matched)</p>
  <div>
    <p>Nested paragraph (also matched)</p>
  </div>
</div>

<h2>Child Selector (>): <code>.child > p</code></h2>
<div class="container child">
  <p>Direct child (matched)</p>
  <div>
    <p>Nested paragraph (NOT matched)</p>
  </div>
</div>

<h2>Adjacent Sibling (+): <code>h3 + p</code></h2>
<div class="container">
  <h3>Heading</h3>
  <p>First paragraph after h3 (matched)</p>
  <p>Second paragraph (NOT matched)</p>
</div>

<h2>General Sibling (~): <code>h3 ~ p</code></h2>
<div class="container">
  <p>Before heading (NOT matched)</p>
  <h3>Heading</h3>
  <p class="general">First sibling (matched)</p>
  <p class="general">Second sibling (matched)</p>
  <p class="general">Third sibling (matched)</p>
</div>

</body>
</html>`,
    },
    'pseudo-classes': {
      title: 'CSS Pseudo-classes',
      content: `
# CSS Pseudo-classes

Select elements based on their state.

## Common Pseudo-classes

<pre><code class="css">
/* Link states */
a:link { }      /* Unvisited */
a:visited { }   /* Visited */
a:hover { }     /* Mouse over */
a:active { }    /* Being clicked */

/* Form states */
input:focus { }
input:disabled { }
input:checked { }
input:valid { }
input:invalid { }

/* Position */
:first-child { }
:last-child { }
:nth-child(n) { }
:nth-child(odd) { }
:nth-child(even) { }

/* Negation */
:not(.class) { }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

/* Link states */
a:link { color: #3498db; }
a:visited { color: #9b59b6; }
a:hover { color: #e74c3c; }
a:active { color: #2ecc71; }

/* List child selectors */
.list li { padding: 10px; margin: 5px 0; background: #f5f5f5; }
.list li:first-child { background: #3498db; color: white; }
.list li:last-child { background: #e74c3c; color: white; }
.list li:nth-child(odd) { background: #ecf0f1; }
.list li:nth-child(3) { border: 2px solid #2ecc71; }

/* Form states */
input, button { padding: 10px; margin: 5px; font-size: 16px; }
input:focus { outline: 3px solid #3498db; }
input:valid { border: 2px solid #2ecc71; }
input:invalid { border: 2px solid #e74c3c; }

/* Hover effects */
.card {
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s;
  margin: 10px 0;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

/* Not selector */
.tags span { display: inline-block; padding: 5px 15px; margin: 5px; background: #3498db; color: white; border-radius: 20px; }
.tags span:not(.active) { background: #bdc3c7; color: #333; }
</style>
</head>
<body>

<h1>CSS Pseudo-classes</h1>

<h2>Link States</h2>
<p><a href="#">Hover, click, and visit me!</a></p>

<h2>Child Selectors</h2>
<ul class="list">
  <li>First child (blue)</li>
  <li>Second child</li>
  <li>Third child (green border)</li>
  <li>Fourth child</li>
  <li>Last child (red)</li>
</ul>

<h2>Form States</h2>
<input type="email" placeholder="Enter valid email" required>
<input type="text" placeholder="Focus me">

<h2>Hover Effect</h2>
<div class="card">Hover over this card!</div>

<h2>:not() Selector</h2>
<div class="tags">
  <span class="active">Active</span>
  <span>Inactive</span>
  <span>Inactive</span>
  <span class="active">Active</span>
</div>

</body>
</html>`,
    },
    'pseudo-elements': {
      title: 'CSS Pseudo-elements',
      content: `
# CSS Pseudo-elements

Style specific parts of elements.

## Common Pseudo-elements

<pre><code class="css">
/* Before and After */
::before { content: ""; }
::after { content: ""; }

/* First letter/line */
::first-letter { }
::first-line { }

/* Selection */
::selection { }

/* Placeholder */
::placeholder { }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

/* Before and After */
.quote {
  position: relative;
  padding: 20px 30px;
  background: #f5f5f5;
  font-style: italic;
  margin: 20px 0;
}
.quote::before {
  content: """;
  position: absolute;
  left: 10px;
  top: 0;
  font-size: 48px;
  color: #3498db;
}
.quote::after {
  content: """;
  position: absolute;
  right: 10px;
  bottom: -20px;
  font-size: 48px;
  color: #3498db;
}

/* First letter */
.drop-cap::first-letter {
  font-size: 3em;
  float: left;
  line-height: 1;
  margin-right: 10px;
  color: #e74c3c;
  font-weight: bold;
}

/* First line */
.first-line::first-line {
  font-weight: bold;
  color: #3498db;
  font-size: 1.2em;
}

/* Selection */
.custom-selection::selection {
  background: #2ecc71;
  color: white;
}

/* Placeholder */
.styled-input::placeholder {
  color: #9b59b6;
  font-style: italic;
}

/* Required indicator */
.required-label::after {
  content: " *";
  color: #e74c3c;
}

input { padding: 10px; font-size: 16px; margin: 10px 0; display: block; width: 250px; }
</style>
</head>
<body>

<h1>CSS Pseudo-elements</h1>

<h2>::before and ::after</h2>
<div class="quote">
  The only way to do great work is to love what you do.
</div>

<h2>::first-letter (Drop Cap)</h2>
<p class="drop-cap">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

<h2>::first-line</h2>
<p class="first-line">The first line of this paragraph is styled differently. Try resizing the window to see how the first line changes based on the container width.</p>

<h2>::selection (Try selecting this text)</h2>
<p class="custom-selection">Select this text to see custom selection colors! The background will be green and text will be white.</p>

<h2>::placeholder</h2>
<input type="text" class="styled-input" placeholder="Styled placeholder text">

<h2>::after for Required Indicator</h2>
<label class="required-label">Email Address</label>
<input type="email" placeholder="Enter email">

</body>
</html>`,
    },
    'attr-selectors': {
      title: 'CSS Attribute Selectors',
      content: `
# CSS Attribute Selectors

Select elements based on their attributes.

## Syntax

<pre><code class="css">
/* Has attribute */
[disabled] { }

/* Exact value */
[type="text"] { }

/* Contains word */
[class~="box"] { }

/* Starts with */
[href^="https"] { }

/* Ends with */
[href$=".pdf"] { }

/* Contains */
[href*="google"] { }

/* Case insensitive */
[type="submit" i] { }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

/* Has attribute */
[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Exact match */
[type="text"] {
  border: 2px solid #3498db;
}

[type="email"] {
  border: 2px solid #9b59b6;
}

/* Starts with (external links) */
a[href^="https"] {
  color: #2ecc71;
}
a[href^="https"]::after {
  content: " 🔗";
}

/* Ends with (file types) */
a[href$=".pdf"] {
  color: #e74c3c;
}
a[href$=".pdf"]::after {
  content: " 📄";
}

/* Contains */
a[href*="google"] {
  font-weight: bold;
}

/* Styling */
input, button {
  padding: 12px;
  margin: 8px 0;
  font-size: 16px;
  display: block;
  width: 250px;
  border-radius: 5px;
  border: 2px solid #ccc;
}

button {
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
}

a { display: block; margin: 8px 0; }
</style>
</head>
<body>

<h1>CSS Attribute Selectors</h1>

<h2>[type="..."]</h2>
<input type="text" placeholder="type=text (blue border)">
<input type="email" placeholder="type=email (purple border)">
<button type="submit">Submit Button</button>
<button disabled>Disabled Button</button>

<h2>Link Selectors</h2>
<a href="https://google.com">External link (https) - green with 🔗</a>
<a href="https://www.google.com/search">Contains "google" - bold</a>
<a href="/files/document.pdf">PDF download - red with 📄</a>
<a href="/about">Internal link</a>

</body>
</html>`,
    },
    links: {
      title: 'CSS Links',
      content: `
# CSS Links

Style hyperlinks for different states.

## Link States

<pre><code class="css">
/* Order matters: LVHA */
a:link { }     /* Unvisited */
a:visited { }  /* Visited */
a:hover { }    /* Mouse over */
a:active { }   /* Being clicked */

/* Remove underline */
a {
  text-decoration: none;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

/* Basic link styling */
a {
  text-decoration: none;
  transition: all 0.3s;
}

/* Default link */
.basic a:link { color: #3498db; }
.basic a:visited { color: #9b59b6; }
.basic a:hover { color: #e74c3c; text-decoration: underline; }
.basic a:active { color: #2ecc71; }

/* Button link */
.btn-link {
  display: inline-block;
  padding: 12px 24px;
  background: #3498db;
  color: white !important;
  border-radius: 5px;
  margin: 5px;
}
.btn-link:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

/* Underline animation */
.animated-link {
  position: relative;
  color: #3498db;
}
.animated-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: #3498db;
  transition: width 0.3s;
}
.animated-link:hover::after {
  width: 100%;
}

/* Icon link */
.icon-link::before {
  content: "→ ";
  transition: padding 0.3s;
}
.icon-link:hover::before {
  padding-right: 8px;
}

.demo { margin: 20px 0; }
</style>
</head>
<body>

<h1>CSS Links</h1>

<div class="demo basic">
  <h2>Basic Link States</h2>
  <a href="#">Hover, click, and test me!</a>
</div>

<div class="demo">
  <h2>Button Links</h2>
  <a href="#" class="btn-link">Primary Button</a>
  <a href="#" class="btn-link" style="background:#2ecc71;">Success Button</a>
</div>

<div class="demo">
  <h2>Animated Underline</h2>
  <a href="#" class="animated-link">Hover for animated underline</a>
</div>

<div class="demo">
  <h2>Icon Animation</h2>
  <a href="#" class="icon-link">Hover to see arrow animate</a>
</div>

</body>
</html>`,
    },
    lists: {
      title: 'CSS Lists',
      content: `
# CSS Lists

Style ordered and unordered lists.

## List Properties

<pre><code class="css">
/* List style type */
list-style-type: disc;
list-style-type: circle;
list-style-type: square;
list-style-type: decimal;
list-style-type: none;

/* List style position */
list-style-position: inside;
list-style-position: outside;

/* Custom marker */
list-style-image: url('marker.png');

/* Shorthand */
list-style: square inside;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

ul, ol { margin: 15px 0; padding-left: 40px; }
li { padding: 5px 0; }

/* Different bullet types */
.disc { list-style-type: disc; }
.circle { list-style-type: circle; }
.square { list-style-type: square; }
.none { list-style-type: none; padding-left: 0; }

.decimal { list-style-type: decimal; }
.roman { list-style-type: upper-roman; }
.alpha { list-style-type: lower-alpha; }

/* Custom bullets with ::before */
.custom-list {
  list-style: none;
  padding-left: 0;
}
.custom-list li {
  padding-left: 25px;
  position: relative;
}
.custom-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #2ecc71;
  font-weight: bold;
}

/* Styled list */
.styled-list {
  list-style: none;
  padding: 0;
}
.styled-list li {
  background: #f5f5f5;
  margin: 5px 0;
  padding: 15px 20px;
  border-left: 4px solid #3498db;
  transition: all 0.3s;
}
.styled-list li:hover {
  background: #3498db;
  color: white;
  padding-left: 30px;
}

h2 { margin-top: 25px; }
</style>
</head>
<body>

<h1>CSS Lists</h1>

<h2>Unordered List Types</h2>
<ul class="disc"><li>Disc (default)</li><li>Item</li></ul>
<ul class="circle"><li>Circle</li><li>Item</li></ul>
<ul class="square"><li>Square</li><li>Item</li></ul>

<h2>Ordered List Types</h2>
<ol class="decimal"><li>Decimal</li><li>Item</li></ol>
<ol class="roman"><li>Roman</li><li>Item</li></ol>
<ol class="alpha"><li>Alpha</li><li>Item</li></ol>

<h2>Custom Checkmarks</h2>
<ul class="custom-list">
  <li>Completed task</li>
  <li>Another task done</li>
  <li>All finished!</li>
</ul>

<h2>Styled List</h2>
<ul class="styled-list">
  <li>Hover over me!</li>
  <li>Interactive list items</li>
  <li>With smooth transitions</li>
</ul>

</body>
</html>`,
    },
    tables: {
      title: 'CSS Tables',
      content: `
# CSS Tables

Style HTML tables with CSS.

## Table Properties

<pre><code class="css">
/* Border collapse */
border-collapse: collapse;
border-collapse: separate;

/* Border spacing */
border-spacing: 10px;

/* Cell padding */
th, td {
  padding: 12px;
}

/* Text alignment */
text-align: left;
vertical-align: middle;

/* Zebra stripes */
tr:nth-child(even) {
  background: #f2f2f2;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

/* Basic table */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background: #3498db;
  color: white;
}

/* Zebra stripes */
tr:nth-child(even) {
  background: #f5f5f5;
}

/* Hover effect */
tr:hover {
  background: #e8f4fd;
}

/* Modern table */
.modern-table {
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 10px;
  overflow: hidden;
}

.modern-table th, .modern-table td {
  border: none;
  border-bottom: 1px solid #eee;
}

.modern-table th {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.modern-table tr:last-child td {
  border-bottom: none;
}
</style>
</head>
<body>

<h1>CSS Tables</h1>

<h2>Basic Styled Table</h2>
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Role</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>Developer</td>
      <td>Active</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>Designer</td>
      <td>Active</td>
    </tr>
    <tr>
      <td>Bob Wilson</td>
      <td>Manager</td>
      <td>Away</td>
    </tr>
  </tbody>
</table>

<h2>Modern Table</h2>
<table class="modern-table">
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Stock</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget A</td>
      <td>$29.99</td>
      <td>150</td>
    </tr>
    <tr>
      <td>Widget B</td>
      <td>$49.99</td>
      <td>89</td>
    </tr>
    <tr>
      <td>Widget C</td>
      <td>$19.99</td>
      <td>200</td>
    </tr>
  </tbody>
</table>

</body>
</html>`,
    },
    home: {
      title: 'CSS Tutorial',
      content: `
# Welcome to CSS Tutorial

CSS is the language we use to style an HTML document.

CSS describes how HTML elements should be displayed.

## What You Will Learn

In this tutorial, you will learn CSS from basic to advanced:

- **CSS Basics** - Syntax, Selectors, Colors, Backgrounds
- **Box Model** - Margins, Padding, Borders, Width/Height
- **Text & Fonts** - Typography, Icons, Custom Fonts
- **Layout** - Display, Position, Float, Flexbox, Grid
- **Advanced** - Transitions, Animations, Transforms
- **Responsive** - Media Queries, Mobile-First Design

## Why Learn CSS?

CSS is one of the core languages of the web. Here's why you should learn it:

- **Control Visual Design** - Make your websites beautiful
- **Responsive Layouts** - Build sites that work on any device
- **Animations** - Add interactive visual effects
- **Career Opportunity** - Every web developer needs CSS skills

## Example

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
    introduction: {
      title: 'CSS Introduction',
      content: `
# CSS Introduction

CSS stands for **Cascading Style Sheets**.

CSS describes how HTML elements are to be displayed on screen, paper, or in other media.

## What is CSS?

- **CSS** stands for Cascading Style Sheets
- CSS describes how HTML elements are to be displayed
- CSS saves a lot of work - it can control the layout of multiple web pages all at once
- External stylesheets are stored in CSS files

## Why Use CSS?

CSS is used to define styles for your web pages, including the design, layout and variations in display for different devices and screen sizes.

## CSS Solved a Big Problem

HTML was NEVER intended to contain tags for formatting a web page!

HTML was created to describe the content of a web page, like:

<pre><code class="html">
&lt;h1&gt;This is a heading&lt;/h1&gt;
&lt;p&gt;This is a paragraph.&lt;/p&gt;
</code></pre>

When tags like <code><font></code> and color attributes were added to the HTML 3.2 specification, it started a nightmare for web developers. Development of large websites became a long, expensive process.

To solve this problem, the World Wide Web Consortium (W3C) created CSS.

## CSS Saves a Lot of Work!

The style definitions are normally saved in external .css files.

With an external stylesheet file, you can change the look of an entire website by changing just one file!
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body {
  background-color: #f0f0f0;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  padding: 20px;
  background-color: #4CAF50;
  color: white;
}

p {
  color: #666;
  line-height: 1.6;
  padding: 0 20px;
}
</style>
</head>
<body>

<h1>CSS Makes Styling Easy</h1>
<p>CSS separates content from presentation. This paragraph is styled with CSS.</p>
<p>You can change colors, fonts, spacing, and much more!</p>

</body>
</html>`,
    },
    syntax: {
      title: 'CSS Syntax',
      content: `
# CSS Syntax

A CSS rule consists of a selector and a declaration block.

## CSS Syntax

<pre><code class="css">
selector {
  property: value;
}
</code></pre>

The selector points to the HTML element you want to style.

The declaration block contains one or more declarations separated by semicolons.

Each declaration includes a CSS property name and a value, separated by a colon.

## Example Explained

<pre><code class="css">
p {
  color: red;
  text-align: center;
}
</code></pre>

- <code>p</code> is a selector (it selects the <code><p></code> element)
- <code>color</code> is a property, and <code>red</code> is the property value
- <code>text-align</code> is a property, and <code>center</code> is the property value

## Multiple Declarations

<pre><code class="css">
h1 {
  color: blue;
  font-size: 24px;
  font-family: Arial;
  text-transform: uppercase;
}
</code></pre>

## CSS Comments

Comments are used to explain your code:

<pre><code class="css">
/* This is a single-line comment */

/* This is
a multi-line
comment */

p {
  color: red; /* This is also a comment */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Style for paragraphs */
p {
  color: red;
  text-align: center;
}

/* Style for headings */
h1 {
  color: blue;
  font-size: 32px;
  font-family: Arial, sans-serif;
  text-transform: uppercase;
  border-bottom: 2px solid blue;
}
</style>
</head>
<body>

<h1>CSS Syntax Example</h1>
<p>This paragraph is styled with CSS.</p>
<p>Multiple CSS properties can be applied to each element.</p>

</body>
</html>`,
    },
    selectors: {
      title: 'CSS Selectors',
      content: `
# CSS Selectors

CSS selectors are used to "find" (or select) the HTML elements you want to style.

## Types of CSS Selectors

We can divide CSS selectors into five categories:

1. **Simple selectors** - select elements based on name, id, class
2. **Combinator selectors** - select elements based on a relationship
3. **Pseudo-class selectors** - select elements based on a state
4. **Pseudo-elements selectors** - select and style a part of an element
5. **Attribute selectors** - select elements based on an attribute

## The Element Selector

The element selector selects HTML elements based on the element name:

<pre><code class="css">
p {
  color: red;
  text-align: center;
}
</code></pre>

## The ID Selector

The id selector uses the id attribute of an HTML element. Use a hash (#) character:

<pre><code class="css">
#para1 {
  text-align: center;
  color: red;
}
</code></pre>

## The Class Selector

The class selector selects elements with a specific class attribute. Use a period (.) character:

<pre><code class="css">
.center {
  text-align: center;
  color: red;
}
</code></pre>

## The Universal Selector

The universal selector (*) selects all HTML elements:

<pre><code class="css">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</code></pre>

## The Grouping Selector

Group selectors to minimize code:

<pre><code class="css">
h1, h2, p {
  text-align: center;
  color: red;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Element selector */
p {
  font-size: 16px;
}

/* ID selector */
#special {
  color: green;
  font-weight: bold;
}

/* Class selector */
.highlight {
  background-color: yellow;
  padding: 5px;
}

/* Universal selector */
* {
  font-family: Arial, sans-serif;
}

/* Grouping selector */
h1, h2, h3 {
  color: navy;
}
</style>
</head>
<body>

<h1>CSS Selectors Demo</h1>
<h2>Different Ways to Select Elements</h2>

<p id="special">This paragraph has an ID selector applied.</p>
<p class="highlight">This paragraph has a class selector applied.</p>
<p>This is a regular paragraph with element selector.</p>

</body>
</html>`,
    },
    howto: {
      title: 'How To Add CSS',
      content: `
# How To Add CSS

There are three ways to insert CSS:

1. **External CSS** - Using an external stylesheet file
2. **Internal CSS** - Using a <code><style></code> element in the <code><head></code> section
3. **Inline CSS** - Using the <code>style</code> attribute on individual elements

## External CSS

With an external style sheet, you can change the look of an entire website by changing just one file!

Each HTML page must include a reference to the external style sheet file inside the <code><link></code> element:

<pre><code class="html">
&lt;head&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
</code></pre>

The external .css file:

<pre><code class="css">
body {
  background-color: lightblue;
}

h1 {
  color: navy;
  margin-left: 20px;
}
</code></pre>

## Internal CSS

An internal style sheet may be used if one single HTML page has a unique style:

<pre><code class="html">
&lt;head&gt;
&lt;style&gt;
body {
  background-color: linen;
}

h1 {
  color: maroon;
  margin-left: 40px;
}
&lt;/style&gt;
&lt;/head&gt;
</code></pre>

## Inline CSS

An inline style may be used to apply a unique style for a single element:

<pre><code class="html">
&lt;h1 style="color:blue;text-align:center;"&gt;This is a heading&lt;/h1&gt;
&lt;p style="color:red;"&gt;This is a paragraph.&lt;/p&gt;
</code></pre>

## Cascading Order

What style will be used when there is more than one style specified?

All the styles will "cascade" into a new "virtual" style sheet by this priority (highest to lowest):

1. Inline style (inside an HTML element)
2. External and internal style sheets (in the head section)
3. Browser default
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Internal CSS */
body {
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}

.internal-style {
  color: purple;
  font-size: 18px;
}
</style>
</head>
<body>

<h1>How To Add CSS</h1>

<p class="internal-style">This uses Internal CSS (style tag in head).</p>

<p style="color: blue; font-weight: bold;">This uses Inline CSS (style attribute).</p>

<p>External CSS would be in a separate .css file linked with a link tag.</p>

</body>
</html>`,
    },
    'flexbox-intro': {
      title: 'Flexbox Introduction',
      content: `
# CSS Flexbox

Flexbox is a one-dimensional layout method for arranging items in rows or columns.

## Why Flexbox?

Before Flexbox, we used floats and positioning which were difficult for:
- Vertically centering content
- Making children take up equal space
- Making columns equal height

Flexbox makes these layouts easy!

## Flex Container

To use Flexbox, create a flex container:

<pre><code class="css">
.container {
  display: flex;
}
</code></pre>

## Flex Direction

<pre><code class="css">
.container {
  flex-direction: row;          /* default - horizontal */
  flex-direction: row-reverse;  /* horizontal reversed */
  flex-direction: column;       /* vertical */
  flex-direction: column-reverse;
}
</code></pre>

## Justify Content (Main Axis)

<pre><code class="css">
.container {
  justify-content: flex-start;    /* default */
  justify-content: flex-end;      /* end of container */
  justify-content: center;        /* center items */
  justify-content: space-between; /* equal space between */
  justify-content: space-around;  /* equal space around */
  justify-content: space-evenly;  /* equal space everywhere */
}
</code></pre>

## Align Items (Cross Axis)

<pre><code class="css">
.container {
  align-items: stretch;     /* default - fill container */
  align-items: flex-start;  /* align to start */
  align-items: flex-end;    /* align to end */
  align-items: center;      /* center vertically */
  align-items: baseline;    /* align text baselines */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.flex-container {
  display: flex;
  background-color: #2c3e50;
  padding: 10px;
  margin: 10px 0;
}

.flex-item {
  background-color: #3498db;
  color: white;
  padding: 20px;
  margin: 5px;
  text-align: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-around {
  justify-content: space-around;
}

.align-center {
  height: 150px;
  align-items: center;
}

.column {
  flex-direction: column;
  height: 300px;
}
</style>
</head>
<body>

<h1>CSS Flexbox</h1>

<h2>Default (flex-start)</h2>
<div class="flex-container">
  <div class="flex-item">1</div>
  <div class="flex-item">2</div>
  <div class="flex-item">3</div>
</div>

<h2>justify-content: center</h2>
<div class="flex-container justify-center">
  <div class="flex-item">1</div>
  <div class="flex-item">2</div>
  <div class="flex-item">3</div>
</div>

<h2>justify-content: space-between</h2>
<div class="flex-container justify-between">
  <div class="flex-item">1</div>
  <div class="flex-item">2</div>
  <div class="flex-item">3</div>
</div>

<h2>align-items: center (with height)</h2>
<div class="flex-container align-center">
  <div class="flex-item">Centered</div>
  <div class="flex-item">Vertically</div>
</div>

</body>
</html>`,
    },
    'grid-intro': {
      title: 'CSS Grid Introduction',
      content: `
# CSS Grid Layout

CSS Grid Layout is a two-dimensional layout system for the web.

## Why CSS Grid?

Grid lets you create complex layouts with rows AND columns simultaneously.

- **Flexbox** = 1D (row OR column)
- **Grid** = 2D (rows AND columns)

## Creating a Grid

<pre><code class="css">
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;  /* 3 equal columns */
  grid-template-rows: 100px 200px;      /* 2 rows */
  gap: 10px;                            /* gap between items */
}
</code></pre>

## Grid Template Columns

<pre><code class="css">
/* Fixed widths */
grid-template-columns: 100px 200px 100px;

/* Fractional units */
grid-template-columns: 1fr 2fr 1fr;

/* Mixed */
grid-template-columns: 200px 1fr 1fr;

/* Repeat function */
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(4, 100px);
</code></pre>

## Gap (Gutters)

<pre><code class="css">
.container {
  gap: 20px;              /* row and column gap */
  row-gap: 20px;          /* only row gap */
  column-gap: 10px;       /* only column gap */
}
</code></pre>

## Grid Item Placement

<pre><code class="css">
.item {
  grid-column: 1 / 3;     /* span from line 1 to 3 */
  grid-row: 1 / 2;        /* span from line 1 to 2 */
}

/* Shorthand */
.item {
  grid-column: span 2;    /* span 2 columns */
  grid-row: span 3;       /* span 3 rows */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  background-color: #2c3e50;
  padding: 10px;
}

.grid-item {
  background-color: #3498db;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 18px;
}

.span-2 {
  grid-column: span 2;
  background-color: #e74c3c;
}

.span-row {
  grid-row: span 2;
  background-color: #2ecc71;
}

.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 5px;
  margin-top: 20px;
}

.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }
</style>
</head>
<body>

<h1>CSS Grid Layout</h1>

<h2>Basic 3-Column Grid</h2>
<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item span-2">4 (span 2 columns)</div>
  <div class="grid-item">5</div>
  <div class="grid-item span-row">6 (span 2 rows)</div>
  <div class="grid-item">7</div>
  <div class="grid-item">8</div>
</div>

<h2>12-Column Grid System</h2>
<div class="grid-12">
  <div class="grid-item col-4">4 cols</div>
  <div class="grid-item col-4">4 cols</div>
  <div class="grid-item col-4">4 cols</div>
  <div class="grid-item col-6">6 cols</div>
  <div class="grid-item col-6">6 cols</div>
  <div class="grid-item col-12">12 cols (full width)</div>
</div>

</body>
</html>`,
    },
    animations: {
      title: 'CSS Animations',
      content: `
# CSS Animations

CSS animations allow you to animate HTML elements without JavaScript.

## @keyframes Rule

To create an animation, you need to define keyframes:

<pre><code class="css">
@keyframes slidein {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Or with percentages */
@keyframes colorchange {
  0%   { background-color: red; }
  25%  { background-color: yellow; }
  50%  { background-color: blue; }
  100% { background-color: green; }
}
</code></pre>

## Animation Properties

<pre><code class="css">
.element {
  animation-name: slidein;
  animation-duration: 2s;
  animation-timing-function: ease-in-out;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-fill-mode: forwards;
}
</code></pre>

## Animation Shorthand

<pre><code class="css">
.element {
  animation: slidein 2s ease-in-out 0.5s infinite alternate;
}
</code></pre>

## Timing Functions

- <code>linear</code> - constant speed
- <code>ease</code> - slow start, fast middle, slow end
- <code>ease-in</code> - slow start
- <code>ease-out</code> - slow end
- <code>ease-in-out</code> - slow start and end
- <code>cubic-bezier(n,n,n,n)</code> - custom curve
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
@keyframes slide {
  0% { transform: translateX(0); }
  100% { transform: translateX(200px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes colorChange {
  0% { background-color: #3498db; }
  33% { background-color: #e74c3c; }
  66% { background-color: #2ecc71; }
  100% { background-color: #3498db; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

.box {
  width: 100px;
  height: 100px;
  background-color: #3498db;
  margin: 20px;
  display: inline-block;
  color: white;
  text-align: center;
  line-height: 100px;
}

.slide { animation: slide 2s ease-in-out infinite alternate; }
.pulse { animation: pulse 1s ease-in-out infinite; }
.color { animation: colorChange 3s linear infinite; }
.bounce { animation: bounce 0.8s ease infinite; }

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Animations</h1>

<div class="box slide">Slide</div>
<div class="box pulse">Pulse</div>
<div class="box color">Colors</div>
<div class="box bounce">Bounce</div>

</body>
</html>`,
    },
    transitions: {
      title: 'CSS Transitions',
      content: `
# CSS Transitions

Transitions allow you to change property values smoothly over a duration.

## Transition Properties

<pre><code class="css">
.element {
  transition-property: background-color;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-delay: 0s;
}
</code></pre>

## Shorthand

<pre><code class="css">
.element {
  transition: property duration timing-function delay;
  transition: background-color 0.5s ease;
}

/* Multiple transitions */
.element {
  transition: background-color 0.5s, transform 0.3s, opacity 0.2s;
}

/* All properties */
.element {
  transition: all 0.3s ease;
}
</code></pre>

## Common Use Cases

<pre><code class="css">
/* Button hover effect */
button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: darkblue;
}

/* Scale on hover */
.card {
  transform: scale(1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: scale(1.05);
}
</code></pre>

## Timing Functions

- <code>ease</code> - default, slow-fast-slow
- <code>linear</code> - constant speed
- <code>ease-in</code> - slow start
- <code>ease-out</code> - slow end
- <code>ease-in-out</code> - slow start and end
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.box {
  width: 150px;
  height: 100px;
  margin: 15px;
  display: inline-block;
  text-align: center;
  line-height: 100px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.color-transition {
  background-color: #3498db;
  transition: background-color 0.5s ease;
}
.color-transition:hover {
  background-color: #e74c3c;
}

.scale-transition {
  background-color: #2ecc71;
  transition: transform 0.3s ease;
}
.scale-transition:hover {
  transform: scale(1.2);
}

.multi-transition {
  background-color: #9b59b6;
  border-radius: 0;
  transition: all 0.4s ease;
}
.multi-transition:hover {
  background-color: #f39c12;
  border-radius: 50px;
  transform: rotate(10deg);
}

.btn {
  padding: 15px 30px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, box-shadow 0.3s, transform 0.2s;
}
.btn:hover {
  background-color: #2980b9;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transform: translateY(-2px);
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Transitions</h1>

<div class="box color-transition">Color</div>
<div class="box scale-transition">Scale</div>
<div class="box multi-transition">Multiple</div>

<h2>Button Example</h2>
<button class="btn">Hover Me</button>

</body>
</html>`,
    },
    variables: {
      title: 'CSS Variables',
      content: `
# CSS Variables (Custom Properties)

CSS variables allow you to store values that can be reused throughout your stylesheet.

## Declaring Variables

Variables are declared using the <code>--</code> prefix:

<pre><code class="css">
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --font-size: 16px;
  --spacing: 20px;
}
</code></pre>

## Using Variables

Use the <code>var()</code> function to access variables:

<pre><code class="css">
.element {
  color: var(--primary-color);
  font-size: var(--font-size);
  padding: var(--spacing);
}
</code></pre>

## Fallback Values

<pre><code class="css">
.element {
  color: var(--my-color, blue);  /* blue is fallback */
}
</code></pre>

## Scoping Variables

Variables can be scoped to specific elements:

<pre><code class="css">
:root {
  --color: blue;  /* global */
}

.dark-theme {
  --color: white;  /* only in .dark-theme */
}
</code></pre>

## Benefits

- **Maintainability** - Change one value, update everywhere
- **Theming** - Easy to create dark/light themes
- **Readability** - Meaningful names instead of values
- **Dynamic** - Can be changed with JavaScript
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
:root {
  --primary: #3498db;
  --secondary: #2ecc71;
  --accent: #e74c3c;
  --dark: #2c3e50;
  --light: #ecf0f1;
  --spacing: 20px;
  --radius: 8px;
}

body {
  font-family: Arial, sans-serif;
  background-color: var(--light);
  padding: var(--spacing);
}

.card {
  background-color: white;
  padding: var(--spacing);
  margin: var(--spacing) 0;
  border-radius: var(--radius);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  margin: 5px;
}

.btn-secondary {
  background-color: var(--secondary);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  margin: 5px;
}

.btn-accent {
  background-color: var(--accent);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  margin: 5px;
}

h1 { color: var(--dark); }
</style>
</head>
<body>

<h1>CSS Variables Demo</h1>

<div class="card">
  <h2>Using CSS Variables</h2>
  <p>All colors and spacing use CSS variables for easy theming.</p>
  <button class="btn-primary">Primary</button>
  <button class="btn-secondary">Secondary</button>
  <button class="btn-accent">Accent</button>
</div>

<div class="card">
  <h2>Benefits</h2>
  <p>Change --primary in :root and all primary buttons update!</p>
</div>

</body>
</html>`,
    },
    'media-queries': {
      title: 'CSS Media Queries',
      content: `
# CSS Media Queries

Media queries allow you to apply CSS rules based on device characteristics.

## Basic Syntax

<pre><code class="css">
@media screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}
</code></pre>

## Common Breakpoints

<pre><code class="css">
/* Mobile phones */
@media (max-width: 480px) { }

/* Small tablets */
@media (max-width: 768px) { }

/* Tablets */
@media (max-width: 1024px) { }

/* Laptops */
@media (max-width: 1200px) { }

/* Desktop */
@media (min-width: 1201px) { }
</code></pre>

## Mobile-First Approach

<pre><code class="css">
/* Base styles for mobile */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}
</code></pre>

## Media Types

- <code>all</code> - All devices (default)
- <code>screen</code> - Screens
- <code>print</code> - Printers

## Features

- <code>width</code> / <code>min-width</code> / <code>max-width</code>
- <code>height</code> / <code>min-height</code> / <code>max-height</code>
- <code>orientation</code> - portrait or landscape
- <code>prefers-color-scheme</code> - light or dark mode
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* {
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

.card {
  background: #3498db;
  color: white;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
}

/* Tablet: 2 columns */
@media (min-width: 600px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 columns */
@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.size-indicator {
  padding: 10px;
  background: #2ecc71;
  color: white;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 5px;
}

.size-indicator::after {
  content: "Mobile (1 column)";
}

@media (min-width: 600px) {
  .size-indicator::after {
    content: "Tablet (2 columns)";
  }
  .size-indicator { background: #f39c12; }
}

@media (min-width: 900px) {
  .size-indicator::after {
    content: "Desktop (4 columns)";
  }
  .size-indicator { background: #e74c3c; }
}
</style>
</head>
<body>

<div class="container">
  <h1>Responsive Media Queries</h1>
  <p>Resize the browser to see the layout change!</p>
  
  <div class="size-indicator"></div>
  
  <div class="grid">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
    <div class="card">Card 4</div>
  </div>
</div>

</body>
</html>`,
    },
    gradients: {
      title: 'CSS Gradients',
      content: `
# CSS Gradients

CSS gradients let you display smooth transitions between two or more colors.

## Types of Gradients

1. **Linear Gradients** - goes down/up/left/right/diagonally
2. **Radial Gradients** - radiates from the center
3. **Conic Gradients** - rotates around a center point

## Linear Gradient

<pre><code class="css">
/* Top to bottom (default) */
background: linear-gradient(red, yellow);

/* Left to right */
background: linear-gradient(to right, red, yellow);

/* Diagonal */
background: linear-gradient(to bottom right, red, yellow);

/* Using angles */
background: linear-gradient(90deg, red, yellow);

/* Multiple colors */
background: linear-gradient(red, yellow, green, blue);

/* Color stops */
background: linear-gradient(red 0%, yellow 50%, green 100%);
</code></pre>

## Radial Gradient

<pre><code class="css">
/* Basic radial */
background: radial-gradient(red, yellow);

/* Ellipse shape (default) */
background: radial-gradient(ellipse, red, yellow);

/* Circle shape */
background: radial-gradient(circle, red, yellow);

/* Position */
background: radial-gradient(circle at top left, red, yellow);
</code></pre>

## Conic Gradient

<pre><code class="css">
background: conic-gradient(red, yellow, green);

/* Color wheel */
background: conic-gradient(
  red, yellow, lime, aqua, blue, magenta, red
);
</code></pre>

## Repeating Gradients

<pre><code class="css">
background: repeating-linear-gradient(
  45deg,
  red 0px, red 10px,
  yellow 10px, yellow 20px
);
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.gradient-box {
  width: 200px;
  height: 100px;
  margin: 10px;
  display: inline-block;
  border-radius: 8px;
  color: white;
  text-align: center;
  line-height: 100px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.linear1 {
  background: linear-gradient(#3498db, #2ecc71);
}

.linear2 {
  background: linear-gradient(to right, #e74c3c, #f39c12);
}

.linear3 {
  background: linear-gradient(45deg, #9b59b6, #3498db, #2ecc71);
}

.radial1 {
  background: radial-gradient(circle, #f39c12, #e74c3c);
}

.radial2 {
  background: radial-gradient(circle at top left, #3498db, #9b59b6);
}

.conic1 {
  background: conic-gradient(#e74c3c, #f39c12, #2ecc71, #3498db, #9b59b6, #e74c3c);
}

.repeating {
  background: repeating-linear-gradient(
    45deg,
    #3498db 0px, #3498db 10px,
    #2980b9 10px, #2980b9 20px
  );
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Gradients</h1>

<h2>Linear Gradients</h2>
<div class="gradient-box linear1">Top→Bottom</div>
<div class="gradient-box linear2">Left→Right</div>
<div class="gradient-box linear3">Diagonal</div>

<h2>Radial Gradients</h2>
<div class="gradient-box radial1">Center</div>
<div class="gradient-box radial2">Top Left</div>

<h2>Conic & Repeating</h2>
<div class="gradient-box conic1">Conic</div>
<div class="gradient-box repeating">Repeating</div>

</body>
</html>`,
    },
    opacity: {
      title: 'CSS Opacity',
      content: `
# CSS Opacity

The <code>opacity</code> property specifies the transparency of an element.

## Syntax

<pre><code class="css">
.element {
  opacity: 0.5;  /* 0 = fully transparent, 1 = fully opaque */
}
</code></pre>

## Hover Effect

<pre><code class="css">
img {
  opacity: 0.5;
}

img:hover {
  opacity: 1.0;
}
</code></pre>

## RGBA Alternative

<pre><code class="css">
/* Only background is transparent */
.element {
  background: rgba(255, 0, 0, 0.5);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.box {
  width: 150px;
  height: 100px;
  background: #3498db;
  color: white;
  display: inline-block;
  margin: 10px;
  text-align: center;
  line-height: 100px;
}

.opacity-100 { opacity: 1.0; }
.opacity-75 { opacity: 0.75; }
.opacity-50 { opacity: 0.5; }
.opacity-25 { opacity: 0.25; }

.hover-effect {
  opacity: 0.5;
  transition: opacity 0.3s;
  cursor: pointer;
}
.hover-effect:hover { opacity: 1.0; }

.rgba-box {
  background: rgba(231, 76, 60, 0.5);
  padding: 20px;
  margin: 10px 0;
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Opacity</h1>

<div class="box opacity-100">100%</div>
<div class="box opacity-75">75%</div>
<div class="box opacity-50">50%</div>
<div class="box opacity-25">25%</div>

<h2>Hover Effect</h2>
<div class="box hover-effect">Hover me!</div>

<h2>RGBA (only background transparent)</h2>
<div class="rgba-box">
  <strong>Text stays fully visible!</strong>
</div>

</body>
</html>`,
    },
    'navigation-bars': {
      title: 'CSS Navigation Bars',
      content: `
# CSS Navigation Bars

Navigation bars are important for any website.

## Horizontal Navbar

<pre><code class="css">
.navbar {
  background-color: #333;
  overflow: hidden;
}

.navbar a {
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

.navbar a:hover {
  background-color: #ddd;
  color: black;
}
</code></pre>

## Vertical Navbar

<pre><code class="css">
.sidenav {
  width: 200px;
  background-color: #f1f1f1;
}

.sidenav a {
  display: block;
  padding: 12px;
  text-decoration: none;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Horizontal Navbar */
.navbar {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.navbar a {
  float: left;
  color: white;
  text-align: center;
  padding: 16px 20px;
  text-decoration: none;
  transition: all 0.3s;
}

.navbar a:hover {
  background: rgba(255,255,255,0.1);
}

.navbar a.active {
  background: #e74c3c;
}

.navbar .right { float: right; }

/* Vertical Sidebar */
.sidenav {
  width: 200px;
  background: #2c3e50;
  margin-top: 20px;
}

.sidenav a {
  display: block;
  color: white;
  padding: 14px 20px;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: all 0.3s;
}

.sidenav a:hover {
  background: #34495e;
  border-left-color: #3498db;
}

body { font-family: Arial; margin: 0; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Navigation Bars</h1>

<h2>Horizontal Navbar</h2>
<div class="navbar">
  <a class="active" href="#">Home</a>
  <a href="#">About</a>
  <a href="#">Services</a>
  <a href="#">Contact</a>
  <a href="#" class="right">Login</a>
</div>

<h2>Vertical Sidebar</h2>
<div class="sidenav">
  <a href="#">Dashboard</a>
  <a href="#">Profile</a>
  <a href="#">Settings</a>
  <a href="#">Logout</a>
</div>

</body>
</html>`,
    },
    forms: {
      title: 'CSS Forms',
      content: `
# CSS Forms

Style HTML forms to look more professional.

## Input Styling

<pre><code class="css">
input[type="text"] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
}

input[type="text"]:focus {
  border-color: #3498db;
  outline: none;
}
</code></pre>

## Button Styling

<pre><code class="css">
button {
  background-color: #3498db;
  color: white;
  padding: 14px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #2980b9;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; }

.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 10px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input, select, textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus, select:focus, textarea:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52,152,219,0.3);
}

button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Form Styling</h1>

<div class="form-container">
  <form>
    <label>Full Name</label>
    <input type="text" placeholder="John Doe">
    
    <label>Email</label>
    <input type="email" placeholder="john@example.com">
    
    <label>Country</label>
    <select>
      <option>Select country</option>
      <option>USA</option>
      <option>UK</option>
      <option>India</option>
    </select>
    
    <label>Message</label>
    <textarea rows="4" placeholder="Your message..."></textarea>
    
    <button type="submit">Submit</button>
  </form>
</div>

</body>
</html>`,
    },
    units: {
      title: 'CSS Units',
      content: `
# CSS Units

CSS has several different units for expressing length.

## Absolute Units

| Unit | Description |
|------|-------------|
| px | Pixels |
| pt | Points (1/72 inch) |
| cm | Centimeters |
| mm | Millimeters |
| in | Inches |

## Relative Units

| Unit | Description |
|------|-------------|
| em | Relative to parent font-size |
| rem | Relative to root font-size |
| % | Percentage of parent |
| vw | 1% of viewport width |
| vh | 1% of viewport height |
| vmin | 1% of smaller viewport dimension |
| vmax | 1% of larger viewport dimension |

<pre><code class="css">
.responsive {
  font-size: 2rem;
  width: 80%;
  height: 50vh;
  padding: 2em;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
:root { font-size: 16px; }

.box {
  background: #3498db;
  color: white;
  margin: 10px 0;
  padding: 15px;
}

.px { width: 200px; }
.percent { width: 50%; }
.em { width: 20em; font-size: 14px; }
.rem { width: 15rem; }
.vw { width: 50vw; }
.vh { height: 20vh; }

.font-px { font-size: 16px; }
.font-em { font-size: 1.5em; }
.font-rem { font-size: 1.5rem; }
.font-vw { font-size: 3vw; }

body { font-family: Arial; padding: 20px; }
h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>CSS Units</h1>

<h2>Width Units</h2>
<div class="box px">200px</div>
<div class="box percent">50%</div>
<div class="box em">20em</div>
<div class="box rem">15rem</div>
<div class="box vw">50vw (viewport)</div>

<h2>Font Size Units</h2>
<p class="font-px">16px - Fixed pixels</p>
<p class="font-em">1.5em - Relative to parent</p>
<p class="font-rem">1.5rem - Relative to root (16px × 1.5 = 24px)</p>
<p class="font-vw">3vw - Resize window!</p>

</body>
</html>`,
    },
    specificity: {
      title: 'CSS Specificity',
      content: `
# CSS Specificity

Specificity determines which CSS rule is applied when multiple rules match.

## Hierarchy (Lowest to Highest)

1. **Type selectors** (h1, div, p) - 0,0,1
2. **Class selectors** (.class) - 0,1,0
3. **ID selectors** (#id) - 1,0,0
4. **Inline styles** - 1,0,0,0
5. **!important** - Highest priority

## Calculating Specificity

<pre><code class="css">
p { }                    /* 0,0,1 */
.class { }               /* 0,1,0 */
#id { }                  /* 1,0,0 */
div p { }                /* 0,0,2 */
div.class p { }          /* 0,1,2 */
#id .class p { }         /* 1,1,1 */
</code></pre>

## Tips

- Avoid !important when possible
- Use classes over IDs for styling
- Keep selectors simple
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Specificity: 0,0,1 */
p { color: black; }

/* Specificity: 0,1,0 (wins over element) */
.text { color: blue; }

/* Specificity: 1,0,0 (wins over class) */
#special { color: green; }

/* Specificity: 0,1,1 */
p.text { color: purple; }

/* Specificity: 1,1,0 (higher than #special alone? No!) */
.text#special { color: orange; }

/* !important overrides everything */
.important { color: red !important; }

.demo {
  padding: 10px;
  margin: 5px 0;
  background: #f5f5f5;
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Specificity</h1>

<div class="demo">
  <p>Just p selector - Black</p>
</div>

<div class="demo">
  <p class="text">p.text selector - Purple (0,1,1)</p>
</div>

<div class="demo">
  <p class="text" id="special">With #special ID - Green (1,0,0)</p>
</div>

<div class="demo">
  <p class="text important" id="special">With !important - Red (overrides all!)</p>
</div>

<h2>Specificity Values</h2>
<ul>
  <li>p { } → 0,0,1</li>
  <li>.class { } → 0,1,0</li>
  <li>#id { } → 1,0,0</li>
  <li>p.class { } → 0,1,1</li>
  <li>#id .class p { } → 1,1,1</li>
</ul>

</body>
</html>`,
    },
    shadows: {
      title: 'CSS Shadows',
      content: `
# CSS Shadows

Add shadow effects to elements and text.

## Box Shadow

<pre><code class="css">
.box {
  box-shadow: h-offset v-offset blur spread color;
  box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.5);
}
</code></pre>

## Multiple Shadows

<pre><code class="css">
.box {
  box-shadow: 
    3px 3px 5px rgba(0,0,0,0.2),
    -3px -3px 5px rgba(255,255,255,0.5);
}
</code></pre>

## Inset Shadow

<pre><code class="css">
.box {
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}
</code></pre>

## Text Shadow

<pre><code class="css">
h1 {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.box {
  width: 200px;
  height: 100px;
  background: white;
  margin: 20px;
  display: inline-block;
  border-radius: 10px;
  text-align: center;
  line-height: 100px;
}

.shadow1 { box-shadow: 5px 5px 10px rgba(0,0,0,0.3); }
.shadow2 { box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.shadow3 { box-shadow: 0 0 20px #3498db; }
.shadow-inset { box-shadow: inset 0 0 20px rgba(0,0,0,0.3); }
.shadow-multi {
  box-shadow: 
    5px 5px 0 #3498db,
    10px 10px 0 #2ecc71,
    15px 15px 0 #e74c3c;
}

.text-shadow1 {
  font-size: 36px;
  color: #333;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.text-shadow2 {
  font-size: 36px;
  color: white;
  text-shadow: 
    0 0 10px #3498db,
    0 0 20px #3498db,
    0 0 40px #3498db;
}

body { font-family: Arial; padding: 20px; background: #f0f0f0; }
</style>
</head>
<body>

<h1>CSS Shadows</h1>

<h2>Box Shadows</h2>
<div class="box shadow1">Basic</div>
<div class="box shadow2">Soft</div>
<div class="box shadow3">Glow</div>
<div class="box shadow-inset">Inset</div>
<div class="box shadow-multi">Multi</div>

<h2>Text Shadows</h2>
<p class="text-shadow1">Simple Text Shadow</p>
<div style="background:#2c3e50;padding:20px;">
  <p class="text-shadow2">Glowing Text</p>
</div>

</body>
</html>`,
    },
    '2d-transforms': {
      title: 'CSS 2D Transforms',
      content: `
# CSS 2D Transforms

Transform elements in 2D space.

## Transform Functions

<pre><code class="css">
/* Move */
transform: translate(50px, 100px);
transform: translateX(50px);
transform: translateY(100px);

/* Rotate */
transform: rotate(45deg);

/* Scale */
transform: scale(1.5);
transform: scale(2, 0.5);

/* Skew */
transform: skew(20deg, 10deg);

/* Multiple */
transform: translate(50px) rotate(45deg) scale(1.2);
</code></pre>

## Transform Origin

<pre><code class="css">
.box {
  transform-origin: top left;
  transform: rotate(45deg);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.container {
  display: inline-block;
  margin: 30px;
  text-align: center;
}

.box {
  width: 100px;
  height: 100px;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.translate:hover { transform: translate(20px, 20px); }
.rotate:hover { transform: rotate(45deg); }
.scale:hover { transform: scale(1.3); }
.skew:hover { transform: skew(15deg, 5deg); }
.multiple:hover { 
  transform: translateX(10px) rotate(10deg) scale(1.1); 
}

.origin-demo {
  transform-origin: top left;
}
.origin-demo:hover { transform: rotate(45deg); }

body { font-family: Arial; padding: 20px; }
p { margin: 5px 0; font-size: 12px; color: #666; }
</style>
</head>
<body>

<h1>CSS 2D Transforms</h1>
<p>Hover over the boxes!</p>

<div class="container">
  <div class="box translate">Translate</div>
  <p>translate(20px, 20px)</p>
</div>

<div class="container">
  <div class="box rotate">Rotate</div>
  <p>rotate(45deg)</p>
</div>

<div class="container">
  <div class="box scale">Scale</div>
  <p>scale(1.3)</p>
</div>

<div class="container">
  <div class="box skew">Skew</div>
  <p>skew(15deg, 5deg)</p>
</div>

<div class="container">
  <div class="box multiple">Multiple</div>
  <p>Combined transforms</p>
</div>

</body>
</html>`,
    },
    '3d-transforms': {
      title: 'CSS 3D Transforms',
      content: `
# CSS 3D Transforms

Transform elements in 3D space.

## 3D Functions

<pre><code class="css">
/* Rotate in 3D */
transform: rotateX(45deg);
transform: rotateY(45deg);
transform: rotateZ(45deg);
transform: rotate3d(1, 1, 0, 45deg);

/* Translate in 3D */
transform: translateZ(50px);
transform: translate3d(x, y, z);

/* Perspective */
perspective: 500px;
transform: perspective(500px) rotateY(45deg);
</code></pre>

## Preserve 3D

<pre><code class="css">
.container {
  transform-style: preserve-3d;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.scene {
  perspective: 600px;
  display: inline-block;
  margin: 30px;
}

.box {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.5s;
}

.rotateX:hover { transform: rotateX(60deg); }
.rotateY:hover { transform: rotateY(60deg); }
.rotateZ:hover { transform: rotateZ(60deg); }

/* 3D Card Flip */
.card {
  width: 150px;
  height: 200px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: bold;
}

.card-front { background: #3498db; color: white; }
.card-back {
  background: #e74c3c;
  color: white;
  transform: rotateY(180deg);
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS 3D Transforms</h1>

<h2>Rotate (hover)</h2>
<div class="scene"><div class="box rotateX">RotateX</div></div>
<div class="scene"><div class="box rotateY">RotateY</div></div>
<div class="scene"><div class="box rotateZ">RotateZ</div></div>

<h2>3D Card Flip</h2>
<div class="scene">
  <div class="card">
    <div class="card-face card-front">FRONT</div>
    <div class="card-face card-back">BACK</div>
  </div>
</div>

</body>
</html>`,
    },
    buttons: {
      title: 'CSS Buttons',
      content: `
# CSS Buttons

Learn how to style buttons with CSS.

## Basic Button

<pre><code class="css">
.btn {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background-color: #2980b9;
}
</code></pre>

## Button Variations

<pre><code class="css">
/* Rounded */
.btn-rounded { border-radius: 25px; }

/* Outline */
.btn-outline {
  background: transparent;
  border: 2px solid #3498db;
  color: #3498db;
}

/* Shadow */
.btn-shadow {
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  margin: 5px;
  transition: all 0.3s;
}

/* Colors */
.btn-primary { background: #3498db; color: white; }
.btn-success { background: #2ecc71; color: white; }
.btn-danger { background: #e74c3c; color: white; }
.btn-warning { background: #f39c12; color: white; }
.btn-dark { background: #2c3e50; color: white; }

/* Hover effects */
.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.btn:active { transform: translateY(0); }

/* Styles */
.btn-rounded { border-radius: 25px; }
.btn-outline {
  background: transparent;
  border: 2px solid #3498db;
  color: #3498db;
}
.btn-outline:hover { background: #3498db; color: white; }

/* Sizes */
.btn-sm { padding: 8px 16px; font-size: 14px; }
.btn-lg { padding: 16px 32px; font-size: 18px; }

/* Icon button */
.btn-icon { display: inline-flex; align-items: center; gap: 8px; }

/* Loading */
.btn-loading { position: relative; color: transparent; }
.btn-loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

body { font-family: Arial; padding: 20px; }
h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>CSS Buttons</h1>

<h2>Colors</h2>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-dark">Dark</button>

<h2>Styles</h2>
<button class="btn btn-primary btn-rounded">Rounded</button>
<button class="btn btn-outline">Outline</button>

<h2>Sizes</h2>
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary">Normal</button>
<button class="btn btn-primary btn-lg">Large</button>

<h2>Special</h2>
<button class="btn btn-primary btn-icon">📥 Download</button>
<button class="btn btn-primary btn-loading">Loading</button>

</body>
</html>`,
    },
    'flex-container': {
      title: 'Flex Container',
      content: `
# Flex Container Properties

Properties applied to the flex container (parent).

## Display

<pre><code class="css">
.container {
  display: flex;
}
</code></pre>

## Flex Direction

<pre><code class="css">
flex-direction: row;           /* default */
flex-direction: row-reverse;
flex-direction: column;
flex-direction: column-reverse;
</code></pre>

## Flex Wrap

<pre><code class="css">
flex-wrap: nowrap;    /* default */
flex-wrap: wrap;
flex-wrap: wrap-reverse;
</code></pre>

## Justify Content (Main Axis)

<pre><code class="css">
justify-content: flex-start;
justify-content: flex-end;
justify-content: center;
justify-content: space-between;
justify-content: space-around;
justify-content: space-evenly;
</code></pre>

## Align Items (Cross Axis)

<pre><code class="css">
align-items: stretch;     /* default */
align-items: flex-start;
align-items: flex-end;
align-items: center;
align-items: baseline;
</code></pre>

## Gap

<pre><code class="css">
gap: 20px;
row-gap: 10px;
column-gap: 20px;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.flex-demo {
  display: flex;
  background: #2c3e50;
  padding: 10px;
  margin: 10px 0;
  min-height: 100px;
}

.item {
  background: #3498db;
  color: white;
  padding: 20px;
  margin: 5px;
  text-align: center;
}

/* Different justify-content values */
.jc-start { justify-content: flex-start; }
.jc-center { justify-content: center; }
.jc-end { justify-content: flex-end; }
.jc-between { justify-content: space-between; }
.jc-around { justify-content: space-around; }
.jc-evenly { justify-content: space-evenly; }

/* Align items */
.ai-stretch .item { padding: 10px; }
.ai-center { align-items: center; height: 120px; }
.ai-end { align-items: flex-end; height: 120px; }

/* Direction */
.direction-column { flex-direction: column; height: 200px; }
.direction-reverse { flex-direction: row-reverse; }

/* Gap */
.with-gap { gap: 20px; }

body { font-family: Arial; padding: 20px; }
h3 { margin: 20px 0 5px; }
</style>
</head>
<body>

<h1>Flex Container Properties</h1>

<h3>justify-content: flex-start (default)</h3>
<div class="flex-demo jc-start">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

<h3>justify-content: center</h3>
<div class="flex-demo jc-center">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

<h3>justify-content: space-between</h3>
<div class="flex-demo jc-between">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

<h3>align-items: center</h3>
<div class="flex-demo ai-center">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

<h3>flex-direction: column</h3>
<div class="flex-demo direction-column">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

</body>
</html>`,
    },
    'flex-items': {
      title: 'Flex Items',
      content: `
# Flex Items Properties

Properties applied to flex items (children).

## Order

<pre><code class="css">
.item { order: 2; }  /* default is 0 */
</code></pre>

## Flex Grow

<pre><code class="css">
.item { flex-grow: 1; }  /* take available space */
</code></pre>

## Flex Shrink

<pre><code class="css">
.item { flex-shrink: 0; }  /* don't shrink */
</code></pre>

## Flex Basis

<pre><code class="css">
.item { flex-basis: 200px; }  /* initial size */
</code></pre>

## Flex Shorthand

<pre><code class="css">
.item {
  flex: 1;           /* grow:1, shrink:1, basis:0% */
  flex: 1 1 200px;   /* grow, shrink, basis */
}
</code></pre>

## Align Self

<pre><code class="css">
.item {
  align-self: flex-start;
  align-self: center;
  align-self: flex-end;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.flex-demo {
  display: flex;
  background: #2c3e50;
  padding: 10px;
  margin: 10px 0;
  height: 120px;
}

.item {
  background: #3498db;
  color: white;
  padding: 20px;
  margin: 5px;
  text-align: center;
}

/* Flex grow */
.grow-demo .grow-1 { flex-grow: 1; background: #e74c3c; }
.grow-demo .grow-2 { flex-grow: 2; background: #2ecc71; }

/* Order */
.order-demo .order-3 { order: 3; }
.order-demo .order-1 { order: 1; }
.order-demo .order-2 { order: 2; }

/* Flex basis */
.basis-demo .item { flex-basis: 100px; }
.basis-demo .basis-200 { flex-basis: 200px; background: #9b59b6; }

/* Align self */
.align-demo { align-items: flex-start; }
.align-demo .self-center { align-self: center; background: #e74c3c; }
.align-demo .self-end { align-self: flex-end; background: #2ecc71; }

body { font-family: Arial; padding: 20px; }
h3 { margin: 20px 0 5px; }
</style>
</head>
<body>

<h1>Flex Items Properties</h1>

<h3>flex-grow</h3>
<div class="flex-demo grow-demo">
  <div class="item">Normal</div>
  <div class="item grow-1">grow: 1</div>
  <div class="item grow-2">grow: 2</div>
</div>

<h3>order (reordering items)</h3>
<div class="flex-demo order-demo">
  <div class="item order-3">A (order:3)</div>
  <div class="item order-1">B (order:1)</div>
  <div class="item order-2">C (order:2)</div>
</div>

<h3>flex-basis</h3>
<div class="flex-demo basis-demo">
  <div class="item">100px</div>
  <div class="item basis-200">200px</div>
  <div class="item">100px</div>
</div>

<h3>align-self</h3>
<div class="flex-demo align-demo">
  <div class="item">Start</div>
  <div class="item self-center">Center</div>
  <div class="item self-end">End</div>
</div>

</body>
</html>`,
    },
    'grid-container': {
      title: 'Grid Container',
      content: `
# Grid Container Properties

Properties applied to the grid container.

## Display Grid

<pre><code class="css">
.container {
  display: grid;
}
</code></pre>

## Grid Template Columns/Rows

<pre><code class="css">
grid-template-columns: 100px 200px 100px;
grid-template-columns: 1fr 2fr 1fr;
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

grid-template-rows: 100px 200px;
</code></pre>

## Gap

<pre><code class="css">
gap: 20px;
row-gap: 10px;
column-gap: 20px;
</code></pre>

## Justify/Align Items

<pre><code class="css">
justify-items: start | end | center | stretch;
align-items: start | end | center | stretch;
</code></pre>

## Justify/Align Content

<pre><code class="css">
justify-content: start | end | center | space-between;
align-content: start | end | center | space-between;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.grid {
  display: grid;
  gap: 10px;
  background: #2c3e50;
  padding: 10px;
  margin: 10px 0;
}

.item {
  background: #3498db;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Column examples */
.grid-fixed { grid-template-columns: 100px 150px 100px; }
.grid-fr { grid-template-columns: 1fr 2fr 1fr; }
.grid-repeat { grid-template-columns: repeat(4, 1fr); }
.grid-auto { grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); }

/* With rows */
.grid-rows {
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 80px 120px;
}

body { font-family: Arial; padding: 20px; }
h3 { margin: 20px 0 5px; }
</style>
</head>
<body>

<h1>Grid Container Properties</h1>

<h3>Fixed widths: 100px 150px 100px</h3>
<div class="grid grid-fixed">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
</div>

<h3>Fractional: 1fr 2fr 1fr</h3>
<div class="grid grid-fr">
  <div class="item">1fr</div><div class="item">2fr</div><div class="item">1fr</div>
</div>

<h3>Repeat: repeat(4, 1fr)</h3>
<div class="grid grid-repeat">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div><div class="item">4</div>
</div>

<h3>Auto-fit: minmax(100px, 1fr) - Resize window!</h3>
<div class="grid grid-auto">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
  <div class="item">4</div><div class="item">5</div><div class="item">6</div>
</div>

<h3>With defined rows</h3>
<div class="grid grid-rows">
  <div class="item">1</div><div class="item">2</div><div class="item">3</div>
  <div class="item">4</div><div class="item">5</div><div class="item">6</div>
</div>

</body>
</html>`,
    },
    'grid-items': {
      title: 'Grid Items',
      content: `
# Grid Items Properties

Properties applied to grid items.

## Grid Column/Row

<pre><code class="css">
.item {
  grid-column: 1 / 3;      /* start / end */
  grid-column: span 2;      /* span 2 columns */
  
  grid-row: 1 / 3;
  grid-row: span 2;
}
</code></pre>

## Grid Area

<pre><code class="css">
.item {
  grid-area: 1 / 1 / 3 / 3;  /* row-start / col-start / row-end / col-end */
}
</code></pre>

## Named Grid Areas

<pre><code class="css">
.container {
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(3, 80px);
  gap: 10px;
  background: #2c3e50;
  padding: 10px;
}

.item {
  background: #3498db;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.span-2-cols { grid-column: span 2; background: #e74c3c; }
.span-2-rows { grid-row: span 2; background: #2ecc71; }
.span-area { grid-column: 3 / 5; grid-row: 2 / 4; background: #9b59b6; }

/* Named areas example */
.named-grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header header"
    "sidebar content"
    "footer footer";
  gap: 10px;
  height: 300px;
  margin-top: 20px;
}

.header { grid-area: header; background: #e74c3c; }
.sidebar { grid-area: sidebar; background: #3498db; }
.content { grid-area: content; background: #2ecc71; }
.footer { grid-area: footer; background: #f39c12; }

.named-grid > div {
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>Grid Items Properties</h1>

<h2>Spanning Columns and Rows</h2>
<div class="grid">
  <div class="item span-2-cols">span 2 cols</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item span-2-rows">span 2 rows</div>
  <div class="item">6</div>
  <div class="item span-area">Grid Area</div>
  <div class="item">8</div>
</div>

<h2>Named Grid Areas</h2>
<div class="named-grid">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="content">Content</div>
  <div class="footer">Footer</div>
</div>

</body>
</html>`,
    },
    'rwd-intro': {
      title: 'Responsive Web Design Intro',
      content: `
# Responsive Web Design

Responsive web design makes web pages look good on all devices.

## What is RWD?

- Uses HTML and CSS
- Resizes, hides, shrinks, enlarges, or moves content
- Looks good on desktops, tablets, and phones

## The Viewport

<pre><code class="html">
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
</code></pre>

## Key Techniques

1. **Fluid Grids** - Use percentages, not fixed widths
2. **Flexible Images** - Images that scale
3. **Media Queries** - Apply different styles for different screen sizes

<pre><code class="css">
/* Mobile first */
.container { width: 100%; }

/* Tablet */
@media (min-width: 768px) {
  .container { width: 750px; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { width: 960px; }
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background: #3498db;
  color: white;
  padding: 20px;
  text-align: center;
}

.grid {
  display: grid;
  gap: 20px;
  padding: 20px 0;
}

.card {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

/* Mobile: 1 column */
.grid { grid-template-columns: 1fr; }

/* Tablet: 2 columns */
@media (min-width: 600px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 3 columns */
@media (min-width: 900px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}

body { font-family: Arial; margin: 0; }
</style>
</head>
<body>

<div class="header">
  <h1>Responsive Web Design</h1>
  <p>Resize the browser to see the layout change!</p>
</div>

<div class="container">
  <div class="grid">
    <div class="card">
      <h3>Card 1</h3>
      <p>This layout responds to screen size.</p>
    </div>
    <div class="card">
      <h3>Card 2</h3>
      <p>Mobile: 1 column, Tablet: 2, Desktop: 3</p>
    </div>
    <div class="card">
      <h3>Card 3</h3>
      <p>Built with CSS Grid and media queries.</p>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    comments: {
      title: 'CSS Comments',
      content: `
# CSS Comments

Comments are used to explain your code.

## Syntax

<pre><code class="css">
/* This is a single-line comment */

/* This is
a multi-line
comment */

p {
  color: red; /* Set text color to red */
}
</code></pre>

## Tips

- Comments are ignored by browsers
- Use comments to explain complex code
- Use comments to temporarily disable code during testing
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* ============================
   Main Styles
   ============================ */

body {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5; /* Light gray background */
}

/* Heading styles */
h1 {
  color: #3498db;
  /* text-transform: uppercase; -- temporarily disabled */
}

/* 
   This paragraph style uses:
   - Blue color
   - Larger font size
   - Extra line height for readability
*/
p {
  color: #2c3e50;
  font-size: 18px;
  line-height: 1.6;
}
</style>
</head>
<body>

<h1>CSS Comments Demo</h1>
<p>Comments help explain your CSS code!</p>

</body>
</html>`,
    },
    errors: {
      title: 'CSS Errors',
      content: `
# Common CSS Errors

Learn to avoid and fix common CSS mistakes.

## Common Errors

### 1. Missing Semicolons

<pre><code class="css">
/* Wrong */
p {
  color: red
  font-size: 16px;
}

/* Correct */
p {
  color: red;
  font-size: 16px;
}
</code></pre>

### 2. Missing Closing Braces

<pre><code class="css">
/* Wrong */
p {
  color: red;

h1 {
  color: blue;
}

/* Correct */
p {
  color: red;
}

h1 {
  color: blue;
}
</code></pre>

### 3. Typos in Properties

<pre><code class="css">
/* Wrong */
p {
  colr: red;       /* typo */
  font-sise: 16px; /* typo */
}
</code></pre>

### 4. Invalid Values

<pre><code class="css">
/* Wrong */
p {
  width: 100;      /* missing unit */
  color: redd;     /* invalid color */
}

/* Correct */
p {
  width: 100px;
  color: red;
}
</code></pre>

## Debugging Tips

1. Use browser DevTools (F12)
2. Check the Console for errors
3. Validate your CSS online
4. Check specificity issues
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* CORRECT CSS - Compare with errors above */

body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

/* Correct: semicolons after each property */
h1 {
  color: #3498db;
  font-size: 32px;
  margin-bottom: 20px;
}

/* Correct: closing brace present */
p {
  color: #2c3e50;
  line-height: 1.6;
}

/* Correct: proper units and values */
.box {
  width: 200px;       /* has unit */
  height: 100px;      /* has unit */
  background-color: #e74c3c;  /* valid color */
  margin: 20px 0;
}

/* Correct: properly nested */
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Error Prevention</h1>
  <p>This CSS is error-free! Always check for:</p>
  <ul>
    <li>Missing semicolons</li>
    <li>Missing closing braces</li>
    <li>Typos in properties</li>
    <li>Missing units (px, %, em)</li>
  </ul>
  <div class="box"></div>
</div>

</body>
</html>`,
    },
    dropdowns: {
      title: 'CSS Dropdowns',
      content: `
# CSS Dropdown Menus

Create dropdown menus with pure CSS.

## Basic Dropdown

<pre><code class="css">
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Dropdown container */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown button */
.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 16px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropbtn:hover {
  background-color: #2980b9;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 4px;
  overflow: hidden;
}

/* Links inside dropdown */
.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background 0.2s;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Show dropdown on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Navbar with dropdown */
.navbar {
  background: #2c3e50;
  overflow: hidden;
  padding: 0 20px;
}

.navbar a, .navbar .dropbtn {
  background: transparent;
}

.navbar a {
  float: left;
  color: white;
  padding: 16px 20px;
  text-decoration: none;
}

.navbar .dropdown { float: left; }

body { font-family: Arial; margin: 0; }
</style>
</head>
<body>

<h1 style="padding:20px;">CSS Dropdowns</h1>

<h2 style="padding:0 20px;">Basic Dropdown</h2>
<div style="padding:20px;">
  <div class="dropdown">
    <button class="dropbtn">Dropdown ▼</button>
    <div class="dropdown-content">
      <a href="#">Link 1</a>
      <a href="#">Link 2</a>
      <a href="#">Link 3</a>
    </div>
  </div>
</div>

<h2 style="padding:0 20px;">Navbar with Dropdown</h2>
<div class="navbar">
  <a href="#">Home</a>
  <a href="#">About</a>
  <div class="dropdown">
    <button class="dropbtn">Services ▼</button>
    <div class="dropdown-content">
      <a href="#">Web Design</a>
      <a href="#">Development</a>
      <a href="#">SEO</a>
    </div>
  </div>
  <a href="#">Contact</a>
</div>

</body>
</html>`,
    },
    tooltips: {
      title: 'CSS Tooltips',
      content: `
# CSS Tooltips

Create tooltips using pure CSS.

## Basic Tooltip

<pre><code class="css">
.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: black;
  color: white;
  text-align: center;
  padding: 5px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Base tooltip */
.tooltip {
  position: relative;
  display: inline-block;
  cursor: pointer;
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border-radius: 5px;
  margin: 40px 20px;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 8px 12px;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Top tooltip */
.tooltip-top .tooltiptext {
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-top .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #2c3e50 transparent transparent transparent;
}

/* Bottom tooltip */
.tooltip-bottom .tooltiptext {
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
}

/* Right tooltip */
.tooltip-right .tooltiptext {
  top: 50%;
  left: 110%;
  transform: translateY(-50%);
}

/* Left tooltip */
.tooltip-left .tooltiptext {
  top: 50%;
  right: 110%;
  transform: translateY(-50%);
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Tooltips</h1>

<div class="tooltip tooltip-top">
  Hover (Top)
  <span class="tooltiptext">Top tooltip!</span>
</div>

<div class="tooltip tooltip-bottom">
  Hover (Bottom)
  <span class="tooltiptext">Bottom tooltip!</span>
</div>

<div class="tooltip tooltip-right">
  Hover (Right)
  <span class="tooltiptext">Right tooltip!</span>
</div>

<div class="tooltip tooltip-left">
  Hover (Left)
  <span class="tooltiptext">Left tooltip!</span>
</div>

</body>
</html>`,
    },
    important: {
      title: 'CSS !important',
      content: `
# CSS !important Rule

The <code>!important</code> rule overrides all other declarations.

## Syntax

<pre><code class="css">
p {
  color: red !important;
}
</code></pre>

## When to Use

- Override inline styles
- Override highly specific selectors
- Utility classes (last resort)

## When NOT to Use

- As a first solution
- To fix specificity issues
- In reusable components

## Better Alternatives

1. Increase specificity properly
2. Restructure your CSS
3. Use CSS variables
4. Use cascade layers

<pre><code class="css">
/* Instead of !important */
.btn.btn-primary { color: blue; }

/* Or increase specificity */
body .btn { color: blue; }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Normal CSS */
p { color: black; }
.text { color: blue; }
#special { color: green; }

/* !important overrides everything */
.important-red {
  color: red !important;
}

/* Even inline styles are overridden by !important in stylesheet */
.force-blue {
  color: blue !important;
}

.demo {
  padding: 10px;
  margin: 5px 0;
  background: #f5f5f5;
}

body { font-family: Arial; padding: 20px; }
</style>
</head>
<body>

<h1>CSS !important</h1>

<div class="demo">
  <p>Normal paragraph (black)</p>
</div>

<div class="demo">
  <p class="text">Class .text (blue)</p>
</div>

<div class="demo">
  <p id="special">ID #special (green)</p>
</div>

<div class="demo">
  <p id="special" class="text important-red">
    Has ID, class, AND !important - RED wins!
  </p>
</div>

<div class="demo">
  <p style="color: purple;" class="force-blue">
    Inline style is purple, but !important makes it BLUE
  </p>
</div>

<h2>⚠️ Use Sparingly!</h2>
<p>!important makes CSS harder to maintain. Use proper specificity instead.</p>

</body>
</html>`,
    },
    // ============================================
    // NEW COMPREHENSIVE CSS LESSONS
    // ============================================
    'image-gallery': {
      title: 'CSS Image Gallery',
      content: `
# CSS Image Gallery

Create beautiful, responsive image galleries with CSS.

## Basic Grid Gallery

<pre><code class="css">
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 20px;
}

.gallery img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
}

.gallery img:hover {
  transform: scale(1.05);
}
</code></pre>

## Lightbox Effect

Create a lightbox effect with CSS and minimal JavaScript.

## Masonry Layout

<pre><code class="css">
.masonry {
  columns: 3;
  column-gap: 15px;
}

.masonry img {
  width: 100%;
  margin-bottom: 15px;
  break-inside: avoid;
}
</code></pre>

## Hover Effects

- Scale on hover
- Overlay with text
- Grayscale to color
- Blur effects
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f0f0f0; margin: 0; }
h1 { text-align: center; color: #333; }

/* Grid Gallery */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
}

.gallery-item img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.4s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

/* Overlay */
.gallery-item .overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.8));
  color: white;
  padding: 20px 10px 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .overlay {
  transform: translateY(0);
}

/* Filter Gallery */
.filter-gallery {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.filter-item img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  filter: grayscale(100%);
  transition: filter 0.3s, transform 0.3s;
  cursor: pointer;
}

.filter-item img:hover {
  filter: grayscale(0%);
  transform: scale(1.05);
}
</style>
</head>
<body>

<h1>CSS Image Gallery</h1>

<h2 style="text-align:center; color:#666;">Grid Gallery with Hover Overlay</h2>
<div class="gallery">
  <div class="gallery-item">
    <img src="https://picsum.photos/300/300?random=1" alt="Image 1">
    <div class="overlay">Nature Scene</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/300/300?random=2" alt="Image 2">
    <div class="overlay">Beautiful View</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/300/300?random=3" alt="Image 3">
    <div class="overlay">Landscape</div>
  </div>
  <div class="gallery-item">
    <img src="https://picsum.photos/300/300?random=4" alt="Image 4">
    <div class="overlay">Scenic Photo</div>
  </div>
</div>

<h2 style="text-align:center; color:#666;">Grayscale to Color on Hover</h2>
<div class="filter-gallery">
  <div class="filter-item"><img src="https://picsum.photos/200/200?random=5" alt=""></div>
  <div class="filter-item"><img src="https://picsum.photos/200/200?random=6" alt=""></div>
  <div class="filter-item"><img src="https://picsum.photos/200/200?random=7" alt=""></div>
  <div class="filter-item"><img src="https://picsum.photos/200/200?random=8" alt=""></div>
</div>

</body>
</html>`,
    },
    'image-sprites': {
      title: 'CSS Image Sprites',
      content: `
# CSS Image Sprites

Combine multiple images into one to reduce HTTP requests.

## What are Sprites?

Image sprites combine multiple images into a single image file. CSS is used to display only the portion needed.

## Benefits

- Reduces HTTP requests
- Faster page loading
- Better performance
- Easier to manage icons

## Creating a Sprite

<pre><code class="css">
.icon {
  background-image: url('sprite.png');
  background-repeat: no-repeat;
  display: inline-block;
}

.icon-home {
  width: 32px;
  height: 32px;
  background-position: 0 0;
}

.icon-search {
  width: 32px;
  height: 32px;
  background-position: -32px 0;
}

.icon-settings {
  width: 32px;
  height: 32px;
  background-position: -64px 0;
}
</code></pre>

## Hover States

<pre><code class="css">
.icon-home:hover {
  background-position: 0 -32px;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f5f5f5; }
h1 { color: #333; }

/* Simulated sprite using CSS gradients and shapes */
.sprite-demo {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 24px;
}

.icon:hover {
  transform: scale(1.1);
}

.icon-home { background: linear-gradient(135deg, #667eea, #764ba2); }
.icon-search { background: linear-gradient(135deg, #f093fb, #f5576c); }
.icon-settings { background: linear-gradient(135deg, #4facfe, #00f2fe); }
.icon-user { background: linear-gradient(135deg, #43e97b, #38f9d7); }
.icon-mail { background: linear-gradient(135deg, #fa709a, #fee140); }
.icon-heart { background: linear-gradient(135deg, #ff0844, #ffb199); }

/* Real sprite example using background-position */
.real-sprite {
  margin-top: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.sprite-icon {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin: 10px;
  /* This would reference a real sprite image */
  background: #3498db;
  border-radius: 8px;
  position: relative;
}

.sprite-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 4px;
}

.nav-sprite {
  display: flex;
  gap: 5px;
  background: #2c3e50;
  padding: 10px;
  border-radius: 8px;
}

.nav-item {
  padding: 10px 20px;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item:hover {
  background: #34495e;
}

.nav-icon {
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
}
</style>
</head>
<body>

<h1>CSS Image Sprites</h1>

<h2>Icon Sprites Concept</h2>
<div class="sprite-demo">
  <div class="icon icon-home">🏠</div>
  <div class="icon icon-search">🔍</div>
  <div class="icon icon-settings">⚙️</div>
  <div class="icon icon-user">👤</div>
  <div class="icon icon-mail">✉️</div>
  <div class="icon icon-heart">❤️</div>
</div>

<h2>Navigation with Sprite Icons</h2>
<nav class="nav-sprite">
  <a href="#" class="nav-item"><span class="nav-icon"></span> Home</a>
  <a href="#" class="nav-item"><span class="nav-icon"></span> About</a>
  <a href="#" class="nav-item"><span class="nav-icon"></span> Services</a>
  <a href="#" class="nav-item"><span class="nav-icon"></span> Contact</a>
</nav>

<div class="real-sprite">
  <h3>How Sprites Work:</h3>
  <p>1. Combine all icons into ONE image file</p>
  <p>2. Use background-position to show each icon</p>
  <p>3. Only ONE HTTP request loads all icons!</p>
  <pre style="background:#1e1e1e; color:#d4d4d4; padding:15px; border-radius:8px; overflow-x:auto;">
.icon { 
  background: url('sprites.png'); 
}
.icon-home { background-position: 0 0; }
.icon-search { background-position: -40px 0; }
.icon-settings { background-position: -80px 0; }
  </pre>
</div>

</body>
</html>`,
    },
    counters: {
      title: 'CSS Counters',
      content: `
# CSS Counters

Automatically number elements with CSS counters.

## Counter Properties

<pre><code class="css">
/* Create/Reset a counter */
counter-reset: section;

/* Increment a counter */
counter-increment: section;

/* Display counter value */
content: counter(section);
content: counters(section, ".");
</code></pre>

## Basic Example

<pre><code class="css">
body {
  counter-reset: section;
}

h2::before {
  counter-increment: section;
  content: "Section " counter(section) ": ";
}
</code></pre>

## Nested Counters

<pre><code class="css">
body { counter-reset: chapter; }
h1 { counter-reset: section; }

h1::before {
  counter-increment: chapter;
  content: "Chapter " counter(chapter) ". ";
}

h2::before {
  counter-increment: section;
  content: counter(chapter) "." counter(section) " ";
}
</code></pre>

## Ordered Lists

<pre><code class="css">
ol {
  counter-reset: item;
  list-style: none;
}

li::before {
  counter-increment: item;
  content: counter(item, decimal-leading-zero) ". ";
  color: #3498db;
  font-weight: bold;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: 'Segoe UI', Arial;
  padding: 20px;
  background: #f5f5f5;
  counter-reset: chapter;
}

.container {
  max-width: 700px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

h1 { color: #2c3e50; margin-bottom: 30px; }

/* Chapter Counter */
h2 {
  counter-reset: section;
  color: #3498db;
  margin-top: 30px;
  padding: 10px 15px;
  background: #ecf0f1;
  border-radius: 8px;
}

h2::before {
  counter-increment: chapter;
  content: "Chapter " counter(chapter) ": ";
  color: #e74c3c;
}

/* Section Counter */
h3 {
  color: #2c3e50;
  margin-left: 20px;
}

h3::before {
  counter-increment: section;
  content: counter(chapter) "." counter(section) " ";
  color: #3498db;
  font-weight: bold;
}

/* Custom Ordered List */
.custom-list {
  counter-reset: item;
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.custom-list li {
  padding: 10px 15px 10px 50px;
  position: relative;
  margin: 5px 0;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.custom-list li:hover {
  background: #e8f4fc;
  transform: translateX(5px);
}

.custom-list li::before {
  counter-increment: item;
  content: counter(item, decimal-leading-zero);
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Steps counter */
.steps {
  counter-reset: step;
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
}

.step {
  text-align: center;
  flex: 1;
  position: relative;
}

.step::before {
  counter-increment: step;
  content: counter(step);
  display: block;
  width: 40px;
  height: 40px;
  margin: 0 auto 10px;
  background: #2ecc71;
  color: white;
  border-radius: 50%;
  line-height: 40px;
  font-weight: bold;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 60%;
  width: 80%;
  height: 3px;
  background: #bdc3c7;
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Counters</h1>
  
  <h2>Introduction</h2>
  <h3>What are Counters?</h3>
  <h3>Why Use Them?</h3>
  
  <h2>Implementation</h2>
  <h3>Counter Reset</h3>
  <h3>Counter Increment</h3>
  <h3>Displaying Values</h3>
  
  <h2>Advanced Usage</h2>
  <h3>Nested Counters</h3>
  
  <h3>Custom Numbered List:</h3>
  <ol class="custom-list">
    <li>Learn counter-reset property</li>
    <li>Understand counter-increment</li>
    <li>Use counter() function</li>
    <li>Style with CSS</li>
    <li>Create amazing lists!</li>
  </ol>
  
  <h3>Step Progress:</h3>
  <div class="steps">
    <div class="step">Start</div>
    <div class="step">Learn</div>
    <div class="step">Practice</div>
    <div class="step">Master</div>
  </div>
</div>

</body>
</html>`,
    },
    inheritance: {
      title: 'CSS Inheritance',
      content: `
# CSS Inheritance

Some CSS properties are inherited by child elements.

## Inherited Properties

These properties are inherited by default:
- color
- font-family, font-size, font-style, font-weight
- letter-spacing, line-height
- text-align, text-indent, text-transform
- visibility
- cursor

## Non-Inherited Properties

These are NOT inherited:
- margin, padding
- border
- background
- width, height
- display, position

## Controlling Inheritance

<pre><code class="css">
/* Force inheritance */
.child {
  border: inherit;
}

/* Reset to initial value */
.element {
  color: initial;
}

/* Use parent's computed value */
.element {
  color: inherit;
}

/* Revert to browser default */
.element {
  all: revert;
}

/* Unset - inherit if naturally inherited, initial otherwise */
.element {
  color: unset;
}
</code></pre>

## The <code>inherit</code> Keyword

<pre><code class="css">
.parent {
  border: 2px solid blue;
}

.child {
  border: inherit; /* Child gets same border */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f0f0f0; }

.container {
  max-width: 700px;
  margin: 0 auto;
}

/* Parent with various properties */
.parent {
  color: #2c3e50;
  font-family: 'Georgia', serif;
  font-size: 18px;
  line-height: 1.6;
  background: white;
  padding: 25px;
  border: 3px solid #3498db;
  border-radius: 10px;
  margin-bottom: 20px;
}

.parent h2 {
  color: #3498db;
  margin-top: 0;
}

/* Child inherits text properties automatically */
.child {
  background: #ecf0f1;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.child.with-border {
  border: inherit; /* Explicitly inherit border */
}

/* Comparison boxes */
.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.box h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.demo-inherited {
  color: #e74c3c;
  font-size: 20px;
}

.demo-inherited span {
  /* color is inherited automatically */
  background: #ffeaa7;
  padding: 2px 6px;
}

.demo-non-inherited {
  border: 3px dashed #9b59b6;
  padding: 15px;
}

.demo-non-inherited span {
  /* border is NOT inherited - this span has no border */
  background: #dfe6e9;
  padding: 5px;
}

.keyword-demo {
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
}

.keyword-demo .inherit { color: inherit; }
.keyword-demo .initial { color: initial; }
.keyword-demo .unset { color: unset; }
</style>
</head>
<body>

<div class="container">
  <h1>CSS Inheritance</h1>
  
  <div class="parent">
    <h2>Parent Element</h2>
    <p>This parent has: color, font-family, font-size, line-height (inherited) + background, padding, border (not inherited)</p>
    
    <div class="child">
      <strong>Child Element (auto-inherited):</strong><br>
      I inherit color, font-family, font-size, line-height from parent!
      <br>But NOT background, padding, or border.
    </div>
    
    <div class="child with-border">
      <strong>Child with border: inherit;</strong><br>
      I explicitly inherit the parent's border!
    </div>
  </div>
  
  <div class="comparison">
    <div class="box">
      <h3>✅ Inherited (automatic)</h3>
      <div class="demo-inherited">
        Red text here... <span>and in child spans too!</span>
      </div>
    </div>
    
    <div class="box">
      <h3>❌ Not Inherited</h3>
      <div class="demo-non-inherited">
        I have a border... <span>but my child span doesn't!</span>
      </div>
    </div>
  </div>
  
  <div class="keyword-demo">
    <h3 style="color:white; margin-top:0;">Inheritance Keywords</h3>
    <p class="inherit">inherit - I inherit parent's white color</p>
    <p class="initial">initial - I use initial (browser default, usually black)</p>
    <p class="unset">unset - I'm unset (inherit since color is inheritable)</p>
  </div>
</div>

</body>
</html>`,
    },
    'math-functions': {
      title: 'CSS Math Functions',
      content: `
# CSS Math Functions

Perform calculations directly in CSS.

## calc()

Perform basic math operations:

<pre><code class="css">
.element {
  width: calc(100% - 50px);
  padding: calc(1rem + 5px);
  font-size: calc(16px * 1.5);
  margin: calc(100vh / 4);
}
</code></pre>

## min()

Returns the smallest value:

<pre><code class="css">
.container {
  width: min(100%, 1200px);
  /* Responsive max-width alternative */
}
</code></pre>

## max()

Returns the largest value:

<pre><code class="css">
.element {
  font-size: max(16px, 1.2vw);
  /* Minimum font size of 16px */
}
</code></pre>

## clamp()

Clamps a value between min and max:

<pre><code class="css">
.element {
  /* clamp(min, preferred, max) */
  font-size: clamp(1rem, 2.5vw, 2rem);
  width: clamp(200px, 50%, 600px);
}
</code></pre>

## Combining Functions

<pre><code class="css">
.responsive {
  padding: clamp(1rem, calc(2vw + 0.5rem), 3rem);
  width: min(calc(100% - 2rem), 800px);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: 'Segoe UI', Arial;
  padding: 20px;
  background: #f5f5f5;
  margin: 0;
}

h1 { text-align: center; color: #2c3e50; }
h2 { color: #3498db; margin-top: 30px; }

.demo-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.1);
  margin: 20px auto;
  max-width: 800px;
}

/* calc() example */
.calc-demo {
  width: calc(100% - 60px);
  margin: 0 auto;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: calc(1rem + 10px);
  border-radius: 10px;
  text-align: center;
}

/* min() example */
.min-demo {
  width: min(100%, 500px);
  margin: 20px auto;
  background: linear-gradient(135deg, #11998e, #38ef7d);
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

/* max() example */
.max-demo {
  font-size: max(16px, 2vw);
  background: linear-gradient(135deg, #ee0979, #ff6a00);
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

/* clamp() example */
.clamp-demo {
  font-size: clamp(14px, 2.5vw, 28px);
  width: clamp(200px, 80%, 600px);
  margin: 20px auto;
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  color: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
}

/* Comparison Grid */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 15px;
  margin: 20px 0;
}

.comparison-item {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  border-left: 4px solid #3498db;
}

.comparison-item h3 {
  margin: 0 0 10px;
  color: #3498db;
}

.comparison-item code {
  background: #ecf0f1;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  display: block;
  margin-top: 10px;
}

/* Responsive font size with clamp */
.responsive-text {
  font-size: clamp(1rem, 4vw, 2.5rem);
  line-height: 1.4;
  text-align: center;
  padding: 20px;
  background: #2c3e50;
  color: white;
  border-radius: 10px;
  margin: 20px 0;
}
</style>
</head>
<body>

<h1>CSS Math Functions</h1>

<div class="demo-box">
  <h2>calc() - Calculate Values</h2>
  <div class="calc-demo">
    width: calc(100% - 60px)
  </div>
  
  <h2>min() - Smallest Value</h2>
  <div class="min-demo">
    width: min(100%, 500px) — I won't exceed 500px!
  </div>
  
  <h2>max() - Largest Value</h2>
  <div class="max-demo">
    font-size: max(16px, 2vw) — Resize window to see me grow!
  </div>
  
  <h2>clamp() - Fluid Responsive</h2>
  <div class="clamp-demo">
    font-size: clamp(14px, 2.5vw, 28px)<br>
    width: clamp(200px, 80%, 600px)
  </div>
  
  <h2>Function Comparison</h2>
  <div class="comparison-grid">
    <div class="comparison-item">
      <h3>calc()</h3>
      <p>Math operations</p>
      <code>calc(100% - 50px)</code>
    </div>
    <div class="comparison-item">
      <h3>min()</h3>
      <p>Returns smallest</p>
      <code>min(100%, 800px)</code>
    </div>
    <div class="comparison-item">
      <h3>max()</h3>
      <p>Returns largest</p>
      <code>max(1rem, 2vw)</code>
    </div>
    <div class="comparison-item">
      <h3>clamp()</h3>
      <p>Min/Preferred/Max</p>
      <code>clamp(1rem, 5vw, 3rem)</code>
    </div>
  </div>
  
  <h2>Responsive Typography</h2>
  <div class="responsive-text">
    Resize the window!<br>
    I scale smoothly with clamp()
  </div>
</div>

</body>
</html>`,
    },
    optimization: {
      title: 'CSS Optimization',
      content: `
# CSS Optimization

Best practices for fast, efficient CSS.

## Reduce File Size

<pre><code class="css">
/* Minify CSS - remove whitespace */
/* Use shorthand properties */
margin: 10px 20px 10px 20px; /* ❌ */
margin: 10px 20px;            /* ✅ */

/* Combine selectors */
h1 { color: blue; }
h2 { color: blue; } /* ❌ */

h1, h2 { color: blue; } /* ✅ */
</code></pre>

## Avoid Expensive Selectors

<pre><code class="css">
/* Slow - universal selectors */
* { box-sizing: border-box; }

/* Slow - deep nesting */
div &gt; ul &gt; li &gt; a { }

/* Fast - class selectors */
.nav-link { }
</code></pre>

## Performance Tips

1. **Use transform instead of position**
2. **Use opacity for animations**
3. **Avoid repaints and reflows**
4. **Use will-change sparingly**
5. **Minimize CSS resets**

## Critical CSS

Load above-the-fold CSS inline:

<pre><code class="html">
&lt;style&gt;
  /* Critical CSS here */
&lt;/style&gt;
&lt;link rel="preload" href="styles.css" as="style"&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f0f0f0; }

.container {
  max-width: 800px;
  margin: 0 auto;
}

.tip-card {
  background: white;
  padding: 20px;
  margin: 15px 0;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-left: 4px solid #3498db;
}

.tip-card h3 {
  margin: 0 0 10px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-card h3::before {
  content: '✓';
  background: #2ecc71;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.bad { border-left-color: #e74c3c; }
.bad h3::before { content: '✗'; background: #e74c3c; }

.code-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0;
}

.code-box {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  overflow-x: auto;
}

.code-box.good { border: 2px solid #2ecc71; }
.code-box.bad { border: 2px solid #e74c3c; }

.label {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
}

.label.good { background: #2ecc71; color: white; }
.label.bad { background: #e74c3c; color: white; }

/* Animation performance demo */
.perf-demo {
  display: flex;
  gap: 20px;
  margin: 20px 0;
}

.anim-box {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  text-align: center;
}

.anim-box.good {
  transition: transform 0.3s, opacity 0.3s;
}

.anim-box.good:hover {
  transform: scale(1.1) rotate(5deg);
  opacity: 0.9;
}

.anim-box.bad {
  transition: left 0.3s, top 0.3s;
  position: relative;
}

.anim-box.bad:hover {
  left: 10px;
  top: -10px;
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Optimization Tips</h1>
  
  <div class="tip-card">
    <h3>Use Shorthand Properties</h3>
    <div class="code-compare">
      <div class="code-box bad">
        <span class="label bad">❌ Verbose</span><br>
        margin-top: 10px;<br>
        margin-right: 20px;<br>
        margin-bottom: 10px;<br>
        margin-left: 20px;
      </div>
      <div class="code-box good">
        <span class="label good">✓ Shorthand</span><br>
        margin: 10px 20px;
      </div>
    </div>
  </div>
  
  <div class="tip-card">
    <h3>Use Class Selectors</h3>
    <div class="code-compare">
      <div class="code-box bad">
        <span class="label bad">❌ Slow</span><br>
        div > ul > li > a { }<br>
        #nav .menu .item { }
      </div>
      <div class="code-box good">
        <span class="label good">✓ Fast</span><br>
        .nav-link { }<br>
        .menu-item { }
      </div>
    </div>
  </div>
  
  <div class="tip-card">
    <h3>Animate with transform & opacity</h3>
    <p>These properties are GPU-accelerated and don't cause repaints:</p>
    <div class="perf-demo">
      <div class="anim-box good">transform<br>(fast)</div>
      <div class="anim-box bad">left/top<br>(slow)</div>
    </div>
    <p><small>Hover over the boxes to compare animations</small></p>
  </div>
</div>

</body>
</html>`,
    },
    accessibility: {
      title: 'CSS Accessibility',
      content: `
# CSS Accessibility

Make your CSS accessible to all users.

## Focus Styles

Never remove focus outlines without alternatives:

<pre><code class="css">
/* ❌ Bad - removes focus indicator */
*:focus { outline: none; }

/* ✅ Good - custom focus style */
:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* ✅ Modern - visible only for keyboard */
:focus-visible {
  outline: 2px solid #3498db;
}
</code></pre>

## Color Contrast

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Don't rely on color alone

## Screen Readers

<pre><code class="css">
/* Visually hidden but screen reader accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</code></pre>

## Reduced Motion

<pre><code class="css">
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</code></pre>

## Tips

- Use relative units (rem, em)
- Ensure clickable areas are 44x44px minimum
- Test with keyboard navigation
- Check color contrast ratios
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f5f5f5; }

.container {
  max-width: 700px;
  margin: 0 auto;
}

.demo-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

.demo-section h2 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 10px;
}

/* Focus Styles Demo */
.focus-demo {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  margin: 15px 0;
}

.focus-btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #3498db;
  color: white;
  transition: all 0.2s;
}

/* Good focus style */
.focus-btn:focus {
  outline: 3px solid #2980b9;
  outline-offset: 3px;
}

.focus-btn:focus-visible {
  outline: 3px solid #e74c3c;
  outline-offset: 3px;
}

/* Color Contrast Demo */
.contrast-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 15px 0;
}

.contrast-box {
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.contrast-bad {
  background: #f1c40f;
  color: white; /* Low contrast! */
}

.contrast-good {
  background: #2c3e50;
  color: white; /* Good contrast! */
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Touch Target */
.touch-demo {
  display: flex;
  gap: 10px;
  align-items: center;
  margin: 15px 0;
}

.touch-target-small {
  width: 30px;
  height: 30px;
  background: #e74c3c;
  border-radius: 5px;
}

.touch-target-good {
  width: 44px;
  height: 44px;
  background: #2ecc71;
  border-radius: 8px;
}

/* Accessible Form */
.form-group {
  margin: 15px 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52,152,219,0.2);
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: #2c3e50;
  color: white;
  padding: 10px 20px;
  z-index: 1000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

/* Animation with reduced motion */
.motion-box {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  animation: pulse 2s infinite;
  margin: 20px 0;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .motion-box {
    animation: none;
  }
}
</style>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<div class="container">
  <h1>CSS Accessibility</h1>
  
  <div id="main" class="demo-section">
    <h2>Focus Styles</h2>
    <p>Tab through these buttons to see focus styles:</p>
    <div class="focus-demo">
      <button class="focus-btn">Button 1</button>
      <button class="focus-btn">Button 2</button>
      <button class="focus-btn">Button 3</button>
    </div>
    <p><small>:focus-visible shows only for keyboard navigation</small></p>
  </div>
  
  <div class="demo-section">
    <h2>Color Contrast</h2>
    <div class="contrast-demo">
      <div class="contrast-box contrast-bad">
        ❌ Low Contrast<br>
        <small>Hard to read!</small>
      </div>
      <div class="contrast-box contrast-good">
        ✓ Good Contrast<br>
        <small>Easy to read!</small>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Touch Targets</h2>
    <div class="touch-demo">
      <div class="touch-target-small" title="Too small (30x30)"></div>
      <span>❌ 30×30px (too small)</span>
    </div>
    <div class="touch-demo">
      <div class="touch-target-good" title="Good size (44x44)"></div>
      <span>✓ 44×44px (recommended minimum)</span>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Accessible Forms</h2>
    <form>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" placeholder="Enter your email">
      </div>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input type="text" id="name" placeholder="Enter your name">
      </div>
    </form>
  </div>
  
  <div class="demo-section">
    <h2>Reduced Motion</h2>
    <p>This animation respects prefers-reduced-motion:</p>
    <div class="motion-box"></div>
    <p><small>Enable "Reduce motion" in your OS settings to stop animation</small></p>
  </div>
</div>

</body>
</html>`,
    },
    'website-layout': {
      title: 'CSS Website Layout',
      content: `
# CSS Website Layout

Build complete website layouts with CSS.

## Common Layout Patterns

1. **Header + Content + Footer**
2. **Sidebar + Main Content**
3. **Holy Grail Layout**
4. **Card Grid Layout**

## Header-Footer Layout

<pre><code class="css">
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header, footer {
  flex-shrink: 0;
}

main {
  flex: 1; /* Takes remaining space */
}
</code></pre>

## Sidebar Layout

<pre><code class="css">
.wrapper {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}

/* Responsive */
@media (max-width: 768px) {
  .wrapper {
    grid-template-columns: 1fr;
  }
}
</code></pre>

## Holy Grail Layout

<pre><code class="css">
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Arial; }

/* Holy Grail Layout */
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 180px 1fr 180px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 1px;
  background: #ddd;
}

header {
  grid-area: header;
  background: linear-gradient(135deg, #2c3e50, #3498db);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 { font-size: 1.5em; }

.top-nav {
  display: flex;
  gap: 20px;
}

.top-nav a {
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background 0.3s;
}

.top-nav a:hover {
  background: rgba(255,255,255,0.2);
}

nav {
  grid-area: nav;
  background: #34495e;
  padding: 20px;
}

nav a {
  display: block;
  color: #ecf0f1;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s;
}

nav a:hover {
  background: #3498db;
  transform: translateX(5px);
}

main {
  grid-area: main;
  background: white;
  padding: 30px;
}

main h2 { color: #2c3e50; margin-bottom: 20px; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
}

.card h3 {
  color: #3498db;
  margin-bottom: 10px;
}

aside {
  grid-area: aside;
  background: #ecf0f1;
  padding: 20px;
}

aside h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1em;
}

.widget {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  font-size: 14px;
}

footer {
  grid-area: footer;
  background: #2c3e50;
  color: #95a5a6;
  padding: 20px;
  text-align: center;
}

@media (max-width: 768px) {
  .page {
    grid-template-areas:
      "header"
      "main"
      "nav"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
  
  nav { order: 2; }
  aside { order: 3; }
}
</style>
</head>
<body>

<div class="page">
  <header>
    <h1>🌐 My Website</h1>
    <nav class="top-nav">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>
  
  <nav>
    <a href="#">📊 Dashboard</a>
    <a href="#">📁 Projects</a>
    <a href="#">👥 Team</a>
    <a href="#">📈 Analytics</a>
    <a href="#">⚙️ Settings</a>
  </nav>
  
  <main>
    <h2>Welcome to the Holy Grail Layout!</h2>
    <p style="margin-bottom: 20px;">This classic layout includes header, footer, sidebar navigation, main content, and aside widget area.</p>
    
    <div class="cards">
      <div class="card">
        <h3>Feature One</h3>
        <p>Responsive grid automatically adjusts columns.</p>
      </div>
      <div class="card">
        <h3>Feature Two</h3>
        <p>Sidebar collapses on mobile devices.</p>
      </div>
      <div class="card">
        <h3>Feature Three</h3>
        <p>Built with CSS Grid for flexibility.</p>
      </div>
    </div>
  </main>
  
  <aside>
    <h3>Widgets</h3>
    <div class="widget">
      <strong>Latest News</strong><br>
      New features released!
    </div>
    <div class="widget">
      <strong>Quick Stats</strong><br>
      Users: 1,234<br>
      Views: 56,789
    </div>
  </aside>
  
  <footer>
    &copy; 2024 My Website. Built with CSS Grid.
  </footer>
</div>

</body>
</html>`,
    },
    'rounded-corners': {
      title: 'CSS Rounded Corners',
      content: `
# CSS Rounded Corners

Create rounded corners with border-radius.

## Basic Syntax

<pre><code class="css">
/* All corners */
border-radius: 10px;

/* Horizontal / Vertical */
border-radius: 20px / 10px;

/* Individual corners */
border-radius: 10px 20px 30px 40px;
/* top-left, top-right, bottom-right, bottom-left */
</code></pre>

## Individual Properties

<pre><code class="css">
border-top-left-radius: 10px;
border-top-right-radius: 20px;
border-bottom-right-radius: 30px;
border-bottom-left-radius: 40px;
</code></pre>

## Special Shapes

<pre><code class="css">
/* Circle */
.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

/* Pill shape */
.pill {
  border-radius: 50px;
}

/* Oval */
.oval {
  width: 200px;
  height: 100px;
  border-radius: 50%;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f0f0f0; }

.container {
  max-width: 800px;
  margin: 0 auto;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.shape {
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  transition: transform 0.3s;
}

.shape:hover { transform: scale(1.05); }

/* Different border-radius values */
.r-0 { background: #3498db; border-radius: 0; }
.r-10 { background: #e74c3c; border-radius: 10px; }
.r-20 { background: #2ecc71; border-radius: 20px; }
.r-50 { background: #9b59b6; border-radius: 50px; }
.r-circle { 
  background: #f39c12; 
  border-radius: 50%; 
  width: 120px;
}

/* Asymmetric */
.r-asymmetric {
  background: #1abc9c;
  border-radius: 30px 10px;
}

/* Individual corners */
.r-corners {
  background: #34495e;
  border-radius: 30px 0 30px 0;
}

/* Leaf shape */
.r-leaf {
  background: #27ae60;
  border-radius: 60px 0;
}

/* Card style */
.card-demo {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin: 30px 0;
}

.card-demo h3 { margin-top: 0; color: #2c3e50; }

/* Pill buttons */
.btn-group {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.pill-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 50px;
  font-size: 14px;
  cursor: pointer;
  transition: transform 0.2s;
}

.pill-btn:hover { transform: translateY(-2px); }
.pill-btn.primary { background: #3498db; color: white; }
.pill-btn.success { background: #2ecc71; color: white; }
.pill-btn.warning { background: #f39c12; color: white; }
.pill-btn.danger { background: #e74c3c; color: white; }

/* Avatar */
.avatars {
  display: flex;
  gap: 15px;
  margin: 20px 0;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

/* Blob shapes */
.blob {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  margin: 20px;
  animation: blob 4s ease-in-out infinite;
}

@keyframes blob {
  0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Rounded Corners</h1>
  
  <h2>Border Radius Values</h2>
  <div class="demo-grid">
    <div class="shape r-0">radius: 0</div>
    <div class="shape r-10">radius: 10px</div>
    <div class="shape r-20">radius: 20px</div>
    <div class="shape r-50">radius: 50px</div>
    <div class="shape r-circle">radius: 50%<br>(circle)</div>
    <div class="shape r-asymmetric">30px 10px</div>
    <div class="shape r-corners">30px 0 30px 0</div>
    <div class="shape r-leaf">60px 0<br>(leaf)</div>
  </div>
  
  <div class="card-demo">
    <h3>Card with Rounded Corners</h3>
    <p>Cards typically use border-radius: 10-20px for a modern look.</p>
    
    <h4>Pill Buttons</h4>
    <div class="btn-group">
      <button class="pill-btn primary">Primary</button>
      <button class="pill-btn success">Success</button>
      <button class="pill-btn warning">Warning</button>
      <button class="pill-btn danger">Danger</button>
    </div>
    
    <h4>Circular Avatars</h4>
    <div class="avatars">
      <img class="avatar" src="https://i.pravatar.cc/100?img=1" alt="Avatar">
      <img class="avatar" src="https://i.pravatar.cc/100?img=2" alt="Avatar">
      <img class="avatar" src="https://i.pravatar.cc/100?img=3" alt="Avatar">
    </div>
  </div>
  
  <h2>Animated Blob Shape</h2>
  <div class="blob"></div>
</div>

</body>
</html>`,
    },
    'border-images': {
      title: 'CSS Border Images',
      content: `
# CSS Border Images

Use images as borders.

## Syntax

<pre><code class="css">
border-image: source slice width outset repeat;

/* Example */
border-image: url('border.png') 30 round;
</code></pre>

## Properties

<pre><code class="css">
/* Image source */
border-image-source: url('border.png');
border-image-source: linear-gradient(red, blue);

/* How to slice the image */
border-image-slice: 30;
border-image-slice: 10%;
border-image-slice: 30 fill; /* fill center */

/* Border width */
border-image-width: 10px;
border-image-width: 1; /* relative to border-width */

/* Outset (extends beyond border) */
border-image-outset: 10px;

/* Repeat behavior */
border-image-repeat: stretch;
border-image-repeat: repeat;
border-image-repeat: round;
border-image-repeat: space;
</code></pre>

## Gradient Borders

<pre><code class="css">
.gradient-border {
  border: 4px solid;
  border-image: linear-gradient(45deg, #f06, #9f6) 1;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f5f5f5; }

.container {
  max-width: 700px;
  margin: 0 auto;
}

.demo-box {
  padding: 30px;
  margin: 20px 0;
  background: white;
  text-align: center;
}

/* Gradient Border */
.gradient-border {
  border: 5px solid;
  border-image: linear-gradient(45deg, #f06, #9f6, #06f) 1;
}

/* Rainbow gradient */
.rainbow-border {
  border: 6px solid;
  border-image: linear-gradient(
    90deg,
    #ff0000, #ff7f00, #ffff00, 
    #00ff00, #0000ff, #4b0082, #9400d3
  ) 1;
}

/* Corner gradient */
.corner-gradient {
  border: 8px solid;
  border-image: conic-gradient(
    #3498db, #9b59b6, #e74c3c, #f39c12, #3498db
  ) 1;
}

/* Animated gradient border */
.animated-border {
  position: relative;
  border: 4px solid transparent;
  background: white;
  background-clip: padding-box;
}

.animated-border::before {
  content: '';
  position: absolute;
  top: -4px; left: -4px; right: -4px; bottom: -4px;
  background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #ff0080);
  background-size: 300% 300%;
  z-index: -1;
  border-radius: inherit;
  animation: gradient-rotate 3s linear infinite;
}

@keyframes gradient-rotate {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dotted gradient */
.dotted-gradient {
  border: none;
  background: 
    linear-gradient(white, white) padding-box,
    linear-gradient(45deg, #667eea, #764ba2) border-box;
  border: 4px dashed transparent;
  border-image: repeating-linear-gradient(
    45deg,
    #667eea,
    #667eea 10px,
    transparent 10px,
    transparent 20px
  ) 4;
}

/* Double gradient border */
.double-border {
  border: 8px double;
  border-image: linear-gradient(135deg, #11998e, #38ef7d) 1;
}

/* Comparison grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.grid-item {
  padding: 25px;
  text-align: center;
  background: white;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.grid-item h3 {
  margin: 0 0 5px;
  font-size: 14px;
  color: #333;
}

.grid-item code {
  font-size: 11px;
  color: #666;
}

.g1 { border: 4px solid; border-image: linear-gradient(#3498db, #9b59b6) 1; }
.g2 { border: 4px solid; border-image: linear-gradient(90deg, #e74c3c, #f39c12) 1; }
.g3 { border: 4px solid; border-image: radial-gradient(#2ecc71, #27ae60) 1; }
.g4 { border: 6px solid; border-image: conic-gradient(#ff6b6b, #4ecdc4, #ffe66d, #ff6b6b) 1; }
</style>
</head>
<body>

<div class="container">
  <h1>CSS Border Images</h1>
  
  <h2>Gradient Borders</h2>
  
  <div class="demo-box gradient-border">
    <h3>Simple Gradient Border</h3>
    <code>border-image: linear-gradient(45deg, #f06, #9f6) 1;</code>
  </div>
  
  <div class="demo-box rainbow-border">
    <h3>Rainbow Gradient</h3>
    <code>7-color rainbow gradient</code>
  </div>
  
  <div class="demo-box corner-gradient">
    <h3>Conic Gradient Border</h3>
    <code>conic-gradient for corner-to-corner effect</code>
  </div>
  
  <div class="demo-box animated-border">
    <h3>Animated Gradient Border</h3>
    <code>Uses pseudo-element + animation</code>
  </div>
  
  <h2>More Examples</h2>
  <div class="grid">
    <div class="grid-item g1">
      <h3>Vertical Gradient</h3>
      <code>top to bottom</code>
    </div>
    <div class="grid-item g2">
      <h3>Horizontal Gradient</h3>
      <code>left to right</code>
    </div>
    <div class="grid-item g3">
      <h3>Radial Gradient</h3>
      <code>radial-gradient()</code>
    </div>
    <div class="grid-item g4">
      <h3>Conic Gradient</h3>
      <code>conic-gradient()</code>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'multiple-backgrounds': {
      title: 'CSS Multiple Backgrounds',
      content: `
# CSS Multiple Backgrounds

Layer multiple backgrounds on a single element.

## Syntax

<pre><code class="css">
background: 
  url('top.png') top center,
  url('middle.png') center,
  url('bottom.png') bottom center;
</code></pre>

## Layer Order

- First background is on TOP
- Last background is on BOTTOM

<pre><code class="css">
.element {
  background:
    linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), /* Overlay */
    url('image.jpg') center/cover; /* Image */
}
</code></pre>

## Gradient Combinations

<pre><code class="css">
.layered {
  background:
    linear-gradient(45deg, transparent 49%, #fff 49%, #fff 51%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, #fff 49%, #fff 51%, transparent 51%),
    linear-gradient(#3498db, #9b59b6);
}
</code></pre>

## Individual Properties

<pre><code class="css">
background-image: url('a.png'), url('b.png');
background-position: top left, bottom right;
background-repeat: no-repeat, repeat;
background-size: 50%, cover;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f0f0f0; }

.container {
  max-width: 800px;
  margin: 0 auto;
}

.demo-box {
  height: 200px;
  margin: 20px 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

/* Multiple gradients */
.gradient-layers {
  background:
    linear-gradient(135deg, rgba(102, 126, 234, 0.9), transparent 50%),
    linear-gradient(225deg, rgba(118, 75, 162, 0.9), transparent 50%),
    linear-gradient(45deg, #667eea, #764ba2);
}

/* Pattern overlay */
.pattern-overlay {
  background:
    repeating-linear-gradient(
      45deg,
      rgba(255,255,255,0.05) 0px,
      rgba(255,255,255,0.05) 10px,
      transparent 10px,
      transparent 20px
    ),
    linear-gradient(135deg, #1e3c72, #2a5298);
}

/* Dots pattern */
.dots-pattern {
  background:
    radial-gradient(circle at 20px 20px, rgba(255,255,255,0.2) 2px, transparent 2px),
    linear-gradient(135deg, #11998e, #38ef7d);
  background-size: 40px 40px, 100%;
}

/* Geometric */
.geometric {
  background:
    linear-gradient(60deg, rgba(52, 152, 219, 0.8) 25%, transparent 25%),
    linear-gradient(-60deg, rgba(231, 76, 60, 0.8) 25%, transparent 25%),
    linear-gradient(120deg, rgba(46, 204, 113, 0.8) 25%, transparent 25%),
    linear-gradient(-120deg, rgba(155, 89, 182, 0.8) 25%, transparent 25%),
    #2c3e50;
}

/* Image with overlay */
.image-overlay {
  background:
    linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)),
    url('https://picsum.photos/800/400') center/cover;
}

/* Grid pattern */
.grid-pattern {
  background:
    linear-gradient(#ecf0f1 1px, transparent 1px),
    linear-gradient(90deg, #ecf0f1 1px, transparent 1px),
    linear-gradient(135deg, #667eea, #764ba2);
  background-size: 20px 20px, 20px 20px, 100%;
}

/* Mesh gradient simulation */
.mesh-gradient {
  background:
    radial-gradient(circle at 20% 80%, rgba(255, 0, 128, 0.5), transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(0, 200, 255, 0.5), transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.3), transparent 50%),
    linear-gradient(#2c3e50, #34495e);
}

.description {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin: -10px 0 20px;
  font-size: 14px;
  color: #666;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Multiple Backgrounds</h1>
  
  <h2>Layered Gradients</h2>
  <div class="demo-box gradient-layers">
    Multiple linear-gradients layered
  </div>
  
  <h2>Pattern Overlay</h2>
  <div class="demo-box pattern-overlay">
    Striped pattern over gradient
  </div>
  
  <h2>Dots Pattern</h2>
  <div class="demo-box dots-pattern">
    Radial gradient creates dots
  </div>
  
  <h2>Geometric Shapes</h2>
  <div class="demo-box geometric">
    Angled gradients for shapes
  </div>
  
  <h2>Image with Overlay</h2>
  <div class="demo-box image-overlay">
    Dark gradient over image
  </div>
  
  <h2>Grid Pattern</h2>
  <div class="demo-box grid-pattern">
    Grid lines over gradient
  </div>
  
  <h2>Mesh Gradient Effect</h2>
  <div class="demo-box mesh-gradient">
    Multiple radial gradients
  </div>
  <p class="description">Mesh gradients create smooth, organic color blends using multiple overlapping radial gradients.</p>
</div>

</body>
</html>`,
    },
    'color-keywords': {
      title: 'CSS Color Keywords',
      content: `
# CSS Color Keywords

CSS supports 147 named color keywords.

## Basic Colors

<pre><code class="css">
color: red;
color: blue;
color: green;
color: yellow;
color: orange;
color: purple;
color: pink;
color: brown;
color: gray;
color: black;
color: white;
</code></pre>

## Extended Colors

Popular extended keywords:
- **Blues**: navy, steelblue, dodgerblue, skyblue
- **Greens**: forestgreen, seagreen, limegreen, springgreen
- **Reds**: crimson, firebrick, indianred, salmon
- **Purples**: indigo, violet, orchid, plum
- **Browns**: sienna, chocolate, saddlebrown, peru

## Special Keywords

<pre><code class="css">
color: transparent;    /* Fully transparent */
color: currentColor;   /* Inherits from color property */
</code></pre>

## System Colors

<pre><code class="css">
color: Canvas;         /* Background */
color: CanvasText;     /* Text on Canvas */
color: LinkText;       /* Unvisited links */
color: VisitedText;    /* Visited links */
color: AccentColor;    /* Accent color */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; background: #f8f9fa; }

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 { color: #2c3e50; text-align: center; }
h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; }

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin: 20px 0;
}

.color-box {
  height: 70px;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  color: white;
  transition: transform 0.2s;
}

.color-box:hover {
  transform: scale(1.05);
}

/* Basic colors */
.red { background: red; }
.blue { background: blue; }
.green { background: green; }
.yellow { background: yellow; color: #333; text-shadow: none; }
.orange { background: orange; }
.purple { background: purple; }
.pink { background: pink; color: #333; text-shadow: none; }
.brown { background: brown; }
.gray { background: gray; }
.black { background: black; }
.white { background: white; color: #333; text-shadow: none; border: 1px solid #ddd; }

/* Blues */
.navy { background: navy; }
.steelblue { background: steelblue; }
.dodgerblue { background: dodgerblue; }
.skyblue { background: skyblue; color: #333; text-shadow: none; }
.lightblue { background: lightblue; color: #333; text-shadow: none; }
.aqua { background: aqua; color: #333; text-shadow: none; }
.teal { background: teal; }
.cyan { background: cyan; color: #333; text-shadow: none; }

/* Greens */
.darkgreen { background: darkgreen; }
.forestgreen { background: forestgreen; }
.seagreen { background: seagreen; }
.limegreen { background: limegreen; color: #333; text-shadow: none; }
.springgreen { background: springgreen; color: #333; text-shadow: none; }
.lime { background: lime; color: #333; text-shadow: none; }
.olive { background: olive; }

/* Reds */
.darkred { background: darkred; }
.crimson { background: crimson; }
.firebrick { background: firebrick; }
.indianred { background: indianred; }
.salmon { background: salmon; }
.coral { background: coral; }
.tomato { background: tomato; }

/* Purples */
.indigo { background: indigo; }
.violet { background: violet; }
.orchid { background: orchid; }
.plum { background: plum; color: #333; text-shadow: none; }
.magenta { background: magenta; }
.fuchsia { background: fuchsia; }

/* Browns */
.sienna { background: sienna; }
.chocolate { background: chocolate; }
.saddlebrown { background: saddlebrown; }
.peru { background: peru; }
.tan { background: tan; color: #333; text-shadow: none; }
.wheat { background: wheat; color: #333; text-shadow: none; }

/* Grays */
.darkgray { background: darkgray; }
.silver { background: silver; color: #333; text-shadow: none; }
.lightgray { background: lightgray; color: #333; text-shadow: none; }
.dimgray { background: dimgray; }
.slategray { background: slategray; }
</style>
</head>
<body>

<div class="container">
  <h1>CSS Color Keywords</h1>
  <p style="text-align:center; color:#666;">147 named colors are available in CSS</p>
  
  <h2>Basic Colors</h2>
  <div class="color-grid">
    <div class="color-box red">red</div>
    <div class="color-box blue">blue</div>
    <div class="color-box green">green</div>
    <div class="color-box yellow">yellow</div>
    <div class="color-box orange">orange</div>
    <div class="color-box purple">purple</div>
    <div class="color-box pink">pink</div>
    <div class="color-box brown">brown</div>
    <div class="color-box gray">gray</div>
    <div class="color-box black">black</div>
    <div class="color-box white">white</div>
  </div>
  
  <h2>Blues</h2>
  <div class="color-grid">
    <div class="color-box navy">navy</div>
    <div class="color-box steelblue">steelblue</div>
    <div class="color-box dodgerblue">dodgerblue</div>
    <div class="color-box skyblue">skyblue</div>
    <div class="color-box lightblue">lightblue</div>
    <div class="color-box aqua">aqua</div>
    <div class="color-box teal">teal</div>
    <div class="color-box cyan">cyan</div>
  </div>
  
  <h2>Greens</h2>
  <div class="color-grid">
    <div class="color-box darkgreen">darkgreen</div>
    <div class="color-box forestgreen">forestgreen</div>
    <div class="color-box seagreen">seagreen</div>
    <div class="color-box limegreen">limegreen</div>
    <div class="color-box springgreen">springgreen</div>
    <div class="color-box lime">lime</div>
    <div class="color-box olive">olive</div>
  </div>
  
  <h2>Reds & Oranges</h2>
  <div class="color-grid">
    <div class="color-box darkred">darkred</div>
    <div class="color-box crimson">crimson</div>
    <div class="color-box firebrick">firebrick</div>
    <div class="color-box indianred">indianred</div>
    <div class="color-box salmon">salmon</div>
    <div class="color-box coral">coral</div>
    <div class="color-box tomato">tomato</div>
  </div>
  
  <h2>Purples</h2>
  <div class="color-grid">
    <div class="color-box indigo">indigo</div>
    <div class="color-box violet">violet</div>
    <div class="color-box orchid">orchid</div>
    <div class="color-box plum">plum</div>
    <div class="color-box magenta">magenta</div>
    <div class="color-box fuchsia">fuchsia</div>
  </div>
  
  <h2>Browns & Tans</h2>
  <div class="color-grid">
    <div class="color-box sienna">sienna</div>
    <div class="color-box chocolate">chocolate</div>
    <div class="color-box saddlebrown">saddlebrown</div>
    <div class="color-box peru">peru</div>
    <div class="color-box tan">tan</div>
    <div class="color-box wheat">wheat</div>
  </div>
  
  <h2>Grays</h2>
  <div class="color-grid">
    <div class="color-box dimgray">dimgray</div>
    <div class="color-box gray">gray</div>
    <div class="color-box darkgray">darkgray</div>
    <div class="color-box silver">silver</div>
    <div class="color-box lightgray">lightgray</div>
    <div class="color-box slategray">slategray</div>
  </div>
</div>

</body>
</html>`,
    },
    'text-effects': {
      title: 'CSS Text Effects',
      content: `
# CSS Text Effects

Create stunning text effects with CSS.

## Text Shadow

<pre><code class="css">
/* Basic shadow */
text-shadow: 2px 2px 4px rgba(0,0,0,0.5);

/* Multiple shadows */
text-shadow: 
  1px 1px 0 #fff,
  2px 2px 0 #333;

/* Glow effect */
text-shadow: 0 0 10px #3498db;
</code></pre>

## Text Stroke

<pre><code class="css">
-webkit-text-stroke: 2px black;
-webkit-text-fill-color: transparent;
</code></pre>

## Gradient Text

<pre><code class="css">
.gradient-text {
  background: linear-gradient(45deg, #f06, #9f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</code></pre>

## Text Overflow

<pre><code class="css">
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Multi-line truncate */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { 
  font-family: Arial; 
  padding: 20px; 
  background: #1a1a2e;
  color: white;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 { text-align: center; margin-bottom: 40px; }
h2 { color: #888; font-size: 14px; margin: 30px 0 15px; text-transform: uppercase; }

.effect-box {
  padding: 40px;
  text-align: center;
  margin: 15px 0;
  border-radius: 12px;
  background: #16213e;
}

/* Text Shadow */
.shadow-basic {
  font-size: 48px;
  font-weight: bold;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
}

/* 3D Text */
.shadow-3d {
  font-size: 48px;
  font-weight: bold;
  color: #e74c3c;
  text-shadow:
    1px 1px 0 #c0392b,
    2px 2px 0 #a93226,
    3px 3px 0 #922b21,
    4px 4px 0 #7b241c,
    5px 5px 10px rgba(0,0,0,0.5);
}

/* Neon Glow */
.neon {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #0ff,
    0 0 30px #0ff,
    0 0 40px #0ff;
  animation: neon-flicker 1.5s infinite alternate;
}

@keyframes neon-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Gradient Text */
.gradient-text {
  font-size: 56px;
  font-weight: bold;
  background: linear-gradient(45deg, #f06, #48f, #0ff, #0f0);
  background-size: 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Outline Text */
.outline-text {
  font-size: 56px;
  font-weight: bold;
  -webkit-text-stroke: 2px #3498db;
  -webkit-text-fill-color: transparent;
}

/* Glitch Effect */
.glitch {
  font-size: 48px;
  font-weight: bold;
  position: relative;
}

.glitch::before,
.glitch::after {
  content: 'GLITCH';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.glitch::before {
  color: #f0f;
  animation: glitch-1 0.3s infinite;
  clip-path: inset(0 0 50% 0);
}

.glitch::after {
  color: #0ff;
  animation: glitch-2 0.3s infinite;
  clip-path: inset(50% 0 0 0);
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(2px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(2px, -2px); }
  40% { transform: translate(-2px, 2px); }
}

/* Truncate */
.truncate-demo {
  background: #0f3460;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
  margin: 10px 0;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
}
</style>
</head>
<body>

<div class="container">
  <h1>✨ CSS Text Effects</h1>
  
  <h2>Basic Shadow</h2>
  <div class="effect-box">
    <div class="shadow-basic">Shadow Text</div>
  </div>
  
  <h2>3D Text Effect</h2>
  <div class="effect-box">
    <div class="shadow-3d">3D TEXT</div>
  </div>
  
  <h2>Neon Glow</h2>
  <div class="effect-box" style="background:#000;">
    <div class="neon">NEON</div>
  </div>
  
  <h2>Gradient Text</h2>
  <div class="effect-box">
    <div class="gradient-text">GRADIENT</div>
  </div>
  
  <h2>Outline Text</h2>
  <div class="effect-box">
    <div class="outline-text">OUTLINE</div>
  </div>
  
  <h2>Glitch Effect</h2>
  <div class="effect-box" style="background:#000;">
    <div class="glitch">GLITCH</div>
  </div>
  
  <h2>Text Truncation</h2>
  <div class="truncate-demo">
    <p><strong>Single line:</strong></p>
    <div class="truncate">
      This is a very long text that will be truncated with an ellipsis when it overflows the container width.
    </div>
    <p style="margin-top:15px;"><strong>Multi-line (2 lines):</strong></p>
    <div class="line-clamp">
      This is a longer paragraph that demonstrates multi-line text truncation using the -webkit-line-clamp property. It will show only 2 lines and add an ellipsis at the end.
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'custom-fonts': {
      title: 'CSS Custom Fonts',
      content: `
# CSS Custom Fonts

Use custom fonts in your web pages.

## @font-face

<pre><code class="css">
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2'),
       url('myfont.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'MyFont', sans-serif;
}
</code></pre>

## Google Fonts

<pre><code class="html">
&lt;link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&amp;display=swap" rel="stylesheet"&gt;
</code></pre>

<pre><code class="css">
body {
  font-family: 'Roboto', sans-serif;
}
</code></pre>

## Font Properties

<pre><code class="css">
font-family: 'Open Sans', sans-serif;
font-size: 16px;
font-weight: 400; /* 100-900 */
font-style: normal; /* italic, oblique */
font-variant: normal; /* small-caps */
line-height: 1.5;
letter-spacing: 0.5px;
</code></pre>

## Variable Fonts

<pre><code class="css">
@font-face {
  font-family: 'VariableFont';
  src: url('variable.woff2') format('woff2-variations');
  font-weight: 100 900;
}

.text {
  font-variation-settings: 'wght' 500;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Poppins:wght@300;400;600;700&family=Fira+Code&family=Dancing+Script&display=swap" rel="stylesheet">
<style>
body { 
  padding: 20px; 
  background: #f5f5f5;
  margin: 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 48px;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 40px;
}

.font-card {
  background: white;
  padding: 30px;
  margin: 20px 0;
  border-radius: 12px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

.font-card h2 {
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0 0 15px;
  font-family: 'Poppins', sans-serif;
}

.font-demo {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 15px 0;
}

/* Poppins - Modern Sans-serif */
.poppins {
  font-family: 'Poppins', sans-serif;
}

.poppins-light { font-weight: 300; font-size: 24px; }
.poppins-regular { font-weight: 400; font-size: 24px; }
.poppins-semibold { font-weight: 600; font-size: 24px; }
.poppins-bold { font-weight: 700; font-size: 24px; }

/* Playfair Display - Elegant Serif */
.playfair {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  line-height: 1.4;
}

/* Fira Code - Monospace */
.fira-code {
  font-family: 'Fira Code', monospace;
  font-size: 16px;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
}

/* Dancing Script - Script/Cursive */
.dancing {
  font-family: 'Dancing Script', cursive;
  font-size: 42px;
  color: #e74c3c;
}

/* Font pairing example */
.pairing-demo {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
}

.pairing-demo h3 {
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  margin: 0 0 15px;
}

.pairing-demo p {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: 300;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Code example */
.code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  overflow-x: auto;
  margin: 15px 0;
}

.code-block .keyword { color: #569cd6; }
.code-block .string { color: #ce9178; }
.code-block .property { color: #9cdcfe; }
</style>
</head>
<body>

<div class="container">
  <h1>Custom Web Fonts</h1>
  
  <div class="font-card">
    <h2>Poppins - Sans-serif Font Weights</h2>
    <div class="font-demo poppins">
      <div class="poppins-light">Light 300 - The quick brown fox</div>
      <div class="poppins-regular">Regular 400 - The quick brown fox</div>
      <div class="poppins-semibold">Semibold 600 - The quick brown fox</div>
      <div class="poppins-bold">Bold 700 - The quick brown fox</div>
    </div>
  </div>
  
  <div class="font-card">
    <h2>Playfair Display - Elegant Serif</h2>
    <div class="font-demo playfair">
      Beautiful Typography Makes All The Difference
    </div>
  </div>
  
  <div class="font-card">
    <h2>Fira Code - Monospace for Code</h2>
    <div class="fira-code">
const greeting = "Hello, World!";<br>
console.log(greeting);
    </div>
  </div>
  
  <div class="font-card">
    <h2>Dancing Script - Decorative</h2>
    <div class="font-demo dancing">
      Elegant & Beautiful
    </div>
  </div>
  
  <div class="font-card">
    <h2>Font Pairing Example</h2>
    <div class="pairing-demo">
      <h3>Playfair Display</h3>
      <p>Paired with Poppins for body text. Serif + Sans-serif is a classic combination that creates visual hierarchy and readability.</p>
    </div>
  </div>
  
  <div class="font-card">
    <h2>How to Include Google Fonts</h2>
    <div class="code-block">
&lt;<span class="keyword">link</span> <span class="property">href</span>=<span class="string">"https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"</span> <span class="property">rel</span>=<span class="string">"stylesheet"</span>&gt;
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'image-styling': {
      title: 'CSS Image Styling',
      content: `
# CSS Image Styling

Style images with CSS.

## Basic Styling

<pre><code class="css">
img {
  max-width: 100%;
  height: auto;
  display: block;
}
</code></pre>

## Border & Shadow

<pre><code class="css">
img {
  border: 3px solid #3498db;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}
</code></pre>

## Filters

<pre><code class="css">
img { filter: grayscale(100%); }
img { filter: blur(5px); }
img { filter: brightness(1.2); }
img { filter: contrast(1.5); }
img { filter: saturate(2); }
img { filter: sepia(100%); }
img { filter: hue-rotate(90deg); }
</code></pre>

## Hover Effects

<pre><code class="css">
img {
  transition: transform 0.3s, filter 0.3s;
}

img:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}
</code></pre>

## Object Fit

<pre><code class="css">
img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { 
  font-family: Arial; 
  padding: 20px; 
  background: #f0f0f0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 { text-align: center; color: #2c3e50; }
h2 { color: #34495e; margin-top: 30px; }

.demo-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

/* Basic responsive image */
.basic-img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
}

/* Styled with border and shadow */
.styled-img {
  border: 4px solid #3498db;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Circular image */
.circular {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #2ecc71;
}

/* Filter Grid */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.filter-item {
  text-align: center;
}

.filter-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  transition: filter 0.3s;
}

.filter-item p {
  margin: 8px 0 0;
  font-size: 12px;
  color: #666;
}

.grayscale img { filter: grayscale(100%); }
.blur img { filter: blur(2px); }
.brightness img { filter: brightness(1.3); }
.contrast img { filter: contrast(1.5); }
.saturate img { filter: saturate(2); }
.sepia img { filter: sepia(100%); }
.hue-rotate img { filter: hue-rotate(90deg); }
.invert img { filter: invert(100%); }

/* Hover Effects */
.hover-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.hover-item {
  overflow: hidden;
  border-radius: 10px;
}

.hover-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.zoom-effect img {
  transition: transform 0.4s ease;
}
.zoom-effect:hover img {
  transform: scale(1.2);
}

.grayscale-effect img {
  filter: grayscale(100%);
  transition: filter 0.4s ease;
}
.grayscale-effect:hover img {
  filter: grayscale(0%);
}

.overlay-effect {
  position: relative;
}
.overlay-effect::after {
  content: 'View More';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  font-weight: bold;
}
.overlay-effect:hover::after {
  opacity: 1;
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Image Styling</h1>
  
  <div class="demo-section">
    <h2>Basic & Styled Images</h2>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; align-items:center;">
      <div style="text-align:center;">
        <img src="https://picsum.photos/200/150?random=1" alt="" class="basic-img">
        <p>Basic responsive</p>
      </div>
      <div style="text-align:center;">
        <img src="https://picsum.photos/200/150?random=2" alt="" class="basic-img styled-img">
        <p>Border + Shadow</p>
      </div>
      <div style="text-align:center;">
        <img src="https://picsum.photos/200/200?random=3" alt="" class="circular">
        <p>Circular</p>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>CSS Filters</h2>
    <div class="filter-grid">
      <div class="filter-item">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>Original</p>
      </div>
      <div class="filter-item grayscale">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>grayscale(100%)</p>
      </div>
      <div class="filter-item blur">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>blur(2px)</p>
      </div>
      <div class="filter-item brightness">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>brightness(1.3)</p>
      </div>
      <div class="filter-item contrast">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>contrast(1.5)</p>
      </div>
      <div class="filter-item saturate">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>saturate(2)</p>
      </div>
      <div class="filter-item sepia">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>sepia(100%)</p>
      </div>
      <div class="filter-item hue-rotate">
        <img src="https://picsum.photos/200/200?random=10" alt="">
        <p>hue-rotate(90deg)</p>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Hover Effects</h2>
    <div class="hover-grid">
      <div class="hover-item zoom-effect">
        <img src="https://picsum.photos/300/200?random=20" alt="">
      </div>
      <div class="hover-item grayscale-effect">
        <img src="https://picsum.photos/300/200?random=21" alt="">
      </div>
      <div class="hover-item overlay-effect">
        <img src="https://picsum.photos/300/200?random=22" alt="">
      </div>
    </div>
    <p style="text-align:center; color:#888; margin-top:10px;">Hover over the images!</p>
  </div>
</div>

</body>
</html>`,
    },
    'object-fit': {
      title: 'CSS object-fit',
      content: `
# CSS object-fit

Control how images/videos fit their container.

## Values

<pre><code class="css">
/* Fill container, may distort */
object-fit: fill;

/* Maintain ratio, may leave gaps */
object-fit: contain;

/* Maintain ratio, may crop */
object-fit: cover;

/* Original size */
object-fit: none;

/* Choose smaller of none or contain */
object-fit: scale-down;
</code></pre>

## object-position

<pre><code class="css">
object-position: center;    /* default */
object-position: top;
object-position: bottom;
object-position: left;
object-position: right;
object-position: 25% 75%;
</code></pre>

## Common Use Cases

<pre><code class="css">
/* Fixed-height image container */
.thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* Avatar */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

/* Video background */
video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { 
  font-family: Arial; 
  padding: 20px; 
  background: #f5f5f5;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 { text-align: center; color: #2c3e50; }
h2 { color: #34495e; margin-top: 30px; }

.demo-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin: 20px 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

/* Object-fit comparison grid */
.fit-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.fit-item {
  text-align: center;
}

.fit-item .img-container {
  width: 100%;
  height: 150px;
  border: 2px dashed #3498db;
  border-radius: 8px;
  overflow: hidden;
  background: #ecf0f1;
}

.fit-item img {
  width: 100%;
  height: 100%;
}

.fit-item p {
  margin: 10px 0 0;
  font-size: 12px;
  color: #666;
  font-weight: bold;
}

.fit-fill img { object-fit: fill; }
.fit-contain img { object-fit: contain; }
.fit-cover img { object-fit: cover; }
.fit-none img { object-fit: none; }
.fit-scale-down img { object-fit: scale-down; }

/* Object-position grid */
.position-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.position-item {
  text-align: center;
}

.position-item .img-container {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.position-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.position-item p {
  margin: 8px 0 0;
  font-size: 11px;
  color: #888;
}

.pos-center img { object-position: center; }
.pos-top img { object-position: top; }
.pos-bottom img { object-position: bottom; }
.pos-left img { object-position: left; }
.pos-right img { object-position: right; }

/* Practical examples */
.practical-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.card {
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.card-body {
  padding: 15px;
}

.card-body h4 {
  margin: 0 0 5px;
  font-size: 14px;
}

.card-body p {
  margin: 0;
  font-size: 12px;
  color: #888;
}

/* Avatars */
.avatar-row {
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 20px 0;
}

.avatar {
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #3498db;
}

.avatar-sm { width: 40px; height: 40px; }
.avatar-md { width: 60px; height: 60px; }
.avatar-lg { width: 80px; height: 80px; }
</style>
</head>
<body>

<div class="container">
  <h1>CSS object-fit</h1>
  
  <div class="demo-section">
    <h2>Object-fit Values</h2>
    <p style="color:#888;">Same image (landscape) in same-sized containers:</p>
    <div class="fit-grid">
      <div class="fit-item fit-fill">
        <div class="img-container">
          <img src="https://picsum.photos/400/200?random=1" alt="">
        </div>
        <p>fill</p>
      </div>
      <div class="fit-item fit-contain">
        <div class="img-container">
          <img src="https://picsum.photos/400/200?random=1" alt="">
        </div>
        <p>contain</p>
      </div>
      <div class="fit-item fit-cover">
        <div class="img-container">
          <img src="https://picsum.photos/400/200?random=1" alt="">
        </div>
        <p>cover</p>
      </div>
      <div class="fit-item fit-none">
        <div class="img-container">
          <img src="https://picsum.photos/400/200?random=1" alt="">
        </div>
        <p>none</p>
      </div>
      <div class="fit-item fit-scale-down">
        <div class="img-container">
          <img src="https://picsum.photos/400/200?random=1" alt="">
        </div>
        <p>scale-down</p>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Object-position with cover</h2>
    <p style="color:#888;">All images use object-fit: cover with different positions:</p>
    <div class="position-grid">
      <div class="position-item pos-center">
        <div class="img-container">
          <img src="https://picsum.photos/400/600?random=5" alt="">
        </div>
        <p>center</p>
      </div>
      <div class="position-item pos-top">
        <div class="img-container">
          <img src="https://picsum.photos/400/600?random=5" alt="">
        </div>
        <p>top</p>
      </div>
      <div class="position-item pos-bottom">
        <div class="img-container">
          <img src="https://picsum.photos/400/600?random=5" alt="">
        </div>
        <p>bottom</p>
      </div>
      <div class="position-item pos-left">
        <div class="img-container">
          <img src="https://picsum.photos/600/400?random=6" alt="">
        </div>
        <p>left</p>
      </div>
      <div class="position-item pos-right">
        <div class="img-container">
          <img src="https://picsum.photos/600/400?random=6" alt="">
        </div>
        <p>right</p>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Practical: Card Thumbnails</h2>
    <div class="practical-grid">
      <div class="card">
        <img src="https://picsum.photos/400/300?random=10" alt="">
        <div class="card-body">
          <h4>Card Title</h4>
          <p>object-fit: cover</p>
        </div>
      </div>
      <div class="card">
        <img src="https://picsum.photos/200/400?random=11" alt="">
        <div class="card-body">
          <h4>Tall Image</h4>
          <p>Still fits perfectly</p>
        </div>
      </div>
      <div class="card">
        <img src="https://picsum.photos/600/200?random=12" alt="">
        <div class="card-body">
          <h4>Wide Image</h4>
          <p>Cropped to fit</p>
        </div>
      </div>
      <div class="card">
        <img src="https://picsum.photos/400/400?random=13" alt="">
        <div class="card-body">
          <h4>Square Image</h4>
          <p>Works great!</p>
        </div>
      </div>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Circular Avatars</h2>
    <div class="avatar-row">
      <img class="avatar avatar-sm" src="https://i.pravatar.cc/100?img=1" alt="">
      <img class="avatar avatar-md" src="https://i.pravatar.cc/100?img=2" alt="">
      <img class="avatar avatar-lg" src="https://i.pravatar.cc/100?img=3" alt="">
      <span style="color:#888; margin-left:10px;">← All use object-fit: cover</span>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'multiple-columns': {
      title: 'CSS Multiple Columns',
      content: `
# CSS Multiple Columns

Create newspaper-style column layouts.

## Column Count

<pre><code class="css">
.text {
  column-count: 3;
}
</code></pre>

## Column Width

<pre><code class="css">
.text {
  column-width: 200px;
  /* Creates as many columns as fit */
}
</code></pre>

## Columns Shorthand

<pre><code class="css">
/* columns: width count */
columns: 200px 3;
columns: auto 3;
columns: 200px auto;
</code></pre>

## Column Gap & Rule

<pre><code class="css">
.text {
  column-gap: 40px;
  column-rule: 1px solid #ccc;
  /* column-rule-width, column-rule-style, column-rule-color */
}
</code></pre>

## Column Span

<pre><code class="css">
h2 {
  column-span: all;
  /* Spans across all columns */
}
</code></pre>

## Prevent Breaking

<pre><code class="css">
.item {
  break-inside: avoid;
  /* Keeps element in one column */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { 
  font-family: Georgia, serif; 
  padding: 20px; 
  background: #f5f5f5;
  line-height: 1.7;
}

.container {
  max-width: 900px;
  margin: 0 auto;
}

h1 { 
  text-align: center; 
  color: #2c3e50;
  font-family: 'Playfair Display', Georgia, serif;
}

.demo-section {
  background: white;
  padding: 30px;
  border-radius: 12px;
  margin: 25px 0;
  box-shadow: 0 2px 15px rgba(0,0,0,0.08);
}

.demo-section h2 {
  font-family: Arial, sans-serif;
  color: #34495e;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #ecf0f1;
}

/* Basic 3 columns */
.three-columns {
  column-count: 3;
  column-gap: 30px;
}

/* With column rule */
.with-rule {
  column-count: 3;
  column-gap: 40px;
  column-rule: 1px solid #ddd;
}

/* Responsive columns */
.responsive-columns {
  columns: 250px auto;
  column-gap: 30px;
  column-rule: 1px dotted #ccc;
}

/* Column span */
.span-demo {
  column-count: 2;
  column-gap: 30px;
}

.span-demo h3 {
  column-span: all;
  text-align: center;
  color: #3498db;
  margin: 20px 0 10px;
  padding: 10px;
  background: #ecf0f1;
  border-radius: 5px;
}

/* Masonry-style cards */
.masonry {
  column-count: 3;
  column-gap: 20px;
}

.masonry-item {
  break-inside: avoid;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

.masonry-item.tall { min-height: 150px; }
.masonry-item.short { min-height: 80px; }
.masonry-item.medium { min-height: 120px; }

.masonry-item.green { background: linear-gradient(135deg, #11998e, #38ef7d); }
.masonry-item.orange { background: linear-gradient(135deg, #f093fb, #f5576c); }
.masonry-item.blue { background: linear-gradient(135deg, #4facfe, #00f2fe); }

/* Drop cap */
.drop-cap::first-letter {
  float: left;
  font-size: 4em;
  line-height: 0.8;
  padding-right: 10px;
  color: #3498db;
  font-weight: bold;
}

.lorem {
  text-align: justify;
}
</style>
</head>
<body>

<div class="container">
  <h1>CSS Multiple Columns</h1>
  
  <div class="demo-section">
    <h2>Basic 3 Columns</h2>
    <div class="three-columns lorem">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>With Column Rule (Divider)</h2>
    <div class="with-rule lorem">
      <p class="drop-cap">The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the alphabet and is commonly used for typography testing.</p>
      <p>Multiple columns create a newspaper-like reading experience that can make long text more scannable and easier to read.</p>
      <p>The column-rule property adds a line between columns, similar to a border but specifically for multi-column layouts.</p>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Column Span</h2>
    <div class="span-demo lorem">
      <p>Text flows into multiple columns automatically. This paragraph appears in the first available column space.</p>
      <h3>This Heading Spans All Columns</h3>
      <p>After the spanning element, text continues to flow into the columns below. This creates a nice visual break in the content.</p>
      <p>Column span is particularly useful for headlines, images, or callout sections that need to stand out.</p>
    </div>
  </div>
  
  <div class="demo-section">
    <h2>Masonry-Style Cards</h2>
    <div class="masonry">
      <div class="masonry-item tall">Card 1 - Tall</div>
      <div class="masonry-item short green">Card 2 - Short</div>
      <div class="masonry-item medium orange">Card 3 - Medium</div>
      <div class="masonry-item short">Card 4 - Short</div>
      <div class="masonry-item tall blue">Card 5 - Tall</div>
      <div class="masonry-item medium">Card 6 - Medium</div>
      <div class="masonry-item short green">Card 7 - Short</div>
      <div class="masonry-item tall orange">Card 8 - Tall</div>
      <div class="masonry-item medium blue">Card 9 - Medium</div>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'flex-responsive': {
      title: 'Flex Responsive',
      content: `
# Responsive Flexbox Layouts

Build responsive layouts with Flexbox.

## Mobile-First Approach

<pre><code class="css">
/* Mobile: stack vertically */
.container {
  display: flex;
  flex-direction: column;
}

/* Tablet: side by side */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}
</code></pre>

## Flex Wrap for Cards

<pre><code class="css">
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px; /* grow, shrink, basis */
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

/* Cards grid */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 250px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Sidebar layout */
.layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar {
  background: #3498db;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.main {
  background: #2ecc71;
  color: white;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
}

/* Tablet and up */
@media (min-width: 768px) {
  .layout {
    flex-direction: row;
  }
  
  .sidebar {
    width: 250px;
    flex-shrink: 0;
  }
}

body { 
  font-family: Arial; 
  margin: 0; 
  background: #f5f5f5; 
}
</style>
</head>
<body>

<div class="container">
  <h1>Responsive Flexbox</h1>
  
  <h2>Card Grid (auto-wrap)</h2>
  <div class="cards">
    <div class="card"><h3>Card 1</h3><p>Flex: 1 1 250px</p></div>
    <div class="card"><h3>Card 2</h3><p>Auto-wraps</p></div>
    <div class="card"><h3>Card 3</h3><p>Resize to see!</p></div>
  </div>
  
  <h2>Sidebar Layout</h2>
  <div class="layout">
    <div class="sidebar">Sidebar<br>250px on desktop</div>
    <div class="main">Main Content<br>flex: 1</div>
  </div>
</div>

</body>
</html>`,
    },
    'image-filters': {
      title: 'CSS Image Filters',
      content: `
# CSS Image Filters

Apply visual effects to images with CSS filters.

## Filter Functions

<pre><code class="css">
img {
  filter: blur(5px);
  filter: brightness(150%);
  filter: contrast(200%);
  filter: grayscale(100%);
  filter: hue-rotate(90deg);
  filter: invert(100%);
  filter: opacity(50%);
  filter: saturate(200%);
  filter: sepia(100%);
  filter: drop-shadow(5px 5px 10px black);
}
</code></pre>

## Multiple Filters

<pre><code class="css">
img {
  filter: grayscale(100%) brightness(120%);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.filter-box {
  text-align: center;
}

.filter-box img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  transition: filter 0.3s;
}

.filter-box p {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

/* Filter effects */
.original img { filter: none; }
.blur img { filter: blur(3px); }
.brightness img { filter: brightness(150%); }
.contrast img { filter: contrast(200%); }
.grayscale img { filter: grayscale(100%); }
.hue-rotate img { filter: hue-rotate(90deg); }
.invert img { filter: invert(100%); }
.saturate img { filter: saturate(300%); }
.sepia img { filter: sepia(100%); }
.drop-shadow img { filter: drop-shadow(5px 5px 5px rgba(0,0,0,0.5)); }

/* Hover effect */
.hover-effect img:hover {
  filter: grayscale(0%) brightness(110%);
}
.hover-effect img {
  filter: grayscale(100%);
}

body { font-family: Arial; }
</style>
</head>
<body>

<h1 style="padding:20px;">CSS Image Filters</h1>

<div class="gallery">
  <div class="filter-box original">
    <img src="https://picsum.photos/150/100?1" alt="original">
    <p>Original</p>
  </div>
  <div class="filter-box blur">
    <img src="https://picsum.photos/150/100?1" alt="blur">
    <p>blur(3px)</p>
  </div>
  <div class="filter-box brightness">
    <img src="https://picsum.photos/150/100?1" alt="brightness">
    <p>brightness(150%)</p>
  </div>
  <div class="filter-box grayscale">
    <img src="https://picsum.photos/150/100?1" alt="grayscale">
    <p>grayscale(100%)</p>
  </div>
  <div class="filter-box sepia">
    <img src="https://picsum.photos/150/100?1" alt="sepia">
    <p>sepia(100%)</p>
  </div>
  <div class="filter-box saturate">
    <img src="https://picsum.photos/150/100?1" alt="saturate">
    <p>saturate(300%)</p>
  </div>
  <div class="filter-box hover-effect">
    <img src="https://picsum.photos/150/100?1" alt="hover">
    <p>Hover me!</p>
  </div>
</div>

</body>
</html>`,
    },
    'image-shapes': {
      title: 'CSS Image Shapes',
      content: `
# CSS Image Shapes

Create interesting shapes with images.

## Circle Image

<pre><code class="css">
.circle {
  border-radius: 50%;
}
</code></pre>

## Clip Path

<pre><code class="css">
.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.hexagon {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.shapes {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
  justify-content: center;
}

.shape-box {
  text-align: center;
}

.shape-box img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.shape-box p {
  margin-top: 10px;
  font-size: 14px;
}

/* Shapes */
.circle img { border-radius: 50%; }

.rounded img { border-radius: 20px; }

.triangle img {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.pentagon img {
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

.hexagon img {
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}

.star img {
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
}

.diamond img {
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.arrow img {
  clip-path: polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%);
}

body { font-family: Arial; background: #f5f5f5; }
h1 { text-align: center; padding: 20px; }
</style>
</head>
<body>

<h1>CSS Image Shapes</h1>

<div class="shapes">
  <div class="shape-box circle">
    <img src="https://picsum.photos/200?1" alt="circle">
    <p>Circle</p>
  </div>
  <div class="shape-box rounded">
    <img src="https://picsum.photos/200?2" alt="rounded">
    <p>Rounded</p>
  </div>
  <div class="shape-box triangle">
    <img src="https://picsum.photos/200?3" alt="triangle">
    <p>Triangle</p>
  </div>
  <div class="shape-box pentagon">
    <img src="https://picsum.photos/200?4" alt="pentagon">
    <p>Pentagon</p>
  </div>
  <div class="shape-box hexagon">
    <img src="https://picsum.photos/200?5" alt="hexagon">
    <p>Hexagon</p>
  </div>
  <div class="shape-box star">
    <img src="https://picsum.photos/200?6" alt="star">
    <p>Star</p>
  </div>
  <div class="shape-box diamond">
    <img src="https://picsum.photos/200?7" alt="diamond">
    <p>Diamond</p>
  </div>
</div>

</body>
</html>`,
    },
    'image-modal': {
      title: 'CSS Image Modal',
      content: `
# CSS Image Modal (Lightbox)

Create image modals/lightboxes with CSS and minimal JavaScript.

## Structure

<pre><code class="html">
&lt;img class="thumbnail" onclick="openModal()" src="..."&gt;

&lt;div id="modal" class="modal"&gt;
  &lt;span class="close"&gt;&amp;times;&lt;/span&gt;
  &lt;img class="modal-content" src="..."&gt;
&lt;/div&gt;
</code></pre>

## CSS

<pre><code class="css">
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
}

.modal-content {
  max-width: 80%;
  max-height: 80%;
  margin: auto;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Thumbnail gallery */
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
}

.thumbnail {
  width: 150px;
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.3s, opacity 0.3s;
}

.thumbnail:hover {
  transform: scale(1.05);
  opacity: 0.8;
}

/* Modal */
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
  justify-content: center;
  align-items: center;
}

.modal.active { display: flex; }

.modal-content {
  max-width: 90%;
  max-height: 90%;
  border-radius: 8px;
  animation: zoom 0.3s;
}

@keyframes zoom {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.close {
  position: absolute;
  top: 20px;
  right: 30px;
  color: white;
  font-size: 40px;
  cursor: pointer;
}

.close:hover { color: #ccc; }

body { font-family: Arial; margin: 0; }
h1 { padding: 20px 20px 0; }
p { padding: 0 20px; color: #666; }
</style>
</head>
<body>

<h1>Image Modal / Lightbox</h1>
<p>Click any image to enlarge</p>

<div class="gallery">
  <img class="thumbnail" src="https://picsum.photos/400/300?1" onclick="openModal(this)">
  <img class="thumbnail" src="https://picsum.photos/400/300?2" onclick="openModal(this)">
  <img class="thumbnail" src="https://picsum.photos/400/300?3" onclick="openModal(this)">
  <img class="thumbnail" src="https://picsum.photos/400/300?4" onclick="openModal(this)">
</div>

<div id="modal" class="modal" onclick="closeModal()">
  <span class="close">&times;</span>
  <img class="modal-content" id="modalImg">
</div>

<script>
function openModal(img) {
  document.getElementById('modal').classList.add('active');
  document.getElementById('modalImg').src = img.src;
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}
</script>

</body>
</html>`,
    },
    'image-centering': {
      title: 'CSS Image Centering',
      content: `
# Center Images with CSS

Multiple ways to center images.

## Horizontal Centering

<pre><code class="css">
/* Block image */
img {
  display: block;
  margin: 0 auto;
}

/* Flexbox */
.container {
  display: flex;
  justify-content: center;
}

/* Text-align (inline image) */
.container {
  text-align: center;
}
</code></pre>

## Both Horizontal & Vertical

<pre><code class="css">
/* Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

/* Grid */
.container {
  display: grid;
  place-items: center;
  height: 100vh;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.demo {
  border: 2px dashed #3498db;
  margin: 20px;
  padding: 20px;
  min-height: 150px;
}

/* Method 1: margin auto */
.method1 img {
  display: block;
  margin: 0 auto;
}

/* Method 2: text-align */
.method2 {
  text-align: center;
}

/* Method 3: Flexbox */
.method3 {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Method 4: Grid */
.method4 {
  display: grid;
  place-items: center;
}

/* Method 5: Absolute positioning */
.method5 {
  position: relative;
}
.method5 img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

img {
  width: 100px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

body { font-family: Arial; }
h2 { margin: 20px 20px 0; font-size: 16px; }
</style>
</head>
<body>

<h1 style="padding:20px;">Centering Images</h1>

<h2>1. margin: 0 auto (horizontal)</h2>
<div class="demo method1">
  <img src="https://picsum.photos/100/80?1" alt="centered">
</div>

<h2>2. text-align: center (horizontal)</h2>
<div class="demo method2">
  <img src="https://picsum.photos/100/80?2" alt="centered">
</div>

<h2>3. Flexbox (both directions)</h2>
<div class="demo method3">
  <img src="https://picsum.photos/100/80?3" alt="centered">
</div>

<h2>4. Grid place-items (both directions)</h2>
<div class="demo method4">
  <img src="https://picsum.photos/100/80?4" alt="centered">
</div>

<h2>5. Absolute + Transform (both directions)</h2>
<div class="demo method5">
  <img src="https://picsum.photos/100/80?5" alt="centered">
</div>

</body>
</html>`,
    },
    masking: {
      title: 'CSS Masking',
      content: `
# CSS Masking

Apply masks to reveal parts of elements.

## mask-image

<pre><code class="css">
.masked {
  mask-image: url('mask.png');
  -webkit-mask-image: url('mask.png');
}
</code></pre>

## Gradient Masks

<pre><code class="css">
.fade {
  mask-image: linear-gradient(to bottom, black, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black, transparent);
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  padding: 20px;
  justify-content: center;
}

.mask-box {
  text-align: center;
}

.mask-box img {
  width: 200px;
  height: 150px;
  object-fit: cover;
}

/* Gradient fade masks */
.fade-bottom img {
  -webkit-mask-image: linear-gradient(to bottom, black 50%, transparent);
  mask-image: linear-gradient(to bottom, black 50%, transparent);
}

.fade-right img {
  -webkit-mask-image: linear-gradient(to right, black 50%, transparent);
  mask-image: linear-gradient(to right, black 50%, transparent);
}

.fade-radial img {
  -webkit-mask-image: radial-gradient(circle, black 40%, transparent 70%);
  mask-image: radial-gradient(circle, black 40%, transparent 70%);
}

/* Repeat mask */
.dots img {
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 30%);
  -webkit-mask-size: 20px 20px;
  mask-image: radial-gradient(circle at center, black 30%, transparent 30%);
  mask-size: 20px 20px;
}

.stripes img {
  -webkit-mask-image: repeating-linear-gradient(
    90deg,
    black 0px,
    black 10px,
    transparent 10px,
    transparent 20px
  );
  mask-image: repeating-linear-gradient(
    90deg,
    black 0px,
    black 10px,
    transparent 10px,
    transparent 20px
  );
}

body { font-family: Arial; background: #f0f0f0; }
h1 { text-align: center; padding: 20px; }
.mask-box p { margin-top: 10px; font-size: 14px; }
</style>
</head>
<body>

<h1>CSS Masking</h1>

<div class="gallery">
  <div class="mask-box">
    <img src="https://picsum.photos/300/200?1" alt="original">
    <p>Original</p>
  </div>
  <div class="mask-box fade-bottom">
    <img src="https://picsum.photos/300/200?1" alt="fade">
    <p>Fade Bottom</p>
  </div>
  <div class="mask-box fade-right">
    <img src="https://picsum.photos/300/200?1" alt="fade">
    <p>Fade Right</p>
  </div>
  <div class="mask-box fade-radial">
    <img src="https://picsum.photos/300/200?1" alt="radial">
    <p>Radial Fade</p>
  </div>
  <div class="mask-box dots">
    <img src="https://picsum.photos/300/200?1" alt="dots">
    <p>Dots Pattern</p>
  </div>
  <div class="mask-box stripes">
    <img src="https://picsum.photos/300/200?1" alt="stripes">
    <p>Stripes</p>
  </div>
</div>

</body>
</html>`,
    },
    'object-position': {
      title: 'CSS object-position',
      content: `
# CSS object-position

Control image positioning within its container.

## Syntax

<pre><code class="css">
img {
  object-fit: cover;
  object-position: center;      /* default */
  object-position: top;
  object-position: bottom;
  object-position: left;
  object-position: right;
  object-position: 25% 75%;     /* x y */
  object-position: 10px 20px;   /* offset */
}
</code></pre>

## Use Cases

- Profile photos (focus on face)
- Product images
- Banner images
- Thumbnails
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}

.pos-box {
  text-align: center;
}

.pos-box img {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border: 3px solid #3498db;
  border-radius: 8px;
}

/* Different positions */
.center img { object-position: center; }
.top img { object-position: top; }
.bottom img { object-position: bottom; }
.left img { object-position: left; }
.right img { object-position: right; }
.top-left img { object-position: top left; }
.bottom-right img { object-position: bottom right; }
.custom img { object-position: 25% 75%; }

.pos-box p {
  font-size: 12px;
  margin-top: 8px;
  font-family: monospace;
}

body { font-family: Arial; }
h1 { padding: 20px 20px 0; }
</style>
</head>
<body>

<h1>CSS object-position</h1>
<p style="padding:0 20px; color:#666;">All images use object-fit: cover with different positions</p>

<div class="gallery">
  <div class="pos-box center">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>center (default)</p>
  </div>
  <div class="pos-box top">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>top</p>
  </div>
  <div class="pos-box bottom">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>bottom</p>
  </div>
  <div class="pos-box left">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>left</p>
  </div>
  <div class="pos-box right">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>right</p>
  </div>
  <div class="pos-box top-left">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>top left</p>
  </div>
  <div class="pos-box bottom-right">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>bottom right</p>
  </div>
  <div class="pos-box custom">
    <img src="https://picsum.photos/400/300?1" alt="">
    <p>25% 75%</p>
  </div>
</div>

</body>
</html>`,
    },
    pagination: {
      title: 'CSS Pagination',
      content: `
# CSS Pagination

Style pagination controls for multi-page content.

## Basic Pagination

<pre><code class="css">
.pagination a {
  display: inline-block;
  padding: 8px 16px;
  text-decoration: none;
  color: black;
}

.pagination a.active {
  background-color: #4CAF50;
  color: white;
}

.pagination a:hover:not(.active) {
  background-color: #ddd;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }
h2 { margin-top: 30px; }

/* Basic pagination */
.pagination {
  display: inline-flex;
}

.pagination a {
  color: #333;
  padding: 10px 16px;
  text-decoration: none;
  transition: background-color 0.2s;
  border: 1px solid #ddd;
}

.pagination a.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.pagination a:hover:not(.active) {
  background-color: #f5f5f5;
}

/* Rounded pagination */
.pagination-rounded a {
  border-radius: 5px;
  margin: 0 3px;
}

/* Circle pagination */
.pagination-circle a {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 3px;
}

/* Pill pagination */
.pagination-pill {
  background: #f5f5f5;
  border-radius: 25px;
  padding: 5px;
}

.pagination-pill a {
  border: none;
  border-radius: 20px;
}

/* Breadcrumb-style */
.breadcrumb a {
  border: none;
  padding: 10px 20px;
  background: #e0e0e0;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%, 10px 50%);
  margin-left: -10px;
}
.breadcrumb a:first-child {
  margin-left: 0;
  clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%);
}
.breadcrumb a.active {
  background: #3498db;
}
</style>
</head>
<body>

<h1>CSS Pagination Styles</h1>

<h2>Basic Pagination</h2>
<div class="pagination">
  <a href="#">&laquo;</a>
  <a href="#">1</a>
  <a href="#" class="active">2</a>
  <a href="#">3</a>
  <a href="#">4</a>
  <a href="#">5</a>
  <a href="#">&raquo;</a>
</div>

<h2>Rounded Pagination</h2>
<div class="pagination pagination-rounded">
  <a href="#">&laquo;</a>
  <a href="#">1</a>
  <a href="#" class="active">2</a>
  <a href="#">3</a>
  <a href="#">4</a>
  <a href="#">&raquo;</a>
</div>

<h2>Circle Pagination</h2>
<div class="pagination pagination-circle">
  <a href="#">1</a>
  <a href="#" class="active">2</a>
  <a href="#">3</a>
  <a href="#">4</a>
</div>

<h2>Pill Pagination</h2>
<div class="pagination pagination-pill">
  <a href="#">Prev</a>
  <a href="#">1</a>
  <a href="#" class="active">2</a>
  <a href="#">3</a>
  <a href="#">Next</a>
</div>

</body>
</html>`,
    },
    'user-interface': {
      title: 'CSS User Interface',
      content: `
# CSS User Interface Properties

Control user interaction and UI behavior.

## resize

<pre><code class="css">
textarea {
  resize: vertical;   /* vertical only */
  resize: horizontal; /* horizontal only */
  resize: both;       /* both directions */
  resize: none;       /* disable resizing */
}
</code></pre>

## outline-offset

<pre><code class="css">
input:focus {
  outline: 2px solid blue;
  outline-offset: 5px;
}
</code></pre>

## caret-color

<pre><code class="css">
input {
  caret-color: red;
}
</code></pre>

## cursor

<pre><code class="css">
.pointer { cursor: pointer; }
.not-allowed { cursor: not-allowed; }
.grab { cursor: grab; }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }
.demo { margin: 20px 0; }
label { display: block; margin-bottom: 5px; font-weight: bold; }

/* Resize */
.resize-both {
  resize: both;
  overflow: auto;
  width: 200px;
  height: 100px;
  border: 1px solid #ccc;
  padding: 10px;
}

.resize-vertical {
  resize: vertical;
  overflow: auto;
}

/* Outline offset */
.outline-demo:focus {
  outline: 3px solid #3498db;
  outline-offset: 5px;
}

/* Caret color */
.caret-demo {
  caret-color: #e74c3c;
  font-size: 18px;
  padding: 10px;
}

/* Cursor types */
.cursor-demo {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.cursor-demo span {
  padding: 15px 25px;
  background: #f5f5f5;
  border-radius: 5px;
}
.cursor-demo .default { cursor: default; }
.cursor-demo .pointer { cursor: pointer; }
.cursor-demo .wait { cursor: wait; }
.cursor-demo .text { cursor: text; }
.cursor-demo .move { cursor: move; }
.cursor-demo .not-allowed { cursor: not-allowed; }
.cursor-demo .grab { cursor: grab; }
.cursor-demo .crosshair { cursor: crosshair; }
.cursor-demo .help { cursor: help; }
.cursor-demo .zoom-in { cursor: zoom-in; }

input, textarea {
  padding: 10px;
  font-size: 16px;
  width: 100%;
  max-width: 300px;
  box-sizing: border-box;
}
</style>
</head>
<body>

<h1>CSS User Interface</h1>

<div class="demo">
  <label>resize: both</label>
  <div class="resize-both">Drag corner to resize me!</div>
</div>

<div class="demo">
  <label>resize: vertical (textarea)</label>
  <textarea class="resize-vertical" rows="3">Resize vertically only</textarea>
</div>

<div class="demo">
  <label>outline-offset: 5px (click to focus)</label>
  <input type="text" class="outline-demo" placeholder="Focus me!">
</div>

<div class="demo">
  <label>caret-color: red</label>
  <input type="text" class="caret-demo" placeholder="Type here...">
</div>

<div class="demo">
  <label>Cursor Types (hover each)</label>
  <div class="cursor-demo">
    <span class="default">default</span>
    <span class="pointer">pointer</span>
    <span class="wait">wait</span>
    <span class="text">text</span>
    <span class="move">move</span>
    <span class="not-allowed">not-allowed</span>
    <span class="grab">grab</span>
    <span class="crosshair">crosshair</span>
    <span class="help">help</span>
    <span class="zoom-in">zoom-in</span>
  </div>
</div>

</body>
</html>`,
    },
    '@property': {
      title: 'CSS @property',
      content: `
# CSS @property Rule

Register custom properties with type checking and defaults.

## Syntax

<pre><code class="css">
@property --my-color {
  syntax: '&lt;color&gt;';
  inherits: false;
  initial-value: blue;
}
</code></pre>

## Supported Types

- <code><color></code>
- <code><length></code>
- <code><percentage></code>
- <code><number></code>
- <code><integer></code>
- <code><angle></code>
- <code><time></code>
- <code><custom-ident></code>

## Benefits

- Type-safe custom properties
- Animate custom properties
- Define fallback values
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Define custom properties with types */
@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@property --box-size {
  syntax: '<length>';
  inherits: false;
  initial-value: 100px;
}

@property --main-color {
  syntax: '<color>';
  inherits: false;
  initial-value: #3498db;
}

/* Use the properties */
.animated-gradient {
  width: 200px;
  height: 200px;
  background: linear-gradient(var(--gradient-angle), #3498db, #e74c3c);
  transition: --gradient-angle 1s;
  border-radius: 10px;
  margin: 20px;
}

.animated-gradient:hover {
  --gradient-angle: 180deg;
}

.animated-box {
  width: var(--box-size);
  height: var(--box-size);
  background: var(--main-color);
  transition: --box-size 0.5s, --main-color 0.5s;
  border-radius: 10px;
  margin: 20px;
}

.animated-box:hover {
  --box-size: 150px;
  --main-color: #e74c3c;
}

body { font-family: Arial; padding: 20px; }
h2 { margin-top: 30px; }
p { color: #666; }
</style>
</head>
<body>

<h1>CSS @property</h1>
<p>@property allows animating custom properties!</p>

<h2>Animated Gradient Angle</h2>
<p>Hover to rotate gradient (0deg → 180deg)</p>
<div class="animated-gradient"></div>

<h2>Animated Size & Color</h2>
<p>Hover to grow and change color</p>
<div class="animated-box"></div>

<h2>Browser Support</h2>
<p>@property is supported in Chrome, Edge, and Safari 15.4+</p>

</body>
</html>`,
    },
    'mq-examples': {
      title: 'Media Query Examples',
      content: `
# Media Query Examples

Practical responsive design patterns.

## Common Breakpoints

<pre><code class="css">
/* Mobile first approach */
/* Default: mobile styles */

/* Tablets */
@media (min-width: 768px) { }

/* Laptops */
@media (min-width: 1024px) { }

/* Desktops */
@media (min-width: 1200px) { }

/* Large screens */
@media (min-width: 1440px) { }
</code></pre>

## Orientation

<pre><code class="css">
@media (orientation: portrait) { }
@media (orientation: landscape) { }
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; margin: 0; padding: 20px; }

/* Responsive container */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Responsive cards */
.cards {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr; /* Mobile: 1 column */
}

@media (min-width: 576px) {
  .cards { grid-template-columns: repeat(2, 1fr); } /* Tablet: 2 columns */
}

@media (min-width: 992px) {
  .cards { grid-template-columns: repeat(3, 1fr); } /* Desktop: 3 columns */
}

@media (min-width: 1200px) {
  .cards { grid-template-columns: repeat(4, 1fr); } /* Large: 4 columns */
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Responsive navigation */
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #2c3e50;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 10px;
  text-align: center;
}

@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: center;
  }
}

/* Breakpoint indicator */
.breakpoint {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #e74c3c;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: bold;
}

.breakpoint::after { content: 'Mobile'; }

@media (min-width: 576px) {
  .breakpoint { background: #f39c12; }
  .breakpoint::after { content: 'Tablet (576px+)'; }
}

@media (min-width: 992px) {
  .breakpoint { background: #27ae60; }
  .breakpoint::after { content: 'Desktop (992px+)'; }
}

@media (min-width: 1200px) {
  .breakpoint { background: #3498db; }
  .breakpoint::after { content: 'Large (1200px+)'; }
}
</style>
</head>
<body>

<div class="container">
  <h1>Responsive Media Queries</h1>
  <p>Resize the browser to see breakpoints change!</p>
  
  <nav class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Contact</a>
  </nav>
  
  <div class="cards">
    <div class="card"><h3>Card 1</h3><p>Responsive grid</p></div>
    <div class="card"><h3>Card 2</h3><p>Changes columns</p></div>
    <div class="card"><h3>Card 3</h3><p>At breakpoints</p></div>
    <div class="card"><h3>Card 4</h3><p>Mobile first!</p></div>
  </div>
</div>

<div class="breakpoint"></div>

</body>
</html>`,
    },
    '@supports': {
      title: 'CSS @supports',
      content: `
# CSS @supports (Feature Queries)

Test for CSS feature support before using it.

## Syntax

<pre><code class="css">
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
</code></pre>

## Operators

<pre><code class="css">
/* AND */
@supports (display: grid) and (gap: 20px) { }

/* OR */
@supports (display: flex) or (display: grid) { }

/* NOT */
@supports not (display: grid) { }
</code></pre>

## Use Cases

- Progressive enhancement
- Fallback styles
- New CSS features
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.demo-box {
  padding: 20px;
  margin: 20px 0;
  border-radius: 10px;
}

/* Test Grid support */
.grid-test {
  background: #e74c3c;
  color: white;
}
.grid-test::after {
  content: '❌ CSS Grid NOT supported';
}

@supports (display: grid) {
  .grid-test {
    background: #27ae60;
  }
  .grid-test::after {
    content: '✅ CSS Grid IS supported!';
  }
}

/* Test backdrop-filter */
.backdrop-test {
  background: rgba(52, 152, 219, 0.8);
  color: white;
}
.backdrop-test::after {
  content: '❌ backdrop-filter NOT supported';
}

@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .backdrop-test {
    background: rgba(52, 152, 219, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  .backdrop-test::after {
    content: '✅ backdrop-filter IS supported!';
  }
}

/* Test aspect-ratio */
.aspect-test {
  background: #9b59b6;
  color: white;
}
.aspect-test::after {
  content: '❌ aspect-ratio NOT supported';
}

@supports (aspect-ratio: 16/9) {
  .aspect-test {
    background: #2ecc71;
  }
  .aspect-test::after {
    content: '✅ aspect-ratio IS supported!';
  }
}

/* Test container queries */
.container-test {
  background: #f39c12;
  color: white;
}
.container-test::after {
  content: '❌ Container Queries NOT supported';
}

@supports (container-type: inline-size) {
  .container-test {
    background: #1abc9c;
  }
  .container-test::after {
    content: '✅ Container Queries ARE supported!';
  }
}

h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>CSS @supports (Feature Queries)</h1>
<p>Detect CSS feature support in your browser:</p>

<h2>CSS Grid</h2>
<div class="demo-box grid-test"></div>

<h2>backdrop-filter</h2>
<div class="demo-box backdrop-test"></div>

<h2>aspect-ratio</h2>
<div class="demo-box aspect-test"></div>

<h2>Container Queries</h2>
<div class="demo-box container-test"></div>

<h2>How It Works</h2>
<pre style="background:#f5f5f5; padding:15px; border-radius:5px;">
@supports (display: grid) {
  /* Styles for browsers that support grid */
}

@supports not (display: grid) {
  /* Fallback for older browsers */
}
</pre>

</body>
</html>`,
    },
    'sass-tutorial': {
      title: 'SASS Tutorial',
      content: `
# SASS/SCSS Tutorial

SASS is a CSS preprocessor that adds powerful features.

## What is SASS?

- **S**yntactically **A**wesome **S**tyle**s**heets
- CSS extension language
- Compiles to regular CSS
- Two syntaxes: SASS and SCSS

## SCSS vs SASS

<pre><code class="scss">
// SCSS (Sassy CSS) - uses braces
.button {
  color: blue;
  &amp;:hover {
    color: red;
  }
}
</code></pre>

<pre><code class="sass">
// SASS (indented) - no braces
.button
  color: blue
  &amp;:hover
    color: red
</code></pre>

## Key Features

1. Variables
2. Nesting
3. Mixins
4. Functions
5. Partials & Imports
6. Inheritance
7. Operators
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* This is compiled CSS from SCSS */
/* Original SCSS would look like:

$primary: #3498db;
$secondary: #2ecc71;

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  
  .title {
    color: $primary;
    margin-bottom: 10px;
  }
  
  .content {
    color: #666;
  }
  
  &:hover {
    transform: translateY(-5px);
  }
}
*/

/* Compiled CSS: */
.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.card .title {
  color: #3498db;
  margin-bottom: 10px;
  font-size: 24px;
}

.card .content {
  color: #666;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 10px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-secondary {
  background: #2ecc71;
  color: white;
}

body { font-family: Arial; padding: 20px; background: #f5f5f5; }
</style>
</head>
<body>

<h1>SASS/SCSS Example</h1>
<p>This CSS was conceptually written in SCSS</p>

<div class="card">
  <div class="title">Card Title</div>
  <div class="content">
    This card uses SCSS features like:
    <ul>
      <li>Variables ($primary, $secondary)</li>
      <li>Nesting (.card .title)</li>
      <li>Parent selector (&:hover)</li>
    </ul>
  </div>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
</div>

</body>
</html>`,
    },
    'sass-variables': {
      title: 'SASS Variables',
      content: `
# SASS Variables

Store reusable values in variables.

## Syntax

<pre><code class="scss">
// Define variables
$primary-color: #3498db;
$font-stack: Arial, sans-serif;
$spacing: 20px;

// Use variables
body {
  font-family: $font-stack;
  padding: $spacing;
}

.button {
  background: $primary-color;
  padding: $spacing / 2;
}
</code></pre>

## Variable Scope

<pre><code class="scss">
$color: blue; // Global

.element {
  $color: red; // Local
  color: $color; // red
}
</code></pre>

## Default Values

<pre><code class="scss">
$color: blue !default;
// Only sets if not already defined
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* 
SCSS Variables (conceptual):

$primary: #3498db;
$secondary: #e74c3c;
$success: #2ecc71;
$warning: #f39c12;
$dark: #2c3e50;
$light: #ecf0f1;

$font-main: 'Segoe UI', sans-serif;
$font-code: 'Courier New', monospace;

$spacing-sm: 10px;
$spacing-md: 20px;
$spacing-lg: 40px;

$radius: 8px;
$shadow: 0 2px 10px rgba(0,0,0,0.1);
*/

/* Compiled CSS using those variables: */
body {
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
  background: #ecf0f1;
  color: #2c3e50;
}

.box {
  background: white;
  padding: 20px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.text-primary { color: #3498db; }
.text-secondary { color: #e74c3c; }
.text-success { color: #2ecc71; }
.text-warning { color: #f39c12; }

.bg-primary { background: #3498db; color: white; }
.bg-secondary { background: #e74c3c; color: white; }
.bg-success { background: #2ecc71; color: white; }
.bg-warning { background: #f39c12; color: white; }

.btn {
  display: inline-block;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  margin: 5px;
  cursor: pointer;
}

code {
  font-family: 'Courier New', monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
}

h2 { margin-top: 40px; }
</style>
</head>
<body>

<h1>SASS Variables</h1>

<div class="box">
  <h2>Color Variables</h2>
  <p class="text-primary">$primary: #3498db</p>
  <p class="text-secondary">$secondary: #e74c3c</p>
  <p class="text-success">$success: #2ecc71</p>
  <p class="text-warning">$warning: #f39c12</p>
</div>

<div class="box">
  <h2>Background Colors</h2>
  <span class="btn bg-primary">Primary</span>
  <span class="btn bg-secondary">Secondary</span>
  <span class="btn bg-success">Success</span>
  <span class="btn bg-warning">Warning</span>
</div>

<div class="box">
  <h2>Other Variables</h2>
  <p><code>$spacing-md: 20px</code> - Used for padding</p>
  <p><code>$radius: 8px</code> - Used for border-radius</p>
  <p><code>$shadow</code> - Used for box-shadow</p>
</div>

</body>
</html>`,
    },
    'sass-nesting': {
      title: 'SASS Nesting',
      content: `
# SASS Nesting

Nest selectors for cleaner code.

## Basic Nesting

<pre><code class="scss">
nav {
  background: #333;
  
  ul {
    list-style: none;
    
    li {
      display: inline-block;
      
      a {
        color: white;
        padding: 10px;
      }
    }
  }
}
</code></pre>

## Parent Selector (&)

<pre><code class="scss">
.button {
  background: blue;
  
  &amp;:hover {
    background: darkblue;
  }
  
  &amp;.active {
    background: green;
  }
  
  &amp;-large {
    font-size: 20px;
  }
}
</code></pre>

## Property Nesting

<pre><code class="scss">
.box {
  font: {
    family: Arial;
    size: 16px;
    weight: bold;
  }
  border: {
    width: 1px;
    style: solid;
    color: #ccc;
  }
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/*
SCSS with nesting:

nav {
  background: #2c3e50;
  padding: 0;
  
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    
    li {
      a {
        display: block;
        color: white;
        padding: 15px 20px;
        text-decoration: none;
        
        &:hover {
          background: #34495e;
        }
      }
      
      &.active a {
        background: #3498db;
      }
    }
  }
}

.card {
  background: white;
  border-radius: 10px;
  
  &-header {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  &-body {
    padding: 20px;
  }
  
  &:hover {
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  }
}
*/

/* Compiled CSS: */
nav {
  background: #2c3e50;
  padding: 0;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

nav ul li a {
  display: block;
  color: white;
  padding: 15px 20px;
  text-decoration: none;
  transition: background 0.3s;
}

nav ul li a:hover {
  background: #34495e;
}

nav ul li.active a {
  background: #3498db;
}

.card {
  background: white;
  border-radius: 10px;
  margin: 20px;
  transition: box-shadow 0.3s;
}

.card-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.card-body {
  padding: 20px;
}

.card:hover {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

body { font-family: Arial; margin: 0; background: #f5f5f5; }
h1 { padding: 20px; }
</style>
</head>
<body>

<nav>
  <ul>
    <li class="active"><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Services</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>

<h1>SASS Nesting</h1>

<div class="card">
  <div class="card-header">Card Title</div>
  <div class="card-body">
    <p>This card uses BEM-style naming with SASS nesting:</p>
    <ul>
      <li>.card</li>
      <li>.card-header (using &-header)</li>
      <li>.card-body (using &-body)</li>
      <li>:hover (using &:hover)</li>
    </ul>
  </div>
</div>

</body>
</html>`,
    },
    'sass-mixins': {
      title: 'SASS Mixins',
      content: `
# SASS Mixins

Reusable groups of CSS declarations.

## Basic Mixin

<pre><code class="scss">
@mixin reset-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul {
  @include reset-list;
}
</code></pre>

## Mixin with Arguments

<pre><code class="scss">
@mixin button($color) {
  background: $color;
  padding: 10px 20px;
  border: none;
  color: white;
  
  &amp;:hover {
    background: darken($color, 10%);
  }
}

.btn-primary {
  @include button(#3498db);
}

.btn-danger {
  @include button(#e74c3c);
}
</code></pre>

## Default Arguments

<pre><code class="scss">
@mixin shadow($x: 0, $y: 2px, $blur: 10px, $color: rgba(0,0,0,0.1)) {
  box-shadow: $x $y $blur $color;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/*
SCSS Mixins:

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin button($bg, $text: white) {
  background: $bg;
  color: $text;
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    filter: brightness(110%);
    transform: translateY(-2px);
  }
}

@mixin card($padding: 20px) {
  background: white;
  padding: $padding;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
*/

/* Compiled CSS: */
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
  display: inline-block;
  margin: 5px;
}

.btn:hover {
  filter: brightness(110%);
  transform: translateY(-2px);
}

.btn-primary { background: #3498db; }
.btn-secondary { background: #9b59b6; }
.btn-success { background: #2ecc71; }
.btn-danger { background: #e74c3c; }
.btn-warning { background: #f39c12; }

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.card-compact {
  background: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

body { font-family: Arial; padding: 20px; background: #f5f5f5; }
h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>SASS Mixins</h1>

<div class="card">
  <h2>@mixin button($bg)</h2>
  <p>Buttons generated from a single mixin:</p>
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-success">Success</button>
  <button class="btn btn-danger">Danger</button>
  <button class="btn btn-warning">Warning</button>
</div>

<div class="card">
  <h2>@mixin card($padding)</h2>
  <p>This card uses the card mixin with default padding.</p>
  <div class="card-compact" style="margin:10px 0;">
    <p style="margin:0;">Compact card with $padding: 10px</p>
  </div>
</div>

<div class="card">
  <h2>Benefits of Mixins</h2>
  <ul>
    <li>Reusable code blocks</li>
    <li>Accept arguments for customization</li>
    <li>Default values for optional params</li>
    <li>DRY (Don't Repeat Yourself)</li>
  </ul>
</div>

</body>
</html>`,
    },
    frameworks: {
      title: 'CSS Frameworks',
      content: `
# CSS Frameworks

Popular CSS frameworks for rapid development.

## Popular Frameworks

### Bootstrap
- Most popular CSS framework
- Responsive grid system
- Pre-built components
- <code>npm install bootstrap</code>

### Tailwind CSS
- Utility-first framework
- Highly customizable
- JIT compilation
- <code>npm install tailwindcss</code>

### Foundation
- Enterprise-grade
- Flexible grid
- Accessibility focused

### Bulma
- Pure CSS (no JS)
- Flexbox-based
- Modern syntax

## Pros & Cons

**Pros:**
- Faster development
- Consistent design
- Responsive built-in
- Community support

**Cons:**
- Learning curve
- Larger file sizes
- Generic look
- Override complexity
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
/* Mini framework demo */
* { box-sizing: border-box; }
body { font-family: Arial; margin: 0; padding: 20px; }

/* Grid System */
.container { max-width: 1200px; margin: 0 auto; }
.row { display: flex; flex-wrap: wrap; margin: -10px; }
.col { padding: 10px; flex: 1; }
.col-4 { flex: 0 0 33.333%; }
.col-6 { flex: 0 0 50%; }
.col-12 { flex: 0 0 100%; }

/* Buttons */
.btn {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  text-decoration: none;
  text-align: center;
}
.btn-primary { background: #007bff; color: white; }
.btn-success { background: #28a745; color: white; }
.btn-danger { background: #dc3545; color: white; }

/* Cards */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin: 10px 0;
}
.card-header { padding: 15px; border-bottom: 1px solid #eee; font-weight: bold; }
.card-body { padding: 20px; }

/* Alerts */
.alert {
  padding: 15px;
  border-radius: 5px;
  margin: 10px 0;
}
.alert-info { background: #e3f2fd; color: #0d47a1; }
.alert-success { background: #e8f5e9; color: #1b5e20; }
.alert-warning { background: #fff3e0; color: #e65100; }

/* Badges */
.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.badge-primary { background: #007bff; color: white; }

/* Utility */
.text-center { text-align: center; }
.mt-3 { margin-top: 20px; }
.p-3 { padding: 20px; }
.bg-light { background: #f8f9fa; }
</style>
</head>
<body>

<div class="container">
  <h1>Mini CSS Framework Demo</h1>
  <p>This demonstrates common framework patterns</p>
  
  <div class="alert alert-info">
    <strong>ℹ️ Info:</strong> This is a mini framework example!
  </div>
  
  <h2>Grid System</h2>
  <div class="row">
    <div class="col-4"><div class="p-3 bg-light">.col-4</div></div>
    <div class="col-4"><div class="p-3 bg-light">.col-4</div></div>
    <div class="col-4"><div class="p-3 bg-light">.col-4</div></div>
  </div>
  
  <h2 class="mt-3">Components</h2>
  <div class="row">
    <div class="col-6">
      <div class="card">
        <div class="card-header">Card Title <span class="badge badge-primary">New</span></div>
        <div class="card-body">
          <p>Card content goes here.</p>
          <button class="btn btn-primary">Action</button>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
        <div class="card-header">Buttons</div>
        <div class="card-body">
          <button class="btn btn-primary">Primary</button>
          <button class="btn btn-success">Success</button>
          <button class="btn btn-danger">Danger</button>
        </div>
      </div>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    templates: {
      title: 'CSS Templates',
      content: `
# CSS Templates

Pre-built layouts and design patterns.

## Common Templates

### Landing Page
- Hero section
- Features grid
- Testimonials
- CTA sections
- Footer

### Dashboard
- Sidebar navigation
- Top navbar
- Cards grid
- Data tables
- Charts area

### Blog
- Header/nav
- Post list
- Sidebar
- Pagination
- Footer

### E-commerce
- Product grid
- Filters sidebar
- Cart modal
- Product cards

## Where to Find Templates

1. **Free:**
   - HTML5 UP
   - Start Bootstrap
   - Templated.co
   - Creative Tim

2. **Premium:**
   - ThemeForest
   - TemplateMonster
   - Envato Elements
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; }

/* Header */
header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

header h1 { font-size: 48px; margin-bottom: 20px; }
header p { font-size: 20px; opacity: 0.9; max-width: 600px; margin: 0 auto 30px; }

.btn-hero {
  background: white;
  color: #667eea;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  cursor: pointer;
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature {
  text-align: center;
  padding: 30px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature h3 { margin-bottom: 10px; color: #333; }
.feature p { color: #666; line-height: 1.6; }

/* CTA */
.cta {
  background: #f8f9fa;
  padding: 60px 20px;
  text-align: center;
}

.cta h2 { margin-bottom: 20px; color: #333; }

.btn-cta {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 15px 40px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
}

/* Footer */
footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px;
  text-align: center;
}

footer p { opacity: 0.7; }
</style>
</head>
<body>

<header>
  <h1>Landing Page Template</h1>
  <p>A beautiful, responsive landing page template built with pure CSS.</p>
  <button class="btn-hero">Get Started</button>
</header>

<section class="features">
  <div class="feature">
    <div class="feature-icon">🚀</div>
    <h3>Fast Performance</h3>
    <p>Optimized for speed with minimal CSS footprint.</p>
  </div>
  <div class="feature">
    <div class="feature-icon">📱</div>
    <h3>Fully Responsive</h3>
    <p>Looks great on all devices and screen sizes.</p>
  </div>
  <div class="feature">
    <div class="feature-icon">🎨</div>
    <h3>Easy to Customize</h3>
    <p>Simple CSS that's easy to modify and extend.</p>
  </div>
</section>

<section class="cta">
  <h2>Ready to Start?</h2>
  <p style="color:#666; margin-bottom:20px;">Join thousands of happy customers today.</p>
  <button class="btn-cta">Sign Up Free</button>
</section>

<footer>
  <p>© 2025 VerTechie. All rights reserved.</p>
</footer>

</body>
</html>`,
    },
    'box-sizing': {
      title: 'CSS Box Sizing',
      content: `
# CSS Box Sizing

The <code>box-sizing</code> property controls how element dimensions are calculated.

## The Problem

By default, width and height don't include padding and border:

<pre><code class="css">
/* Default: content-box */
.box {
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/* Actual width: 200 + 40 + 10 = 250px */
</code></pre>

## The Solution: border-box

<pre><code class="css">
.box {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
/* Actual width: 200px (padding and border included) */
</code></pre>

## Universal Box Sizing Reset

<pre><code class="css">
*, *::before, *::after {
  box-sizing: border-box;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }

.comparison {
  display: flex;
  gap: 30px;
  margin: 20px 0;
}

.box {
  width: 200px;
  padding: 20px;
  border: 5px solid #3498db;
  background: #ecf0f1;
}

.content-box {
  box-sizing: content-box;
}

.border-box {
  box-sizing: border-box;
}

.label {
  background: #3498db;
  color: white;
  padding: 5px 10px;
  margin-bottom: 10px;
  font-size: 14px;
}

/* Practical example */
.form-row {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.form-row input {
  box-sizing: border-box;
  width: 50%;
  padding: 15px;
  border: 2px solid #3498db;
  border-radius: 5px;
}

code { background: #f5f5f5; padding: 2px 6px; }
</style>
</head>
<body>

<h1>CSS Box Sizing</h1>

<h2>Comparison: Both boxes have width: 200px</h2>
<div class="comparison">
  <div>
    <div class="label">content-box (default)</div>
    <div class="box content-box">
      Actual width: 250px<br>
      (200 + 40 + 10)
    </div>
  </div>
  <div>
    <div class="label">border-box</div>
    <div class="box border-box">
      Actual width: 200px<br>
      (as specified)
    </div>
  </div>
</div>

<h2>Practical: Two 50% Inputs</h2>
<p>With <code>box-sizing: border-box</code>, they fit perfectly:</p>
<div class="form-row">
  <input type="text" placeholder="First Name">
  <input type="text" placeholder="Last Name">
</div>

</body>
</html>`,
    },
    'grid-12-column': {
      title: 'Grid 12-Column Layout',
      content: `
# 12-Column Grid Layout

A 12-column grid system like Bootstrap, built with CSS Grid.

## Why 12 Columns?

12 is divisible by 2, 3, 4, and 6, making it flexible for layouts.

## CSS Grid Implementation

<pre><code class="css">
.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

.col-6 { grid-column: span 6; }  /* Half */
.col-4 { grid-column: span 4; }  /* Third */
.col-3 { grid-column: span 3; }  /* Quarter */
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; }

.row {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 15px;
  margin: 15px 0;
}

/* Column classes */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-5 { grid-column: span 5; }
.col-6 { grid-column: span 6; }
.col-7 { grid-column: span 7; }
.col-8 { grid-column: span 8; }
.col-9 { grid-column: span 9; }
.col-10 { grid-column: span 10; }
.col-11 { grid-column: span 11; }
.col-12 { grid-column: span 12; }

.box {
  background: #3498db;
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 5px;
}

.alt { background: #2ecc71; }

h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>12-Column Grid System</h1>

<h2>Full Width (12 columns)</h2>
<div class="row">
  <div class="col-12 box">col-12</div>
</div>

<h2>Two Halves (6 + 6)</h2>
<div class="row">
  <div class="col-6 box">col-6</div>
  <div class="col-6 box alt">col-6</div>
</div>

<h2>Three Thirds (4 + 4 + 4)</h2>
<div class="row">
  <div class="col-4 box">col-4</div>
  <div class="col-4 box alt">col-4</div>
  <div class="col-4 box">col-4</div>
</div>

<h2>Four Quarters (3 + 3 + 3 + 3)</h2>
<div class="row">
  <div class="col-3 box">col-3</div>
  <div class="col-3 box alt">col-3</div>
  <div class="col-3 box">col-3</div>
  <div class="col-3 box alt">col-3</div>
</div>

<h2>Sidebar Layout (3 + 9)</h2>
<div class="row">
  <div class="col-3 box">Sidebar</div>
  <div class="col-9 box alt">Main Content</div>
</div>

<h2>Complex Layout (2 + 5 + 5)</h2>
<div class="row">
  <div class="col-2 box">col-2</div>
  <div class="col-5 box alt">col-5</div>
  <div class="col-5 box">col-5</div>
</div>

</body>
</html>`,
    },
    'rwd-viewport': {
      title: 'RWD Viewport',
      content: `
# Responsive Viewport

The viewport meta tag controls how your page is displayed on mobile devices.

## The Viewport Meta Tag

<pre><code class="html">
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
</code></pre>

## Properties

- **width=device-width**: Match device width
- **initial-scale=1.0**: Initial zoom level
- **maximum-scale=1.0**: Max zoom (not recommended)
- **user-scalable=no**: Disable zoom (not recommended)

## Without Viewport

Without the viewport tag, mobile browsers render pages at desktop width (~980px) and then scale down.

## With Viewport

With the viewport tag, the page width matches the device width, enabling proper responsive design.
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { 
  font-family: Arial; 
  padding: 20px; 
  margin: 0;
}

.info-box {
  background: #3498db;
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
}

.code-box {
  background: #2c3e50;
  color: #2ecc71;
  padding: 15px;
  border-radius: 5px;
  font-family: monospace;
  overflow-x: auto;
}

.warning {
  background: #e74c3c;
}

.success {
  background: #2ecc71;
}

/* Responsive test */
.responsive-box {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 30px;
  text-align: center;
  border-radius: 10px;
}

.responsive-box h2 {
  margin: 0 0 10px;
}
</style>
</head>
<body>

<h1>Viewport Meta Tag</h1>

<div class="info-box success">
  ✅ This page has the viewport tag set correctly!
</div>

<div class="code-box">
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
</div>

<h2>What It Does</h2>
<ul>
  <li><strong>width=device-width</strong> - Sets viewport width to device width</li>
  <li><strong>initial-scale=1.0</strong> - Sets initial zoom to 100%</li>
</ul>

<div class="info-box warning">
  ⚠️ Without viewport tag, mobile browsers assume a 980px wide page!
</div>

<h2>Responsive Test</h2>
<div class="responsive-box">
  <h2>Resize Your Browser</h2>
  <p>This box takes full width thanks to the viewport tag.</p>
</div>

</body>
</html>`,
    },
    'rwd-grid-view': {
      title: 'RWD Grid View',
      content: `
# Responsive Grid View

Build a fluid grid that adapts to any screen size.

## Mobile-First Grid

<pre><code class="css">
/* Mobile: stack vertically */
.col {
  width: 100%;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .col-6 { width: 50%; }
}

/* Desktop: flexible */
@media (min-width: 992px) {
  .col-4 { width: 33.33%; }
  .col-3 { width: 25%; }
}
</code></pre>

## Modern CSS Grid Approach

<pre><code class="css">
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; margin: 0; }

/* Modern auto-fit grid */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.card-icon { font-size: 40px; margin-bottom: 10px; }
.card h3 { margin: 0 0 10px; color: #2c3e50; }
.card p { color: #666; margin: 0; font-size: 14px; }

/* Traditional responsive grid */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: -10px;
}

.col {
  padding: 10px;
  width: 100%;
}

@media (min-width: 576px) {
  .col-sm-6 { width: 50%; }
}

@media (min-width: 768px) {
  .col-md-4 { width: 33.33%; }
}

@media (min-width: 992px) {
  .col-lg-3 { width: 25%; }
}

.box {
  background: #3498db;
  color: white;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
}

h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>Responsive Grid Views</h1>

<h2>Auto-fit Grid (Modern CSS Grid)</h2>
<p>Cards automatically wrap based on available space</p>
<div class="auto-grid">
  <div class="card">
    <div class="card-icon">🚀</div>
    <h3>Fast</h3>
    <p>Lightning fast performance</p>
  </div>
  <div class="card">
    <div class="card-icon">📱</div>
    <h3>Responsive</h3>
    <p>Works on all devices</p>
  </div>
  <div class="card">
    <div class="card-icon">🎨</div>
    <h3>Beautiful</h3>
    <p>Modern design</p>
  </div>
  <div class="card">
    <div class="card-icon">⚡</div>
    <h3>Easy</h3>
    <p>Simple to customize</p>
  </div>
</div>

<h2>Traditional Breakpoint Grid</h2>
<p>Resize browser to see columns change</p>
<div class="row">
  <div class="col col-sm-6 col-md-4 col-lg-3">
    <div class="box">1</div>
  </div>
  <div class="col col-sm-6 col-md-4 col-lg-3">
    <div class="box">2</div>
  </div>
  <div class="col col-sm-6 col-md-4 col-lg-3">
    <div class="box">3</div>
  </div>
  <div class="col col-sm-6 col-md-4 col-lg-3">
    <div class="box">4</div>
  </div>
</div>

</body>
</html>`,
    },
    'rwd-media-queries': {
      title: 'RWD Media Queries',
      content: `
# Responsive Media Queries

Apply different styles based on screen size.

## Syntax

<pre><code class="css">
@media (condition) {
  /* styles */
}
</code></pre>

## Common Breakpoints

<pre><code class="css">
/* Extra small (phones) */
@media (max-width: 575px) { }

/* Small (landscape phones) */
@media (min-width: 576px) { }

/* Medium (tablets) */
@media (min-width: 768px) { }

/* Large (desktops) */
@media (min-width: 992px) { }

/* Extra large */
@media (min-width: 1200px) { }
</code></pre>

## Mobile-First Approach

Start with mobile styles, then add larger screens:

<pre><code class="css">
/* Base (mobile) styles */
.nav { flex-direction: column; }

/* Tablet and up */
@media (min-width: 768px) {
  .nav { flex-direction: row; }
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; margin: 0; padding: 20px; }

/* Base (mobile) styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.nav {
  display: flex;
  flex-direction: column;
  background: #2c3e50;
  border-radius: 10px;
  overflow: hidden;
}

.nav a {
  color: white;
  padding: 15px 20px;
  text-decoration: none;
  text-align: center;
  border-bottom: 1px solid #34495e;
}

.nav a:last-child { border-bottom: none; }
.nav a:hover { background: #34495e; }

/* Responsive indicator */
.indicator {
  padding: 20px;
  text-align: center;
  border-radius: 10px;
  margin: 20px 0;
  font-size: 24px;
  font-weight: bold;
}

.indicator { background: #e74c3c; color: white; }
.indicator::after { content: "📱 Mobile (< 576px)"; }

/* Small devices (≥576px) */
@media (min-width: 576px) {
  .indicator { background: #f39c12; }
  .indicator::after { content: "📱 Small (≥576px)"; }
}

/* Medium devices (≥768px) */
@media (min-width: 768px) {
  .nav {
    flex-direction: row;
    justify-content: center;
  }
  .nav a { border-bottom: none; }
  
  .indicator { background: #27ae60; }
  .indicator::after { content: "📱 Tablet (≥768px)"; }
}

/* Large devices (≥992px) */
@media (min-width: 992px) {
  .indicator { background: #3498db; }
  .indicator::after { content: "💻 Desktop (≥992px)"; }
}

/* Extra large (≥1200px) */
@media (min-width: 1200px) {
  .indicator { background: #9b59b6; }
  .indicator::after { content: "🖥️ Large Desktop (≥1200px)"; }
}
</style>
</head>
<body>

<div class="container">
  <h1>Media Queries Demo</h1>
  
  <div class="indicator"></div>
  
  <h2>Responsive Navigation</h2>
  <nav class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Portfolio</a>
    <a href="#">Contact</a>
  </nav>
  
  <p style="margin-top:20px;color:#666;">
    Resize your browser window to see the breakpoints change!
  </p>
</div>

</body>
</html>`,
    },
    'rwd-images': {
      title: 'RWD Images',
      content: `
# Responsive Images

Make images adapt to different screen sizes.

## Basic Responsive Image

<pre><code class="css">
img {
  max-width: 100%;
  height: auto;
}
</code></pre>

## HTML Picture Element

<pre><code class="html">
&lt;picture&gt;
  &lt;source media="(min-width: 800px)" srcset="large.jpg"&gt;
  &lt;source media="(min-width: 400px)" srcset="medium.jpg"&gt;
  &lt;img src="small.jpg" alt="Description"&gt;
&lt;/picture&gt;
</code></pre>

## Object-fit for Containers

<pre><code class="css">
.image-container img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</code></pre>

## Lazy Loading

<pre><code class="html">
&lt;img src="image.jpg" loading="lazy" alt="Description"&gt;
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; margin: 0; }

/* Basic responsive image */
.responsive-img {
  max-width: 100%;
  height: auto;
  display: block;
  border-radius: 10px;
}

/* Fixed height with object-fit */
.image-container {
  margin: 20px 0;
}

.cover-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

/* Responsive image grid */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.image-grid img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s;
}

.image-grid img:hover {
  transform: scale(1.05);
}

/* Background image responsive */
.hero {
  background-image: url('https://picsum.photos/1200/400');
  background-size: cover;
  background-position: center;
  height: 200px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

h2 { margin-top: 30px; }
</style>
</head>
<body>

<h1>Responsive Images</h1>

<h2>Basic Responsive Image</h2>
<p>Scales down on small screens, never exceeds original size</p>
<img src="https://picsum.photos/800/400" alt="Responsive" class="responsive-img">

<h2>Fixed Height with object-fit: cover</h2>
<p>Image fills container while maintaining aspect ratio</p>
<div class="image-container">
  <img src="https://picsum.photos/800/600" alt="Cover" class="cover-img">
</div>

<h2>Responsive Image Grid</h2>
<div class="image-grid">
  <img src="https://picsum.photos/300/300?1" alt="1" loading="lazy">
  <img src="https://picsum.photos/300/300?2" alt="2" loading="lazy">
  <img src="https://picsum.photos/300/300?3" alt="3" loading="lazy">
  <img src="https://picsum.photos/300/300?4" alt="4" loading="lazy">
</div>

<h2>Background Image Hero</h2>
<div class="hero">
  <h2 style="margin:0;">Responsive Background</h2>
</div>

</body>
</html>`,
    },
    'rwd-videos': {
      title: 'RWD Videos',
      content: `
# Responsive Videos

Make videos adapt to any screen size.

## Basic Responsive Video

<pre><code class="css">
video {
  max-width: 100%;
  height: auto;
}
</code></pre>

## Responsive iframe (YouTube/Vimeo)

<pre><code class="css">
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 ratio */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</code></pre>

## Modern Aspect Ratio

<pre><code class="css">
.video-container {
  aspect-ratio: 16 / 9;
}

.video-container iframe {
  width: 100%;
  height: 100%;
}
</code></pre>
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; margin: 0; }

/* Basic responsive video */
video {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

/* Responsive iframe container (classic) */
.video-container-classic {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  background: #000;
  margin: 20px 0;
}

.video-container-classic iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

/* Modern aspect-ratio approach */
.video-container-modern {
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  background: #000;
  margin: 20px 0;
  overflow: hidden;
}

.video-container-modern iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* Different aspect ratios */
.ratio-4-3 {
  aspect-ratio: 4 / 3;
}

.ratio-21-9 {
  aspect-ratio: 21 / 9;
}

.placeholder {
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

h2 { margin-top: 30px; }
code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
</style>
</head>
<body>

<h1>Responsive Videos</h1>

<h2>Classic Method (padding-bottom: 56.25%)</h2>
<p>Works in all browsers, uses padding hack for 16:9 ratio</p>
<div class="video-container-classic">
  <div class="placeholder" style="position:absolute;top:0;left:0;width:100%;height:100%;">
    🎬 16:9 Video Container
  </div>
</div>

<h2>Modern Method (aspect-ratio: 16/9)</h2>
<p>Cleaner code, modern browser support</p>
<div class="video-container-modern">
  <div class="placeholder" style="height:100%;">
    🎬 16:9 Modern
  </div>
</div>

<h2>Different Aspect Ratios</h2>
<div class="video-container-modern ratio-4-3">
  <div class="placeholder" style="height:100%;">
    📺 4:3 Classic TV
  </div>
</div>

<div class="video-container-modern ratio-21-9">
  <div class="placeholder" style="height:100%;">
    🎥 21:9 Ultrawide Cinema
  </div>
</div>

</body>
</html>`,
    },
    'rwd-frameworks': {
      title: 'RWD Frameworks',
      content: `
# Responsive CSS Frameworks

Popular frameworks for building responsive websites quickly.

## Bootstrap

The most popular CSS framework.

<pre><code class="html">
&lt;link href="https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap.min.css" rel="stylesheet"&gt;

&lt;div class="container"&gt;
  &lt;div class="row"&gt;
    &lt;div class="col-md-6"&gt;Half on medium+&lt;/div&gt;
    &lt;div class="col-md-6"&gt;Half on medium+&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
</code></pre>

## Tailwind CSS

Utility-first CSS framework.

<pre><code class="html">
&lt;div class="flex flex-col md:flex-row gap-4"&gt;
  &lt;div class="w-full md:w-1/2"&gt;Item 1&lt;/div&gt;
  &lt;div class="w-full md:w-1/2"&gt;Item 2&lt;/div&gt;
&lt;/div&gt;
</code></pre>

## Foundation

Enterprise-grade responsive framework.

## Bulma

Modern CSS framework based on Flexbox.
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; margin: 0; background: #f5f5f5; }

.framework-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin: 20px 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.framework-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.framework-logo {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.bootstrap { background: #7952b3; color: white; }
.tailwind { background: #06b6d4; color: white; }
.foundation { background: #1779ba; color: white; }
.bulma { background: #00d1b2; color: white; }

.framework-name { font-size: 24px; font-weight: bold; }

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

.pros, .cons {
  padding: 15px;
  border-radius: 8px;
}

.pros { background: #e8f5e9; }
.cons { background: #ffebee; }

.pros h4 { color: #2e7d32; margin: 0 0 10px; }
.cons h4 { color: #c62828; margin: 0 0 10px; }

ul { margin: 0; padding-left: 20px; }
li { margin: 5px 0; font-size: 14px; }

@media (max-width: 600px) {
  .pros-cons { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<h1>CSS Frameworks Comparison</h1>

<div class="framework-card">
  <div class="framework-header">
    <div class="framework-logo bootstrap">B</div>
    <span class="framework-name">Bootstrap</span>
  </div>
  <p>Most popular framework with extensive component library.</p>
  <div class="pros-cons">
    <div class="pros">
      <h4>✅ Pros</h4>
      <ul>
        <li>Huge community</li>
        <li>Extensive docs</li>
        <li>Pre-built components</li>
      </ul>
    </div>
    <div class="cons">
      <h4>❌ Cons</h4>
      <ul>
        <li>Large file size</li>
        <li>Generic look</li>
        <li>Override complexity</li>
      </ul>
    </div>
  </div>
</div>

<div class="framework-card">
  <div class="framework-header">
    <div class="framework-logo tailwind">T</div>
    <span class="framework-name">Tailwind CSS</span>
  </div>
  <p>Utility-first framework for custom designs.</p>
  <div class="pros-cons">
    <div class="pros">
      <h4>✅ Pros</h4>
      <ul>
        <li>Highly customizable</li>
        <li>Small production builds</li>
        <li>No design constraints</li>
      </ul>
    </div>
    <div class="cons">
      <h4>❌ Cons</h4>
      <ul>
        <li>Learning curve</li>
        <li>Verbose HTML</li>
        <li>Build step required</li>
      </ul>
    </div>
  </div>
</div>

<div class="framework-card">
  <div class="framework-header">
    <div class="framework-logo bulma">B</div>
    <span class="framework-name">Bulma</span>
  </div>
  <p>Modern CSS-only framework (no JavaScript).</p>
  <div class="pros-cons">
    <div class="pros">
      <h4>✅ Pros</h4>
      <ul>
        <li>Pure CSS</li>
        <li>Modern flexbox</li>
        <li>Easy syntax</li>
      </ul>
    </div>
    <div class="cons">
      <h4>❌ Cons</h4>
      <ul>
        <li>Smaller community</li>
        <li>No JS components</li>
        <li>Less features</li>
      </ul>
    </div>
  </div>
</div>

</body>
</html>`,
    },
    'rwd-templates': {
      title: 'RWD Templates',
      content: `
# Responsive Templates

Pre-built responsive layouts for common use cases.

## Common Templates

### 1. Holy Grail Layout
Header, footer, main content with two sidebars.

### 2. Landing Page
Hero, features, testimonials, CTA, footer.

### 3. Blog Layout
Header, posts grid, sidebar, pagination.

### 4. Dashboard
Sidebar nav, top bar, content area, cards.

### 5. E-commerce
Product grid, filters, cart.

## Resources

- HTML5 UP (free templates)
- Start Bootstrap
- Tailwind UI
- Creative Tim
      `,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; }

/* Holy Grail Layout */
.holy-grail {
  display: grid;
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.hg-header {
  grid-area: header;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 20px;
  text-align: center;
}

.hg-nav {
  grid-area: nav;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.hg-main {
  grid-area: main;
  padding: 20px;
  background: #f5f5f5;
}

.hg-aside {
  grid-area: aside;
  background: #ecf0f1;
  padding: 20px;
}

.hg-footer {
  grid-area: footer;
  background: #2c3e50;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .holy-grail {
    grid-template-areas:
      "header"
      "nav"
      "main"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .hg-nav, .hg-aside {
    padding: 15px;
  }
}

/* Cards */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: center;
}

.card-icon { font-size: 30px; margin-bottom: 10px; }

h2, h3 { margin-bottom: 15px; }
ul { padding-left: 20px; }
li { margin: 5px 0; }
</style>
</head>
<body>

<div class="holy-grail">
  <header class="hg-header">
    <h1>Holy Grail Layout</h1>
    <p>Responsive 3-column template</p>
  </header>
  
  <nav class="hg-nav">
    <h3>Navigation</h3>
    <ul>
      <li>Home</li>
      <li>About</li>
      <li>Services</li>
      <li>Contact</li>
    </ul>
  </nav>
  
  <main class="hg-main">
    <h2>Main Content</h2>
    <p style="margin-bottom:20px;">
      This template adapts to mobile by stacking columns vertically.
    </p>
    <div class="cards">
      <div class="card">
        <div class="card-icon">📱</div>
        <strong>Mobile</strong>
      </div>
      <div class="card">
        <div class="card-icon">💻</div>
        <strong>Desktop</strong>
      </div>
      <div class="card">
        <div class="card-icon">📊</div>
        <strong>Responsive</strong>
      </div>
    </div>
  </main>
  
  <aside class="hg-aside">
    <h3>Sidebar</h3>
    <p>Additional content or ads go here.</p>
  </aside>
  
  <footer class="hg-footer">
    <p>© 2025 VerTechie</p>
  </footer>
</div>

</body>
</html>`,
    },
  };

  return cssLessons[lessonSlug] || {
    title: 'Lesson',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    tryItCode: `<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
}

p {
  color: #666;
}
</style>
</head>
<body>

<h1>CSS Lesson Coming Soon</h1>
<p>This lesson content is being prepared. Try editing the CSS above!</p>

</body>
</html>`,
  };
};

// Generate JavaScript lesson content