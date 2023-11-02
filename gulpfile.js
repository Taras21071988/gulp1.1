const gulp = require("gulp");

gulp.task("hello", function (done) {
  console.log("hello");
  done();
});

gulp.task("default", gulp.series("hello"));
