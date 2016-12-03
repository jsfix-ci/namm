var _ = require('underscore');
var mongoose = require('mongoose');

module.exports = function(modelName, namm){

    var debug = namm.debug;
    var resources = namm.resources;
    var modelProperties = resources[modelName];
    var model = mongoose.model(modelName);
    this[modelName] = model;

    var util_access = require('./util/access');
    var util_util = require('./util/util');

    return function(req, res) {

        util_util(modelName, namm);
        util_access(modelName, namm);

        var access = getRoleAccess(req, 'count');
        if(debug){ console.log(modelName + "/count Access: " + access + " [" + req.user.username + "]"); }
        if (!access) { res.status(500).end('Permission Denied'); return; }

        var privateAccess = hasPrivateAccess(req, 'count');
        if(debug){ console.log("PrivateAccess: " + privateAccess); }

        var q = {};

        if(debug){ console.log("Keys:"); }
        var _populate = null;

        Object.keys(req.query).forEach(function(key) {
            if (!privateAccess && modelProperties[key] && modelProperties[key]['$private']) return;

            if(key=='$populate'){
                _populate = req.query[key];
                return;
            }

            if(modelProperties[key] && modelProperties[key].ref){
                q[key] = mongoose.Types.ObjectId(req.query[key]);
            }else{
                if(req.query[key][0] == '{'){
                    q[key] = JSON.parse(req.query[key]);
                }else{
                    q[key] = req.query[key];
                }
            }

            if(debug){ console.log(key + ": " + q[key]); }
        });

        prepareMongoQuery(q);

        if (access != 'all') addAccessLimiterToQuery(q, modelProperties, req);

        if(debug){ console.log("FINAL QUERY:", q); }

        var query = model.count(q);

        query.exec(function(err, count) {
            if(err){
                res.end(JSON.stringify(err));
            }else{
                res.end(JSON.stringify(count));
            }
        });
    }
}