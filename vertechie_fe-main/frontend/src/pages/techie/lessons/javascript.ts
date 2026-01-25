export const generateJSLessonContent = (lessonSlug: string) => {
  const jsLessons: Record<string, any> = {
    home: {
      title: 'JavaScript Tutorial',
      content: `## JavaScript Tutorial

JavaScript is the world's most popular programming language.

### What is JavaScript?

- JavaScript is the programming language of the Web
- JavaScript can update and change both HTML and CSS
- JavaScript can calculate, manipulate and validate data

### Why Learn JavaScript?

JavaScript is one of the **3 languages** all web developers must learn:

1. **HTML** to define the content of web pages
2. **CSS** to specify the layout of web pages
3. **JavaScript** to program the behavior of web pages

### JavaScript Can Change HTML Content

One of many JavaScript HTML methods is getElementById().

The example below "finds" an HTML element (with id="demo"), and changes the element content (innerHTML) to "Hello JavaScript":

<pre><code class="javascript">
document.getElementById("demo").innerHTML = "Hello JavaScript!";
</code></pre>

### Learning by Examples

This tutorial supplements all explanations with clarifying "Try it Yourself" examples.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>What Can JavaScript Do?</h2>

<p id="demo">JavaScript can change HTML content.</p>

<button type="button" onclick='document.getElementById("demo").innerHTML = "Hello JavaScript!"'>Click Me!</button>

</body>
</html>`,
    },
    intro: {
      title: 'JavaScript Introduction',
      content: `## JavaScript Introduction

This page contains some examples of what JavaScript can do.

### JavaScript Can Change HTML Content

<pre><code class="javascript">
document.getElementById("demo").innerHTML = "Hello JavaScript!";
</code></pre>

### JavaScript Can Change HTML Attribute Values

JavaScript can change HTML attribute values. In this example JavaScript changes the value of the src (source) attribute of an img tag.

### JavaScript Can Change HTML Styles (CSS)

<pre><code class="javascript">
document.getElementById("demo").style.fontSize = "35px";
</code></pre>

### JavaScript Can Hide HTML Elements

<pre><code class="javascript">
document.getElementById("demo").style.display = "none";
</code></pre>

### JavaScript Can Show HTML Elements

<pre><code class="javascript">
document.getElementById("demo").style.display = "block";
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>What Can JavaScript Do?</h2>

<p id="demo">JavaScript can change HTML content.</p>

<button type="button" onclick="document.getElementById('demo').innerHTML = 'Hello JavaScript!'">
Click Me!
</button>

<br><br>

<button type="button" onclick="document.getElementById('demo').style.color = 'red'">
Change Color
</button>

<button type="button" onclick="document.getElementById('demo').style.fontSize = '35px'">
Change Size
</button>

</body>
</html>`,
    },
    whereto: {
      title: 'JavaScript Where To',
      content: `## JavaScript Where To

### The &lt;script&gt; Tag

In HTML, JavaScript code is inserted between &lt;script&gt; and &lt;/script&gt; tags.

<pre><code class="html">
&lt;script&gt;
document.getElementById("demo").innerHTML = "My First JavaScript";
&lt;/script&gt;
</code></pre>

### JavaScript in &lt;head&gt; or &lt;body&gt;

You can place any number of scripts in an HTML document.

Scripts can be placed in the &lt;body&gt;, or in the &lt;head&gt; section of an HTML page, or in both.

### External JavaScript

Scripts can also be placed in external files with .js extension.

<pre><code class="html">
&lt;script src="myScript.js"&gt;&lt;/script&gt;
</code></pre>

### External JavaScript Advantages

- It separates HTML and code
- It makes HTML and JavaScript easier to read and maintain
- Cached JavaScript files can speed up page loads`,
      tryItCode: `<!DOCTYPE html>
<html>
<head>
<script>
function myFunction() {
  document.getElementById("demo").innerHTML = "Paragraph changed.";
}
</script>
</head>
<body>

<h2>JavaScript in Head</h2>

<p id="demo">A Paragraph.</p>

<button type="button" onclick="myFunction()">Try it</button>

</body>
</html>`,
    },
    output: {
      title: 'JavaScript Output',
      content: `## JavaScript Output

### JavaScript Display Possibilities

JavaScript can "display" data in different ways:

- Writing into an HTML element, using innerHTML
- Writing into the HTML output using document.write()
- Writing into an alert box, using window.alert()
- Writing into the browser console, using console.log()

### Using innerHTML

<pre><code class="javascript">
document.getElementById("demo").innerHTML = 5 + 6;
</code></pre>

### Using document.write()

<pre><code class="javascript">
document.write(5 + 6);
</code></pre>

### Using window.alert()

<pre><code class="javascript">
window.alert(5 + 6);
</code></pre>

### Using console.log()

For debugging purposes, you can call console.log() method in the browser to display data.

<pre><code class="javascript">
console.log(5 + 6);
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Output</h2>

<p id="demo"></p>

<script>
// Using innerHTML
document.getElementById("demo").innerHTML = "Hello using innerHTML!";

// Using document.write()
document.write("<p>Hello using document.write()!</p>");

// Using console.log()
console.log("Hello in console! (Press F12 to see)");
</script>

</body>
</html>`,
    },
    statements: {
      title: 'JavaScript Statements',
      content: `## JavaScript Statements

### JavaScript Programs

A computer program is a list of "instructions" to be "executed" by a computer.

In a programming language, these programming instructions are called statements.

A JavaScript program is a list of programming statements.

### JavaScript Statements

JavaScript statements are composed of: Values, Operators, Expressions, Keywords, and Comments.

<pre><code class="javascript">
let x, y, z;    // Statement 1
x = 5;          // Statement 2
y = 6;          // Statement 3
z = x + y;      // Statement 4
</code></pre>

### Semicolons ;

Semicolons separate JavaScript statements. Add a semicolon at the end of each executable statement.

### JavaScript White Space

JavaScript ignores multiple spaces. You can add white space to your script to make it more readable.

### JavaScript Code Blocks

JavaScript statements can be grouped together in code blocks, inside curly brackets {...}.

<pre><code class="javascript">
function myFunction() {
  document.getElementById("demo1").innerHTML = "Hello Dolly!";
  document.getElementById("demo2").innerHTML = "How are you?";
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Statements</h2>

<p>A <b>JavaScript program</b> is a list of <b>statements</b> to be executed by a computer.</p>

<p id="demo"></p>

<script>
let x, y, z;  // Statement 1
x = 5;        // Statement 2
y = 6;        // Statement 3
z = x + y;    // Statement 4

document.getElementById("demo").innerHTML =
"The value of z is " + z + ".";
</script>

</body>
</html>`,
    },
    syntax: {
      title: 'JavaScript Syntax',
      content: `## JavaScript Syntax

JavaScript syntax is the set of rules, how JavaScript programs are constructed.

### JavaScript Values

The JavaScript syntax defines two types of values:

- **Fixed values** (Literals)
- **Variable values** (Variables)

### JavaScript Literals

Numbers are written with or without decimals:

<pre><code class="javascript">
10.50
1001
</code></pre>

Strings are text, written within double or single quotes:

<pre><code class="javascript">
"John Doe"
'John Doe'
</code></pre>

### JavaScript Variables

Variables are used to store data values. JavaScript uses let, const, and var to declare variables.

<pre><code class="javascript">
let x;
x = 6;
</code></pre>

### JavaScript Operators

JavaScript uses arithmetic operators ( + - * / ) to compute values:

<pre><code class="javascript">
(5 + 6) * 10
</code></pre>

### JavaScript Expressions

An expression is a combination of values, variables, and operators, which computes to a value.

### JavaScript Keywords

JavaScript keywords are reserved words. Reserved words cannot be used as names for variables.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Syntax</h2>

<p id="demo"></p>

<script>
// Literals
let number = 10.50;
let text = "Hello World";

// Variables
let x = 5;
let y = 6;
let z = x + y;

// Expressions
let result = (5 + 6) * 10;

document.getElementById("demo").innerHTML = 
  "Number: " + number + "<br>" +
  "Text: " + text + "<br>" +
  "Sum: " + z + "<br>" +
  "Expression: " + result;
</script>

</body>
</html>`,
    },
    comments: {
      title: 'JavaScript Comments',
      content: `## JavaScript Comments

JavaScript comments can be used to explain JavaScript code, and to make it more readable.

JavaScript comments can also be used to prevent execution, when testing alternative code.

### Single Line Comments

Single line comments start with //.

<pre><code class="javascript">
// Change heading:
document.getElementById("myH").innerHTML = "My First Page";

// Change paragraph:
document.getElementById("myP").innerHTML = "My first paragraph.";
</code></pre>

### Multi-line Comments

Multi-line comments start with /* and end with */.

<pre><code class="javascript">
/*
The code below will change
the heading with id = "myH"
and the paragraph with id = "myP"
*/
document.getElementById("myH").innerHTML = "My First Page";
document.getElementById("myP").innerHTML = "My first paragraph.";
</code></pre>

### Using Comments to Prevent Execution

Using comments to prevent execution of code is suitable for code testing.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2 id="myH">JavaScript Comments</h2>

<p id="myP">This is a paragraph.</p>

<script>
// This is a single line comment

/*
This is a
multi-line comment
*/

// Change heading:
document.getElementById("myH").innerHTML = "Comments are useful!";

// Change paragraph:
document.getElementById("myP").innerHTML = "Comments explain the code.";
</script>

</body>
</html>`,
    },
    variables: {
      title: 'JavaScript Variables',
      content: `## JavaScript Variables

Variables are Containers for Storing Data.

### JavaScript Variables

JavaScript Variables can be declared in 4 ways:

- Automatically
- Using var
- Using let
- Using const

### When to Use var, let, or const?

1. Always declare variables
2. Always use const if the value should not be changed
3. Always use const if the type should not be changed (Arrays and Objects)
4. Only use let if you can't use const
5. Only use var if you MUST support old browsers

### JavaScript Let

The let keyword was introduced in ES6 (2015). Variables defined with let cannot be Redeclared.

<pre><code class="javascript">
let x = 5;
let y = 6;
let z = x + y;
</code></pre>

### JavaScript Const

The const keyword was introduced in ES6 (2015). Variables defined with const cannot be Redeclared or Reassigned.

<pre><code class="javascript">
const PI = 3.14159265359;
</code></pre>

### Variable Naming Rules

- Names can contain letters, digits, underscores, and dollar signs
- Names must begin with a letter, $ or _
- Names are case sensitive (y and Y are different)
- Reserved words cannot be used as names`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Variables</h2>

<p id="demo"></p>

<script>
// Using let
let x = 5;
let y = 6;
let z = x + y;

// Using const
const PI = 3.14159265359;

// Variable names
let firstName = "John";
let lastName = "Doe";
let _score = 100;
let $price = 99.99;

document.getElementById("demo").innerHTML = 
  "Sum: " + z + "<br>" +
  "PI: " + PI + "<br>" +
  "Name: " + firstName + " " + lastName + "<br>" +
  "Score: " + _score + "<br>" +
  "Price: $" + $price;
</script>

</body>
</html>`,
    },
    let: {
      title: 'JavaScript Let',
      content: `## JavaScript Let

The let keyword was introduced in ES6 (2015).

### Block Scope

Variables declared inside a { } block cannot be accessed from outside the block:

<pre><code class="javascript">
{
  let x = 2;
}
// x can NOT be used here
</code></pre>

### Cannot be Redeclared

Variables defined with let cannot be redeclared in the same scope.

<pre><code class="javascript">
let x = "John Doe";
let x = 0;  // SyntaxError: 'x' has already been declared
</code></pre>

### Redeclaring Variables

With var, you can redeclare a variable anywhere in a program.

With let, redeclaring a variable in the same scope is NOT allowed.

### Let Hoisting

Variables defined with let are hoisted to the top of the block, but not initialized.

Using a let variable before it is declared will result in a ReferenceError.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Let</h2>

<p id="demo"></p>

<script>
// Block scope demonstration
let x = 10;
{
  let x = 2;  // Different variable inside block
  document.getElementById("demo").innerHTML = "Inside block: x = " + x;
}
document.getElementById("demo").innerHTML += "<br>Outside block: x = " + x;

// Cannot redeclare in same scope
let name = "John";
// let name = "Jane";  // This would cause an error

// But can reassign
name = "Jane";
document.getElementById("demo").innerHTML += "<br>Name changed to: " + name;
</script>

</body>
</html>`,
    },
    const: {
      title: 'JavaScript Const',
      content: `## JavaScript Const

The const keyword was introduced in ES6 (2015).

### Cannot be Reassigned

A const variable cannot be reassigned:

<pre><code class="javascript">
const PI = 3.141592653589793;
PI = 3.14;      // This will give an error
PI = PI + 10;   // This will also give an error
</code></pre>

### Must be Assigned

JavaScript const variables must be assigned a value when they are declared:

<pre><code class="javascript">
// Correct
const PI = 3.14159265359;

// Incorrect
const PI;
PI = 3.14159265359;
</code></pre>

### Constant Objects and Arrays

The keyword const is a little misleading. It does NOT define a constant value. It defines a constant reference to a value.

You CAN change the elements of a constant array and the properties of a constant object.

<pre><code class="javascript">
// You can create a constant array:
const cars = ["Saab", "Volvo", "BMW"];

// You can change an element:
cars[0] = "Toyota";

// You can add an element:
cars.push("Audi");
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Const</h2>

<p id="demo"></p>

<script>
// Constant values
const PI = 3.141592653589793;
const YEAR = 2024;

// Constant array - elements can change
const cars = ["Saab", "Volvo", "BMW"];
cars[0] = "Toyota";
cars.push("Audi");

// Constant object - properties can change
const person = {name: "John", age: 30};
person.age = 31;
person.city = "New York";

document.getElementById("demo").innerHTML = 
  "PI: " + PI + "<br>" +
  "Year: " + YEAR + "<br>" +
  "Cars: " + cars.join(", ") + "<br>" +
  "Person: " + person.name + ", " + person.age + ", " + person.city;
</script>

</body>
</html>`,
    },
    operators: {
      title: 'JavaScript Operators',
      content: `## JavaScript Operators

JavaScript operators are used to assign values, compare values, perform arithmetic operations, and more.

### Arithmetic Operators

<pre><code class="javascript">
+   Addition
-   Subtraction
*   Multiplication
**  Exponentiation (ES2016)
/   Division
%   Modulus (Remainder)
++  Increment
--  Decrement
</code></pre>

### Assignment Operators

<pre><code class="javascript">
=    x = y
+=   x += y  (x = x + y)
-=   x -= y  (x = x - y)
*=   x *= y  (x = x * y)
/=   x /= y  (x = x / y)
%=   x %= y  (x = x % y)
**=  x **= y (x = x ** y)
</code></pre>

### Comparison Operators

<pre><code class="javascript">
==   equal to
===  equal value and equal type
!=   not equal
!==  not equal value or not equal type
>    greater than
<    less than
>=   greater than or equal to
<=   less than or equal to
?    ternary operator
</code></pre>

### Logical Operators

<pre><code class="javascript">
&&   logical and
||   logical or
!    logical not
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Operators</h2>

<p id="demo"></p>

<script>
// Arithmetic Operators
let a = 10;
let b = 3;

let addition = a + b;       // 13
let subtraction = a - b;    // 7
let multiplication = a * b; // 30
let division = a / b;       // 3.33...
let modulus = a % b;        // 1
let exponent = a ** b;      // 1000

// Comparison Operators
let isEqual = (5 == "5");   // true (value only)
let isStrict = (5 === "5"); // false (value and type)
let isGreater = (10 > 5);   // true

// Logical Operators
let andResult = (true && false);  // false
let orResult = (true || false);   // true
let notResult = !true;            // false

document.getElementById("demo").innerHTML = 
  "Addition: " + addition + "<br>" +
  "Subtraction: " + subtraction + "<br>" +
  "Multiplication: " + multiplication + "<br>" +
  "Division: " + division.toFixed(2) + "<br>" +
  "Modulus: " + modulus + "<br>" +
  "Exponent: " + exponent + "<br><br>" +
  "5 == '5': " + isEqual + "<br>" +
  "5 === '5': " + isStrict + "<br>" +
  "10 > 5: " + isGreater;
</script>

</body>
</html>`,
    },
    datatypes: {
      title: 'JavaScript Data Types',
      content: `## JavaScript Data Types

JavaScript has 8 Datatypes:

### Primitive Data Types

1. **String** - Text values
2. **Number** - Integer or floating-point
3. **Bigint** - Large integers
4. **Boolean** - true or false
5. **Undefined** - Variable without value
6. **Null** - Intentional "no value"
7. **Symbol** - Unique identifier

### Reference Data Type

8. **Object** - Collections of data (Arrays, Objects, Functions, Dates, etc.)

### JavaScript Strings

<pre><code class="javascript">
let text = "John Doe";
let text2 = 'Hello World';
</code></pre>

### JavaScript Numbers

<pre><code class="javascript">
let x = 3.14;    // A number with decimals
let y = 34;      // A number without decimals
</code></pre>

### JavaScript Booleans

<pre><code class="javascript">
let x = true;
let y = false;
</code></pre>

### The typeof Operator

You can use the typeof operator to find the data type of a JavaScript variable.

<pre><code class="javascript">
typeof "John"        // Returns "string"
typeof 3.14          // Returns "number"
typeof true          // Returns "boolean"
typeof undefined     // Returns "undefined"
typeof null          // Returns "object"
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Data Types</h2>

<p id="demo"></p>

<script>
// String
let name = "John Doe";

// Number
let age = 25;
let price = 19.99;

// Boolean
let isStudent = true;

// Undefined
let future;

// Null
let empty = null;

// Object
let person = {
  firstName: "John",
  lastName: "Doe"
};

// Array (object)
let colors = ["red", "green", "blue"];

document.getElementById("demo").innerHTML = 
  "name: " + name + " (typeof: " + typeof name + ")<br>" +
  "age: " + age + " (typeof: " + typeof age + ")<br>" +
  "price: " + price + " (typeof: " + typeof price + ")<br>" +
  "isStudent: " + isStudent + " (typeof: " + typeof isStudent + ")<br>" +
  "future: " + future + " (typeof: " + typeof future + ")<br>" +
  "empty: " + empty + " (typeof: " + typeof empty + ")<br>" +
  "person: " + JSON.stringify(person) + " (typeof: " + typeof person + ")<br>" +
  "colors: " + colors + " (typeof: " + typeof colors + ")";
</script>

</body>
</html>`,
    },
    functions: {
      title: 'JavaScript Functions',
      content: `## JavaScript Functions

A JavaScript function is a block of code designed to perform a particular task.

### Function Syntax

A JavaScript function is defined with the function keyword, followed by a name, followed by parentheses ().

<pre><code class="javascript">
function name(parameter1, parameter2) {
  // code to be executed
}
</code></pre>

### Function Invocation

The code inside the function will execute when "something" invokes (calls) the function.

### Function Return

When JavaScript reaches a return statement, the function will stop executing.

<pre><code class="javascript">
function myFunction(a, b) {
  return a * b;
}
</code></pre>

### Why Functions?

- You can reuse code: Define the code once, and use it many times
- You can use the same code many times with different arguments
- Functions make code more readable and maintainable`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Functions</h2>

<p id="demo"></p>

<script>
// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Function with multiple parameters
function multiply(a, b) {
  return a * b;
}

// Function with default parameter
function welcome(name = "Guest") {
  return "Welcome, " + name;
}

// Call functions
let greeting = greet("World");
let product = multiply(5, 3);
let welcomeMsg = welcome();

document.getElementById("demo").innerHTML = 
  greeting + "<br>" +
  "5 x 3 = " + product + "<br>" +
  welcomeMsg;
</script>

</body>
</html>`,
    },
    arrow: {
      title: 'JavaScript Arrow Functions',
      content: `## JavaScript Arrow Functions

Arrow functions were introduced in ES6.

### Arrow Function Syntax

<pre><code class="javascript">
// Regular function
hello = function() {
  return "Hello World!";
}

// Arrow function
hello = () => {
  return "Hello World!";
}

// Shorter syntax (one statement)
hello = () => "Hello World!";
</code></pre>

### Arrow Functions with Parameters

<pre><code class="javascript">
// One parameter (no parentheses needed)
hello = val => "Hello " + val;

// Multiple parameters
hello = (val1, val2) => "Hello " + val1 + " " + val2;
</code></pre>

### What About this?

In regular functions, the this keyword represents the object that called the function.

With arrow functions, the this keyword always represents the object that defined the arrow function.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Arrow Functions</h2>

<p id="demo"></p>

<script>
// Arrow function - no parameters
const sayHello = () => "Hello!";

// Arrow function - one parameter
const double = x => x * 2;

// Arrow function - multiple parameters
const add = (a, b) => a + b;

// Arrow function - multiple lines
const greet = (name) => {
  let greeting = "Hello, " + name + "!";
  return greeting.toUpperCase();
};

// Arrow with array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);

document.getElementById("demo").innerHTML = 
  sayHello() + "<br>" +
  "Double 5: " + double(5) + "<br>" +
  "Add 3+4: " + add(3, 4) + "<br>" +
  greet("World") + "<br>" +
  "Doubled: " + doubled.join(", ") + "<br>" +
  "Evens: " + evens.join(", ");
</script>

</body>
</html>`,
    },
    scope: {
      title: 'JavaScript Scope',
      content: `## JavaScript Scope

Scope determines the accessibility (visibility) of variables.

### JavaScript has 3 Types of Scope

- Block scope
- Function scope
- Global scope

### Block Scope

Variables declared inside a { } block cannot be accessed from outside the block.

<pre><code class="javascript">
{
  let x = 2;
}
// x can NOT be used here
</code></pre>

### Function Scope

Variables declared within a JavaScript function are LOCAL to the function.

<pre><code class="javascript">
function myFunction() {
  let carName = "Volvo";
  // code here CAN use carName
}
// code here can NOT use carName
</code></pre>

### Global Scope

A variable declared outside a function becomes GLOBAL.

<pre><code class="javascript">
let carName = "Volvo";
// code here can use carName

function myFunction() {
  // code here can also use carName
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Scope</h2>

<p id="demo"></p>

<script>
// Global scope
let globalVar = "I'm global!";

function demonstrateScope() {
  // Function scope
  let functionVar = "I'm in function scope!";
  
  // Block scope
  if (true) {
    let blockVar = "I'm in block scope!";
    var notBlockVar = "var ignores block scope!";
    
    document.getElementById("demo").innerHTML += 
      "Inside block: " + blockVar + "<br>";
  }
  
  // blockVar is NOT accessible here
  // but notBlockVar IS accessible
  document.getElementById("demo").innerHTML += 
    "Function scope: " + functionVar + "<br>" +
    "var (no block scope): " + notBlockVar + "<br>";
}

document.getElementById("demo").innerHTML = 
  "Global: " + globalVar + "<br>";

demonstrateScope();
</script>

</body>
</html>`,
    },
    closures: {
      title: 'JavaScript Closures',
      content: `## JavaScript Closures

A closure is a function having access to the parent scope, even after the parent function has closed.

### JavaScript Closures

<pre><code class="javascript">
const add = (function () {
  let counter = 0;
  return function () {counter += 1; return counter}
})();

add();
add();
add();
// the counter is now 3
</code></pre>

### Explanation

The variable add is assigned to the return value of a self-invoking function.

The self-invoking function only runs once. It sets the counter to zero (0), and returns a function expression.

This way add becomes a function. The "wonderful" part is that it can access the counter in the parent scope.

This is called a JavaScript closure. It makes it possible for a function to have "private" variables.

The counter is protected by the scope of the anonymous function, and can only be changed using the add function.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Closures</h2>

<p id="demo"></p>

<button onclick="increment()">Increment</button>
<button onclick="decrement()">Decrement</button>
<button onclick="resetCounter()">Reset</button>

<script>
// Closure example - counter
const counter = (function() {
  let count = 0;
  
  return {
    increment: function() { return ++count; },
    decrement: function() { return --count; },
    getCount: function() { return count; },
    reset: function() { count = 0; return count; }
  };
})();

function increment() {
  document.getElementById("demo").innerHTML = 
    "Count: " + counter.increment();
}

function decrement() {
  document.getElementById("demo").innerHTML = 
    "Count: " + counter.decrement();
}

function resetCounter() {
  document.getElementById("demo").innerHTML = 
    "Count: " + counter.reset();
}

document.getElementById("demo").innerHTML = 
  "Count: " + counter.getCount();
</script>

</body>
</html>`,
    },
    strings: {
      title: 'JavaScript Strings',
      content: `## JavaScript Strings

JavaScript strings are for storing and manipulating text.

### String Length

<pre><code class="javascript">
let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let length = text.length;  // 26
</code></pre>

### Extracting String Parts

- slice(start, end)
- substring(start, end)
- substr(start, length)

### String Methods

<pre><code class="javascript">
let text = "Hello World!";
text.toUpperCase()     // HELLO WORLD!
text.toLowerCase()     // hello world!
text.trim()            // Remove whitespace
text.split(" ")        // ["Hello", "World!"]
text.replace("World", "JS")  // "Hello JS!"
text.includes("World") // true
text.startsWith("Hello") // true
text.endsWith("!")     // true
</code></pre>

### Template Literals

Template literals use backticks and allow multiline strings and string interpolation.

<pre><code class="javascript">
let name = "John";
let text = \`Hello \${name}!\`;
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Strings</h2>

<p id="demo"></p>

<script>
let text = "Hello, World!";
let name = "JavaScript";

// String methods
let upper = text.toUpperCase();
let lower = text.toLowerCase();
let length = text.length;
let sliced = text.slice(0, 5);
let replaced = text.replace("World", name);
let includes = text.includes("World");
let split = text.split(", ");

// Template literal
let greeting = \`Welcome to \${name}!
This is a multiline string.\`;

document.getElementById("demo").innerHTML = 
  "Original: " + text + "<br>" +
  "Uppercase: " + upper + "<br>" +
  "Lowercase: " + lower + "<br>" +
  "Length: " + length + "<br>" +
  "Sliced (0-5): " + sliced + "<br>" +
  "Replaced: " + replaced + "<br>" +
  "Includes 'World': " + includes + "<br>" +
  "Split: " + JSON.stringify(split) + "<br><br>" +
  "Template literal:<br>" + greeting.replace("\\n", "<br>");
</script>

</body>
</html>`,
    },
    numbers: {
      title: 'JavaScript Numbers',
      content: `## JavaScript Numbers

JavaScript has only one type of number. Numbers can be written with or without decimals.

### JavaScript Numbers

<pre><code class="javascript">
let x = 3.14;    // A number with decimals
let y = 3;       // A number without decimals
</code></pre>

### Precision

Integers are accurate up to 15 digits. Floating point arithmetic is not always 100% accurate.

### NaN - Not a Number

NaN is a JavaScript reserved word indicating that a number is not a legal number.

<pre><code class="javascript">
let x = 100 / "Apple";  // NaN
isNaN(x);               // true
</code></pre>

### Number Methods

<pre><code class="javascript">
let x = 9.656;
x.toFixed(2);    // "9.66"
x.toPrecision(4); // "9.656"
Number("10");    // 10
parseInt("10.33"); // 10
parseFloat("10.33"); // 10.33
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Numbers</h2>

<p id="demo"></p>

<script>
let x = 3.14159265359;
let y = 100;

// Number methods
let fixed = x.toFixed(2);
let precision = x.toPrecision(4);

// Type conversion
let str = "123.45";
let num1 = Number(str);
let num2 = parseInt(str);
let num3 = parseFloat(str);

// NaN
let invalid = 100 / "Apple";

// Math object
let rounded = Math.round(x);
let ceiling = Math.ceil(x);
let floor = Math.floor(x);
let random = Math.random();

document.getElementById("demo").innerHTML = 
  "Original: " + x + "<br>" +
  "toFixed(2): " + fixed + "<br>" +
  "toPrecision(4): " + precision + "<br><br>" +
  "String '123.45' conversions:<br>" +
  "Number(): " + num1 + "<br>" +
  "parseInt(): " + num2 + "<br>" +
  "parseFloat(): " + num3 + "<br><br>" +
  "100/'Apple' = " + invalid + " (isNaN: " + isNaN(invalid) + ")<br><br>" +
  "Math methods on " + x + ":<br>" +
  "round(): " + rounded + "<br>" +
  "ceil(): " + ceiling + "<br>" +
  "floor(): " + floor + "<br>" +
  "random(): " + random.toFixed(4);
</script>

</body>
</html>`,
    },
    arrays: {
      title: 'JavaScript Arrays',
      content: `## JavaScript Arrays

An array is a special variable, which can hold more than one value.

### Creating an Array

<pre><code class="javascript">
const cars = ["Saab", "Volvo", "BMW"];
const cars = new Array("Saab", "Volvo", "BMW");
</code></pre>

### Accessing Array Elements

<pre><code class="javascript">
const cars = ["Saab", "Volvo", "BMW"];
let car = cars[0];  // "Saab"
</code></pre>

### Array Methods

<pre><code class="javascript">
// Adding/Removing
push()     // Add to end
pop()      // Remove from end
unshift()  // Add to beginning
shift()    // Remove from beginning

// Finding
indexOf()  // Find index of element
includes() // Check if exists
find()     // Find first match
filter()   // Find all matches

// Transforming
map()      // Transform each element
reduce()   // Reduce to single value
sort()     // Sort elements
reverse()  // Reverse order
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Arrays</h2>

<p id="demo"></p>

<script>
// Create array
const fruits = ["Apple", "Banana", "Orange"];

// Array methods
fruits.push("Mango");      // Add to end
fruits.unshift("Grape");   // Add to beginning

// Array iteration methods
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);
const found = numbers.find(n => n > 3);

// Array info
let length = fruits.length;
let indexOf = fruits.indexOf("Orange");
let includes = fruits.includes("Apple");

document.getElementById("demo").innerHTML = 
  "Fruits: " + fruits.join(", ") + "<br>" +
  "Length: " + length + "<br>" +
  "indexOf('Orange'): " + indexOf + "<br>" +
  "includes('Apple'): " + includes + "<br><br>" +
  "Numbers: " + numbers.join(", ") + "<br>" +
  "Doubled: " + doubled.join(", ") + "<br>" +
  "Evens: " + evens.join(", ") + "<br>" +
  "Sum: " + sum + "<br>" +
  "First > 3: " + found;
</script>

</body>
</html>`,
    },
    'array-methods': {
      title: 'JavaScript Array Methods',
      content: `## JavaScript Array Methods

### Transforming Arrays

**map()** - Creates a new array by calling a function for every element.

<pre><code class="javascript">
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(x => x * 2);
// [2, 4, 6, 8]
</code></pre>

**filter()** - Creates a new array with elements that pass a test.

<pre><code class="javascript">
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter(x => x % 2 === 0);
// [2, 4]
</code></pre>

**reduce()** - Reduces an array to a single value.

<pre><code class="javascript">
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, x) => acc + x, 0);
// 10
</code></pre>

### Finding Elements

**find()** - Returns the first element that passes a test.

**findIndex()** - Returns the index of the first element that passes a test.

**some()** - Returns true if any element passes a test.

**every()** - Returns true if all elements pass a test.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Array Methods</h2>

<p id="demo"></p>

<script>
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map - transform each element
const squared = numbers.map(n => n * n);

// filter - keep elements that pass test
const evens = numbers.filter(n => n % 2 === 0);

// reduce - combine into single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
const product = numbers.reduce((acc, n) => acc * n, 1);

// find - first match
const firstOver5 = numbers.find(n => n > 5);

// findIndex - index of first match
const indexOver5 = numbers.findIndex(n => n > 5);

// some - at least one passes
const hasEvens = numbers.some(n => n % 2 === 0);

// every - all pass
const allPositive = numbers.every(n => n > 0);

document.getElementById("demo").innerHTML = 
  "Original: [" + numbers + "]<br><br>" +
  "squared (map): [" + squared + "]<br>" +
  "evens (filter): [" + evens + "]<br>" +
  "sum (reduce): " + sum + "<br>" +
  "product (reduce): " + product + "<br>" +
  "first > 5 (find): " + firstOver5 + "<br>" +
  "index of first > 5: " + indexOver5 + "<br>" +
  "has evens (some): " + hasEvens + "<br>" +
  "all positive (every): " + allPositive;
</script>

</body>
</html>`,
    },
    objects: {
      title: 'JavaScript Objects',
      content: `## JavaScript Objects

Objects are variables that contain many values.

### Object Definition

<pre><code class="javascript">
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};
</code></pre>

### Accessing Object Properties

<pre><code class="javascript">
person.lastName;      // Dot notation
person["lastName"];   // Bracket notation
</code></pre>

### Object Methods

<pre><code class="javascript">
const person = {
  firstName: "John",
  lastName: "Doe",
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
};
</code></pre>

### this Keyword

In an object method, this refers to the object.

### Object Manipulation

<pre><code class="javascript">
Object.keys(obj)    // Array of keys
Object.values(obj)  // Array of values
Object.entries(obj) // Array of [key, value] pairs
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Objects</h2>

<p id="demo"></p>

<script>
// Object creation
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  email: "john@example.com",
  
  // Method
  fullName: function() {
    return this.firstName + " " + this.lastName;
  },
  
  // Shorthand method
  greet() {
    return "Hello, I'm " + this.firstName;
  }
};

// Accessing properties
let name1 = person.firstName;        // Dot notation
let name2 = person["lastName"];      // Bracket notation

// Modifying properties
person.age = 31;
person["city"] = "New York";

// Object methods
let keys = Object.keys(person);
let values = Object.values(person);

document.getElementById("demo").innerHTML = 
  "Full Name: " + person.fullName() + "<br>" +
  "Greeting: " + person.greet() + "<br>" +
  "Age: " + person.age + "<br>" +
  "City: " + person.city + "<br><br>" +
  "Keys: " + keys.join(", ") + "<br>" +
  "Values: " + values.slice(0, 4).join(", ");
</script>

</body>
</html>`,
    },
    dom: {
      title: 'JavaScript HTML DOM',
      content: `## JavaScript HTML DOM

The HTML DOM (Document Object Model) allows JavaScript to access and change all elements of an HTML document.

### The DOM Programming Interface

The HTML DOM can be accessed with JavaScript. All HTML elements are defined as objects.

### Finding HTML Elements

<pre><code class="javascript">
document.getElementById(id)
document.getElementsByTagName(name)
document.getElementsByClassName(name)
document.querySelectorAll(selector)
</code></pre>

### Changing HTML Elements

<pre><code class="javascript">
element.innerHTML = new content
element.attribute = new value
element.style.property = new style
element.setAttribute(attribute, value)
</code></pre>

### Adding and Deleting Elements

<pre><code class="javascript">
document.createElement(element)
document.removeChild(element)
document.appendChild(element)
document.replaceChild(new, old)
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2 id="title">JavaScript DOM</h2>

<p id="demo">This is a paragraph.</p>

<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<button onclick="changeContent()">Change Content</button>
<button onclick="changeStyle()">Change Style</button>
<button onclick="addItem()">Add Item</button>

<script>
function changeContent() {
  document.getElementById("demo").innerHTML = 
    "Content changed by JavaScript!";
}

function changeStyle() {
  let title = document.getElementById("title");
  title.style.color = "blue";
  title.style.fontSize = "2em";
}

function addItem() {
  let list = document.getElementById("list");
  let newItem = document.createElement("li");
  newItem.textContent = "New Item " + (list.children.length + 1);
  list.appendChild(newItem);
}
</script>

</body>
</html>`,
    },
    events: {
      title: 'JavaScript Events',
      content: `## JavaScript Events

HTML events are "things" that happen to HTML elements.

### Common HTML Events

<pre><code class="javascript">
onclick      // User clicks
onmouseover  // Mouse over element
onmouseout   // Mouse leaves element
onchange     // Input value changes
onkeydown    // Key pressed
onload       // Page finished loading
onsubmit     // Form submitted
</code></pre>

### Event Handlers

<pre><code class="html">
&lt;button onclick="myFunction()"&gt;Click&lt;/button&gt;
</code></pre>

### addEventListener

<pre><code class="javascript">
element.addEventListener("click", function() {
  alert("You clicked!");
});
</code></pre>

### Event Object

<pre><code class="javascript">
element.addEventListener("click", function(event) {
  console.log(event.target);  // Element clicked
  console.log(event.type);    // Event type
});
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Events</h2>

<p id="demo">Interact with the elements below!</p>

<button id="btn1">Click Me</button>
<button id="btn2">Hover Me</button>

<input type="text" id="input" placeholder="Type something...">

<script>
// Click event
document.getElementById("btn1").addEventListener("click", function() {
  document.getElementById("demo").innerHTML = "Button clicked!";
});

// Mouseover and mouseout
let btn2 = document.getElementById("btn2");
btn2.addEventListener("mouseover", function() {
  this.style.backgroundColor = "lightblue";
  document.getElementById("demo").innerHTML = "Mouse over!";
});
btn2.addEventListener("mouseout", function() {
  this.style.backgroundColor = "";
  document.getElementById("demo").innerHTML = "Mouse left!";
});

// Input event
document.getElementById("input").addEventListener("input", function(e) {
  document.getElementById("demo").innerHTML = 
    "You typed: " + e.target.value;
});

// Keydown event
document.getElementById("input").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    alert("Enter pressed! Value: " + this.value);
  }
});
</script>

</body>
</html>`,
    },
    promises: {
      title: 'JavaScript Promises',
      content: `## JavaScript Promises

A Promise is an object representing the eventual completion or failure of an asynchronous operation.

### Promise Syntax

<pre><code class="javascript">
let myPromise = new Promise(function(resolve, reject) {
  // Producing code (may take some time)
  if (success) {
    resolve(result);
  } else {
    reject(error);
  }
});

// Consuming code
myPromise.then(
  function(value) { /* success */ },
  function(error) { /* error */ }
);
</code></pre>

### Promise States

- **Pending**: Initial state
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

### Promise Methods

<pre><code class="javascript">
.then()   // Handle success
.catch()  // Handle error
.finally() // Run regardless
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Promises</h2>

<p id="demo">Loading...</p>

<button onclick="loadData()">Load Data</button>
<button onclick="loadError()">Simulate Error</button>

<script>
function simulateAPI(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject("Error: Failed to load data");
      } else {
        resolve({
          users: ["John", "Jane", "Bob"],
          count: 3
        });
      }
    }, 1500);
  });
}

function loadData() {
  document.getElementById("demo").innerHTML = "Loading...";
  
  simulateAPI()
    .then(data => {
      document.getElementById("demo").innerHTML = 
        "Users: " + data.users.join(", ") + 
        "<br>Count: " + data.count;
    })
    .catch(error => {
      document.getElementById("demo").innerHTML = error;
    })
    .finally(() => {
      console.log("Promise completed");
    });
}

function loadError() {
  document.getElementById("demo").innerHTML = "Loading...";
  
  simulateAPI(true)
    .then(data => {
      document.getElementById("demo").innerHTML = JSON.stringify(data);
    })
    .catch(error => {
      document.getElementById("demo").innerHTML = 
        '<span style="color:red">' + error + '</span>';
    });
}

document.getElementById("demo").innerHTML = "Click a button to test Promises";
</script>

</body>
</html>`,
    },
    'async-await': {
      title: 'JavaScript Async/Await',
      content: `## JavaScript Async/Await

Async/await makes asynchronous code look and behave more like synchronous code.

### Async Function

The async keyword makes a function return a Promise.

<pre><code class="javascript">
async function myFunction() {
  return "Hello";
}
// Same as:
function myFunction() {
  return Promise.resolve("Hello");
}
</code></pre>

### Await

The await keyword can only be used inside an async function. It makes JavaScript wait until the Promise settles.

<pre><code class="javascript">
async function myDisplay() {
  let myPromise = new Promise((resolve) => {
    setTimeout(() => resolve("Done!"), 3000);
  });
  
  let result = await myPromise;
  console.log(result);
}
</code></pre>

### Error Handling

<pre><code class="javascript">
async function myFunction() {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Async/Await</h2>

<p id="demo">Click a button to test</p>

<button onclick="fetchUser()">Fetch User</button>
<button onclick="fetchMultiple()">Fetch Multiple</button>

<script>
// Simulate API call
function simulateFetch(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: "User " + id, email: "user" + id + "@example.com" });
    }, 1000);
  });
}

// Async function
async function fetchUser() {
  document.getElementById("demo").innerHTML = "Loading...";
  
  try {
    const user = await simulateFetch(1);
    document.getElementById("demo").innerHTML = 
      "ID: " + user.id + "<br>" +
      "Name: " + user.name + "<br>" +
      "Email: " + user.email;
  } catch (error) {
    document.getElementById("demo").innerHTML = "Error: " + error;
  }
}

// Fetch multiple in parallel
async function fetchMultiple() {
  document.getElementById("demo").innerHTML = "Loading all users...";
  
  try {
    // Promise.all for parallel execution
    const [user1, user2, user3] = await Promise.all([
      simulateFetch(1),
      simulateFetch(2),
      simulateFetch(3)
    ]);
    
    document.getElementById("demo").innerHTML = 
      "User 1: " + user1.name + "<br>" +
      "User 2: " + user2.name + "<br>" +
      "User 3: " + user3.name;
  } catch (error) {
    document.getElementById("demo").innerHTML = "Error: " + error;
  }
}
</script>

</body>
</html>`,
    },
    fetch: {
      title: 'JavaScript Fetch API',
      content: `## JavaScript Fetch API

The Fetch API provides a modern interface for fetching resources.

### Fetch Syntax

<pre><code class="javascript">
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
</code></pre>

### Using Async/Await

<pre><code class="javascript">
async function getData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
</code></pre>

### Fetch Options

<pre><code class="javascript">
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
});
</code></pre>

### Response Methods

<pre><code class="javascript">
response.json()    // Parse as JSON
response.text()    // Parse as text
response.blob()    // Parse as Blob
response.ok        // true if status 200-299
response.status    // HTTP status code
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Fetch API</h2>

<p id="demo">Click to fetch data</p>

<button onclick="fetchPost()">Fetch Post</button>
<button onclick="fetchUsers()">Fetch Users</button>

<script>
// Fetch a single post
async function fetchPost() {
  document.getElementById("demo").innerHTML = "Loading...";
  
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1'
    );
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const post = await response.json();
    
    document.getElementById("demo").innerHTML = 
      "<strong>Title:</strong> " + post.title + "<br><br>" +
      "<strong>Body:</strong> " + post.body;
  } catch (error) {
    document.getElementById("demo").innerHTML = 
      "Error: " + error.message;
  }
}

// Fetch multiple users
async function fetchUsers() {
  document.getElementById("demo").innerHTML = "Loading...";
  
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/users?_limit=3'
    );
    const users = await response.json();
    
    let html = "<strong>Users:</strong><ul>";
    users.forEach(user => {
      html += "<li>" + user.name + " (" + user.email + ")</li>";
    });
    html += "</ul>";
    
    document.getElementById("demo").innerHTML = html;
  } catch (error) {
    document.getElementById("demo").innerHTML = 
      "Error: " + error.message;
  }
}
</script>

</body>
</html>`,
    },
    classes: {
      title: 'JavaScript Classes',
      content: `## JavaScript Classes

Classes are a template for creating objects. They encapsulate data with code to work on that data.

### Class Syntax

<pre><code class="javascript">
class ClassName {
  constructor() { ... }
  method1() { ... }
  method2() { ... }
}
</code></pre>

### Creating a Class

<pre><code class="javascript">
class Car {
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
  
  age() {
    return new Date().getFullYear() - this.year;
  }
}

let myCar = new Car("Ford", 2014);
</code></pre>

### Class Inheritance

<pre><code class="javascript">
class Model extends Car {
  constructor(name, year, model) {
    super(name, year);
    this.model = model;
  }
  
  show() {
    return this.name + " " + this.model;
  }
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Classes</h2>

<p id="demo"></p>

<script>
// Base class
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return this.name + " makes a sound.";
  }
}

// Inheritance
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  speak() {
    return this.name + " barks!";
  }
  
  info() {
    return this.name + " is a " + this.breed;
  }
}

class Cat extends Animal {
  speak() {
    return this.name + " meows!";
  }
}

// Create instances
const dog = new Dog("Rex", "German Shepherd");
const cat = new Cat("Whiskers");

document.getElementById("demo").innerHTML = 
  "<strong>Dog:</strong><br>" +
  dog.info() + "<br>" +
  dog.speak() + "<br><br>" +
  "<strong>Cat:</strong><br>" +
  cat.speak();
</script>

</body>
</html>`,
    },
    conditions: {
      title: 'JavaScript If Conditions',
      content: `## JavaScript If Conditions

Conditional statements are used to perform different actions based on different conditions.

### The if Statement

<pre><code class="javascript">
if (condition) {
  // block of code to execute if condition is true
}
</code></pre>

### The else Statement

<pre><code class="javascript">
if (condition) {
  // if true
} else {
  // if false
}
</code></pre>

### The else if Statement

<pre><code class="javascript">
if (condition1) {
  // if condition1 is true
} else if (condition2) {
  // if condition2 is true
} else {
  // if neither is true
}
</code></pre>

### Ternary Operator

<pre><code class="javascript">
let result = (condition) ? valueIfTrue : valueIfFalse;
</code></pre>

### Switch Statement

<pre><code class="javascript">
switch(expression) {
  case x:
    // code block
    break;
  case y:
    // code block
    break;
  default:
    // code block
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Conditions</h2>

<p id="demo"></p>

<script>
let hour = new Date().getHours();
let greeting;
let timeOfDay;

// if...else if...else
if (hour < 12) {
  greeting = "Good morning!";
  timeOfDay = "morning";
} else if (hour < 18) {
  greeting = "Good afternoon!";
  timeOfDay = "afternoon";
} else {
  greeting = "Good evening!";
  timeOfDay = "evening";
}

// Ternary operator
let isWeekend = (new Date().getDay() === 0 || new Date().getDay() === 6) 
  ? "Yes" : "No";

// Switch statement
let day;
switch (new Date().getDay()) {
  case 0: day = "Sunday"; break;
  case 1: day = "Monday"; break;
  case 2: day = "Tuesday"; break;
  case 3: day = "Wednesday"; break;
  case 4: day = "Thursday"; break;
  case 5: day = "Friday"; break;
  case 6: day = "Saturday"; break;
}

document.getElementById("demo").innerHTML = 
  greeting + "<br><br>" +
  "Current hour: " + hour + ":00<br>" +
  "Time of day: " + timeOfDay + "<br>" +
  "Today is: " + day + "<br>" +
  "Is it weekend? " + isWeekend;
</script>

</body>
</html>`,
    },
    loops: {
      title: 'JavaScript Loops',
      content: `## JavaScript Loops

Loops can execute a block of code a number of times.

### The for Loop

<pre><code class="javascript">
for (let i = 0; i < 5; i++) {
  // code to execute
}
</code></pre>

### The while Loop

<pre><code class="javascript">
while (condition) {
  // code to execute
}
</code></pre>

### The do...while Loop

<pre><code class="javascript">
do {
  // code to execute
} while (condition);
</code></pre>

### The for...in Loop (Objects)

<pre><code class="javascript">
for (let key in object) {
  // code to execute
}
</code></pre>

### The for...of Loop (Arrays)

<pre><code class="javascript">
for (let value of array) {
  // code to execute
}
</code></pre>

### Break and Continue

<pre><code class="javascript">
break;    // Exits the loop
continue; // Skips to next iteration
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Loops</h2>

<p id="demo"></p>

<script>
let output = "";

// for loop
output += "<strong>for loop (1-5):</strong> ";
for (let i = 1; i <= 5; i++) {
  output += i + " ";
}
output += "<br>";

// while loop
output += "<strong>while loop (countdown):</strong> ";
let count = 5;
while (count > 0) {
  output += count + " ";
  count--;
}
output += "Blast off!<br>";

// for...of (arrays)
const fruits = ["Apple", "Banana", "Orange"];
output += "<strong>for...of (fruits):</strong> ";
for (let fruit of fruits) {
  output += fruit + " ";
}
output += "<br>";

// for...in (objects)
const person = {name: "John", age: 30, city: "NY"};
output += "<strong>for...in (person):</strong> ";
for (let key in person) {
  output += key + "=" + person[key] + " ";
}
output += "<br>";

// break and continue
output += "<strong>skip 3, stop at 7:</strong> ";
for (let i = 1; i <= 10; i++) {
  if (i === 3) continue;
  if (i === 7) break;
  output += i + " ";
}

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    dates: {
      title: 'JavaScript Dates',
      content: `## JavaScript Dates

JavaScript Date objects represent a single moment in time.

### Creating Date Objects

<pre><code class="javascript">
new Date()                    // Current date/time
new Date(year, month, day)    // Specific date
new Date(milliseconds)        // From Unix timestamp
new Date(dateString)          // From date string
</code></pre>

### Getting Date Values

<pre><code class="javascript">
date.getFullYear()   // Get year (4 digits)
date.getMonth()      // Get month (0-11)
date.getDate()       // Get day of month (1-31)
date.getDay()        // Get day of week (0-6)
date.getHours()      // Get hours (0-23)
date.getMinutes()    // Get minutes (0-59)
date.getSeconds()    // Get seconds (0-59)
date.getTime()       // Get timestamp (ms)
</code></pre>

### Setting Date Values

<pre><code class="javascript">
date.setFullYear(2025)
date.setMonth(11)     // December
date.setDate(25)
date.setHours(12)
</code></pre>

### Formatting Dates

<pre><code class="javascript">
date.toDateString()      // "Wed Jan 15 2025"
date.toLocaleDateString() // Locale-specific
date.toISOString()       // "2025-01-15T..."
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Dates</h2>

<p id="demo"></p>

<script>
// Current date
const now = new Date();

// Get values
const year = now.getFullYear();
const month = now.getMonth();
const day = now.getDate();
const dayOfWeek = now.getDay();
const hours = now.getHours();
const minutes = now.getMinutes();

// Day names
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Create specific date
const birthday = new Date(2000, 0, 15); // Jan 15, 2000

// Calculate age
const age = Math.floor((now - birthday) / (365.25 * 24 * 60 * 60 * 1000));

// Format time
const timeStr = hours.toString().padStart(2, '0') + ":" + 
                minutes.toString().padStart(2, '0');

document.getElementById("demo").innerHTML = 
  "<strong>Current Date:</strong><br>" +
  "Full: " + now.toDateString() + "<br>" +
  "Year: " + year + "<br>" +
  "Month: " + months[month] + " (" + month + ")<br>" +
  "Day: " + day + "<br>" +
  "Day of Week: " + days[dayOfWeek] + "<br>" +
  "Time: " + timeStr + "<br><br>" +
  "<strong>Birthday (Jan 15, 2000):</strong><br>" +
  birthday.toDateString() + "<br>" +
  "Age: " + age + " years";
</script>

</body>
</html>`,
    },
    regexp: {
      title: 'JavaScript Regular Expressions',
      content: `## JavaScript Regular Expressions

A regular expression is a sequence of characters that forms a search pattern.

### Syntax

<pre><code class="javascript">
/pattern/modifiers;

// Example
/hello/i;  // Case-insensitive search for "hello"
</code></pre>

### Modifiers

<pre><code class="javascript">
i  // Case-insensitive matching
g  // Global match (find all)
m  // Multiline matching
</code></pre>

### Patterns

<pre><code class="javascript">
[abc]    // Any character in brackets
[0-9]    // Any digit
(x|y)    // x or y
\\d       // A digit
\\s       // Whitespace
\\b       // Word boundary
n+       // One or more n
n*       // Zero or more n
n?       // Zero or one n
n{3}     // Exactly 3 n's
</code></pre>

### RegExp Methods

<pre><code class="javascript">
test()   // Returns true/false
exec()   // Returns match array or null
</code></pre>

### String Methods with RegExp

<pre><code class="javascript">
match()    // Returns matches
replace()  // Replace matches
search()   // Returns position
split()    // Split by pattern
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Regular Expressions</h2>

<p id="demo"></p>

<script>
let output = "";

// Test for pattern
let text = "Hello World!";
let pattern = /world/i;
output += "Text: '" + text + "'<br>";
output += "Pattern /world/i test: " + pattern.test(text) + "<br><br>";

// Email validation
const emailPattern = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
const validEmail = "user@example.com";
const invalidEmail = "not-an-email";
output += "Email validation:<br>";
output += validEmail + ": " + emailPattern.test(validEmail) + "<br>";
output += invalidEmail + ": " + emailPattern.test(invalidEmail) + "<br><br>";

// Find all matches
const sentence = "The rain in Spain stays mainly in the plain.";
const matches = sentence.match(/ain/g);
output += "Find 'ain' in sentence:<br>";
output += "Matches: " + matches.length + " (" + matches.join(", ") + ")<br><br>";

// Replace with regex
const censored = sentence.replace(/ain/g, "***");
output += "Replace 'ain' with '***':<br>";
output += censored + "<br><br>";

// Phone number validation
const phonePattern = /^\\d{3}-\\d{3}-\\d{4}$/;
output += "Phone validation (xxx-xxx-xxxx):<br>";
output += "123-456-7890: " + phonePattern.test("123-456-7890") + "<br>";
output += "1234567890: " + phonePattern.test("1234567890");

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    json: {
      title: 'JavaScript JSON',
      content: `## JavaScript JSON

JSON stands for JavaScript Object Notation. It is a lightweight data-interchange format.

### JSON Syntax Rules

- Data is in name/value pairs
- Data is separated by commas
- Curly braces hold objects
- Square brackets hold arrays

### JSON Example

<pre><code class="javascript">
{
  "employees": [
    {"firstName": "John", "lastName": "Doe"},
    {"firstName": "Anna", "lastName": "Smith"}
  ]
}
</code></pre>

### JSON.parse()

Convert JSON string to JavaScript object.

<pre><code class="javascript">
const jsonString = '{"name":"John","age":30}';
const obj = JSON.parse(jsonString);
console.log(obj.name);  // "John"
</code></pre>

### JSON.stringify()

Convert JavaScript object to JSON string.

<pre><code class="javascript">
const obj = {name: "John", age: 30};
const jsonString = JSON.stringify(obj);
// '{"name":"John","age":30}'
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript JSON</h2>

<p id="demo"></p>

<script>
// JSON string
const jsonString = '{"name":"John","age":30,"city":"New York","skills":["JavaScript","Python","SQL"]}';

// Parse JSON to object
const person = JSON.parse(jsonString);

// Access properties
let output = "<strong>Parsed JSON:</strong><br>";
output += "Name: " + person.name + "<br>";
output += "Age: " + person.age + "<br>";
output += "City: " + person.city + "<br>";
output += "Skills: " + person.skills.join(", ") + "<br><br>";

// Create object and stringify
const product = {
  id: 1,
  name: "Laptop",
  price: 999.99,
  inStock: true,
  tags: ["electronics", "computer"]
};

const productJSON = JSON.stringify(product, null, 2);
output += "<strong>Object to JSON:</strong><br>";
output += "<pre>" + productJSON + "</pre><br>";

// JSON with arrays
const users = [
  {id: 1, name: "Alice"},
  {id: 2, name: "Bob"},
  {id: 3, name: "Charlie"}
];

output += "<strong>Array of objects:</strong><br>";
output += JSON.stringify(users);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    modules: {
      title: 'JavaScript Modules',
      content: `## JavaScript Modules

Modules allow you to break up your code into separate files and reuse code.

### Export

Named Exports:

<pre><code class="javascript">
// person.js
export const name = "Jesse";
export const age = 40;

// OR
const name = "Jesse";
const age = 40;
export { name, age };
</code></pre>

Default Exports:

<pre><code class="javascript">
// message.js
const message = () => {
  return "Hello World!";
};
export default message;
</code></pre>

### Import

Named Imports:

<pre><code class="javascript">
import { name, age } from "./person.js";
</code></pre>

Default Imports:

<pre><code class="javascript">
import message from "./message.js";
</code></pre>

### Module Features

- Modules are deferred by default
- Modules run in strict mode
- Modules have their own scope
- Each module is only evaluated once`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Modules</h2>

<p id="demo"></p>

<script>
// Note: Modules require a server environment
// Here we demonstrate the concept with regular code

// Simulating module exports
const MathModule = (function() {
  const PI = 3.14159;
  
  function add(a, b) {
    return a + b;
  }
  
  function multiply(a, b) {
    return a * b;
  }
  
  function circleArea(radius) {
    return PI * radius * radius;
  }
  
  // Export public API
  return {
    add,
    multiply,
    circleArea,
    PI
  };
})();

// Simulating module import/usage
const { add, multiply, circleArea, PI } = MathModule;

let output = "<strong>Module Pattern Demo:</strong><br><br>";
output += "PI: " + PI + "<br>";
output += "add(5, 3): " + add(5, 3) + "<br>";
output += "multiply(4, 7): " + multiply(4, 7) + "<br>";
output += "circleArea(5): " + circleArea(5).toFixed(2) + "<br><br>";

output += "<strong>ES6 Module Syntax:</strong><br>";
output += "<pre>";
output += "// math.js\\n";
output += "export const add = (a, b) => a + b;\\n";
output += "export default function multiply(a, b) { return a * b; }\\n\\n";
output += "// main.js\\n";
output += "import multiply, { add } from './math.js';\\n";
output += "</pre>";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    errors: {
      title: 'JavaScript Errors',
      content: `## JavaScript Errors

The try...catch statement handles errors gracefully.

### try...catch Syntax

<pre><code class="javascript">
try {
  // Code to try
} catch (err) {
  // Code to handle errors
} finally {
  // Code that runs regardless
}
</code></pre>

### The Error Object

<pre><code class="javascript">
try {
  throw new Error("Something went wrong");
} catch (err) {
  console.log(err.name);    // "Error"
  console.log(err.message); // "Something went wrong"
}
</code></pre>

### Error Types

<pre><code class="javascript">
EvalError      // Error in eval()
RangeError     // Number out of range
ReferenceError // Illegal reference
SyntaxError    // Syntax error
TypeError      // Wrong type
URIError       // Error in URI handling
</code></pre>

### Throwing Custom Errors

<pre><code class="javascript">
function checkAge(age) {
  if (age < 0) {
    throw new RangeError("Age cannot be negative");
  }
  return age;
}
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Error Handling</h2>

<p id="demo"></p>

<script>
let output = "";

// Basic try...catch
output += "<strong>Basic try...catch:</strong><br>";
try {
  let x = y; // y is not defined
} catch (err) {
  output += "Error caught: " + err.name + "<br>";
  output += "Message: " + err.message + "<br><br>";
}

// Throwing custom error
output += "<strong>Custom error:</strong><br>";
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero!");
  }
  return a / b;
}

try {
  let result = divide(10, 0);
} catch (err) {
  output += "Error: " + err.message + "<br><br>";
}

// finally block
output += "<strong>try...catch...finally:</strong><br>";
try {
  output += "Trying...<br>";
  // Uncomment to test error: throw new Error("Test error");
  output += "Success!<br>";
} catch (err) {
  output += "Error: " + err.message + "<br>";
} finally {
  output += "Finally block always runs!<br><br>";
}

// Input validation
output += "<strong>Input Validation:</strong><br>";
function validateAge(age) {
  if (isNaN(age)) throw new TypeError("Age must be a number");
  if (age < 0) throw new RangeError("Age cannot be negative");
  if (age > 150) throw new RangeError("Age seems unrealistic");
  return "Valid age: " + age;
}

try {
  output += validateAge(25) + "<br>";
  output += validateAge(-5);
} catch (err) {
  output += err.name + ": " + err.message;
}

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    sets: {
      title: 'JavaScript Sets',
      content: `## JavaScript Sets

A JavaScript Set is a collection of unique values.

### Creating a Set

<pre><code class="javascript">
// Create a Set
const letters = new Set(["a", "b", "c"]);

// Add values
letters.add("d");

// Check if value exists
letters.has("a");  // true

// Size
letters.size;  // 4
</code></pre>

### Set Methods

<pre><code class="javascript">
add(value)     // Add a new element
delete(value)  // Remove an element
has(value)     // Check if exists
clear()        // Remove all elements
forEach()      // Call function for each
values()       // Returns iterator
</code></pre>

### Use Cases

<pre><code class="javascript">
// Remove duplicates from array
const numbers = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(numbers)];
// [1, 2, 3]
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Sets</h2>

<p id="demo"></p>

<script>
let output = "";

// Create a Set
const fruits = new Set(["Apple", "Banana", "Orange"]);
output += "<strong>Initial Set:</strong> " + [...fruits].join(", ") + "<br>";
output += "Size: " + fruits.size + "<br><br>";

// Add elements
fruits.add("Mango");
fruits.add("Apple");  // Duplicate - won't be added
output += "<strong>After adding Mango and Apple:</strong><br>";
output += [...fruits].join(", ") + "<br>";
output += "Size: " + fruits.size + " (Apple not duplicated)<br><br>";

// Check existence
output += "<strong>Checking values:</strong><br>";
output += "Has 'Apple': " + fruits.has("Apple") + "<br>";
output += "Has 'Grape': " + fruits.has("Grape") + "<br><br>";

// Remove duplicates from array
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 5];
const uniqueNumbers = [...new Set(numbers)];
output += "<strong>Remove duplicates:</strong><br>";
output += "Original: [" + numbers.join(", ") + "]<br>";
output += "Unique: [" + uniqueNumbers.join(", ") + "]<br><br>";

// Set operations
const set1 = new Set([1, 2, 3, 4]);
const set2 = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...set1, ...set2]);

// Intersection
const intersection = new Set([...set1].filter(x => set2.has(x)));

output += "<strong>Set Operations:</strong><br>";
output += "Set1: [" + [...set1].join(", ") + "]<br>";
output += "Set2: [" + [...set2].join(", ") + "]<br>";
output += "Union: [" + [...union].join(", ") + "]<br>";
output += "Intersection: [" + [...intersection].join(", ") + "]";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    maps: {
      title: 'JavaScript Maps',
      content: `## JavaScript Maps

A Map holds key-value pairs where any value can be a key.

### Creating a Map

<pre><code class="javascript">
// Create a Map
const fruits = new Map([
  ["apples", 500],
  ["bananas", 300],
  ["oranges", 200]
]);
</code></pre>

### Map Methods

<pre><code class="javascript">
set(key, value)  // Add/update element
get(key)         // Get value by key
has(key)         // Check if key exists
delete(key)      // Remove element
clear()          // Remove all
size             // Number of elements
</code></pre>

### Map vs Object

<pre><code class="javascript">
// Map advantages:
// - Keys can be any type (objects, functions)
// - Maps are directly iterable
// - Size property available
// - Better performance for frequent adds/removes

const map = new Map();
const objKey = {id: 1};
map.set(objKey, "Object as key");
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Maps</h2>

<p id="demo"></p>

<script>
let output = "";

// Create a Map
const fruits = new Map([
  ["apples", 500],
  ["bananas", 300],
  ["oranges", 200]
]);

output += "<strong>Fruit inventory:</strong><br>";
fruits.forEach((value, key) => {
  output += key + ": " + value + "<br>";
});
output += "Size: " + fruits.size + "<br><br>";

// Add and update
fruits.set("grapes", 400);
fruits.set("apples", 550);  // Update

output += "<strong>After adding grapes, updating apples:</strong><br>";
output += "Apples: " + fruits.get("apples") + "<br>";
output += "Grapes: " + fruits.get("grapes") + "<br>";
output += "Has bananas: " + fruits.has("bananas") + "<br><br>";

// Using objects as keys
const user1 = {id: 1, name: "John"};
const user2 = {id: 2, name: "Jane"};

const userScores = new Map();
userScores.set(user1, 95);
userScores.set(user2, 88);

output += "<strong>Objects as keys:</strong><br>";
output += user1.name + "'s score: " + userScores.get(user1) + "<br>";
output += user2.name + "'s score: " + userScores.get(user2) + "<br><br>";

// Convert to array
const entriesArray = [...fruits.entries()];
output += "<strong>Map to Array:</strong><br>";
output += JSON.stringify(entriesArray);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    callbacks: {
      title: 'JavaScript Callbacks',
      content: `## JavaScript Callbacks

A callback is a function passed as an argument to another function.

### Callback Example

<pre><code class="javascript">
function myDisplayer(result) {
  console.log(result);
}

function myCalculator(num1, num2, callback) {
  let sum = num1 + num2;
  callback(sum);
}

myCalculator(5, 5, myDisplayer); // 10
</code></pre>

### Asynchronous Callbacks

<pre><code class="javascript">
// setTimeout callback
setTimeout(function() {
  console.log("Hello after 3 seconds");
}, 3000);

// setInterval callback
setInterval(function() {
  console.log("Runs every second");
}, 1000);
</code></pre>

### Callback Hell

<pre><code class="javascript">
// Nested callbacks become hard to read
getData(function(a) {
  getMoreData(a, function(b) {
    getEvenMoreData(b, function(c) {
      // This is "callback hell"
    });
  });
});
</code></pre>

This is why Promises and async/await were introduced.`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Callbacks</h2>

<p id="demo"></p>
<p id="timer"></p>

<button onclick="startTimer()">Start Timer</button>
<button onclick="stopTimer()">Stop Timer</button>

<script>
let output = "";
let intervalId = null;

// Simple callback
function calculate(num1, num2, callback) {
  let result = callback(num1, num2);
  return result;
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

output += "<strong>Callback Functions:</strong><br>";
output += "add(5, 3): " + calculate(5, 3, add) + "<br>";
output += "multiply(5, 3): " + calculate(5, 3, multiply) + "<br><br>";

// Array methods with callbacks
const numbers = [1, 2, 3, 4, 5];

output += "<strong>Array callbacks:</strong><br>";
output += "Original: [" + numbers + "]<br>";
output += "map(x => x*2): [" + numbers.map(x => x * 2) + "]<br>";
output += "filter(x => x>2): [" + numbers.filter(x => x > 2) + "]<br>";
output += "reduce(sum): " + numbers.reduce((a, b) => a + b) + "<br><br>";

document.getElementById("demo").innerHTML = output;

// Timer with callback
let seconds = 0;

function startTimer() {
  if (intervalId) return;
  seconds = 0;
  intervalId = setInterval(function() {
    seconds++;
    document.getElementById("timer").innerHTML = 
      "Timer: " + seconds + " seconds";
  }, 1000);
}

function stopTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    document.getElementById("timer").innerHTML = 
      "Timer stopped at " + seconds + " seconds";
  }
}
</script>

</body>
</html>`,
    },
    destructuring: {
      title: 'JavaScript Destructuring',
      content: `## JavaScript Destructuring

Destructuring makes it easy to extract values from arrays or properties from objects.

### Array Destructuring

<pre><code class="javascript">
const fruits = ["Apple", "Banana", "Orange"];

// Without destructuring
const a = fruits[0];
const b = fruits[1];

// With destructuring
const [x, y, z] = fruits;
// x = "Apple", y = "Banana", z = "Orange"
</code></pre>

### Object Destructuring

<pre><code class="javascript">
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
};

// Destructuring
const { firstName, lastName, age } = person;
</code></pre>

### Default Values

<pre><code class="javascript">
const [a = 1, b = 2] = [10];
// a = 10, b = 2 (default)
</code></pre>

### Rest Pattern

<pre><code class="javascript">
const [first, ...rest] = [1, 2, 3, 4, 5];
// first = 1, rest = [2, 3, 4, 5]
</code></pre>

### Nested Destructuring

<pre><code class="javascript">
const user = {
  name: "John",
  address: { city: "NYC", zip: "10001" }
};

const { name, address: { city } } = user;
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Destructuring</h2>

<p id="demo"></p>

<script>
let output = "";

// Array destructuring
const colors = ["red", "green", "blue", "yellow"];
const [first, second, ...rest] = colors;

output += "<strong>Array Destructuring:</strong><br>";
output += "Array: [" + colors.join(", ") + "]<br>";
output += "first: " + first + "<br>";
output += "second: " + second + "<br>";
output += "rest: [" + rest.join(", ") + "]<br><br>";

// Object destructuring
const person = {
  name: "John Doe",
  age: 30,
  email: "john@example.com",
  address: {
    city: "New York",
    country: "USA"
  }
};

const { name, age, email } = person;
const { address: { city, country } } = person;

output += "<strong>Object Destructuring:</strong><br>";
output += "name: " + name + "<br>";
output += "age: " + age + "<br>";
output += "email: " + email + "<br>";
output += "city: " + city + "<br>";
output += "country: " + country + "<br><br>";

// Rename during destructuring
const { name: fullName, age: years } = person;
output += "<strong>Renaming:</strong><br>";
output += "fullName: " + fullName + "<br>";
output += "years: " + years + "<br><br>";

// Function parameter destructuring
function displayUser({ name, age }) {
  return name + " is " + age + " years old";
}

output += "<strong>Function Parameter:</strong><br>";
output += displayUser(person);

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'dom-methods': {
      title: 'JavaScript DOM Methods',
      content: `## JavaScript DOM Methods

The DOM defines methods to access and manipulate HTML elements.

### Finding Elements

<pre><code class="javascript">
// By ID
document.getElementById("id")

// By class name
document.getElementsByClassName("class")

// By tag name
document.getElementsByTagName("tag")

// CSS selectors
document.querySelector("#id")
document.querySelectorAll(".class")
</code></pre>

### Changing Content

<pre><code class="javascript">
element.innerHTML = "New HTML content"
element.textContent = "New text content"
element.innerText = "New text (visible only)"
</code></pre>

### Changing Attributes

<pre><code class="javascript">
element.setAttribute("class", "newClass")
element.getAttribute("class")
element.removeAttribute("class")
element.hasAttribute("class")
</code></pre>

### Creating Elements

<pre><code class="javascript">
const div = document.createElement("div");
div.textContent = "New div";
parent.appendChild(div);
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2 id="title">DOM Methods</h2>

<div id="container">
  <p class="text">Paragraph 1</p>
  <p class="text">Paragraph 2</p>
  <p class="text">Paragraph 3</p>
</div>

<p id="demo"></p>

<button onclick="modifyDOM()">Modify DOM</button>
<button onclick="addElement()">Add Element</button>
<button onclick="removeElement()">Remove Last</button>

<script>
function modifyDOM() {
  // Change title
  document.getElementById("title").style.color = "blue";
  
  // Change all paragraphs
  const paragraphs = document.querySelectorAll(".text");
  paragraphs.forEach((p, i) => {
    p.style.backgroundColor = "lightyellow";
    p.textContent = "Modified paragraph " + (i + 1);
  });
  
  document.getElementById("demo").innerHTML = 
    "DOM modified! " + paragraphs.length + " paragraphs changed.";
}

function addElement() {
  const container = document.getElementById("container");
  const newP = document.createElement("p");
  newP.className = "text";
  newP.textContent = "New paragraph " + (container.children.length + 1);
  newP.style.backgroundColor = "lightgreen";
  container.appendChild(newP);
  
  document.getElementById("demo").innerHTML = 
    "Element added! Total: " + container.children.length;
}

function removeElement() {
  const container = document.getElementById("container");
  if (container.children.length > 0) {
    container.removeChild(container.lastElementChild);
    document.getElementById("demo").innerHTML = 
      "Last element removed! Remaining: " + container.children.length;
  } else {
    document.getElementById("demo").innerHTML = 
      "No elements to remove!";
  }
}
</script>

</body>
</html>`,
    },
    'event-listener': {
      title: 'JavaScript Event Listener',
      content: `## JavaScript addEventListener()

The addEventListener() method attaches an event handler to an element.

### Syntax

<pre><code class="javascript">
element.addEventListener(event, function, useCapture);
</code></pre>

### Common Events

<pre><code class="javascript">
"click"       // Mouse click
"dblclick"    // Double click
"mouseenter"  // Mouse enters element
"mouseleave"  // Mouse leaves element
"keydown"     // Key pressed
"keyup"       // Key released
"submit"      // Form submitted
"change"      // Input value changed
"load"        // Page loaded
"scroll"      // Page scrolled
</code></pre>

### Event Object

<pre><code class="javascript">
element.addEventListener("click", function(e) {
  e.target       // Element that triggered
  e.type         // Event type
  e.preventDefault()   // Prevent default action
  e.stopPropagation() // Stop bubbling
});
</code></pre>

### Remove Event Listener

<pre><code class="javascript">
element.removeEventListener("click", myFunction);
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Event Listeners</h2>

<div id="box" style="width:200px;height:100px;background:lightblue;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.3s;">
  Click or hover me!
</div>

<br>

<input type="text" id="input" placeholder="Type something...">

<p id="demo"></p>

<script>
const box = document.getElementById("box");
const input = document.getElementById("input");
const demo = document.getElementById("demo");

// Click event
box.addEventListener("click", function(e) {
  demo.innerHTML = "Clicked at: " + e.clientX + ", " + e.clientY;
  this.style.backgroundColor = getRandomColor();
});

// Mouse enter/leave
box.addEventListener("mouseenter", function() {
  this.style.transform = "scale(1.1)";
});

box.addEventListener("mouseleave", function() {
  this.style.transform = "scale(1)";
});

// Double click
box.addEventListener("dblclick", function() {
  demo.innerHTML = "Double clicked! Reset color.";
  this.style.backgroundColor = "lightblue";
});

// Input events
input.addEventListener("input", function(e) {
  demo.innerHTML = "Typing: " + e.target.value;
});

input.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    demo.innerHTML = "You pressed Enter! Value: " + this.value;
    this.value = "";
  }
});

// Focus/blur
input.addEventListener("focus", function() {
  this.style.boxShadow = "0 0 5px blue";
});

input.addEventListener("blur", function() {
  this.style.boxShadow = "none";
});

function getRandomColor() {
  const colors = ["lightgreen", "lightyellow", "lightpink", "lightcoral", "lightcyan"];
  return colors[Math.floor(Math.random() * colors.length)];
}
</script>

</body>
</html>`,
    },
    hoisting: {
      title: 'JavaScript Hoisting',
      content: `## JavaScript Hoisting

Hoisting is JavaScript's default behavior of moving declarations to the top.

### Variable Hoisting

<pre><code class="javascript">
// What you write:
console.log(x);  // undefined
var x = 5;

// How JavaScript interprets it:
var x;
console.log(x);  // undefined
x = 5;
</code></pre>

### let and const Hoisting

Variables declared with let and const are hoisted but not initialized. They are in a "temporal dead zone" from the start of the block until the declaration.

<pre><code class="javascript">
console.log(x);  // ReferenceError
let x = 5;
</code></pre>

### Function Hoisting

Function declarations are hoisted completely:

<pre><code class="javascript">
sayHello();  // Works!

function sayHello() {
  console.log("Hello!");
}
</code></pre>

Function expressions are not hoisted:

<pre><code class="javascript">
sayHello();  // TypeError

var sayHello = function() {
  console.log("Hello!");
};
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Hoisting</h2>

<p id="demo"></p>

<script>
let output = "";

// Function hoisting - works
output += "<strong>Function Declaration Hoisting:</strong><br>";
output += greet("World") + "<br><br>";

function greet(name) {
  return "Hello, " + name + "!";
}

// var hoisting
output += "<strong>var Hoisting:</strong><br>";
output += "x before declaration: " + x + "<br>";
var x = 5;
output += "x after assignment: " + x + "<br><br>";

// let/const - temporal dead zone
output += "<strong>let/const - Temporal Dead Zone:</strong><br>";
output += "Cannot access let/const before declaration.<br>";
output += "Uncommenting below would cause ReferenceError.<br><br>";
// console.log(y);  // ReferenceError
let y = 10;
output += "y after declaration: " + y + "<br><br>";

// Function expression not hoisted
output += "<strong>Function Expression:</strong><br>";
output += "Function expressions are NOT hoisted.<br>";
output += "var func is undefined until assignment.<br><br>";

var notHoisted = function() {
  return "This won't work if called before!";
};
output += "After assignment: " + notHoisted() + "<br><br>";

// Best practice
output += "<strong>Best Practice:</strong><br>";
output += "• Use let/const instead of var<br>";
output += "• Declare variables at the top<br>";
output += "• Initialize variables when declaring";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    strict: {
      title: 'JavaScript Strict Mode',
      content: `## JavaScript Strict Mode

"use strict" defines that JavaScript code should be executed in strict mode.

### Declaring Strict Mode

<pre><code class="javascript">
"use strict";
// All code is in strict mode

// Or in a function
function myFunction() {
  "use strict";
  // Function code in strict mode
}
</code></pre>

### What Strict Mode Prevents

<pre><code class="javascript">
"use strict";

x = 3.14;  // Error: x is not defined

delete x;  // Error: Cannot delete variables

function x(p1, p1) {}  // Error: Duplicate params

var obj = {};
Object.defineProperty(obj, "x", {value:0, writable:false});
obj.x = 3.14;  // Error: Cannot write to read-only

// Reserved keywords cannot be used as variable names
var let = 1;     // Error
var private = 1; // Error
</code></pre>

### Why Use Strict Mode?

- Makes it easier to write "secure" JavaScript
- Converts coding mistakes into errors
- Prevents accidental globals
- Makes eval() and arguments safer`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Strict Mode</h2>

<p id="demo"></p>

<script>
"use strict";

let output = "";

output += "<strong>Strict Mode Demo:</strong><br><br>";

// Must declare variables
let x = 10;
output += "Declared variable: x = " + x + "<br><br>";

// Without strict mode, this would create a global:
// y = 5;  // Error in strict mode!

output += "<strong>Strict Mode Catches:</strong><br>";
output += "• Undeclared variables<br>";
output += "• Writing to read-only properties<br>";
output += "• Deleting variables or functions<br>";
output += "• Duplicate parameter names<br>";
output += "• Reserved word usage<br><br>";

// Demonstrating with try-catch
output += "<strong>Error Examples:</strong><br>";

try {
  eval('z = 5');  // Would error: z is not defined
} catch (e) {
  output += "Error: " + e.message + "<br>";
}

// This works because variables are declared
let person = {name: "John"};
output += "Valid object: " + JSON.stringify(person) + "<br><br>";

// Functions in strict mode
function strictFunction() {
  "use strict";
  let local = "local variable";
  return local;
}

output += "<strong>Best Practice:</strong><br>";
output += "Always use 'use strict' at the beginning of files or functions.";

document.getElementById("demo").innerHTML = output;
</script>

</body>
</html>`,
    },
    'this': {
      title: 'JavaScript this Keyword',
      content: `## JavaScript this Keyword

The this keyword refers to an object, depending on how it is used.

### this in Different Contexts

<pre><code class="javascript">
// In an object method
const person = {
  name: "John",
  greet: function() {
    return "Hello, " + this.name;
  }
};

// Alone
console.log(this);  // Window object (in browser)

// In a function (strict mode)
function myFunction() {
  return this;  // undefined
}

// In an event handler
button.onclick = function() {
  this;  // The button element
};
</code></pre>

### Arrow Functions and this

Arrow functions don't have their own this. They inherit it from the parent scope.

<pre><code class="javascript">
const person = {
  name: "John",
  // Arrow function uses parent's this
  greet: () => "Hello, " + this.name  // Won't work!
};
</code></pre>

### Explicit Binding

<pre><code class="javascript">
call(thisArg, args)    // Call with this value
apply(thisArg, [args]) // Call with array of args
bind(thisArg)          // Returns new bound function
</code></pre>`,
      tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript this Keyword</h2>

<p id="demo"></p>

<button id="btn">Click me</button>

<script>
let output = "";

// this in object method
const person = {
  name: "John",
  age: 30,
  greet: function() {
    return "Hi, I'm " + this.name;
  },
  info: function() {
    return this.name + " is " + this.age;
  }
};

output += "<strong>this in Object Method:</strong><br>";
output += person.greet() + "<br>";
output += person.info() + "<br><br>";

// Arrow function inherits this
const obj = {
  name: "Object",
  regularFunc: function() {
    return "Regular: " + this.name;
  },
  arrowFunc: () => {
    return "Arrow: " + this.name;  // this is window/undefined
  }
};

output += "<strong>Regular vs Arrow Function:</strong><br>";
output += obj.regularFunc() + "<br>";
output += obj.arrowFunc() + " (inherits from parent)<br><br>";

// call, apply, bind
const user = { name: "Alice" };

function sayHello(greeting) {
  return greeting + ", " + this.name;
}

output += "<strong>call, apply, bind:</strong><br>";
output += "call: " + sayHello.call(user, "Hello") + "<br>";
output += "apply: " + sayHello.apply(user, ["Hi"]) + "<br>";

const boundFunc = sayHello.bind(user);
output += "bind: " + boundFunc("Hey") + "<br><br>";

document.getElementById("demo").innerHTML = output;

// this in event handler
document.getElementById("btn").addEventListener("click", function() {
  this.textContent = "Clicked!";
  this.style.backgroundColor = "lightgreen";
  // 'this' refers to the button
});
</script>

</body>
</html>`,
    },
  };

  return jsLessons[lessonSlug] || {
    title: 'Lesson',
    content: '# Coming Soon\n\nThis lesson content is being prepared.',
    tryItCode: `<!DOCTYPE html>
<html>
<body>

<h2>JavaScript Lesson</h2>
<p id="demo">This lesson is coming soon!</p>

<script>
// JavaScript code goes here
console.log("Hello, JavaScript!");
document.getElementById("demo").innerHTML = "JavaScript is awesome!";
</script>

</body>
</html>`,
  };
};

// Generate TypeScript lesson content