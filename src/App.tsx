import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase-config';

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign-in success:', result.user);
    } catch (error: unknown) {
      // ✅ Use unknown instead of any
      if (error instanceof Error) {
        console.error('Google sign-in failed:', error.message);
      }
    }
  };

  const handleGitHub = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email'); // Ensure email access
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout Failed:', error);
    }
  };

  if (user) {
    const email = user.email || user.providerData[0]?.email || 'No email found';
    return (
      <div className="welcome-page">
        <h1>Welcome, {email}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="card">
        <button onClick={handleGoogle}>Sign in with Google</button>
        <button onClick={handleGitHub}>Sign in with GitHub</button>
      </div>
    </>
  );
}

export default App;
