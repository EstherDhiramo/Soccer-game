module.exports = function (grunt) {

    require('time-grunt')(grunt);

    // load all grunt tasks
    require('jit-grunt')(grunt);

    grunt.initConfig({

        // Clean dist folder (all except lib folder)
        clean: {
            js: ["dist/css","dist/js/*", "!dist/js/libs/**",  "dist/index.html"],
            dist: ["dist/js/*", "!dist/js/index.js", "!dist/js/libs/**"]
        },

        // Compilation from ES6 to ES5 with Babel
        babel: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '**/*.js',
                    dest: 'dist/js/',
                    ext: '.js'
                }]
            },
            dist: {
                options: {
                    sourceMap: false
                },
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '**/*.js',
                    dest: 'dist/js/',
                    ext: '.js'
                }]
            }
        },
        // Watches content related changes
        watch : {
            js : {
                files: ['js/**/*.js'],
                tasks: ['newer:babel:dev']
            },
            sass : {
                files: ['sass/**/*.scss'],
                tasks: ['sass','postcss:debug']
            },
            html : {
                files: ['html/**/*.html'],
                tasks: ['bake']
            }
        },
        // HTML minifier
        htmlmin : {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
        // Build dist version
        uglify : {
            dist: {
                options: {
                    compress:true,
                    beautify: false
                },
                files: {
                    'dist/js/index.js': ['dist/js/GameObject.js', 'dist/js/**/*.js', '!dist/js/libs/**/*.js']
                }
            }
        },
        // Sass compilation. Produce an extended css file in css folder
        sass : {
            options: {
                sourcemap:'none',
                style: 'expanded'
            },
            dist : {
                files: {
                    'dist/css/main.css': 'sass/main.scss'
                }
            }
        },
        // Auto prefixer css
        postcss : {
            debug : {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'})
                    ]
                },
                src: 'dist/css/main.css'
            },
            dist: {
                options: {
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}),
                        require('cssnano')()
                    ]
                },
                src: 'dist/css/main.css'
            }
        },
        // Bake HTML file (link includes in the main html file)
        bake : {
            index: {
                files: {
                    'dist/index.html': "html/index.html"
                }
            }
        },

        //Server creation
        connect: {
            server: {
                options: {
                    port: 3000,
                    base: '.'
                }
            },
            test: {
                options: {
                    port: 3000,
                    base: '.',
                    keepalive:true
                }
            }
        },
        // Open default browser
        open: {
            local: {
                path: 'http://localhost:3000/dist'
            }
        }
    });

    grunt.registerTask('default', 'Compile and watch source files', [
        'dev',
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('run', 'Run the webserver and watch files', [
        'connect:server',
        'open',
        'watch'
    ]);

    grunt.registerTask('dev', 'build dev version', [
        'clean:js',
        'babel:dev',
        'sass',
        'postcss:debug',
        'bake'
    ]);

    grunt.registerTask('test', 'test dist version', [
        'open',
        'connect:test'
    ]);

    grunt.registerTask('dist', 'build dist version', [
        'clean:js',
        'babel:dist',
        'sass',
        'postcss:dist',
        'bake',
        'htmlmin',      // minify html
        'uglify',       // compile js files in index.js
        'clean:dist'    // remove js file
    ]);

};


