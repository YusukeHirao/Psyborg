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
				 * Require: jQuery v1.10.2
				 */
			'''
		typescript:
			dist:
				src: [
					'src/main.ts'
				]
				dest: 'build/<%= pkg.name.toLowerCase() %>.js'
			test:
				src: '<%= typescript.dist.src %>'
				# dest: 'build/<%= pkg.name.toLowerCase() %>.js'
				dest: '../../svn/fuba/js/<%= pkg.name.toLowerCase() %>.min.js'
		uglify:
			options:
				banner: '<%= meta.banner %>' + '\n\n'
			dist:
				src: [
					'<%= typescript.dist.dest %>'
				]
				dest: 'build/<%= pkg.name.toLowerCase() %>.min.js'
		watch:
			scripts:
				files: '<%= typescript.dist.src %>'
				tasks: [
					'typescript:test'
					'update'
					'gitcommit'
					'notifyDone'
				]
				options:
					interrupt: on
	grunt.registerTask 'default', [
		'typescript:dist'
		'uglify'
		'update'
		'gitcommit'
		'notifyDone'
	]

	# Tasks
	log = grunt.log
	proc = require 'child_process'
	exec = proc.exec

	grunt.loadNpmTasks 'grunt-typescript'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'update', 'Update Revision', ->
		pkg.revision = parseInt(pkg.revision, 10) + 1
		grunt.file.write 'package.json', JSON.stringify pkg, null,2

	grunt.registerTask 'gitcommit', 'Git Commit', ->
		exec "/usr/local/git/bin/git commit -a -m 'dev (grunt commit r#{pkg.revision})'"

	grunt.registerTask 'notifyDone', 'done', ->
		exec "/usr/local/bin/growlnotify -t 'grunt.js - <#{pkg.name}> Project' -m '#{pkg.name} v@#{pkg.version} r#{pkg.revision}\nTasks are completed!'"


