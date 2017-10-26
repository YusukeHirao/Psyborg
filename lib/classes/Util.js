"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ユーティリティ関数郡
 *
 * @since 0.3.4
 */
var Util = /** @class */ (function () {
    function Util() {
    }
    /**
     * 距離(px)と継続時間(ms)から速度(px/ms)を得る
     *
     * @since 0.3.4
     * @param distance 距離(px)
     * @param duration 継続時間(ms)
     * @return 速度(px/ms)
     */
    Util.getSpeed = function (distance, duration) {
        return distance / duration;
    };
    /**
     * 距離(px)と速度(px/ms)から継続時間(ms)を得る
     *
     * @since 0.3.4
     * @param distance 距離(px)
     * @param speed 速度(px/ms)
     * @return 継続時間(ms)
     */
    Util.getDuration = function (distance, speed) {
        return distance / speed;
    };
    /**
     * 継続時間(ms)と速度(px/ms)から距離(px)を得る
     *
     * @since 0.3.4
     * @param duration 継続時間(ms)
     * @param speed 速度(px/ms)
     * @return 距離(px)
     */
    Util.getDistance = function (duration, speed) {
        return duration * speed;
    };
    /**
     *
     * @test test/util.html
     */
    Util.getloopSeriesNumber = function (n, length) {
        var res;
        res = n % length;
        if (res === 0) {
            return res;
        }
        if (n < 0) {
            res = length + (Math.abs(n) % length * -1);
        }
        return res;
    };
    /**
     *
     * @param direction 0 or 1 or -1 0は一番近い数字を算出する
     * @test test/util2.getloopSeriesVector.js
     */
    Util.getloopSeriesVector = function (from, to, direction, length) {
        var vector;
        if (direction !== 0 && direction !== 1 && direction !== -1) {
            throw new RangeError('`direction` is must 1 or -1 or zero.');
        }
        if (direction === 0) {
            from = Util.getloopSeriesNumber(from, length);
            to = Util.getloopSeriesNumber(to, length);
            var to2 = from < to ? to - length : to + length;
            var dist = Math.abs(to - from);
            var dist2 = Math.abs(to2 - from);
            var resDist = Math.min(dist, dist2);
            if (dist === resDist) {
                vector = to < from ? dist * -1 : dist;
            }
            else {
                vector = to2 < from ? dist2 * -1 : dist2;
            }
        }
        else {
            if (from === to) {
                vector = length * direction;
            }
            else {
                if (from < to && direction === -1) {
                    to = Util.getloopSeriesNumber(to, length);
                    var to2 = to - length;
                    vector = to2 - from;
                }
                else if (to < from && direction === 1) {
                    to = Util.getloopSeriesNumber(to, length);
                    var to2 = to + length;
                    vector = to2 - from;
                }
                else {
                    vector = to - from;
                }
            }
        }
        return vector;
    };
    /**
     * 小数点切り捨て(0に近づける)
     *
     * @param num 対象の数値
     */
    Util.roundDown = function (num) {
        // parseIntの第一引数はstringが仕様
        return parseInt("" + num, 10);
    };
    /**
     * 小数点切り上げ(0から遠ざける)
     *
     * @param num 対象の数値
     */
    Util.roundUp = function (num) {
        if (0 < num) {
            return Math.ceil(num);
        }
        else {
            return Math.ceil(num * -1) * -1;
        }
    };
    return Util;
}());
exports.default = Util;
