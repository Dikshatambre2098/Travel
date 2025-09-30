// Internationalization Service for BusConnect App
angular.module('busConnectApp').service('I18nService', [
    'StorageService', '$rootScope',
    function(StorageService, $rootScope) {
        
        var self = this;
        
        // Available languages
        self.languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
            { code: 'zh', name: '中文', flag: '🇨🇳' }
        ];
        
        // Current language
        self.currentLanguage = StorageService.get('selected_language') || 'en';
        
        // Translation data
        self.translations = {
            en: {
                // Navigation
                nav_home: 'Home',
                nav_stories: 'Stories',
                nav_community: 'Community',
                nav_tips: 'Travel Tips',
                nav_share: 'Share Story',
                nav_notifications: 'Notifications',
                
                // Home page
                hero_title: 'Share Your Bus Journey Stories',
                hero_subtitle: 'Connect with fellow travelers, share experiences, and discover amazing routes across the country',
                btn_share_story: 'Share Your Story',
                btn_explore_stories: 'Explore Stories',
                featured_stories: 'Featured Stories',
                
                // Stories
                search_placeholder: 'Search stories, routes, destinations...',
                all_categories: 'All Categories',
                category_adventure: 'Adventure',
                category_budget: 'Budget Travel',
                category_scenic: 'Scenic Routes',
                category_tips: 'Travel Tips',
                category_food: 'Food & Culture',
                category_safety: 'Safety',
                
                // Actions
                btn_like: 'Like',
                btn_comment: 'Comment',
                btn_share: 'Share',
                add_comment: 'Add a comment...',
                btn_post: 'Post',
                
                // Notifications
                notification_settings: 'Notification Settings',
                notification_preferences: 'Notification Preferences',
                email_notifications: 'Email Notifications',
                sms_notifications: 'SMS Notifications',
                push_notifications: 'Push Notifications',
                promotional_offers: 'Promotional Offers',
                save_preferences: 'Save Preferences',
                
                // Messages
                story_liked: 'Story liked!',
                comment_added: 'Comment added!',
                preferences_saved: 'Preferences saved successfully!',
                error_loading: 'Error loading data',
                
                // Language selector
                select_language: 'Select Language'
            },
            
            es: {
                nav_home: 'Inicio',
                nav_stories: 'Historias',
                nav_community: 'Comunidad',
                nav_tips: 'Consejos de Viaje',
                nav_share: 'Compartir Historia',
                nav_notifications: 'Notificaciones',
                
                hero_title: 'Comparte Tus Historias de Viaje en Autobús',
                hero_subtitle: 'Conecta con otros viajeros, comparte experiencias y descubre rutas increíbles por todo el país',
                btn_share_story: 'Compartir Tu Historia',
                btn_explore_stories: 'Explorar Historias',
                featured_stories: 'Historias Destacadas',
                
                search_placeholder: 'Buscar historias, rutas, destinos...',
                all_categories: 'Todas las Categorías',
                category_adventure: 'Aventura',
                category_budget: 'Viaje Económico',
                category_scenic: 'Rutas Panorámicas',
                category_tips: 'Consejos de Viaje',
                category_food: 'Comida y Cultura',
                category_safety: 'Seguridad',
                
                btn_like: 'Me Gusta',
                btn_comment: 'Comentar',
                btn_share: 'Compartir',
                add_comment: 'Añadir un comentario...',
                btn_post: 'Publicar',
                
                notification_settings: 'Configuración de Notificaciones',
                notification_preferences: 'Preferencias de Notificación',
                email_notifications: 'Notificaciones por Email',
                sms_notifications: 'Notificaciones SMS',
                push_notifications: 'Notificaciones Push',
                promotional_offers: 'Ofertas Promocionales',
                save_preferences: 'Guardar Preferencias',
                
                story_liked: '¡Historia marcada como favorita!',
                comment_added: '¡Comentario añadido!',
                preferences_saved: '¡Preferencias guardadas exitosamente!',
                error_loading: 'Error al cargar datos',
                
                select_language: 'Seleccionar Idioma'
            },
            
            hi: {
                nav_home: 'होम',
                nav_stories: 'कहानियाँ',
                nav_community: 'समुदाय',
                nav_tips: 'यात्रा सुझाव',
                nav_share: 'कहानी साझा करें',
                nav_notifications: 'सूचनाएं',
                
                hero_title: 'अपनी बस यात्रा की कहानियाँ साझा करें',
                hero_subtitle: 'साथी यात्रियों से जुड़ें, अनुभव साझा करें और देश भर के अद्भुत मार्गों की खोज करें',
                btn_share_story: 'अपनी कहानी साझा करें',
                btn_explore_stories: 'कहानियाँ देखें',
                featured_stories: 'विशेष कहानियाँ',
                
                search_placeholder: 'कहानियाँ, मार्ग, गंतव्य खोजें...',
                all_categories: 'सभी श्रेणियाँ',
                category_adventure: 'रोमांच',
                category_budget: 'बजट यात्रा',
                category_scenic: 'सुंदर मार्ग',
                category_tips: 'यात्रा सुझाव',
                category_food: 'भोजन और संस्कृति',
                category_safety: 'सुरक्षा',
                
                btn_like: 'पसंद',
                btn_comment: 'टिप्पणी',
                btn_share: 'साझा करें',
                add_comment: 'टिप्पणी जोड़ें...',
                btn_post: 'पोस्ट करें',
                
                notification_settings: 'सूचना सेटिंग्स',
                notification_preferences: 'सूचना प्राथमिकताएं',
                email_notifications: 'ईमेल सूचनाएं',
                sms_notifications: 'SMS सूचनाएं',
                push_notifications: 'पुश सूचनाएं',
                promotional_offers: 'प्रचार ऑफर',
                save_preferences: 'प्राथमिकताएं सहेजें',
                
                story_liked: 'कहानी पसंद की गई!',
                comment_added: 'टिप्पणी जोड़ी गई!',
                preferences_saved: 'प्राथमिकताएं सफलतापूर्वक सहेजी गईं!',
                error_loading: 'डेटा लोड करने में त्रुटि',
                
                select_language: 'भाषा चुनें'
            }
        };
        
        // Get translation for a key
        self.translate = function(key, params) {
            var translation = self.translations[self.currentLanguage] && 
                             self.translations[self.currentLanguage][key] || 
                             self.translations['en'][key] || 
                             key;
            
            // Replace parameters if provided
            if (params) {
                Object.keys(params).forEach(function(param) {
                    translation = translation.replace('{{' + param + '}}', params[param]);
                });
            }
            
            return translation;
        };
        
        // Change language
        self.setLanguage = function(languageCode) {
            self.currentLanguage = languageCode;
            StorageService.set('selected_language', languageCode);
            $rootScope.$broadcast('languageChanged', languageCode);
        };
        
        // Get current language
        self.getCurrentLanguage = function() {
            return self.currentLanguage;
        };
        
        // Get language info
        self.getLanguageInfo = function(code) {
            return self.languages.find(function(lang) {
                return lang.code === code;
            });
        };
        
        // Get all available languages
        self.getAvailableLanguages = function() {
            return self.languages;
        };
    }
]);