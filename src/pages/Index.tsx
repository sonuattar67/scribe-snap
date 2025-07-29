import { useState, useEffect } from 'react';
import { Auth } from './Auth';
import { Dashboard } from './Dashboard';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || null,
          };
          
          setUser(userData);
          localStorage.setItem('scribeSnapUser', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('scribeSnapUser');
        }
        setLoading(false);
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || null,
          };
          
          setUser(userData);
          localStorage.setItem('scribeSnapUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('scribeSnapUser', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('scribeSnapUser');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
};

export default Index;
