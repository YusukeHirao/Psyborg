module psyborg {

	/**!
	 * ユーティリティ関数郡
	 *
	 * @class Util
	 * @since 0.3.4
	 */
	export class Util {

		/**!
		 * 距離(px)と継続時間(ms)から速度(px/ms)を得る
		 *
		 * @method getSpeed
		 * @since 0.3.4
		 * @static
		 * @param {number} distance 距離(px)
		 * @param {number} duration 継続時間(ms)
		 * @return {number} 速度(px/ms)
		 */
		static getSpeed (distance:number, duration:number):number {
			return distance / duration;
		}

		/**!
		 * 距離(px)と速度(px/ms)から継続時間(ms)を得る
		 *
		 * @method getDuration
		 * @since 0.3.4
		 * @static
		 * @param {number} distance 距離(px)
		 * @param {number} speed 速度(px/ms)
		 * @return {number} 継続時間(ms)
		 */
		static getDuration (distance:number, speed:number):number {
			return distance / speed;
		}

		/**!
		 * 継続時間(ms)と速度(px/ms)から距離(px)を得る
		 *
		 * @method getDistance
		 * @since 0.3.4
		 * @static
		 * @param {number} duration 継続時間(ms)
		 * @param {number} speed 速度(px/ms)
		 * @return {number} 距離(px)
		 */
		static getDistance (duration:number, speed:number):number {
			return duration * speed;
		}

		/**!
		 *
		 * @test test/util.html
		 */
		static getloopSeriesNumber (n:number, length:number):number {
			var res:number;
			res = n % length;
			if (res === 0) {
				return res;
			}
			if (n < 0) {
				res = length + (Math.abs(n) % length * -1);
			}
			return res;
		}

		/**!
		 *
		 * @param {number} direction 0 or 1 or -1 0は一番近い数字を算出する
		 * @test test/util2.getloopSeriesVector.js
		 */
		static getloopSeriesVector (from:number, to:number, direction:number, length:number):number {
			var to2:number = NaN;
			var vector:number;
			var dist:number;
			var dist2:number;
			var resDist:number;
			if (direction !== 0 && direction !== 1 && direction !== -1) {
				throw new RangeError('`direction` is must 1 or -1 or zero.');
			}
			if (direction === 0) {
				from = Util.getloopSeriesNumber(from, length);
				to = Util.getloopSeriesNumber(to, length);
				to2 = from < to ? to - length : to + length;
				dist = Math.abs(to - from);
				dist2 = Math.abs(to2 - from);
				resDist = Math.min(dist, dist2);
				if (dist === resDist) {
					vector = to < from ? dist * -1 : dist;
				} else {
					vector = to2 < from ? dist2 * -1 : dist2;
				}
			} else {
				if (from === to) {
					vector = length * direction;
				} else {
					if (from < to && direction === -1) {
						to = Util.getloopSeriesNumber(to, length);
						to2 = to - length;
						vector = to2 - from;
					} else if (to < from && direction === 1) {
						to = Util.getloopSeriesNumber(to, length);
						to2 = to + length;
						vector = to2 - from;
					} else {
						vector = to - from;
					}
				}
			}
			return vector;
		}

	}

}