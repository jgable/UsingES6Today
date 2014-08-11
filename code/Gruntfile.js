
module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		less: {
			all: {
				files: {
					'assets/css/site.css': 'less/site.less'	
				}
			}
		},
		concat: {
			vendor: {
				files: {
					'assets/js/vendor.js': [
						'bower_components/jquery/dist/jquery.min.js',
						'bower_components/lodash/dist/lodash.min.js',
						'bower_components/backbone/backbone.js',
						'bower_components/almond/almond.js'
					]
				}
			},
			modules: {
				src: '.grunt/build/script/**/*.js',
				dest: 'assets/script/app-built.js'
			},
			main: {
				files: {
					'assets/js/main.js': [
						// Grab the ES6 shim first
						'assets/script/app-built.js',
						// Just grab all js files for right now
						'js/*.js'
					]
				}
			}
		},
		connect: {
			dev: {}
		},
		watch: {
			dev: {
				files: ['less/*.less', 'js/*.js', 'script/**/*.js', 'index.html'],
				tasks: ['less', 'script']
			}
		},
		transpile: {
			'app-shim': {
				type: 'amd',
				files: [{
					expand: true,
					cwd: 'script/',
					src: ['**/*.js'],
					dest: '.grunt/build/script'
				}]
			}
		}
	});

	grunt.registerTask('script', ['transpile', 'concat:vendor', 'concat:modules', 'concat:main']);
	grunt.registerTask('default', ['less', 'script', 'connect', 'watch']);
};
