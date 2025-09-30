// Star Rating Directive for BusConnect App
angular.module('busConnectApp').directive('starRating', [
    function() {
        return {
            restrict: 'E',
            scope: {
                rating: '=',
                maxRating: '@',
                readonly: '@',
                onRate: '&'
            },
            template: `
                <div class="star-rating" ng-class="{'readonly': readonly}">
                    <i ng-repeat="star in stars track by $index" 
                       ng-class="getStarClass($index)"
                       ng-click="!readonly && setRating($index + 1)"
                       ng-mouseover="!readonly && hoverRating($index + 1)"
                       ng-mouseleave="!readonly && resetHover()"
                       class="star"></i>
                </div>
            `,
            link: function(scope) {
                scope.maxRating = parseInt(scope.maxRating) || 5;
                scope.stars = new Array(scope.maxRating);
                scope.hoverValue = 0;
                
                scope.getStarClass = function(index) {
                    var value = scope.hoverValue || scope.rating || 0;
                    return {
                        'fas fa-star': index < Math.floor(value),
                        'fas fa-star-half-alt': index === Math.floor(value) && value % 1 !== 0,
                        'far fa-star': index >= Math.ceil(value)
                    };
                };
                
                scope.setRating = function(rating) {
                    scope.rating = rating;
                    if (scope.onRate) {
                        scope.onRate({ rating: rating });
                    }
                };
                
                scope.hoverRating = function(rating) {
                    scope.hoverValue = rating;
                };
                
                scope.resetHover = function() {
                    scope.hoverValue = 0;
                };
            }
        };
    }
]);