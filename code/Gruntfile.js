
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
						'lib/traceur.js',
						'lib/es6-module-loader.js'
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
						// Just grab all js files for right now
						'js/*.js'
					]
				}
			}
		},
		copy: {
			script: {
				src: 'script/**/*.js',
				dest: 'assets/script'
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
