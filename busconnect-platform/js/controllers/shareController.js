// Share Controller for BusConnect App
angular.module('busConnectApp').controller('ShareController', [
    '$scope', 
    '$timeout', 
    'DataService', 
    'NotificationService', 
    'StorageService', 
    'ValidationService',
    function($scope, $timeout, DataService, NotificationService, StorageService, ValidationService) {
        
        // Initialize scope variables
        $scope.newStory = {
            title: '',
            route: '',
            category: '',
            content: '',
            tags: '',
            images: []
        };
        
        $scope.submitting = false;
        $scope.uploadProgress = 0;
        $scope.selectedFiles = [];
        $scope.previewImages = [];
        $scope.maxImages = 5;
        $scope.maxFileSize = 5 * 1024 * 1024; // 5MB
        
        // Story categories
        $scope.storyCategories = [
            { value: 'adventure', label: 'Adventure', icon: 'fas fa-mountain' },
            { value: 'budget', label: 'Budget Travel', icon: 'fas fa-wallet' },
            { value: 'scenic', label: 'Scenic Routes', icon: 'fas fa-camera' },
            { value: 'tips', label: 'Travel Tips', icon: 'fas fa-lightbulb' },
            { value: 'food', label: 'Food & Culture', icon: 'fas fa-utensils' },
            { value: 'safety', label: 'Safety', icon: 'fas fa-shield-alt' },
            { value: 'family', label: 'Family Travel', icon: 'fas fa-users' },
            { value: 'solo', label: 'Solo Travel', icon: 'fas fa-user' }
        ];
        
        // Popular routes for suggestions
        $scope.popularRoutes = [
            'Delhi to Manali',
            'Mumbai to Goa',
            'Bangalore to Mysore',
            'Chennai to Pondicherry',
            'Kolkata to Darjeeling',
            'Pune to Lonavala',
            'Hyderabad to Tirupati',
            'Ahmedabad to Mount Abu',
            'Jaipur to Udaipur',
            'Kochi to Munnar'
        ];
        
        // Form validation rules
        $scope.validationRules = {
            title: { required: true, minLength: 10, maxLength: 100 },
            route: { required: true, minLength: 5, maxLength: 50 },
            category: { required: true },
            content: { required: true, minLength: 50, maxLength: 2000 },
            tags: { maxLength: 200 }
        };
        
        // Initialize controller
        $scope.init = function() {
            $scope.loadDraftStory();
            $scope.setupAutoSave();
        };
        
        // Submit story
        $scope.submitStory = function() {
            if (!$scope.validateStory()) {
                return;
            }
            
            $scope.submitting = true;
            $scope.uploadProgress = 0;
            
            // Prepare story data
            var storyData = {
                id: Date.now(),
                title: $scope.newStory.title.trim(),
                route: $scope.newStory.route.trim(),
                category: $scope.newStory.category,
                content: $scope.newStory.content.trim(),
                tags: $scope.parseStoryTags($scope.newStory.tags),
                author: 'Current User', // In real app, get from auth service
                authorAvatar: 'images/default-avatar.jpg',
                date: new Date().toISOString(),
                likes: 0,
                comments: [],
                images: [],
                userLiked: false,
                showComments: false
            };
            
            // Upload images first if any
            if ($scope.selectedFiles && $scope.selectedFiles.length > 0) {
                $scope.uploadImages().then(function(imageUrls) {
                    storyData.images = imageUrls;
                    $scope.saveStory(storyData);
                }).catch(function(error) {
                    console.error('Error uploading images:', error);
                    NotificationService.show('Error uploading images', 'error');
                    $scope.submitting = false;
                });
            } else {
                $scope.saveStory(storyData);
            }
        };
        
        // Save story to data service
        $scope.saveStory = function(storyData) {
            DataService.createStory(storyData).then(function(createdStory) {
                NotificationService.show('Story shared successfully!', 'success');
                $scope.resetForm();
                $scope.clearDraftStory();
                $scope.submitting = false;
                
                // Redirect to stories section after a delay
                $timeout(function() {
                    $scope.$parent.setActiveSection('stories');
                }, 2000);
                
            }).catch(function(error) {
                console.error('Error saving story:', error);
                NotificationService.show('Error sharing story. Please try again.', 'error');
                $scope.submitting = false;
            });
        };
        
        // Upload images (mock implementation)
        $scope.uploadImages = function() {
            return new Promise(function(resolve, reject) {
                var imageUrls = [];
                var uploadedCount = 0;
                var totalFiles = $scope.selectedFiles.length;
                
                // Simulate image upload with progress
                $scope.selectedFiles.forEach(function(file, index) {
                    // In a real app, this would upload to a server or cloud storage
                    $timeout(function() {
                        // Mock upload - use the preview URL
                        var previewImage = $scope.previewImages.find(function(img) {
                            return img.name === file.name;
                        });
                        
                        if (previewImage) {
                            imageUrls.push(previewImage.url);
                        } else {
                            // Fallback to a placeholder
                            imageUrls.push('images/placeholder-story.jpg');
                        }
                        
                        uploadedCount++;
                        $scope.uploadProgress = Math.round((uploadedCount / totalFiles) * 100);
                        
                        if (uploadedCount === totalFiles) {
                            resolve(imageUrls);
                        }
                    }, (index + 1) * 500); // Simulate upload delay
                });
            });
        };
        
        // Validate story form
        $scope.validateStory = function() {
            var errors = [];
            
            // Title validation
            if (!ValidationService.validateRequired($scope.newStory.title)) {
                errors.push('Title is required');
            } else if (!ValidationService.validateMinLength($scope.newStory.title, $scope.validationRules.title.minLength)) {
                errors.push('Title must be at least ' + $scope.validationRules.title.minLength + ' characters');
            } else if (!ValidationService.validateMaxLength($scope.newStory.title, $scope.validationRules.title.maxLength)) {
                errors.push('Title must be less than ' + $scope.validationRules.title.maxLength + ' characters');
            }
            
            // Route validation
            if (!ValidationService.validateRequired($scope.newStory.route)) {
                errors.push('Route is required');
            } else if (!ValidationService.validateMinLength($scope.newStory.route, $scope.validationRules.route.minLength)) {
                errors.push('Route must be at least ' + $scope.validationRules.route.minLength + ' characters');
            }
            
            // Category validation
            if (!ValidationService.validateRequired($scope.newStory.category)) {
                errors.push('Category is required');
            }
            
            // Content validation
            if (!ValidationService.validateRequired($scope.newStory.content)) {
                errors.push('Story content is required');
            } else if (!ValidationService.validateMinLength($scope.newStory.content, $scope.validationRules.content.minLength)) {
                errors.push('Story must be at least ' + $scope.validationRules.content.minLength + ' characters');
            } else if (!ValidationService.validateMaxLength($scope.newStory.content, $scope.validationRules.content.maxLength)) {
                errors.push('Story must be less than ' + $scope.validationRules.content.maxLength + ' characters');
            }
            
            // File validation
            if ($scope.selectedFiles && $scope.selectedFiles.length > 0) {
                var fileErrors = $scope.validateFiles($scope.selectedFiles);
                errors = errors.concat(fileErrors);
            }
            
            if (errors.length > 0) {
                NotificationService.show(errors[0], 'error'); // Show first error
                return false;
            }
            
            return true;
        };
        
        // Validate uploaded files
        $scope.validateFiles = function(files) {
            var errors = [];
            
            if (files.length > $scope.maxImages) {
                errors.push('Maximum ' + $scope.maxImages + ' images allowed');
            }
            
            files.forEach(function(file) {
                if (!file.type.startsWith('image/')) {
                    errors.push('Only image files are allowed');
                }
                
                if (file.size > $scope.maxFileSize) {
                    errors.push('File size must be less than 5MB');
                }
            });
            
            return errors;
        };
        
        // Parse story tags
        $scope.parseStoryTags = function(tagsString) {
            if (!tagsString || typeof tagsString !== 'string') {
                return [];
            }
            
            return tagsString.split(',')
                .map(function(tag) { return tag.trim().toLowerCase(); })
                .filter(function(tag) { return tag.length > 0 && tag.length <= 20; })
                .slice(0, 10); // Limit to 10 tags
        };
        
        // Reset form
        $scope.resetForm = function() {
            $scope.newStory = {
                title: '',
                route: '',
                category: '',
                content: '',
                tags: '',
                images: []
            };
            
            $scope.selectedFiles = [];
            $scope.previewImages = [];
            $scope.uploadProgress = 0;
            
            // Reset file input
            var fileInput = document.getElementById('photo-upload');
            if (fileInput) {
                fileInput.value = '';
            }
        };
        
        // Remove preview image
        $scope.removePreviewImage = function(index) {
            $scope.previewImages.splice(index, 1);
            $scope.selectedFiles.splice(index, 1);
        };
        
        // Auto-save draft
        $scope.setupAutoSave = function() {
            $scope.$watch('newStory', function(newVal, oldVal) {
                if (newVal !== oldVal && $scope.hasContent()) {
                    $scope.saveDraftStory();
                }
            }, true);
        };
        
        // Check if form has content
        $scope.hasContent = function() {
            return $scope.newStory.title.trim() || 
                   $scope.newStory.route.trim() || 
                   $scope.newStory.content.trim();
        };
        
        // Save draft story
        $scope.saveDraftStory = function() {
            var draft = {
                story: angular.copy($scope.newStory),
                timestamp: new Date().toISOString()
            };
            StorageService.set('draftStory', draft);
        };
        
        // Load draft story
        $scope.loadDraftStory = function() {
            var draft = StorageService.get('draftStory');
            if (draft && draft.story) {
                // Check if draft is not too old (24 hours)
                var draftAge = new Date() - new Date(draft.timestamp);
                if (draftAge < 24 * 60 * 60 * 1000) {
                    $scope.newStory = draft.story;
                    NotificationService.show('Draft story loaded', 'info');
                }
            }
        };
        
        // Clear draft story
        $scope.clearDraftStory = function() {
            StorageService.remove('draftStory');
        };
        
        // Get character count
        $scope.getCharacterCount = function(text, maxLength) {
            var length = text ? text.length : 0;
            return {
                current: length,
                max: maxLength,
                remaining: maxLength - length,
                isOverLimit: length > maxLength
            };
        };
        
        // Get word count
        $scope.getWordCount = function(text) {
            if (!text) return 0;
            return text.trim().split(/\s+/).filter(function(word) {
                return word.length > 0;
            }).length;
        };
        
        // Route suggestions
        $scope.getRouteSuggestions = function(query) {
            if (!query || query.length < 2) return [];
            
            return $scope.popularRoutes.filter(function(route) {
                return route.toLowerCase().includes(query.toLowerCase());
            }).slice(0, 5);
        };
        
        // Select route suggestion
        $scope.selectRouteSuggestion = function(route) {
            $scope.newStory.route = route;
            $scope.routeSuggestions = [];
        };
        
        // Preview story
        $scope.previewStory = function() {
            if (!$scope.validateStory()) {
                return;
            }
            
            var previewData = {
                title: $scope.newStory.title,
                route: $scope.newStory.route,
                category: $scope.newStory.category,
                content: $scope.newStory.content,
                tags: $scope.parseStoryTags($scope.newStory.tags),
                images: $scope.previewImages.map(function(img) { return img.url; }),
                author: 'Current User',
                date: new Date().toISOString()
            };
            
            // Store preview data and show preview modal
            $scope.storyPreview = previewData;
            $scope.showPreview = true;
        };
        
        // Close preview
        $scope.closePreview = function() {
            $scope.showPreview = false;
            $scope.storyPreview = null;
        };
        
        // Get category info
        $scope.getCategoryInfo = function(categoryValue) {
            return $scope.storyCategories.find(function(cat) {
                return cat.value === categoryValue;
            }) || { label: categoryValue, icon: 'fas fa-folder' };
        };
        
        // Initialize controller
        $scope.init();
    }
]);