// Theme Toggle Directive for BusConnect App
angular.module('busConnectApp').directive('themeToggle', [
    'ThemeService',
    function(ThemeService) {
        return {
            restrict: 'E',
            template: `
                <div class="theme-toggle" ng-click="toggleTheme()">
                    <div class="toggle-switch" ng-class="{'active': isDarkMode}">
                        <div class="toggle-slider">
                            <i class="fas fa-sun sun-icon"></i>
                            <i class="fas fa-moon moon-icon"></i>
                        </div>
                    </div>
                </div>
            `,
            link: function(scope) {
                scope.isDarkMode = ThemeService.isDarkMode();
                
                scope.toggleTheme = function() {
                    ThemeService.toggleTheme();
                    scope.isDarkMode = ThemeService.isDarkMode();
                };
                
                // Listen for theme changes
                scope.$on('themeChanged', function(event, theme) {
                    scope.isDarkMode = theme === 'dark';
                });
            }
        };
    }
]);