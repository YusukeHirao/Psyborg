gulp = require 'gulp'
wpGilp = require 'webpack-stream'
webpack = require 'webpack'
ts = require 'gulp-typescript'
header = require 'gulp-header'
moment = require 'moment'
git = require 'git-rev-sync'

pkg = require './package.json'
banner = """/**!
  * <%= pkg.name %> - v<%= pkg.version %>
  * revision: <%= git.long() %>
  * update: <%= moment().format("YYYY-MM-DD") %>
  * Author: <%= pkg.author %> [<%= pkg.website %>]
  * Github: <%= pkg.repository.url %>
  * License: Licensed under the <%= pkg.license %> License
  */


"""

gulp.task 'ts', ->
  gulp.src 'src/**/*.ts'
    .pipe ts('tsconfig.json')
    .pipe gulp.dest './lib/'

gulp.task 'pack', ->
  gulp.src './lib/index.js'
    .pipe wpGilp
      plugins: [
        new webpack.optimize.AggressiveMergingPlugin()
        new webpack.optimize.UglifyJsPlugin
          output:
            comments: false
          compress:
            conditionals: false
        new webpack.DefinePlugin
          'process.env':
            'NODE_ENV': JSON.stringify('production')
      ]
      output:
        filename: 'jquery.psyborg.min.js'
      # module:
      #   loaders: [
      #     {
      #       test: /\.js$/,
      #       loaders: ['babel-loader']
      #     }
      #   ]
    ,
      webpack
    .pipe header banner, pkg: pkg, moment: moment, git: git
    .pipe gulp.dest './'
    .pipe gulp.dest "./dist/v#{pkg.version}/"

gulp.task 'dev-ts', gulp.series(
  'ts',
)

gulp.task 'dev-web', gulp.series(
  'ts',
  'pack',
)

gulp.task 'watch', ->
  gulp.watch 'src/**/*.ts', ['dev-web']

gulp.task 'build', gulp.series(
  'ts',
  'pack',
)

gulp.task 'default', gulp.series(
  'build',
)
