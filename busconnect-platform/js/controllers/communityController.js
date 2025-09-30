// Community Controller for BusConnect App
angular.module('busConnectApp').controller('CommunityController', [
    '$scope', 
    '$timeout', 
    'DataService', 
    'NotificationService', 
    'StorageService', 
    'ValidationService',
    function($scope, $timeout, DataService, NotificationService, StorageService, ValidationService) {
        
        // Initialize scope variables
        $scope.forumTopics = [];
        $scope.filteredTopics = [];
        $scope.selectedForumCategory = '';
        $scope.showNewTopicForm = false;
        $scope.loading = false;
        $scope.submitting = false;
        
        // New topic form data
        $scope.newTopic = {
            title: '',
            category: '',
            content: '',
            tags: []
        };
        
        // Forum categories
        $scope.forumCategories = [
            { value: 'general', label: 'General Discussion', icon: 'fas fa-comments', color: '#2196F3' },
            { value: 'routes', label: 'Route Recommendations', icon: 'fas fa-route', color: '#4CAF50' },
            { value: 'safety', label: 'Safety Tips', icon: 'fas fa-shield-alt', color: '#FF9800' },
            { value: 'budget', label: 'Budget Travel', icon: 'fas fa-wallet', color: '#9C27B0' },
            { value: 'food', label: 'Food & Culture', icon: 'fas fa-utensils', color: '#E91E63' },
            { value: 'accommodation', label: 'Accommodation', icon: 'fas fa-bed', color: '#607D8B' }
        ];
        
        // Sorting options
        $scope.sortOptions = [
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'replies', label: 'Most Replies' }
        ];
        $scope.selectedSort = 'newest';
        
        // Initialize controller
        $scope.init = function() {
            $scope.loadForumTopics();
            $scope.setupWatchers();
            $scope.loadUserPreferences();
        };
        
        // Load forum topics
        $scope.loadForumTopics = function() {
            $scope.loading = true;
            DataService.getForumTopics().then(function(topics) {
                $scope.forumTopics = topics;
                $scope.applyForumFilters();
                $scope.loading = false;
            }).catch(function(error) {
                console.error('Error loading forum topics:', error);
                NotificationService.show('Error loading forum topics', 'error');
                $scope.loading = false;
            });
        };
        
        // Apply forum filters
        $scope.applyForumFilters = function() {
            var filtered = $scope.forumTopics;
            
            // Apply category filter
            if ($scope.selectedForumCategory) {
                filtered = filtered.filter(function(topic) {
                    return topic.category === $scope.selectedForumCategory;
                });
            }
            
            // Apply sorting
            filtered = $scope.sortTopics(filtered, $scope.selectedSort);
            
            $scope.filteredTopics = filtered;
        };
        
        // Sort topics
        $scope.sortTopics = function(topics, sortBy) {
            var sorted = [...topics];
            
            switch (sortBy) {
                case 'newest':
                    sorted.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });
                    break;
                case 'oldest':
                    sorted.sort(function(a, b) {
                        return new Date(a.date) - new Date(b.date);
                    });
                    break;
                case 'popular':
                    sorted.sort(function(a, b) {
                        return b.views - a.views;
                    });
                    break;
                case 'replies':
                    sorted.sort(function(a, b) {
                        return b.replies.length - a.replies.length;
                    });
                    break;
                default:
                    break;
            }
            
            return sorted;
        };
        
        // Forum category filter function
        $scope.forumCategoryFilter = function(topic) {
            if (!$scope.selectedForumCategory) return true;
            return topic.category === $scope.selectedForumCategory;
        };
        
        // Create new topic
        $scope.createNewTopic = function() {
            if (!$scope.validateNewTopic()) {
                return;
            }
            
            $scope.submitting = true;
            
            var topic = {
                id: Date.now(),
                title: $scope.newTopic.title.trim(),
                category: $scope.newTopic.category,
                content: $scope.newTopic.content.trim(),
                author: 'Current User', // In real app, get from auth service
                authorAvatar: 'images/default-avatar.jpg',
                date: new Date().toISOString(),
                replies: [],
                views: 0,
                likes: 0,
                tags: $scope.parseTopicTags($scope.newTopic.tags),
                showReplies: false
            };
            
            DataService.createForumTopic(topic).then(function(createdTopic) {
                $scope.forumTopics.unshift(createdTopic);
                $scope.applyForumFilters();
                $scope.resetNewTopicForm();
                $scope.showNewTopicForm = false;
                $scope.submitting = false;
                NotificationService.show('Topic created successfully!', 'success');
            }).catch(function(error) {
                console.error('Error creating topic:', error);
                NotificationService.show('Error creating topic', 'error');
                $scope.submitting = false;
            });
        };
        
        // Validate new topic form
        $scope.validateNewTopic = function() {
            var errors = [];
            
            if (!ValidationService.validateRequired($scope.newTopic.title)) {
                errors.push('Title is required');
            } else if (!ValidationService.validateMinLength($scope.newTopic.title, 5)) {
                errors.push('Title must be at least 5 characters long');
            } else if (!ValidationService.validateMaxLength($scope.newTopic.title, 100)) {
                errors.push('Title must be less than 100 characters');
            }
            
            if (!ValidationService.validateRequired($scope.newTopic.category)) {
                errors.push('Category is required');
            }
            
            if (!ValidationService.validateRequired($scope.newTopic.content)) {
                errors.push('Content is required');
            } else if (!ValidationService.validateMinLength($scope.newTopic.content, 20)) {
                errors.push('Content must be at least 20 characters long');
            }
            
            if (errors.length > 0) {
                NotificationService.show(errors.join(', '), 'error');
                return false;
            }
            
            return true;
        };
        
        // Parse topic tags
        $scope.parseTopicTags = function(tagsString) {
            if (!tagsString || typeof tagsString !== 'string') {
                return [];
            }
            
            return tagsString.split(',')
                .map(function(tag) { return tag.trim(); })
                .filter(function(tag) { return tag.length > 0; })
                .slice(0, 5); // Limit to 5 tags
        };
        
        // Reset new topic form
        $scope.resetNewTopicForm = function() {
            $scope.newTopic = {
                title: '',
                category: '',
                content: '',
                tags: []
            };
        };
        
        // Toggle topic replies
        $scope.toggleTopicReplies = function(topic) {
            topic.showReplies = !topic.showReplies;
            
            if (topic.showReplies) {
                // Increment view count
                topic.views++;
                DataService.incrementTopicViews(topic.id);
                
                // Load replies if not already loaded
                if (!topic.repliesLoaded) {
                    $scope.loadTopicReplies(topic);
                }
            }
        };
        
        // Load topic replies
        $scope.loadTopicReplies = function(topic) {
            DataService.getTopicReplies(topic.id).then(function(replies) {
                topic.replies = replies;
                topic.repliesLoaded = true;
            }).catch(function(error) {
                console.error('Error loading replies:', error);
                NotificationService.show('Error loading replies', 'error');
            });
        };
        
        // Add reply to topic
        $scope.addReply = function(topic) {
            if (!topic.newReply || !topic.newReply.trim()) {
                NotificationService.show('Please enter a reply', 'warning');
                return;
            }
            
            if (topic.newReply.trim().length < 10) {
                NotificationService.show('Reply must be at least 10 characters long', 'warning');
                return;
            }
            
            var reply = {
                id: Date.now(),
                author: 'Current User', // In real app, get from auth service
                authorAvatar: 'images/default-avatar.jpg',
                content: topic.newReply.trim(),
                date: new Date().toISOString(),
                likes: 0
            };
            
            topic.replies = topic.replies || [];
            topic.replies.push(reply);
            topic.newReply = '';
            
            // Update topic in data service
            DataService.addTopicReply(topic.id, reply).then(function() {
                NotificationService.show('Reply added!', 'success');
            }).catch(function(error) {
                console.error('Error adding reply:', error);
                NotificationService.show('Error adding reply', 'error');
                // Remove reply from UI if save failed
                topic.replies.pop();
            });
        };
        
        // Like a topic
        $scope.likeTopic = function(topic) {
            if (topic.userLiked) {
                topic.likes--;
                topic.userLiked = false;
            } else {
                topic.likes++;
                topic.userLiked = true;
            }
            
            DataService.updateTopicLikes(topic.id, topic.likes, topic.userLiked);
        };
        
        // Like a reply
        $scope.likeReply = function(reply) {
            if (reply.userLiked) {
                reply.likes--;
                reply.userLiked = false;
            } else {
                reply.likes++;
                reply.userLiked = true;
            }
            
            DataService.updateReplyLikes(reply.id, reply.likes, reply.userLiked);
        };
        
        // Get category info
        $scope.getCategoryInfo = function(categoryValue) {
            return $scope.forumCategories.find(function(cat) {
                return cat.value === categoryValue;
            }) || { label: categoryValue, icon: 'fas fa-folder', color: '#666' };
        };
        
        // Get topics count by category
        $scope.getCategoryTopicsCount = function(category) {
            return $scope.forumTopics.filter(function(topic) {
                return topic.category === category;
            }).length;
        };
        
        // Search topics
        $scope.searchTopics = function(query) {
            if (!query || query.trim().length < 2) {
                $scope.applyForumFilters();
                return;
            }
            
            var searchQuery = query.toLowerCase().trim();
            var filtered = $scope.forumTopics.filter(function(topic) {
                return topic.title.toLowerCase().includes(searchQuery) ||
                       topic.content.toLowerCase().includes(searchQuery) ||
                       topic.author.toLowerCase().includes(searchQuery) ||
                       (topic.tags && topic.tags.some(function(tag) {
                           return tag.toLowerCase().includes(searchQuery);
                       }));
            });
            
            $scope.filteredTopics = $scope.sortTopics(filtered, $scope.selectedSort);
        };
        
        // Load user preferences
        $scope.loadUserPreferences = function() {
            var preferences = StorageService.get('userPreferences') || {};
            if (preferences.forumCategory) {
                $scope.selectedForumCategory = preferences.forumCategory;
            }
            if (preferences.forumSort) {
                $scope.selectedSort = preferences.forumSort;
            }
        };
        
        // Save user preferences
        $scope.saveUserPreferences = function() {
            var preferences = StorageService.get('userPreferences') || {};
            preferences.forumCategory = $scope.selectedForumCategory;
            preferences.forumSort = $scope.selectedSort;
            StorageService.set('userPreferences', preferences);
        };
        
        // Setup watchers
        $scope.setupWatchers = function() {
            // Watch for category changes
            $scope.$watch('selectedForumCategory', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.applyForumFilters();
                    $scope.saveUserPreferences();
                }
            });
            
            // Watch for sort changes
            $scope.$watch('selectedSort', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.applyForumFilters();
                    $scope.saveUserPreferences();
                }
            });
        };
        
        // Format date for display
        $scope.formatDate = function(dateString) {
            var date = new Date(dateString);
            var now = new Date();
            var diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            if (diffInMinutes < 1) return 'Just now';
            if (diffInMinutes < 60) return diffInMinutes + 'm ago';
            if (diffInMinutes < 1440) return Math.floor(diffInMinutes / 60) + 'h ago';
            if (diffInMinutes < 10080) return Math.floor(diffInMinutes / 1440) + 'd ago';
            
            return date.toLocaleDateString();
        };
        
        // Initialize controller
        $scope.init();
    }
]);