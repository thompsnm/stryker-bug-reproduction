var Comparator = require('../src/comparator');

describe('Comparator', function() {
    var comparator;

    beforeEach(function() {
        comparator = new Comparator();
    });

    describe('testedCompare', function() {
        test('returns true when comparing two equal things', function(done) {
            // Added timeout to make it easier to inspect .stryker-tmp before it is cleaned up
            setTimeout(function() {
                expect(comparator.testedCompare(1, 1)).toBe(true);
                done();
            }, 4000);
        });

        test('returns false when comparing two unequal things', function() {
            expect(comparator.testedCompare(1, 'a')).toBe(false);
        });
    });

    describe('untestedCompare', function() {
        // Missing test coverage D:
    });
});
