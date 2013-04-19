'use strict'

# ## Library Check
unless @jQuery then throw new ReferenceError 'jQuery is not defind'

# ## Constants
NAMESPACE = 'Psyborg'
VERSION = '0.1.0'

# ## Alias
global = @
Math = global.Math
setTimeout = global.setTimeout
clearTimeout = global.clearTimeout
setInterval = global.setInterval
clearInterval = global.clearInterval
isNaN = global.isNaN
$ = global.jQuery
Deferred = $.Deferred
Animation = $.Animation
Callbacks = $.Callbacks
noop = $.noop # 空関数
extend = $.extend # プロパティマージ
ajax = $.ajax # Ajax
proxy = $.proxy # thisコンテキスト指定
each = $.each # 配列オブジェクトループ
map = $.map # 配列各要素処理(null/undefined除外)
grep = $.grep # 配列フィルタリング
trim = $.trim # 文字列トリム
camelCase = $.camelCase # キャメルケース化
contains = $.contains # DOM内包判定
_inArray = $.inArray # 配列インデックス検索
isPlainObject = $.isPlainObject
isEmptyObject = $.isEmptyObject
isNumeric = $.isNumeric
isArray = $.isArray
isFunction = $.isFunction

# ## DOM
w = global
d = w.document
dE = d.documentElement
$w = $ w
$d = $ d

hasnt = (property) ->
	return property is undefined

# ## Variables
hasntAddEventListener = hasnt w.addEventListener
hasntPosStyle = hasnt dE.style.posTop
isTouchable = !hasnt(w.ontouchstart) || !!w.navigator.msPointerEnabled
isIE = !!d.uniqueID
ltIE6 = hasntAddEventListener && hasnt dE.style.maxHeight
ltIE7 = hasntAddEventListener && hasnt d.querySelectorAll
ltIE8 = hasntAddEventListener && hasnt d.getElementsByClassName
ltIE9 = isIE && hasnt w.Worker
isIE6 = isIE && ltIE6
isIE7 = isIE && ltIE7 && !ltIE6
isIE8 = isIE && ltIE8 && !ltIE7
isIE9 = isIE && ltIE9 && !ltIE8
isIE10 = isIE && !ltIE9
isMoz = !!w.sidebar
isOpera = !!w.opera
isWebkit = !d.uniqueID && !isOpera && !isMoz && !!w.localStorage
isChrome = isWebkit && !hasnt d.webkitHidden
isSafari = isWebkit && !isChrome && !isTouchable
ltSafari4 = isSafari && hasnt w.matchMedia
ltSafari5 = isSafari && hasnt w.FileReader
isSafari4 = isSafari && ltSafari4
isSafari5 = isSafari && ltSafari5 && !ltSafari4
isSafari6 = isSafari && !ltSafari5
isMobileIE = isTouchable && isIE10
isMobileWebkit = isTouchable && isWebkit
isMobileChrome = isMobileWebkit && isChrome
isAndroid = isMobileWebkit && hasnt w.EventSource
ltAndroid21 = isAndroid && hasnt w.onhashchange
ltAndroid22 = isAndroid && hasnt w.Blob
ltAndroid23 = isAndroid && hasnt w.FileReader
ltAndroid3 = isAndroid && hasnt w.ArrayBuffer
isAndroid21 = isAndroid && ltAndroid21
isAndroid22 = isAndroid && ltAndroid22 && !ltAndroid21
isAndroid23 = isAndroid && ltAndroid23 && !ltAndroid22
isAndroid3 = isAndroid && ltAndroid3 && !ltAndroid23
isAndroid4 = isAndroid && !ltAndroid3
isMobileSafari = isMobileWebkit && !isAndroid && !isMobileChrome

# ## Functions
createUID = ->
	return parseInt(new Date().valueOf() + setTimeout(noop, 0), 10).valueOf().toString(16)

createDiv = ->
	return d.createElement 'div'

inArray = (array, needle) ->
	for item in array
		if item is needle
			return yes
	return no

isString = (string) ->
	return string is String string

cssTop = do ->
	unless hasntPosStyle
		name = 'posTop'
		unit = 0
	else
		name = 'top'
		unit = 'px'
	return ($elem, val) ->
		$elem[0].style[name] = val + unit

cssLeft = do ->
	unless hasntPosStyle
		name = 'posLeft'
		unit = 0
	else
		name = 'left'
		unit = 'px'
	return ($elem, val) ->
		$elem[0].style[name] = val + unit

cssWidth = do ->
	unless hasntPosStyle
		name = 'posWidth'
		unit = 0
	else
		name = 'width'
		unit = 'px'
	return ($elem, val) ->
		$elem[0].style[name] = val + unit

cssHeight = do ->
	unless hasntPosStyle
		name = 'posHeight'
		unit = 0
	else
		name = 'height'
		unit = 'px'
	return ($elem, val) ->
		$elem[0].style[name] = val + unit

cssOpacity = do ->
	return ($elem, val) ->
		if ltIE8
			$elem[0].style.filter = "filter:alpha(Opcity=#{val * 100})"
		else
			$elem[0].style.opacity = val

# ## Checking Support for CSS3 and Event
#
# CSS3 の `Transfrom` `Transition` `Animation` とそれらのイベント、および `requestAnimationFrame` `performance` の対応状況のチェック。
#
# **CSS Style オブジェクトで参照できるプロパティ名が格納される**
#
# - Transform
# - Transition
# - Animation
#
# **`addEventListener` の第一引数で利用できるイベント名**
#
# - TransitionEnd
# - AnimationStart
# - AnimationIteration
# - AnimationEnd
#
# **`window`オブジェクト(グローバルオブジェクト)から参照できるアニメーションフレーム関数名**
#
# - RequestAnimationFrame
# - CancelAnimationFrame
#
# **`window`オブジェクト(グローバルオブジェクト)から参照できる`Performance`オブジェクトのプロパティ名**
#
# `Performance`オブジェクトでなくても参照できるプロパティとしてほとんどのブラウザで存在はする。
#
# - Performance
#
# **`Performance`オブジェクトのタイマーメソッドのメソッド名**
#
# `requestAnimationFrame` 関数のコールバック関数に渡される第一引数と経過時間を計算するときに必要となる。
#
# - PerformanceNow
#
supportCSS3 = do ->
	result = {}
	cssStyleDeclaration = createDiv().style # Dummy CSSStyleDeclaration Object
	venderPrefix = [
		'Webkit'
		'Moz'
		'O'
		'Ms'
		''
	]
	cssProps = [
		'Transform'
		'Transition'
		'Animation'
	]
	eventProps = [
		'TransitionEnd'
		'AnimationStart'
		'AnimationIteration'
		'AnimationEnd'
	]
	requestAnimationFrameMethods = [
		'RequestAnimationFrame'
		'CancelAnimationFrame'
		'Performance'
	]
	for p in cssProps.concat eventProps, requestAnimationFrameMethods
		result[p] = null
	for prefix in venderPrefix
		for cssProp in cssProps
			patterns = [
				prefix + cssProp
				prefix.toUpperCase() + cssProp
				prefix.toLowerCase() + cssProp
				prefix.toLowerCase() + cssProp.toLowerCase()
			]
			for pattern in patterns
				if cssStyleDeclaration[pattern] isnt undefined
					result[cssProp] = pattern
		for eventName in eventProps
			patterns = [
				prefix + eventName
				prefix.toUpperCase() + eventName
				prefix.toLowerCase() + eventName
				prefix.toLowerCase() + eventName.toLowerCase()
			]
			for pattern, i in patterns
				if w['on' + pattern] isnt undefined
					result[eventName] = pattern
		for method in requestAnimationFrameMethods
			patterns = [
				prefix + method
				prefix.toUpperCase() + method
				prefix.toLowerCase() + method
				prefix.toLowerCase() + method.toLowerCase()
			]
			for pattern in patterns
				if w[pattern] isnt undefined
					result[method] = pattern
	result['PerformanceNow'] = result.Performance and isFunction result.Performance.now
	return result
# * * *