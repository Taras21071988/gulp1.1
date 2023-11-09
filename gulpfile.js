const gulp = require("gulp");
const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require('gulp-sass-glob')
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const fs = require("fs");
const sourceMaps = require("gulp-sourcemaps");
// const groupMedia = require('gulp-group-css-media-queries')
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const webpack = require("webpack-stream");
const babel = require("gulp-babel");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");




const fileIncludeSetting = {
  prefix: "@@",
  basepath: "@file",
};

const startServerSetting = {
  livereload: true,
  open: true,
  port: 3000,
};

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      message: "Error <%= error message %>",
      sound: false,
    }),
  };
};

gulp.task("html", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./dist/"))
    .pipe(plumber(plumberNotify("html")))
    .pipe(fileInclude(fileIncludeSetting))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("sass", function () {
  return (
    gulp
      .src("./src/scss/*.scss")
      .pipe(changed("./dist/css/"))
      .pipe(plumber(plumberNotify("Styles")))
      .pipe(sourceMaps.init())
      .pipe(sassGlob())
      .pipe(sass())
      // .pipe(groupMedia())
      .pipe(sourceMaps.write())
      .pipe(gulp.dest("./dist/css/"))
  );
});

gulp.task("images", function () {
  return gulp
    .src("./src/img/**/*")
    .pipe(changed("./dist/img/"))
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest("./dist/img/"));
});

gulp.task("fonts", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./dist/fonts/"))
    .pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("files", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./dist/files/"))
    .pipe(gulp.dest("./dist/files/"));
});

gulp.task("server", function () {
  return gulp.src("./dist/").pipe(server(startServerSetting));
});

gulp.task("clean", function (done) {
  if (fs.existsSync("./dist/")) {
    return gulp.src("./dist/", { read: false }).pipe(clean());
  }
  done();
});

gulp.task("js", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./dist/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest("./dist/js/"));
});

gulp.task("watch", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass"));
  gulp.watch("./src/html/**/*.html", gulp.parallel("html"));
  gulp.watch("./src/img/**/*", gulp.parallel("images"));
  gulp.watch("./src/fonts/**/*", gulp.parallel("fonts"));
  gulp.watch("./src/files/**/*", gulp.parallel("files"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "images", "fonts", "files", "js"),
    gulp.parallel("server", "watch")
  )
);
