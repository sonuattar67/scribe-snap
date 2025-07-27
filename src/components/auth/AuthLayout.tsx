import { ReactNode } from 'react';
import scribeSnapLogo from '@/assets/scribe-snap-logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and branding */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={scribeSnapLogo}
              alt="ScribeSnap"
              className="h-16 w-16 rounded-2xl shadow-medium"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">ScribeSnap</h1>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Auth form */}
        <div className="bg-card rounded-2xl p-8 shadow-medium border border-border">
          {children}
        </div>
      </div>
    </div>
  );
};