var _ = require('underscore');
var mongoose = require('mongoose');

module.exports = function(modelName, namm){

    var debug = namm.debug;
    var resources = namm.resources;
    var modelProperties = resources[modelName];
    var model = mongoose.model(modelName);
    this[modelName] = model;

    var util_access = require('./util/access'), util_util = require('./util/util');

    return function(req, res) {
        util_access(modelName, namm); util_util(modelName, namm);

        var access = getRoleAccess(req, 'get');
        if(debug){ console.log(modelName + "/get/:id Access: " + access + " [" + req.user.username + "]"); }
        if (!access) { res.status(500).end('Permission Denied'); return;}

        var q = {
            _id: req.param('id')
        };

        if (access != 'all') addAccessLimiterToQuery(q, modelProperties, req);

        if(modelName == "User" && q._id == "0"){ q._id = req.user._id; }


        var query = model.findOne(q);

        if(debug){ console.log("GET QUERY: ", q); }

        autoPopulate(query);

        query.exec(function(err, result) {

            cleanResult(req, result, modelName, modelProperties);

            res.send(result);
        });
    }
}