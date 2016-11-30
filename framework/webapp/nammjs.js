module.exports = function(namm){

    var fs = require("fs");

    var stylesheets = namm.stylesheets;

    var scripts = [];
    for(var i in namm.clientscripts_angular){ scripts.push(namm.clientscripts_angular[i]) }
    for(var i in namm.clientscripts){ scripts.push(namm.clientscripts[i]) }
    for(var i in namm.clientscripts_namm){ scripts.push(namm.clientscripts_namm[i]) }

    function loadScripts(filenames, cb, elem){
        var filesLoaded = 0;

        function loadFile(i){
            var filename = filenames[i];

            if(!filename) return;

            //console.log("loading " + filename);

            var fileref = null;

            if(filename.indexOf(".css") >= 0){
                fileref = document.createElement('link')
                fileref.setAttribute("href", filename)
                fileref.setAttribute("rel", "stylesheet")
            }else{
                fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filename)
                fileref.async = false;
            }

            if (cb) { fileref.addEventListener('load', function (e) {
                //console.log("loaded  " + filename);
                filesLoaded++;
                if(filesLoaded == filenames.length){ cb(null, e); }
            }, false); }

            document.getElementsByTagName(elem||"head")[0].appendChild(fileref)
        }

        for(var i in filenames){
            loadFile(i);
        }
    }

    function bootstrapAngularApp(){
        angular.element(function() {
            angular.bootstrap(document, ['NammApp']);
        });
    }

    /*function loadClientJs(){
        loadScripts(['/client.js'], bootstrapAngularApp, "body")
    }

    function loadAngular(){
        loadScripts(['/components/angular/angular.min.js'], function(){
            loadScripts(scripts, loadClientJs, 'body');
        });
    }*/

    return function(req, res) {

        var script = loadScripts.toString() + "\n";

        script += bootstrapAngularApp.toString() + "\n";

        //script += loadClientJs.toString() + "\n";
        //script += loadAngular.toString() + "\n";

        script += "\nvar scripts = " + JSON.stringify(scripts);
        script += "\nvar stylesheets = " + JSON.stringify(stylesheets);

        script += "\nloadScripts(stylesheets);";
        script += "\nloadScripts(scripts);";
        //script += "\nloadAngular()";

        res.send(script);
    }
}