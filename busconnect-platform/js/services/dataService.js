// Data Service for BusConnect App
angular.module('busConnectApp').service('DataService', [
    '$q', 
    '$timeout', 
    'StorageService',
    function($q, $timeout, StorageService) {
        
        var self = this;
        
        // Mock data storage
        var mockStories = [
            {
                id: 1,
                title: "Epic Journey Through the Himalayas",
                route: "Delhi to Manali",
                category: "adventure",
                content: "What an incredible journey it was! The bus ride from Delhi to Manali was nothing short of spectacular. As we climbed higher into the mountains, the scenery became more and more breathtaking. The winding roads, snow-capped peaks, and the crisp mountain air made this journey unforgettable. I met some amazing fellow travelers who shared their own stories and tips. The driver was experienced and made us feel safe throughout the journey. I highly recommend this route to anyone looking for an adventure!",
                author: "Priya Sharma",
                authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
                date: "2024-03-15T10:30:00Z",
                likes: 45,
                comments: [
                    {
                        id: 101,
                        author: "Rahul Kumar",
                        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                        text: "Amazing story! I'm planning the same route next month. Any specific tips?",
                        date: "2024-03-16T08:15:00Z"
                    },
                    {
                        id: 102,
                        author: "Sneha Patel",
                        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                        text: "The photos are stunning! Thanks for sharing your experience.",
                        date: "2024-03-16T14:20:00Z"
                    }
                ],
                tags: ["himalaya", "adventure", "mountains", "delhi", "manali"],
                images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"],
                userLiked: false,
                showComments: false
            },
            {
                id: 2,
                title: "Budget-Friendly Coastal Adventure",
                route: "Mumbai to Goa",
                category: "budget",
                content: "Traveling from Mumbai to Goa on a budget was easier than I thought! I took the overnight bus which saved me a night's accommodation cost. The journey was comfortable and I woke up to beautiful coastal views. In Goa, I stayed at budget hostels and ate at local eateries. The beaches were pristine and the people were friendly. Total cost for 4 days was under ₹8000 including transport, stay, and food. Perfect for budget travelers!",
                author: "Arjun Mehta",
                authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                date: "2024-03-12T16:45:00Z",
                likes: 32,
                comments: [
                    {
                        id: 201,
                        author: "Kavya Singh",
                        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                        text: "This is so helpful! Can you share the hostel names?",
                        date: "2024-03-13T09:30:00Z"
                    }
                ],
                tags: ["budget", "goa", "mumbai", "coastal", "backpacking"],
                images: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"],
                userLiked: false,
                showComments: false
            },
            {
                id: 3,
                title: "Scenic Route to the Hills",
                route: "Bangalore to Mysore",
                category: "scenic",
                content: "The bus journey from Bangalore to Mysore is one of the most scenic routes in South India. The road passes through lush green countryside, small villages, and beautiful landscapes. I took the morning bus to enjoy the daylight views. The journey takes about 3 hours and every minute is worth it. Mysore Palace and the surrounding gardens are magnificent. Don't miss the local silk sarees and sandalwood products!",
                author: "Deepika Rao",
                authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                date: "2024-03-10T12:20:00Z",
                likes: 28,
                comments: [],
                tags: ["scenic", "mysore", "bangalore", "palace", "silk"],
                images: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600"],
                userLiked: false,
                showComments: false
            }
        ];
        
        var mockForumTopics = [
            {
                id: 1,
                title: "Best Bus Routes for Solo Female Travelers",
                category: "safety",
                content: "I'm planning to travel solo across India and looking for safe bus routes. Can experienced travelers share their recommendations for routes that are safe for solo female travelers? Also, any general safety tips would be appreciated.",
                author: "Anita Desai",
                authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
                date: "2024-03-14T09:15:00Z",
                replies: [
                    {
                        id: 301,
                        author: "Meera Joshi",
                        authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                        content: "I've traveled solo extensively. Delhi-Shimla, Mumbai-Pune, and Chennai-Pondicherry are very safe routes. Always book front seats and travel during daytime when possible.",
                        date: "2024-03-14T11:30:00Z"
                    },
                    {
                        id: 302,
                        author: "Priya Nair",
                        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                        content: "Volvo and other premium buses are generally safer. Also, inform someone about your travel plans and share live location.",
                        date: "2024-03-14T14:45:00Z"
                    }
                ],
                views: 156,
                likes: 12,
                tags: ["safety", "solo-travel", "female-travelers"],
                showReplies: false
            },
            {
                id: 2,
                title: "Budget Travel Tips for Students",
                category: "budget",
                content: "As a college student, I'm always looking for ways to travel on a tight budget. What are some tips for finding cheap bus tickets and affordable accommodation? Any student discounts available?",
                author: "Rohit Gupta",
                authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                date: "2024-03-13T15:20:00Z",
                replies: [
                    {
                        id: 401,
                        author: "Sneha Reddy",
                        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                        content: "Book tickets in advance for better prices. Use apps like RedBus, AbhiBus for discounts. For accommodation, try hostels or PG accommodations.",
                        date: "2024-03-13T17:10:00Z"
                    }
                ],
                views: 89,
                likes: 8,
                tags: ["budget", "students", "discounts"],
                showReplies: false
            },
            {
                id: 3,
                title: "Hidden Gems Along Popular Bus Routes",
                category: "routes",
                content: "Let's share some hidden gems and must-visit places that are along popular bus routes but often missed by travelers. I'll start with a beautiful temple near the Delhi-Agra highway.",
                author: "Vikram Singh",
                authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                date: "2024-03-12T11:45:00Z",
                replies: [],
                views: 67,
                likes: 15,
                tags: ["hidden-gems", "routes", "sightseeing"],
                showReplies: false
            }
        ];
        
        // Initialize data from localStorage or use mock data
        var initializeData = function() {
            var storedStories = StorageService.get('busConnectStories');
            var storedTopics = StorageService.get('busConnectTopics');
            
            if (!storedStories) {
                StorageService.set('busConnectStories', mockStories);
            }
            
            if (!storedTopics) {
                StorageService.set('busConnectTopics', mockForumTopics);
            }
        };
        
        // Initialize data
        initializeData();
        
        // Stories API
        self.getAllStories = function() {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || mockStories;
                deferred.resolve(stories);
            }, 500); // Simulate API delay
            
            return deferred.promise;
        };
        
        self.getFeaturedStories = function() {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || mockStories;
                var featured = stories.filter(function(story) {
                    return story.likes > 20; // Featured stories have more than 20 likes
                }).slice(0, 6);
                deferred.resolve(featured);
            }, 300);
            
            return deferred.promise;
        };
        
        self.getStoryById = function(id) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || mockStories;
                var story = stories.find(function(s) { return s.id == id; });
                if (story) {
                    deferred.resolve(story);
                } else {
                    deferred.reject('Story not found');
                }
            }, 200);
            
            return deferred.promise;
        };
        
        self.createStory = function(storyData) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || [];
                storyData.id = Date.now();
                stories.unshift(storyData);
                StorageService.set('busConnectStories', stories);
                deferred.resolve(storyData);
            }, 1000); // Simulate upload time
            
            return deferred.promise;
        };
        
        self.updateStory = function(story) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || [];
                var index = stories.findIndex(function(s) { return s.id === story.id; });
                if (index !== -1) {
                    stories[index] = story;
                    StorageService.set('busConnectStories', stories);
                    deferred.resolve(story);
                } else {
                    deferred.reject('Story not found');
                }
            }, 200);
            
            return deferred.promise;
        };
        
        self.getStoryComments = function(storyId) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || [];
                var story = stories.find(function(s) { return s.id == storyId; });
                if (story) {
                    deferred.resolve(story.comments || []);
                } else {
                    deferred.reject('Story not found');
                }
            }, 300);
            
            return deferred.promise;
        };
        
        self.addComment = function(storyId, comment) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || [];
                var story = stories.find(function(s) { return s.id == storyId; });
                if (story) {
                    story.comments = story.comments || [];
                    story.comments.push(comment);
                    StorageService.set('busConnectStories', stories);
                    deferred.resolve(comment);
                } else {
                    deferred.reject('Story not found');
                }
            }, 300);
            
            return deferred.promise;
        };
        
        // Forum API
        self.getForumTopics = function() {
            var deferred = $q.defer();
            
            $timeout(function() {
                var topics = StorageService.get('busConnectTopics') || mockForumTopics;
                deferred.resolve(topics);
            }, 400);
            
            return deferred.promise;
        };
        
        self.createForumTopic = function(topicData) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var topics = StorageService.get('busConnectTopics') || [];
                topicData.id = Date.now();
                topics.unshift(topicData);
                StorageService.set('busConnectTopics', topics);
                deferred.resolve(topicData);
            }, 800);
            
            return deferred.promise;
        };
        
        self.getTopicReplies = function(topicId) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var topics = StorageService.get('busConnectTopics') || [];
                var topic = topics.find(function(t) { return t.id == topicId; });
                if (topic) {
                    deferred.resolve(topic.replies || []);
                } else {
                    deferred.reject('Topic not found');
                }
            }, 300);
            
            return deferred.promise;
        };
        
        self.addTopicReply = function(topicId, reply) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var topics = StorageService.get('busConnectTopics') || [];
                var topic = topics.find(function(t) { return t.id == topicId; });
                if (topic) {
                    topic.replies = topic.replies || [];
                    topic.replies.push(reply);
                    StorageService.set('busConnectTopics', topics);
                    deferred.resolve(reply);
                } else {
                    deferred.reject('Topic not found');
                }
            }, 400);
            
            return deferred.promise;
        };
        
        self.incrementTopicViews = function(topicId) {
            var topics = StorageService.get('busConnectTopics') || [];
            var topic = topics.find(function(t) { return t.id == topicId; });
            if (topic) {
                topic.views = (topic.views || 0) + 1;
                StorageService.set('busConnectTopics', topics);
            }
        };
        
        self.updateTopicLikes = function(topicId, likes, userLiked) {
            var topics = StorageService.get('busConnectTopics') || [];
            var topic = topics.find(function(t) { return t.id == topicId; });
            if (topic) {
                topic.likes = likes;
                topic.userLiked = userLiked;
                StorageService.set('busConnectTopics', topics);
            }
        };
        
        self.updateReplyLikes = function(replyId, likes, userLiked) {
            var topics = StorageService.get('busConnectTopics') || [];
            topics.forEach(function(topic) {
                if (topic.replies) {
                    var reply = topic.replies.find(function(r) { return r.id == replyId; });
                    if (reply) {
                        reply.likes = likes;
                        reply.userLiked = userLiked;
                    }
                }
            });
            StorageService.set('busConnectTopics', topics);
        };
        
        // Search API
        self.searchContent = function(query) {
            var deferred = $q.defer();
            
            $timeout(function() {
                var stories = StorageService.get('busConnectStories') || [];
                var topics = StorageService.get('busConnectTopics') || [];
                
                var searchQuery = query.toLowerCase();
                
                var matchingStories = stories.filter(function(story) {
                    return story.title.toLowerCase().includes(searchQuery) ||
                           story.content.toLowerCase().includes(searchQuery) ||
                           story.route.toLowerCase().includes(searchQuery) ||
                           (story.tags && story.tags.some(function(tag) {
                               return tag.toLowerCase().includes(searchQuery);
                           }));
                });
                
                var matchingTopics = topics.filter(function(topic) {
                    return topic.title.toLowerCase().includes(searchQuery) ||
                           topic.content.toLowerCase().includes(searchQuery) ||
                           (topic.tags && topic.tags.some(function(tag) {
                               return tag.toLowerCase().includes(searchQuery);
                           }));
                });
                
                deferred.resolve({
                    stories: matchingStories,
                    topics: matchingTopics
                });
            }, 600);
            
            return deferred.promise;
        };
        
        // Analytics API (mock)
        self.trackEvent = function(eventName, eventData) {
            console.log('Analytics Event:', eventName, eventData);
            // In a real app, this would send data to analytics service
        };
        
        // User preferences API
        self.getUserPreferences = function() {
            return StorageService.get('userPreferences') || {};
        };
        
        self.saveUserPreferences = function(preferences) {
            StorageService.set('userPreferences', preferences);
        };
        
        // Utility functions
        self.generateId = function() {
            return Date.now() + Math.random().toString(36).substr(2, 9);
        };
        
        self.formatDate = function(dateString) {
            return new Date(dateString).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        };
        
        self.timeAgo = function(dateString) {
            var now = new Date();
            var date = new Date(dateString);
            var diffInMinutes = Math.floor((now - date) / (1000 * 60));
            
            if (diffInMinutes < 1) return 'Just now';
            if (diffInMinutes < 60) return diffInMinutes + 'm ago';
            if (diffInMinutes < 1440) return Math.floor(diffInMinutes / 60) + 'h ago';
            return Math.floor(diffInMinutes / 1440) + 'd ago';
        };
    }
]);