//Include required modules
var gulp = require("gulp"),
    babelify = require('babelify'),
    browserify = require("browserify"),
    connect = require("gulp-connect"),
    source = require("vinyl-source-stream"),
    sass = require('gulp-sass');


//Copy static files from html folder to build folder
gulp.task("copyStaticFiles", function(){
    return gulp.src("./src/html/*.*")
    .pipe(gulp.dest("./build"));
});

//Convert ES6 ode in all js files in src/js folder and copy to 
//build folder as bundle.js
gulp.task("build", function(){

    return browserify({
        entries: ["./app/main.js"]
    })
    .transform(babelify.configure({
        presets : ["es2015"]
    }))
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./build"))
    .pipe(connect.reload());

});

gulp.task('sass', function(){
    console.log('sass');
    return gulp.src('assets/scss/main.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('build/'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('./app/*', ['build']);
    gulp.watch('./assets/scss/*', ['sass']);
});

//Start a test server with doc root at build folder and 
//listening to 9001 port. Home page = http://localhost:9001
gulp.task("startServer", function(){
    connect.server({
        root : "./",
        livereload : true,
        port : 9001
    });
});

//Default task. This will be run when no task is passed in arguments to gulp
gulp.task("default",["build", "watch", "startServer"]);