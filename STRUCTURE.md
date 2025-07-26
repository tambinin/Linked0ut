# Project Structure - LinkedOut

This document describes the complete file structure of the LinkedOut project.

## Root Directory
```
LinkedOut/
├── .gitignore              # Git ignore patterns
├── LICENSE                 # MIT License
├── package.json            # NPM package configuration
├── README.md               # Main project documentation
├── FEATURES.md             # Detailed feature list
├── SETUP.md                # Installation and setup guide
├── STRUCTURE.md            # This file - project structure
└── index.html              # Main entry point - login page
```

## HTML Pages
```
├── index.html              # Login/Registration page
├── dashboard.html          # Main dashboard with feed
├── profile.html            # User profile page
├── jobs.html               # Job listings page
└── network.html            # Networking/connections page
```

## Stylesheets
```
styles/
├── main.css                # Main styles and CSS variables
├── components.css          # Reusable component styles
└── responsive.css          # Mobile and responsive styles
```

## JavaScript Modules
```
js/
├── auth.js                 # Authentication and session management
├── badges.js               # Badge system and achievement logic
├── data.js                 # Data management and sample data
├── endorsements.js         # Endorsement system
├── feed.js                 # News feed functionality
├── jobs.js                 # Job listings and applications
├── network.js              # Networking and connections
├── profile.js              # Profile management
└── utils.js                # Utility functions and helpers
```

## Assets
```
assets/
├── images/                 # Default images and avatars
│   └── README.md           # Image specifications
└── icons/                  # Badge icons and UI icons
    └── README.md           # Icon specifications
```

## Architecture Overview

### Frontend Architecture
- **Vanilla JavaScript ES6+**: No frameworks, pure JavaScript
- **Modular Design**: Each feature in separate JS module
- **CSS Custom Properties**: Centralized theming system
- **localStorage**: Client-side data persistence

### Module Dependencies
```
utils.js (base utilities)
├── data.js (data management)
│   ├── auth.js (authentication)
│   ├── badges.js (badge system)
│   ├── endorsements.js (endorsements)
│   ├── feed.js (news feed)
│   ├── jobs.js (job listings)
│   ├── network.js (networking)
│   └── profile.js (profile management)
```

### Data Flow
1. **utils.js** provides base utilities and DOM helpers
2. **data.js** manages all data operations and sample data
3. Page-specific modules handle UI interactions
4. All data persisted to localStorage
5. Real-time updates across modules via events

### CSS Architecture
1. **main.css**: CSS variables, base styles, layout
2. **components.css**: Reusable UI components
3. **responsive.css**: Media queries and mobile adaptations

### File Naming Conventions
- **HTML**: Lowercase with hyphens (dashboard.html)
- **CSS**: Lowercase with hyphens (main.css)
- **JavaScript**: Lowercase with hyphens (auth.js)
- **Directories**: Lowercase, no spaces

### Development Guidelines
1. Keep modules focused on single responsibility
2. Use CSS custom properties for consistency
3. Maintain backward compatibility
4. Follow accessibility best practices
5. Test on multiple browsers and devices

### Extension Points
- **New Features**: Add new JS module and corresponding CSS
- **New Pages**: Create HTML file and link in navigation
- **Custom Styling**: Modify CSS custom properties
- **Data Sources**: Replace localStorage methods in data.js

This structure supports easy maintenance, feature additions, and deployment across various hosting platforms.