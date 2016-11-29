module.exports = function(namm){

    var fs = require("fs");

    var scripts = namm.clientscripts;
    var stylesheets = namm.stylesheets;

    function loadScripts(filenames, cb, elem){
        var filesLoaded = 0;
        for(var i in filenames){
            var filename = filenames[i];

            var fileref = null;

            if(filename.indexOf(".js") >= 0){
                fileref = document.createElement('script')
                fileref.setAttribute("type","text/javascript")
                fileref.setAttribute("src", filename)
            }else if(filename.indexOf(".css") >= 0){
                fileref = document.createElement('link')
                fileref.setAttribute("href", filename)
                fileref.setAttribute("rel","stylesheet")
            }

            if (cb) { fileref.addEventListener('load', function (e) {
                filesLoaded++;
                if(filesLoaded == filenames.length){ cb(null, e); }
            }, false); }

            document.getElementsByTagName(elem||"head")[0].appendChild(fileref)
        }
    }

    function bootstrapAngularApp(){
        angular.element(function() {
            angular.bootstrap(document, ['NammApp']);
        });
    }

    function loadClientJs(){
        loadScripts(['/client.js'], bootstrapAngularApp, "body")
    }

    return function(req, res) {

        var script = loadScripts.toString();

        script += bootstrapAngularApp.toString();

        script += loadClientJs.toString();

        script += "\nvar scripts = " + JSON.stringify(scripts);;
        script += "\nvar stylesheets = " + JSON.stringify(stylesheets);;

        script += "\nloadScripts(stylesheets)";
        script += "\nloadScripts(scripts, loadClientJs);";

        res.send(script);
    }
}