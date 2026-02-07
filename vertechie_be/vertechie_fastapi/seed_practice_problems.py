"""
Seed script to create example coding problems in the database.

Usage (from project root):

    cd vertechie_be/vertechie_fastapi
    python -m seed_practice_problems

This will insert a small set of well-known problems into the
`problems` table and mark them as PUBLISHED so that the
`/api/v1/practice/problems` API (and the Practice page) can
display real data instead of mock data.
"""

import asyncio
import textwrap
from typing import List

from sqlalchemy import select, func

from app.db.session import AsyncSessionLocal
from app.models.practice import Problem, Difficulty, ProblemStatus, TestCase


# Starter code per problem (language -> code string)
# Input format matches test case input_data (e.g. "nums = [2,7,11,15], target = 9")
STARTER_CODES = {
    "Two Sum": {
        "python": '''# Two Sum - read input and print indices
import re
import ast

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        comp = target - n
        if comp in seen:
            return [seen[comp], i]
        seen[n] = i
    return []

# Parse input like "nums = [2,7,11,15], target = 9"
s = input().strip()
nums_match = re.search(r'\\[[^\\]]+\\]', s)
target_match = re.search(r'target\\s*=\\s*(-?\\d+)', s, re.I)
nums = ast.literal_eval(nums_match.group(0)) if nums_match else []
target = int(target_match.group(1)) if target_match else 0

result = two_sum(nums, target)
print(result)''',
    },
}


# LeetCode-style detailed problem definitions
PROBLEM_DEFINITIONS = [
    {
        "title": "Two Sum",
        "difficulty": Difficulty.EASY,
        "tags": ["array", "hash-table"],
        "description": """Given an array of integers `nums` and an integer `target`, return **indices of the two numbers** such that they add up to `target`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.""",
        "examples": [
            {
                "input": "nums = [2,7,11,15], target = 9",
                "output": "[0,1]",
                "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1].",
            },
            {
                "input": "nums = [3,2,4], target = 6",
                "output": "[1,2]",
                "explanation": "",
            },
            {
                "input": "nums = [3,3], target = 6",
                "output": "[0,1]",
                "explanation": "",
            },
        ],
        "constraints": """- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.""",
        "companies": ["Amazon", "Google", "Microsoft", "Meta"],
    },
    {
        "title": "Add Two Numbers",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["linked-list", "math"],
        "description": """You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit.

Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.""",
        "examples": [
            {
                "input": "l1 = [2,4,3], l2 = [5,6,4]",
                "output": "[7,0,8]",
                "explanation": "342 + 465 = 807.",
            },
            {
                "input": "l1 = [0], l2 = [0]",
                "output": "[0]",
                "explanation": "",
            },
        ],
        "constraints": """- The number of nodes in each linked list is in the range [1, 100].
- 0 <= Node.val <= 9
- It is guaranteed that the list represents a number that does not have leading zeros.""",
        "companies": ["Amazon", "Microsoft", "Bloomberg"],
    },
    {
        "title": "Longest Substring Without Repeating Characters",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["string", "sliding-window", "hash-table"],
        "description": """Given a string `s`, find the length of the **longest substring** without repeating characters.""",
        "examples": [
            {
                "input": 's = "abcabcbb"',
                "output": "3",
                "explanation": 'The answer is "abc", with the length of 3.',
            },
            {
                "input": 's = "bbbbb"',
                "output": "1",
                "explanation": 'The answer is "b", with the length of 1.',
            },
            {
                "input": 's = "pwwkew"',
                "output": "3",
                "explanation": 'The answer is "wke", with the length of 3. "pwke" is not a substring.',
            },
        ],
        "constraints": """- 0 <= s.length <= 5 * 10^4
- s consists of English letters, digits, symbols and spaces.""",
        "companies": ["Amazon", "Bloomberg", "Meta"],
    },
    {
        "title": "Median of Two Sorted Arrays",
        "difficulty": Difficulty.HARD,
        "tags": ["array", "binary-search", "divide-and-conquer"],
        "description": """Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be `O(log (m+n))`. """,
        "examples": [
            {
                "input": "nums1 = [1,3], nums2 = [2]",
                "output": "2.0",
                "explanation": "Merged array = [1,2,3] and median is 2.",
            },
            {
                "input": "nums1 = [1,2], nums2 = [3,4]",
                "output": "2.5",
                "explanation": "Merged array = [1,2,3,4] and median is (2+3)/2 = 2.5.",
            },
        ],
        "constraints": """- nums1.length == m
- nums2.length == n
- 0 <= m, n <= 1000
- 1 <= m + n <= 2000
- -10^6 <= nums1[i], nums2[i] <= 10^6
- nums1 and nums2 are both sorted in non-decreasing order.""",
        "companies": ["Google", "Uber", "Amazon"],
    },
    {
        "title": "Longest Palindromic Substring",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["string", "dynamic-programming", "expand-around-center"],
        "description": """Given a string `s`, return the **longest palindromic substring** in `s`.""",
        "examples": [
            {
                "input": 's = "babad"',
                "output": '"bab"',
                "explanation": '"aba" is also a valid answer.',
            },
            {
                "input": 's = "cbbd"',
                "output": '"bb"',
                "explanation": "",
            },
        ],
        "constraints": """- 1 <= s.length <= 1000
- s consists of only digits and English letters.""",
        "companies": ["Amazon", "Adobe"],
    },
    {
        "title": "Zigzag Conversion",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["string"],
        "description": """The string `PAYPALISHIRING` is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

```
P   A   H   N
A P L S I I G
Y   I   R
```

And then read line by line: `PAHNAPLSIIGYIR`.

Write the code that will take a string and make this conversion given a number of rows.""",
        "examples": [
            {
                "input": 's = "PAYPALISHIRING", numRows = 3',
                "output": '"PAHNAPLSIIGYIR"',
                "explanation": "",
            },
            {
                "input": 's = "PAYPALISHIRING", numRows = 4',
                "output": '"PINALSIGYAHRPI"',
                "explanation": "",
            },
        ],
        "constraints": """- 1 <= s.length <= 1000
- 1 <= numRows <= 1000""",
        "companies": ["Amazon"],
    },
    {
        "title": "Reverse Integer",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["math"],
        "description": """Given a signed 32-bit integer `x`, return `x` with its digits reversed.

If reversing `x` causes the value to go outside the signed 32-bit integer range `[-2^31, 2^31 - 1]`, then return `0`.""",
        "examples": [
            {
                "input": "x = 123",
                "output": "321",
                "explanation": "",
            },
            {
                "input": "x = -123",
                "output": "-321",
                "explanation": "",
            },
            {
                "input": "x = 120",
                "output": "21",
                "explanation": "",
            },
        ],
        "constraints": """- -2^31 <= x <= 2^31 - 1""",
        "companies": ["Bloomberg", "Microsoft"],
    },
    {
        "title": "Valid Parentheses",
        "difficulty": Difficulty.EASY,
        "tags": ["stack", "string"],
        "description": """Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:
- Open brackets are closed by the same type of brackets.
- Open brackets are closed in the correct order.""",
        "examples": [
            {"input": 's = "()"', "output": "true", "explanation": ""},
            {"input": 's = "()[]{}"', "output": "true", "explanation": ""},
            {"input": 's = "(]"', "output": "false", "explanation": ""},
        ],
        "constraints": """- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.""",
        "companies": ["Amazon", "Facebook"],
    },
    {
        "title": "Merge Two Sorted Lists",
        "difficulty": Difficulty.EASY,
        "tags": ["linked-list", "two-pointers"],
        "description": """You are given the heads of two **sorted** linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list and return its head.""",
        "examples": [
            {
                "input": "list1 = [1,2,4], list2 = [1,3,4]",
                "output": "[1,1,2,3,4,4]",
                "explanation": "",
            },
            {
                "input": "list1 = [], list2 = []",
                "output": "[]",
                "explanation": "",
            },
        ],
        "constraints": """- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.""",
        "companies": ["Amazon", "Google"],
    },
    {
        "title": "Maximum Subarray",
        "difficulty": Difficulty.MEDIUM,
        "tags": ["array", "dynamic-programming", "kadane"],
        "description": """Given an integer array `nums`, find the **subarray** with the largest sum, and return *its sum*.""",
        "examples": [
            {
                "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                "output": "6",
                "explanation": "Subarray [4,-1,2,1] has the largest sum 6.",
            },
            {
                "input": "nums = [1]",
                "output": "1",
                "explanation": "",
            },
        ],
        "constraints": """- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4""",
        "companies": ["Amazon", "Microsoft", "Apple"],
    },
]


def slugify(title: str) -> str:
    """Simple slug generator similar to the old mock code."""
    return (
        title.lower()
        .replace("(", " ")
        .replace(")", " ")
        .replace("[", " ")
        .replace("]", " ")
        .replace(",", " ")
        .replace("'", "")
        .replace('"', "")
        .replace("/", " ")
        .replace("\\", " ")
        .replace("  ", " ")
        .strip()
        .replace(" ", "-")
    )


def default_description(title: str) -> str:
    """Provide a short generic description so the detail page looks reasonable."""
    base = textwrap.dedent(
        """
        This is a classic coding interview problem.

        Implement a function to solve **{title}**. You will be given inputs as described
        in the problem statement and must return the expected output for each test case.

        Focus on writing clean, efficient code and consider both time and memory complexity.
        """
    ).strip()
    return base.format(title=title)


def _get_hidden_test_cases(title: str) -> List[dict]:
    """Generate additional hidden test cases for evaluation."""
    hidden_cases = {
        "Two Sum": [
            {"input": "nums = [1,2,3,4,5], target = 9", "output": "[3,4]"},
            {"input": "nums = [10,20,30], target = 50", "output": "[1,2]"},
        ],
        "Add Two Numbers": [
            {"input": "l1 = [9,9,9], l2 = [9,9,9]", "output": "[8,9,9,1]"},
        ],
        "Longest Substring Without Repeating Characters": [
            {"input": 's = "abcdef"', "output": "6"},
            {"input": 's = "dvdf"', "output": "3"},
        ],
        "Valid Parentheses": [
            {"input": 's = "([{}])"', "output": "true"},
            {"input": 's = "([)]"', "output": "false"},
        ],
        "Maximum Subarray": [
            {"input": "nums = [5,4,-1,7,8]", "output": "23"},
            {"input": "nums = [-1]", "output": "-1"},
        ],
    }
    return hidden_cases.get(title, [])


async def seed_problems() -> None:
    """Insert example problems into the database if they don't already exist."""
    async with AsyncSessionLocal() as session:
        # Determine current max problem_number so we can append after existing ones
        result = await session.execute(select(func.max(Problem.problem_number)))
        max_number = result.scalar() or 0
        next_number = max_number

        created: List[str] = []
        skipped: List[str] = []

        for definition in PROBLEM_DEFINITIONS:
            title = definition["title"]

            # If a problem with the same title already exists, update it with
            # the latest detailed description/examples instead of skipping.
            existing_result = await session.execute(
                select(Problem).where(Problem.title == title)
            )
            existing = existing_result.scalar_one_or_none()
            if existing:
                existing.description = definition.get(
                    "description", default_description(title)
                )
                existing.examples = definition.get("examples", [])
                existing.constraints = definition.get("constraints", "")
                existing.tags = definition.get("tags", [])
                existing.companies = definition.get("companies", [])
                existing.difficulty = definition["difficulty"]
                existing.status = ProblemStatus.PUBLISHED
                if title in STARTER_CODES:
                    existing.starter_code = STARTER_CODES[title]

                # Update test cases for existing problem
                problem_id = existing.id
                await session.commit()
                await session.refresh(existing)
                
                # Delete old test cases and recreate
                old_test_cases_result = await session.execute(
                    select(TestCase).where(TestCase.problem_id == problem_id)
                )
                old_test_cases = old_test_cases_result.scalars().all()
                for tc in old_test_cases:
                    await session.delete(tc)
                
                # Create new test cases from examples
                examples = definition.get("examples", [])
                for idx, example in enumerate(examples):
                    test_case = TestCase(
                        problem_id=problem_id,
                        input_data=example.get("input", ""),
                        expected_output=example.get("output", ""),
                        explanation=example.get("explanation"),
                        is_sample=True,  # All examples are sample test cases
                        is_hidden=False,
                        order=idx,
                    )
                    session.add(test_case)
                
                # Add a few hidden test cases for evaluation
                hidden_test_cases = _get_hidden_test_cases(title)
                for idx, hidden_tc in enumerate(hidden_test_cases):
                    test_case = TestCase(
                        problem_id=problem_id,
                        input_data=hidden_tc["input"],
                        expected_output=hidden_tc["output"],
                        explanation=None,
                        is_sample=False,
                        is_hidden=True,
                        order=len(examples) + idx,
                    )
                    session.add(test_case)
                
                await session.commit()
                skipped.append(title)
                continue

            next_number += 1

            problem = Problem(
                problem_number=next_number,
                title=title,
                slug=slugify(title),
                description=definition.get("description", default_description(title)),
                difficulty=definition["difficulty"],
                examples=definition.get("examples", []),
                constraints=definition.get("constraints", ""),
                time_limit_ms=2000,
                memory_limit_mb=256,
                supported_languages=[
                    "python",
                    "javascript",
                    "java",
                    "cpp",
                ],
                tags=definition.get("tags", []),
                companies=definition.get("companies", []),
                status=ProblemStatus.PUBLISHED,
                starter_code=STARTER_CODES.get(title, {}),
            )

            session.add(problem)
            await session.flush()  # Flush to get the problem ID
            await session.refresh(problem)
            problem_id = problem.id
            
            # Create test cases from examples
            examples = definition.get("examples", [])
            for idx, example in enumerate(examples):
                test_case = TestCase(
                    problem_id=problem_id,
                    input_data=example.get("input", ""),
                    expected_output=example.get("output", ""),
                    explanation=example.get("explanation"),
                    is_sample=True,  # Examples are sample test cases
                    is_hidden=False,
                    order=idx,
                )
                session.add(test_case)
            
            # Add hidden test cases for evaluation
            hidden_test_cases = _get_hidden_test_cases(title)
            for idx, hidden_tc in enumerate(hidden_test_cases):
                test_case = TestCase(
                    problem_id=problem_id,
                    input_data=hidden_tc["input"],
                    expected_output=hidden_tc["output"],
                    explanation=None,
                    is_sample=False,
                    is_hidden=True,
                    order=len(examples) + idx,
                )
                session.add(test_case)
            
            created.append(title)

        await session.commit()

        print("✅ Seeding complete.")
        if created:
            print("Created problems:")
            for t in created:
                print(f"  - {t}")
        if skipped:
            print("Skipped (already existed):")
            for t in skipped:
                print(f"  - {t}")


def main() -> None:
    asyncio.run(seed_problems())


if __name__ == "__main__":
    main()

