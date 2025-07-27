import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { OTPVerification } from '@/components/auth/OTPVerification';

type AuthView = 'login' | 'signup' | 'otp';

interface AuthProps {
  onAuthSuccess: (user: any) => void;
}

export const Auth = ({ onAuthSuccess }: AuthProps) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [pendingEmail, setPendingEmail] = useState('');

  const handleSignupSuccess = (email: string) => {
    setPendingEmail(email);
    setCurrentView('otp');
  };

  const handleBackToSignup = () => {
    setCurrentView('signup');
    setPendingEmail('');
  };

  switch (currentView) {
    case 'signup':
      return (
        <SignupForm
          onLoginClick={() => setCurrentView('login')}
          onSignupSuccess={handleSignupSuccess}
        />
      );
    
    case 'otp':
      return (
        <OTPVerification
          email={pendingEmail}
          onVerificationSuccess={onAuthSuccess}
          onBackToSignup={handleBackToSignup}
        />
      );
    
    default:
      return (
        <LoginForm
          onSignupClick={() => setCurrentView('signup')}
          onForgotPasswordClick={() => {
            // Handle forgot password
            console.log('Forgot password clicked');
          }}
          onLoginSuccess={onAuthSuccess}
        />
      );
  }
};