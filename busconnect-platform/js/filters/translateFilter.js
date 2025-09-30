// Translation Filter for BusConnect App
angular.module('busConnectApp').filter('translate', [
    'I18nService',
    function(I18nService) {
        return function(key, params) {
            return I18nService.translate(key, params);
        };
    }
]);