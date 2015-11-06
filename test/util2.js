var fs = require('fs');
var should = require('should');
var psyborgFile = fs.readFileSync('./jquery.psyborg.js', 'utf8');
var $ = jQuery = {
	extend: function() {},
	fn: {}
};

eval(psyborgFile);

describe('psyborg.Util.getloopSeriesVector', function () {

	it('0 to 0 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 0, 0, 7).should.eql(0);
	});

	it('0 left to 0 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 0, +1, 7).should.eql(7);
	});

	it('3 left to 3 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(3, 3, +1, 7).should.eql(7);
	});

	it('0 left to 7 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 7, +1, 7).should.eql(7);
	});

	it('0 right to 7 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 7, -1, 7).should.eql(-7);
	});

	it('3 left to 1 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(3, 1, +1, 7).should.eql(5);
	});

	it('3 right to 1 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(3, 1, -1, 7).should.eql(-2);
	});

	it('3 left to 2 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(3, 2, +1, 7).should.eql(6);
	});

	it('3 right to 2 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(3, 2, -1, 7).should.eql(-1);
	});

	it('6 left to 3 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(6, 3, +1, 7).should.eql(4);
	});

	it('6 right to 3 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(6, 3, -1, 7).should.eql(-3);
	});

	it('0 left to 3 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 3, +1, 7).should.eql(3);
	});

	it('0 right to 3 of 0-6', function() {
		psyborg.Util.getloopSeriesVector(0, 3, -1, 7).should.eql(-4);
	});

	it('3 left to 10 of 0-3', function() {
		psyborg.Util.getloopSeriesVector(3, 10, +1, 4).should.eql(7);
	});

	it('3 right to 2 of 0-3', function() {
		psyborg.Util.getloopSeriesVector(3, 2, -1, 4).should.eql(-1);
	});

	it('0 to 0 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, 0, 0, 2).should.eql(0);
	});

	it('0 left to 0 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, 0, +1, 2).should.eql(2);
	});

	it('0 left to 1 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, 1, +1, 2).should.eql(1);
	});

	it('0 left to 2 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, 2, +1, 2).should.eql(2);
	});

	it('0 right to -1 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, -1, -1, 2).should.eql(-1);
	});

	it('0 right to -2 of 0-1', function() {
		psyborg.Util.getloopSeriesVector(0, -2, -1, 2).should.eql(-2);
	});

	it('4 to 2 of 0-11', function() {
		psyborg.Util.getloopSeriesVector(4, 2, 0, 12).should.eql(-2);
	});
});