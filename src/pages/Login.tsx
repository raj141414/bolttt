
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if already logged in
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  
  if (isLoggedIn) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real application, you would validate against a server
    // For this example, we'll use hardcoded credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'xerox123') {
        localStorage.setItem('adminLoggedIn', 'true');
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <PageLayout>
      <div className="py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Lock className="h-6 w-6" /> Admin Login
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-xerox-600 hover:bg-xerox-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
