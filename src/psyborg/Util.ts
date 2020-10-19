/**
 * ユーティリティ関数郡
 *
 * @since 0.3.4
 */
export default class Util {
	/**
	 * 距離(px)と継続時間(ms)から速度(px/ms)を得る
	 *
	 * @since 0.3.4
	 * @param distance 距離(px)
	 * @param duration 継続時間(ms)
	 * @return 速度(px/ms)
	 */
	public static getSpeed(distance: number, duration: number): number {
		return distance / duration;
	}

	/**
	 * 距離(px)と速度(px/ms)から継続時間(ms)を得る
	 *
	 * @since 0.3.4
	 * @param distance 距離(px)
	 * @param speed 速度(px/ms)
	 * @return 継続時間(ms)
	 */
	public static getDuration(distance: number, speed: number): number {
		return distance / speed;
	}

	/**
	 * 継続時間(ms)と速度(px/ms)から距離(px)を得る
	 *
	 * @since 0.3.4
	 * @param duration 継続時間(ms)
	 * @param speed 速度(px/ms)
	 * @return 距離(px)
	 */
	public static getDistance(duration: number, speed: number): number {
		return duration * speed;
	}

	/**
	 *
	 * @test test/util.html
	 */
	public static getloopSeriesNumber(n: number, length: number): number {
		let res: number;
		res = n % length;
		if (res === 0) {
			return res;
		}
		if (n < 0) {
			res = length + (Math.abs(n) % length) * -1;
		}
		return res;
	}

	/**
	 *
	 * @param direction 0 or 1 or -1 0は一番近い数字を算出する
	 * @test test/util2.getloopSeriesVector.js
	 */
	public static getloopSeriesVector(from: number, to: number, direction: number, length: number): number {
		let vector: number;
		if (direction !== 0 && direction !== 1 && direction !== -1) {
			throw new RangeError('`direction` is must 1 or -1 or zero.');
		}
		if (direction === 0) {
			from = Util.getloopSeriesNumber(from, length);
			to = Util.getloopSeriesNumber(to, length);
			const to2 = from < to ? to - length : to + length;
			const dist = Math.abs(to - from);
			const dist2 = Math.abs(to2 - from);
			const resDist = Math.min(dist, dist2);
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
					const to2 = to - length;
					vector = to2 - from;
				} else if (to < from && direction === 1) {
					to = Util.getloopSeriesNumber(to, length);
					const to2 = to + length;
					vector = to2 - from;
				} else {
					vector = to - from;
				}
			}
		}
		return vector;
	}

	/**
	 * 小数点切り捨て(0に近づける)
	 *
	 * @param num 対象の数値
	 */
	public static roundDown(num: number): number {
		// parseIntの第一引数はstringが仕様
		return parseInt(`${num}`, 10);
	}

	/**
	 * 小数点切り上げ(0から遠ざける)
	 *
	 * @param num 対象の数値
	 */
	public static roundUp(num: number): number {
		if (0 < num) {
			return Math.ceil(num);
		} else {
			return Math.ceil(num * -1) * -1;
		}
	}
}
