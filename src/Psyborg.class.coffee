class Psyborg
	# ## プライベート関数

	# ### 最適なポジション値を返す
	# - static -> relative
	# - relative -> relative
	# - absolute -> absolute
	# - fixed -> fixed
	getPositionState = ($target) ->
		position = $target.css 'position'
		if position is undefined or position is null or position is '' or position is 'static'
			return 'relative'
		else
			return position

	# ### 背景画像URLの取得
	getBackgroundImage = ($elem) ->
		bgImgValue = $elem.css 'background-image'
		src = bgImgValue.replace /^url\("?([^"]+)"?\)$/i, '$1' # url() の除去
		return src

	# ### 背景色の取得
	getBackgroundColor = ($elem) ->
		bgColorValue = $elem.css 'background-color'
		if bgColorValue.indexOf('r') is 0
			rgba = bgColorValue
				.replace(/\s+/ig, '') # 空白の除去
				.replace /^rgba?\(([0-9,.%]+)\)/, '$1' # rgba() の除去
			rgba = rgba.split(',')
			for color, i in rgba
				rgba[i] = int color
			if rgba.length is 3
				rgba.push 1
			return rgba
		else if bgColorValue.indexOf('#') is 0
			hex = bgColorValue.substring 1 # '#'の除去
			if hex.length is 3
				hex = hex.replace /^([0-9a-f])([0-9a-f])([0-9a-f])$/i, '$1$1$2$2$3$3'
			r = hex.substring 0, 2
			g = hex.substring 2, 4
			b = hex.substring 4, 6
			r = parseInt r, 16
			g = parseInt g, 16
			b = parseInt b, 16
			return [r, g, b, 1]
		else
			return [0, 0, 0, 0]

	# ### 3x3行列の乗算
	multiMatrix3x3 = (matrix...) ->
		res = [
			1, 0, 0
			0, 1, 0
			0, 0, 1
		]
		# 再帰関数
		multi = (m, n) ->
			return [
				m[0] * n[0] + m[1] * n[3] + m[2] * n[6], m[0] * n[1] + m[1] * n[4] + m[2] * n[7], m[0] * n[2] + m[1] * n[5] + m[2] * n[8]
				m[3] * n[0] + m[4] * n[3] + m[5] * n[6], m[3] * n[1] + m[4] * n[4] + m[5] * n[7], m[3] * n[2] + m[4] * n[5] + m[5] * n[8]
				m[6] * n[0] + m[7] * n[3] + m[8] * n[6], m[6] * n[1] + m[7] * n[4] + m[8] * n[7], m[6] * n[2] + m[5] * n[5] + m[6] * n[8]
			]
		for m in matrix
			res = multi m, res
		return res

	# * * *

	# ## プロパティ
	uid: null
	$: null
	$ctn: null
	$wrp: null
	$bg: null
	$hit: null
	_$demension: null
	_$position: null
	_$transform: null
	_width: 0
	_height: 0
	_top: 0
	_left: 0
	_zIndex: 0
	_zoom: 1
	_opacity: 1
	_x: 0
	_y: 0
	_rotate: 0
	_scaleX: 1
	_scaleY: 1
	_skewX: 0
	_skewY: 0
	_colorR: 0
	_colorG: 0
	_colorB: 0
	_colorA: 0
	_backgroundImage: null
	_position: null
	_originWidth: 0
	_originHeight: 0

	# * * *

	# ## コンストラクタ
	constructor: (jQueryObjectOrSelectors, jQueryORDocumentContext) ->
		unless @ instanceof Psyborg
			return new Psyborg jQueryObjectOrSelectors, jQueryORDocumentContext
		# ユニークID設定
		uid = createUID()
		className = "#{NAMESPACE} _#{NAMESPACE}#{uid}"
		@uid = uid

		# 要素取得
		@$ = $ jQueryObjectOrSelectors, jQueryORDocumentContext

		# 初期値プロパティをセット
		@setPropertiesByComputedValues @$
		@_originWidth = @_width
		@_originHeight = @_height

		# コア要素設定
		coreClass = "_#{NAMESPACE}_core"
		@$.addClass [className, coreClass].join ' '
		@$.css
			position: 'absolute'
			zIndex: 1
			background: 'none'

		# コンテナ要素生成/設定
		ctnClass = "_#{NAMESPACE}_container"
		$ctn = $ createDiv className, ctnClass
		@$.wrap $ctn
		@$ctn = @$.parent()
		@$ctn.css
			position: @_position
			width: @_originWidth
			height: @_originHeight

		# ラップ要素生成/設定
		wrpClass = "_#{NAMESPACE}_wrapper"
		$wrp = $ createDiv className, wrpClass
		@$ctn.wrapInner $wrp
		@$wrp = @$ctn.children()
		@$wrp.css
			position: 'absolute'
			zIndex: 0

		# バックグラウンド要素生成/設定
		bgClass = "_#{NAMESPACE}_background"
		$bg = $ createDiv className, bgClass
		$bg.appendTo @$wrp
		@$bg = $bg
		@$bg.css
			overflow: 'hidden'
			position: 'absolute'
			zIndex: 0
			backgroundPosition: '0 0'
			backgroundRepeat: 'no-repeat'
			backgroundAttachment: 'scroll'
			backgroundSize: '100% 100%'

		# ヒットエリア要素生成/設定
		hitClass = "_#{NAMESPACE}_hitarea"
		$hit = $ createDiv className, hitClass
		$hit.insertBefore @$wrp
		@$hit = $hit
		@$hit.css
			position: 'absolute'
			zIndex: 1

		# コレクション
		@_$demension = @$wrp
			.add(@$hit)
			.add(@$)
			.add(@$bg)
		@_$position = @$ctn
		@_$transform = @$wrp.add @$hit

		# スタイルの反映
		@update()

	# * * *

	# ## メソッド

	# ### プロパティセット
	# 表示されている状態の要素スタイルをプロパティにセット
	setPropertiesByComputedValues: ($origin) ->
		@_width = $origin.width()
		@_height = $origin.height()
		@_top = int $origin.css position: 'top'
		@_left =  int $origin.css position: 'left'
		@_zIndex = int $origin.css 'z-index'
		@_zoom = int $origin.css 'zoom'
		@_opacity = parseFloat $origin.css 'opacity'
		@_backgroundImage = getBackgroundImage @$
		@_position = getPositionState @$
		[
			@_colorR
			@_colorG
			@_colorB
			@_colorA
		] = getBackgroundColor @$
		return @

	# ###
	updateDemension: () ->
		# @_$demension.height @_height
		# @_$demension.width @_width
		$instance = @
		@_$demension.each ->
			if @style.posWidth isnt undefined
				@style.posWidth = $instance._width
				@style.posHeight = $instance._height
			else
				@style.width = $instance._width + 'px'
				@style.height = $instance._height + 'px'
		return @

	updateTransform: () ->
		# 水平移動のマトリクス
		translateMatrix = [
			1, 0, @_x
			0, 1, @_y,
			0, 0, 1
		]
		# 拡縮のマトリクス
		scaleMatrix = [
			@_scaleX, 0, 0
			0, @_scaleY, 0
			0, 0, 1
		]
		# 回転のマトリクス
		rad = @_rotate * Math.PI / 180
		rotateMatrix = [
			Math.cos(rad), -Math.sin(rad), 0
			Math.sin(rad), Math.cos(rad), 0
			0, 0, 1
		]
		# 傾きのマトリクス
		skewXMatrix = [
			1, Math.tan(@_skewX * Math.PI / 180), 0
			0, 1, 0
			0, 0, 1
		]
		skewYMatrix = [
			1, 0, 0
			Math.tan(@_skewY * Math.PI / 180), 1, 0
			0, 0, 1
		]
		matrix = multiMatrix3x3 rotateMatrix, translateMatrix, scaleMatrix, skewXMatrix, skewYMatrix
		M11 = matrix[0]
		M12 = matrix[3]
		M21 = matrix[1]
		M22 = matrix[4]
		if ltIE8
			@_$transform.css
				filter: """
					progid:DXImageTransform.Microsoft.Matrix(
						M11=#{M11},
						M12=#{M12},
						M21=#{M21},
						M22=#{M22},
						FilterType = 'bilinear',
						SizingMethod='auto expand'
					)
				"""
				top: @_y
				left: @_x
		else
			@_$transform.css
				transform: """
					matrix(
						#{M11}, #{M12},
						#{M21}, #{M22},
						#{@_x},
						#{@_y}
					)
				"""
		return @

	# ###
	updateOpacity: () ->
		if ltIE8
			if 0 < @_opacity < 1
				@$wrp.css
					filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=#{@_opacity * 100})"
		else
			@$wrp.css
				opacity: @_opacity
		return @

	# ###
	updateBackground: () ->
		if ltIE8
			filter = []
			# #### 背景色
			if 1 <= @_colorA
				@$bg.css
					backgroundColor: "rgb(#{@_colorR}, #{@_colorG}, #{@_colorB})"
			else if @_colorA <= 0
				@$bg.css
					backgroundColor: 'transparent'
			else
				color = [
					'#'
					(@_colorA * 255).toString 16
					@_colorR.toString 16
					@_colorG.toString 16
					@_colorB.toString 16
				].join('')
				filter.push "progid:DXImageTransform.Microsoft.gradient(startcolorstr=#{color}, endcolorstr=#{color}, gradienttype=0)"
			# #### 背景画像
			if @_backgroundImage
				filter.push "progid:DXImageTransform.Microsoft.AlphaImageLoader(Src=#{@_backgroundImage},SizingMethod=scale)"
			# #### 反映
			@$bg.css
				filter: filter.join ' '
		else
			@$bg.css
				backgroundImage: "url(#{@_backgroundImage})"
				backgroundColor: "rgba(#{@_colorR}, #{@_colorG}, #{@_colorB}, #{@_colorA})"
		return @


	# ### 設定プロパティのレンダリング反映
	# **この段階でリフロー発生**
	update: () ->
		@updateDemension()
		@updateBackground()
		@updateOpacity()
		@updateTransform()
		@_$position.css
			top: @_top
			left: @_left
			zIndex: @_zIndex
			zoom: @_zoom
		@_$transform
		return @

	# ### 幅の取得/設定
	width: (val, setRelative) ->
		# 取得
		unless val?
			return @_width
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @width()
			@_width = setValue
			@update()
			return @

	# ### 高さの取得/設定
	height: (val, setRelative) ->
		# 取得
		unless val?
			return @_height
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @height()
			@_height = setValue
			@update()
			return @

	# ### 不透明度の取得/設定
	opacity: (val, setRelative) ->
		# 取得
		unless val?
			return @_opacity
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @opacity()
			@_opacity = setValue
			@update()
			return @

	# ### 水平位置の取得/設定
	x: (val, setRelative) ->
		# 取得
		unless val?
			return @_x
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @x()
			@_x = setValue
			@update()
			return @

	# ### 垂直位置の取得/設定
	y: (val, setRelative) ->
		# 取得
		unless val?
			return @_y
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @y()
			@_y = setValue
			@update()
			return @

	# ### 横拡縮の取得/設定
	scaleX: (val, setRelative) ->
		# 取得
		unless val?
			return @_scaleX
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @scaleX()
			@_scaleX = setValue
			@update()
			return @

	# ### 縦拡縮の取得/設定
	scaleY: (val, setRelative) ->
		# 取得
		unless val?
			return @_scaleY
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @scaleY()
			@_scaleY = setValue
			@update()
			return @

	# ### 回転の取得/設定
	rotate: (val, setRelative) ->
		# 取得
		unless val?
			return @_rotate
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @rotate()
			@_rotate = setValue
			@update()
			return @

	# ### 横の傾きの取得/設定
	skewX: (val, setRelative) ->
		# 取得
		unless val?
			return @_skewX
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @skewX()
			@_skewX = setValue
			@update()
			return @

	# ### 縦の傾きの取得/設定
	skewY: (val, setRelative) ->
		# 取得
		unless val?
			return @_skewY
		# 設定
		else
			setValue = parseFloat val
			if setRelative
				setValue += @skewY()
			@_skewY = setValue
			@update()
			return @

	# ### トレースモード
	# デバッグ用の各要素の背景色を設定
	trace: ->
		@$.css
			backgroundColor:'rgba(  0, 255,   0, 0.2)'
		@$ctn.css
			backgroundColor:'rgba(  0,   0, 255, 0.2)'
		@$hit.css
			backgroundColor:'rgba(255,   0,   0, 0.2)'
		return @




