/**
 * Prebuilt coding assessment pack for HR: 2 easy, 2 medium, 2 hard; 3 test cases each.
 * Stdin/stdout text; aligns with job judge string compare (trim, newlines).
 */

import type { CodingQuestion, TestCase } from '../types/jobPortal';

const tc = (input: string, expectedOutput: string): TestCase => ({
  id: `tc-${Math.random().toString(36).slice(2, 10)}`,
  input,
  expectedOutput,
});

const defaults = {
  requireFullScreen: true as const,
  blockCopyPaste: true as const,
  maxTabSwitches: 2,
  sqlSchema: '',
  expectedOutput: '',
};

/** Raw templates (ids assigned in builder). */
const RAW: Array<Omit<CodingQuestion, 'id'>> = [
  {
    question: 'Sum of Two Integers',
    difficulty: 'easy',
    description:
      'Read two integers from stdin (space-separated on one line). Print their sum as a single integer on one line.',
    starterCode:
      '# Read two integers and print their sum\n# Python example:\n# a, b = map(int, input().split())\n# print(a + b)\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 20,
    sampleInput: '4 5',
    sampleOutput: '9',
    testCases: [tc('3 4', '7'), tc('10 20', '30'), tc('0 0', '0')],
    ...defaults,
  },
  {
    question: 'Reverse a String',
    difficulty: 'easy',
    description:
      'Read one line of text from stdin. Print the same characters in reverse order. No extra spaces or newlines beyond the reversed string line.',
    starterCode:
      '# Read one line and print it reversed\n# s = input().strip()\n# print(s[::-1])\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 20,
    sampleInput: 'hello',
    sampleOutput: 'olleh',
    testCases: [tc('abc', 'cba'), tc('x', 'x'), tc('flow', 'wolf')],
    ...defaults,
  },
  {
    question: 'Maximum of Three Numbers',
    difficulty: 'medium',
    description:
      'Read three integers from stdin (space-separated). Print the largest of the three.',
    starterCode:
      '# a, b, c = map(int, input().split())\n# print(max(a, b, c))\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 25,
    sampleInput: '3 9 5',
    sampleOutput: '9',
    testCases: [tc('1 2 3', '3'), tc('10 4 10', '10'), tc('-1 -5 -2', '-1')],
    ...defaults,
  },
  {
    question: 'Count Words',
    difficulty: 'medium',
    description:
      'Read one line from stdin. Count how many whitespace-separated words it contains. Print the count as an integer.',
    starterCode:
      '# print(len(input().split()))\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 25,
    sampleInput: 'one two three',
    sampleOutput: '3',
    testCases: [tc('hello', '1'), tc('a b c d', '4'), tc('   spaced   words  ', '2')],
    ...defaults,
  },
  {
    question: 'Greatest Common Divisor (GCD)',
    difficulty: 'hard',
    description:
      'Read two positive integers a and b from stdin (space-separated). Print their greatest common divisor.',
    starterCode:
      '# Use Euclidean algorithm\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 30,
    sampleInput: '48 18',
    sampleOutput: '6',
    testCases: [tc('17 13', '1'), tc('100 25', '25'), tc('14 21', '7')],
    ...defaults,
  },
  {
    question: 'Nth Fibonacci Number',
    difficulty: 'hard',
    description:
      'Read a single integer n from stdin (1 ≤ n ≤ 30). The Fibonacci sequence is defined as F(1)=1, F(2)=1, and F(n)=F(n-1)+F(n-2) for n>2. Print F(n) as a single integer.',
    starterCode:
      '# n = int(input())\n# compute F(n) with F(1)=F(2)=1\n',
    allowedLanguages: ['python', 'javascript', 'java'],
    timeLimitMinutes: 30,
    sampleInput: '6',
    sampleOutput: '8',
    testCases: [tc('1', '1'), tc('2', '1'), tc('10', '55')],
    ...defaults,
  },
];

function normalizeQuestion(raw: CodingQuestion): CodingQuestion {
  return {
    id: raw.id,
    question: raw.question ?? '',
    description: raw.description ?? '',
    difficulty: raw.difficulty ?? 'medium',
    starterCode: raw.starterCode ?? '',
    allowedLanguages:
      Array.isArray(raw.allowedLanguages) && raw.allowedLanguages.length > 0
        ? raw.allowedLanguages.map((x) => String(x).trim().toLowerCase())
        : ['javascript', 'python', 'java'],
    timeLimitMinutes: raw.timeLimitMinutes ?? 30,
    sampleInput: raw.sampleInput ?? '',
    sampleOutput: raw.sampleOutput ?? '',
    expectedOutput: raw.expectedOutput ?? '',
    testCases: Array.isArray(raw.testCases)
      ? raw.testCases.map((t, j) => ({
          id: t.id || `tc-${raw.id}-${j}`,
          input: t.input,
          expectedOutput: t.expectedOutput,
        }))
      : [],
    requireFullScreen: raw.requireFullScreen !== false,
    blockCopyPaste: raw.blockCopyPaste !== false,
    maxTabSwitches: typeof raw.maxTabSwitches === 'number' ? raw.maxTabSwitches : 2,
    sqlSchema: raw.sqlSchema ?? '',
  };
}

/**
 * Returns 6 fresh coding questions (2 easy, 2 medium, 2 hard), each with 3 test cases.
 */
export function buildAssessmentTemplatePack(): CodingQuestion[] {
  const stamp = Date.now();
  return RAW.map((partial, i) =>
    normalizeQuestion({
      ...(partial as CodingQuestion),
      id: `q-${stamp}-${i}`,
    })
  );
}
