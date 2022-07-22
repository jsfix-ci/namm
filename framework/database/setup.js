//##################################################################
//## SETUP MODELS AND CONNECT TO THE DATABASE
//##################################################################

module.exports = function(namm){

    var mongoose = require("mongoose");
    var Schema = mongoose.Schema;
    var _ = require("underscore");

    this.connectToDatabase = function connectToDatabase() {
        var config = namm.configuration;
        var mongoConn = process.env.MONGOLAB_URI || config.mongooseTestConn;
        var actualConn = /* TODO: JSFIX could not patch the breaking change:
        BREAKING CHANGE: mongoose.connect() returns a promise, removed MongooseThenable #5796
        Suggested fix: Only relevant if you depend on the return value being a reference to the mongoose object. In that case, you need to modify the usages of the return value to get the mongoose object from somewhere else.*/
        mongoose.connect(mongoConn);
        console.log('MONGO: ' + mongoConn);
        console.log(actualConn.connections);
        namm.debug = !process.env.MONGOLAB_URI;
        console.log("DEBUG: " + namm.debug);
    }

    this.setupModel = function setupModel(controllerName, model) {
        // Use the schema to register a model with MongoDb
        //if(mongoose.model(controllerName)) return;

        if (controllerName == 'User') {
            return;
        }

        var clone = _.clone(model);

        if (!clone.$public) {
            clone.__owner = {
                type: Schema.Types.ObjectId,
                ref: 'User',
                index: true
            };
        }

        var indexes = clone.$index;


        Object.keys(clone).forEach(function(property) {
            if (property[0] == '$') {
                delete clone[property];
            }
        });

        mongoose.model(controllerName, new Schema(clone));

        if(indexes){
            var schema = mongoose.model(controllerName);

            indexes.forEach(function(index){
                console.log("INDEX FOR " + controllerName + ": ", index);
                schema.collection.ensureIndex(index);
            });
        }
    }

    return {
        connectToDatabase: connectToDatabase,
        setupModel: setupModel,
    }
}