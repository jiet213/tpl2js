import gulp from 'gulp';

import glob from 'glob';

import path from 'path';

import transformTemplate from './transformTemplate.js';

//自动刷新
let browserSync = require('browser-sync').create();

gulp.task('default',["tpl"],() => {

    // 建立浏览器自动刷新服务器
    // browserSync.init({
    //     // port: "8000",
    //     // startPath: "../index.html",
    //     files: ["./js/tpl/output/**/*.js"],
    //     server: {
    //         baseDir: "../"
    //     },
    //     notify: false
    // });

    gulp.watch("./js/tpl/**/*.tpl").on("change", function(event) {

        if(event.path.endsWith(".tpl")){

            transformTemplate(event.path);

            // browserSync.reload();

        }

    });

    // 自动刷新
    // gulp.watch(path.join("./js/tpl/output/", "**"), function() {

    //     browserSync.reload();

    // });

});


gulp.task('tpl', () => {

    glob("./js/tpl/**/*.tpl", function(er, files) {

        // console.log(files,er);

        if(Object.prototype.toString.call(files) !== "[object Array]") return;

        // files 是匹配到的文件的数组.
        // 如果 `nonull` 选项被设置为true, 而且没有找到任何文件,那么files就是glob规则本身,而不是空数组
        // er是当寻找的过程中遇的错误
        files.forEach(function(value,index){

            value = value.replace(/\//g, "\\");

            transformTemplate(value);

        });
    });

});
