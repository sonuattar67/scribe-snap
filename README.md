# ScribeSnap - Note-Taking Application

A beautiful, intuitive note-taking application built with React, TypeScript, and modern web technologies.

## Features

### Authentication
- **Email & Password Authentication** with form validation
- **OTP Email Verification** with resend functionality
- **Google OAuth Integration** (requires Supabase connection)
- **JWT Authorization** for secure API access
- **Session Management** with local storage persistence

### Note Management
- **Create & Edit Notes** with rich text support
- **Color-coded Notes** (5 different color themes)
- **Real-time Search** across all notes
- **Delete Notes** with confirmation
- **Auto-save** draft functionality
- **Responsive Grid Layout** for optimal viewing

### User Experience
- **Mobile-responsive Design** that works on all devices
- **Beautiful UI** with consistent design system
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Intuitive Navigation** and user flows

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage
- **Form Handling**: Custom validation
- **UI Components**: Radix UI primitives

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd scribe-snap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components
│   ├── notes/          # Note-related components
│   └── ui/             # Base UI components (shadcn/ui)
├── pages/              # Main page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── assets/             # Static assets (images, etc.)
└── styles/             # Global styles
```

## Key Components

### Authentication Flow
- `LoginForm` - Email/password login with validation
- `SignupForm` - User registration with password strength
- `OTPVerification` - Email verification with 6-digit codes
- `AuthLayout` - Consistent layout for auth pages

### Note Management
- `NoteCard` - Individual note display with actions
- `NoteEditor` - Rich note editing with color selection
- `NotesGrid` - Responsive grid layout for notes
- `AppHeader` - Navigation with search and user menu

### Design System
- **Colors**: Primary blue theme with semantic color tokens
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Fully customizable shadcn/ui components

## API Integration (Backend Setup)

This application is designed to work with a backend API. To enable full functionality:

### Option 1: Supabase Integration (Recommended)
1. Connect your Lovable project to Supabase
2. Set up authentication with email/password and Google OAuth
3. Create a `notes` table with the following schema:
   ```sql
   CREATE TABLE notes (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     content TEXT NOT NULL,
     color TEXT NOT NULL CHECK (color IN ('yellow', 'green', 'blue', 'purple', 'pink')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Option 2: Custom Backend
1. Set up a Node.js backend with your preferred framework
2. Implement the following endpoints:
   - `POST /auth/signup` - User registration
   - `POST /auth/login` - User login
   - `POST /auth/verify-otp` - Email verification
   - `GET /notes` - Get user notes
   - `POST /notes` - Create note
   - `PUT /notes/:id` - Update note
   - `DELETE /notes/:id` - Delete note

## Mobile Support

The application is fully responsive and includes:
- **Touch-friendly interface** with appropriate tap targets
- **Mobile navigation** with collapsible search
- **Responsive grid** that adapts to screen size
- **Optimized forms** for mobile input
- **Swipe gestures** for note actions

## Security Features

- **Input validation** on all forms
- **XSS protection** with proper data sanitization
- **CSRF protection** (when backend is connected)
- **JWT token management** with automatic refresh
- **Secure password requirements** with strength validation

## Performance Optimizations

- **Lazy loading** of components
- **Debounced search** to reduce API calls
- **Optimistic updates** for better UX
- **Efficient re-renders** with React.memo and useMemo
- **Asset optimization** with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Option 1: Lovable Deployment
1. Click the "Publish" button in Lovable
2. Your app will be deployed to `https://your-project-id.lovableproject.com`

### Option 2: Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure your hosting for SPA routing

### Recommended Hosting Providers
- **Vercel** - Automatic deployments from Git
- **Netlify** - Static site hosting with serverless functions
- **Firebase Hosting** - Google's hosting solution
- **AWS S3 + CloudFront** - Scalable static hosting

## Environment Variables

When connecting to a backend, you may need these environment variables:

```env
VITE_API_URL=your-api-url
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation at [docs.lovable.dev](https://docs.lovable.dev)
- Join the Lovable community Discord

---

Built with ❤️ using [Lovable](https://lovable.dev)