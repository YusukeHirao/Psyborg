class Psyence
	_random = Math.random
	_max = Math.max
	_min = Math.min
	_floor = Math.floor
	# ## Class Method
	#
	# ### Psycence.random()
	@random = (from, to) ->
		# #### Psycence.random(from[, to])
		# from から to までの数値をランダムに返す。
		#
		# to を省略すると 0 から from までをランダムに返す。
		#
		# 引数を渡さない場合は 0 を返す。
		#
		# - @param {Number} from
		# - @param {Number} to
		# - @returns {Number}
		if isNumeric from
			unless isNumeric to
				to = from
				from = 0
			min = _min from, to
			max = _max(from, to) + 1
			return _floor _random() * (max - min) + min
		# #### Psycence.random(array)
		# 配列をランダムに入れ替えてして新しい配列を返す。
		#
		# - @param {Array} array
		# - @returns {Array}
		#
		# * * *
		else if isArray from
			array = from
			newArray = []
			while length = array.length
				newArray = newArray.concat array.splice @random length
			return newArray
		return 0


	constructor: ->
		throw new TypeError 'object is not a function'
