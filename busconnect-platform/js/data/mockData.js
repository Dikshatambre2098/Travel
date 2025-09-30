// Mock Data for BusConnect App
angular.module('busConnectApp').service('MockDataService', function() {
    
    var self = this;
    
    // Featured Stories Data
    self.featuredStories = [
        {
            id: 1,
            title: 'Amazing Journey to Goa',
            excerpt: 'Discovered beautiful coastal routes and met wonderful people along the way.',
            content: 'The journey from Mumbai to Goa was absolutely incredible. The coastal views were breathtaking, and the bus was comfortable throughout the 12-hour journey.',
            author: 'Priya Sharma',
            authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
            route: 'Mumbai → Goa',
            category: 'scenic',
            likes: 24,
            date: '2024-01-15',
            tags: ['coastal', 'scenic', 'comfortable'],
            comments: []
        },
        {
            id: 2,
            title: 'Mountain Adventure to Manali',
            excerpt: 'Took the scenic route through the mountains with fresh air and winding roads.',
            content: 'The Delhi to Manali route is a must-do for any mountain lover. The changing landscapes from plains to hills to snow-capped peaks is mesmerizing.',
            author: 'Arjun Patel',
            authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
            route: 'Delhi → Manali',
            category: 'adventure',
            likes: 18,
            date: '2024-01-10',
            tags: ['mountains', 'adventure', 'scenic'],
            comments: []
        },
        {
            id: 3,
            title: 'Budget Trip to Rajasthan',
            excerpt: 'Explored the royal state on a budget with comfortable bus travel.',
            content: 'Traveled from Jaipur to Udaipur on a budget-friendly bus. The journey through Rajasthan countryside was amazing.',
            author: 'Vikram Singh',
            authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
            image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400&h=250&fit=crop',
            route: 'Jaipur → Udaipur',
            category: 'budget',
            likes: 32,
            date: '2024-01-05',
            tags: ['budget', 'rajasthan', 'culture'],
            comments: []
        }
    ];
    
    // Get featured stories
    self.getFeaturedStories = function() {
        return self.featuredStories;
    };
    
    // Get all stories
    self.getAllStories = function() {
        return self.featuredStories;
    };
});