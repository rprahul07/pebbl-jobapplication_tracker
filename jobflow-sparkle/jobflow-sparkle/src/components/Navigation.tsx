import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Briefcase, User, Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface NavigationProps {
  onSearch: (query: string) => void;
}

export const Navigation = ({ onSearch }: NavigationProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<{name: string; role?: string} | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <nav className="bg-gradient-hero shadow-elegant border-b border-white/10 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-white">
                JobFlow
              </h1>
              <p className="text-xs text-white/80">Find Your Dream Job</p>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search jobs, companies, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 transition-all duration-300"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            </form>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/explore">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                Browse Jobs
              </Button>
            </Link>
            <Link to="/post-job">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                For Employers
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 hover:text-white transition-all duration-300"
                >
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};