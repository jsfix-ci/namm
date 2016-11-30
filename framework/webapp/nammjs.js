module.exports = function(namm){

    var fs = require("fs");

    var scripts = namm.clientscripts;
    var stylesheets = namm.stylesheets;

    function loadScripts(filenames, cb, elem, parallel){
        var filesLoaded = 0;

        function loadFile(i){
            var filename = filenames[i];

            console.log("loading " + filename);

            var fileref = null;

            if(filename.indexOf(".css") >= 0){
                fileref = document.createElement('link')
                fileref.setAttribute("href", filename)
                fileref.setAttribute("rel", "stylesheet")
            }else{
                fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filename)
            }

            if (cb) { fileref.addEventListener('load', function (e) {
                console.log("loaded  " + filename);
                filesLoaded++;
                if(filesLoaded == filenames.length){ cb(null, e); }
                else if(!parallel){ loadFile(filesLoaded) }
            }, false); }

            document.getElementsByTagName(elem||"head")[0].appendChild(fileref)
        }

        if(!parallel){
            loadFile(filesLoaded);
        }else{
            for(var i in filenames){
                loadFile(i);
            }
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

    function loadAngular(){
        loadScripts(['/components/angular/angular.min.js'], function(){
            loadScripts(scripts, loadClientJs, 'body', true);
        });
    }

    return function(req, res) {

        var script = loadScripts.toString() + "\n";

        script += bootstrapAngularApp.toString() + "\n";

        script += loadClientJs.toString() + "\n";

        script += loadAngular.toString() + "\n";

        script += "\nvar scripts = " + JSON.stringify(scripts);
        script += "\nvar stylesheets = " + JSON.stringify(stylesheets);

        script += "\nloadScripts(stylesheets, null, 'head', true);";
        script += "\nloadAngular()";

        res.send(script);
    }
}