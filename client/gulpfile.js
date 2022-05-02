const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));

function buildStyles() {
    // prettier-ignore
    return src('src/css/**/*.scss')
    .pipe(sass())
    .pipe(dest('src/css'));
}

function watchTask() {
    watch(['src/**/*.scss'], buildStyles);
}

exports.default = series(buildStyles, watchTask);
