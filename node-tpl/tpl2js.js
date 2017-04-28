/**
 * 模板转化为js文件
 * 使用说明:
 *   tplPath:tpl模板文件的目录 默认为: ./tpl
 *   outputPath:js输出文件的目录 默认为: ./output
 *   编译运行： node tpl2js.js
 */

var fs = require('fs');
var path = require('path');
var os = require('os');
var readline = require('readline');

Date.prototype.format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

var transform = function (options) {
  var str_tpl_path = options.tplPath ? options.tplPath : './tpl';
  var str_output_path = options.outputPath ? options.outputPath : './output';
  var filename = options.filename ? options.filename : '';

  var tpl = "define(function(){" + os.EOL + "{{content}}" + os.EOL + "});";

  var tpl_path = path.resolve(str_tpl_path);
  var output_path = path.resolve(str_output_path);

  var exist = fs.existsSync(output_path);
  if (!exist) {
    fs.mkdirSync(output_path);
  }

  var read_stream = fs.createReadStream(path.resolve(tpl_path, filename + '.tpl'));
  var write_stream = fs.createWriteStream(path.resolve(output_path, filename + '.js'));

  var init_readline = readline.createInterface({
    input: read_stream
  });

  var index = 0;
  var fileContent = '';
  init_readline.on('line', function (line) {
    if (index == 1) {
      fileContent += "return ['" + line + "'," + os.EOL;
    }

    if (index > 1) {
      fileContent += "'" + line + "'," + os.EOL;
    }

    index++;
  });

  init_readline.on("close", () => {
    fileContent = fileContent.substr(0, fileContent.lastIndexOf(","));
    fileContent += "].join('');";
    console.log("[%s] Writing File [%s]",(new Date()).format("hh:mm:ss"), path.resolve(tpl_path, filename + '.tpl'));
    write_stream.write(tpl.replace(/{{content}}/g, fileContent) + os.EOL);
    console.log("[%s] Writing success...",(new Date()).format("hh:mm:ss"));
    console.log("[%s] Writed File [%s]", (new Date()).format("hh:mm:ss"), path.resolve(output_path, filename + '.js'));
  });
};

//获取文件并做目录映射
var getFils = function (tplPath, outputPath) {
  //获取文件列表
  var file_list = fs.readdirSync(tplPath);
  for (var i = 0, len = file_list.length; i < len; i++) {
    var cur_filename = file_list[i];
    var cur_full_fileName = path.resolve(tplPath, cur_filename);

    var file_info = fs.statSync(cur_full_fileName);

    //如果是文件
    if (file_info.isFile()) {
      var flag_arr = cur_filename.split('.');
      var suffix = '.' + flag_arr[flag_arr.length - 1];
      var file_true_name = cur_filename.replace(suffix, '');

      if (suffix == '.tpl') {
        transform({
          tplPath: tplPath,
          outputPath: outputPath,
          filename: file_true_name
        })
      }
    }
    //如果不是文件(文件夹)
    else {
      var exist = fs.existsSync(outputPath);
      if (!exist) {
        fs.mkdirSync(outputPath);
      }

      getFils(cur_full_fileName, path.resolve(outputPath, cur_filename));
    }
  }
};

(function () {
  var tplPath = './js/tpl';
  var outputPath = './js/output';

  getFils(path.resolve(tplPath), path.resolve(outputPath));
})();
