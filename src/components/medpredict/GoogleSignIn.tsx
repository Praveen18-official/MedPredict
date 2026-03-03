import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User } from "lucide-react";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export default function GoogleSignIn() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // Initialize Google Sign-In
      const google = (window as any).google;
      
      if (!google) {
        throw new Error('Google Sign-In library not loaded');
      }

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: (tokenResponse: any) => {
          if (tokenResponse.error) {
            setError('Failed to authenticate with Google');
            setLoading(false);
            return;
          }

          // Get user info
          fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`)
            .then(response => response.json())
            .then(userData => {
              setUser({
                email: userData.email,
                name: userData.name,
                picture: userData.picture
              });
              setLoading(false);
            })
            .catch(err => {
              setError('Failed to get user information');
              setLoading(false);
            });
        }
      });

      tokenClient.requestAccessToken();
    } catch (err) {
      setError('Google Sign-In failed. Please try again.');
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    setError(null);
  };

  return (
    <Card className="border-primary/15 shadow-lg-med max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-navy">Sign In</CardTitle>
        <CardDescription>
          Sign in with your Google account to access MedPredict
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-section/20">
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-navy">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              onClick={handleGoogleSignIn} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Sign in with Google
                </>
              )}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
