class Psyborg
	# ## プライベート関数

	# ### スタティックポジションの要素はリラティブに変更
	toPositionable = ($target) ->
		position = $target.css 'position'
		if position is undefined or position is null or position is '' or position is 'static'
			$target.css position: 'relative'

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

	# * * *

	# ## コンストラクタ
	constructor: (jQueryObjectOrSelectors, jQueryORDocumentContext) ->
		unless @ instanceof Psyborg
			return new Psyborg jQueryObjectOrSelectors, jQueryORDocumentContext
		# ユニークID設定
		uid = createUID()
		className = "_#{NAMESPACE}#{uid} #{NAMESPACE}"
		@uid = uid
		# 要素取得
		@$ = $ jQueryObjectOrSelectors, jQueryORDocumentContext
		@$.addClass className
		# 初期値プロパティをセット
		@setPropertiesByComputedValues @$
		# コンテナ要素生成
		@$ctn = $ createDiv()
		@$ctn.addClass className
		@$ctn.wrap @$
		console.log @$ctn


	# ## メソッド

	# ### プロパティセット
	# 表示されている状態の要素スタイルをプロパティにセット
	setPropertiesByComputedValues: ($origin) ->
		@_width = $origin.width()
		@_height = $origin.height()
		@_top = int $origin.css 'top'
		@_left =  int $origin.css 'left'
		@_zIndex = int $origin.css 'z-index'
		@_zoom = int $origin.css 'zoom'
		@_opacity = parseFloat $origin.css 'opacity'

	# ### 幅の取得/設定
	x: (x, setRelative) ->
		# 取得
		unless x?
			return _x
		# 設定
		else
			@_x = int x
			@update()
			return @
