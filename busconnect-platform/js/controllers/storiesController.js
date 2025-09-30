// Stories Controller for BusConnect App
angular.module('busConnectApp').controller('StoriesController', [
    '$scope', 
    '$timeout', 
    'DataService', 
    'NotificationService', 
    'StorageService',
    function($scope, $timeout, DataService, NotificationService, StorageService) {
        
        // Initialize scope variables
        $scope.stories = [];
        $scope.filteredStories = [];
        $scope.searchQuery = '';
        $scope.selectedCategory = '';
        $scope.loading = false;
        $scope.currentPage = 1;
        $scope.storiesPerPage = 6;
        $scope.totalStories = 0;
        
        // Filter and sorting options
        $scope.sortOptions = [
            { value: 'newest', label: 'Newest First' },
            { value: 'oldest', label: 'Oldest First' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'likes', label: 'Most Liked' }
        ];
        $scope.selectedSort = 'newest';
        
        $scope.categories = [
            { value: 'adventure', label: 'Adventure' },
            { value: 'budget', label: 'Budget Travel' },
            { value: 'scenic', label: 'Scenic Routes' },
            { value: 'tips', label: 'Travel Tips' },
            { value: 'food', label: 'Food & Culture' },
            { value: 'safety', label: 'Safety' }
        ];
        
        // Initialize controller
        $scope.init = function() {
            $scope.loadStories();
            $scope.setupWatchers();
            $scope.loadUserPreferences();
        };
        
        // Load all stories
        $scope.loadStories = function() {
            $scope.loading = true;
            DataService.getAllStories().then(function(stories) {
                $scope.stories = stories;
                $scope.totalStories = stories.length;
                $scope.applyFilters();
                $scope.loading = false;
            }).catch(function(error) {
                console.error('Error loading stories:', error);
                NotificationService.show('Error loading stories', 'error');
                $scope.loading = false;
            });
        };
        
        // Apply filters and search
        $scope.applyFilters = function() {
            var filtered = $scope.stories;
            
            // Apply search filter
            if ($scope.searchQuery && $scope.searchQuery.trim()) {
                var query = $scope.searchQuery.toLowerCase().trim();
                filtered = filtered.filter(function(story) {
                    return story.title.toLowerCase().includes(query) ||
                           story.content.toLowerCase().includes(query) ||
                           story.author.toLowerCase().includes(query) ||
                           story.route.toLowerCase().includes(query) ||
                           (story.tags && story.tags.some(function(tag) {
                               return tag.toLowerCase().includes(query);
                           }));
                });
            }
            
            // Apply category filter
            if ($scope.selectedCategory) {
                filtered = filtered.filter(function(story) {
                    return story.category === $scope.selectedCategory;
                });
            }
            
            // Apply sorting
            filtered = $scope.sortStories(filtered, $scope.selectedSort);
            
            $scope.filteredStories = filtered;
            $scope.currentPage = 1; // Reset to first page when filters change
        };
        
        // Sort stories
        $scope.sortStories = function(stories, sortBy) {
            var sorted = [...stories];
            
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
                        return (b.likes + b.comments.length) - (a.likes + a.comments.length);
                    });
                    break;
                case 'likes':
                    sorted.sort(function(a, b) {
                        return b.likes - a.likes;
                    });
                    break;
                default:
                    break;
            }
            
            return sorted;
        };
        
        // Category filter function for ng-filter
        $scope.categoryFilter = function(story) {
            if (!$scope.selectedCategory) return true;
            return story.category === $scope.selectedCategory;
        };
        
        // Like a story
        $scope.likeStory = function(story) {
            if (story.userLiked) {
                story.likes--;
                story.userLiked = false;
                NotificationService.show('Like removed', 'info');
            } else {
                story.likes++;
                story.userLiked = true;
                NotificationService.show('Story liked!', 'success');
            }
            
            // Save to local storage
            $scope.saveUserInteraction(story.id, 'like', story.userLiked);
            
            // Update story in data service
            DataService.updateStory(story);
        };
        
        // Toggle comments visibility
        $scope.toggleComments = function(story) {
            story.showComments = !story.showComments;
            
            if (story.showComments && !story.commentsLoaded) {
                $scope.loadComments(story);
            }
        };
        
        // Load comments for a story
        $scope.loadComments = function(story) {
            DataService.getStoryComments(story.id).then(function(comments) {
                story.comments = comments;
                story.commentsLoaded = true;
            }).catch(function(error) {
                console.error('Error loading comments:', error);
                NotificationService.show('Error loading comments', 'error');
            });
        };
        
        // Add comment to story
        $scope.addComment = function(story) {
            if (!story.newComment || !story.newComment.trim()) {
                NotificationService.show('Please enter a comment', 'warning');
                return;
            }
            
            var comment = {
                id: Date.now(),
                author: 'Current User', // In real app, get from auth service
                authorAvatar: 'images/default-avatar.jpg',
                text: story.newComment.trim(),
                date: new Date().toISOString()
            };
            
            story.comments = story.comments || [];
            story.comments.push(comment);
            story.newComment = '';
            
            // Update story in data service
            DataService.addComment(story.id, comment).then(function() {
                NotificationService.show('Comment added!', 'success');
            }).catch(function(error) {
                console.error('Error adding comment:', error);
                NotificationService.show('Error adding comment', 'error');
                // Remove comment from UI if save failed
                story.comments.pop();
            });
        };
        
        // Share story
        $scope.shareStory = function(story) {
            var shareData = {
                title: story.title,
                text: story.content.substring(0, 100) + '...',
                url: window.location.href + '#story-' + story.id
            };
            
            if (navigator.share) {
                navigator.share(shareData).then(function() {
                    NotificationService.show('Story shared!', 'success');
                }).catch(function(error) {
                    console.error('Error sharing:', error);
                });
            } else {
                // Fallback: copy link to clipboard
                var shareUrl = window.location.origin + window.location.pathname + '#story-' + story.id;
                $scope.copyToClipboard(shareUrl);
            }
        };
        
        // Copy to clipboard utility
        $scope.copyToClipboard = function(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(function() {
                    NotificationService.show('Link copied to clipboard!', 'success');
                });
            } else {
                // Fallback
                var textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                NotificationService.show('Link copied to clipboard!', 'success');
            }
        };
        
        // Save user interaction to local storage
        $scope.saveUserInteraction = function(storyId, action, value) {
            var interactions = StorageService.get('userInteractions') || {};
            if (!interactions[storyId]) {
                interactions[storyId] = {};
            }
            interactions[storyId][action] = value;
            StorageService.set('userInteractions', interactions);
        };
        
        // Load user preferences
        $scope.loadUserPreferences = function() {
            var preferences = StorageService.get('userPreferences') || {};
            if (preferences.storiesSort) {
                $scope.selectedSort = preferences.storiesSort;
            }
            if (preferences.storiesCategory) {
                $scope.selectedCategory = preferences.storiesCategory;
            }
        };
        
        // Save user preferences
        $scope.saveUserPreferences = function() {
            var preferences = StorageService.get('userPreferences') || {};
            preferences.storiesSort = $scope.selectedSort;
            preferences.storiesCategory = $scope.selectedCategory;
            StorageService.set('userPreferences', preferences);
        };
        
        // Setup watchers
        $scope.setupWatchers = function() {
            // Watch for search query changes
            $scope.$watch('searchQuery', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $timeout(function() {
                        $scope.applyFilters();
                    }, 300); // Debounce search
                }
            });
            
            // Watch for category changes
            $scope.$watch('selectedCategory', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.applyFilters();
                    $scope.saveUserPreferences();
                }
            });
            
            // Watch for sort changes
            $scope.$watch('selectedSort', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.applyFilters();
                    $scope.saveUserPreferences();
                }
            });
        };
        
        // Pagination
        $scope.getPagedStories = function() {
            var start = ($scope.currentPage - 1) * $scope.storiesPerPage;
            var end = start + $scope.storiesPerPage;
            return $scope.filteredStories.slice(start, end);
        };
        
        $scope.getTotalPages = function() {
            return Math.ceil($scope.filteredStories.length / $scope.storiesPerPage);
        };
        
        $scope.goToPage = function(page) {
            if (page >= 1 && page <= $scope.getTotalPages()) {
                $scope.currentPage = page;
                $scope.scrollToTop();
            }
        };
        
        $scope.scrollToTop = function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        // Clear all filters
        $scope.clearFilters = function() {
            $scope.searchQuery = '';
            $scope.selectedCategory = '';
            $scope.selectedSort = 'newest';
            $scope.applyFilters();
        };
        
        // Get stories count by category
        $scope.getCategoryCount = function(category) {
            return $scope.stories.filter(function(story) {
                return story.category === category;
            }).length;
        };
        
        // Initialize controller
        $scope.init();
    }
]);