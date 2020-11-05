const path = require('path');
function TransformCss(options) { }
const i_alicdn_pattern = /\/\/i.alicdn.com/gi;
const at_alicdn_pattern = /\/\/at.alicdn.com/gi;
const https_i_alicdn = 'https://i.alicdn.com';
const https_at_alicdn = 'https://at.alicdn.com';
TransformCss.prototype.apply = function (compiler) {

  compiler.plugin('emit', function (compilation, callback) {

    for (const filename in compilation.assets) {
      const ext_name = path.extname(filename);
      if (ext_name === '.css') {
        let css_value = compilation.assets[filename]['_value'];
        compilation.assets[filename]['_value'] = css_value.replace(i_alicdn_pattern,https_i_alicdn).replace(at_alicdn_pattern,https_at_alicdn);
      }
    }
    callback();
  });
};

module.exports = TransformCss;