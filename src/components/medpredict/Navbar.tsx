import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Activity, User } from "lucide-react";
import { getCurrentUser, onAuthStateChanged, firebaseSignOut } from "@/firebase";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

const navItems = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Features", href: "/features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Benefits", href: "/benefits" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<GoogleUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check for stored user on mount, but not on login/signup pages
  useEffect(() => {
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      // Check Firebase auth state first
      const unsubscribe = onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          // User is authenticated with Firebase
          setUser({
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            picture: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName || firebaseUser.email}&background=14b8a6&color=fff`
          });
        } else {
          // Check localStorage as fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser(null);
          }
        }
      });

      return () => unsubscribe();
    } else {
      // Clear user state when on login/signup pages
      setUser(null);
    }
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await firebaseSignOut();
      // Clear local storage
      localStorage.removeItem('user');
      // Clear local state
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear local state even if Firebase sign-out fails
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-border shadow-sm-med"
          : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
              <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-teal opacity-0 group-hover:opacity-30 blur-md transition-opacity" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-navy">
            Med<span className="gradient-text">Predict</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-section/20">
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm font-medium text-navy">{user.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-teal text-white shadow-glow-teal hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-navy p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-border px-6 py-4 shadow-md-med">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`block py-3 text-sm font-medium border-b border-border last:border-0 transition-colors ${
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="mt-4 block text-center px-5 py-3 rounded-xl text-sm font-semibold bg-gradient-teal text-white"
          >
            Get Started Free
          </Link>
        </div>
      )}
    </nav>
  );
}
