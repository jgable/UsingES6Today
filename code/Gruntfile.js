
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
					]
				}
			},
			dev: {
				files: {
					'assets/js/main.js': [
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
				files: ['less/*.less', 'js/*.js', 'index.html'],
				tasks: ['less', 'concat']
			}
		}
	});

	grunt.registerTask('default', ['less', 'concat', 'connect', 'watch']);
};
