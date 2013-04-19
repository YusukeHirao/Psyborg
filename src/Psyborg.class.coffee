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
		# 要素のPsyborg初期スタイルを設定
		@$.addClass className
		@$.css
			position: 'absolute'
		@update()
		# コンテナ要素生成
		@$ctn = $ createDiv className, "_#{NAMESPACE}_container"
		@$.wrap @$ctn
		@$ctn = @$.parents ".#{className}"
		@$ctn.css position: @_position
		# ラップ要素生成
		@$wrp = $ createDiv className, "_#{NAMESPACE}_wrapper"
		@$ctn.wrapInner @$wrp

	# ## メソッド

	# ### プロパティセット
	# 表示されている状態の要素スタイルをプロパティにセット
	setPropertiesByComputedValues: ($origin) ->
		@_width = $origin.width()
		@_height = $origin.height()
		@_top = $origin.position().top
		@_left =  $origin.position().left
		@_zIndex = int $origin.css 'z-index'
		@_zoom = int $origin.css 'zoom'
		@_opacity = parseFloat $origin.css 'opacity'
		@_position = getPositionState @$

	# ### 設定プロパティのレンダリング反映
	# この段階でリフロー発生
	update: () ->
		@$.css
			width: @_width
			height: @_height
			top: @_top
			left: @_left
			zIndex: @_zIndex
			zoom: @_zoom

	# ### 幅の取得/設定
	x: (x, setRelative) ->
		# 取得
		unless x?
			return _x
		# 設定
		else
			setX = parseFloat x
			if setRelative
				setX += @x()
			@_x = setX
			@update()
			return @
