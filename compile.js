  var async, fs, jade;

  fs = require("fs");

  jade = require("jade");

  async = require("async");

  exports.compile = function(templatesDir, done) {
    var js = 'var templates=window.templates={};\n';
    return fs.readdir(templatesDir, function(err, files) {
      var compileTmpl, jadeFiles;
      jadeFiles = files.filter(function(file) {
        return file.substr(-5) === ".jade";
      });
      compileTmpl = function(file, doneCompile) {
        var filePath, key;
        key = file.substr(0, file.length - 5);
        filePath = templatesDir + file;
        fs.readFile(filePath, function(err, src) {
          try {
            js += "templates." + key + " = " + jade.compileClient(src, {
              debug: true
            }) + "; \n\n";
          } catch (e) {
            console.log("error processing template ", file, " error:", e);
          } finally {
            doneCompile(err);
          }
        });
      };
      async.each(jadeFiles, compileTmpl, function(err) {
        //console.log(js);
        done(err, js);
      });
    });
  };