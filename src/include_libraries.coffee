# global
window = @

# iOS6.0でスクロール中にタイマー関数が実行できない問題を解決するライブラリ
`
(function (window) {

		// This library re-implements setTimeout, setInterval, clearTimeout, clearInterval for iOS6.
		// iOS6 suffers from a bug that kills timers that are created while a page is scrolling.
		// This library fixes that problem by recreating timers after scrolling finishes (with interval correction).
		// This code is free to use by anyone (MIT, blabla).
		// Author: rkorving@wizcorp.jp

		if (!/OS 6_0.+like 0S X/i.test(window.navigator.userAgent)) {
			return;
		}

		var timeouts = {};
		var intervals = {};
		var orgSetTimeout = window.setTimeout;
		var orgSetInterval = window.setInterval;
		var orgClearTimeout = window.clearTimeout;
		var orgClearInterval = window.clearInterval;


		function createTimer(set, map, args) {
				var id, cb = args[0], repeat = (set === orgSetInterval);

				function callback() {
						if (cb) {
								cb.apply(window, arguments);

								if (!repeat) {
										delete map[id];
										cb = null;
								}
						}
				}

				args[0] = callback;

				id = set.apply(window, args);

				map[id] = { args: args, created: Date.now(), cb: cb, id: id };

				return id;
		}


		function resetTimer(set, clear, map, virtualId, correctInterval) {
				var timer = map[virtualId];

				if (!timer) {
						return;
				}

				var repeat = (set === orgSetInterval);

				// cleanup

				clear(timer.id);

				// reduce the interval (arg 1 in the args array)

				if (!repeat) {
						var interval = timer.args[1];

						var reduction = Date.now() - timer.created;
						if (reduction < 0) {
								reduction = 0;
						}

						interval -= reduction;
						if (interval < 0) {
								interval = 0;
						}

						timer.args[1] = interval;
				}

				// recreate

				function callback() {
						if (timer.cb) {
								timer.cb.apply(window, arguments);
								if (!repeat) {
										delete map[virtualId];
										timer.cb = null;
								}
						}
				}

				timer.args[0] = callback;
				timer.created = Date.now();
				timer.id = set.apply(window, timer.args);
		}


		window.setTimeout = function () {
				return createTimer(orgSetTimeout, timeouts, arguments);
		};


		window.setInterval = function () {
				return createTimer(orgSetInterval, intervals, arguments);
		};

		window.clearTimeout = function (id) {
				var timer = timeouts[id];

				if (timer) {
						delete timeouts[id];
						orgClearTimeout(timer.id);
				}
		};

		window.clearInterval = function (id) {
				var timer = intervals[id];

				if (timer) {
						delete intervals[id];
						orgClearInterval(timer.id);
				}
		};

		window.addEventListener('scroll', function () {
				// recreate the timers using adjusted intervals
				// we cannot know how long the scroll-freeze lasted, so we cannot take that into account

				var virtualId;

				for (virtualId in timeouts) {
						resetTimer(orgSetTimeout, orgClearTimeout, timeouts, virtualId);
				}

				for (virtualId in intervals) {
						resetTimer(orgSetInterval, orgClearInterval, intervals, virtualId);
				}
		});

}(window));
`

# CSS3のイージング関数 cubic-bezier をjQuery Animationで使用出来るライブラリ
`
/*!
 * Bez v1.0.10-g5ae0136
 * http://github.com/rdallasgray/bez
 *
 * A plugin to convert CSS3 cubic-bezier co-ordinates to jQuery-compatible easing functions
 *
 * With thanks to Nikolay Nemshilov for clarification on the cubic-bezier maths
 * See http://st-on-it.blogspot.com/2011/05/calculating-cubic-bezier-function.html
 *
 * Copyright 2011 Robert Dallas Gray. All rights reserved.
 * Provided under the FreeBSD license: https://github.com/rdallasgray/bez/blob/master/LICENSE.txt
*/jQuery.extend({bez:function(a){var b="bez_"+$.makeArray(arguments).join("_").replace(".","p");if(typeof jQuery.easing[b]!="function"){var c=function(a,b){var c=[null,null],d=[null,null],e=[null,null],f=function(f,g){return e[g]=3*a[g],d[g]=3*(b[g]-a[g])-e[g],c[g]=1-e[g]-d[g],f*(e[g]+f*(d[g]+f*c[g]))},g=function(a){return e[0]+a*(2*d[0]+3*c[0]*a)},h=function(a){var b=a,c=0,d;while(++c<14){d=f(b,0)-a;if(Math.abs(d)<.001)break;b-=d/g(b)}return b};return function(a){return f(h(a),1)}};jQuery.easing[b]=function(b,d,e,f,g){return f*c([a[0],a[1]],[a[2],a[3]])(d/g)+e}}return b}});
`