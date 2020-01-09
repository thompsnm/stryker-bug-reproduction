module.exports = function(config) {
  config.set({
    mutator: "javascript",
    packageManager: "npm",
    reporters: ["clear-text", "progress"],
    testRunner: "jest",
    transpilers: [],
    coverageAnalysis: "off",
    files: [
      './comparator.test.js',
      '../src/comparator.js'
    ],
    mutate: [
      '../src/comparator.js'
    ]
  });
};
