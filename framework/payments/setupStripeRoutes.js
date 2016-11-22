
module.exports = function setupStripeRoutes(namm){
    var app = namm.app;
    var mongoose = require("mongoose");
    var stripeOptions = namm.stripeOptions;
    var isAuthenticated = namm.isAuthenticated;

    var userSchema = mongoose.model('User').schema;
    var stripeCustomer = require('./stripeCustomer');
    userSchema.plugin(stripeCustomer, stripeOptions);
    var setupStripe = require('./setupStripe');

    app.post('/billing/updateBilling', isAuthenticated, setupStripe.postBilling);
    app.post('/billing/updatePlan', isAuthenticated, setupStripe.postPlan);
    app.post('/billing/cancelPlan', isAuthenticated, setupStripe.cancelPlan);
}