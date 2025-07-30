# BrightLoop - AI Learning Platform and Progress Tracker Frontend

A modern, responsive learning platform built with React that helps users manage educational resources and generate AI-powered interview questions.

## 🚀 Features

- **📚 Resource Management** - Add, organize, and track learning resources
- **📊 Progress Dashboard** - Visual analytics and completion tracking
- **🤖 AI Interview Generator** - Generate contextual interview questions using AI
- **💬 AI Assistant** - Floating chat widget for instant Q&A support
- **🔐 Authentication** - Secure user registration and login
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and working on mobile responsiveness
- **🎨 Modern UI** - Clean interface with smooth animations

## 🛠️ Tech Stack

- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Toast notifications
- **CSS3** - Custom styling with CSS variables
- **JavaScript (ES6+)** - Modern JavaScript features

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Shared components
│   │   │   ├── CharacterWidget.js
│   │   │   ├── Header.js
│   │   │   ├── Layout.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── Modal.js
│   │   ├── dashboard/        # Dashboard components
│   │   │   ├── ResourceCard.js
│   │   │   └── StatsCard.js
│   │   └── questionGenerator/ # AI Interview Generator
│   │       └── QuestionGenerator.js
│   ├── hooks/                # Custom React hooks
│   │   ├── formatTime.js
│   │   ├── TimeSpentLocalContext.js
│   │   └── useAuth.js
│   ├── pages/                # Page components
│   │   ├── AddResource.js
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── QuestionGeneratorPage.js  # NEW: AI Interview Generator
│   │   ├── ResourceDetails.js
│   │   ├── ResourceUpdate.js
│   │   └── Signup.js
│   ├── services/             # API services
│   │   └── api.js           # API configuration and endpoints
│   ├── styles/              # CSS stylesheets
│   │   ├── chatbox.css
│   │   ├── components.css
│   │   ├── global.css
│   │   ├── questionGenerator.css  # NEW: AI Generator styles
│   │   └── responsive.css
│   ├── App.js               # Main application component
│   └── index.js            # Application entry point
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
```css
--primary-color: #6366f1     /* Main brand color */
--primary-dark: #4f46e5      /* Darker variant */
--accent-color: #10b981      /* Success/accent color */
--danger-color: #ef4444      /* Error color */
--warning-color: #f59e0b     /* Warning color */
--text-primary: #1f2937      /* Main text */
--text-secondary: #6b7280    /* Secondary text */
--background: #ffffff        /* Main background */
--background-secondary: #f9fafb /* Secondary background */
```

### Typography
- **Font Family**: System fonts (SF Pro, Segoe UI, Roboto)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: 0.75rem to 2rem with consistent spacing

### Components
- **Buttons**: Multiple variants (primary, secondary, success, danger)
- **Forms**: Consistent input styling with focus states
- **Cards**: Elevated containers with shadows and rounded corners
- **Modals**: Centered overlays with backdrop blur

## 🧩 Key Components

### 📱 Layout Components
- **Layout.js** - Main application wrapper with sidebar and header
- **Header.js** - Top navigation bar with user menu
- **Sidebar** - Navigation sidebar with menu items
- **Modal.js** - Reusable modal component

### 📊 Dashboard Components
- **Dashboard.js** - Main dashboard with stats and resources
- **StatsCard.js** - Displays key metrics and progress
- **ResourceCard.js** - Individual resource display cards

### 🤖 AI Interview Generator (NEW)
- **QuestionGenerator.js** - Split-panel interface for generating interview questions
- **QuestionGeneratorPage.js** - Page wrapper for the generator
- **Features**:
  - Job description input (text or file upload)
  - Question style selection (up to 3 types)
  - Experience level filtering
  - AI-powered question generation
  - Expandable answers with evaluation tips

### 💬 AI Assistant
- **CharacterWidget.js** - Floating chat widget for instant Q&A
- **Features**:
  - Always-accessible floating button
  - Real-time AI responses using Perplexity API
  - Expandable chat window
  - Context-aware assistance
  - Smooth animations and transitions

### 🔐 Authentication
- **Login.js** - User login form
- **Signup.js** - User registration form
- **useAuth.js** - Authentication hook with context

### 📚 Resource Management
- **AddResource.js** - Form to add new learning resources
- **ResourceDetails.js** - Detailed view of individual resources
- **ResourceUpdate.js** - Edit existing resources

## 🔌 API Integration

### Base Configuration
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
```

### Available APIs
- **authAPI** - Authentication endpoints
- **resourcesAPI** - Resource CRUD operations
- **categoriesAPI** - Category management
- **chatAPI** - AI chat functionality for the floating assistant
- **questionGeneratorAPI** - Interview question generation (NEW)

### Error Handling
- Global error interceptor with toast notifications
- Automatic token refresh and logout on 401 errors
- User-friendly error messages

## 🎯 Core Features Overview

### 💬 AI Assistant (Floating Widget)
A persistent AI-powered helper that's always available across the platform.

#### CharacterWidget Features
- **🎈 Floating Button** - Always visible in bottom-right corner
- **💬 Instant Chat** - Click to open expandable chat window
- **🧠 Smart Responses** - Powered by Perplexity AI for accurate answers
- **📚 Context Aware** - Understands your learning platform context
- **🎨 Smooth UX** - Elegant animations and responsive design
- **📱 Mobile Friendly** - Optimized for touch interactions

#### Chat Experience
- Real-time message exchange
- Typing indicators and loading states
- Message history within session
- Auto-scroll to latest messages
- Expandable/collapsible interface

### 🤖 AI Interview Generator
A comprehensive tool for creating professional interview questions.

#### Form Panel (Resizable)
- **Job Description Input** - Text area or file upload (.txt)
- **Question Styles** - Select up to 3 from 6 available types:
  - Behavioral, Situational, Technical
  - Knowledge, Terminology, Problem-Solving
- **Experience Level** - Fresher, Mid-Level, Senior
- **Settings** - Language selection and question count (3-10)

#### Results Panel
- **Job Summary** - Extracted job title, industry, experience level
- **Skills & Competencies** - Personal skills, technical skills, certifications
- **Interview Structure** - Recommended timing and phases
- **Questions List** - Generated questions with expandable answers
- **Additional Notes** - Interview tips and evaluation guidance

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1024px - Full sidebar and multi-column layouts
- **Tablet**: 768px - 1024px - Responsive grid adjustments
- **Mobile**: < 768px - Collapsible sidebar and single-column layout

### Mobile Features
- Collapsible navigation sidebar
- Touch-friendly button sizes
- Optimized form layouts
- Stacked content panels

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API URL: REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🔧 Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎨 Styling Guidelines

### CSS Organization
- **global.css** - Base styles, variables, utility classes
- **components.css** - Component-specific styles
- **questionGenerator.css** - AI generator specific styles
- **chatbox.css** - AI assistant floating widget styles
- **responsive.css** - Media queries and responsive adjustments

### Naming Conventions
- **BEM methodology** for CSS classes
- **Kebab-case** for file names
- **PascalCase** for React components
- **camelCase** for JavaScript variables

### Best Practices
- Use CSS variables for consistent theming
- Mobile-first responsive design
- Semantic HTML structure
- Accessible form inputs and navigation
- Consistent spacing using CSS custom properties

## 🧪 Testing

### Component Testing
- Unit tests for utility functions
- Component rendering tests
- API integration tests
- Form validation tests

### Manual Testing Checklist
- [ ] Authentication flow
- [ ] Resource CRUD operations
- [ ] Dashboard data loading
- [ ] AI question generation
- [ ] AI assistant floating widget
- [ ] Chat functionality and responses
- [ ] Responsive layouts
- [ ] Error handling

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Deployment Targets
- **Netlify** - Static site hosting
- **Vercel** - React app deployment
- **AWS S3 + CloudFront** - Scalable static hosting
- **Docker** - Containerized deployment

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- ESLint configuration for code quality
- Prettier for code formatting
- Consistent component structure
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for better learning experiences**