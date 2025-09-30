// Theme Service for BusConnect App
angular.module('busConnectApp').service('ThemeService', [
    'StorageService', '$rootScope',
    function(StorageService, $rootScope) {
        
        var self = this;
        
        // Current theme
        self.currentTheme = StorageService.get('theme_preference') || 'light';
        
        // Initialize theme on service load
        self.init = function() {
            self.applyTheme(self.currentTheme);
        };
        
        // Toggle between light and dark theme
        self.toggleTheme = function() {
            self.currentTheme = self.currentTheme === 'light' ? 'dark' : 'light';
            self.applyTheme(self.currentTheme);
            StorageService.set('theme_preference', self.currentTheme);
            $rootScope.$broadcast('themeChanged', self.currentTheme);
        };
        
        // Apply theme to document
        self.applyTheme = function(theme) {
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            document.body.classList.add('theme-' + theme);
        };
        
        // Get current theme
        self.getCurrentTheme = function() {
            return self.currentTheme;
        };
        
        // Check if dark mode is active
        self.isDarkMode = function() {
            return self.currentTheme === 'dark';
        };
        
        // Initialize theme
        self.init();
    }
]);