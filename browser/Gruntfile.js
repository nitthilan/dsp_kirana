module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    useminPrepare: {
      html: 'index_backup.html',
      options: {
        dest: 'dist'
      }
    },
    'closure-compiler': {
      frontend: {
        closurePath: 'utils/closure_compiler',
        js: 'dist/js/devan.js',
        jsOutputFile: 'dist/js/devan.min.js',
        maxBuffer: 500*1024, // Specified in bytes. defualt is 200*1024
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'module/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        maxerr: 4,
        globals: {
          globalstrict: true,
          jQuery: true,
          console: true,
          module: true,
          document: true,
          THREE: true,
          angular:true,
          MyApp: true,
          MyAppControllers: true,
          MyAppServices: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    copy: {
      concatjs:{
        expand: true,
        src: '.tmp/concat/js/devan.js',
        dest: 'dist/js',
        flatten: true,
        filter: 'isFile',
      },
      font:{
        expand: true,
        src: 'bower_components/bootstrap/fonts/*.*',
        dest: 'dist/fonts',
        flatten: true,
        filter: 'isFile',
      },
      select2:{
        expand: true,
        src: 'non_bower/select2/select2.png',
        dest: 'dist/css',
        flatten: true,
        filter: 'isFile',
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['jshint', 'useminPrepare', 'concat', 'copy:concatjs', 'cssmin', 'copy:font', 'copy:select2']);
  grunt.registerTask('build', ['jshint', 'qunit', 'useminPrepare', 'concat', 'uglify','closure-compiler', 'usemin']);

};
