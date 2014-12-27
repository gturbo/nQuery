var nQ = window.nQ;
nQ.delayUntil = function (cond, done) {
    var h, check = function () {
        if (cond()) {
            done();
            clearInterval(h);
        }
    };
    h = setInterval(check, 50);
    return h;
};
nQ.Router = Backbone.Router.extend({
    subRouters: {},
    modules: {},
    routes: {
        ':module*tail': 'subRoute'
    },
    subRoute: function (moduleName, tail) {
        console.log('calling submodule router', moduleName, 'for url', tail);
        var routers = this.subRouters;
        this.startModule(moduleName, function() {
            if (!_.any(routers[moduleName].handlers, function (handler) {
                    if (handler.route.test(tail)) {
                        try {
                            handler.callback(tail);
                        } catch (err) {
                            console.log('error in subrouter', moduleName ,'for url', tail, err);
                        }
                        return true;
                    }
                }))
                console.log('WARNING unable to match route', tail, 'for module', moduleName);
        });
    },
    loadModule: function (name, done) {
        var status = this.modules[name];
        if (status == 'loaded')
            done(nQ.layout[name]); // module already loaded
        else {
            var self = this;
            var wait = function () {
                nQ.delayUntil(function () {
                    return nQ.layout.hasOwnProperty(name);
                }, function () {
                    self.modules[name] = 'loaded';
                    done(nQ.layout[name]);
                })
            };
            if (!this.modules[name]) {
                // load module and wait
                this.modules[name] = 'loading';
                nQ.loadJavaScript('js/' + name + '/start.js', wait);
            } else {
                // module already loading just wait
                // ??? should we cancel previous callback ?
                wait();
            }
        }
    },
    startModule: function (name, done) {
        this.loadModule(name, function (layout) {
            this.app.body.show(layout);
            done();
        });
    },
    initialize: function() {
        _.bindAll(this, 'subRoute');
    }
});

nQ.SubRouter = Backbone.Router.extend({
    handlers: [],
    route: function (route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];
        var router = this;
        this.handlers.unshift({
            route: route,
            callback: function (fragment) {
                var args = router._extractParameters(route, fragment);
                router.execute(callback, args);
            }
        });
        return this;
    }
});