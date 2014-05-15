module.exports = (grunt) ->

	# Package Data
	pkg = grunt.file.readJSON 'package.json'
	client = grunt.file.readJSON '.client.json'

	CLIENT = client.dest or '.tmp'
	DEST = 'build/jquery.<%= pkg.name.toLowerCase() %>.js'
	DEST_MIN = 'build/jquery.<%= pkg.name.toLowerCase() %>.min.js'

	classFiles = [
		'src/psyborg/Util.ts'
		'src/psyborg/PsyborgEvent.ts'
		'src/psyborg/PsyborgEventDispacther.ts'
		'src/psyborg/PsyborgElement.ts'
		'src/psyborg/Window.ts'
		'src/psyborg/StyleSheet.ts'
		'src/psyborg/Psycle/IPsycleConfig.ts'
		'src/psyborg/Psycle/IPsycleState.ts'
		'src/psyborg/Psycle/IPsycleReflowInfo.ts'
		'src/psyborg/Psycle/IPsycleTransitionList.ts'
		'src/psyborg/Psycle/IPsycleTransitionProcess.ts'
		'src/psyborg/Psycle/IPsycleTransitionProcessList.ts'
		'src/psyborg/Psycle/PsycleEvent.ts'
		'src/psyborg/Psycle/PsycleRepeat.ts'
		'src/psyborg/Psycle/PsycleReflowTiming.ts'
		'src/psyborg/Psycle/PsyclePanel.ts'
		'src/psyborg/Psycle/PsyclePanelClone.ts'
		'src/psyborg/Psycle/PsyclePanelList.ts'
		'src/psyborg/Psycle/PsycleContainer.ts'
		'src/psyborg/Psycle/PsycleStage.ts'
		'src/psyborg/Psycle/PsycleTransition.ts'
		'src/psyborg/Psycle/PsycleTransitionSlide.ts'
		'src/psyborg/Psycle/PsycleTransitionFade.ts'
		'src/psyborg/Psycle/PsycleController.ts'
		'src/psyborg/Psycle/Psycle.ts'
		'src/jquery.psyborg.ts'
	]

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
				 * License: Licensed under the <%= pkg.licenses[0].type %> License
				 * Require: jQuery v<%= pkg.dependencies.jquery %> or later
				 */
			'''
			camouflage: '''
				/**
				 * r<%= parseInt(pkg.revision, 10) + 1 %> MIT License
				 */
			'''
		typescript:
			options:
				comments: on
			dist:
				src: [
					'<%= concat.scripts.dest %>'
				]
				dest: 'src/.tmp/built.js'
		uglify:
			dist:
				options:
					banner: '<%= meta.banner %>' + '\n\n'
					report: 'min'
				src: [
					DEST
				]
				dest: DEST_MIN
			camou:
				options:
					banner: '<%= meta.camouflage %>' + '\n\n'
				src: [
					CLIENT
				]
				dest: CLIENT
		concat:
			scripts:
				src: ['src/__intro.ts'].concat(classFiles).concat(['src/__outro.ts'])
				dest: 'src/.tmp/concat.ts'
			wrap:
				options:
					banner: '<%= meta.banner %>' + '\n\n'
				src: [
					'src/.tmp/__intro.js'
					'<%= typescript.dist.dest %>'
					'src/.tmp/__outro.js'
				]
				dest: DEST
			test:
				src: '<%= concat.wrap.src %>'
				dest: CLIENT
		yuidoc:
			app:
				name: '<%= pkg.name %>'
				description: '<%= pkg.description %>'
				version: '<%= pkg.version %>'
				url: '<%= pkg.website %>'
				options:
					paths: 'src/'
					outdir: 'docs/'
					extension: '.ts'
					exclude: 'concat.ts'
					themedir: 'docs_theme'
		watch:
			scripts:
				files: classFiles
				tasks: [
					'concat:scripts'
					'typescript'
					'concat:wrap'
					'concat:test'
					'uglify:camou'
					'uglify'
					# 'update'
					'gitcommit'
					'notifyDone'
				]
				options:
					interrupt: on
	grunt.registerTask 'default', [
		'concat:scripts'
		'typescript'
		'concat:wrap'
		'uglify'
		'uglify:camou'
		'update'
		'yuidoc'
		'gitcommit'
		'notifyDone'
	]
	grunt.registerTask 'camou', [
		'concat:scripts'
		'typescript'
		'concat:wrap'
		'uglify:camou'
		# 'update'
		# 'yuidoc'
		# 'gitcommit'
		'notifyDone'
	]

	# Tasks
	log = grunt.log
	proc = require 'child_process'
	exec = proc.exec

	grunt.loadNpmTasks 'grunt-typescript'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-yuidoc'

	grunt.registerTask 'update', 'Update Revision', ->
		pkg.revision = parseInt(pkg.revision, 10) + 1
		grunt.file.write 'package.json', JSON.stringify pkg, null,2

	grunt.registerTask 'gitcommit', 'Git Commit', ->
		exec "/usr/local/git/bin/git commit -a -m 'dev (grunt commit r#{pkg.revision})'"

	grunt.registerTask 'notifyDone', 'done', ->
		exec "/usr/local/bin/growlnotify -t 'grunt.js - <#{pkg.name}> Project' -m '#{pkg.name} v@#{pkg.version} r#{pkg.revision}\nTasks are completed!'"


