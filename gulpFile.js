const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');

gulp.task('sass', () => {
    gulp.src('./scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted/'));
});

gulp.task('loginBundle', () => {
    gulp.src(['./client/login/client.js',
            './client/helper/helper.js'])
        .pipe(concat('loginBundle.js'))
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'));  
});

gulp.task('appBundle', () => {
    gulp.src(['./client/app/maker.js',
            './client/app/progresscircle.js',
            './client/helper/helper.js'])
        .pipe(concat('bundle.js'))
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'));  
});

gulp.task('pinsBundle', () => {
    gulp.src(['./client/pins/pins.js',
            './client/helper/helper.js'])
        .pipe(concat('pinsBundle.js'))
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'));  
}); 

gulp.task('settingsBundle', () => {
    gulp.src(['./client/settings/settings.js',
            './client/helper/helper.js'])
        .pipe(concat('settingsBundle.js'))
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'));  
});

gulp.task('lint', () => {
    return gulp.src('./server/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
    gulp.watch('./scss/style.scss',['sass']);
    gulp.watch(['./client/settings/', './client/helper/'],['settingsBundle']);
    gulp.watch(['./client/app/maker.js', './client/app/progresscircle.js', './client/helper/helper.js'],['appBundle']);
    gulp.watch(['./client/login/client.js', './client/helper/helper.js'],['loginBundle']);
    gulp.watch(['./client/pins/pins.js', './client/helper/helper.js'],['pinsBundle']);
    
    nodemon({
        script: './server/app.js',
        ext: 'js',
        tasks: ['lint']
    });
});

gulp.task('build', () => {
    gulp.start('sass');
    gulp.start('appBundle');
    gulp.start('loginBundle');
    gulp.start('pinsBundle');
    gulp.start('settingsBundle');
    gulp.start('lint');
});