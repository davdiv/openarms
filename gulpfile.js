var gulp = require("gulp");
var clean = require("gulp-clean");
var newer = require("gulp-newer");
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var hspCompiler = require("gulp-hsp-compiler");
var hspTranspiler = require("gulp-hsp-transpiler");
var runSequence = require("run-sequence");
var wrap = require("gulp-wrap");
var replace = require('gulp-replace');
var exec = require('child_process').exec;

var clientDir = "build/client";
var staticsDevDir = clientDir + "/statics-dev"

gulp.task("dev-dep-bootstrap", function () {
    return gulp.src([ "node_modules/bootstrap/dist/**", "!node_modules/bootstrap/dist/**/*.js" ]).pipe(newer(staticsDevDir + "/bootstrap")).pipe(
        gulp.dest(staticsDevDir + "/bootstrap"));
});

gulp.task("dev-dep-keycloak", function () {
    return gulp.src([ "node_modules/keycloak-js/dist/keycloak.js" ]).pipe(newer(staticsDevDir + "/keycloak.js")).pipe(
        gulp.dest(staticsDevDir));
});

gulp.task("dev-dep-page", function () {
    return gulp.src("node_modules/page/index.js").pipe(newer(staticsDevDir + "/page.js")).pipe(rename("page.js")).pipe(
        gulp.dest(staticsDevDir));
});

gulp.task("dev-dep-diacritics", function () {
    return gulp.src("node_modules/diacritics/index.js").pipe(newer(staticsDevDir + "/diacritics.js")).pipe(
        rename("diacritics.js")).pipe(gulp.dest(staticsDevDir));
});

gulp.task("dev-dep-vis", function () {
    return gulp.src("node_modules/vis/dist/vis.js").pipe(newer(staticsDevDir + "/vis.js")).pipe(rename("vis.js")).pipe(
        gulp.dest(staticsDevDir));
});

gulp.task("dev-dep-vis-css", function () {
    return gulp.src(["node_modules/vis/dist/**", "!node_modules/vis/**/*.js", "!node_modules/vis/**/*.map", "!node_modules/vis/vis.css"]).pipe(newer(staticsDevDir + "/vis")).pipe(gulp.dest(staticsDevDir + "/vis"));
});

gulp.task("dev-dep-qs", function () {
    return gulp.src("node_modules/qs/index.js").pipe(newer(staticsDevDir + "/qs.js")).pipe(rename("qs.js")).pipe(
        gulp.dest(staticsDevDir));
});

gulp.task("dev-dep-hsp", function () {
    return gulp.src(
        [ "node_modules/hashspace/hsp/**/*.js", "!node_modules/hashspace/hsp/compiler/**",
            "!node_modules/hashspace/hsp/transpiler/**", "!node_modules/hashspace/hsp/utils/**" ]).pipe(
        newer(staticsDevDir + "/hsp")).pipe(gulp.dest(staticsDevDir + "/hsp"));
});

gulp.task("dev-dep-noder-js", function () {
    return gulp.src("node_modules/noder-js/dist/browser/**/*.js").pipe(newer(staticsDevDir + "/noder-js")).pipe(
        gulp.dest(staticsDevDir + "/noder-js"));
});

gulp.task("dev-hsp-compile", function () {
    return gulp.src("src/client/statics/**/*.hsp").pipe(newer({
        dest : staticsDevDir,
        ext : ".js"
    })).pipe(hspCompiler().on('error', gutil.log)).pipe(hspTranspiler()).pipe(gulp.dest(staticsDevDir));

});

gulp.task("dev-js-transpile", function () {
    return gulp.src([ "src/client/statics/**/*.js", "src/common/**/*.js", "!**/*.hsp.js" ]).pipe(newer({
        dest : staticsDevDir
    })).pipe(hspTranspiler().on('error', gutil.log)).pipe(gulp.dest(staticsDevDir));
});

gulp.task("dev-js-notranspile", function () {
    return gulp.src([ "src/client/statics/**/*.hsp.js" ]).pipe(newer({
        dest : staticsDevDir
    })).pipe(gulp.dest(staticsDevDir));
});

gulp.task("dev-statics", function () {
    return gulp.src([ "src/client/statics/**", "!**/*.js", "!**/*.hsp" ]).pipe(newer({
        dest : staticsDevDir
    })).pipe(gulp.dest(staticsDevDir));
});

gulp.task("dev-statics-root", function () {
    return gulp.src([ "src/client/**", "!src/client/statics", "!src/client/statics/**" ]).pipe(newer({
        dest : clientDir
    })).pipe(gulp.dest(clientDir));
});

gulp.task("dev-dep", [ "dev-dep-bootstrap", "dev-dep-page", "dev-dep-diacritics", "dev-dep-qs", "dev-dep-hsp",
    "dev-dep-noder-js", "dev-dep-vis", "dev-dep-vis-css", "dev-dep-keycloak" ]);

gulp.task("dev-main",
    [ "dev-hsp-compile", "dev-js-transpile", "dev-js-notranspile", "dev-statics", "dev-statics-root" ]);

gulp.task("dev", [ "dev-dep", "dev-main" ]);

gulp.task('package', [ "dev" ], function (cb) {
    exec('./node_modules/.bin/grunt --gulp', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})

gulp.task("watch", function () {
    gulp.watch("src/**/*", [ "dev-main" ]);
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
    runSequence("clean", "package", callback);
});
