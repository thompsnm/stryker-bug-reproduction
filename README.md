# Stryker Bug Reproduction

While setting up mutation tests with Stryker, I noticed an issue where executing the mutation tests from a subdirectory caused them to fail in unexpected way. My debugging suggests this may be an issue with how Stryker sandboxes the files for tests.

## Repo Setup

There are two main failes in this repo:

### `src/comparator.js`

This file contains a class with two methods: `testedCompare` and `untestedCompare`. They are identical methods. Each of them take two arguments and returns `true` or `false` depending on if the arguments are the same.

### `test/comparator.test.js`

This file is runnable by Jest and contains tests for the `Comparator.testedCompare` function. No tests have been written for `Comparator.untestedCompare` by design.

## Reproduction Steps

### 1. Run the Mutation Tests from the Root Directory

If you are currently in the root directory, run:

```
$ npm install
$ npm run mutate
```

The result should look something like this:

```
> stryker-bug-reproduction@1.0.0 mutate /Users/nthompson/development/stryker-bug-reproduction
> stryker run

11:02:38 (59864) INFO ConfigReader Using stryker.conf.js in the current working directory.
11:02:38 (59864) INFO InputFileResolver Found 1 of 2 file(s) to be mutated.
11:02:38 (59864) INFO InitialTestExecutor Starting initial test run. This may take a while.
11:02:45 (59864) INFO InitialTestExecutor Initial test run succeeded. Ran 2 tests in 6 seconds (net 4012 ms, overhead 1753 ms).
11:02:45 (59864) INFO MutatorFacade 8 Mutant(s) generated
11:02:45 (59864) INFO SandboxPool Creating 4 test runners (based on CPU count)
Mutation testing  [==================================================] 100% (elapsed: <1m, remaining: n/a) 8/8 tested (4 survived, 0 timed out)

4. [Survived] BlockStatement
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:5:26
-       untestedCompare(a, b) {
-           return a === b;
-       }
+       untestedCompare(a, b) {}

Ran all tests for this mutant.
5. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return false;

Ran all tests for this mutant.
6. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return true;

Ran all tests for this mutant.
7. [Survived] EqualityOperator
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return a !== b;

Ran all tests for this mutant.
Ran 2.00 tests per mutant on average.
---------------|---------|----------|-----------|------------|----------|---------|
File           | % score | # killed | # timeout | # survived | # no cov | # error |
---------------|---------|----------|-----------|------------|----------|---------|
All files      |   50.00 |        4 |         0 |          4 |        0 |       0 |
 comparator.js |   50.00 |        4 |         0 |          4 |        0 |       0 |
---------------|---------|----------|-----------|------------|----------|---------|
11:02:56 (59864) INFO Stryker Done in 18 seconds.
```

Note that all mutants generated for `Comparator.testedCompare` have been killed, but all mutants generated for `Comparator.untestedCompare` have survived. This is the expected outcome.

### 2. Run the Mutation Tests from the `test/` Subdirectory

If you are currently in the root directory, run:

```
$ cd test
$ npm install
$ npm run mutate
```

The result should look something like this:

```
> stryker-bug-reproduction-test@1.0.0 mutate /Users/nthompson/development/stryker-bug-reproduction/test
> stryker run

11:12:01 (59998) INFO ConfigReader Using stryker.conf.js in the current working directory.
11:12:01 (59998) INFO InputFileResolver Found 1 of 2 file(s) to be mutated.
11:12:01 (59998) INFO InitialTestExecutor Starting initial test run. This may take a while.
11:12:08 (59998) INFO InitialTestExecutor Initial test run succeeded. Ran 2 tests in 6 seconds (net 4010 ms, overhead 1915 ms).
11:12:08 (59998) INFO MutatorFacade 8 Mutant(s) generated
11:12:08 (59998) INFO SandboxPool Creating 4 test runners (based on CPU count)
Mutation testing  [==================================================] 100% (elapsed: <1m, remaining: n/a) 8/8 tested (8 survived, 0 timed out)

0. [Survived] BlockStatement
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:1:24
-       testedCompare(a, b) {
-           return a === b;
-       }
+       testedCompare(a, b) {}

1. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:2:15
-           return a === b;
+           return false;

2. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:2:15
-           return a === b;
+           return true;

3. [Survived] EqualityOperator
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:2:15
-           return a === b;
+           return a !== b;

4. [Survived] BlockStatement
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:5:26
-       untestedCompare(a, b) {
-           return a === b;
-       }
+       untestedCompare(a, b) {}

5. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return false;

6. [Survived] ConditionalExpression
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return true;

7. [Survived] EqualityOperator
/Users/nthompson/development/stryker-bug-reproduction/src/comparator.js:6:15
-           return a === b;
+           return a !== b;

Ran 0.00 tests per mutant on average.
---------------|---------|----------|-----------|------------|----------|---------|
File           | % score | # killed | # timeout | # survived | # no cov | # error |
---------------|---------|----------|-----------|------------|----------|---------|
All files      |    0.00 |        0 |         0 |          8 |        0 |       0 |
 comparator.js |    0.00 |        0 |         0 |          8 |        0 |       0 |
---------------|---------|----------|-----------|------------|----------|---------|
11:12:09 (59998) INFO Stryker Done in 7 seconds.
```

Notice that none of the mutants were killed.

## Additional Notes

Looking at the contents of the `.stryker-tmp` directory while the mutation tests are running seems to reveal an issue with the sandbox that may be the root cause of this bug. Here are the contents when running from the root directory:

```
$ ls .stryker-tmp/
sandbox6001238
$ ls .stryker-tmp/sandbox6001238/
node_modules	src		test
```

Here are the contents when running from the `test/` subdirectory:

```
$ ls .stryker-tmp/
sandbox7632888	src
$ ls .stryker-tmp/sandbox7632888/
comparator.test.js	node_modules
```

Notice that the `src/` directory was copied into the root `.stryker-tmp` directory rather than the `sandboxXXXXXXX` directory.
