import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { OTPVerification } from '@/components/auth/OTPVerification';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

type AuthView = 'login' | 'signup' | 'otp' | 'forgot-password' | 'reset-sent';

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

  const handleResetSent = (email: string) => {
    setPendingEmail(email);
    setCurrentView('reset-sent');
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
    
    case 'forgot-password':
      return (
        <ForgotPasswordForm
          onBackToLogin={() => setCurrentView('login')}
          onResetSent={handleResetSent}
        />
      );
    
    case 'reset-sent':
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="max-w-md w-full mx-4 p-8 bg-card rounded-2xl shadow-xl border">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent password reset instructions to {pendingEmail}
              </p>
              <button
                onClick={() => setCurrentView('login')}
                className="text-primary hover:underline"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <LoginForm
          onSignupClick={() => setCurrentView('signup')}
          onForgotPasswordClick={() => setCurrentView('forgot-password')}
          onLoginSuccess={onAuthSuccess}
        />
      );
  }
};