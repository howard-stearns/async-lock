"use strict";
/*jslint node: true */
var assert = require('assert');
var mocha = require('mocha'), describe = mocha.describe, it = mocha.it;
var lock = require('../index').lock;
var lockMultiple = require('../index').lockMultiple;

describe('async-lock', function () {
	it('locked inner requires outer unlock', function (done) {
		var outerUnlocked = false;
		lock('test', function (unlockOuter) {
			lock('test', function (unlock) { assert.ok(outerUnlocked); unlock(); done(); });
			outerUnlocked = true;
			unlockOuter();
		});
	});
	it('accepts falsey key without actually locking', function (done) {
		var outerUnlocked = false;
		lock('', function (unlockOuter) { // Note !outerUnlocked assertion.
			lock('', function (unlock) { assert.ok(!outerUnlocked); unlock(); done(); });
			outerUnlocked = true;
			unlockOuter();
		});
	});
	it('accepts arrays of keys', function (done) {
		var outerUnlocked = false;
		lockMultiple(['a', 'b', 'c'], function (unlockOuter) {
			lock('b', function (unlock) { assert.ok(outerUnlocked); unlock(); done(); });
			outerUnlocked = true;
			unlockOuter();
		});
	});
});
