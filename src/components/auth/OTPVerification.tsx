import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuthLayout } from './AuthLayout';
import { useToast } from '@/hooks/use-toast';

interface OTPVerificationProps {
  email: string;
  onVerificationSuccess: (user: any) => void;
  onBackToSignup: () => void;
}

export const OTPVerification = ({ email, onVerificationSuccess, onBackToSignup }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit, i) => i >= pastedData.length);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock verification success
      if (otpString === '123456') {
        const userData = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: null,
        };
        
        toast({
          title: "Email verified successfully!",
          description: "Welcome to ScribeSnap",
        });
        
        onVerificationSuccess(userData);
      } else {
        toast({
          title: "Invalid OTP",
          description: "The code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API call - replace with actual resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "OTP sent successfully",
        description: "A new verification code has been sent to your email",
      });
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Verify Your Email" 
      subtitle={`We've sent a 6-digit code to ${email}`}
    >
      <form onSubmit={handleVerify} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="\d"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-14 w-12 text-center text-xl font-semibold border-2 border-input rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          
          {canResend ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-primary hover:text-primary/80"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>
          ) : (
            <p className="text-sm text-muted-foreground">
              Resend code in {countdown}s
            </p>
          )}
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSignup}
            className="text-sm text-primary hover:underline"
          >
            ← Back to signup
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};