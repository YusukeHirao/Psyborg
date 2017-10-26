const gulp = require('gulp');
const wpGilp = require('webpack-stream');
const webpack = require('webpack');
const ts = require('gulp-typescript');
const header = require('gulp-header');
const moment = require('moment');
const runSequence = require('run-sequence');
const git = require('git-rev-sync');
const pkg = require('./package.json');
const cl = require('./.client.json');

banner = `/**!
 * ${pkg.name} - v${pkg.version}
 * revision: ${git.long()}
 * update: ${moment().format("YYYY-MM-DD")}
 * Author: ${pkg.author} [${pkg.website}]
 * Github: ${pkg.repository.url}
 * License: Licensed under the ${pkg.license} License
 */`


gulp.task('ts', () => gulp.src('src/**/*.ts').pipe(ts('tsconfig.json')).pipe(gulp.dest('./lib/')));

gulp.task('pack', () => {
	return gulp
		.src('./lib/index.js')
		.pipe(wpGilp(
			{
				plugins: [
					new webpack.optimize.AggressiveMergingPlugin(),
					new webpack.optimize.UglifyJsPlugin({
						output: {
							comments: false,
						},
						compress: {
							conditionals: false,
						},
					}),
					new webpack.DefinePlugin({
						'process.env': {
							'NODE_ENV': JSON.stringify('production'),
						}
					}),
				],
				output: {
					filename: 'jquery.psyborg.min.js',
				},
			},
			webpack,
		))
		.pipe(header(banner))
		.pipe(gulp.dest('./'))
		.pipe(gulp.dest(`./dist/v${pkg.version}/`))
		.pipe(gulp.dest(cl.dest));
});

gulp.task('dev-web', (cb) => runSequence('ts', 'pack', cb));

gulp.task('watch', () => gulp.watch('src/**/*.ts', ['dev-web']));

gulp.task('build', (cb) => runSequence('ts', 'pack', cb));

gulp.task('default', ['build']);
