/**
 * Created by ga on 20/12/14.
 */

var __loadScripts, __loaded = {};
var nQ = window.nQ = {
    layout: {},
    data: {},
    loadJavaScript: function (file, onComplete) {
        if (__loaded[file]) {
            console.log('skip loading already loaded script ' + file);
            return;
        }
        var d = document, t = 'script',
            o = d.createElement(t),
        s = d.getElementsByTagName(t)[0];
        __loaded[file] = {pending: 1, el: o};
        o.src = file;
        o.addEventListener('load', function (e) {
            delete __loaded[file].pending;
            if (onComplete) {
                onComplete(null, e);
            }
        }, false);
        s.parentNode.insertBefore(o, s);
    },

    removeJavaScript: function (file) {
        var meta = __loaded[file];
        if (meta) {
            var s = meta.el;
            delete __loaded[file];
            document.removeChild(s);
        }
    },

    loadScripts: function (scripts, done) {
        if (scripts.length) {
            var script = scripts.shift(), _scripts = scripts;
            nQ.loadJavaScript(script, function () {
                __loadScripts(_scripts, done);
            });
            return;
        }
        done && done();
    }
}
__loadScripts = nQ.loadScripts;

nQ.loadScripts(['js/jquery.js', 'js/underscore.js', 'js/backbone.js', 'js/backbone.marionette.js', 'js/templates.js', 'js/main.app.js', 'bootstrap/dist/js/bootstrap.js']);

console.log("done start");

