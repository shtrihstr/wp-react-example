var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var watch = require('gulp-watch');

var path = {
    src: {
        app: 'app/src/app.jsx'
    },
    watch: {
        app: 'app/src/**/*.jsx'
    },
    built: {
        app: 'app/built/'
    }
};

gulp.task('app:build', function () {

    if ('production' == process.env.NODE_ENV) {
        return browserify({entries: path.src.app, extensions: ['.jsx'], debug: false})
            .transform('babelify', {presets: ['es2015', 'react'], sourceMaps: false})
            .bundle()
            .pipe(source('app.js'))
            .pipe(streamify(uglify()))
            .pipe(gulp.dest(path.built.app));
    }
    else {
        return browserify({entries: path.src.app, extensions: ['.jsx'], debug: true})
            .transform('babelify', {presets: ['es2015', 'react']})
            .bundle()
            .pipe(source('app.js'))
            .pipe(gulp.dest(path.built.app));
    }
});

gulp.task('watch',function () {
    watch([path.watch.app], function () {
        gulp.start('app:build');
    });
});

gulp.task('default', ['watch']);