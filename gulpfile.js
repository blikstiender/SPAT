var gulp  = require('gulp');
var sass  = require('gulp-sass');
var clean = require('gulp-clean'); 
var watch = require('gulp-watch');
var buffer = require('vinyl-buffer')
var source = require("vinyl-source-stream");
var uglify = require("gulp-uglify");
var reactify = require("reactify")
var rename = require('gulp-rename');
var browserify = require('browserify');
var glob = require("glob")

var SRC_DIR = './src/';
var OUT_DIR = 'cerevisiaeapp/public/';



/* erase the output directory */
gulp.task('clean', function() {
    return gulp.src('cerevisiae/public/*', {read: false})
            .pipe(clean());
});

function load_js() {
    console.log("copying js")
    glob(SRC_DIR + "js/*.js", {}, function (err, files) {
        var b = browserify({
            transform: [reactify]
        });
        files.forEach(function(file){
            if (file.indexOf(".js") > -1) {
                b.add(file)
            }
        });


        return b
            .bundle()
            .on('error', function(e) {console.error(e);})
            .pipe(source(SRC_DIR + 'js/'))
            .pipe(rename('app.js'))
            /*
            .pipe(buffer())
            .pipe(uglify())
            */
            .pipe(gulp.dest(OUT_DIR + "js/"));

    });
}
gulp.task('js', function () {
    return load_js();
});

/* compile sass and copy */
function load_css() {

    console.log("compiling sass and copying")
    return gulp.src(SRC_DIR + 'css/style.scss')
            .pipe(sass.sync().on('error', sass.logError))
            .pipe(rename("style.css"))
            .pipe(gulp.dest(OUT_DIR + 'css/'));
}
gulp.task('css', function () {
    return load_css()
}); 

function load_imgs () {
    console.log("copying all the images")
    return gulp.src(SRC_DIR + "img/*")
        .pipe(gulp.dest(OUT_DIR+ "img/"))
}
gulp.task('img', function(){
    return load_imgs();
});


/* copy html files */
function load_html () {
    console.log("copying html")
    return gulp.src(SRC_DIR + 'html/*')
        .pipe(gulp.dest(OUT_DIR + "html/"));
}

gulp.task('html', function () {
    return load_html();
});

gulp.task('default', ['js', 'css', 'html', "img"]);


/* add watcher for all frontend files */
gulp.task('watch', function (cb) {
    gulp.watch(SRC_DIR + "js/*", function () {
        load_js();
    });
    gulp.watch(SRC_DIR + "html/*", function () {
        load_html();
    });
    gulp.watch(SRC_DIR + "css/*", function () {
        load_css();
    });
    gulp.watch(SRC_DIR + "img/*", function () {
        load_imgs();
    });
});

