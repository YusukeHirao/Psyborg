module.exports = (grunt) ->

	# Package Data
	pkg = grunt.file.readJSON 'package.json'

	# Project configuration.
	grunt.initConfig
		pkg: pkg
		meta:
			banner: '''
				/**
				 * <%= pkg.name %>.js - v<%= pkg.version %> r<%= parseInt(pkg.revision, 10) + 1 %>
				 * update: <%= grunt.template.today("yyyy-mm-dd") %>
				 * Author: <%= pkg.author %> [<%= pkg.website %>]
				 * Github: <%= pkg.repository.url %>
				 * License: Licensed under the <%= pkg.license %> License
				 * Require: jQuery v<%= pkg.dependencies.jquery %>
				 */

				/* Included Libraries * -- ----- ----- ----- ----- ----- ----- *
				<% for (var i = 0, l = pkg.include_libraries.length; i < l; i++) { %>
				+ <%= pkg.include_libraries[i].name %>
				<%= pkg.include_libraries[i].license.replace(new RegExp("^(.)"), "\\t$1").replace(new RegExp("\\n([^\\n])", "g"), "\\n\\t$1") %>
				<% } %>
				 * ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */
			'''
		coffee:
			dist:
				# dest: '.temp/compiled_script.js'
				dest: 'build/<%= pkg.name.toLowerCase() %>.js'
				src: [
					'src/include_libraries.coffee'
					'src/core.coffee'
					'src/Psyence.class.coffee'
					'src/Psyborg.class.coffee'
					'src/extend.coffee'
				]
		uglify:
			options:
				banner: '<%= meta.banner %>' + '\n\n'
			dist:
				src: [
					'<%= coffee.dist.dest %>'
				]
				dest: 'build/<%= pkg.name.toLowerCase() %>.min.js'
		docco:
			docs:
				src: '<%= coffee.dist.src %>'
				options:
					output: 'docs/'
		clean:
			temp:
				'<%= coffee.dist.dest %>'
		watch:
			scripts:
				files: '<%= coffee.dist.src %>'
				tasks: [
					'coffee'
					'uglify'
					'update'
					'gitcommit'
					'notifyDone'
				]
				options:
					interrupt: on
	grunt.registerTask 'default', [
		'coffee'
		'uglify'
		'update'
		'docco'
		# 'clean'
		'gitcommit'
		'notifyDone'
	]

	# Tasks
	log = grunt.log
	proc = require 'child_process'
	exec = proc.exec

	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-docco'

	grunt.registerMultiTask 'coffee', 'compile CoffeeScript', ->
		done = @async()
		# log.writeln @data.meta
		file = @files[0]
		js = file.dest
		coffee = file.src
		unless js and coffee then return
		command = "/usr/local/bin/coffee -j #{js} -cm #{coffee.join(' ')}"
		out = exec command, (err, sout, serr) ->
			if err or sout or serr
				log.writeln serr
				exec "/usr/local/bin/growlnotify -t 'Coffee Complile Error!' -m'#{serr}'"
				done off
			else
				done on

	grunt.registerTask 'update', 'Update Revision', ->
		pkg.revision = parseInt(pkg.revision, 10) + 1
		grunt.file.write 'package.json', JSON.stringify pkg, null,2

	grunt.registerTask 'gitcommit', 'Git Commit', ->
		exec "/usr/local/git/bin/git commit -a -m 'dev (grunt commit)'"

	grunt.registerTask 'notifyDone', 'done', ->
		exec "/usr/local/bin/growlnotify -t 'grunt.js - <#{pkg.name}> Project' -m '#{pkg.name} v@#{pkg.version} r#{pkg.revision}\nTasks are completed!'"


