var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = {
    Subscription: {
        name: String,

        $init: function($scope, $http, $rootScope, $window) {
            $scope.$on('$routeChangeSuccess', function() {
                $scope.$parent.controllericon = "fa-money";
                $scope.$parent.controllerheader = "Subscription";
                $scope.$parent.controllerdescription = "View payment info";
            });

            Stripe.setPublishableKey($rootScope._stripe.stripePubKey);

            $scope.selectedPlan = {name: $rootScope._user.stripe.plan };

            $scope.cardData = {
                number: null,
                exp_month:  null,
                exp_year: null,
                cvc: null
            };

            $scope.updateSubscription = function(e) {

                if($scope.selectedPlan.name != 'free'){
                    $scope.btnDisabled = true;


                    if($rootScope._user.stripe.customerId && $rootScope._user.stripe.last4 && !$scope.cardData.number){
                        $scope.action('result', 'billing',$scope.path, null, {plan: $scope.selectedPlan.name}, 'post', function(data){
                            console.log(data);
                            $window.location.href = '/Subscription';
                        });
                    }else{
                        Stripe.card.createToken($scope.cardData, function(status, response) {
                            $scope.disableButton = false;
                            if (response.error) {
                                $scope.error = response.error.message;
                            } else {
                                var token = response.id;
                                var tokenData = {stripeToken : token, plan: $scope.selectedPlan.name};
                                $scope.action('result', 'billing', $scope.path, null, tokenData, 'post', function(data){
                                    console.log(data);
                                    $window.location.href = '/Subscription';
                                });
                            }
                        });
                    }
                }else{
                    $scope.cancelSubscription();
                }
            };

            $scope.cancelSubscription = function(){
                $scope.action('result', 'billing', 'cancelPlan', null, null, 'post', function(data){
                    console.log(data)
                    $window.location.href = '/Subscription';
                });
            }
        }


    }
}