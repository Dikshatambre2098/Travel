// Language Selector Directive for BusConnect App
angular.module('busConnectApp').directive('languageSelector', [
    function() {
        return {
            restrict: 'E',
            controller: 'LanguageController',
            template: `
                <div class="language-selector" ng-controller="LanguageController">
                    <div class="language-toggle" ng-click="toggleLanguageDropdown()">
                        <span class="flag">{{getCurrentLanguageInfo().flag}}</span>
                        <span class="language-name">{{getCurrentLanguageInfo().name}}</span>
                        <i class="fas fa-chevron-down" ng-class="{'rotated': showLanguageDropdown}"></i>
                    </div>
                    
                    <div class="language-dropdown" ng-show="showLanguageDropdown">
                        <div class="language-option" 
                             ng-repeat="language in availableLanguages" 
                             ng-click="changeLanguage(language.code)"
                             ng-class="{'active': language.code === currentLanguage}">
                            <span class="flag">{{language.flag}}</span>
                            <span class="name">{{language.name}}</span>
                        </div>
                    </div>
                </div>
            `,
            link: function(scope, element) {
                // Close dropdown when clicking outside
                document.addEventListener('click', function(event) {
                    if (!element[0].contains(event.target)) {
                        scope.$apply(function() {
                            scope.showLanguageDropdown = false;
                        });
                    }
                });
            }
        };
    }
]);