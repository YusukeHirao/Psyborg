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
		src = bgImgValue.replace /^url\((?:"|')?(.+)(?:"|')?\)$/i, '$1' # url() の除去
		return src

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

	# * * *

	# ## プロパティ
	uid: null
	$: null
	$ctn: null
	$wrp: null
	$bg: null
	$hit: null
	_$metrix: null
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
			width: '100%'
			height: '100%'
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
			width: '100%'
			height: '100%'
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
		@_$metrix = @$wrp.add @$hit
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
	updateMetrix: () ->
		@_$metrix.css
			width: @_width
			height: @_height

	# ###
	updateFilter: () ->
		if ltIE8
			filter = []

			# #### 背景色
			alert @_colorA
			if @_colorA <= 1
				@$bg.css
					backgroundColor: "rgb(#{@_colorR}, #{@_colorG}, #{@_colorB})"
			else if 0 <= @_colorA
				@$bg.css
					backgroundColor: 'none'
			else
				color = [
					'#'
					@_colorR.toString 16
					@_colorG.toString 16
					@_colorB.toString 16
					(@_colorA * 255).toString 16
				].join('')
				filter.push "progid:DXImageTransform.Microsoft.gradient(startcolorstr=#{color}, endcolorstr=#{color}, gradienttype=0)"

			# #### 背景画像
			if @_backgroundImage
				filter.push "progid:DXImageTransform.Microsoft.AlphaImageLoader(Src=\"#{@_backgroundImage}\",SizingMethod=scale)"

			# #### 反映
			@$bg.css
				fliter: filter.join ' '
		else
			@$bg.css
				backgroundImage: "url(#{@_backgroundImage})"
				backgroundColor: "rgba(#{@_colorR}, #{@_colorG}, #{@_colorB}, #{@_colorA})"


	# ### 設定プロパティのレンダリング反映
	# この段階でリフロー発生
	update: () ->
		@updateMetrix()
		@updateFilter()
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




