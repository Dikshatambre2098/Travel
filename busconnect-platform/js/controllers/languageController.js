// Language Controller for BusConnect App
angular.module('busConnectApp').controller('LanguageController', [
    '$scope', 'I18nService',
    function($scope, I18nService) {
        
        // Initialize scope variables
        $scope.availableLanguages = I18nService.getAvailableLanguages();
        $scope.currentLanguage = I18nService.getCurrentLanguage();
        $scope.showLanguageDropdown = false;
        
        // Change language
        $scope.changeLanguage = function(languageCode) {
            I18nService.setLanguage(languageCode);
            $scope.currentLanguage = languageCode;
            $scope.showLanguageDropdown = false;
        };
        
        // Toggle language dropdown
        $scope.toggleLanguageDropdown = function() {
            $scope.showLanguageDropdown = !$scope.showLanguageDropdown;
        };
        
        // Get current language info
        $scope.getCurrentLanguageInfo = function() {
            return I18nService.getLanguageInfo($scope.currentLanguage);
        };
        
        // Listen for language changes
        $scope.$on('languageChanged', function(event, languageCode) {
            $scope.currentLanguage = languageCode;
        });
    }
]);