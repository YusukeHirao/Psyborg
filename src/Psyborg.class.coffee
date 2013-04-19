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
		@_position = getPositionState @$
		return @

	# ###
	updateMetrix: () ->
		@_$metrix.css
			width: @_width
			height: @_height

	# ### 設定プロパティのレンダリング反映
	# この段階でリフロー発生
	update: () ->
		@updateMetrix()
		@_$position.css
			top: @_top
			left: @_left
			zIndex: @_zIndex
			zoom: @_zoom
		@_$transform
		return @

	# ### 幅の取得/設定
	width: (width, setRelative) ->
		# 取得
		unless width?
			return @_width
		# 設定
		else
			setWidth = parseFloat width
			if setRelative
				setWidth += @width()
			@_width = setWidth
			@update()
			return @

	# ### 水平位置の取得/設定
	x: (x, setRelative) ->
		# 取得
		unless x?
			return @_x
		# 設定
		else
			setX = parseFloat x
			if setRelative
				setX += @x()
			@_x = setX
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




