// Generated on 2015-02-04 using generator-chrome-extension 0.2.11
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    assets: 'assets',
    package: 'package'
  };

  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      // js: {
      //   files: ['<%= config.app %>/scripts/{,*/}*.js'],
      //   tasks: ['jshint'],
      //   options: {
      //     livereload: true
      //   }
      // },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
          files: ['<%= config.assets %>/styles/{,*/}*.{scss,sass}'],
          tasks: ['sass:app']
      },
      browserify: {
        files: [
          '<%= config.assets %>/**/*.{jsx,js}'
        ],
        tasks: ['browserify:app'],
        options: {
          livereload: true
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= config.app %>/*.html',
          '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= config.app %>/manifest.json',
          '<%= config.app %>/_locales/{,*/}*.json'
        ]
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      app: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/styles',
          src: ['**/*.scss'],
          dest: '<%= config.app %>/styles',
          ext: '.css'
        }]
      }
    },

    browserify: {
      options:      {
        transform:  [ require('grunt-react').browserify ]
      },
      app:          {
        files: [
          {
            src: ['<%= config.assets %>/client.jsx'],
            dest: '<%= config.app %>/scripts/client-bundle.js'
          },
          {
            src: ['<%= config.assets %>/background.js'],
            dest: '<%= config.app %>/scripts/background-bundle.js'
          },
          {
            src: ['<%= config.assets %>/options.jsx'],
            dest: '<%= config.app %>/scripts/options-bundle.js'
          },
          {
            src: ['<%= config.assets %>/genomeTasks.jsx'],
            dest: '<%= config.app %>/scripts/genomeTasks-bundle.js'
          }
        ]
      }
    },

    // Grunt server and debug server setting
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      chrome: {
        options: {
          open: false,
          base: [
            '<%= config.app %>'
          ]
        }
      },
      test: {
        options: {
          open: false,
          base: [
            'test',
            '<%= config.app %>'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      chrome: {
      },
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%= connect.options.port %>/index.html']
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: [
        '<%= config.app %>/gscheduler.html',
        '<%= config.app %>/options.html'
      ]
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
      },
      html: ['<%= config.dist %>/{,*/}*.html'],
      css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minifies files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          // removeCommentsFromCDATA: true,
          // collapseWhitespace: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: '*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      app: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.assets %>',
          dest: '<%= config.app %>',
          src: [
            'styles/vendor/**/*.{eot,svg,ttf,woff,woff2,otf}',
          ]
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp,gif}',
            '{,*/}*.html',
            'styles/{,*/}*.css',
            'styles/fonts/{,*/}*.*',
            'styles/vendor/**/*.{eot,svg,ttf,woff,woff2,otf}',
            '_locales/{,*/}*.json',
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      chrome: [
      ],
      dist: [
        'imagemin',
        'svgmin'
      ],
      test: [
      ]
    },

    // Auto buildnumber, exclude debug files. smart builds that event pages
    chromeManifest: {
      dist: {
        options: {
          buildnumber: true,
          background: {
            target: 'scripts/background.js',
            exclude: [
              'scripts/chromereload.js'
            ]
          }
        },
        src: '<%= config.app %>',
        dest: '<%= config.dist %>'
      }
    },

    // Compres dist files to package
    compress: {
      dist: {
        options: {
          archive: function() {
            var manifest = grunt.file.readJSON('app/manifest.json');
            return config.package + '/gscheduler-' + manifest.version + '.zip';
          }
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: ''
        }]
      }
    },

    webstore_upload: { // grunt-webstore-upload
        "accounts": {
            "default": {
                //cli_auth: true,
                publish: true, //publish item right after uploading. default false
                client_id: process.env.GSCHEDULER_PUBLISH_CLIENTID,
                client_secret: process.env.GSCHEDULER_PUBLISH_CLIENTSECRET,
                //refresh_token: "4/gfSJ55WbmR5yEGzep4s1ZFuoDIDZb_mVRjugY3pGRxE.AnBZC-S7wSkeXmXvfARQvtj6Dr4hmwI"
            }
        },
        "extensions": {
            "extension1": {
                account: "default",
                //appID: "plgnahdfabaahnjhenjbpfoocjfnfeai", // STAGING
                appID: "peikbeklmabkcahojdeiabbaglkahind", // PRODUCTION
                //required, we can use dir name and upload most recent zip file
                zip: "<%= config.package %>",
                publishTarget: 'trustedTesters'   
            }
        }
    }

  });

  grunt.registerTask('debug', function () {
    grunt.task.run([
      'browserify:app',
      'sass:app',
      //'jshint',
      'copy:app',
      'concurrent:chrome',
      'connect:chrome',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'chromeManifest:dist',
    'useminPrepare',
    'concurrent:dist',
    'cssmin',
    'concat',
    'uglify',
    'copy:dist',
    'usemin',
    'compress'
  ]);

  grunt.registerTask('publish', [
    'webstore_upload'
  ]);

  grunt.registerTask('default', [
    //'jshint',
    'test',
    'build'
  ]);
};
