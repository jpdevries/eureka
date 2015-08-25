module.exports = function(grunt) {
	// Project configuration.		
    grunt.option.init({
        'ver':(!grunt.option('ver')) ? grunt.file.readJSON('package.json').version : grunt.option('ver'),
        'rel':(!grunt.option('rel')) ? grunt.file.readJSON('package.json').release : grunt.option('rel')
    });
	var initConfig = {
		pkg: grunt.file.readJSON('package.json'),
		dirs: { /* just defining some properties */
            src: '../src/',
			lib: './lib/',
			scss: './scss/',
			theme: '../',
			assets: 'examples/assets/',
			css: 'css/',
			js:  'js/',
            ts:  'ts/',
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
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.css',
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.no-flexbox.<%= pkg.version %>.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.no-flexbox.<%= pkg.version %>.css',
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
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.css': '<%= dirs.scss %>main.scss',
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.no-flexbox.<%= pkg.version %>.css': '<%= dirs.scss %>no-flexbox.scss'
				}
			},
			dev: {
				options: {
					style: 'expanded',
					compass: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.css': '<%= dirs.scss %>main.scss',
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.no-flexbox.<%= pkg.version %>.css': '<%= dirs.scss %>no-flexbox.scss'
				}
			}
		},
		
		csslint: {
			strict: {
				options: {
					import: 2
				},
				src: ['<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>.<%= pkg.version %>**/*.css']
			}
		},
		
		concat: {
			plugins: {
    			options: {
    				separator: '',
                    banner:'/* do not touch this file. see _build/*.js */\n'
    			},
				src: [
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/scopedQuerySelectorShim.js',
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/html5Upload.js',
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.js'
				],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.js', 
			},
			eureka: {
				src: [
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.js'
				],
				dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.min.js', 
			}
			
		},
        ts: {
            eureka : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>plugins.ts","<%= dirs.ts %>ajax.ts","<%= dirs.ts %>eureka.typescript.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.js',
                options:{
                    sourceMap:false
                }
            },
            muckboot : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>muckboot.eureka.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>muckboot.eureka.<%= pkg.version %>.js'
            },
            includes : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>ajax.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>workers/includes.js'
            },
            listsource : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>workers/listsource.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>workers/listsource.js'
            },
            listsources : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>workers/listsources.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>workers/listsources.js'
            },
            listdirectory : {
                target:'es5',
                failOnTypeErrors:false,
                src: ["<%= dirs.ts %>workers/listdirectory.ts"],
                out:'<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>workers/listdirectory.js'
            }
        },

		uglify: {
			main: {
				options: {
					report: 'min',
                    screwIE8:true
				},
				files: {
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>muckboot.eureka.<%= pkg.version %>.min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>muckboot.eureka.<%= pkg.version %>.js'],
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>/vendor/html5Upload.min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>/vendor/html5Upload.js'],
                    '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.min.js': ['<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.js']
				}
				
			},
            includes: {
                options: {
                    report: 'min'
                },
                files: [{
                    src:['<%= dirs.src %><%= dirs.js %>workers/includes.js'],
                    dest:'<%= dirs.src %><%= dirs.js %>workers/includes.min.js'
                },{
                    src:['<%= dirs.src %><%= dirs.js %>workers/listsource.js'],
                    dest:'<%= dirs.src %><%= dirs.js %>workers/listsource.min.js'
                },
                {
                    src:['<%= dirs.src %><%= dirs.js %>workers/listsources.js'],
                    dest:'<%= dirs.src %><%= dirs.js %>workers/listsources.min.js'
                },
                {
                    src:['<%= dirs.src %><%= dirs.js %>workers/listdirectory.js'],
                    dest:'<%= dirs.src %><%= dirs.js %>workers/listdirectory.min.js'
                }
                ]
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
			ts: {
				files: ['<%= dirs.ts %>*'],
				tasks: ['ts:eureka','growl:ts','concat','uglify','growl:uglify']
			}
		},
		clean: { /* take out the trash */
			options: {
				force: true
			},
			prebuild: ['<%= dirs.scss %>bourbon', '<%= dirs.scss %>font-awesome'],
			postbuild: ['<%= dirs.lib %>','<%= dirs.src %>/**/*']
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
			},
			ts: {
				title: "grunt",
				message: "JavaScript created from TypeScript."
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
    
	initConfig.copy["dom4"] = {
		files: [{
			src: './*.js',
			cwd: '<%= dirs.lib %>dom4',
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/',
			expand: true
		}]
	};
    
	initConfig.copy["eureka-src"] = {
		files: [{
			src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>*eureka*.js',
			dest: '<%= dirs.src %><%= dirs.js %>',
			expand: true,
            flatten: true
		},{
			src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>workers/**/*.js',
			dest: '<%= dirs.src %><%= dirs.js %>workers/',
            flatten:true,
            expand: true
		},{
			src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>*eureka*.css',
			dest: '<%= dirs.src %><%= dirs.css %>',
			expand: true,
            flatten: true
		}]
	};
    
	initConfig.copy["DefinitelyTyped"] = {
		files: [{
			src: 'DefinitelyTyped/modernizr.d.ts',
			cwd: '<%= dirs.lib %>',
			dest: '<%= dirs.ts %>',
			expand: true
		}]
	};
    
	initConfig.copy["html5-file-uploader"] = {
		files: [{
			src: '<%= dirs.lib %>html5-file-uploader/Html5UploadDemo/Scripts/src/html5Upload.js',
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/html5Upload.js'
		}]
	};
    
	initConfig.copy["scopedQuerySelectorShim"] = {
		files: [{
			src: '<%= dirs.lib %>scopedQuerySelectorShim/scopedQuerySelectorShim.js',
			dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/scopedQuerySelectorShim.js'
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
	
	grunt.loadNpmTasks('grunt-sass');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-growl');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.loadNpmTasks("grunt-ts");

	grunt.registerTask('default', ['growl:watch', 'watch']);
	grunt.registerTask('build', ['clean:prebuild', 'bower', 'copy', 'sass:dev','cssmin','ts','concat','uglify:main', 'growl:sass', 'clean:postbuild','copy:eureka-src','uglify:includes']);
	grunt.registerTask('expand', ['sass:dev', 'growl:sass', 'growl:expand']);
};
