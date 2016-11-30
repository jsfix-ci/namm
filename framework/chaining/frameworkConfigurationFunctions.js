module.exports = function(exports){

    var routes = exports.routeList;
    var resources = exports.resources;
    var connectors = exports.connectorList;
    var services = exports.serviceList;
    require("../util/util")();
    //var path = require('path');

    function route(method, endpoint, handler, $public){
        var params = {method: method, endpoint: endpoint, handler:handler};
        if($public) params.$public = true;

        routes[method + "|" + endpoint] = params;
        return exports;
    }

    exports.get = function get(endpoint, handler, $public){
        return route('get', endpoint, handler, $public);
    }
    exports.post = function post(endpoint, handler, $public){
        return route('post', endpoint, handler, $public);
    }

    exports.routes = function require_routes(path){
        var raw_routes = {};
        load_directory(path, raw_routes);
        Object.keys(raw_routes).forEach(function(route){
            var parts = route.split(' ');
            var methodSpec = parts.length == 2 ? splitToObject(parts[0].toLowerCase(),'|') : null;
            var method = methodSpec ? (methodSpec.get ? "get" : methodSpec.post ? "post" : "get") : "get";
            var isPublic = methodSpec ? (methodSpec.public ? true : false) : false;
            var endpoint = parts[parts.length-1];
            var route = {method:method, endpoint:endpoint, handler:raw_routes[route]};
            if(isPublic){
                route.$public = true;
            }
            routes.push(route)
        });
        return exports;
    }

    //exports.modelsPath = path.dirname(require.main.filename) + "/models";
    exports.require = exports.models = function require_path(path){
        load_directory(path, resources);
        exports.modelsPath = path;
        return exports;
    }

    exports.services = function require_services(path){
        load_directory(path, services, true);
        console.log("SERVICES", services);
        exports.servicesPath = path;
        return exports;
    }

    exports.connectors = function require_connectors(path){
        load_directory(path, connectors, true);
        console.log("CONNECTORS", connectors);
        exports.connectorList = connectors;
        exports.connectorsPath = path;
        return exports;
    }

    //exports.partialsPath = path.dirname(require.main.filename) + "/public/partials";
    exports.partials = function set_partials(path){
        exports.partialsPath = path;
        return exports;
    }

    exports.stripe = function stripe(options){
        exports.stripeOptions = options;
        return exports;
    }

    exports.favicon = function set_favicon(path){
        exports.faviconPath = path;
        return exports;
    }

    exports.registrationCode = function set_registration_code(code){
        exports.registrationPassword = code;
        return exports;
    }

    //exports.staticPath = path.dirname(require.main.filename) + "/public";
    exports.public = function set_public(path){
        exports.staticPath = path;
        return exports;
    }

    exports.views = function set_views(path){
        exports.viewPath = path;
        return exports;
    }

    exports.layout = function set_layout(path){
        exports.layoutPath = path;
        return exports;
    }

    exports.share = function share(data){
        exports.shared = data;
        return exports;
    }

    exports.config = function conf(settings){
        exports.configuration = settings;
        return exports;
    }

    exports.sockets = function use_sockets(){
        exports.useSockets = true;
        return exports;
    }

    exports.clientscripts_angular = [
        "/components/angular/angular.min.js"
        "/components/angular-route/angular-route.min.js",

        "/components/angular-strap/dist/angular-strap.min.js",
        "/components/angular-strap/dist/angular-strap.tpl.min.js",
        "/components/angular-animate/angular-animate.min.js",
        "/components/angular-route/angular-route.min.js",
    ];

    exports.clientscripts_namm = [
        "/_models.js",
        "/_services.js",
        "/client.js",
    ];

    exports.clientscripts = [
        "/components/Chart.js/Chart.min.js",
        "/components/angular-chart.js/dist/angular-chart.js",
        "/components/ladda/dist/spin.min.js",
        "/components/ladda/dist/ladda.min.js",
        "/components/ladda-angular/dist/ladda-angular.min.js",
        "/components/textAngular/dist/textAngular-sanitize.min.js",
        "/components/textAngular/dist/textAngular-rangy.min.js",
        "/components/textAngular/dist/textAngular.min.js",
        "/components/jquery/dist/jquery.min.js",
        "/components/papaparse/papaparse.min.js",
        "/components/blueimp-md5/js/md5.min.js",
        "/components/phoneformat/dist/phone-format.min.js",
        "/components/dirPagination/dirPagination.js",

        "https://js.stripe.com/v2/",
    ];

    exports.scripts = function use_scripts(scripts){
        scripts.forEach(function(script){
            exports.clientscripts.push(script);
        });
        return exports;
    }

    exports.stylesheets = [
        "/components/bootstrap/dist/css/bootstrap.css",
        "/components/bootstrap-additions/dist/modules/aside.css",
        "/components/angular-motion/dist/angular-motion.min.css",
        "/components/font-awesome/css/font-awesome.min.css",
        "/components/textAngular/dist/textAngular.css",
        "/components/ladda/dist/ladda-themeless.min.css"
    ]

    exports.styles = function use_styles(styles){
        styles.forEach(function(style){
            if(style == null){
                exports.stylesheets = [];
            }
            exports.stylesheets.push(style);
        });
        return exports;
    };
}