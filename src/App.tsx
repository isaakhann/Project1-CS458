import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { GithubAuthProvider } from 'firebase/auth';

import { auth } from '../firebase/firebase-config';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };
  const handleGitHub = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email'); // Ensure you get the email
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('GitHub Login Failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
