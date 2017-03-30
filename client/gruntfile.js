module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dirs:{
      build:'./build/',
      static:'./static/',
      theme:'./public/',
      lib:'./lib/',
      assets:'./assets/',
      js:'./js/',
      css:'./css/',
      scss:'src/scss/'
    },
    bower: {
        install: {
            options: {
                targetDir: './lib',
                layout: 'byComponent'
            }
        }
    },
    modernizr:{
      dist:{
        "crawl": false,
        "customTests": [],
        "dest": "<%= dirs.theme %><%= dirs.assets %><%= dirs.js %>vendor/modernizr.js",
        "enableJSClass":true,
        "tests": [
          "audio",
          "batteryapi",
          "cookies",
          "emoji",
          "eventlistener",
          "fullscreen",
          "geolocation",
          "history",
          "htmlimports",
          "inputtypes",
          "json",
          "ligatures",
          "notification",
          "pagevisibility",
          "queryselector",
          "requestanimationframe",
          "svg",
          "typedarrays",
          "vibrate",
          "adownload",
          "webaudio",
          "lowbattery",
          "cssanimations",
          "csscalc",
          "checked",
          "csscolumns",
          "flexbox",
          "fontface",
          "lastchild",
          "mediaqueries",
          "opacity",
          "csspointerevents",
          "csspositionsticky",
          "cssremunit",
          "scrollsnappoints",
          "subpixelfont",
          "cssvhunit",
          "cssvwunit",
          "willchange",
          "hidden",
          "picture",
          "es5date",
          "es6array",
          "es6collections",
          "generators",
          "es6math",
          "es6number",
          "es6object",
          "promises",
          "es6string",
          "oninput",
          "filereader",
          "filesystem",
          "jpeg2000",
          "srcset",
          "fetch",
          "speechsynthesis",
          "svgasimg",
          "svgfilters",
          "inlinesvg",
          "datauri",
          "urlparser",
          "sharedworkers",
          "webworkers"
        ],
        "options": [
          "setClasses"
        ],
        "uglify": true
      }
    },
    copy: {
      /*eureka: {
        files: [{
          src: '<%= dirs.build %><%= dirs.static %><%= dirs.js %>main.*.js',
          dest: '<%= dirs.build %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.min.js'
        }]
      },*/
      misc: {
        files: [{
            src: 'bourbon/**/*',
            cwd: '<%= dirs.lib %>',
            dest: '<%= dirs.scss %>',
            expand: true
        }, {
            src: 'neat/**/*',
            cwd: '<%= dirs.lib %>',
            dest: '<%= dirs.scss %>',
            expand: true
        }, {
            src: 'spec/**/*',
            cwd: '<%= dirs.lib %>spectacular/',
            dest: '<%= dirs.scss %>',
            expand: true
        },{
          src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css',
          dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.css'
        },{
          src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css',
          dest: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>eureka.<%= pkg.version %>.min.css'
        },{
          src: '<%= dirs.build %><%= dirs.static %><%= dirs.js %>main.*.js',
          dest: '<%= dirs.build %><%= dirs.assets %><%= dirs.js %>eureka.<%= pkg.version %>.min.js'
        }]
      }
    },
    sass:{
      dev: {
				options: {
					style: 'expanded',
					compass: false,
          sourcemap: false
				},
				files: {
					'<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css': '<%= dirs.scss %>main.scss'
				}
			}
    },
    postcss: {
      options: {
        map: true, // inline sourcemaps

        // or
        map: {
            inline: false, // save all sourcemaps as separate files...
            //annotation: 'dist/css/maps/' // ...to the specified directory
        },

        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
          //require('cssnano')() // minify the result
        ]
      },
      dist: {
        src: '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>*.css'
      }
    },
    bump: {
      pkg: {
        files: [{
            src: './public/index.html',
            dest: './public/index.html'
        }],
        options: {
            replacements: [{
                pattern: /<link rel="stylesheet" type="text\/css" href="assets\/css\/eureka.\d*.\d*.\d*.min.css/i,
                replacement: `<link rel="stylesheet" type="text/css" href="assets/css/eureka.<%= pkg.version %>.min.css`
            }]
        }
      }
    },
    cssmin:{
      ship: {
        options:{
          report:'gzip'
        },
        files: {
            '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.min.css': '<%= dirs.theme %><%= dirs.assets %><%= dirs.css %>main.css'
        }
      },
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
      concat: {
          title: "grunt",
          message: "JavaScript concatenated."
      },
      uglify: {
          title: "grunt",
          message: "JavaScript minified."
      }
    },
    clean: {
      buildjs: ['<%= dirs.build %><%= dirs.assets %><%= dirs.js %>*.js']
    },
    watch: { /* trigger tasks on save */
      options: {
          livereload: true
      },
      scss: {
          options: {
              livereload: true
          },
          files: '<%= dirs.scss %>**/*.scss',
          tasks: ['sass:dev', 'postcss', 'cssmin', 'growl:sass']
      }
    },
  });

  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks("grunt-modernizr");
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.renameTask('string-replace','bump');

  grunt.registerTask('default', ['growl:watch', 'watch']);
  grunt.registerTask('build',['bower','copy','modernizr','sass','postcss','cssmin','growl:build']);
};
