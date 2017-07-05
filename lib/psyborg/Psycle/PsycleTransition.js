"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 遷移プロセス管理
 *
 * @since 0.1.0
 * @param name トランジション名
 * @param process プロセス
 */
var PsycleTransition = (function () {
    function PsycleTransition(name, process) {
        this.name = name;
        $.extend(this, process);
    }
    /**
     * 遷移プロセス生成・登録
     *
     * @since 0.1.0
     * @param processList プロセスリスト
     */
    PsycleTransition.create = function (processList) {
        for (var transitionName in processList) {
            if (processList.hasOwnProperty(transitionName)) {
                var transition = new PsycleTransition(transitionName, processList[transitionName]);
                PsycleTransition.transitions[transitionName] = transition;
            }
        }
    };
    /**
     * プロセスリスト
     *
     * @since 0.1.0
     * @default = {}
     */
    PsycleTransition.transitions = {};
    return PsycleTransition;
}());
exports.default = PsycleTransition;
