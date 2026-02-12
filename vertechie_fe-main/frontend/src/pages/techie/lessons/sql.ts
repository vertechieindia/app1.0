/**
 * SQL Tutorial - Lesson content for each lesson slug
 */
export const generateSQLLessonContent = (lessonSlug: string) => {
  const sqlLessons: Record<string, { title: string; content: string; tryItCode: string }> = {
    home: {
      title: 'SQL Tutorial',
      content: `
# Welcome to SQL Tutorial

SQL is the standard language for storing, manipulating, and retrieving data in databases.

## What is SQL?

- **SQL** stands for **Structured Query Language**
- SQL lets you access and manipulate relational databases
- SQL is an ANSI (American National Standards Institute) standard
- SQL can execute queries, insert/update/delete records, create tables, and more

## What Can SQL Do?

- Execute queries against a database
- Retrieve data from a database
- Insert, update, and delete records
- Create new databases and tables
- Set permissions on tables and views

## Relational Databases

Data in SQL is stored in **tables**. A table has **columns** (attributes) and **rows** (records).

<pre><code class="sql">
-- Example: A simple Customers table
-- Columns: id, name, city
-- Rows: each customer record
</code></pre>

In this tutorial you will learn SELECT, INSERT, UPDATE, DELETE, JOINs, and more.
      `,
      tryItCode: `-- Try SQL here (conceptual - run in your DB)
SELECT 'Hello, SQL!' AS greeting;

-- Create a sample table (syntax example)
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);`,
    },
    intro: {
      title: 'SQL Intro',
      content: `
# What is SQL?

SQL is a standard language for **relational database management systems** (RDBMS).

## Key Concepts

- **Database** – Organized collection of data
- **Table** – Data stored in rows and columns
- **Column** – One attribute (e.g., name, age)
- **Row** – One record (e.g., one customer)
- **Primary Key** – Unique identifier for each row

## Popular RDBMS

- **MySQL** – Open source, very popular
- **PostgreSQL** – Open source, feature-rich
- **SQL Server** – Microsoft
- **SQLite** – Lightweight, file-based
- **Oracle** – Enterprise

## SQL Subsets

- **DDL** – Data Definition (CREATE, ALTER, DROP)
- **DML** – Data Manipulation (SELECT, INSERT, UPDATE, DELETE)
- **DCL** – Data Control (GRANT, REVOKE)

We will focus on **DML** to query and modify data.
      `,
      tryItCode: `-- See what tables exist (example)
-- SHOW TABLES;   -- MySQL
-- SELECT * FROM information_schema.tables;  -- PostgreSQL

SELECT 1 + 1 AS result;`,
    },
    syntax: {
      title: 'SQL Syntax',
      content: `
# SQL Syntax

SQL keywords are **not case sensitive**. \`SELECT\` is the same as \`select\`.

## Statements

SQL statements end with a semicolon (\`;\`).

<pre><code class="sql">
SELECT * FROM customers;
INSERT INTO products (name, price) VALUES ('Widget', 9.99);
UPDATE orders SET status = 'shipped' WHERE id = 1;
DELETE FROM logs WHERE created_at < '2020-01-01';
</code></pre>

## Naming Rules

- Table and column names can use letters, numbers, underscore
- Some systems allow spaces (use quotes: \`"Order Details"\`)
- Avoid reserved words (SELECT, FROM, WHERE, etc.)

## Comments

<pre><code class="sql">
-- Single-line comment
/* Multi-line
   comment */
</code></pre>
      `,
      tryItCode: `-- SQL syntax examples
SELECT 10 AS ten;
SELECT 'Hello' AS greeting;

-- Comment: semicolon ends the statement
SELECT 2 * 3 AS product;`,
    },
    select: {
      title: 'SQL SELECT',
      content: `
# SQL SELECT

The \`SELECT\` statement is used to **retrieve data** from a database.

## Select All Columns

<pre><code class="sql">
SELECT * FROM customers;
</code></pre>

\`*\` means "all columns".

## Select Specific Columns

<pre><code class="sql">
SELECT name, email FROM customers;
SELECT id, name, created_at FROM orders;
</code></pre>

## Column Alias (AS)

<pre><code class="sql">
SELECT name AS customer_name, email AS contact FROM customers;
</code></pre>

## Literals and Expressions

<pre><code class="sql">
SELECT 'Active' AS status, 1 AS value;
SELECT name, price * 1.1 AS price_with_tax FROM products;
</code></pre>
      `,
      tryItCode: `-- SELECT examples (run against your DB)
SELECT * FROM users LIMIT 5;

-- Or use literals to test
SELECT 'Alice' AS name, 'alice@example.com' AS email
UNION ALL
SELECT 'Bob', 'bob@example.com';`,
    },
    where: {
      title: 'SQL WHERE',
      content: `
# SQL WHERE

The \`WHERE\` clause **filters rows** based on a condition.

## Basic Syntax

<pre><code class="sql">
SELECT * FROM customers WHERE country = 'USA';
SELECT * FROM products WHERE price > 100;
SELECT * FROM orders WHERE status = 'pending';
</code></pre>

## Comparison Operators

| Operator | Meaning |
|----------|---------|
| \`=\` | Equal |
| \`<>\` or \`!=\` | Not equal |
| \`>\` \`<\` \`>=\` \`<=\` | Greater, less, etc. |
| \`BETWEEN\` | In range (inclusive) |
| \`IN (a, b, c)\` | Match any of list |
| \`LIKE\` | Pattern match |
| \`IS NULL\` | Is null |

## Examples

<pre><code class="sql">
SELECT * FROM products WHERE price BETWEEN 10 AND 50;
SELECT * FROM users WHERE country IN ('USA', 'UK', 'CA');
SELECT * FROM customers WHERE name LIKE 'A%';
SELECT * FROM orders WHERE shipped_at IS NULL;
</code></pre>
      `,
      tryItCode: `-- WHERE examples
SELECT * FROM users WHERE id > 0;

SELECT 1 AS id, 'Test' AS name WHERE 1 = 1;`,
    },
    insert: {
      title: 'SQL INSERT',
      content: `
# SQL INSERT

The \`INSERT INTO\` statement adds **new rows** to a table.

## Insert One Row

<pre><code class="sql">
INSERT INTO customers (name, email, country)
VALUES ('Alice', 'alice@example.com', 'USA');
</code></pre>

Column order must match value order. Omitted columns get default or NULL (if allowed).

## Insert Multiple Rows

<pre><code class="sql">
INSERT INTO products (name, price) VALUES
  ('Widget', 9.99),
  ('Gadget', 19.99),
  ('Gizmo', 4.99);
</code></pre>

## Insert All Columns

If you supply values for every column in order, you can omit column names:

<pre><code class="sql">
INSERT INTO status_codes VALUES (1, 'Active'), (2, 'Inactive');
</code></pre>

Use this only when you are sure of column order.
      `,
      tryItCode: `-- INSERT examples (run in your DB)
-- INSERT INTO users (id, name, email) VALUES (1, 'Alice', 'alice@example.com');

-- Test with a temp/CTE
SELECT 1 AS id, 'Alice' AS name, 'alice@example.com' AS email;`,
    },
    update: {
      title: 'SQL UPDATE',
      content: `
# SQL UPDATE

The \`UPDATE\` statement **modifies existing rows** in a table.

## Basic Syntax

<pre><code class="sql">
UPDATE table_name
SET column1 = value1, column2 = value2
WHERE condition;
</code></pre>

## Example

<pre><code class="sql">
UPDATE customers SET country = 'USA' WHERE id = 5;
UPDATE products SET price = price * 1.1 WHERE category = 'Electronics';
UPDATE orders SET status = 'shipped', shipped_at = NOW() WHERE id = 100;
</code></pre>

## ⚠️ Important: WHERE Clause

**Always** use \`WHERE\` unless you intend to update every row:

<pre><code class="sql">
-- Updates ALL rows!
UPDATE users SET last_login = NOW();
</code></pre>

Omitting \`WHERE\` updates the entire table.
      `,
      tryItCode: `-- UPDATE syntax (run in your DB)
-- UPDATE users SET name = 'Alice Smith' WHERE id = 1;

SELECT 'Use UPDATE in your database' AS reminder;`,
    },
    delete: {
      title: 'SQL DELETE',
      content: `
# SQL DELETE

The \`DELETE\` statement **removes rows** from a table.

## Basic Syntax

<pre><code class="sql">
DELETE FROM table_name WHERE condition;
</code></pre>

## Examples

<pre><code class="sql">
DELETE FROM customers WHERE id = 10;
DELETE FROM logs WHERE created_at < '2023-01-01';
DELETE FROM temp_data WHERE session_id = 'abc123';
</code></pre>

## ⚠️ Important: WHERE Clause

**Always** use \`WHERE\` unless you intend to delete every row:

<pre><code class="sql">
-- Deletes ALL rows!
DELETE FROM users;
</code></pre>

To remove all rows but keep the table structure, \`TRUNCATE TABLE table_name;\` is often faster.
      `,
      tryItCode: `-- DELETE syntax (run in your DB)
-- DELETE FROM users WHERE id = 999;

SELECT 'Use DELETE in your database with care!' AS reminder;`,
    },
    join: {
      title: 'SQL JOIN',
      content: `
# SQL JOIN

**JOIN** combines rows from two or more tables based on a related column.

## Why JOIN?

Data is often split across tables (normalization). For example:

- \`orders\` – order_id, customer_id, total
- \`customers\` – customer_id, name, email

To get order details **with** customer name, you **join** orders and customers on \`customer_id\`.

## Types of JOINs

| Type | Description |
|------|-------------|
| **INNER JOIN** | Only matching rows from both tables |
| **LEFT JOIN** | All from left + matching from right |
| **RIGHT JOIN** | All from right + matching from left |
| **FULL OUTER JOIN** | All from both, match where possible |

## Basic Syntax

<pre><code class="sql">
SELECT columns
FROM table1
JOIN table2 ON table1.key = table2.key;
</code></pre>
      `,
      tryItCode: `-- JOIN example (conceptual)
SELECT o.id, o.total, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
LIMIT 5;`,
    },
    'inner-join': {
      title: 'SQL INNER JOIN',
      content: `
# SQL INNER JOIN

**INNER JOIN** returns only rows where there is a **match** in both tables.

## Syntax

<pre><code class="sql">
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
</code></pre>

## Example

<pre><code class="sql">
SELECT orders.id, orders.total, customers.name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;
</code></pre>

Only orders that have a matching customer appear. Orders with no customer (or customers with no orders) are excluded.

## With WHERE

<pre><code class="sql">
SELECT o.id, o.total, c.name
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
WHERE c.country = 'USA';
</code></pre>
      `,
      tryItCode: `-- INNER JOIN: only matching rows
SELECT a.id, a.name, b.value
FROM (SELECT 1 id, 'A' name) a
INNER JOIN (SELECT 1 id, 100 value) b ON a.id = b.id;`,
    },
    'left-join': {
      title: 'SQL LEFT JOIN',
      content: `
# SQL LEFT JOIN

**LEFT JOIN** (or LEFT OUTER JOIN) returns **all rows from the left table** and matching rows from the right. If no match, right columns are NULL.

## Syntax

<pre><code class="sql">
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;
</code></pre>

## Example

<pre><code class="sql">
SELECT customers.name, orders.id AS order_id
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id;
</code></pre>

Every customer appears. If a customer has no orders, \`order_id\` will be NULL.

Use LEFT JOIN when you want to keep **all** rows from the first table (e.g., all customers including those with no orders).
      `,
      tryItCode: `-- LEFT JOIN: all from left, match from right
SELECT a.id, a.name, b.value
FROM (SELECT 1 id, 'A' name UNION SELECT 2, 'B') a
LEFT JOIN (SELECT 1 id, 100 value) b ON a.id = b.id;`,
    },
    'right-join': {
      title: 'SQL RIGHT JOIN',
      content: `
# SQL RIGHT JOIN

**RIGHT JOIN** returns **all rows from the right table** and matching rows from the left. If no match, left columns are NULL.

## Syntax

<pre><code class="sql">
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;
</code></pre>

## Example

<pre><code class="sql">
SELECT customers.name, orders.id AS order_id
FROM orders
RIGHT JOIN customers ON orders.customer_id = customers.id;
</code></pre>

Every customer appears; orders without a matching customer would show NULL for customer name (if any).

**Note:** Not all databases support RIGHT JOIN (e.g., SQLite). You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the tables.
      `,
      tryItCode: `-- RIGHT JOIN (MySQL/PostgreSQL)
SELECT a.id, b.name
FROM (SELECT 1 id) a
RIGHT JOIN (SELECT 1 id, 'Right' name) b ON a.id = b.id;`,
    },
    'full-join': {
      title: 'SQL FULL OUTER JOIN',
      content: `
# SQL FULL OUTER JOIN

**FULL OUTER JOIN** (or FULL JOIN) returns **all rows** from both tables. Where there is no match, the other side is NULL.

## Syntax

<pre><code class="sql">
SELECT columns
FROM table1
FULL OUTER JOIN table2 ON table1.column = table2.column;
</code></pre>

## Example

<pre><code class="sql">
SELECT customers.name, orders.id
FROM customers
FULL OUTER JOIN orders ON customers.id = orders.customer_id;
</code></pre>

You get: all customers (with or without orders) and all orders (with or without customers). Unmatched sides are NULL.

**Note:** MySQL does not support FULL OUTER JOIN. Use \`LEFT JOIN ... UNION ... RIGHT JOIN\` to simulate it.
      `,
      tryItCode: `-- FULL OUTER JOIN (PostgreSQL/SQL Server)
-- SELECT * FROM a FULL OUTER JOIN b ON a.id = b.id;

-- Simulated with UNION (works in MySQL)
SELECT a.id, a.name, b.value FROM a LEFT JOIN b ON a.id = b.id
UNION
SELECT a.id, a.name, b.value FROM a RIGHT JOIN b ON a.id = b.id;`,
    },
  };

  return (
    sqlLessons[lessonSlug] || {
      title: 'SQL Lesson',
      content: '# Coming Soon\n\nThis lesson is being prepared.',
      tryItCode: '-- SQL example',
    }
  );
};
