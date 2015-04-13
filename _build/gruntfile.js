module.exports = function(grunt) {
	// Project configuration.		
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		dirs: { /* just defining some properties */
			lib: './lib/',
			scss: './scss/',
			theme: '../',
			assets: 'assets/',
			css: 'css/',
			js:  'js/',
			img: 'img/',
			font: 'font/'
		},
		bower: {
			install: {
				options: {
					targetDir: './lib',
					layout: 'byComponent'
				}
			}
		},
		copy: { 
		},
		cssmin: {
			compress: {
				options: {
					report: 'min',
					keepSpecialComments: 0,
					banner: '/*!\n*  <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n*/'
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
				}
			}
		},
		
		sass: {
			dist: {
				options: {
					style: 'compressed',
					compass: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
				}
			},
			dev: {
				options: {
					style: 'expanded',
					compass: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
				}
			}
		},
		
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>**/*.css']
			}
		},
		
		concat: {
			options: {
				separator: '',
                banner:'/* do not touch this file. see _build/*.js */\n'
			}
			
			,
			eureka: {
				src: [
					'<%= dirs.js %>plugins.js',
					'<%= dirs.js %>eureka.js'
				],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.min.js', 
			}
			
		},
        '6to5': {
            options: {
                modules: 'common'
            },

            build: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>',
                    src: ['./plugins.js','./eureka.js'],
                    dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>/es5/',
                }],
            }
        },
        
        ts: {
            default : {
                src: ["<%= dirs.js %>*.ts"],
                outDir:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>'
            }
        },

		uglify: {
			main: {
				options: {
					report: 'min',
                    screwIE8:true
				},
				files: {
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>muckboot.eureka.min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>muckboot.eureka.js']
				}
				
			}
		},
		
		watch: { /* trigger tasks on save */
			options: {
				livereload: true 
			},
			
			scss: {
				files: '<%= dirs.scss %>**/*.scss',
				tasks: ['sass:dev', 'growl:sass','cssmin']
			},
			
			js: {
				files: ['<%= dirs.js %>*','!<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>**/*-dev.js*','!<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>**/*-min.js*'],
				tasks: ['concat','growl:concat']
			}
		},
		clean: { /* take out the trash */
			options: {
				force: true
			},
			prebuild: ['<%= dirs.scss %>bourbon', '<%= dirs.scss %>font-awesome'],
			postbuild: ['<%= dirs.lib %>']
		},
		growl: { /* optional growl notifications requires terminal-notifer: gem install terminal-notifier */
			
			sass: {
				message: "Sass files created.",
				title: "grunt"
			},
			
			build: {
				title: "grunt",
				message: "Build complete."
			},
			watch: {
				title: "grunt",
				message: "Watching. Grunt has its eye on you."
			},
			expand: {
				title: "grunt",
				message: "CSS Expanded. Don't check it in."
			},
			concat: {
				title: "grunt",
				message: "JavaScript concatenated."
			},
			uglify: {
				title: "grunt",
				message: "JavaScript minified."
			}
		}
	};

	
	initConfig.copy["bourbon"] = {
		files: [{
			src: 'bourbon/**/*',
			cwd: '<%= dirs.lib %>',
			dest: '<%= dirs.scss %>',
			expand: true
		}]
	};

	initConfig.copy["neat"] = {
		files: [{
			src: 'neat/**/*',
			cwd: '<%= dirs.lib %>',
			dest: '<%= dirs.scss %>',
			expand: true
		}]
	};
	
	
	initConfig.copy["font-awesome"] = {
		files: [
			{
				
				src: '<%= dirs.lib %>font-awesome/scss/**/*.scss',
				

				
				dest: '<%= dirs.scss %>font-awesome/',
				
				expand: true,
				flatten: true
			},{
				src: '<%= dirs.lib %>font-awesome/css/**/*.css',
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>',
				expand: true,
				flatten: true
			},
			{
				src: 'fonts/**/*',
				cwd: '<%= dirs.lib %>font-awesome/',
				dest: '<%= dirs.theme %><%= dirs.assets %>',
				expand: true
			}
		]
	};
	
	grunt.initConfig(initConfig);
	
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-6to5');
    
    grunt.loadNpmTasks("grunt-ts");

	grunt.registerTask('default', ['sass:dist', 'cssmin', 'growl:sass', 'growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', 'copy', 'sass:dev','cssmin','concat','uglify', 'growl:sass', 'clean:postbuild']);
	grunt.registerTask('expand', ['sass:dev', 'growl:sass', 'growl:expand']);
};
