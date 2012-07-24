var isNode = true;
try {
	var colors = require('colors');
} catch (e) {
	isNode = false;
}

exports.DEBUG = 3;
exports.INFO = 2;
exports.WARN = 1;
exports.ERROR = 0;
exports.NONE = -1;
exports.logLevel = exports.DEBUG;
exports.stripColors = false;

exports.debug = function(msg) {
	if (exports.logLevel >= exports.DEBUG) { printMessage(msg, 'info', 'cyan'); }
}

exports.info = function(msg) {
	if (exports.logLevel >= exports.INFO) { printMessage(msg, 'info', 'white'); }
}

exports.warn = function(msg) {
	if (exports.logLevel >= exports.WARN) { printMessage(msg, 'warn', 'yellow'); }
}

exports.error = function(msg) {
	if (exports.logLevel >= exports.ERROR) { printMessage(msg, 'error', 'red'); }
}


// Private functions and members
var levels = ['info','debug','error','warn'];
var has = function(array, item) {
	var len = array.length;
	for (var i = 0; i < len; i++) {
		if (array[i] === item) {
			return true;
		}
	}
	return false;
};
var isArray = function(object) {
	return Object.prototype.toString.call(object) === '[object Array]';
};

var formattedDate = function() {
	var date = new Date();
	var pad = function(val) {
		val += '';
		return val.length < 2 ? '0' + val : val;
	};  
	return date.getFullYear() + '-' + pad(date.getMonth()+1) + '-' + pad(date.getDate()) + ' ' + 
	       pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds());
};

function formatTag(t,m)
{
	var s = t;
	if (s.length < m)
	{
		for (var c=s.length;c<m;c++)
		{
			s+=' ';
		}
	}
	return s;
}

var printMessage = function(msg, level, color) {
	// Validate arguments
	msg = msg || '';
	level = level || 'info';
	level = has(levels, level) ? level : 'info';
	color = color || 'white';

	// Have to wrap in a function to avoid "Illegal invocation" error on android
	var logFunc = function(msg){console[level](msg)};

	function printLine(line) {
		if (isArray(line)) {
			for (var i = 0; i < line.length; i++) {
				printLine(line[i]);
			}
		} else {
			var tag = formattedDate() + ' -- [' + formatTag(level.toUpperCase(),5) + '] ';
			var str = (isNode ? tag.grey : tag) + (isNode ? line[color] : line);
			logFunc(str);
		}
	}
	printLine(msg);
};