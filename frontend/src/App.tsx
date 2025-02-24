import { useState, useEffect } from 'react';
import './App.css';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { auth } from './firebase-config';
//
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between sign-in and sign-up
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Handle Email & Password Authentication
  const handleEmailAuth = async () => {
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        console.log('User registered successfully');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error('Authentication failed:', error.message);
      }
    }
  };

  // Google Authentication
  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in success:', result.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Google sign-in failed:', error.message);
      }
    }
  };

  // GitHub Authentication
  const handleGitHub = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    try {
      console.log('Opening GitHub sign-in popup...');
      const result = await signInWithPopup(auth, provider);
      console.log('GitHub sign-in success:', result.user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('GitHub sign-in failed:', error.message);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout Failed:', error);
    }
  };

  // If user is logged in, show welcome screen
  if (user) {
    return (
      <div className="welcome-page">
        <h1>Welcome, {user.email || 'User'}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{isRegistering ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p className="error">{error}</p>}

      {/* Email/Password Authentication */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEmailAuth}>
        {isRegistering ? 'Sign Up' : 'Sign In'}
      </button>

      {/* Toggle between Sign In and Sign Up */}
      <p>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Sign In' : 'Sign Up'}
        </button>
      </p>

      {/* Social Authentication Buttons */}
      <button className="google-btn" onClick={handleGoogle}>
        Sign in with Google
      </button>
      <button className="github-btn" onClick={handleGitHub}>
        Sign in with GitHub
      </button>
    </div>
  );
}

export default App;
