var gulp = require("gulp");
var clean = require("gulp-clean");
var newer = require("gulp-newer");
var rename = require("gulp-rename");
var hspCompiler = require("gulp-hsp-compiler");
var hspTranspiler = require("gulp-hsp-transpiler");
var runSequence = require("run-sequence");

var clientDir = "build/client";
var staticsDevDir = clientDir + "/statics-dev"

gulp.task("dev", function () {
    gulp.src("lib/bootstrap/**").pipe(newer(staticsDevDir + "/bootstrap"))
        .pipe(gulp.dest(staticsDevDir + "/bootstrap"));
    gulp.src("node_modules/page/index.js").pipe(newer(staticsDevDir + "/page.js")).pipe(rename("page.js")).pipe(
        gulp.dest(staticsDevDir));
    gulp.src("node_modules/qs/index.js").pipe(newer(staticsDevDir + "/qs.js")).pipe(rename("qs.js")).pipe(
        gulp.dest(staticsDevDir));
    gulp.src("node_modules/hashspace/hsp/**/*.js").pipe(newer(staticsDevDir + "/hsp")).pipe(
        gulp.dest(staticsDevDir + "/hsp"));
    gulp.src("node_modules/noder-js/dist/browser/**/*.js").pipe(newer(staticsDevDir + "/noder-js")).pipe(
        gulp.dest(staticsDevDir + "/noder-js"));
    gulp.src("src/client/statics/**/*.hsp").pipe(newer({
        dest : staticsDevDir,
        ext : ".js"
    })).pipe(hspCompiler()).pipe(hspTranspiler()).pipe(gulp.dest(staticsDevDir));
    gulp.src([ "src/client/statics/**/*.js", "src/common/**/*.js" ]).pipe(newer({
        dest : staticsDevDir
    })).pipe(hspTranspiler()).pipe(gulp.dest(staticsDevDir));
    gulp.src([ "src/client/statics/**", "!**/*.js", "!**/*.hsp" ]).pipe(newer({
        dest : staticsDevDir
    })).pipe(gulp.dest(staticsDevDir));
    gulp.src([ "src/client/**", "!src/client/statics", "!src/client/statics/**" ]).pipe(newer({
        dest : clientDir
    })).pipe(gulp.dest(clientDir));
});

gulp.task("watch", function () {
    gulp.watch("src/**/*", [ "dev" ]);
});

gulp.task("clean", function () {
    return gulp.src("build", {
        read : false
    }).pipe(clean());
});

gulp.task("default", function (callback) {
    runSequence("prepublish", "watch", callback);
});

gulp.task("prepublish", function (callback) {
    runSequence("clean", "dev", callback);
});
