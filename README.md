# TranslateB - AI Communication Assistant

A React PWA application that helps users discover what they really mean to say and enhance their relationships through deeper understanding.

## Features

### User Side
- **Quick Translator**: Transform raw communication into emotionally accurate reflections
- **Personality Quiz**: Swipe-based 4-card onboarding to discover your communication style
- **Profile Dashboard**: Dynamic metrics showing your evolving emotional & personality profile
- **Relationship Web**: Visual mapping of personal connections with context and insights

### Admin Side
- **Quiz Editor**: Manage personality quiz questions and bucket weighting system
- **Analytics Dashboard**: Track user engagement and personality distribution
- **Template Management**: Version control for quiz templates

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glass morphism effects
- **Animations**: Framer Motion for smooth transitions and gestures
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **PWA**: Service Worker for offline functionality

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd translate-b
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder and optimizes it for best performance.

## PWA Features

The app is configured as a Progressive Web App with:
- Offline functionality via Service Worker
- App-like experience when installed on mobile devices
- Responsive design optimized for mobile screens
- Fast loading with caching strategies

### Installing as Mobile App

1. Open the app in a mobile browser
2. Tap "Add to Home Screen" when prompted
3. The app will install like a native mobile application

## Design System

### Color Palette
- **Primary Gradient**: `#667eea` to `#764ba2`
- **Secondary**: Pink to red gradients for emotional elements
- **Tertiary**: Blue to cyan for analytical elements
- **Quaternary**: Green to emerald for sensing elements
- **Quinary**: Purple to indigo for intuitive elements

### Glass Morphism
The UI uses glass morphism effects with:
- Semi-transparent backgrounds
- Backdrop blur filters
- Subtle borders and shadows
- Smooth animations and transitions

## Architecture

### Component Structure
```
src/
├── components/           # React components
│   ├── LandingPage.tsx  # Main entry point
│   ├── QuickTranslator.tsx # Translation interface
│   ├── PersonalityQuiz.tsx # Swipe-based quiz
│   ├── ProfilePage.tsx     # User dashboard
│   ├── RelationshipWeb.tsx # Connection mapping
│   └── AdminDashboard.tsx  # Admin interface
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── personality.ts   # Personality calculation logic
│   └── translation.ts   # Translation generation
└── App.tsx             # Main app component
```

### State Management
Currently uses local state with React hooks. For production, consider:
- Redux Toolkit for complex state management
- React Query for server state
- Context API for user authentication

## Personality System

### Four Buckets Model
Based on Jungian psychology:

1. **Feeling**: Emotional resonance, empathy-driven
2. **Thinking**: Logical, structured analysis
3. **Sensing**: Concrete, detail-focused processing
4. **Intuition**: Abstract, pattern-seeking approach

### Scoring Algorithm
- Each quiz answer distributes weight across buckets (0-10 total)
- Scores are aggregated and normalized to percentages
- Top 2 buckets determine primary communication style
- Personalization engine uses bucket mix for translation tone

## Translation Engine

### Three Layers
1. **Emotion Layer**: Surface emotional content
2. **Fear Layer**: Underlying anxieties and concerns
3. **Longing Layer**: Deep desires and needs

### Personalization
Translations are adapted based on user's personality profile:
- Feeling-dominant users get more emotional language
- Thinking-dominant users get analytical framing
- Sensing users get concrete, specific language
- Intuition users get conceptual, big-picture framing

## Mobile Optimization

- Touch-friendly swipe gestures
- Responsive design for all screen sizes
- Native app-like navigation
- Optimized for portrait orientation
- Fast loading and smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

### Phase 1 (Current)
- ✅ Core translation functionality
- ✅ Personality quiz system
- ✅ Basic relationship mapping
- ✅ PWA configuration

### Phase 2 (Planned)
- [ ] Real AI integration (OpenAI/Claude)
- [ ] User authentication system
- [ ] Data persistence (Supabase/Firebase)
- [ ] Advanced analytics
- [ ] Social sharing features

### Phase 3 (Future)
- [ ] Real-time chat integration
- [ ] Keyboard overlay for other apps
- [ ] Advanced relationship insights
- [ ] Collaborative relationship building
- [ ] Enterprise features

## Support

For support, email support@translateb.app or create an issue in the repository.